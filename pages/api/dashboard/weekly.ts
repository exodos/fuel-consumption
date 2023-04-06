import _ from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subWeeks,
  eachWeekOfInterval,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type weeklyData = {
  totalWeeklyTransaction: any;
  totalWeeklyPayment: any;
  totalWeeklyFuel: any;
};

const getLastSixWeeks = () => {
  const today = startOfToday();
  const sixWeeksAgo = subWeeks(today, 6);
  const weeks = eachWeekOfInterval({
    start: sixWeeksAgo,
    end: today,
  });

  const weekYears = weeks.map((week) => format(week, "Io"));
  return weekYears;
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const weekYears = getLastSixWeeks();
  const endW = endOfToday();
  const startW = subWeeks(endW, 7);

  let weekSummary: weeklyData = {
    totalWeeklyTransaction: undefined,
    totalWeeklyPayment: undefined,
    totalWeeklyFuel: undefined,
  };

  try {
    const weeklyQuery = await prisma.weeklyConsumption.findMany({
      where: {
        week: {
          lte: endW,
          gte: startW,
        },
      },
      orderBy: {
        week: "asc",
      },
    });

    const tWeekly = _.chain(weeklyQuery)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalWeeklyTransaction = weekYears.map((week) => {
      const data = tWeekly.find((d) => d.x === week);
      if (data) {
        return data;
      } else {
        return { x: week, y: 0 };
      }
    });

    const tPaymentWeekly = _.chain(weeklyQuery)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalWeeklyPayment = weekYears.map((week) => {
      const data = tPaymentWeekly.find((d) => d.x === week);
      if (data) {
        return data;
      } else {
        return { x: week, y: 0 };
      }
    });

    const tFuelWeekly = _.chain(weeklyQuery)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalWeeklyFuel = weekYears.map((week) => {
      const data = tFuelWeekly.find((d) => d.x === week);
      if (data) {
        return data;
      } else {
        return { x: week, y: 0 };
      }
    });

    weekSummary.totalWeeklyTransaction = [
      { id: "Weekly", data: totalWeeklyTransaction },
    ];
    weekSummary.totalWeeklyPayment = [
      { id: "Weekly", data: totalWeeklyPayment },
    ];
    weekSummary.totalWeeklyFuel = [{ id: "Weekly", data: totalWeeklyFuel }];

    res.status(200).json(weekSummary);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};

export default handler;
