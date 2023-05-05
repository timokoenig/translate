import HorizontalLine from '@/components/global/horizontal-line'
import Layout from '@/components/layout'
import RepositoryListHeader from '@/components/repo/list/header'
import RepositoryList from '@/components/repo/list/table'
import { NextPageContext } from 'next'
import { getSession } from 'next-auth/react'
import { useState } from 'react'

const RepositoryAdd = () => {
  const [search, setSearch] = useState<string>('')

  return (
    <Layout>
      <RepositoryListHeader search={search} setSearch={setSearch} />
      <HorizontalLine />
      <RepositoryList search={search} />
    </Layout>
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

  return { props: {} }
}

export default RepositoryAdd
