'use server'
import z from 'zod'

const schema = z.object({
  productName: z.string().min(3, 'Debe introducir el producto'),
  rating: z.string('Debe introducir una valoración del 1 al 5').regex(/^[12345]$/, 'Debe introducir una valoración del 1 al 5'),
  comment: z.string().max(200, 'La longitud máxima es de 200 caracteres')
})

export type RatingFormState = {
  productName: string,
  rating: string,
  comment: string,  
  fieldErrors: Record<string, string[] | undefined>,
}

export async function saveRating(prevState: RatingFormState, formData: FormData) : Promise<RatingFormState> {
  await new Promise((resolve) => {global.setTimeout(resolve, 3000)})
  const productName = formData.get('productName') as string;
  const rating = formData.get('rating') as string;
  const comment = formData.get('comment') as string; 
  
  const ratingForm = {
    productName,
    rating,
    comment,
    fieldErrors: {}
  }

  const result = schema.safeParse(ratingForm)
  
  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors
    return {...ratingForm, fieldErrors}    
  }

  return ratingForm  
}