import { Button as ChakraButton } from '@chakra-ui/react'
import { useFormikContext } from 'formik'

type Props = {
  label: string
  variant: 'outline' | 'primary'
  onClick?: () => void
}

export const Button = (props: Props): JSX.Element => {
  const formik = useFormikContext<{ [key: string]: string }>()

  return (
    <ChakraButton
      variant={props.variant}
      onClick={() => (props.onClick ? props.onClick() : formik.handleSubmit())}
      isLoading={formik.isSubmitting}
    >
      {props.label}
    </ChakraButton>
  )
}
