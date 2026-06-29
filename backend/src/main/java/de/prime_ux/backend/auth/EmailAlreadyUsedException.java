package de.prime_ux.backend.auth;

/** Thrown when registration is attempted with an email that already exists. */
public class EmailAlreadyUsedException extends RuntimeException {

    public EmailAlreadyUsedException(String email) {
        super("Email already in use: " + email);
    }
}
