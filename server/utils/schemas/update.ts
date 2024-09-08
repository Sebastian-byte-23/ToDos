import * as v from 'valibot';


export const updateTaskSchema = v.object({
  title: v.optional(v.pipe(v.string(), v.minLength(1), v.trim())), // El título es opcional pero si está, no debe estar vacío
  completed: v.optional(v.boolean()) // El campo "completed" es opcional
});


