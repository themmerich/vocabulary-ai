package de.prime_ux.backend.catalog;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

class VokabelImportParserTest {

    @Test
    void parsesForeignTermAndPipeSeparatedMeanings() {
        VokabelImportParser.Result result = VokabelImportParser.parse("house ; Haus | Gebäude");

        assertThat(result.skippedLines()).isEmpty();
        assertThat(result.entries()).singleElement().satisfies(entry -> {
            assertThat(entry.foreignTerm()).isEqualTo("house");
            assertThat(entry.meanings()).containsExactly("Haus", "Gebäude");
        });
    }

    @Test
    void keepsLineOrderAndTrimsWhitespace() {
        VokabelImportParser.Result result = VokabelImportParser.parse("  cat ;  Katze \n dog ; Hund ");

        assertThat(result.entries()).extracting(VokabelImportParser.ParsedEntry::foreignTerm).containsExactly("cat", "dog");
        assertThat(result.entries().get(0).meanings()).containsExactly("Katze");
    }

    @Test
    void skipsBlankLinesAndReportsInvalidRows() {
        String text =
                """
                valid ; ok

                no-separator-here
                ; only-meaning
                empty-meanings ;  |
                """;

        VokabelImportParser.Result result = VokabelImportParser.parse(text);

        assertThat(result.entries()).extracting(VokabelImportParser.ParsedEntry::foreignTerm).containsExactly("valid");
        // Lines 3, 4, 5 are malformed; the blank line 2 is not reported.
        assertThat(result.skippedLines()).containsExactly(3, 4, 5);
    }

    @Test
    void splitsOnlyOnFirstSemicolon() {
        VokabelImportParser.Result result = VokabelImportParser.parse("a; b ; c");

        assertThat(result.entries()).singleElement().satisfies(entry -> {
            assertThat(entry.foreignTerm()).isEqualTo("a");
            assertThat(entry.meanings()).containsExactly("b ; c");
        });
    }

    @Test
    void skipsLinesExceedingMaxLength() {
        String longTerm = "x".repeat(VokabelImportParser.MAX_LENGTH + 1);
        String longMeaning = "y".repeat(VokabelImportParser.MAX_LENGTH + 1);
        String text = longTerm + " ; ok\nword ; " + longMeaning + "\nok ; fine";

        VokabelImportParser.Result result = VokabelImportParser.parse(text);

        assertThat(result.entries()).extracting(VokabelImportParser.ParsedEntry::foreignTerm).containsExactly("ok");
        assertThat(result.skippedLines()).containsExactly(1, 2);
    }
}
