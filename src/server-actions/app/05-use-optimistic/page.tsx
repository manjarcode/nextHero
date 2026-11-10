'use client'

import { useActionState, Fragment, useOptimistic } from "react"
import { save, FormOptimisticState } from "./actions"
import { User } from "./users"


type UserCallback = (user: User) => void;

const formAction = (update: UserCallback, addOptimistic: UserCallback) => (formData: FormData) => {

  const firstname = String(formData.get("firstname"))
  const lastname = String(formData.get("lastname"))
  const user: User = {
    firstname, lastname, phoneNumber: ''
  }


  addOptimistic(user)
  update(user)
}


export default function OptimisticForm() {

  const initialState: FormOptimisticState = {
    users: [],
    error: undefined
  }

  const [state, update] = useActionState(save, initialState)

  const [optimisticState, addOptimistic] = useOptimistic(state, (currentState, user: User) => ({
    users: [...currentState.users, user],
    error: state.error
  }))

  return (<div>
    <form action={formAction(update, addOptimistic)}>
      <label htmlFor="firstname">Nombre</label> <br />
      <input type="text" id="firstname" name="firstname" /> <br />
      <label htmlFor="lastname">Apellido</label> <br />
      <input type="text" id="lastname" name="lastname" /> <br />
      <button type="submit">Enviar</button>
    </form>
    <div>
      {optimisticState.users.map(
        (item,index) => 
          (<Fragment key={index}><span >{item.firstname} {item.lastname}</span><br/></Fragment>)
      )}
    </div>
  </div>)
}