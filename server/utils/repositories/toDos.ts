// utils/repositories/toDos.ts
import { ToDo } from './types'; 

let toDos: ToDo[] = []; // tareas en memoria

export function addToDo(title: string, completed: boolean = false): ToDo {
  const newToDo: ToDo = {
    id: generateUniqueId(),
    title,
    completed,
  };
  toDos.push(newToDo);
  return newToDo;
}

function generateUniqueId(): string {
  
  return (Math.random() * 1000000).toFixed(0);
}

export function findToDoById(id: string): ToDo | undefined {
  return toDos.find((toDo) => toDo.id === id);
}

export function deleteToDoById(id: string): boolean {
  const index = toDos.findIndex((toDo) => toDo.id === id);
  if (index !== -1) {
    toDos.splice(index, 1);
    return true;
  }
  return false;
}

export { toDos };
