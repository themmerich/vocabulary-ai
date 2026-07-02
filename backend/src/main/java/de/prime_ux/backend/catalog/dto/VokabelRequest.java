package de.prime_ux.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import java.util.List;

/** Create/update payload for a single Vokabel. */
public record VokabelRequest(
        @NotBlank @Size(max = 200) String foreignTerm,
        @NotEmpty List<@NotBlank @Size(max = 200) String> meanings) {}
