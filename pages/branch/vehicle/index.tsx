import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { SessionProvider, useSession } from "next-auth/react";
import { initializeApollo } from "../../../lib/apollo";
import { gql } from "@apollo/client";
import { authOptions } from "../../api/auth/[...nextauth]";
import { BsPlusCircleFill, BsFillArrowUpCircleFill } from "react-icons/bs";
import { useState } from "react";
import BranchAddVehicleModal from "@/vehicle/branch-add-vehicle";
import ListBranchVehicle from "@/vehicle/branch-list-vehicle";
import { useRouter } from "next/router";
import SiteHeader from "@/components/layout/header";
import { getServerSession } from "next-auth";

const FeedVehicleBranch = gql`
  query FeedVehicleBranch(
    $branchId: String!
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [VehicleOrderByInput!]
  ) {
    feedVehicleBranch(
      branchId: $branchId
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      vehicle {
        id
        plateNumber
        engineNumber
        chassisNumber
        vehicleType
        carryingCapacityInGoods
        carryingCapacityInPersons
        vehicleStatus
        isInsured
        createdAt
        updatedAt
        insureds {
          id
          insuredName
          mobileNumber
        }
        branchs {
          id
          branchName
          mobileNumber
        }
      }
      totalVehicle
      maxPage
    }
    plateCode {
      id
      code
    }
    regionCode {
      id
      regionApp
    }
    listAllBranch {
      id
      branchName
    }
  }
`;

const BranchVehiclePage = ({
      data,
      branchId,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: session, status } = useSession();
  const [showAddModal, setShowAddModal] = useState(false);

  const { pathname } = useRouter();

  const handleAdd = () => {
    setShowAddModal((prev) => !prev);
  };
  return (
    <>
      <SiteHeader
        title={"Third Party Insurance Vehicle Page"}
        content={"Third Party Insurance Vehicles For Branch"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-white">Vehicle</h1>
              <p className="text-base font-medium text-gray-100">
                List Of All Vehicles
              </p>
            </div>
            {session?.user && (
              <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
                {(session.user.memberships.role === "INSURER" ||
                  session.user.memberships.role === "MEMBER") && (
                  <button
                    type="button"
                    className="inline-flex items-center"
                    onClick={() => handleAdd()}
                  >
                    <BsPlusCircleFill
                      className="flex-shrink-0 h-8 w-8 text-sm font-medium text-gray-50 hover:text-gray-300"
                      aria-hidden="true"
                    />
                  </button>
                )}
                {(session.user.memberships.role === "INSURER" ||
                  session.user.memberships.role === "MEMBER") && (
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
        <ListBranchVehicle
          vehicleData={data.feedVehicleBranch}
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branchId={branchId}
        />
      </div>
      {showAddModal ? (
        <BranchAddVehicleModal
          regionCode={data.regionCode}
          codeList={data.plateCode}
          branchId={branchId}
          href={pathname}
        />
      ) : null}
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
  const branchId = session.user.memberships.branchId;

  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedVehicleBranch,
    variables: {
      branchId: branchId,
      filter: filter,
      skip: skip,
      take: take,
      orderBy: [
        {
          updatedAt: "desc",
        },
      ],
    },
  });

  return {
    props: {
      session,
      data,
      branchId,
    },
  };
};

export default BranchVehiclePage;