import _ from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subMonths,
  eachMonthOfInterval,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type monthlyData = {
  totalMonthlyTransaction: any;
  totalMonthlyPayment: any;
  totalMonthlyFuel: any;
};

const getLastSixMonths = () => {
  const today = startOfToday();
  const twelveMonths = subMonths(today, 6);
  const months = eachMonthOfInterval({
    start: twelveMonths,
    end: today,
  });
  const monthYears = months.map((month) => format(month, "MMM"));
  return monthYears;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const monthYears = getLastSixMonths();
  const endM = endOfToday();
  const startM = subMonths(endM, 7);

  let monthlySummary: monthlyData = {
    totalMonthlyTransaction: undefined,
    totalMonthlyPayment: undefined,
    totalMonthlyFuel: undefined,
  };

  try {
    const monthlyQuery = await prisma.monthlyConsumption.findMany({
      where: {
        month: {
          lte: endM,
          gte: startM,
        },
      },
      orderBy: {
        month: "asc",
      },
    });

    const tMonthly = _.chain(monthlyQuery)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalMonthlyTransaction = monthYears.map((month) => {
      const data = tMonthly.find((d) => d.x === month);
      if (data) {
        return data;
      } else {
        return { x: month, y: 0 };
      }
    });

    const tPaymentMonthly = _.chain(monthlyQuery)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(_.sumBy(value, (tr) => tr.amount));
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalMonthlyPayment = monthYears.map((month) => {
      const data = tPaymentMonthly.find((d) => d.x === month);
      if (data) {
        return data;
      } else {
        return { x: month, y: 0 };
      }
    });

    const tFuelMonthly = _.chain(monthlyQuery)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(_.sumBy(value, (tr) => tr.fuelInLiters));
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalMonthlyFuel = monthYears.map((month) => {
      const data = tFuelMonthly.find((d) => d.x === month);
      if (data) {
        return data;
      } else {
        return { x: month, y: 0 };
      }
    });

    monthlySummary.totalMonthlyTransaction = [
      { id: "Monthly", data: totalMonthlyTransaction },
    ];
    monthlySummary.totalMonthlyPayment = [
      { id: "Monthly", data: totalMonthlyPayment },
    ];

    monthlySummary.totalMonthlyFuel = [
      { id: "Monthly", data: totalMonthlyFuel },
    ];
    res.status(200).json(monthlySummary);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};

export default handler;
