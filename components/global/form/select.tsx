import { Select as ChakraSelect, FormControl, FormErrorMessage, FormLabel } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

type Props = {
  id: string
  label?: string
  values: { key: string; value: string }[]
  isRequired?: boolean
}

export const Select = (props: Props): JSX.Element => {
  const formik = useFormikContext<{ [key: string]: string }>()

  return (
    <FormControl
      isRequired={props.isRequired ?? false}
      isDisabled={formik.isSubmitting}
      isInvalid={formik.errors[props.id] !== undefined && formik.touched[props.id]}
    >
      {props.label && <FormLabel htmlFor={props.id}>{props.label}</FormLabel>}
      <ChakraSelect id={props.id} value={formik.values[props.id]} onChange={formik.handleChange}>
        {props.values.map(obj => (
          <option key={obj.key} value={obj.key}>
            {obj.value}
          </option>
        ))}
      </ChakraSelect>
      <FormErrorMessage>{formik.errors[props.id]}</FormErrorMessage>
    </FormControl>
  )
}
