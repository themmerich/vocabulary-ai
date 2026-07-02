package de.prime_ux.backend.catalog;

import java.util.UUID;

/** How many Lektionen a Lehrwerk has; produced by a single grouped count query. */
record LehrwerkLektionCount(UUID lehrwerkId, Long count) {}
