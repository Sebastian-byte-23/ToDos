import { defineEventHandler, readBody } from 'h3';
import { toDos, addToDo } from '../../utils/repositories/toDos'; // Importa desde la ubicación de donde este

// listar y crear
export default defineEventHandler(async (event) => {
  const method = event.req.method;

  if (method === 'GET') {
    return toDos; // Devolvuelve los ToDo
  } else if (method === 'POST') {
    const body = await readBody(event);
    if (!body.title) {
      event.res.statusCode = 400;
      return { error: 'El título es obligatorio' };
    }

    const newToDo = addToDo(body.title); 
    return newToDo; // Devolver el ToDo recién creado
  }

  event.res.statusCode = 405;
  return { error: 'Método no permitido' };
});
