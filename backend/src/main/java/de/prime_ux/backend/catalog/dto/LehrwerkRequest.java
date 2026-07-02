package de.prime_ux.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Create/update payload for a Lehrwerk. */
public record LehrwerkRequest(
        @NotBlank @Size(max = 200) String title, @NotBlank @Size(max = 100) String language) {}
