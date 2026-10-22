import { User, saveUser } from './users'
import z from 'zod'

const schema = z.object({
  firstname: z.string().min(5, 'El nombre debe tener al menos 5 caracteres.'),
  lastname: z.string().min(5, 'El apellido debe tener al menos 5 caracteres.'),
  phoneNumber: z.string().regex(/^\d*$/, 'El número de teléfono debe ser de tipo numérico')
})

export type FormUserState = {
  user: User,
  fieldErrors: Record<string, string[] | undefined>,
}

export async function save(prevState: FormUserState, formData: FormData): Promise<FormUserState> {
  const firstname = formData.get('firstname') as string
  const lastname = formData.get('lastname') as string
  const phoneNumber = formData.get('phoneNumber') as string

  const user = {
    firstname,
    lastname,
    phoneNumber
  }

  const result = schema.safeParse(user)

  if (!result.success) {
    return {
      user,
      fieldErrors: result.error.flatten().fieldErrors
    }
  }

  saveUser(user)
  return {
    user,
    fieldErrors: {}
  }
}
