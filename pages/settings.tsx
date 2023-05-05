import React from "react";
import Layout from "@/components/layout";
import { Container, Button } from "@chakra-ui/react";
import SettingsHeader from "@/components/settings/header";
import HorizontalLine from "@/components/global/horizontal-line";
import { getSession, signOut } from "next-auth/react";
import { NextPageContext } from "next";
import { useAppStore } from "@/utils/store/app/app-context";

const Settings = () => {
  const { setLocalRepositories } = useAppStore();

  const onSignOut = async () => {
    await signOut();
    setLocalRepositories([]);
  };

  return (
    <Layout>
      <Container>
        <SettingsHeader />
      </Container>
      <HorizontalLine />
      <Container py={8}>
        <Button variant="primary" w="full" onClick={onSignOut}>
          Sign Out
        </Button>
      </Container>
    </Layout>
  );
};

export async function getServerSideProps(context: NextPageContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/signin" },
    };
  }

  return { props: {} };
}

export default Settings;
