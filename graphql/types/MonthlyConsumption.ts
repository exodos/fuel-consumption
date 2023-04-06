import { DateTimeResolver } from "graphql-scalars";
import { Prisma } from "@prisma/client";
import { objectType } from "nexus";

export const MonthlyConsumption = objectType({
  name: "MonthlyConsumption",
  definition(t) {
    t.int("id");
    t.float("amount");
    t.float("fuelInLiters");
    t.string("fuelStationId");
    t.string("fuelType");
    t.date("month");
    t.string("sourceId");
  },
});
