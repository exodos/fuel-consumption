import _ from "lodash";
import { extendType, list, objectType } from "nexus";
import { fuel_type_enum } from "./Consumption";
import { endOfToday, format, subDays } from "date-fns";

export const DailyConsumption = objectType({
  name: "DailyConsumption",
  definition(t) {
    t.float("amount");
    t.date("day");
    t.float("fuelInLiters");
    t.string("fuelStationId");
    t.field("fuelType", { type: fuel_type_enum });
    t.int("sourceId");
  },
});

// export const totalTransactionQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("totalTransaction", {
//       type: DailyConsumption,
//       resolve: async (_parent, args, ctx) => {
//         // return ctx.prisma.dailyConsumption.aggregate({
//         //   _count: {
//         //     amount: true,
//         //   },
//         // });

//         return await ctx.prisma.dailyConsumption.count();
//       },
//     });
//   },
// });

// export const dailyTransactionQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("feedTotalTransaction", {
//       type: FeedTotalTransaction,
//       resolve: async (_parent, _args, ctx) => {
//         const result = await ctx.prisma.dailyConsumption.groupBy({
//           by: ["day"],
//           where: {
//             day: {
//               lte: endOfToday(),
//               gte: subDays(new Date(), 7),
//             },
//           },
//           _count: {
//             amount: true,
//           },
//         });

//         const dailyTransaction = result.map((g) => ({
//           day: g.day,
//           amount: g._count.amount,
//         }));

//         return { dailyTransaction };
//       },
//     });
//   },
// });

// export const dailyPaymentQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("feedTotalPayment", {
//       type: FeedTotalPayment,
//       resolve: async (_parent, _args, ctx) => {
//         const result = await ctx.prisma.dailyConsumption.groupBy({
//           by: ["day"],
//           where: {
//             day: {
//               lte: endOfToday(),
//               gte: subDays(new Date(), 7),
//             },
//           },
//           _sum: {
//             amount: true,
//           },
//         });

//         const dailyPayment = result.map((g) => ({
//           day: g.day,
//           amount: g._sum.amount,
//         }));

//         return { dailyPayment };
//       },
//     });
//   },
// });
// export const FeedTotalTransaction = objectType({
//   name: "FeedTotalTransaction",
//   definition(t) {
//     t.date("day");
//     t.int("amount");
//   },
// });

// export const FeedTotalPayment = objectType({
//   name: "FeedTotalPayment",
//   definition(t) {
//     t.date("day");
//     t.float("amount");
//   },
// });
