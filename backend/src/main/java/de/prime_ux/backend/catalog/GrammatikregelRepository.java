package de.prime_ux.backend.catalog;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface GrammatikregelRepository extends JpaRepository<Grammatikregel, UUID> {

    List<Grammatikregel> findByLektionIdOrderByOrderIndexAsc(UUID lektionId);

    /** Next append position: one past the current maximum, or 0 when empty. */
    @Query("select coalesce(max(g.orderIndex), -1) + 1 from Grammatikregel g where g.lektion.id = :lektionId")
    int nextOrderIndex(@Param("lektionId") UUID lektionId);
}
