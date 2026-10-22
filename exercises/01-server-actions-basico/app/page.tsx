import { save } from "./actions"
import { getMemory } from "./memory";


export default async function Home() {
  const memory = getMemory()
  return (
    <div>
      <form action={save}>
        <label htmlFor="name">Introduzca nombre:</label> <br/>
        <input type="text" name="name" /> <br/>
        <button type="submit">Guardar</button>
      </form>
      <br />
      <ul>
        {memory.map((item,index) => (<li key={index}>{item}</li>))}
      </ul>
    </div>
  );
}
