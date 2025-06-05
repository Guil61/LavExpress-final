package com.lavexpress.laveexpress.bases;

public abstract class BaseMapper<Entity,  EntityRequest, EntityResponse, EntityFilter> {

    public abstract Entity requestToEntity(EntityRequest request);

    public abstract EntityRequest entityToRequest(Entity entity);

    public abstract Entity responseToEntity(EntityResponse response);

    public abstract EntityResponse entityToResponse(Entity entity);

//    public abstract Entity filterToEntity(EntityFilter filter);
//
//    public abstract EntityFilter entityToFilter(Entity entity);
}