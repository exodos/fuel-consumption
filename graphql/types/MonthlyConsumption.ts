import { DateTimeResolver } from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { objectType } from "nexus";
import { fuel_type_enum } from "./Consumption";

export const MonthlyConsumption = objectType({
  name: "MonthlyConsumption",
  definition(t) {
    t.float("amount");
    t.date("month");
    t.float("fuelInLiters");
    t.string("fuelStationId");
    t.field("fuelType", { type: fuel_type_enum });
    t.int("sourceId");
  },
});

// export const ConsumptionPagination = extendType({
//   type: "Query",
//   definition(t) {
//     t.nonNull.field("feedConsumption", {
//       type: FeedConsumption,
//       args: {
//         filter: stringArg(),
//         skip: intArg(),
//         take: intArg(),
//         orderBy: arg({ type: list(nonNull(ConsumptionOrderByInput)) }),
//       },
//       resolve: async (parent, args, ctx) => {
//         const where = args.filter
//           ? {
//               OR: [
//                 { transactionNumber: args.filter },
//                 {
//                   plateNumber: {
//                     contains: args.filter,
//                   },
//                 },
//                 { mobileNumber: args.filter },
//               ],
//             }
//           : {};

//         const consumptions = await ctx.prisma.consumption.findMany({
//           where,
//           skip: args?.skip as number | undefined,
//           take: args?.take as number | undefined,
//           orderBy: args?.orderBy as
//             | Prisma.Enumerable<Prisma.ConsumptionOrderByWithRelationInput>
//             | undefined,
//         });

//         const totalConsumption = await ctx.prisma.consumption.count({
//           where,
//         });
//         const maxPage = Math.ceil(totalConsumption / args?.take);

//         return {
//           consumptions,
//           maxPage,
//           totalConsumption,
//         };
//       },
//     });
//   },
// });

// export const consumptionByPlateNumberQuery = extendType({
//   type: "Query",
//   definition(t) {
//     t.field("consumptionByPlateNumber", {
//       type: Consumption,
//       args: {
//         plateCode: nonNull(stringArg()),
//         plateRegion: nonNull(stringArg()),
//         plateNumber: nonNull(stringArg()),
//       },
//       resolve(_parent, args, ctx) {
//         return ctx.prisma.consumption.findFirst({
//           where: {
//             plateCode: args.plateCode,
//             plateRegion: args.plateRegion,
//             plateNumber: args.plateRegion,
//           },
//         });
//       },
//     });
//   },
// });

// export const FeedConsumption = objectType({
//   name: "FeedConsumption",
//   definition(t) {
//     t.nonNull.list.nonNull.field("consumptions", { type: Consumption });
//     t.nonNull.int("totalConsumption");
//     t.int("maxPage");
//   },
// });
