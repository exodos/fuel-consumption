import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import nc from "next-connect";
import _, { result } from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subDays,
  eachDayOfInterval,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { sourceMapping } from "@/lib/config";

type dailyData = {
  allTransaction: any;
  allPayment: any;
  totalCountSum: any;
  totalTransactionBySource: any;
  totalPaymentBySource: any;
  totalDailyTransaction: any;
  totalDailyPayment: any;
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
  // .use(async (req, res, next) => {
  //   const session = await getServerSession(req, res, authOptions);

  //   if (!session) {
  //     res.status(401).json({ message: "unauthenticated" });
  //   } else {
  //     next();
  //   }
  // })
  .get(async (req, res, next) => {
    const weekdays = getLastSevenDays();
    const endD = endOfToday();
    const startD = subDays(endD, 7);

    let dailySummary: dailyData = {
      allTransaction: undefined,
      allPayment: undefined,
      totalCountSum: undefined,
      totalTransactionBySource: undefined,
      totalPaymentBySource: undefined,
      totalDailyTransaction: undefined,
      totalDailyPayment: undefined,
      totalDailyFuel: undefined,
    };

    const allTotalTransactionT = 12731996;
    const allTotalWithoutT = 472113;
    const allTotalWithoutP = 545973469.54;
    const thereB = 3000000000;

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
      _sum: {
        transactionCount: true,
      },
    });

    const tPayment = await prisma.consumption.aggregate({
      _sum: {
        amount: true,
      },
    });

    const tTransactionWithSubsidy = await prisma.consumption.count({
      where: {
        reasonTypeCode: "844",
      },
    });

    const tTransactionWithOutSubsidy = await prisma.consumption.count({
      where: {
        NOT: {
          reasonTypeCode: "844",
        },
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

    const monthlyAmount = await prisma.monthlyConsumption.aggregate({
      _sum: {
        amount: true,
      },
    });

    dailySummary.totalDailyTransaction = _.chain(dailyQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekdays.map((day) => {
          const tt = data.find((d) => d.x === day);
          if (tt) {
            return tt;
          } else {
            return { x: day, y: 0 };
          }
        });
        return { id, data };
      });

    dailySummary.totalDailyPayment = _.chain(dailyQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return { id: result, data };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekdays.map((day) => {
          const tt = data.find((d) => d.x === day);
          if (tt) {
            return tt;
          } else {
            return { x: day, y: 0 };
          }
        });
        return { id, data };
      });

    dailySummary.totalDailyFuel = _.chain(dailyQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return { id: result, data };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekdays.map((day) => {
          const tt = data.find((d) => d.x === day);
          if (tt) {
            return tt;
          } else {
            return { x: day, y: 0 };
          }
        });
        return { id, data };
      });

    dailySummary.totalTransactionBySource = _.chain(dailyQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => {
        const rr = sourceMapping.find((item) => item.id === key).name;
        if (rr === "TeleBirr") {
          return {
            id: Number(key),
            name: "Total Transaction",
            data: Number(Math.round(value + allTotalTransactionT).toFixed(1))
              .toLocaleString()
              .toString(),
            icon: "HiOutlineRefresh",
            via: rr.toUpperCase(),
          };
        }
        return {
          id: Number(key),
          name: "Total Transaction",
          data: Number(Math.round(value).toFixed(1))
            .toLocaleString()
            .toString(),
          icon: "HiOutlineRefresh",
          via: rr.toUpperCase(),
        };
      })
      .values()
      .value();

    dailySummary.allTransaction = [
      {
        id: 1,
        name: "Total Transaction",
        data: Number(
          Math.round(
            tTransaction._sum.transactionCount + allTotalTransactionT
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "ALL",
      },
      {
        id: 2,
        name: "Total Transaction With Subsidy",
        data: Number(
          Math.round(tTransactionWithSubsidy + allTotalTransactionT).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "TELEBIRR",
      },
      {
        id: 3,
        name: "Total Transaction WithOut Subsidy",
        data: Number(
          Math.round(tTransactionWithOutSubsidy + allTotalWithoutT).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "ALL",
      },
    ];

    const monthlyAmountBySource = await prisma.monthlyConsumption.groupBy({
      by: ["sourceId"],
      _sum: {
        amount: true,
      },
    });

    dailySummary.totalPaymentBySource = _.chain(dailyQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => {
        const rr = sourceMapping.find((item) => item.id === key).name;
        const monthlySum = monthlyAmountBySource.find(
          (item) => item.sourceId === key
        )._sum.amount;
        if (rr === "TeleBirr") {
          return {
            id: Number(key),
            name: "Total Payment",
            data: Number(Math.round(value + monthlySum + thereB).toFixed(1))
              .toLocaleString()
              .toString(),
            icon: "HiCurrencyDollar",
            via: rr.toUpperCase(),
          };
        }
        return {
          id: Number(key),
          name: "Total Payment",
          data: Number(Math.round(value + monthlySum).toFixed(1))
            .toLocaleString()
            .toString(),
          icon: "HiCurrencyDollar",
          via: rr.toUpperCase(),
        };
      })
      .values()
      .value();

    dailySummary.allPayment = [
      {
        id: 1,
        name: "Total Payment",
        data: Number(
          Math.round(
            tPayment._sum.amount + monthlyAmount._sum.amount + thereB
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "ALL",
      },
      {
        id: 1,
        name: "Total Payment With Subsidy",
        data: Number(
          Math.round(
            tPaymentWithSubsidy._sum.amount + monthlyAmount._sum.amount + thereB
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "TELEBIRR",
      },
      {
        id: 3,
        name: "Total Payment WithOut Subsidy",
        data: Number(
          Math.round(
            tPaymentWithOutSubsidy._sum.amount + allTotalWithoutP
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "ALL",
      },
    ];

    dailySummary.totalCountSum = [
      {
        id: 1,
        name: "Total Transaction",
        data: Number(
          Math.round(
            tTransaction._sum.transactionCount + allTotalTransactionT
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "TeleBirr",
      },
      {
        id: 2,
        name: "Total Payment",
        data: Number(
          Math.round(
            tPayment._sum.amount + monthlyAmount._sum.amount + thereB
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "TeleBirr",
      },
      {
        id: 3,
        name: "Total Transaction With Subsidy",
        data: Number(
          Math.round(tTransactionWithSubsidy + allTotalTransactionT).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "TeleBirr",
      },
      {
        id: 4,
        name: "Total Payment With Subsidy",
        data: Number(
          Math.round(
            tPaymentWithSubsidy._sum.amount + monthlyAmount._sum.amount + thereB
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "TeleBirr",
      },
      {
        id: 5,
        name: "Total Transaction WithOut Subsidy",
        data: Number(
          Math.round(tTransactionWithOutSubsidy + allTotalWithoutT).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiOutlineRefresh",
        via: "TeleBirr",
      },
      {
        id: 6,
        name: "Total Payment WithOut Subsidy",
        data: Number(
          Math.round(
            tPaymentWithOutSubsidy._sum.amount + allTotalWithoutP
          ).toFixed(1)
        )
          .toLocaleString()
          .toString(),
        icon: "HiCurrencyDollar",
        via: "TeleBirr",
      },
    ];

    res.status(200).json(dailySummary);
  });

export default handler;
