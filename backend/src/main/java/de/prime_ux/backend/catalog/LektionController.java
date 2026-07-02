package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.LektionDetailResponse;
import de.prime_ux.backend.catalog.dto.LektionRequest;
import de.prime_ux.backend.catalog.dto.LektionResponse;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin CRUD for Lektionen. Nested under a Lehrwerk for listing/creation. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class LektionController {

    private final LektionService lektionService;

    @GetMapping("/lehrwerke/{lehrwerkId}/lektionen")
    public List<LektionResponse> listByLehrwerk(@PathVariable UUID lehrwerkId) {
        return lektionService.listByLehrwerk(lehrwerkId);
    }

    @PostMapping("/lehrwerke/{lehrwerkId}/lektionen")
    @ResponseStatus(HttpStatus.CREATED)
    public LektionResponse create(@PathVariable UUID lehrwerkId, @Valid @RequestBody LektionRequest request) {
        return lektionService.create(lehrwerkId, request);
    }

    @GetMapping("/lektionen/{id}")
    public LektionDetailResponse get(@PathVariable UUID id) {
        return lektionService.getDetail(id);
    }

    @PutMapping("/lektionen/{id}")
    public LektionResponse update(@PathVariable UUID id, @Valid @RequestBody LektionRequest request) {
        return lektionService.update(id, request);
    }

    @DeleteMapping("/lektionen/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        lektionService.delete(id);
    }
}
