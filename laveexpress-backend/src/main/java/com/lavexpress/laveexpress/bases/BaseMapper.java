package com.lavexpress.laveexpress.bases;

public abstract class BaseMapper<Entity,  EntityDto> {

    public abstract Entity dtoToEntity(EntityDto dto);

    public abstract EntityDto entityToDto(Entity dto);


}