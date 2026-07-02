package de.prime_ux.backend.catalog;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface LektionRepository extends JpaRepository<Lektion, UUID> {

    List<Lektion> findByLehrwerkIdOrderByOrderIndexAsc(UUID lehrwerkId);

    long countByLehrwerkId(UUID lehrwerkId);

    /** Lesson count per Lehrwerk in a single grouped query (avoids one count per Lehrwerk). */
    @Query("select new de.prime_ux.backend.catalog.LehrwerkLektionCount(l.lehrwerk.id, count(l)) "
            + "from Lektion l group by l.lehrwerk.id")
    List<LehrwerkLektionCount> countGroupedByLehrwerk();

    /** Next append position: one past the current maximum, or 0 when empty. */
    @Query("select coalesce(max(l.orderIndex), -1) + 1 from Lektion l where l.lehrwerk.id = :lehrwerkId")
    int nextOrderIndex(@Param("lehrwerkId") UUID lehrwerkId);
}
