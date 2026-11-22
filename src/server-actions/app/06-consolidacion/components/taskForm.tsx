'use client'
import styles from './form.module.css'
import {createTask, TaskFormState} from '../actions'
import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'

export function TaskForm({saveTask, state}: TaskFormProps) {

  return (
    <form className={styles.form} action={saveTask}>
      <h2>Añadir tarea</h2>
      <div className={styles.field}>
        <label htmlFor="title">Nombre:</label> <br />
        <input id="title" type="text" name="title" /> <br />
        {state.fieldErrors.title && <span className={styles.warning}>{state.fieldErrors.title}</span> }
      </div>
      <div className={styles.field}>
        <input id="notCompleted" type="radio" name="completed" value="false" />
        &nbsp;<label htmlFor="notCompleted">Sin completar</label>  <br />
        <input id="completed" type="radio" name="completed" value="true" />
        &nbsp;<label htmlFor="completed">Completado</label> 
      </div>
      <DynamicButton />
    </form>
  )
}

type TaskFormProps = {
  saveTask: (formData: FormData) => void,
  state: TaskFormState
}

function DynamicButton() {
  
  const {pending} = useFormStatus()

  const label = pending ? 'Guardando...' : 'Enviar'

  return (    
    <input type="submit" value={label} className={styles.button} disabled={pending}/>
  )
}