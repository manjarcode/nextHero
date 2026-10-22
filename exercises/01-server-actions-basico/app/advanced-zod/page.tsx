'use client'
import { useActionState } from "react";
import { save } from "./actions"
import { getUsers } from "./users";


export default function Home() {
  const users = getUsers()
  const initialState = { user: {firstname: '', lastname: '', phoneNumber: ''}, fieldErrors: {}}
  const [state, dispatch] = useActionState(save, initialState)

  return (
    <div>
      <form action={dispatch}>
        <label htmlFor="firstname">Nombre:</label> <br/>
        <input type="text" name="firstname" defaultValue={state.user.firstname} />
        {state.fieldErrors.firstname?.[0] && <div>{state.fieldErrors.firstname[0]}</div>}
        <br/>

        <label htmlFor="lastname">Apellidos:</label> <br/>
        <input type="text" name="lastname" defaultValue={state.user.lastname} />
        {state.fieldErrors.lastname?.[0] && <div>{state.fieldErrors.lastname[0]}</div>}
        <br/>

        <label htmlFor="phoneNumber">Número de teléfono (opcional):</label> <br/>
        <input type="text" name="phoneNumber" defaultValue={String(state.user.phoneNumber)} />
        {state.fieldErrors.phoneNumber?.[0] && <div>{state.fieldErrors.phoneNumber[0]}</div>}
        <br/>

        <button type="submit">Guardar</button>
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
