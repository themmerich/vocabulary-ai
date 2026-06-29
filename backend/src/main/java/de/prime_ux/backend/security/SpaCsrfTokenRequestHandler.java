package de.prime_ux.backend.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.util.function.Supplier;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.security.web.csrf.CsrfTokenRequestAttributeHandler;
import org.springframework.security.web.csrf.CsrfTokenRequestHandler;
import org.springframework.security.web.csrf.XorCsrfTokenRequestAttributeHandler;
import org.springframework.util.StringUtils;

/**
 * CSRF token handler for single-page apps that read the {@code XSRF-TOKEN} cookie
 * and echo it back in a request header (as Angular's {@code HttpClient} does).
 *
 * <p>Tokens are rendered with BREACH protection (XOR-encoded) but resolved as the
 * raw cookie value when supplied via header. Mirrors the pattern from the Spring
 * Security reference documentation.
 */
final class SpaCsrfTokenRequestHandler implements CsrfTokenRequestHandler {

    private final CsrfTokenRequestHandler plain = new CsrfTokenRequestAttributeHandler();
    private final CsrfTokenRequestHandler xor = new XorCsrfTokenRequestAttributeHandler();

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, Supplier<CsrfToken> csrfToken) {
        // Render the token as an XOR-encoded value to protect against BREACH attacks.
        this.xor.handle(request, response, csrfToken);
        // Force the token to load so the deferred value is available to CsrfCookieFilter.
        csrfToken.get();
    }

    @Override
    public String resolveCsrfTokenValue(HttpServletRequest request, CsrfToken csrfToken) {
        // A header value is the raw token from the cookie; a parameter value is XOR-encoded.
        String headerValue = request.getHeader(csrfToken.getHeaderName());
        return (StringUtils.hasText(headerValue) ? this.plain : this.xor)
                .resolveCsrfTokenValue(request, csrfToken);
    }
}
