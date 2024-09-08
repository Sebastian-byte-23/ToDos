//ESTA ES LA QUE BORRA
import { defineEventHandler } from 'h3';
import { toDos } from '../../utils/repositories/toDos'; // Importación de tooodo

export default defineEventHandler(async (event) => {
  const { params } = event.context; 
  if (!params) {
    event.res.statusCode = 400;
    return { error: 'Parámetros no encontrados' };
  }
  const id = params.id;
  const indiceTarea = toDos.findIndex((tarea) => tarea.id === id);
  if (indiceTarea === -1) {
    event.res.statusCode = 404;
    return { error: 'Tarea no encontradaaa' };
  }
  event.res.statusCode = 204;
  toDos.splice(indiceTarea, 1); // Elimina de acuerdo al id
  return { mensaje: 'Tarea eliminada con éxito' };
});