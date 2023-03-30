import _ from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subDays,
  subWeeks,
  subMonths,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  endOfMonth,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";

type summaryData = {
  totalDailyTransaction: any;
  totalDailyPayment: any;
  totalWeeklyTransaction: any;
  totalWeeklyPayment: any;
  totalMonthlyTransaction: any;
  totalMonthlyPayment: any;
  totalCountSum: any;
};

const getLastSevenDays = () => {
  const today = startOfToday();
  const sevenDaysAgo = subDays(today, 6);
  const days = eachDayOfInterval({
    start: sevenDaysAgo,
    end: today,
  });
  const weekdays = days.map((day) => format(day, "EEE"));
  return weekdays;
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
  const end = endOfToday();
  const start = subDays(end, 7);
  let amount = {};

  const weekdays = getLastSevenDays();
  const endD = endOfToday();
  const startD = subDays(endD, 7);

  const weekYears = getLastSixWeeks();
  const endW = endOfToday();
  const startW = subWeeks(endW, 7);

  const newToday = new Date();
  const startWeek = startOfWeek(newToday);
  const endWeek = endOfWeek(newToday);
  const startMonth = startOfMonth(newToday);
  const endMonth = endOfMonth(newToday);

  const monthYears = getLastSixMonths();
  const endM = endOfToday();
  const startM = subMonths(endM, 7);

  let summary: summaryData = {
    totalDailyTransaction: undefined,
    totalDailyPayment: undefined,
    totalWeeklyTransaction: undefined,
    totalWeeklyPayment: undefined,
    totalMonthlyTransaction: undefined,
    totalMonthlyPayment: undefined,
    totalCountSum: undefined,
  };

  try {
    const dailyQuery = await prisma.dailyConsumption.findMany({
      where: {
        day: {
          lte: endD,
          gte: startD,
        },
      },
      orderBy: {
        day: "asc",
      },
    });

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

    const tTransaction = await prisma.dailyConsumption.aggregate({
      _count: {
        amount: true,
      },
    });

    const tPayment = await prisma.dailyConsumption.aggregate({
      _sum: {
        amount: true,
      },
    });

    const tDaily = _.chain(dailyQuery)
      .groupBy((tr) => format(new Date(tr.day), "EEE"))
      .mapValues((value, key) => ({ x: key, y: value.length }))
      .values()
      .value();

    const totalDailyTransaction = weekdays.map((day) => {
      const data = tDaily.find((d) => d.x === day);
      if (data) {
        return data;
      } else {
        return { x: day, y: 0 };
      }
    });

    const tWeekly = _.chain(weeklyQuery)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value, key) => ({ x: key, y: value.length }))
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

    const tMonthly = _.chain(monthlyQuery)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value, key) => ({ x: key, y: value.length }))
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

    const tDailyPaymentDaily = _.chain(dailyQuery)
      .groupBy((tr) => format(new Date(tr.day), "EEE"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalDailyPayment = weekdays.map((day) => {
      const data = tDailyPaymentDaily.find((d) => d.x === day);
      if (data) {
        return data;
      } else {
        return { x: day, y: 0 };
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

    // daily
    summary.totalDailyTransaction = [
      { id: "Daily", data: totalDailyTransaction },
    ];
    summary.totalDailyPayment = [{ id: "Daily", data: totalDailyPayment }];

    //weekly
    summary.totalWeeklyTransaction = [
      { id: "Weekly", data: totalWeeklyTransaction },
    ];
    summary.totalWeeklyPayment = [{ id: "Weekly", data: totalWeeklyPayment }];

    // monthly
    summary.totalMonthlyTransaction = [
      { id: "Monthly", data: totalMonthlyTransaction },
    ];
    summary.totalMonthlyPayment = [
      { id: "Monthly", data: totalMonthlyPayment },
    ];

    summary.totalCountSum = [
      {
        id: 1,
        name: "Total Transaction",
        data: Number(Math.round(tTransaction._count.amount).toFixed(1))
          .toLocaleString()
          .toString(),
      },
      {
        id: 2,
        name: "Total Payment",
        data: Number(Math.round(tPayment._sum.amount).toFixed(1))
          .toLocaleString()
          .toString(),
      },
    ];

    // totalTransaction: tTransaction._count.amount,
    // totalPayment: tPayment._sum.amount,

    res.status(200).json(summary);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};

export default handler;
