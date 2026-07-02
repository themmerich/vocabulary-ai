package de.prime_ux.backend.catalog;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.Singular;

/**
 * A single vocabulary entry: one foreign term with one or more native meanings.
 * A Vokabel belongs to exactly one {@link Lektion}.
 */
@Entity
@Table(name = "vokabel")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vokabel {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lektion_id", nullable = false, updatable = false)
    private Lektion lektion;

    @Column(name = "foreign_term", nullable = false, length = 200)
    private String foreignTerm;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "vokabel_meaning", joinColumns = @JoinColumn(name = "vokabel_id"))
    @OrderColumn(name = "position")
    @Column(name = "meaning", nullable = false, length = 200)
    @Singular
    private List<String> meanings = new ArrayList<>();

    @Column(name = "order_index", nullable = false)
    private int orderIndex;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @PrePersist
    void onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }
}
