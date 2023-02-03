import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import { authOptions } from "../api/auth/[...nextauth]";
import SiteHeader from "@/components/layout/header";

const BranchDashboardPage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Branch Dashboard"}
        content={"Third Party Insurance Branch Dashboard"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Branch Dashboard
              </h1>
            </div>
          </div>
        </div>
        {/* <ListUser userData={data.feedUser} /> */}
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/auth/signin",
      },
    };
  } else if (session.user.adminRestPassword) {
    return {
      redirect: {
        destination: "/auth/force-reset",
        permanent: false,
      },
    };
  }
  //   else if (session.user.role !== "SUPERADMIN") {
  //     return {
  //       redirect: {
  //         destination: "/",
  //         permanent: false,
  //       },
  //     };
  //   }
  // console.log(session.user);

  return {
    props: {
      session,
    },
  };
};

export default BranchDashboardPage;