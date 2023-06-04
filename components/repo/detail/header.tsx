import SearchInput from '@/components/global/search-input'
import { Repository } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { RepeatClockIcon } from '@chakra-ui/icons'
import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  HStack,
  Heading,
  IconButton,
  Select,
  Stack,
  VStack,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'

type Props = {
  repo: Repository
  searchEnabled: boolean
  search?: string
  setSearch?: (value: string) => void
  showCloseButton?: boolean
}

const RepositoryDetailHeader = (props: Props) => {
  const router = useRouter()
  const { contributors, branches, currentBranch, setCurrentBranch } = useRepoStore()

  return (
    <VStack gap={4} w="full" align="flex-start" p={8}>
      <SearchInput
        value={props.search ?? ''}
        onChange={props.setSearch}
        onClear={() => props.setSearch && props.setSearch('')}
        disabled={!props.searchEnabled}
      />

      <Stack direction={{ base: 'column', md: 'row' }} mb={10} w="full">
        <Heading size="lg" fontWeight="normal" flex={1}>
          {props.repo.owner.login}/<strong>{props.repo.name}</strong>
        </Heading>
        <Box pr={5}>
          {props.showCloseButton ?? false ? (
            <Button variant="primary" onClick={() => router.push(`/repo/${props.repo.id}`)}>
              Close
            </Button>
          ) : (
            <HStack>
              <IconButton
                aria-label="History Button"
                icon={<RepeatClockIcon />}
                variant="outline"
                onClick={e => router.push(`/repo/${props.repo.id}/history`)}
              />
              <Button
                variant="outline"
                onClick={() => router.push(`/repo/${props.repo.id}/settings`)}
              >
                Settings
              </Button>
            </HStack>
          )}
        </Box>
        <AvatarGroup size="md" max={3} display={{ base: 'none', md: 'block' }}>
          {contributors.map((contributor, index) => (
            <Avatar key={index} name={contributor.login} src={contributor.avatar_url} />
          ))}
        </AvatarGroup>
      </Stack>

      <Select
        value={branches.findIndex(obj => obj.name == currentBranch?.name)}
        onChange={e => setCurrentBranch(branches[Number(e.target.value)])}
        w="auto"
      >
        {branches.map((obj, index) => (
          <option key={index} value={index}>
            {`Branch: ${obj.name}`}
          </option>
        ))}
      </Select>
    </VStack>
  )
}

export default RepositoryDetailHeader
