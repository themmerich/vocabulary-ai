package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.LehrwerkRequest;
import de.prime_ux.backend.catalog.dto.LehrwerkResponse;
import de.prime_ux.backend.web.ResourceNotFoundException;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LehrwerkService {

    private final LehrwerkRepository lehrwerkRepository;
    private final LektionRepository lektionRepository;

    @Transactional(readOnly = true)
    public List<LehrwerkResponse> list() {
        Map<UUID, Long> lektionCounts = lektionRepository.countGroupedByLehrwerk().stream()
                .collect(java.util.stream.Collectors.toMap(LehrwerkLektionCount::lehrwerkId, LehrwerkLektionCount::count));
        return lehrwerkRepository.findAllByOrderByTitleAsc().stream()
                .map(lehrwerk -> LehrwerkResponse.from(lehrwerk, lektionCounts.getOrDefault(lehrwerk.getId(), 0L)))
                .toList();
    }

    @Transactional(readOnly = true)
    public LehrwerkResponse get(UUID id) {
        Lehrwerk lehrwerk = require(id);
        return LehrwerkResponse.from(lehrwerk, lektionRepository.countByLehrwerkId(id));
    }

    @Transactional
    public LehrwerkResponse create(LehrwerkRequest request) {
        Lehrwerk lehrwerk = Lehrwerk.builder()
                .title(request.title().trim())
                .language(request.language().trim())
                .build();
        return LehrwerkResponse.from(lehrwerkRepository.save(lehrwerk), 0);
    }

    @Transactional
    public LehrwerkResponse update(UUID id, LehrwerkRequest request) {
        Lehrwerk lehrwerk = require(id);
        lehrwerk.setTitle(request.title().trim());
        lehrwerk.setLanguage(request.language().trim());
        return LehrwerkResponse.from(lehrwerk, lektionRepository.countByLehrwerkId(id));
    }

    @Transactional
    public void delete(UUID id) {
        if (!lehrwerkRepository.existsById(id)) {
            throw notFound(id);
        }
        lehrwerkRepository.deleteById(id);
    }

    private Lehrwerk require(UUID id) {
        return lehrwerkRepository.findById(id).orElseThrow(() -> notFound(id));
    }

    private static ResourceNotFoundException notFound(UUID id) {
        return ResourceNotFoundException.of("Lehrwerk", id);
    }
}
