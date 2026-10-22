'use client'
import { useActionState } from "react";
import { save } from "./actions"
import { getUsers } from "./users";


export default function Home() {
  const users = getUsers()
  const initialState = { error: null, user: {firstname: '', lastname: '', phoneNumber: ''}}
  const [state, dispatch] = useActionState(save, initialState)

  return (
    <div>
      <form action={dispatch}>
        <label htmlFor="firstname">Nombre:</label> <br/>
        <input type="text" name="firstname" defaultValue={state.user.firstname} /> <br/>
        <label htmlFor="lastname">Apellidos:</label> <br/>
        <input type="text" name="lastname" defaultValue={state.user.lastname} /> <br/>
        <label htmlFor="phoneNumber">Número de teléfono (opcional):</label> <br/>
        <input type="text" name="phoneNumber" defaultValue={String(state.user.phoneNumber)} /> <br/>
        <button type="submit">Guardar</button>
        {
         (state.error && state.error.length > 0) ?
          <div>{state.error}</div> : 
          <></>
        }
      </form>
      <br />
      <ul>
        {users.map((user,index) => (
          <li key={index}>{user.firstname} {user.lastname} {user.phoneNumber}</li>
        ))}
      </ul>
    </div>
  );
}

