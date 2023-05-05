import { useAppStore } from '@/utils/store/app/app-context'
import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Link,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import moment from 'moment'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { FaGithub } from 'react-icons/fa'
import { FiPlus, FiSettings } from 'react-icons/fi'
import SupportButton from '../global/support-button'
import MenuItem from './menu-item'

const Sidebar = () => {
  const router = useRouter()
  const { localRepositories } = useAppStore()
  const sortedLocalRepositories = localRepositories.sort((a, b) =>
    a.name > b.name ? 1 : a.name < b.name ? -1 : 0
  )
  const { data: session } = useSession()

  return (
    <Box
      bg={useColorModeValue('white', 'gray.900')}
      borderRight="1px"
      borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      w={{ base: 'full', md: 72 }}
      pos="fixed"
      h="full"
    >
      <VStack h="full">
        <Flex
          w="full"
          p={4}
          borderBottom="1px"
          borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
        >
          <Avatar
            size="sm"
            name={session?.user?.name ?? undefined}
            src={session?.user?.image ?? undefined}
            mr={4}
          />
          <Heading as="h3" size="sm" lineHeight={2} textTransform="uppercase">
            {session?.user?.name ?? 'n/a'}
          </Heading>
        </Flex>

        <VStack w="full" p={4} pt={4} textAlign="left">
          {sortedLocalRepositories.length == 0 && <Text>Add your first repository to start</Text>}
          {sortedLocalRepositories.map((obj, index) => (
            <MenuItem
              key={index}
              isActive={window.location.href.includes(`${obj.id}`)}
              onClick={() => router.push(`/repo/${obj.id}`)}
            >
              <VStack gap={0}>
                <Text w="full" fontWeight="semibold">
                  {obj.owner.login}/<strong>{obj.name}</strong>
                </Text>
                <Text w="full" style={{ marginTop: 0 }} fontSize={12} color="gray.500">
                  Last Updated {moment(obj.pushed_at).format('DD/MM/YYYY HH:mm')}
                </Text>
              </VStack>
            </MenuItem>
          ))}
          <Box pt={4} w="full">
            <Button
              leftIcon={<FiPlus />}
              variant="primary"
              w="full"
              onClick={() => router.push('/repo')}
            >
              Add Repository
            </Button>
          </Box>
        </VStack>

        <Box flex={1} />

        <VStack w="full" gap={2} p={4} pt={8} textAlign="left">
          <Box pt={4} w="full">
            <Button
              leftIcon={<FiSettings />}
              bg="gray.200"
              color="gray.900"
              variant="solid"
              _hover={{
                bg: 'gray.300',
              }}
              w="full"
              onClick={() => router.push('/settings')}
            >
              Settings
            </Button>
          </Box>
          <SupportButton w="full" />
          <Box w="full">
            <Button
              as={Link}
              leftIcon={<FaGithub />}
              bg="gray.900"
              color="white"
              _hover={{ bg: 'gray.700', textDecoration: 'none' }}
              variant="solid"
              w="full"
              href="https://github.com/timokoenig/translate"
              target="_blank"
            >
              Open Source
            </Button>
          </Box>
        </VStack>
      </VStack>
    </Box>
  )
}

export default Sidebar
