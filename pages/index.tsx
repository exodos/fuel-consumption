import { InferGetServerSidePropsType } from "next";
import SiteHeader from "../components/layout/header";
import { baseUrl } from "@/lib/config";
import DisplayCount from "@/components/dashboard/count-display";
import DisplayDailyDashBoard from "@/components/dashboard/display-daily";
import { useState } from "react";
import DisplayWeeklyDashBoard from "@/components/dashboard/display-weekly";
import DisplayMonthlyDashBoard from "@/components/dashboard/display-monthly";

const Home = ({
  dailyData,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const {
    totalDailyTransaction,
    totalDailyPayment,
    totalWeeklyTransaction,
    totalWeeklyPayment,
    totalMonthlyTransaction,
    totalMonthlyPayment,
    totalCountSum,
  } = dailyData ?? {};
  return (
    <>
      <SiteHeader
        title={"Fuel Consumption Dashboard Page"}
        content={"Fuel Consumption Dashboard Page"}
      />
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="sm:flex sm:items-center">
            <div className="sm:flex-auto">
              <h1 className="text-xl font-semibold text-gray-50">
                Fuel Consumption Dashboard
              </h1>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <DisplayCount totalCountSum={totalCountSum} />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Daily Trend
          </h1>
          <DisplayDailyDashBoard
            totalDailyTransaction={totalDailyTransaction}
            totalDailyPayment={totalDailyPayment}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Weekly Trend
          </h1>
          <DisplayWeeklyDashBoard
            totalWeeklyTransaction={totalWeeklyTransaction}
            totalWeeklyPayment={totalWeeklyPayment}
          />
        </div>
        <div className="shadow sm:rounded-lg sm:p-6 mt-5 bg-white">
          <h1 className="text-xl font-semibold text-lightGreen justify-center ml-5">
            Monthly Trend
          </h1>
          <DisplayMonthlyDashBoard
            totalMonthlyTransaction={totalMonthlyTransaction}
            totalMonthlyPayment={totalMonthlyPayment}
          />
        </div>
      </div>
    </>
  );
};

export const getServerSideProps = async ({ req, res }) => {
  let dailyData;
  try {
    let result = await fetch(baseUrl + `/api/dashboard/daily`);
    dailyData = await result.json();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
  console.log(dailyData);
  return {
    props: {
      dailyData,
    },
  };
};

export default Home;
