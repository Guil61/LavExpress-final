//package com.lavexpress.laveexpress.bases;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.Optional;
//
//public abstract class BaseController <Entity, EntityRequest, EntityResponse, EntityService extends BaseService<Entity>> {
//
//    protected abstract EntityService getEntityService();
//
//    @GetMapping(value = "/{id}")
//    abstract public ResponseEntity<EntityResponse> buscarPeloId(@PathVariable("id") Long id);
//
//    @PostMapping(value = "/new")
//    abstract public ResponseEntity<EntityResponse> createNew(@RequestBody EntityRequest request);
//
//    @PutMapping(value = "/{id}")
//    abstract public ResponseEntity<EntityResponse> update(@RequestBody EntityRequest request, @PathVariable("id") Long id);
//
//    @DeleteMapping(value = "/{id}")
//    public ResponseEntity<String> delete(@PathVariable("id") Long id) {
//        Optional<Entity> entity = getEntityService().f(id);
//        entity.ifPresentOrElse(getEntityService()::delete,
//                () -> {
//                    throw new RuntimeException("Não foi possível encontrar o parâmetro de id: " + id);
//                });
//        return new ResponseEntity<>(HttpStatus.OK);
//    }
//
//
//
//}
