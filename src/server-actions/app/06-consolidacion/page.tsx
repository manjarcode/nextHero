import {getTasks} from './tasks'
import styles from './page.module.css'
import TaskList from './components/taskList'

export default async function Consolidate() {
  const tasks = await getTasks()


  return (
    <div className={styles.container}>
      <h1>Lista de tareas</h1>

      <TaskList tasks={tasks} />
    </div>)
}