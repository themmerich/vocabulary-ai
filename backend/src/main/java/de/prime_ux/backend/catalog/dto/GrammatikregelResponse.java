package de.prime_ux.backend.catalog.dto;

import de.prime_ux.backend.catalog.Grammatikregel;
import java.util.UUID;

/** View of a single Grammatikregel. */
public record GrammatikregelResponse(UUID id, String title, String content, int orderIndex) {

    public static GrammatikregelResponse from(Grammatikregel regel) {
        return new GrammatikregelResponse(
                regel.getId(), regel.getTitle(), regel.getContent(), regel.getOrderIndex());
    }
}
