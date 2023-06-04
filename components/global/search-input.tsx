/* eslint-disable react-hooks/exhaustive-deps */
import { Button, Input, InputGroup, InputRightElement } from '@chakra-ui/react'
import debounce from 'lodash.debounce'
import { useCallback, useEffect, useState } from 'react'

type Props = {
  value: string
  onChange?: (value: string) => void
  onClear: () => void
  disabled?: boolean
}

const SearchInput = (props: Props) => {
  const [value, setValue] = useState<string>(props.value)

  const debouncedSearch = useCallback(
    debounce(query => props.onChange && props.onChange(query), 500),
    []
  )

  useEffect(() => {
    if (!props.onChange) return
    if (value == '') {
      props.onChange(value)
      return
    }
    debouncedSearch(value)
  }, [value])

  useEffect(() => {
    setValue(props.value)
  }, [props.value])

  return (
    <InputGroup size="md" maxW={500}>
      <Input
        pr="4.5rem"
        placeholder="Search"
        value={value}
        onChange={e => setValue(e.target.value)}
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
}

export default SearchInput
