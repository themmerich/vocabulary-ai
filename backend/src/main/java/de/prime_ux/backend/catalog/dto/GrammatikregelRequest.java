package de.prime_ux.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Create/update payload for a Grammatikregel. */
public record GrammatikregelRequest(
        @NotBlank @Size(max = 200) String title, @NotBlank String content) {}
