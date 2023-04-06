import { DateTimeResolver } from "graphql-scalars";
import {
  arg,
  asNexusMethod,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { changePhone } from "@/lib/config";
import { Prisma } from "@prisma/client";

export const GQLDate = asNexusMethod(DateTimeResolver, "date");

export const Consumption = objectType({
  name: "Consumption",
  definition(t) {
    t.int("id");
    t.string("transactionNumber");
    t.float("amount");
    t.float("fuelInLiters");
    t.string("fuelType");
    t.string("plateCode");
    t.string("plateRegion");
    t.string("plateNumber");
    t.date("paidAt");
    t.string("debitAccountNumber");
    t.string("creditAccountNumber");
    t.string("fuelStationId");
    t.string("fuelStationRegion");
    t.string("fuelStationName");
    t.string("fuelStationZone");
    t.string("fuelStationWoreda");
    t.string("fuelStationKebele");
    t.int("lastKiloMeter");
    t.string("reasonTypeName");
    t.string("reasonTypeCode");
    t.string("firstName");
    t.string("middleName");
    t.string("lastName");
    t.string("mobileNumber");
    t.string("sourceId");
    t.string("companyId");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const ConsumptionPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedConsumption", {
      type: FeedConsumption,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(ConsumptionOrderByInput)) }),
      },
      resolve: async (_parent, args, ctx) => {
        const where: Prisma.ConsumptionWhereInput = args.filter
          ? {
              OR: [
                {
                  transactionNumber: {
                    equals: args.filter,
                    mode: "insensitive",
                  },
                },
                {
                  mobileNumber: {
                    equals: changePhone(args.filter),
                    mode: "insensitive",
                  },
                },
                {
                  plateNumber: {
                    contains: args.filter.toLowerCase(),
                    mode: "insensitive",
                  },
                },
                {
                  AND: [
                    {
                      plateCode: {
                        contains: args?.filter.slice(0, 1),
                        mode: "insensitive",
                      },
                    },
                    {
                      plateRegion: {
                        contains: args?.filter?.slice(1, 3),
                        mode: "insensitive",
                      },
                    },
                    {
                      plateNumber: {
                        contains: args?.filter?.slice(3),
                        mode: "insensitive",
                      },
                    },
                  ],
                },
                {
                  AND: [
                    {
                      plateCode: {
                        contains: args?.filter.slice(0, 2),
                        mode: "insensitive",
                      },
                    },
                    {
                      plateRegion: {
                        contains: args?.filter?.slice(2, 4),
                        mode: "insensitive",
                      },
                    },
                    {
                      plateNumber: {
                        contains: args?.filter?.slice(4),
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              ],
            }
          : {};

        const consumptions = await ctx.prisma.consumption.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.ConsumptionOrderByWithRelationInput>
            | undefined,
        });

        const totalConsumption = await ctx.prisma.consumption.count({
          where,
        });
        const maxPage = Math.ceil(totalConsumption / args?.take);

        return {
          consumptions,
          maxPage,
          totalConsumption,
        };
      },
    });
  },
});

export const consumptionByIdQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("consumptionById", {
      type: Consumption,
      args: {
        id: nonNull(intArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.consumption.findFirst({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const consumptionByPlateNumberQuery = extendType({
  type: "Query",
  definition(t) {
    t.field("consumptionByPlateNumber", {
      type: Consumption,
      args: {
        plateCode: nonNull(stringArg()),
        plateRegion: nonNull(stringArg()),
        plateNumber: nonNull(stringArg()),
      },
      resolve(_parent, args, ctx) {
        return ctx.prisma.consumption.findFirst({
          where: {
            plateCode: args.plateCode,
            plateRegion: args.plateRegion,
            plateNumber: args.plateRegion,
          },
        });
      },
    });
  },
});

export const FeedConsumption = objectType({
  name: "FeedConsumption",
  definition(t) {
    t.nonNull.list.nonNull.field("consumptions", { type: Consumption });
    t.nonNull.int("totalConsumption");
    t.int("maxPage");
  },
});

export const ConsumptionOrderByInput = inputObjectType({
  name: "ConsumptionOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const Sort = enumType({
  name: "Sort",
  members: ["asc", "desc"],
});
