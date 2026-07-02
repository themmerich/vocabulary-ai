package de.prime_ux.backend.catalog.dto;

/** Result of a bulk import: how many entries were created and how many lines were skipped as malformed. */
public record ImportResponse(int imported, int skipped) {}
