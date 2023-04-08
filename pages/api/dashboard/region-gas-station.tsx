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

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  let regionData: reportDataType = {
    amountMapping: undefined,
    fuelMapping: undefined,
    gasStationAmount: undefined,
    gasStationFuel: undefined,
  };
  //   const regionQuery = await prisma.$queryRaw`
  //     SELECT fuel_station_region, SUM(camount), r.region_name as region_name, r.id as id
  //     FROM consumption c, region_mapping r
  //     JOIN region_mapping  on r.id=c.fuel_station_region
  //     GROUP BY c.fuel_station_region, r.region_name
  //     ORDER BY c.fuel_station_region DESC
  // `;

  //   const regionQuery = await prisma.$queryRaw`
  //               SELECT C.fuel_station_region, SUM(c.amount) as amount, r.region_name, r.id as regionId
  //               FROM consumption c, region_mapping r
  //               WHERE C.fuel_station_region=r.id
  //               GROUP BY c.fuel_station_region, r.id
  //        `;

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
      id: regionName[v].name,
      label: regionName[v].name,
      value: _.round((item.amount / totalRegionAmount._sum.amount) * 100, 2),
    };
  });

  regionData.fuelMapping = regionQuery.map((item, v) => {
    return {
      id: regionName[v].name,
      label: regionName[v].name,
      value: _.round(
        (item.fuel / totalRegionAmount._sum.fuelInLiters) * 100,
        2
      ),
    };
  });

  regionData.gasStationAmount = gasStationQuery.map((item, v) => {
    return {
      id: companyName[v].name,
      label: companyName[v].name,
      value: _.round((item.amount / totalRegionAmount._sum.amount) * 100, 2),
    };
  });

  regionData.gasStationFuel = gasStationQuery.map((item, v) => {
    return {
      id: companyName[v].name,
      label: companyName[v].name,
      value: _.round(
        (item.fuel / totalRegionAmount._sum.fuelInLiters) * 100,
        2
      ),
    };
  });

  res.status(200).json(regionData);
};

export default handler;
