package de.prime_ux.backend.catalog;

import de.prime_ux.backend.catalog.dto.GrammatikregelRequest;
import de.prime_ux.backend.catalog.dto.GrammatikregelResponse;
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

/** Admin CRUD for Grammatikregeln, nested under a Lektion. */
@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class GrammatikregelController {

    private final GrammatikregelService grammatikregelService;

    @PostMapping("/lektionen/{lektionId}/grammatikregeln")
    @ResponseStatus(HttpStatus.CREATED)
    public GrammatikregelResponse create(
            @PathVariable UUID lektionId, @Valid @RequestBody GrammatikregelRequest request) {
        return grammatikregelService.create(lektionId, request);
    }

    @PutMapping("/grammatikregeln/{id}")
    public GrammatikregelResponse update(
            @PathVariable UUID id, @Valid @RequestBody GrammatikregelRequest request) {
        return grammatikregelService.update(id, request);
    }

    @DeleteMapping("/grammatikregeln/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        grammatikregelService.delete(id);
    }
}
