import { DateTimeResolver } from "graphql-scalars";
import { Prisma } from "@prisma/client";
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

export const GQLDate = asNexusMethod(DateTimeResolver, "date");

export const Consumption = objectType({
  name: "Consumption",
  definition(t) {
    t.int("id");
    t.string("transactionNumber");
    t.float("amount");
    t.float("fuelInLiters");
    t.field("fuelType", { type: fuel_type_enum });
    t.int("plateCode");
    t.field("plateRegion", { type: plate_region_enum });
    t.string("plateNumber");
    t.date("paidAt");
    t.string("debitAccountNumber");
    t.string("creditAccountNumber");
    t.string("fuelStationId");
    t.string("fuelStationRegion");
    t.string("fuelStationName");
    t.string("fuelStationZone");
    t.string("fuelStationWoreda");
    t.string("firstName");
    t.string("middleName");
    t.string("lastName");
    t.string("mobileNumber");
    t.int("sourceId");
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
        let plateC, plateR, plateN;
        if (args.filter) {
          plateC = args?.filter?.slice(0, 1);
          plateR = args?.filter?.slice(1, 3);
          plateN = args?.filter?.slice(3);
        }
        const where = args.filter
          ? {
              OR: [
                { transactionNumber: args.filter },
                {
                  plateNumber: {
                    contains: args.filter,
                  },
                },
                { mobileNumber: args.filter },
                {
                  AND: [
                    {
                      OR: [
                        {
                          plateCode: plateC,
                        },
                        {
                          plateRegion: plateR,
                        },
                        {
                          plateNumber: plateN,
                        },
                      ],
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
            plateCode: Number(args.plateCode),
            plateRegion: plate_region_enum[args.plateRegion],
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

export const plate_region_enum = enumType({
  name: "plate_region_enum",
  members: ["AA", "AM", "OR", "TG", "SM", "HR"],
});

export const fuel_type_enum = enumType({
  name: "fuel_type_enum",
  members: ["Diesel", "Benzene"],
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
