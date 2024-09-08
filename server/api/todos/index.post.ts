import { defineEventHandler, readBody } from 'h3';
import * as v from 'valibot';
import { createTaskSchema } from '../../utils/schemas/task'; // Importa el esquema de validación
import { toDos } from '../../utils/repositories/toDos';

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

// Generar un ID único (puede ser reemplazado con una de las alternativas mencionadas)
const generateUniqueId = (): string => {
  return `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
};

export default defineEventHandler(async (event) => {
  try {
    // Validar y obtener el cuerpo de la solicitud utilizando el esquema de creación de tareas
    const validatedData = await getValidatedBody(event, createTaskSchema);

    // Validar el campo 'completed' manualmente
    if (validatedData.completed !== undefined && typeof validatedData.completed !== 'boolean') {
      throw new Error('El campo completed debe ser un valor booleano o estar ausente');
    }

    // Generar un nuevo ToDo con ID único
    const newToDo = { ...validatedData, id: generateUniqueId() };
    toDos.push(newToDo);

    // Establecer el código de estado 201 para una operación exitosa
    event.res.statusCode = 201;
    return newToDo;
  } catch (error) {
    // Manejar errores de validación
    console.error('Error de creación de tarea:', error); // Mensaje de depuración
    event.res.statusCode = 400;
    return { error: 'Datos de creación inválidos', details: error.message || error };
  }
});
