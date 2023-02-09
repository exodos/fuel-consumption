import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { getServerSession, unstable_getServerSession } from "next-auth";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import ListCertificate from "@/certificate/list-certificate";
import AddCertificateModal from "@/certificate/add-certificate";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import Link from "next/link";

const FeedCertificate = gql`
  query FeedCertificate(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [CertificateOrderByInput!]
  ) {
    feedCertificate(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      certificate {
        id
        certificateNumber
        issuedDate
        premiumTarif
        updatedAt
        policies {
          policyNumber
          policyStartDate
          policyExpireDate
          policyIssuedConditions
          personsEntitledToUse
        }
        vehicles {
          plateNumber
        }
      }
      totalCertificate
      maxPage
    }
    plateCode {
      code
    }
    regionCode {
      regionApp
    }
    listAllOrganization {
      id
      orgName
    }
  }
`;

const AdminCertificatePage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const { pathname } = useRouter();

  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Certificate Page"}
        content={"Third Party Insurance Certificate Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Certificate
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Certificates
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {session.user.memberships.role === "SUPERADMIN" && (
                  <Link
                    href={{
                      pathname: "/admin/certificate/add-certificate",
                      query: {
                        returnPage: pathname,
                      },
                    }}
                    passHref
                    legacyBehavior
                  >
                    <button type="button" className="inline-flex items-center">
                      <BsPlusCircleFill
                        className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                        aria-hidden="true"
                      />
                    </button>
                  </Link>
                )}
                {session.user.memberships.role === "SUPERADMIN" && (
                  <button type="button" className="inline-flex items-center">
                    <BsFillArrowUpCircleFill
                      className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                      aria-hidden="true"
                    />
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        <ListCertificate certificateData={data.feedCertificate} />
      </div>
      {/* {showAddModal ? (
        <AddCertificateModal
          regionCode={data.regionCode}
          codeList={data.plateCode}
        />
      ) : null} */}
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
  }

  const { query } = context;

  const page = query.page || 1;

  const filter = query.search;

  const curPage: any = page;
  const perPage = 20;

  const take = perPage;
  const skip = (curPage - 1) * perPage;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedCertificate,
    variables: {
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          issuedDate: "desc",
        },
      ],
    },
  });

  return {
    props: {
      session,
      take: take,
      skip: skip,
      data,
    },
  };
};

export default AdminCertificatePage;
