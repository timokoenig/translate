import { Box, HStack, Heading, Text } from '@chakra-ui/react'
import { ReactNode } from 'react'

type Props = {
  title: string
  children: ReactNode
}

const FeatureBox = (props: Props) => (
  <Box w="full" p={4} borderRadius={16} borderWidth={1} minHeight="200px">
    <Heading as="h2" size="lg" mb={4} bgGradient="linear(to-r, red.400,pink.400)" bgClip="text">
      {props.title}
    </Heading>
    {props.children}
  </Box>
)

const FeatureContainer = () => (
  <HStack w="full" pb={16} gap={4}>
    <FeatureBox title="Experience">
      <Text>
        The Translate platform is a user-friendly web interface built on top of established
        technologies. It leverages the power of{' '}
        <Text as="span" fontWeight="semibold">
          Github
        </Text>{' '}
        for data storage and utilizes{' '}
        <Text as="span" fontWeight="semibold">
          i18next
        </Text>{' '}
        for localization standards, ensuring a seamless experience.
      </Text>
    </FeatureBox>
    <FeatureBox title="Privacy">
      <Text>
        The Translate platform runs entirely{' '}
        <Text as="span" fontWeight="semibold">
          within your browser
        </Text>
        , ensuring your privacy. We never store your credentials or repository data on our server,
        prioritizing the security of your information.
      </Text>
    </FeatureBox>
    <FeatureBox title="Open Source">
      <Text>
        The Translate platform is an open source project on GitHub, emphasizing{' '}
        <Text as="span" fontWeight="semibold">
          transparency
        </Text>
        ,{' '}
        <Text as="span" fontWeight="semibold">
          security
        </Text>
        , and{' '}
        <Text as="span" fontWeight="semibold">
          community collaboration
        </Text>
        .
      </Text>
    </FeatureBox>
  </HStack>
)

export default FeatureContainer
