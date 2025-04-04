package com.lavexpress.laveexpress.bases;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.hibernate.Hibernate;
import org.hibernate.proxy.HibernateProxy;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Transactional
public abstract class BaseService<Entity> {

    protected final Log logger = LogFactory.getLog(getClass());

    public abstract JpaRepository<Entity, Long> getRepository();

    public void save(Entity entity) {
        getRepository().save(entity);
    }

    public Entity saveWithReturn(Entity entity) {
        return getRepository().save(entity);
    }

    public void delete(Entity entity) {
        getRepository().delete(entity);
    }

//    public abstract Page<Entity> findAll(int page, int size, EntityFilter filter);

    public Optional<Entity> findById(Long id) {
        return getRepository().findById(id);
    }



}
