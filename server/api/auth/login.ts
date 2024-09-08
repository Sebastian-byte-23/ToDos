import { defineEventHandler, readBody } from 'h3';
import { users } from '../../utils/repositories/users';
import { scryptSync, randomBytes } from 'node:crypto';
import * as v from 'valibot';
import { LoginSchema } from '../../utils/schemas/login';

// Función para validar y obtener el cuerpo de la solicitud
const getValidatedBody = async (event, schema) => {
  const body = await readBody(event); // Obtener el cuerpo de la solicitud
  return v.parse(schema, body); // Validar el cuerpo utilizando el esquema
};

export default defineEventHandler(async (event) => {
  // Verificar que sea un método POST
  if (event.req.method !== 'POST') {
    event.res.statusCode = 405;
    return { error: 'Method Not Allowed' };
  }

  try {
    // Validar y obtener el cuerpo de la solicitud
    const data = await getValidatedBody(event, LoginSchema);
    const { username, password } = data;

    // Verificar si el usuario existe
    const user = users.find((u) => u.username === username);
    if (!user) {
      event.res.statusCode = 401;
      return { error: 'Usuario y/o contraseña incorrecta' };
    }

    // Separar la sal y la llave
    const [salt, storedKey] = user.password.split(':');

    // Derivar la llave usando la misma sal
    const derivedKey = scryptSync(password, salt, 64).toString('hex');

    // Verificar si la contraseña es correcta
    if (storedKey !== derivedKey) {
      event.res.statusCode = 401;
      return { error: 'Usuario y/o contraseña incorrecta' };
    }

    // Generar un token para el usuario
    const token = randomBytes(48).toString('hex');
    user.token = token;

    // Devolver los detalles del usuario y el token
    return {
      username: user.username,
      name: user.name,
      token: user.token,
    };
  } catch (error) {
    // Manejar errores de validación
    event.res.statusCode = 400;
    return { error: 'Error de validación', details: error.errors || error.message };
  }
});
