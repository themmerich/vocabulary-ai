# backend

Spring Boot REST API for vocabulary-ai.

## Stack

- **Java 25** (Gradle toolchain — see `build.gradle.kts`)
- **Spring Boot 4.1** — `spring-boot-starter-webmvc`, `-data-jpa`, `-flyway`
- **PostgreSQL** (runtime), schema versioned with **Flyway**
- **Lombok** (compile-time; `@Getter`, `@Builder`, etc.)
- **Gradle Kotlin DSL** with the wrapper (`./gradlew`)
- Base package: `de.prime_ux.backend`

## Commands

Run from the `backend/` directory. On Windows use `gradlew.bat`.

```bash
./gradlew bootRun     # start the app
./gradlew build       # compile + run tests
./gradlew test        # tests only
```

## Conventions

- **Database schema is owned by Flyway.** Never change tables via JPA DDL
  auto-generation; add a versioned migration in
  `src/main/resources/db/migration/` (e.g. `V1__create_words.sql`). Migrations
  are immutable once committed — fix forward with a new version.
- Keep `application.properties` (or profile variants) the single source of
  config. The PostgreSQL connection (`spring.datasource.*`) and Flyway settings
  belong here; do not hardcode credentials.
- Use **Lombok** to keep entities/DTOs free of boilerplate, but avoid `@Data` on
  JPA entities (its `equals`/`hashCode`/`toString` clash with lazy relations).
- Standard layering: `controller` → `service` → `repository`. Expose DTOs from
  controllers, never JPA entities directly.
- Tests use JUnit 5 (`useJUnitPlatform()`) with the matching Spring Boot test
  starters; keep test classes under `src/test/java` mirroring the main package.
