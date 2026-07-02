package de.prime_ux.backend.catalog.dto;

import de.prime_ux.backend.catalog.Lektion;
import java.util.UUID;

/** Summary view of a Lektion (without its vocabulary/grammar payload). */
public record LektionResponse(UUID id, UUID lehrwerkId, String title, int orderIndex) {

    public static LektionResponse from(Lektion lektion) {
        return new LektionResponse(
                lektion.getId(), lektion.getLehrwerk().getId(), lektion.getTitle(), lektion.getOrderIndex());
    }
}
