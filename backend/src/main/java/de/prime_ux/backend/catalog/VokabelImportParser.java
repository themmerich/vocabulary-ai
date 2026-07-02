package de.prime_ux.backend.catalog;

import java.util.ArrayList;
import java.util.List;

/**
 * Parses bulk-import text into vocabulary entries. Each non-blank line has the
 * form {@code foreign ; meaning | meaning}: the part before the first
 * semicolon is the foreign term, the remainder is a pipe-separated list of
 * meanings. Blank lines are ignored; lines that cannot be parsed (no semicolon,
 * empty foreign term, no meanings, or a term/meaning exceeding
 * {@link #MAX_LENGTH} characters) are reported as skipped so the caller can
 * surface how many entries were dropped.
 */
final class VokabelImportParser {

    /** Maximum length of a foreign term or a single meaning, matching the DB columns. */
    static final int MAX_LENGTH = 200;

    private VokabelImportParser() {}

    record ParsedEntry(String foreignTerm, List<String> meanings) {}

    /**
     * Outcome of a bulk parse: the valid entries in line order, plus the 1-based
     * line numbers of non-blank lines that were skipped.
     */
    record Result(List<ParsedEntry> entries, List<Integer> skippedLines) {}

    static Result parse(String text) {
        List<ParsedEntry> entries = new ArrayList<>();
        List<Integer> skippedLines = new ArrayList<>();
        String[] lines = text.split("\\R");
        for (int i = 0; i < lines.length; i++) {
            String line = lines[i].strip();
            if (line.isEmpty()) {
                continue;
            }
            ParsedEntry entry = parseLine(line);
            if (entry == null) {
                skippedLines.add(i + 1);
            } else {
                entries.add(entry);
            }
        }
        return new Result(entries, skippedLines);
    }

    /** Parses one already-stripped, non-blank line, or returns {@code null} if it is malformed. */
    private static ParsedEntry parseLine(String line) {
        int separator = line.indexOf(';');
        if (separator < 0) {
            return null;
        }
        String foreignTerm = line.substring(0, separator).strip();
        if (foreignTerm.isEmpty() || foreignTerm.length() > MAX_LENGTH) {
            return null;
        }
        List<String> meanings = new ArrayList<>();
        for (String part : line.substring(separator + 1).split("\\|")) {
            String meaning = part.strip();
            if (!meaning.isEmpty()) {
                meanings.add(meaning);
            }
        }
        if (meanings.isEmpty() || meanings.stream().anyMatch(meaning -> meaning.length() > MAX_LENGTH)) {
            return null;
        }
        return new ParsedEntry(foreignTerm, meanings);
    }
}
