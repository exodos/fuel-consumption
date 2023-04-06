import { objectType } from "nexus";

export const WeeklyConsumption = objectType({
  name: "WeeklyConsumption",
  definition(t) {
    t.int("id");
    t.float("amount");
    t.float("fuelInLiters");
    t.string("fuelStationId");
    t.string("fuelType");
    t.date("week");
    t.string("sourceId");
  },
});
