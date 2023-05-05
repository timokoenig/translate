/* eslint-disable react-hooks/exhaustive-deps */
import HorizontalLine from '@/components/global/horizontal-line'
import RepositoryDetailHeader from '@/components/repo/detail/header'
import RepoDetailLayout from '@/components/repo/detail/layout'
import CategoryTable from '@/components/repo/settings/category/table'
import ContributorTable from '@/components/repo/settings/contributor-table'
import LanguageTable from '@/components/repo/settings/language/table'
import { Repository } from '@/utils/models'
import { useAppStore } from '@/utils/store/app/app-context'
import { Box, Button, Heading } from '@chakra-ui/react'
import { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type ContentProps = {
  repo: Repository
}

const RepositoryDetailContent = (props: ContentProps) => {
  const router = useRouter()
  const [search, setSearch] = useState<string>('')
  const { localRepositories, setLocalRepositories } = useAppStore()

  const onRemoveRepo = () => {
    setLocalRepositories(localRepositories.filter(obj => obj.id != props.repo.id))
    router.replace('/')
  }

  return (
    <>
      <RepositoryDetailHeader
        repo={props.repo}
        searchEnabled={false}
        search={search}
        setSearch={setSearch}
        showCloseButton={true}
      />
      <HorizontalLine />
      <CategoryTable />
      <HorizontalLine />
      <LanguageTable />
      <HorizontalLine />
      <ContributorTable />
      <HorizontalLine />
      <Box p={8}>
        <Heading as="h2" size="md" mb={8}>
          Others
        </Heading>
        <Button variant="primary" onClick={onRemoveRepo}>
          Remove Repository
        </Button>
      </Box>
    </>
  )
}

type Props = {
  id: number
}

const RepoDetailSettings = (props: Props) => {
  const router = useRouter()
  const { localRepositories } = useAppStore()
  const repo = localRepositories.find(obj => obj.id == props.id)

  useEffect(() => {
    if (!repo) {
      router.replace('/')
    }
  }, [])

  if (!repo) {
    return null
  }

  return (
    <RepoDetailLayout repo={repo}>
      <RepositoryDetailContent repo={repo} />
    </RepoDetailLayout>
  )
}

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context
  const session = await getSession({ req })

  if (!session) {
    return {
      redirect: { destination: '/signin' },
    }
  }

  return {
    props: {
      id: Number(context.query.id as string),
    },
  }
}

export default RepoDetailSettings
