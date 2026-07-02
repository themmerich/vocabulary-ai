package de.prime_ux.backend.catalog;

import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LehrwerkRepository extends JpaRepository<Lehrwerk, UUID> {

    List<Lehrwerk> findAllByOrderByTitleAsc();
}
