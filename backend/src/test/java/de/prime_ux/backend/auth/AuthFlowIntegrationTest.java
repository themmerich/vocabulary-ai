package de.prime_ux.backend.auth;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import de.prime_ux.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;

@AutoConfigureMockMvc
class AuthFlowIntegrationTest extends AbstractIntegrationTest {

    @Autowired
    MockMvc mockMvc;

    private static String body(String email, String password) {
        return "{\"email\":\"%s\",\"password\":\"%s\"}".formatted(email, password);
    }

    @Test
    void registerSignsInAndExposesCurrentUser() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/auth/register")
                        .session(session)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("Alice@Example.com", "password123")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.email").value("alice@example.com"))
                .andExpect(jsonPath("$.role").value("USER"))
                .andExpect(jsonPath("$.id").exists());

        mockMvc.perform(get("/api/auth/me").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alice@example.com"));
    }

    @Test
    void meIsUnauthorizedWithoutSession() throws Exception {
        mockMvc.perform(get("/api/auth/me")).andExpect(status().isUnauthorized());
    }

    @Test
    void loginWithWrongPasswordIsUnauthorized() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("bob@example.com", "password123")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/login")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("bob@example.com", "wrong-password")))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void loginThenLogoutClearsAccess() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("carol@example.com", "password123")))
                .andExpect(status().isCreated());

        MockHttpSession session = new MockHttpSession();
        mockMvc.perform(post("/api/auth/login")
                        .session(session)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("carol@example.com", "password123")))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/auth/logout").session(session).with(csrf()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/auth/me").session(session)).andExpect(status().isUnauthorized());
    }

    @Test
    void duplicateRegistrationIsConflict() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("dave@example.com", "password123")))
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("dave@example.com", "password123")))
                .andExpect(status().isConflict());
    }

    @Test
    void registrationRejectsShortPassword() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("erin@example.com", "short")))
                .andExpect(status().isBadRequest());
    }

    @Test
    void registerAsAdminGrantsAdminAccessImmediately() throws Exception {
        MockHttpSession session = new MockHttpSession();

        mockMvc.perform(post("/api/auth/register")
                        .session(session)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"root@example.com\",\"password\":\"password123\",\"role\":\"ADMIN\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("ADMIN"));

        // The new session already carries ADMIN authority, so the admin API is reachable.
        mockMvc.perform(get("/api/admin/lehrwerke").session(session)).andExpect(status().isOk());
    }

    @Test
    void registrationDefaultsToUserRole() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body("frank@example.com", "password123")))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.role").value("USER"));
    }
}
