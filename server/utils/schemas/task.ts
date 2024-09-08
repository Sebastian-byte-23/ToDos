import * as v from 'valibot';

export const createTaskSchema = v.object({
  title: v.pipe(v.string(), v.minLength(1), v.trim()), // Asegurar que el título no esté vacío
  completed: v.any() // Permitir cualquier tipo, incluyendo undefined
});

