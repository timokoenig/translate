/* eslint-disable react-hooks/exhaustive-deps */
import HorizontalLine from '@/components/global/horizontal-line'
import RepositoryDetailHeader from '@/components/repo/detail/header'
import RepoDetailLayout from '@/components/repo/detail/layout'
import RepositoryHistoryTable from '@/components/repo/history/table'
import { Repository } from '@/utils/models'
import { useAppStore } from '@/utils/store/app/app-context'
import { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

type ContentProps = {
  repo: Repository
}

const RepositoryDetailHistoryContent = (props: ContentProps) => {
  return (
    <>
      <RepositoryDetailHeader repo={props.repo} searchEnabled={false} showCloseButton={true} />
      <HorizontalLine />
      <RepositoryHistoryTable />
    </>
  )
}

type Props = {
  id: number
}

const RepoDetailHistory = (props: Props) => {
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
      <RepositoryDetailHistoryContent repo={repo} />
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

export default RepoDetailHistory
