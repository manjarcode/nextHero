
import {User, saveUser} from './users'

export type FormUserState = {
  error: string | null,
  user: User
}

export async function save(prevState: FormUserState, formData: FormData) : Promise<FormUserState> {
  await new Promise(r => setTimeout(r, 3000))

  const firstname = formData.get('firstname') as string
  const lastname = formData.get('lastname') as string
  const phoneNumber = formData.get('phoneNumber') as string
  
  let error = ''
  if (!firstname || firstname.length < 5) {
    error += 'El nombre debe tener al menos 5 caracteres. '
  }

  if (!lastname || lastname.length < 5) {
    error += 'El apellido debe tener al menos 5 caracteres. '
  }

  const validateNumber = /^[0-9]+$/
  if (phoneNumber && !validateNumber.test(phoneNumber)) {
    error += 'El número de teléfono debe ser de tipo numérico'    
  }

  const hasError = error.length > 0;
  const user = {
    firstname,
    lastname,
    phoneNumber
  }

  if (!hasError) {
    saveUser(user)
  }
  return {
    error: hasError? error : null,
    user
  }
}