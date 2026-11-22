// Scaffolding: almacén en memoria del servidor, ya resuelto.
// No forma parte del ejercicio — úsalo como si fuera una "base de datos" ya dada,
// igual que `users.ts` en los hitos anteriores.

import { cacheTag } from "next/cache"

export type Task = {
  id: string
  title: string
  completed: boolean
}

const tasks: Task[] = [{
  id: 'aca8e94f-f177-4d5e-8347-89dacf5ab093',
  title: 'Comprar papel de cocina',
  completed: false
}]

export async function getTasks(): Promise<Task[]> {
  'use cache'
  cacheTag('tasks')
  return tasks
}

export function addTask(title: string, completed: boolean): Task {
  const task: Task = {
    id: crypto.randomUUID(),
    title,
    completed
  }
  tasks.push(task)
  return task
}

export function toggleTask(id: string): Task | undefined {
  const task = tasks.find((t) => t.id === id)
  if (task) {
    task.completed = !task.completed
  }
  return task
}

export function removeTask(id: string): void {
  const index = tasks.findIndex((t) => t.id === id)
  if (index !== -1) {
    tasks.splice(index, 1)
  }
}
