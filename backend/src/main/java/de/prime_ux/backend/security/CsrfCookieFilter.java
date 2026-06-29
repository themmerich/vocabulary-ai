package de.prime_ux.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Ensures the deferred {@link CsrfToken} is rendered on every request so the
 * {@code XSRF-TOKEN} cookie is sent to the client (including on the first call,
 * before any state-changing request is made).
 */
final class CsrfCookieFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        CsrfToken csrfToken = (CsrfToken) request.getAttribute(CsrfToken.class.getName());
        if (csrfToken != null) {
            // Reading the token triggers the repository to persist it (sets the cookie).
            csrfToken.getToken();
        }
        filterChain.doFilter(request, response);
    }
}
