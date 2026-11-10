export type User = {
  firstname: string,
  lastname: string
  phoneNumber: string | null
}

const users: User[] = []

export function getUsers() : User[] {
  return users
}

export function saveUser(value: User) {

  if (Math.random() < 0.5) {
    throw new Error('Fail saving user')
  }

  users.push(value)
}