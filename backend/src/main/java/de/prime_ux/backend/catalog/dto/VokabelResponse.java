package de.prime_ux.backend.catalog.dto;

import de.prime_ux.backend.catalog.Vokabel;
import java.util.List;
import java.util.UUID;

/** View of a single Vokabel with its ordered meanings. */
public record VokabelResponse(UUID id, String foreignTerm, List<String> meanings, int orderIndex) {

    public static VokabelResponse from(Vokabel vokabel) {
        return new VokabelResponse(
                vokabel.getId(),
                vokabel.getForeignTerm(),
                List.copyOf(vokabel.getMeanings()),
                vokabel.getOrderIndex());
    }
}
