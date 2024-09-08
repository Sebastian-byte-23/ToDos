import { defineEventHandler, readBody } from 'h3';
import { toDos } from '../../utils/repositories/toDos'; // Asegúrate de ajustar el camino según tu estructura
import { updateTaskSchema } from '../../utils/schemas/update'; // Importa tu esquema de validación
import * as v from 'valibot';

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

export default defineEventHandler(async (event) => {
  const { params } = event.context;
  if (!params) {
    event.res.statusCode = 400;
    return { error: 'Parámetros no encontrados' };
  }

  const id = params.id;
  const todoIndex = toDos.findIndex((todo) => todo.id === id);

  if (todoIndex === -1) {
    event.res.statusCode = 404;
    return { error: 'Tarea no encontrada' };
  }

  try {
    // Validar y obtener el cuerpo de la solicitud utilizando el esquema de actualización de tareas
    const validatedData = await getValidatedBody(event, updateTaskSchema);

    // Actualizar la tarea con los datos validados
    toDos[todoIndex] = { ...toDos[todoIndex], ...validatedData };

    // Establecer el código de estado 200 para una operación exitosa
    event.res.statusCode = 200;

    return toDos[todoIndex];
  } catch (error) {
    // Manejar errores de validación
    event.res.statusCode = 400;
    return { error: 'Datos de actualización inválidos', details: error };
  }
});
