import { prisma } from "@/lib/prisma";
import nc from "next-connect";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { addYears, format, subYears } from "date-fns";

const handler = nc({
  onError: (err, req: NextApiRequest, res: NextApiResponse, next) => {
    console.error(err.stack);
    res.status(500).end("Something broke!");
  },
  onNoMatch: (req, res) => {
    res.status(404).end("Page is not found");
  },
})
  .use(async (req: NextApiRequest, res: NextApiResponse, next) => {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      res.status(401).json({ message: "Unauthenticated Request" });
    } else if (
      session.user.memberships.role !== "SUPERADMIN" &&
      session.user.memberships.role !== "INSURER" &&
      session.user.memberships.role !== "MEMBER" &&
      session.user.memberships.role !== "BRANCHADMIN"
    ) {
      res
        .status(401)
        .json({ message: "You do not have permission to perform action" });
    } else {
      next();
    }
  })
  .post(async (req: NextApiRequest, res: NextApiResponse) => {
    const {
      insuredId,
      branchId,
      policyStartDate,
      policyIssuedConditions,
      personsEntitledToUse,
      vehicles,
    } = req.body;

    const startYear = subYears(new Date(policyStartDate), 1);
    const endYear = new Date(policyStartDate);

    const vehicleData = await Promise.all(
      vehicles.map(async (v: any) => {
        let countSlightBodilyInjury = await prisma.accidentRecord.aggregate({
          where: {
            plateNumber: v.plateNumber,
            bodilyInjury: "SlightBodilyInjury",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        let countSaviorBodilyInjury = await prisma.accidentRecord.aggregate({
          where: {
            plateNumber: v.plateNumber,
            bodilyInjury: "SaviorBodilyInjury",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        let countDeath = await prisma.accidentRecord.aggregate({
          where: {
            plateNumber: v.plateNumber,
            bodilyInjury: "Death",
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            bodilyInjury: true,
          },
        });

        let sumPropertyInjury = await prisma.accidentRecord.aggregate({
          where: {
            plateNumber: v.plateNumber,
            createdAt: {
              gte: startYear,
              lte: endYear,
            },
          },
          _count: {
            propertyInjury: true,
          },
          _sum: {
            propertyInjury: true,
          },
        });

        let premiumTariffBodily = 0,
          premiumTariffProperty = 0;

        if (countSlightBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (v.premiumTarif * 10) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (v.premiumTarif * 20) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (v.premiumTarif * 50) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (v.premiumTarif * 80) / 100;
        } else if (countSlightBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (v.premiumTarif * 100) / 100;
        }

        if (countSaviorBodilyInjury._count.bodilyInjury === 1) {
          premiumTariffBodily += (v.premiumTarif * 10) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 2) {
          premiumTariffBodily += (v.premiumTarif * 20) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 3) {
          premiumTariffBodily += (v.premiumTarif * 50) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury === 4) {
          premiumTariffBodily += (v.premiumTarif * 80) / 100;
        } else if (countSaviorBodilyInjury._count.bodilyInjury >= 5) {
          premiumTariffBodily += (v.premiumTarif * 100) / 100;
        }

        if (countDeath._count.bodilyInjury === 1) {
          premiumTariffBodily += (v.premiumTarif * 10) / 100;
        } else if (countDeath._count.bodilyInjury === 2) {
          premiumTariffBodily += (v.premiumTarif * 20) / 100;
        } else if (countDeath._count.bodilyInjury === 3) {
          premiumTariffBodily += (v.premiumTarif * 50) / 100;
        } else if (countDeath._count.bodilyInjury === 4) {
          premiumTariffBodily += (v.premiumTarif * 80) / 100;
        } else if (countDeath._count.bodilyInjury >= 5) {
          premiumTariffBodily += (v.premiumTarif * 100) / 100;
        }

        if (sumPropertyInjury._count.propertyInjury === 1) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (v.premiumTarif * 10) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (v.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (v.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (v.premiumTarif * 60) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (v.premiumTarif * 70) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 2) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (v.premiumTarif * 20) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (v.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (v.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (v.premiumTarif * 80) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (v.premiumTarif * 90) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 3) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (v.premiumTarif * 30) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (v.premiumTarif * 75) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (v.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (v.premiumTarif * 110) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (v.premiumTarif * 120) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury === 4) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (v.premiumTarif * 50) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (v.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (v.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (v.premiumTarif * 130) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (v.premiumTarif * 135) / 100;
          }
        } else if (sumPropertyInjury._count.propertyInjury >= 5) {
          if (
            sumPropertyInjury._sum.propertyInjury > 0 &&
            sumPropertyInjury._sum.propertyInjury < 5000
          ) {
            premiumTariffProperty = (v.premiumTarif * 100) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 5000 &&
            sumPropertyInjury._sum.propertyInjury < 10000
          ) {
            premiumTariffProperty = (v.premiumTarif * 120) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 10000 &&
            sumPropertyInjury._sum.propertyInjury < 50000
          ) {
            premiumTariffProperty = (v.premiumTarif * 130) / 100;
          } else if (
            sumPropertyInjury._sum.propertyInjury >= 50000 &&
            sumPropertyInjury._sum.propertyInjury < 100000
          ) {
            premiumTariffProperty = (v.premiumTarif * 140) / 100;
          } else if (sumPropertyInjury._sum.propertyInjury >= 100000) {
            premiumTariffProperty = (v.premiumTarif * 150) / 100;
          }
        }

        const tariffPremium = await prisma.tariff.findFirst({
          where: {
            vehicleType: v.vehicleType,
            vehicleSubType: v.vehicleSubType,
            vehicleDetail: v.vehicleDetails,
            vehicleUsage: v.vehicleUsage,
          },
        });
        if (!tariffPremium) {
          throw new Error(
            `We Could\'n find Premium Tariff with the provided data`
          );
        }

        let calPremiumTarif = 0;
        if (v.vehicleCategory === "PRIVATEUSE") {
          calPremiumTarif = 20 * v.passengerNumber + tariffPremium.premiumTarif;
        } else {
          calPremiumTarif = 40 * v.passengerNumber + tariffPremium.premiumTarif;
        }

        await prisma.vehicle.create({
          data: {
            plateNumber: v.plateNumber,
            engineNumber: v.engineNumber,
            chassisNumber: v.chassisNumber,
            vehicleModel: v.vehicleModel,
            bodyType: v.bodyType,
            horsePower: v.horsePower,
            manufacturedYear: Number(v.manufacturedYear),
            vehicleType: v.vehicleType,
            vehicleSubType: v.vehicleSubType,
            vehicleDetails: v.vehicleDetails,
            vehicleUsage: v.vehicleUsage,
            vehicleCategory: v.vehicleCategory,
            premiumTarif: Number(calPremiumTarif),
            passengerNumber: Number(v.passengerNumber),
            carryingCapacityInGoods: v.carryingCapacityInGoods,
            purchasedYear: Number(v.purchasedYear),
            dutyFreeValue: Number(v.dutyFreeValue),
            dutyPaidValue: Number(v.dutyPaidValue),
            vehicleStatus: v.vehicleStatus,
            isInsured: "INSURED",
            insureds: {
              connect: {
                id: insuredId,
              },
            },
            branchs: {
              connect: {
                id: branchId,
              },
            },
            certificates: {
              create: {
                certificateNumber: `CN-${format(new Date(), "yyMMiHms")}-${
                  v.plateNumber
                }`,
                premiumTarif: Number(
                  calPremiumTarif + premiumTariffBodily + premiumTariffProperty
                ),
                branchs: {
                  connect: {
                    id: branchId,
                  },
                },
                policies: {
                  create: {
                    policyNumber: `PN-${format(new Date(), "yyMMiHms")}-${
                      v.plateNumber
                    }`,
                    policyStartDate: new Date(policyStartDate),
                    policyExpireDate: addYears(new Date(policyStartDate), 1),
                    policyIssuedConditions: policyIssuedConditions,
                    personsEntitledToUse: personsEntitledToUse,
                  },
                },
              },
            },
          },
        });
      })
    );

    res.status(200).json(vehicleData);
  });

export default handler;
