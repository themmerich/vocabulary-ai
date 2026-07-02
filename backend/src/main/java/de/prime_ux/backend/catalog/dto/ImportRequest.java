package de.prime_ux.backend.catalog.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * Bulk vocabulary import. One entry per line in the form
 * {@code foreign ; meaning | meaning}; blank lines are ignored.
 */
public record ImportRequest(@NotBlank String text) {}
