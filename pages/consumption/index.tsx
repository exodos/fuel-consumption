import { GetServerSideProps, InferGetServerSidePropsType } from "next";
import { gql } from "@apollo/client";
import SiteHeader from "@/components/layout/header";
import { initializeApollo } from "@/lib/apollo";
import ListConsumption from "@/components/consumption/list-consumption";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]";

const FeedConsumption = gql`
  query FeedConsumption(
    $filter: String
    $skip: Int
    $take: Int
    $orderBy: [ConsumptionOrderByInput!]
  ) {
    feedConsumption(
      filter: $filter
      skip: $skip
      take: $take
      orderBy: $orderBy
    ) {
      consumptions {
        id
        transactionNumber
        amount
        fuelInLiters
        fuelType
        plateCode
        plateRegion
        plateNumber
        paidAt
        debitAccountNumber
        creditAccountNumber
        fuelStationRegion
        fuelStationName
        # firstName
        mobileNumber
        companyId
        createdAt
        updatedAt
      }
      totalConsumption
      maxPage
    }
  }
`;

const ConsumptionPage = ({
      data,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <SiteHeader
        title={"Fuel Consumption Page"}
        content={"Fuel Consumption Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Consumption
              </h1>
              <p className="text-base font-medium text-gray-50 pt-1">
                List Of All Consumption
              </p>
            </div>
          </div>
        </div>
        <ListConsumption consumptionData={data.feedConsumption} />
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
  } else if (session?.user?.adminResetPassword) {
    return {
      redirect: {
        destination: "/auth/force-reset",
        permanent: false,
      },
    };
  }
  const { query } = context;
  const page = query.page || 1;
  const filter = query.search;
  const curPage: any = page;
  const perPage = 10;
  const take = perPage;
  const skip = (curPage - 1) * perPage;
  const apolloClient = initializeApollo();

  const { data } = await apolloClient.query({
    query: FeedConsumption,
    variables: {
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
      data,
    },
  };
};

export default ConsumptionPage;
