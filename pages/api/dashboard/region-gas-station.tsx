import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma";
import _ from "lodash";

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

  const regionName = [
    { id: "1", name: "Addis Ababa" },
    { id: "3", name: "Afar" },
    { id: "4", name: "Amhar" },
    { id: "5", name: "Benishangul Gumuz" },
    { id: "6", name: "Dire Dawa" },
    { id: "7", name: "Gambela" },
    { id: "8", name: "Harari" },
    { id: "9", name: "Oromia" },
    { id: "10", name: "SNNP" },
    { id: "11", name: "Somali" },
    { id: "12", name: "Tigray" },
    { id: "2003", name: "Sidama" },
  ];

  const companyName = [
    { id: "1", name: "ABAC" },
    { id: "2", name: "AFRICAN" },
    { id: "3", name: "BARO" },
    { id: "4", name: "DALOL" },
    { id: "5", name: "DELTA" },
    { id: "6", name: "DIRE" },
    { id: "7", name: "ELELLE" },
    { id: "8", name: "ELLA" },
    { id: "9", name: "Feleghion" },
    { id: "10", name: "Full AM" },
    { id: "11", name: "GLOBAL" },
    { id: "12", name: "GOMEJU" },
    { id: "13", name: "GREEN" },
    { id: "14", name: "HABSHA" },
    { id: "15", name: "HALEFAY" },
    { id: "16", name: "JFM" },
    { id: "17", name: "JR" },
    { id: "18", name: "Kumbi" },
    { id: "19", name: "MESH" },
    { id: "20", name: "Nile" },
    { id: "21", name: "NOC" },
    { id: "22", name: "ODDA" },
    { id: "23", name: "OILIBIYA" },
    { id: "24", name: "OLWAY" },
    { id: "25", name: "PETRO" },
    { id: "26", name: "RUBIS" },
    { id: "27", name: "SKY" },
    { id: "28", name: "TAF" },
    { id: "29", name: "Tebareke" },
    { id: "30", name: "TOTAL" },
    { id: "31", name: "TSEHY" },
    { id: "32", name: "WORKU" },
    { id: "33", name: "YBP" },
    { id: "34", name: "YESHI" },
    { id: "35", name: "ZAGOL" },
    { id: "36", name: "ZEMEN" },
    { id: "37", name: "ZOBLE" },
    { id: "38", name: "KOBIL" },
    { id: "39", name: "Abyssinia" },
    { id: "40", name: "Alpha" },
  ];

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
