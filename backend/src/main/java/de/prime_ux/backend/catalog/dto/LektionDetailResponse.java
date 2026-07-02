package de.prime_ux.backend.catalog.dto;

import de.prime_ux.backend.catalog.Lektion;
import java.util.List;
import java.util.UUID;

/** Full view of a Lektion including its vocabulary and grammar rules. */
public record LektionDetailResponse(
        UUID id,
        UUID lehrwerkId,
        String title,
        int orderIndex,
        List<VokabelResponse> vokabeln,
        List<GrammatikregelResponse> grammatikregeln) {

    public static LektionDetailResponse from(
            Lektion lektion, List<VokabelResponse> vokabeln, List<GrammatikregelResponse> grammatikregeln) {
        return new LektionDetailResponse(
                lektion.getId(),
                lektion.getLehrwerk().getId(),
                lektion.getTitle(),
                lektion.getOrderIndex(),
                vokabeln,
                grammatikregeln);
    }
}
