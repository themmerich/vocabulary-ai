package de.prime_ux.backend.auth.dto;

import de.prime_ux.backend.account.Account;
import java.util.UUID;

/** Public view of an authenticated account. */
public record UserResponse(UUID id, String email, String role) {

    public static UserResponse from(Account account) {
        return new UserResponse(account.getId(), account.getEmail(), account.getRole().name());
    }
}
