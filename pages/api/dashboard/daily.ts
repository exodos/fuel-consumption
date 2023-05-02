import { NextApiRequest, NextApiResponse } from "next";
import _, { result } from "lodash";
import {
  startOfToday,
  format,
  endOfToday,
  subDays,
  eachDayOfInterval,
  endOfYesterday,
} from "date-fns";
import { prisma } from "@/lib/prisma";
import { sourceMapping } from "@/lib/config";
import { DailyConsumption, TodayConsumption } from "@prisma/client";

type dailyData = {
  totalTransactionBySource: any;
  totalPaymentBySource: any;
  totalDailyTransaction: any;
  totalDailyPayment: any;
  totalDailyFuel: any;
  totalTransactionBySourcePie: any;
  totalPaymentBySourcePie: any;
  totalTransactionPayment: any;
  totalTransactionPaymentWithSubsidy: any;
  totalTransactionPaymentWithOutSubsidy: any;
  totalDailyTransactionBySubsidy: any;
  totalDailyPaymentBySubsidy: any;
  totalDailyFuelBySubsidy: any;
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

interface DailyToday {
  DailyConsumption: DailyConsumption[];
  TodayConsumption: TodayConsumption[];
}

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const weekdays = getLastSevenDays();
  const endD = endOfYesterday();
  const startD = subDays(endD, 6);

  let dailySummary: dailyData = {
    totalTransactionBySource: undefined,
    totalPaymentBySource: undefined,
    totalDailyTransaction: undefined,
    totalDailyPayment: undefined,
    totalDailyFuel: undefined,
    totalTransactionBySourcePie: undefined,
    totalPaymentBySourcePie: undefined,
    totalTransactionPayment: undefined,
    totalTransactionPaymentWithSubsidy: undefined,
    totalTransactionPaymentWithOutSubsidy: undefined,
    totalDailyTransactionBySubsidy: undefined,
    totalDailyPaymentBySubsidy: undefined,
    totalDailyFuelBySubsidy: undefined,
  };

  const totalTransactionWithSubsidy = 12731996;
  const allTotalTransactionWithOutSubsidy = 472113;
  const paymentWithoutSubsidy = 545973469.54;
  const thereB = 3000000000;
  const allTransactionSum =
    totalTransactionWithSubsidy + allTotalTransactionWithOutSubsidy;

  const allTotalTransaction =
    totalTransactionWithSubsidy + allTotalTransactionWithOutSubsidy;

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

  const totalDailyQuery = await prisma.dailyConsumption.findMany({
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

  const todayQuery = await prisma.todayConsumption.findMany({
    where: {
      day: {
        lte: endOfToday(),
        gte: startOfToday(),
      },
    },
    orderBy: {
      day: "asc",
    },
  });

  const todayAndDaily = _.concat(totalDailyQuery, todayQuery);

  const dailyWithSubsidy = await prisma.dailyConsumption.findMany({
    where: {
      AND: [
        {
          day: {
            lte: endD,
            gte: startD,
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
    orderBy: {
      day: "asc",
    },
  });

  const todayWithSubsidy = await prisma.todayConsumption.findMany({
    where: {
      AND: [
        {
          day: {
            lte: endOfToday(),
            gte: startOfToday(),
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
    orderBy: {
      day: "asc",
    },
  });

  const dailyQueryWithSubsidy = _.concat(dailyWithSubsidy, todayWithSubsidy);

  const dailyWithOutSubsidy = await prisma.dailyConsumption.findMany({
    where: {
      AND: [
        {
          day: {
            lte: endD,
            gte: startD,
          },
        },
        {
          OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
        },
      ],
    },
    orderBy: {
      day: "asc",
    },
  });

  const todayWithOutSubsidy = await prisma.todayConsumption.findMany({
    where: {
      AND: [
        {
          day: {
            lte: endOfToday(),
            gte: startOfToday(),
          },
        },
        {
          OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
        },
      ],
    },
    orderBy: {
      day: "asc",
    },
  });

  const dailyQueryWithOutSubsidy = _.concat(
    dailyWithOutSubsidy,
    todayWithOutSubsidy
  );

  const dailyTransactionCount = await prisma.dailyConsumption.aggregate({
    where: {
      day: {
        lte: endD,
        gte: startD,
      },
    },
    _sum: {
      transactionCount: true,
    },
  });

  const totalTransactionCount = await prisma.todayConsumption.aggregate({
    where: {
      day: {
        lte: endOfToday(),
        gte: startOfToday(),
      },
    },
    _sum: {
      transactionCount: true,
    },
  });

  const dTotalTransaction =
    dailyTransactionCount._sum.transactionCount +
    totalTransactionCount._sum.transactionCount;

  const dailyTotalPayment = await prisma.dailyConsumption.aggregate({
    where: {
      day: {
        lte: endD,
        gte: startD,
      },
    },
    _sum: {
      amount: true,
    },
  });

  const todayTotalPayment = await prisma.todayConsumption.aggregate({
    where: {
      day: {
        lte: endOfToday(),
        gte: startOfToday(),
      },
    },
    _sum: {
      amount: true,
    },
  });

  const todayAndDailyPayment =
    dailyTotalPayment._sum.amount + todayTotalPayment._sum.amount;

  const dailyTransactionWithSubsidy = await prisma.dailyConsumption.count({
    where: {
      AND: [
        {
          day: {
            lte: endD,
            gte: startD,
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
  });

  const todayTransactionWithSubsidy = await prisma.todayConsumption.count({
    where: {
      AND: [
        {
          day: {
            lte: endOfToday(),
            gte: startOfToday(),
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
  });

  const todayAndDailyWithSubsidy =
    dailyTransactionWithSubsidy + todayTransactionWithSubsidy;

  const dailyTransactionWithOutSubsidy = await prisma.dailyConsumption.count({
    where: {
      AND: [
        {
          day: {
            lte: endD,
            gte: startD,
          },
        },
        {
          OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
        },
      ],
    },
  });
  const todayTransactionWithOutSubsidy = await prisma.todayConsumption.count({
    where: {
      AND: [
        {
          day: {
            lte: endOfToday(),
            gte: startOfToday(),
          },
        },
        {
          OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
        },
      ],
    },
  });

  const todayAndDailyWithOutSubsidy =
    dailyTransactionWithOutSubsidy + todayTransactionWithOutSubsidy;

  const totalDailyPaymentWithSubsidy = await prisma.dailyConsumption.aggregate({
    where: {
      AND: [
        {
          day: {
            lte: endD,
            gte: startD,
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
    _sum: {
      amount: true,
    },
  });

  const totalTodayPaymentWithSubsidy = await prisma.todayConsumption.aggregate({
    where: {
      AND: [
        {
          day: {
            lte: endOfToday(),
            gte: startOfToday(),
          },
        },
        {
          OR: [{ reasonTypeCode: "844" }, { reasonTypeCode: "875" }],
        },
      ],
    },
    _sum: {
      amount: true,
    },
  });

  const totalPaymentWithSubsidy =
    totalDailyPaymentWithSubsidy._sum.amount +
    totalTodayPaymentWithSubsidy._sum.amount;

  const totalDailyPaymentWithOutSubsidy =
    await prisma.dailyConsumption.aggregate({
      where: {
        AND: [
          {
            day: {
              lte: endD,
              gte: startD,
            },
          },
          {
            OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });

  const totalTodayPaymentWithOutSubsidy =
    await prisma.todayConsumption.aggregate({
      where: {
        AND: [
          {
            day: {
              lte: endOfToday(),
              gte: startOfToday(),
            },
          },
          {
            OR: [{ reasonTypeCode: "845" }, { reasonTypeCode: "876" }],
          },
        ],
      },
      _sum: {
        amount: true,
      },
    });

  const totalPaymentWithOutSubsidy =
    totalDailyPaymentWithOutSubsidy._sum.amount +
    totalTodayPaymentWithOutSubsidy._sum.amount;

  const monthlyAmount = await prisma.monthlyConsumption.aggregate({
    _sum: {
      amount: true,
    },
  });

  const transactionWithSubsidy = _.chain(dailyQueryWithSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.transactionCount),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Subsidy": value,
    }))
    .values()
    .value();

  const paymentWithSubsidy = _.chain(dailyQueryWithSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.amount),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Subsidy": value,
    }))
    .values()
    .value();

  const fuelWithSubsidy = _.chain(dailyQueryWithSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.fuelInLiters),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Subsidy": value,
    }))
    .values()
    .value();

  const transactionWithOutSubsidy = _.chain(dailyQueryWithOutSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.transactionCount),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Out Subsidy": value,
    }))
    .values()
    .value();

  const paymentWithOutSubsidy = _.chain(dailyQueryWithOutSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.amount),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Out Subsidy": value,
    }))
    .values()
    .value();

  const fuelWithOutSubsidy = _.chain(dailyQueryWithOutSubsidy)
    .groupBy((tr) => format(new Date(tr.day), "EEE"))
    .mapValues((value) => {
      return _.round(
        _.sumBy(value, (tr) => tr.fuelInLiters),
        2
      );
    })
    .mapValues((value, key) => ({
      day: key,
      "With Out Subsidy": value,
    }))
    .values()
    .value();

  dailySummary.totalDailyTransactionBySubsidy = transactionWithSubsidy.map(
    (item, i) => Object.assign({}, item, transactionWithOutSubsidy[i])
  );

  dailySummary.totalDailyPaymentBySubsidy = paymentWithSubsidy.map((item, i) =>
    Object.assign({}, item, paymentWithOutSubsidy[i])
  );

  dailySummary.totalDailyFuelBySubsidy = fuelWithSubsidy.map((item, i) =>
    Object.assign({}, item, fuelWithOutSubsidy[i])
  );

  dailySummary.totalDailyTransaction = _.chain(todayAndDaily)
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

  dailySummary.totalDailyPayment = _.chain(todayAndDaily)
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

  dailySummary.totalDailyFuel = _.chain(todayAndDaily)
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

  dailySummary.totalTransactionBySource = _.chain(todayAndDaily)
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
          data: Number(
            Math.round(value + totalTransactionWithSubsidy).toFixed(1)
          )
            .toLocaleString()
            .toString(),
          icon: "HiOutlineRefresh",
          via: rr.toUpperCase(),
        };
      }
      return {
        id: Number(key),
        name: "Total Transaction",
        data: Number(Math.round(value).toFixed(1)).toLocaleString().toString(),
        icon: "HiOutlineRefresh",
        via: rr.toUpperCase(),
      };
    })
    .values()
    .value();

  dailySummary.totalTransactionPaymentWithSubsidy = [
    {
      id: 1,
      name: "Total Transaction With Subsidy",
      data: Number(
        Math.round(
          todayAndDailyWithSubsidy + totalTransactionWithSubsidy
        ).toFixed(1)
      )
        .toLocaleString()
        .toString(),
      icon: "HiOutlineRefresh",
      via: "TELEBIRR",
    },
    {
      id: 2,
      name: "Total Payment With Subsidy",
      data: Number(
        Math.round(
          totalPaymentWithSubsidy + monthlyAmount._sum.amount + thereB
        ).toFixed(1)
      )
        .toLocaleString()
        .toString(),
      icon: "HiCurrencyDollar",
      via: "TELEBIRR",
    },
  ];
  dailySummary.totalTransactionPaymentWithOutSubsidy = [
    {
      id: 1,
      name: "Total Transaction WithOut Subsidy",
      data: Number(
        Math.round(
          todayAndDailyWithOutSubsidy + allTotalTransactionWithOutSubsidy
        ).toFixed(1)
      )
        .toLocaleString()
        .toString(),
      icon: "HiOutlineRefresh",
      via: "ALL",
    },
    {
      id: 2,
      name: "Total Payment WithOut Subsidy",
      data: Number(
        Math.round(totalPaymentWithOutSubsidy + paymentWithoutSubsidy).toFixed(
          1
        )
      )
        .toLocaleString()
        .toString(),
      icon: "HiCurrencyDollar",
      via: "ALL",
    },
  ];

  const monthlyAmountBySource = await prisma.monthlyConsumption.groupBy({
    by: ["sourceId"],
    _sum: {
      amount: true,
    },
  });

  dailySummary.totalPaymentBySource = _.chain(todayAndDaily)
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

  dailySummary.totalTransactionBySourcePie = _.chain(todayAndDaily)
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
          id: rr.toUpperCase(),
          label: rr.toUpperCase(),
          value: Number(Math.round(value + allTransactionSum).toFixed(1)),
        };
      }
      return {
        id: rr.toUpperCase(),
        label: rr.toUpperCase(),
        value: Number(Math.round(value).toFixed(1)),
      };
    })
    .values()
    .value();

  dailySummary.totalPaymentBySourcePie = _.chain(todayAndDaily)
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
          id: rr.toUpperCase(),
          label: rr.toUpperCase(),
          value: Number(
            Math.round(
              value + paymentWithoutSubsidy + monthlySum + thereB
            ).toFixed(1)
          ),
        };
      }
      return {
        id: rr.toUpperCase(),
        label: rr.toUpperCase(),
        value: Number(Math.round(value + monthlySum).toFixed(1)),
        // value: Number(Math.round(value + monthlySum + thereB).toFixed(1)),
      };
    })
    .values()
    .value();

  dailySummary.totalTransactionPayment = [
    {
      id: 1,
      name: "Total Transaction",
      data: Number(
        Math.round(dTotalTransaction + allTotalTransaction).toFixed(1)
      )
        .toLocaleString()
        .toString(),
      icon: "HiOutlineRefresh",
      via: "ALL",
    },
    {
      id: 2,
      name: "Total Payment",
      data: Number(
        Math.round(
          todayAndDailyPayment +
            paymentWithoutSubsidy +
            monthlyAmount._sum.amount +
            thereB
        ).toFixed(1)
      )
        .toLocaleString()
        .toString(),
      icon: "HiCurrencyDollar",
      via: "ALL",
    },
  ];

  res.status(200).json(dailySummary);
};

export default handler;
