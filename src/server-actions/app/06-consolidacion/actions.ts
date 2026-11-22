'use server'

import { revalidateTag } from "next/cache"
import { addTask, toggleTask, removeTask } from "./tasks"
import z from 'zod'

const schema = z.object({
  title: z.string().min(3, 'El título es obligatorio'),
  completed: z.boolean()
})


export type TaskFormState = {
  fieldErrors: Record<string, string[] | undefined>,
}

export async function createTask(title: string, completed: boolean): Promise<TaskFormState> {

  await new Promise((resolve) => { setTimeout(()=> { resolve(null)}, 2000)})
  const result = schema.safeParse({ title, completed})
  if (!result.success) {
    return {
      fieldErrors: z.flattenError(result.error).fieldErrors
    }
  }

  addTask(title, completed)
  revalidateTag('tasks', {expire: 0})

  return {
    fieldErrors: {}
  }
}

export async function toggle(formData: FormData) {
  const id = String(formData.get('id'))
  toggleTask(id)
  revalidateTag('tasks', {expire: 0})
}

export async function remove(formData: FormData) {
  const id = String(formData.get('id'))
  removeTask(id)
  revalidateTag('tasks', {expire: 0})  
}
