import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import _ from "lodash";
import { companyName, regionName } from "@/lib/config";

type reportDataType = {
  amountMapping: any;
  fuelMapping: any;
  gasStationAmount: any;
  gasStationFuel: any;
};

export const config = {
  api: {
    responseLimit: "8mb",
  },
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let regionData: reportDataType = {
    amountMapping: undefined,
    fuelMapping: undefined,
    gasStationAmount: undefined,
    gasStationFuel: undefined,
  };

  let regionQuery = null,
    gasStationQuery = null;
  regionQuery = await prisma.$queryRaw`
             SELECT fuel_station_region, SUM(amount) as amount, SUM(fuel_in_liters) as fuel
             FROM daily_consumption
            GROUP BY fuel_station_region
            ORDER BY SUM(amount) DESC
      `;
  gasStationQuery = await prisma.$queryRaw`
                    SELECT company_id, SUM(amount) as amount, SUM(fuel_in_liters) as fuel
                    FROM daily_consumption
                    GROUP BY company_id
                   ORDER BY SUM(amount) DESC
                    `;

  const totalRegionAmount = await prisma.dailyConsumption.aggregate({
    _sum: {
      amount: true,
      fuelInLiters: true,
    },
  });

  regionData.amountMapping = regionQuery.map((item, v) => {
    return {
      id: regionName[v]?.name,
      label: regionName[v]?.name,
      value: _.round((item.amount / totalRegionAmount._sum.amount) * 100, 2),
    };
  });

  regionData.fuelMapping = regionQuery.map((item, v) => {
    return {
      id: regionName[v]?.name,
      label: regionName[v]?.name,
      value: _.round(
        (item.fuel / totalRegionAmount._sum.fuelInLiters) * 100,
        2
      ),
    };
  });

  regionData.gasStationAmount = gasStationQuery.map((item, v) => {
    return {
      id: companyName[v]?.name,
      label: companyName[v]?.name,
      value: _.round((item.amount / totalRegionAmount._sum.amount) * 100, 2),
    };
  });

  regionData.gasStationFuel = gasStationQuery.map((item, v) => {
    return {
      id: companyName[v]?.name,
      label: companyName[v]?.name,
      value: _.round(
        (item.fuel / totalRegionAmount._sum.fuelInLiters) * 100,
        2
      ),
    };
  });

  res.status(200).json(regionData);
};

export default handler;
