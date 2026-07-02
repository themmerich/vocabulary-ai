package de.prime_ux.backend;

import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.testcontainers.containers.PostgreSQLContainer;

/**
 * Base class for integration tests. Boots the full application against a single
 * PostgreSQL container so the real Flyway migrations run.
 *
 * <p>The container follows the Testcontainers singleton pattern: it is started
 * once in a static initializer and never stopped by JUnit. This keeps it alive
 * for the whole test JVM, which matters because Spring caches and shares the
 * application context across integration test classes — a per-class
 * {@code @Container} would be stopped after the first class and leave later
 * classes pointing at a dead container.
 */
@SpringBootTest
public abstract class AbstractIntegrationTest {

    @ServiceConnection
    static final PostgreSQLContainer<?> POSTGRES = new PostgreSQLContainer<>("postgres:17-alpine");

    static {
        POSTGRES.start();
    }
}
