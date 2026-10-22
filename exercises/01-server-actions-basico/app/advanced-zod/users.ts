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
  users.push(value)
}
