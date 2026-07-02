package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.GrammatikregelRequest;
import de.prime_ux.backend.catalog.dto.GrammatikregelResponse;
import de.prime_ux.backend.web.ResourceNotFoundException;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GrammatikregelService {

    private final GrammatikregelRepository grammatikregelRepository;
    private final LektionRepository lektionRepository;

    @Transactional
    public GrammatikregelResponse create(UUID lektionId, GrammatikregelRequest request) {
        Lektion lektion = requireLektion(lektionId);
        Grammatikregel regel = Grammatikregel.builder()
                .lektion(lektion)
                .title(request.title().trim())
                .content(request.content().trim())
                .orderIndex(grammatikregelRepository.nextOrderIndex(lektionId))
                .build();
        return GrammatikregelResponse.from(grammatikregelRepository.save(regel));
    }

    @Transactional
    public GrammatikregelResponse update(UUID id, GrammatikregelRequest request) {
        Grammatikregel regel = require(id);
        regel.setTitle(request.title().trim());
        regel.setContent(request.content().trim());
        return GrammatikregelResponse.from(regel);
    }

    @Transactional
    public void delete(UUID id) {
        if (!grammatikregelRepository.existsById(id)) {
            throw notFound(id);
        }
        grammatikregelRepository.deleteById(id);
    }

    private Lektion requireLektion(UUID lektionId) {
        return lektionRepository
                .findById(lektionId)
                .orElseThrow(() -> ResourceNotFoundException.of("Lektion", lektionId));
    }

    private Grammatikregel require(UUID id) {
        return grammatikregelRepository.findById(id).orElseThrow(() -> notFound(id));
    }

    private static ResourceNotFoundException notFound(UUID id) {
        return ResourceNotFoundException.of("Grammatikregel", id);
    }
}
