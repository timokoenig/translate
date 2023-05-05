import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'

type Props = {
  value: string
  onChange?: (value: string) => void
  onClear: () => void
  disabled?: boolean
}

const SearchInput = (props: Props) => (
  <InputGroup size="md" maxW={500}>
    <Input
      pr="4.5rem"
      placeholder="Search"
      value={props.value}
      onChange={e => props.onChange && props.onChange(e.target.value)}
      disabled={props.disabled}
    />
    {props.value != '' && (
      <InputRightElement width="4.5rem">
        <Button h="1.75rem" size="sm" onClick={props.onClear}>
          clear
        </Button>
      </InputRightElement>
    )}
  </InputGroup>
)

export default SearchInput
