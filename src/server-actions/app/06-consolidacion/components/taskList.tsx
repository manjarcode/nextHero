'use client'
import { useActionState, useOptimistic } from 'react'
import { toggle, remove, TaskFormState, createTask } from '../actions'
import { Task } from '../tasks'
import {TaskForm} from './taskForm'
import styles from './taskList.module.css'

export default function TaskList({tasks=[]}: TaskListProps) {

  const saveCallback = async (currentState: TaskFormState, formData: FormData) => {
    const title = String(formData.get('title'))
    const completed = JSON.parse(String(formData.get('completed'))) as boolean
    addOptimistic({id: crypto.randomUUID(), title,completed, isOptimistic: true})

    return await createTask(title, completed)
  }

  const initialState = {
    fieldErrors: {}
  }

  const [state, action, pending] = useActionState(saveCallback, initialState)

  const [optimisticState, addOptimistic] = useOptimistic(tasks, (state: OptimisticTask[], item: OptimisticTask) => {
    return [...state, item]
  }) 
  
  return (
    <>
      <div className={styles.taskList}>      
        {optimisticState.map((task) => (
          <div className={styles.task} key={task.id}>
            <form>
              <span>{task.title} - {task.completed ? "DONE" : "TODO" }</span>              
              <div>
                <input type="hidden" name="id" value={task.id} />
                <button className={styles.button} formAction={toggle} disabled={task.isOptimistic}>🔄</button>
                <button className={styles.button} formAction={remove} disabled={task.isOptimistic}>🗑️</button>
              </div>
            </form>
          </div>
        ))}
      </div>
      <TaskForm saveTask={action} state={state} />
    </>
  )
}

type OptimisticTask = Task & {  
  isOptimistic?: boolean
}

type TaskListProps = {
  tasks: Task[]
}