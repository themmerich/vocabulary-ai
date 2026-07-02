package de.prime_ux.backend.catalog.dto;

import de.prime_ux.backend.catalog.Lehrwerk;
import java.util.UUID;

/** List/detail view of a Lehrwerk with its lesson count. */
public record LehrwerkResponse(UUID id, String title, String language, long lektionCount) {

    public static LehrwerkResponse from(Lehrwerk lehrwerk, long lektionCount) {
        return new LehrwerkResponse(lehrwerk.getId(), lehrwerk.getTitle(), lehrwerk.getLanguage(), lektionCount);
    }
}
