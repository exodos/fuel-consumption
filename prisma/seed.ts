import { faker } from "@faker-js/faker";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/auth";
const prisma = new PrismaClient();

async function main() {
  const hashedPass = await hashPassword("Test@123#");
  let userData = await prisma.user.create({
    data: {
      firstName: "Tsegay",
      middleName: "Gebreselassie",
      lastName: "Sbagads",
      email: "tsegaye.gebreselassie@ethiotelecom.et",
      password: hashedPass,
      adminResetPassword: false,
      role: "SUPERADMIN",
      mobileNumber: "251911508233",
    },
  });
  console.log(userData);
  Array.from({ length: 2000 }).forEach(async () => {
    let dailyData = await prisma.dailyConsumption.create({
      data: {
        amount: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelInLiters: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelType: faker.helpers.arrayElement(["Diesel", "Gasoline"]),
        fuelStationId: faker.helpers.arrayElement([
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ]),
        day: faker.date.between(
          "2023-03-08T16:17:14.666Z",
          "2023-04-24T16:17:14.666Z"
        ),
        sourceId: faker.helpers.arrayElement(["1", "2", "3"]),
        fuelStationRegion: faker.helpers.arrayElement([
          "1",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "2003",
        ]),
        companyId: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
        ]),
        transactionCount: faker.helpers.arrayElement([
          300000, 350000, 400000, 450000, 500000, 550000, 600000, 650000,
          700000, 750000, 800000, 850000, 900000, 950000, 100000,
        ]),
      },
    });
    console.log(dailyData);
    let weeklyData = await prisma.weeklyConsumption.create({
      data: {
        amount: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelInLiters: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelType: faker.helpers.arrayElement(["Diesel", "Gasoline"]),
        fuelStationId: faker.helpers.arrayElement([
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ]),
        week: faker.date.between(
          "2022-09-01T16:17:14.666Z",
          "2023-04-24T16:17:14.666Z"
        ),
        sourceId: faker.helpers.arrayElement(["1", "2", "3"]),
        fuelStationRegion: faker.helpers.arrayElement([
          "1",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "2003",
        ]),
        companyId: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
        ]),
        transactionCount: faker.helpers.arrayElement([
          1300000, 1350000, 1400000, 1450000, 1500000, 1550000, 1600000,
          1650000, 1700000, 1750000, 1800000, 1850000, 1900000, 1950000,
          2000000,
        ]),
      },
    });
    console.log(weeklyData);
    let monthlyData = await prisma.monthlyConsumption.create({
      data: {
        amount: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelInLiters: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelType: faker.helpers.arrayElement(["Diesel", "Gasoline"]),
        fuelStationId: faker.helpers.arrayElement([
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
        ]),
        month: faker.date.between(
          "2022-08-01T16:17:14.666Z",
          "2023-04-24T16:17:14.666Z"
        ),
        sourceId: faker.helpers.arrayElement(["1", "2", "3"]),
        fuelStationRegion: faker.helpers.arrayElement([
          "1",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "2003",
        ]),
        companyId: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
        ]),
        transactionCount: faker.helpers.arrayElement([
          4300000, 4350000, 4400000, 4450000, 4500000, 4550000, 4600000,
          4650000, 4700000, 4750000, 4800000, 4850000, 4900000, 4950000,
          5000000,
        ]),
      },
    });
    console.log(monthlyData);
    const consumptionData = await prisma.consumption.create({
      data: {
        transactionNumber: faker.finance.bic(),
        amount: parseFloat(faker.finance.amount(1200000, 20000000)),
        fuelInLiters: faker.datatype.number({ min: 2000000, max: 10000000 }),
        fuelType: faker.helpers.arrayElement(["Diesel", "Gasoline"]),
        plateCode: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "UN",
          "AO",
          "CD",
        ]),
        plateRegion: faker.helpers.arrayElement([
          "AA",
          "SP",
          "SM",
          "TG",
          "SD",
          "AF",
          "AM",
          "BG",
          "DR",
          "GM",
          "HR",
          "OR",
        ]),
        plateNumber: faker.vehicle.vrm(),
        paidAt: faker.date.between(
          "2022-08-08T16:17:14.666Z",
          "2023-04-24T16:17:14.666Z"
        ),
        debitAccountNumber: faker.finance.account(),
        creditAccountNumber: faker.finance.account(),
        fuelStationId: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
        ]),
        fuelStationRegion: faker.helpers.arrayElement([
          "1",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "2003",
        ]),
        fuelStationName: faker.company.name(),
        fuelStationZone: faker.address.city(),
        fuelStationWoreda: faker.address.state(),
        fuelStationKebele: faker.address.streetAddress(),
        lastKiloMeter: faker.datatype.number({ min: 200000, max: 1000000 }),
        reasonTypeName: faker.helpers.arrayElement([
          "Fuel Payment With Subsidy",
          "Fuel Payment With Subsidy_Public Transport",
          "Fuel Payment Without Subsidy",
          "Fuel Payment Without Subsidy_Public Transport",
        ]),
        reasonTypeCode: faker.helpers.arrayElement([
          "844",
          "875",
          "845",
          "876",
        ]),
        firstName: faker.name.firstName(),
        middleName: faker.name.middleName(),
        lastName: faker.name.lastName(),
        mobileNumber: faker.phone.number("+251 9## ######"),
        sourceId: faker.helpers.arrayElement(["1", "2", "3"]),
        companyId: faker.helpers.arrayElement([
          "1",
          "2",
          "3",
          "4",
          "5",
          "6",
          "7",
          "8",
          "9",
          "10",
          "11",
          "12",
          "13",
          "14",
          "15",
          "16",
          "17",
          "18",
          "19",
          "20",
          "21",
          "22",
          "23",
          "24",
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
        ]),
      },
    });
    console.log(consumptionData);
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);

    await prisma.$disconnect();

    process.exit(1);
  });
