//ESTE ES EL QUE LISTA
import { defineEventHandler } from 'h3';
import { toDos } from '../../utils/repositories/toDos';

export default defineEventHandler(async (event) => {
  const { params } = event.context; 
  if (!params) {
    event.res.statusCode = 400;
    return { error: 'Parámetros no encontrados' };
  }
  const id = params.id;
  if (id) {
    const todoIndex = toDos.findIndex((todo) => todo.id === id);
    if (todoIndex === -1) {
      event.res.statusCode = 404;
      return { error: 'Tarea no encontrada' };
    }
    return toDos[todoIndex];
  } else {
    return toDos;
  }
});