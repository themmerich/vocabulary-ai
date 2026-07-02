package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.GrammatikregelResponse;
import de.prime_ux.backend.catalog.dto.LektionDetailResponse;
import de.prime_ux.backend.catalog.dto.LektionRequest;
import de.prime_ux.backend.catalog.dto.LektionResponse;
import de.prime_ux.backend.catalog.dto.VokabelResponse;
import de.prime_ux.backend.web.ResourceNotFoundException;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LektionService {

    private final LektionRepository lektionRepository;
    private final LehrwerkRepository lehrwerkRepository;
    private final VokabelRepository vokabelRepository;
    private final GrammatikregelRepository grammatikregelRepository;

    @Transactional(readOnly = true)
    public List<LektionResponse> listByLehrwerk(UUID lehrwerkId) {
        requireLehrwerk(lehrwerkId);
        return lektionRepository.findByLehrwerkIdOrderByOrderIndexAsc(lehrwerkId).stream()
                .map(LektionResponse::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public LektionDetailResponse getDetail(UUID id) {
        Lektion lektion = require(id);
        List<VokabelResponse> vokabeln = vokabelRepository.findByLektionIdOrderByOrderIndexAsc(id).stream()
                .map(VokabelResponse::from)
                .toList();
        List<GrammatikregelResponse> grammatikregeln =
                grammatikregelRepository.findByLektionIdOrderByOrderIndexAsc(id).stream()
                        .map(GrammatikregelResponse::from)
                        .toList();
        return LektionDetailResponse.from(lektion, vokabeln, grammatikregeln);
    }

    @Transactional
    public LektionResponse create(UUID lehrwerkId, LektionRequest request) {
        Lehrwerk lehrwerk = requireLehrwerk(lehrwerkId);
        Lektion lektion = Lektion.builder()
                .lehrwerk(lehrwerk)
                .title(request.title().trim())
                .orderIndex(lektionRepository.nextOrderIndex(lehrwerkId))
                .build();
        return LektionResponse.from(lektionRepository.save(lektion));
    }

    @Transactional
    public LektionResponse update(UUID id, LektionRequest request) {
        Lektion lektion = require(id);
        lektion.setTitle(request.title().trim());
        return LektionResponse.from(lektion);
    }

    @Transactional
    public void delete(UUID id) {
        if (!lektionRepository.existsById(id)) {
            throw notFound(id);
        }
        lektionRepository.deleteById(id);
    }

    private Lehrwerk requireLehrwerk(UUID lehrwerkId) {
        return lehrwerkRepository
                .findById(lehrwerkId)
                .orElseThrow(() -> ResourceNotFoundException.of("Lehrwerk", lehrwerkId));
    }

    private Lektion require(UUID id) {
        return lektionRepository.findById(id).orElseThrow(() -> notFound(id));
    }

    private static ResourceNotFoundException notFound(UUID id) {
        return ResourceNotFoundException.of("Lektion", id);
    }
}
