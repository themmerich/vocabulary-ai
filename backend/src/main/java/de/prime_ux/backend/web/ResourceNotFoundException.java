package de.prime_ux.backend.web;

/** Thrown when a requested entity does not exist; mapped to HTTP 404. */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    /** Builds a "&lt;entity&gt; &lt;id&gt; not found" exception for the standard lookup-or-404 case. */
    public static ResourceNotFoundException of(String entity, Object id) {
        return new ResourceNotFoundException("%s %s not found".formatted(entity, id));
    }
}
