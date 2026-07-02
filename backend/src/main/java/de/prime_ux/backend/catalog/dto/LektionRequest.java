package de.prime_ux.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Create/update payload for a Lektion. */
public record LektionRequest(@NotBlank @Size(max = 200) String title) {}
