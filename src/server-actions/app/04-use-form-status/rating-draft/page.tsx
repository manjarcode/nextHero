'use client'
import { useActionState } from 'react'
import {saveRating, RatingForm} from './actions'

const ValidationError = ({field}: {field?: string[]}) => {
  if (!Boolean(field) || !Array.isArray(field) || field.length===0) return  
  return <span>{field[0]}</span>
}

export default function ProductRating() {
  const initialState: RatingForm = {
    productName: '',
    rating: '',
    comment: '',
    fieldErrors: {}
  }

  const [state, formAction] = useActionState(saveRating, initialState)

  return (
    <form action={formAction}>
      <h1>Evalúa el producto</h1>
      <p>
      <label htmlFor="productName">Nombre del producto:</label><br />
      <input id="productName" type="text" name="productName" defaultValue={state.productName}/><br />
      <ValidationError field={state.fieldErrors?.productName} />
      </p>
      <p>
        Valoración: <br/>
        <input id="one" type="radio" name="rating" value="1" defaultChecked={state.rating === '1'} />
        <label htmlFor="one"> 1</label> <br/>
        <input id="two" type="radio" name="rating" value="2" defaultChecked={state.rating === '2'}/>
        <label htmlFor="two"> 2</label> <br/>
        <input id="three" type="radio" name="rating" value="3" defaultChecked={state.rating === '3'} />
        <label htmlFor="three"> 3</label> <br/>
        <input id="four" type="radio" name="rating" value="4" defaultChecked={state.rating === '4'}/>
        <label htmlFor="four"> 4</label> <br/>
        <input id="five" type="radio" name="rating" value="5" defaultChecked={state.rating === '5'}/>
        <label htmlFor="five"> 5</label> <br/>
        <ValidationError field={state.fieldErrors?.rating} />
      </p>
      <p>
        <label htmlFor="comment">Comentario (opcional)</label><br/>
        <textarea id="comment" name="comment" defaultValue={state.comment}></textarea><br />
        <ValidationError field={state.fieldErrors?.comment} />
      </p>
      <p>
        <input type="submit" value="Enviar" />
      </p>
    </form>
  )
}