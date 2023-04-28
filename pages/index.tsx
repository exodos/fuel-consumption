import { InferGetServerSidePropsType } from "next";
import SiteHeader from "../components/layout/header";
import { baseUrl } from "@/lib/config";
import DisplayDailyDashBoard from "@/components/dashboard/display-daily";
import DisplayWeeklyDashBoard from "@/components/dashboard/display-weekly";
import DisplayMonthlyDashBoard from "@/components/dashboard/display-monthly";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]";
import DisplayRegionData from "@/components/dashboard/display-region";
import DisplayGasStationData from "@/components/dashboard/display-gas-station";
import DisplayTransaction from "@/components/dashboard/transaction-display";
import DisplaySource from "@/components/dashboard/diaplay-source";
import DisplayDailyWithSubsidy from "@/components/dashboard/diaplay-daily-with-subsidy";

const Home = ({
      dailyData,
      weeklyData,
      monthlyData,
      regionData,
    }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    totalDailyTransaction,
    totalDailyPayment,
    totalDailyFuel,
    totalTransactionBySourcePie,
    totalPaymentBySourcePie,
    totalTransactionPayment,
    totalTransactionPaymentWithSubsidy,
    totalTransactionPaymentWithOutSubsidy,
    totalDailyTransactionBySubsidy,
    totalDailyPaymentBySubsidy,
    totalDailyFuelBySubsidy,
  } = dailyData ?? {};
  const { totalWeeklyTransaction, totalWeeklyPayment, totalWeeklyFuel } =
    weeklyData ?? {};
  const { totalMonthlyTransaction, totalMonthlyPayment, totalMonthlyFuel } =
    monthlyData ?? {};
  const { amountMapping, fuelMapping, gasStationAmount, gasStationFuel } =
    regionData ?? {};
  return (
    <>
      <SiteHeader
        title={"Fuel Consumption Dashboard Page"}
        content={"Fuel Consumption Dashboard Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div>
          <DisplayTransaction
            totalTransactionPayment={totalTransactionPayment}
            totalTransactionPaymentWithSubsidy={
              totalTransactionPaymentWithSubsidy
            }
            totalTransactionPaymentWithOutSubsidy={
              totalTransactionPaymentWithOutSubsidy
            }
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Total Transaction and Payment Via Source
          </h1>
          <DisplaySource
            totalTransactionBySourcePie={totalTransactionBySourcePie}
            totalPaymentBySourcePie={totalPaymentBySourcePie}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            {/* Total Daily Transaction,Payment and Fuel With And Without Subsidy */}
            Total Daily With And Without Subsidy Comparison
          </h1>
          <DisplayDailyWithSubsidy
            totalDailyTransactionBySubsidy={totalDailyTransactionBySubsidy}
            totalDailyPaymentBySubsidy={totalDailyPaymentBySubsidy}
            totalDailyFuelBySubsidy={totalDailyFuelBySubsidy}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Daily Trend
          </h1>
          <DisplayDailyDashBoard
            totalDailyTransaction={totalDailyTransaction}
            totalDailyPayment={totalDailyPayment}
            totalDailyFuel={totalDailyFuel}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Weekly Trend
          </h1>
          <DisplayWeeklyDashBoard
            totalWeeklyTransaction={totalWeeklyTransaction}
            totalWeeklyPayment={totalWeeklyPayment}
            totalWeeklyFuel={totalWeeklyFuel}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Monthly Trend
          </h1>
          <DisplayMonthlyDashBoard
            totalMonthlyTransaction={totalMonthlyTransaction}
            totalMonthlyPayment={totalMonthlyPayment}
            totalMonthlyFuel={totalMonthlyFuel}
            amountMapping={amountMapping}
            fuelMapping={fuelMapping}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Regional Trend
          </h1>
          <DisplayRegionData
            amountMapping={amountMapping}
            fuelMapping={fuelMapping}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Gas Station Trend
          </h1>
          <DisplayGasStationData
            gasStationAmount={gasStationAmount}
            gasStationFuel={gasStationFuel}
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions);
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

  let dailyData = null,
    weeklyData = null,
    monthlyData = null,
    regionData = null;

  try {
    let [daily, weekly, monthly, region] = await Promise.all([
      await fetch(baseUrl + `/api/dashboard/daily`),
      await fetch(baseUrl + `/api/dashboard/weekly`),
      await fetch(baseUrl + `/api/dashboard/monthly`),
      await fetch(baseUrl + `/api/dashboard/region-gas-station`),
    ]);

    dailyData = await daily.json();
    weeklyData = await weekly.json();
    monthlyData = await monthly.json();
    regionData = await region.json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

  // console.log(session);

  return {
    props: {
      session,
      dailyData,
      weeklyData,
      monthlyData,
      regionData,
    },
  };
};

export default Home;
