import React, { ReactNode } from "react";
import { getSession, useSession } from "next-auth/react";
import { NextPageContext } from "next";
import Layout from "@/components/layout";

export default function SimpleSidebar({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();

  return (
    <Layout>
      <h1>Hello World</h1>
    </Layout>
  );
}

// import Head from "next/head";
// import Header from "../components/header";
// import { getSession, useSession } from "next-auth/react";
// import { NextPageContext } from "next";
// import { useEffect } from "react";
// import { Octokit } from "octokit";

// export default function Home() {
//   const { data: session, status } = useSession();
//   const loading = status === "loading";

//   console.log(session);

//   //   useEffect(() => {
//   //     if (!session) return;
//   //     (async () => {
//   //       const octokit = new Octokit({ auth: session.accessToken });
//   //       const res = await octokit.rest.users.getAuthenticated();
//   //       const repos = await octokit.rest.repos.listForAuthenticatedUser();
//   //       const r = await octokit.request(
//   //         "GET /repos/{owner}/{repo}/contents/test.json",
//   //         {
//   //           owner: "macroful",
//   //           repo: "translate-test",
//   //           headers: {
//   //             "X-GitHub-Api-Version": "2022-11-28",
//   //           },
//   //         }
//   //       );
//   //       //   const r = await octokit.request(
//   //       //     "PUT /repos/{owner}/{repo}/contents/{path}",
//   //       //     {
//   //       //       owner: "macroful",
//   //       //       repo: "translate-test",
//   //       //       path: "test.json",
//   //       //       message: "Update test.json",
//   //       //       committer: {
//   //       //         name: "Timo Koenig",
//   //       //         email: "timo@timokoenig.com",
//   //       //       },
//   //       //       content: Buffer.from(
//   //       //         JSON.stringify({ hello: "world", foo: "bar" })
//   //       //       ).toString("base64"),
//   //       //       headers: {
//   //       //         "X-GitHub-Api-Version": "2022-11-28",
//   //       //       },
//   //       //     }
//   //       //   );
//   //       console.log(JSON.parse(new Buffer(r.data.content, "base64").toString()));
//   //     })();
//   //   }, [session]);

//   return (
//     <div>
//       <Head>
//         <title>Nextjs | Next-Auth</title>
//         <link rel="icon" href="/favicon.ico" />
//       </Head>
//       <Header />
//       <main>
//         <h1>Authentication in Next.js app using Next-Auth</h1>
//         <div>
//           {loading && <div>Loading...</div>}
//           {session && (
//             <>
//               <p style={{ marginBottom: "10px" }}>
//                 {" "}
//                 Welcome, {session.user?.name ?? session.user?.email}
//               </p>{" "}
//               <br />
//               <img src={session.user.image} alt="" />
//             </>
//           )}
//           {!session && (
//             <>
//               <p>Please Sign in</p>
//               <img
//                 src="https://cdn.dribbble.com/users/759083/screenshots/6915953/2.gif"
//                 alt=""
//               />
//               <p>
//                 GIF by{" "}
//                 <a href="https://dribbble.com/shots/6915953-Another-man-down/attachments/6915953-Another-man-down?mode=media">
//                   Another man
//                 </a>{" "}
//               </p>
//             </>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// export async function getServerSideProps(context: NextPageContext) {
//   const { req } = context;
//   const session = await getSession({ req });

//   if (!session) {
//     return {
//       redirect: { destination: "/signin" },
//     };
//   }

//   return { props: {} };
// }
