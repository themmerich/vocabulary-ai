package de.prime_ux.backend.account;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

/**
 * Promotes already-registered accounts to {@code ADMIN} on startup, for emails
 * configured in {@code app.admin-emails}. Accounts registered later are promoted
 * directly by {@code AuthService#register}, so this pass only covers accounts
 * that existed before their email was configured. A matching account is promoted
 * only if it is not already an admin; missing accounts are logged and ignored.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class AdminBootstrap implements ApplicationRunner {

    private final AccountRepository accountRepository;
    private final AdminEmails adminEmails;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        for (String email : adminEmails.all()) {
            accountRepository.findByEmail(email).ifPresentOrElse(this::promote, () -> log.info(
                    "Admin bootstrap: no account for '{}' yet; it will be promoted at registration", email));
        }
    }

    private void promote(Account account) {
        if (account.getRole() == Role.ADMIN) {
            return;
        }
        account.setRole(Role.ADMIN);
        accountRepository.save(account);
        log.info("Admin bootstrap: promoted '{}' to ADMIN", account.getEmail());
    }
}
