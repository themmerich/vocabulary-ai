package de.prime_ux.backend.auth.dto;

import de.prime_ux.backend.account.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Registration payload. {@code role} is optional and defaults to {@code USER}.
 *
 * <p>DEV CONVENIENCE: letting the client pick {@code ADMIN} lets anyone
 * self-register as an admin. Remove the field (or ignore it) before any real
 * deployment; the {@code app.admin-emails} promotion is the safe path.
 */
public record RegisterRequest(
        @NotBlank @Email @Size(max = 320) String email,
        @NotBlank @Size(min = 8, max = 100) String password,
        Role role) {}
