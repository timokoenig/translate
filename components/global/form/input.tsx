import { Input as ChakraInput, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

type Props = {
  id: string
  label?: string
  isRequired?: boolean
}

export const Input = (props: Props): JSX.Element => {
  const formik = useFormikContext<{ [key: string]: string }>()

  return (
    <FormControl
      isRequired={props.isRequired ?? false}
      isDisabled={formik.isSubmitting}
      isInvalid={formik.errors[props.id] !== undefined && formik.touched[props.id]}
    >
      {props.label && <FormLabel htmlFor={props.id}>{props.label}</FormLabel>}
      <ChakraInput id={props.id} value={formik.values[props.id]} onChange={formik.handleChange} />
      <FormErrorMessage>{formik.errors[props.id]}</FormErrorMessage>
    </FormControl>
  )
}

export default Input
