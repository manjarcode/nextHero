'use server'
import { getUsers, saveUser, User } from './users'

export type FormOptimisticState = {
  users: User[],
  error: Error | undefined
}


export async function save(state: FormOptimisticState, user: User) {

  await new Promise((resolve) => { global.setTimeout(resolve, 8000)})

  try {
    saveUser(user)
    return {
      users: getUsers(),
      error: undefined
    }
  } catch (err) {
    return {
      users: getUsers(),
      error: err
    }
  }     
}


export async function get() : Promise<FormOptimisticState> {
  return {
    users: getUsers(),
    error: undefined
  }
}
