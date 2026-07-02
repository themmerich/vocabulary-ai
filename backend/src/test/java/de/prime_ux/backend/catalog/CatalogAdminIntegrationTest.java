package de.prime_ux.backend.catalog;

import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.user;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.jayway.jsonpath.JsonPath;
import de.prime_ux.backend.AbstractIntegrationTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.RequestPostProcessor;

@AutoConfigureMockMvc
class CatalogAdminIntegrationTest extends AbstractIntegrationTest {

    private static final RequestPostProcessor ADMIN = user("admin").roles("ADMIN");
    private static final RequestPostProcessor PLAIN_USER = user("member").roles("USER");

    @Autowired
    MockMvc mockMvc;

    private String idOf(MvcResult result) throws Exception {
        return JsonPath.read(result.getResponse().getContentAsString(), "$.id");
    }

    @Test
    void unauthenticatedRequestIsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/admin/lehrwerke")).andExpect(status().isUnauthorized());
    }

    @Test
    void nonAdminIsForbidden() throws Exception {
        mockMvc.perform(get("/api/admin/lehrwerke").with(PLAIN_USER)).andExpect(status().isForbidden());
    }

    @Test
    void adminBuildsCatalogHierarchyAndImports() throws Exception {
        // Lehrwerk
        MvcResult lehrwerk = mockMvc.perform(post("/api/admin/lehrwerke")
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Green Line 1\",\"language\":\"English\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.title").value("Green Line 1"))
                .andExpect(jsonPath("$.lektionCount").value(0))
                .andReturn();
        String lehrwerkId = idOf(lehrwerk);

        // Lektion
        MvcResult lektion = mockMvc.perform(post("/api/admin/lehrwerke/%s/lektionen".formatted(lehrwerkId))
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Unit 1\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.orderIndex").value(0))
                .andReturn();
        String lektionId = idOf(lektion);

        // Single Vokabel
        mockMvc.perform(post("/api/admin/lektionen/%s/vokabeln".formatted(lektionId))
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"foreignTerm\":\"house\",\"meanings\":[\"Haus\",\"Gebäude\"]}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.meanings.length()").value(2));

        // Bulk import
        mockMvc.perform(post("/api/admin/lektionen/%s/vokabeln/import".formatted(lektionId))
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"text\":\"cat ; Katze\\ndog ; Hund\\nmalformed-line\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.imported").value(2))
                .andExpect(jsonPath("$.skipped").value(1));

        // Grammatikregel
        mockMvc.perform(post("/api/admin/lektionen/%s/grammatikregeln".formatted(lektionId))
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"Simple Present\",\"content\":\"Use -s in third person.\"}"))
                .andExpect(status().isCreated());

        // Detail reflects everything, ordered
        mockMvc.perform(get("/api/admin/lektionen/%s".formatted(lektionId)).with(ADMIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.vokabeln.length()").value(3))
                .andExpect(jsonPath("$.vokabeln[0].foreignTerm").value("house"))
                .andExpect(jsonPath("$.vokabeln[2].foreignTerm").value("dog"))
                .andExpect(jsonPath("$.grammatikregeln.length()").value(1));

        // Lehrwerk now reports its lesson
        mockMvc.perform(get("/api/admin/lehrwerke/%s".formatted(lehrwerkId)).with(ADMIN))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.lektionCount").value(1));

        // Deleting the Lehrwerk cascades to its lessons
        mockMvc.perform(delete("/api/admin/lehrwerke/%s".formatted(lehrwerkId))
                        .with(ADMIN)
                        .with(csrf()))
                .andExpect(status().isNoContent());
        mockMvc.perform(get("/api/admin/lektionen/%s".formatted(lektionId)).with(ADMIN))
                .andExpect(status().isNotFound());
    }

    @Test
    void createRejectsInvalidPayload() throws Exception {
        mockMvc.perform(post("/api/admin/lehrwerke")
                        .with(ADMIN)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"title\":\"\",\"language\":\"English\"}"))
                .andExpect(status().isBadRequest());
    }
}
