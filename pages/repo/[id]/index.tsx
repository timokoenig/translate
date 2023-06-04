/* eslint-disable react-hooks/exhaustive-deps */
import HorizontalLine from '@/components/global/horizontal-line'
import LoadingIndicator from '@/components/global/loading-indicator'
import LoadingIndicatorFull from '@/components/global/loading-indicator-full'
import EmptyState from '@/components/repo/detail/empt-state'
import RepositoryDetailHeader from '@/components/repo/detail/header'
import RepoDetailLayout from '@/components/repo/detail/layout'
import RepositoryDetailList from '@/components/repo/detail/table'
import { Repository } from '@/utils/models'
import { useAppStore } from '@/utils/store/app/app-context'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type ContentProps = {
  repo: Repository
}

const RepositoryDetailContent = (props: ContentProps) => {
  const [search, setSearch] = useState<string>('')
  const { currentRepo, isLoadingContent } = useRepoStore()

  return (
    <>
      <RepositoryDetailHeader
        repo={props.repo}
        searchEnabled={true}
        search={search}
        setSearch={setSearch}
      />

      <HorizontalLine />

      {isLoadingContent ? (
        <LoadingIndicator />
      ) : currentRepo.files.length > 0 ? (
        <RepositoryDetailList search={search} />
      ) : (
        <EmptyState />
      )}
    </>
  )
}

type Props = {
  id: number
}

const RepositoryDetail = (props: Props) => {
  const router = useRouter()
  const { localRepositories } = useAppStore()
  const [repo, setRepo] = useState<Repository | null>(null)

  useEffect(() => {
    if (localRepositories.length == 0) return
    const localRepo = localRepositories.find(obj => obj.id == props.id)
    if (!localRepo) {
      router.replace('/')
      return
    }
    setRepo(localRepo)
  }, [props, localRepositories])

  if (!repo) {
    return <LoadingIndicatorFull />
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

export default RepositoryDetail
