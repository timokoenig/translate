import LoadingIndicator from '@/components/global/loading-indicator'
import Layout from '@/components/layout'
import { Repository } from '@/utils/models'
import { useRepoStore } from '@/utils/store/repo/repo-context'
import RepoStoreProvider from '@/utils/store/repo/repo-provider'
import { ReactNode } from 'react'

type Props = {
  repo: Repository
  children: ReactNode
}

const DetailContent = (props: Props) => {
  const { isLoading } = useRepoStore()

  if (isLoading) {
    return <LoadingIndicator />
  }

  return <>{props.children}</>
}

const RepoDetailLayout = (props: Props) => {
  return (
    <RepoStoreProvider repo={props.repo}>
      <Layout>
        <DetailContent {...props} />
      </Layout>
    </RepoStoreProvider>
  )
}

export default RepoDetailLayout
