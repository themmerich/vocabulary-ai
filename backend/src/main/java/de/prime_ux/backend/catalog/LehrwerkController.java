package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.LehrwerkRequest;
import de.prime_ux.backend.catalog.dto.LehrwerkResponse;
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

/** Admin CRUD for Lehrwerke. Secured to {@code ADMIN} via the security filter chain. */
@RestController
@RequestMapping("/api/admin/lehrwerke")
@RequiredArgsConstructor
public class LehrwerkController {

    private final LehrwerkService lehrwerkService;

    @GetMapping
    public List<LehrwerkResponse> list() {
        return lehrwerkService.list();
    }

    @GetMapping("/{id}")
    public LehrwerkResponse get(@PathVariable UUID id) {
        return lehrwerkService.get(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public LehrwerkResponse create(@Valid @RequestBody LehrwerkRequest request) {
        return lehrwerkService.create(request);
    }

    @PutMapping("/{id}")
    public LehrwerkResponse update(@PathVariable UUID id, @Valid @RequestBody LehrwerkRequest request) {
        return lehrwerkService.update(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        lehrwerkService.delete(id);
    }
}
