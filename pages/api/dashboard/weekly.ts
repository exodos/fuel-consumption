import _ from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subWeeks,
  eachWeekOfInterval,
  startOfWeek,
  endOfWeek,
} from "date-fns";
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import { sourceMapping } from "@/lib/config";

type weeklyData = {
  totalWeeklyTransaction: any;
  totalWeeklyPayment: any;
  totalWeeklyFuel: any;
  totalWeeklyTransactionBySubsidy: any;
  totalWeeklyPaymentBySubsidy: any;
  totalWeeklyFuelBySubsidy: any;
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
  const startW = subWeeks(endW, 6);
  const today = new Date();
  const cStartW = startOfWeek(today, { weekStartsOn: 1 });
  const cEndW = endOfWeek(today, { weekStartsOn: 1 });

  let weekSummary: weeklyData = {
    totalWeeklyTransaction: undefined,
    totalWeeklyPayment: undefined,
    totalWeeklyFuel: undefined,
    totalWeeklyTransactionBySubsidy: undefined,
    totalWeeklyPaymentBySubsidy: undefined,
    totalWeeklyFuelBySubsidy: undefined,
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

    const currentWeekQuery = await prisma.currentWeeklyConsumption.findMany({
      where: {
        week: {
          lte: cEndW,
          gte: cStartW,
        },
      },
      orderBy: {
        week: "asc",
      },
    });

    const weeklyWithSubsidy = await prisma.weeklyConsumption.findMany({
      where: {
        AND: [
          {
            week: {
              lte: endW,
              gte: startW,
            },
          },
          {
            OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
          },
        ],
      },
      orderBy: {
        week: "asc",
      },
    });

    const weeklyWithOutSubsidy = await prisma.weeklyConsumption.findMany({
      where: {
        AND: [
          {
            week: {
              lte: endW,
              gte: startW,
            },
          },
          {
            OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
          },
        ],
      },
      orderBy: {
        week: "asc",
      },
    });

    const currentWeeklyWithSubsidy =
      await prisma.currentWeeklyConsumption.findMany({
        where: {
          AND: [
            {
              week: {
                lte: cEndW,
                gte: cStartW,
              },
            },
            {
              OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
            },
          ],
        },
        orderBy: {
          week: "asc",
        },
      });

    const currentWeeklyWithOutSubsidy =
      await prisma.currentWeeklyConsumption.findMany({
        where: {
          AND: [
            {
              week: {
                lte: cEndW,
                gte: cStartW,
              },
            },
            {
              OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
            },
          ],
        },
        orderBy: {
          week: "asc",
        },
      });

    const weeklyQueryWithSubsidy = _.concat(
      weeklyWithSubsidy,
      currentWeeklyWithSubsidy
    );

    const weeklyQueryWithOutSubsidy = _.concat(
      weeklyWithOutSubsidy,
      currentWeeklyWithOutSubsidy
    );

    const weeklyTransactionWithSubsidy = _.chain(weeklyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const weeklyTransactionWithOutSubsidy = _.chain(weeklyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.transactionCount),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    weekSummary.totalWeeklyTransactionBySubsidy =
      weeklyTransactionWithSubsidy.map((item, i) =>
        Object.assign({}, item, weeklyTransactionWithOutSubsidy[i])
      );

    const weeklyPaymentWithSubsidy = _.chain(weeklyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const weeklyPaymentWithOutSubsidy = _.chain(weeklyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.amount),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    weekSummary.totalWeeklyPaymentBySubsidy = weeklyPaymentWithSubsidy.map(
      (item, i) => Object.assign({}, item, weeklyPaymentWithOutSubsidy[i])
    );

    const weeklyFuelWithSubsidy = _.chain(weeklyQueryWithSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Subsidy": value,
      }))
      .values()
      .value();

    const weeklyFuelWithOutSubsidy = _.chain(weeklyQueryWithOutSubsidy)
      .groupBy((tr) => format(new Date(tr.week), "Io"))
      .mapValues((value) => {
        return _.round(
          _.sumBy(value, (tr) => tr.fuelInLiters),
          2
        );
      })
      .mapValues((value, key) => ({
        week: key,
        "With Out Subsidy": value,
      }))
      .values()
      .value();

    weekSummary.totalWeeklyFuelBySubsidy = weeklyFuelWithSubsidy.map(
      (item, i) => Object.assign({}, item, weeklyFuelWithOutSubsidy[i])
    );

    const allWeekQuery = _.concat(weeklyQuery, currentWeekQuery);

    weekSummary.totalWeeklyTransaction = _.chain(allWeekQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekYears.map((week) => {
          const tt = data.find((d) => d.x === week);
          if (tt) {
            return tt;
          } else {
            return { x: week, y: 0 };
          }
        });
        return { id, data };
      });

    weekSummary.totalWeeklyPayment = _.chain(allWeekQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekYears.map((week) => {
          const tt = data.find((d) => d.x === week);
          if (tt) {
            return tt;
          } else {
            return { x: week, y: 0 };
          }
        });
        return { id, data };
      });
    weekSummary.totalWeeklyFuel = _.chain(allWeekQuery)
      .groupBy((tr) => tr.sourceId)
      .mapValues((perSourceId, sourceId) => {
        const data = _.chain(perSourceId)
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
        const result = sourceMapping.find((item) => item.id === sourceId).name;
        return {
          id: result,
          data,
        };
      })
      .values()
      .map((tr) => {
        const { data, id } = tr;
        const d = weekYears.map((week) => {
          const tt = data.find((d) => d.x === week);
          if (tt) {
            return tt;
          } else {
            return { x: week, y: 0 };
          }
        });
        return { id, data };
      });

    res.status(200).json(weekSummary);
  } catch (error) {
    res.status(412).json({ message: error.message });
  }
};

export default handler;
