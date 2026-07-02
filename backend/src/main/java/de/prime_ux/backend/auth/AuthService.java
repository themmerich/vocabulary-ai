package de.prime_ux.backend.auth;

import de.prime_ux.backend.account.Account;
import de.prime_ux.backend.account.AccountRepository;
import de.prime_ux.backend.account.AdminEmails;
import de.prime_ux.backend.account.Role;
import java.util.Locale;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final AdminEmails adminEmails;

    /**
     * Creates a new account. An email configured in {@code app.admin-emails} is
     * promoted to {@code ADMIN} immediately; otherwise the given role is used
     * (defaulting to {@code USER} when {@code null}).
     *
     * @throws EmailAlreadyUsedException if the (normalized) email is already registered
     */
    @Transactional
    public Account register(String email, String rawPassword, Role role) {
        String normalizedEmail = normalizeEmail(email);
        if (accountRepository.existsByEmail(normalizedEmail)) {
            throw new EmailAlreadyUsedException(normalizedEmail);
        }
        Role effectiveRole = adminEmails.contains(normalizedEmail) ? Role.ADMIN : (role != null ? role : Role.USER);
        Account account = Account.builder()
                .email(normalizedEmail)
                .passwordHash(passwordEncoder.encode(rawPassword))
                .role(effectiveRole)
                .build();
        return accountRepository.save(account);
    }

    public static String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
