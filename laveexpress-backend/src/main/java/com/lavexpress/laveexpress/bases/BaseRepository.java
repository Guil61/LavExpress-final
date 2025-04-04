package com.lavexpress.laveexpress.bases;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.io.Serializable;

@NoRepositoryBean
public interface BaseRepository<Entity> extends JpaRepository<Entity, Long>, Serializable {

    Page<Entity> findAll(Specification<Entity> specification, Pageable pageRequest);
}
