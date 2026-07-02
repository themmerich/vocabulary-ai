package de.prime_ux.backend.catalog;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface VokabelRepository extends JpaRepository<Vokabel, UUID> {

    List<Vokabel> findByLektionIdOrderByOrderIndexAsc(UUID lektionId);

    /** Next append position: one past the current maximum, or 0 when empty. */
    @Query("select coalesce(max(v.orderIndex), -1) + 1 from Vokabel v where v.lektion.id = :lektionId")
    int nextOrderIndex(@Param("lektionId") UUID lektionId);
}
