import _, { flatten, result } from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subMonths,
  eachMonthOfInterval,
  endOfMonth,
  startOfMonth,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sourceMapping } from "@/lib/config";

type monthlyData = {
  totalMonthlyTransaction: any;
  totalMonthlyPayment: any;
  totalMonthlyFuel: any;
  totalMonthlyTransactionBySubsidy: any;
  totalMonthlyPaymentBySubsidy: any;
  totalMonthlyFuelBySubsidy: any;
};

const getLastSixMonths = () => {
  const today = startOfToday();
  const twelveMonths = subMonths(today, 7);
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
  const startM = subMonths(endM, 5);
  const today = new Date();

  const cEndM = endOfMonth(today);
  const cStartM = startOfMonth(today);

  let monthlySummary: monthlyData = {
    totalMonthlyTransaction: undefined,
    totalMonthlyPayment: undefined,
    totalMonthlyFuel: undefined,
    totalMonthlyTransactionBySubsidy: undefined,
    totalMonthlyPaymentBySubsidy: undefined,
    totalMonthlyFuelBySubsidy: undefined,
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

    const currentMonthlyQuery = await prisma.currentMonthlyConsumption.findMany(
      {
        where: {
          month: {
            lte: cEndM,
            gte: cStartM,
          },
        },
        orderBy: {
          month: "asc",
        },
      }
    );

    const monthlyWithSubsidy = await prisma.monthlyConsumption.findMany({
      where: {
        AND: [
          {
            month: {
              lte: endM,
              gte: startM,
            },
          },
          {
            OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
          },
        ],
      },
      orderBy: {
        month: "asc",
      },
    });

    const currentMonthWithSubsidy =
      await prisma.currentMonthlyConsumption.findMany({
        where: {
          AND: [
            {
              month: {
                lte: cEndM,
                gte: cStartM,
              },
            },
            {
              OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
            },
          ],
        },
        orderBy: {
          month: "asc",
        },
      });

    const monthlyWithOutSubsidy = await prisma.monthlyConsumption.findMany({
      where: {
        AND: [
          {
            month: {
              lte: endM,
              gte: startM,
            },
          },
          {
            OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
          },
        ],
      },
      orderBy: {
        month: "asc",
      },
    });

    const currentMonthWithOutSubsidy =
      await prisma.currentMonthlyConsumption.findMany({
        where: {
          AND: [
            {
              month: {
                lte: cEndM,
                gte: cStartM,
              },
            },
            {
              OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
            },
          ],
        },
        orderBy: {
          month: "asc",
        },
      });

    const monthlyQueryWithSubsidy = _.concat(
      monthlyWithSubsidy,
      currentMonthWithSubsidy
    );

    const monthlyQueryWithOutSubsidy = _.concat(
      monthlyWithOutSubsidy,
      currentMonthWithOutSubsidy
    );

    const monthlyTransactionWithSubsidy = _.chain(monthlyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const monthlyTransactionWithOutSubsidy = _.chain(monthlyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    monthlySummary.totalMonthlyTransactionBySubsidy =
      monthlyTransactionWithSubsidy.map((item, i) =>
        Object.assign({}, item, monthlyTransactionWithOutSubsidy[i])
      );

    const monthlyPaymentWithSubsidy = _.chain(monthlyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const monthlyPaymentWithOutSubsidy = _.chain(monthlyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    monthlySummary.totalMonthlyPaymentBySubsidy = monthlyPaymentWithSubsidy.map(
      (item, i) => Object.assign({}, item, monthlyPaymentWithOutSubsidy[i])
    );

    const monthlyFuelWithSubsidy = _.chain(monthlyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const monthlyFuelWithOutSubsidy = _.chain(monthlyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.month), "MMM"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({
        month: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    monthlySummary.totalMonthlyFuelBySubsidy = monthlyFuelWithSubsidy.map(
      (item, i) => Object.assign({}, item, monthlyFuelWithOutSubsidy[i])
    );

    const allMonthQuery = _.concat(monthlyQuery, currentMonthlyQuery);

    monthlySummary.totalMonthlyTransaction = _.chain(allMonthQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = monthYears.map((month) => {
          const tt = data.find((d) => d.x === month);
          if (tt) {
            return tt;
          } else {
            return { x: month, y: 0 };
          }
        });
        return { id, data };
      });

    monthlySummary.totalMonthlyPayment = _.chain(allMonthQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
          .groupBy((tr) => format(new Date(tr.month), "MMM"))
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
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = monthYears.map((month) => {
          const tt = data.find((d) => d.x === month);
          if (tt) {
            return tt;
          } else {
            return { x: month, y: 0 };
          }
        });
        return { id, data };
      });

    monthlySummary.totalMonthlyFuel = _.chain(allMonthQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
          .groupBy((tr) => format(new Date(tr.month), "MMM"))
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
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = monthYears.map((month) => {
          const tt = data.find((d) => d.x === month);
          if (tt) {
            return tt;
          } else {
            return { x: month, y: 0 };
          }
        });
        return { id, data };
      });

    res.status(200).json(monthlySummary);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};

export default handler;
