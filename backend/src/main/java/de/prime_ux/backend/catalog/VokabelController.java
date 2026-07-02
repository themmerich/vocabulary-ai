package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.ImportRequest;
import de.prime_ux.backend.catalog.dto.ImportResponse;
import de.prime_ux.backend.catalog.dto.VokabelRequest;
import de.prime_ux.backend.catalog.dto.VokabelResponse;
import jakarta.validation.Valid;
import java.util.UUID;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

/** Admin CRUD + bulk import for Vokabeln, nested under a Lektion. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class VokabelController {

    private final VokabelService vokabelService;

    @PostMapping("/lektionen/{lektionId}/vokabeln")
    @ResponseStatus(HttpStatus.CREATED)
    public VokabelResponse create(@PathVariable UUID lektionId, @Valid @RequestBody VokabelRequest request) {
        return vokabelService.create(lektionId, request);
    }

    @PostMapping("/lektionen/{lektionId}/vokabeln/import")
    @ResponseStatus(HttpStatus.CREATED)
    public ImportResponse importBulk(@PathVariable UUID lektionId, @Valid @RequestBody ImportRequest request) {
        return vokabelService.importBulk(lektionId, request.text());
    }

    @PutMapping("/vokabeln/{id}")
    public VokabelResponse update(@PathVariable UUID id, @Valid @RequestBody VokabelRequest request) {
        return vokabelService.update(id, request);
    }

    @DeleteMapping("/vokabeln/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        vokabelService.delete(id);
    }
}
