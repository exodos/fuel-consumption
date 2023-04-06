import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import nc from "next-connect";
import { authOptions } from "./auth/[...nextauth]";
import _ from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subDays,
  eachDayOfInterval,
} from "date-fns";
import { prisma } from "@/lib/prisma";

type dailyData = {
  totalDailyTransaction: any;
  totalDailyPayment: any;
  totalCountSum: any[];
  totalDailyFuel: any;
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

const handler = nc<NextApiRequest, NextApiResponse>({
  onError: (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(async (req, res, next) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: "unauthenticated" });
    } else {
      next();
    }
  })
  .get(async (req, res, next) => {
    const weekdays = getLastSevenDays();
    const endD = endOfToday();
    const startD = subDays(endD, 7);

    let dailySummary: dailyData = {
      totalDailyTransaction: undefined,
      totalDailyPayment: undefined,
      totalCountSum: undefined,
      totalDailyFuel: undefined,
    };

    const session = await getServerSession(req, res, authOptions);
    console.log(session);
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

    const tTransactionWithSubsidy = await prisma.consumption.aggregate({
      where: {
        reasonTypeCode: "844",
      },
      _count: {
        amount: true,
      },
    });

    const tTransactionWithOutSubsidy = await prisma.consumption.aggregate({
      where: {
        NOT: {
          reasonTypeCode: "844",
        },
      },
      _count: {
        amount: true,
      },
    });

    const tPaymentWithSubsidy = await prisma.consumption.aggregate({
      where: {
        reasonTypeCode: "844",
      },
      _sum: {
        amount: true,
      },
    });
    const tPaymentWithOutSubsidy = await prisma.consumption.aggregate({
      where: {
        NOT: {
          reasonTypeCode: "844",
        },
      },
      _sum: {
        amount: true,
      },
    });

    const tDaily = _.chain(dailyQuery)
      .groupBy((tr) => format(new Date(tr.day), "EEE"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
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

    const tDailyFuelDaily = _.chain(dailyQuery)
      .groupBy((tr) => format(new Date(tr.day), "EEE"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({ x: key, y: value }))
      .values()
      .value();

    const totalDailyFuel = weekdays.map((day) => {
      const data = tDailyFuelDaily.find((d) => d.x === day);
      if (data) {
        return data;
      } else {
        return { x: day, y: 0 };
      }
    });

    // daily
    dailySummary.totalDailyTransaction = [
      { id: "Daily", data: totalDailyTransaction },
    ];
    dailySummary.totalDailyPayment = [{ id: "Daily", data: totalDailyPayment }];
    dailySummary.totalDailyFuel = [{ id: "Daily", data: totalDailyFuel }];

    dailySummary.totalCountSum = [
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
      {
        id: 3,
        name: "Totral Transaction With Subsidy",
        data: Number(
          Math.round(tTransactionWithSubsidy._count.amount).toFixed(1)
        )
          .toLocaleString()
          .toString(),
      },
      {
        id: 4,
        name: "Total Payment With Subsidy",
        data: Number(Math.round(tPaymentWithSubsidy._sum.amount).toFixed(1))
          .toLocaleString()
          .toString(),
      },
      {
        id: 5,
        name: "Totral Transaction WithOut Subsidy",
        data: Number(
          Math.round(tTransactionWithOutSubsidy._count.amount).toFixed(1)
        )
          .toLocaleString()
          .toString(),
      },
      {
        id: 6,
        name: "Total Payment WithOut Subsidy",
        data: Number(Math.round(tPaymentWithOutSubsidy._sum.amount).toFixed(1))
          .toLocaleString()
          .toString(),
      },
    ];

    // totalTransaction: tTransaction._count.amount,
    // totalPayment: tPayment._sum.amount,

    res.status(200).json(dailySummary);
  });

export default handler;
