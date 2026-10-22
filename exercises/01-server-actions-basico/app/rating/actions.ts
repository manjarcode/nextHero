'use server'
import z from 'zod'

const schema = z.object({
  productName: z.string().min(3, 'Debe introducir el producto'),
  rating: z.string('Debe introducir una valoración del 1 al 5').regex(/^[12345]$/, 'Debe introducir una valoración del 1 al 5'),
  comment: z.string().max(200, 'La longitud máxima es de 200 caracteres')
})

export type RatingForm = {
  productName: string,
  rating: string,
  comment: string,  
  fieldErrors: Record<string, string[] | undefined>,
}

export async function saveRating(prevState: RatingForm, formData: FormData) : Promise<RatingForm> {

  const productName = formData.get('productName') as string;
  const rating = formData.get('rating') as string;
  const comment = formData.get('comment') as string; 
  
  console.log('rating es null', rating)

  const ratingForm = {
    productName,
    rating,
    comment,
    fieldErrors: {}
  }

  const result = schema.safeParse(ratingForm)
  
  console.log('productRating', ratingForm, 'result', result)

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    console.log('fieldErrores', fieldErrors)

    return {...ratingForm, fieldErrors}    
  }

  return ratingForm  
}