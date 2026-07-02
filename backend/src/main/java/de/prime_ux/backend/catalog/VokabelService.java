package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.ImportResponse;
import de.prime_ux.backend.catalog.dto.VokabelRequest;
import de.prime_ux.backend.catalog.dto.VokabelResponse;
import de.prime_ux.backend.web.ResourceNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class VokabelService {

    private final VokabelRepository vokabelRepository;
    private final LektionRepository lektionRepository;

    @Transactional
    public VokabelResponse create(UUID lektionId, VokabelRequest request) {
        Lektion lektion = requireLektion(lektionId);
        Vokabel vokabel = Vokabel.builder()
                .lektion(lektion)
                .foreignTerm(request.foreignTerm().trim())
                .meanings(cleanMeanings(request.meanings()))
                .orderIndex(vokabelRepository.nextOrderIndex(lektionId))
                .build();
        return VokabelResponse.from(vokabelRepository.save(vokabel));
    }

    @Transactional
    public ImportResponse importBulk(UUID lektionId, String text) {
        Lektion lektion = requireLektion(lektionId);
        VokabelImportParser.Result parsed = VokabelImportParser.parse(text);
        int nextIndex = vokabelRepository.nextOrderIndex(lektionId);
        List<Vokabel> toCreate = new ArrayList<>();
        for (VokabelImportParser.ParsedEntry entry : parsed.entries()) {
            toCreate.add(Vokabel.builder()
                    .lektion(lektion)
                    .foreignTerm(entry.foreignTerm())
                    .meanings(entry.meanings())
                    .orderIndex(nextIndex++)
                    .build());
        }
        vokabelRepository.saveAll(toCreate);
        return new ImportResponse(toCreate.size(), parsed.skippedLines().size());
    }

    @Transactional
    public VokabelResponse update(UUID id, VokabelRequest request) {
        Vokabel vokabel = require(id);
        vokabel.setForeignTerm(request.foreignTerm().trim());
        vokabel.setMeanings(cleanMeanings(request.meanings()));
        return VokabelResponse.from(vokabel);
    }

    @Transactional
    public void delete(UUID id) {
        if (!vokabelRepository.existsById(id)) {
            throw notFound(id);
        }
        vokabelRepository.deleteById(id);
    }

    /** Trims each meaning and drops the empties left behind (mutable, for Hibernate to manage). */
    private static List<String> cleanMeanings(List<String> meanings) {
        return meanings.stream()
                .map(String::trim)
                .filter(meaning -> !meaning.isEmpty())
                .collect(java.util.stream.Collectors.toCollection(ArrayList::new));
    }

    private Lektion requireLektion(UUID lektionId) {
        return lektionRepository
                .findById(lektionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Lektion", lektionId));
    }

    private Vokabel require(UUID id) {
        return vokabelRepository.findById(id).orElseThrow(() -> notFound(id));
    }

    private static ResourceNotFoundException notFound(UUID id) {
        return ResourceNotFoundException.of("Vokabel", id);
    }
}
