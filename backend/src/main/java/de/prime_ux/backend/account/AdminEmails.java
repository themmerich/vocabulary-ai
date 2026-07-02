package de.prime_ux.backend.account;

import de.prime_ux.backend.auth.AuthService;
import java.util.Arrays;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * The configured set of admin emails (from {@code app.admin-emails}), normalized
 * once. Both registration ({@code AuthService}) and the startup pass
 * ({@code AdminBootstrap}) consult this so a configured email always becomes an
 * admin — immediately when the account is created, or on the next startup for
 * accounts that already existed.
 */
@Component
public class AdminEmails {

    private final Set<String> emails;

    public AdminEmails(@Value("${app.admin-emails:}") String rawEmails) {
        this.emails = Arrays.stream(rawEmails.split(","))
                .map(AuthService::normalizeEmail)
                .filter(email -> !email.isEmpty())
                .collect(Collectors.toUnmodifiableSet());
    }

    /** Whether the given already-normalized email is configured as an admin. */
    public boolean contains(String normalizedEmail) {
        return emails.contains(normalizedEmail);
    }

    /** All configured admin emails, normalized. */
    public Set<String> all() {
        return emails;
    }
}
