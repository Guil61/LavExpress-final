package com.lavexpress.laveexpress.bases;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

public abstract class BaseService<Entity> {

    protected final Log logger = LogFactory.getLog(getClass());

    public abstract JpaRepository<Entity, Long> getRepository();

    @Transactional
    public void save(Entity entity) {
        getRepository().save(entity);
    }

    @Transactional
    public Entity saveWithReturn(Entity entity) {
        return getRepository().save(entity);
    }

    @Transactional
    public void delete(Entity entity) {
        getRepository().delete(entity);
    }

    public Optional<Entity> findById(Long id) {
        return getRepository().findById(id);
    }
}