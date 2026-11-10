'use server'
import { revalidatePath } from 'next/cache'
import {saveMemory} from './memory'

const memory : string[] = []

export async function save(formData: FormData) {
  const name = formData.get('name') as string

  saveMemory(name)
  revalidatePath('/')
}
