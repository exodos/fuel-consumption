-- CreateEnum
CREATE TYPE "MembershipRole" AS ENUM ('SUPERADMIN', 'INSURER', 'MEMBER', 'USER', 'TRAFFICPOLICEADMIN', 'TRAFFICPOLICEMEMBER');

-- CreateEnum
CREATE TYPE "OrgDesc" AS ENUM ('MINISTRY', 'INSURANCE', 'TRAFFICPOLICE');

-- CreateEnum
CREATE TYPE "CertificateStatus" AS ENUM ('CURRENT', 'ARCHIEVED');

-- CreateEnum
CREATE TYPE "ACCIDENTTYPE" AS ENUM ('BODILYINJURY', 'PROPERTYINJURY');

-- CreateEnum
CREATE TYPE "VEHICLESTATUS" AS ENUM ('NEW', 'RENEWAL', 'ADDITIONAL');

-- CreateEnum
CREATE TYPE "PaymentFor" AS ENUM ('THIRDPARTY', 'CLAIM');

-- CreateEnum
CREATE TYPE "IsInsured" AS ENUM ('INSURED', 'NOTINSURED');

-- CreateEnum
CREATE TYPE "STATUS" AS ENUM ('SUSPENDED', 'BLOCKED');

-- CreateEnum
CREATE TYPE "InjuryType" AS ENUM ('SIMPLE', 'CRITICAL', 'DEATH');

-- CreateEnum
CREATE TYPE "VictimedCondition" AS ENUM ('PASSENGER', 'PEDESTRIAN', 'DRIVER', 'ASSISTANT');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "region" TEXT,
    "city" TEXT,
    "email" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "adminRestPassword" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Branch" (
    "id" TEXT NOT NULL,
    "branchName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "orgId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Branch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "description" "OrgDesc" NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Membership" (
    "id" TEXT NOT NULL,
    "role" "MembershipRole" NOT NULL DEFAULT 'USER',
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "branchId" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "issuedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "insuredMobileNumber" TEXT NOT NULL,
    "vehiclePlateNumber" TEXT NOT NULL,
    "policyId" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "tariffCode" TEXT NOT NULL,
    "premiumTarif" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedTime" TIMESTAMP(3),

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Insured" (
    "id" TEXT NOT NULL,
    "insuredName" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "subCity" TEXT NOT NULL,
    "wereda" TEXT NOT NULL,
    "kebelle" TEXT NOT NULL,
    "houseNumber" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedTime" TIMESTAMP(3),

    CONSTRAINT "Insured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "engineNumber" TEXT NOT NULL,
    "chassisNumber" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "carryingCapacityInGoods" TEXT NOT NULL,
    "carryingCapacityInPersons" TEXT NOT NULL,
    "vehicleStatus" "VEHICLESTATUS" NOT NULL DEFAULT 'NEW',
    "isInsured" "IsInsured" NOT NULL DEFAULT 'NOTINSURED',
    "insuredMobileNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Policy" (
    "id" TEXT NOT NULL,
    "policyNumber" TEXT NOT NULL,
    "policyStartDate" DATE NOT NULL,
    "policyExpireDate" DATE NOT NULL,
    "policyIssuedConditions" TEXT,
    "personsEntitledToUse" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Policy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Claim" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "damageEstimate" DOUBLE PRECISION NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentNumber" TEXT NOT NULL,
    "claimantMobileNumber" TEXT NOT NULL,
    "claimantPlateNumber" TEXT NOT NULL,
    "certificateNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedTime" TIMESTAMP(3),

    CONSTRAINT "Claim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimUnInsured" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "damageEstimate" DOUBLE PRECISION NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "incidentNumber" TEXT NOT NULL,
    "vehiclePlateNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimUnInsured_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClaimHitAndRun" (
    "id" TEXT NOT NULL,
    "claimNumber" TEXT NOT NULL,
    "damageEstimate" DOUBLE PRECISION NOT NULL,
    "claimerFullName" TEXT NOT NULL,
    "claimerRegion" TEXT NOT NULL,
    "claimerCity" TEXT NOT NULL,
    "claimerPhoneNumber" TEXT NOT NULL,
    "claimedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClaimHitAndRun_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InsuredPoliceReport" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "victimDriverName" TEXT NOT NULL,
    "victimLicenceNumber" TEXT NOT NULL,
    "victimLevel" TEXT NOT NULL,
    "victimRegion" TEXT NOT NULL,
    "victimCity" TEXT NOT NULL,
    "victimSubCity" TEXT NOT NULL,
    "victimWereda" TEXT NOT NULL,
    "victimKebelle" TEXT NOT NULL,
    "victimHouseNo" TEXT NOT NULL,
    "victimPhoneNumber" TEXT NOT NULL,
    "victimVehicle" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "policeBranchId" TEXT NOT NULL,
    "incidentCause" TEXT NOT NULL,
    "incidentDate" DATE NOT NULL,
    "incidentPlace" TEXT NOT NULL,
    "incidentTime" TEXT NOT NULL,
    "responsibleVehicle" TEXT NOT NULL,
    "responsibleDriverName" TEXT NOT NULL,
    "responsiblePhoneNumber" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trafficPoliceId" TEXT NOT NULL,
    "accidentRecordId" TEXT,

    CONSTRAINT "InsuredPoliceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnInsuredPoliceReport" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "victimDriverName" TEXT NOT NULL,
    "victimLicenceNumber" TEXT NOT NULL,
    "victimLevel" TEXT NOT NULL,
    "victimRegion" TEXT NOT NULL,
    "victimCity" TEXT NOT NULL,
    "victimSubCity" TEXT NOT NULL,
    "victimWereda" TEXT NOT NULL,
    "victimKebelle" TEXT NOT NULL,
    "victimHouseNo" TEXT NOT NULL,
    "victimPhoneNumber" TEXT NOT NULL,
    "victimVehiclePlateNumber" TEXT NOT NULL,
    "branchId" TEXT NOT NULL,
    "policeBranchId" TEXT NOT NULL,
    "incidentCause" TEXT NOT NULL,
    "incidentDate" DATE NOT NULL,
    "incidentPlace" TEXT NOT NULL,
    "incidentTime" TEXT NOT NULL,
    "responsibleVehiclePlateNumber" TEXT NOT NULL,
    "responsibleDriverName" TEXT NOT NULL,
    "responsiblePhoneNumber" TEXT NOT NULL,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "trafficPoliceId" TEXT NOT NULL,

    CONSTRAINT "UnInsuredPoliceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HitAndRunPoliceReport" (
    "id" TEXT NOT NULL,
    "incidentNumber" TEXT NOT NULL,
    "incidentCause" TEXT NOT NULL,
    "incidentDate" TIMESTAMP(3) NOT NULL,
    "incidentPlace" TEXT NOT NULL,
    "incidentTime" TEXT,
    "reportDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "branchId" TEXT NOT NULL,
    "policeBranchId" TEXT NOT NULL,
    "trafficPoliceId" TEXT NOT NULL,

    CONSTRAINT "HitAndRunPoliceReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Victim" (
    "id" TEXT NOT NULL,
    "victimName" TEXT NOT NULL,
    "victimCondition" "VictimedCondition" NOT NULL,
    "injuryType" "InjuryType" NOT NULL,
    "victimAddress" TEXT,
    "victimFamilyPhoneNumber" TEXT,
    "victimHospitalized" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "unsuredPoliceReportId" TEXT,

    CONSTRAINT "Victim_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tariff" (
    "id" SERIAL NOT NULL,
    "tariffCode" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleSubType" TEXT NOT NULL,
    "vehicleDetail" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "premiumTarif" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tariff_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RegionList" (
    "id" SERIAL NOT NULL,
    "regionName" TEXT,
    "regionApp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RegionList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CodeList" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CodeList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TariffDetal" (
    "id" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "vehicleSubType" TEXT NOT NULL,
    "usage" TEXT NOT NULL,
    "vehicleDetail" TEXT NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TariffDetal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ThirdPartyLog" (
    "id" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "orgName" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "mode" TEXT NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "claimUnInsuredId" TEXT,

    CONSTRAINT "ThirdPartyLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AccidentRecord" (
    "id" TEXT NOT NULL,
    "typeOfAccident" "ACCIDENTTYPE" NOT NULL,
    "accidentSubType" TEXT NOT NULL,
    "plateNumber" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AccidentRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_insuredToBranch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_BranchToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_OrganizationToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_MembershipToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_CertificateToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ClaimToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredPoliceReportToVictim" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_InsuredPoliceReportToThirdPartyLog" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_HitAndRunPoliceReportToVictim" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_TariffToThirdPartyLog" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThirdPartyLogToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_ThirdPartyLogToVehicle" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_mobileNumber_key" ON "User"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_branchName_key" ON "Branch"("branchName");

-- CreateIndex
CREATE UNIQUE INDEX "Branch_mobileNumber_key" ON "Branch"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_orgName_key" ON "Organization"("orgName");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_mobileNumber_key" ON "Organization"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_key" ON "Membership"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Membership_userId_branchId_key" ON "Membership"("userId", "branchId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateNumber_key" ON "Certificate"("certificateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_vehiclePlateNumber_key" ON "Certificate"("vehiclePlateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_policyId_key" ON "Certificate"("policyId");

-- CreateIndex
CREATE UNIQUE INDEX "Insured_mobileNumber_key" ON "Insured"("mobileNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_plateNumber_key" ON "Vehicle"("plateNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_engineNumber_key" ON "Vehicle"("engineNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_chassisNumber_key" ON "Vehicle"("chassisNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Policy_policyNumber_key" ON "Policy"("policyNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_claimNumber_key" ON "Claim"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Claim_incidentNumber_key" ON "Claim"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimUnInsured_claimNumber_key" ON "ClaimUnInsured"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimUnInsured_incidentNumber_key" ON "ClaimUnInsured"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimHitAndRun_claimNumber_key" ON "ClaimHitAndRun"("claimNumber");

-- CreateIndex
CREATE UNIQUE INDEX "ClaimHitAndRun_incidentNumber_key" ON "ClaimHitAndRun"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "InsuredPoliceReport_incidentNumber_key" ON "InsuredPoliceReport"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "UnInsuredPoliceReport_incidentNumber_key" ON "UnInsuredPoliceReport"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "HitAndRunPoliceReport_incidentNumber_key" ON "HitAndRunPoliceReport"("incidentNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Tariff_tariffCode_key" ON "Tariff"("tariffCode");

-- CreateIndex
CREATE UNIQUE INDEX "_insuredToBranch_AB_unique" ON "_insuredToBranch"("A", "B");

-- CreateIndex
CREATE INDEX "_insuredToBranch_B_index" ON "_insuredToBranch"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_BranchToThirdPartyLog_AB_unique" ON "_BranchToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_BranchToThirdPartyLog_B_index" ON "_BranchToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_OrganizationToThirdPartyLog_AB_unique" ON "_OrganizationToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_OrganizationToThirdPartyLog_B_index" ON "_OrganizationToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_MembershipToThirdPartyLog_AB_unique" ON "_MembershipToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_MembershipToThirdPartyLog_B_index" ON "_MembershipToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_CertificateToThirdPartyLog_AB_unique" ON "_CertificateToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_CertificateToThirdPartyLog_B_index" ON "_CertificateToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredToThirdPartyLog_AB_unique" ON "_InsuredToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredToThirdPartyLog_B_index" ON "_InsuredToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ClaimToThirdPartyLog_AB_unique" ON "_ClaimToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_ClaimToThirdPartyLog_B_index" ON "_ClaimToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredPoliceReportToVictim_AB_unique" ON "_InsuredPoliceReportToVictim"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredPoliceReportToVictim_B_index" ON "_InsuredPoliceReportToVictim"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_InsuredPoliceReportToThirdPartyLog_AB_unique" ON "_InsuredPoliceReportToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_InsuredPoliceReportToThirdPartyLog_B_index" ON "_InsuredPoliceReportToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_HitAndRunPoliceReportToVictim_AB_unique" ON "_HitAndRunPoliceReportToVictim"("A", "B");

-- CreateIndex
CREATE INDEX "_HitAndRunPoliceReportToVictim_B_index" ON "_HitAndRunPoliceReportToVictim"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_TariffToThirdPartyLog_AB_unique" ON "_TariffToThirdPartyLog"("A", "B");

-- CreateIndex
CREATE INDEX "_TariffToThirdPartyLog_B_index" ON "_TariffToThirdPartyLog"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThirdPartyLogToUser_AB_unique" ON "_ThirdPartyLogToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ThirdPartyLogToUser_B_index" ON "_ThirdPartyLogToUser"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ThirdPartyLogToVehicle_AB_unique" ON "_ThirdPartyLogToVehicle"("A", "B");

-- CreateIndex
CREATE INDEX "_ThirdPartyLogToVehicle_B_index" ON "_ThirdPartyLogToVehicle"("B");

-- AddForeignKey
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_orgId_fkey" FOREIGN KEY ("orgId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_insuredMobileNumber_fkey" FOREIGN KEY ("insuredMobileNumber") REFERENCES "Insured"("mobileNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_vehiclePlateNumber_fkey" FOREIGN KEY ("vehiclePlateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_policyId_fkey" FOREIGN KEY ("policyId") REFERENCES "Policy"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificate" ADD CONSTRAINT "Certificate_tariffCode_fkey" FOREIGN KEY ("tariffCode") REFERENCES "Tariff"("tariffCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_insuredMobileNumber_fkey" FOREIGN KEY ("insuredMobileNumber") REFERENCES "Insured"("mobileNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_incidentNumber_fkey" FOREIGN KEY ("incidentNumber") REFERENCES "InsuredPoliceReport"("incidentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimantMobileNumber_fkey" FOREIGN KEY ("claimantMobileNumber") REFERENCES "Insured"("mobileNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_claimantPlateNumber_fkey" FOREIGN KEY ("claimantPlateNumber") REFERENCES "Vehicle"("plateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_certificateNumber_fkey" FOREIGN KEY ("certificateNumber") REFERENCES "Certificate"("certificateNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Claim" ADD CONSTRAINT "Claim_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimUnInsured" ADD CONSTRAINT "ClaimUnInsured_incidentNumber_fkey" FOREIGN KEY ("incidentNumber") REFERENCES "UnInsuredPoliceReport"("incidentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimUnInsured" ADD CONSTRAINT "ClaimUnInsured_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimHitAndRun" ADD CONSTRAINT "ClaimHitAndRun_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClaimHitAndRun" ADD CONSTRAINT "ClaimHitAndRun_incidentNumber_fkey" FOREIGN KEY ("incidentNumber") REFERENCES "HitAndRunPoliceReport"("incidentNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_victimVehicle_fkey" FOREIGN KEY ("victimVehicle") REFERENCES "Vehicle"("plateNumber") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_policeBranchId_fkey" FOREIGN KEY ("policeBranchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_responsibleVehicle_fkey" FOREIGN KEY ("responsibleVehicle") REFERENCES "Vehicle"("plateNumber") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_trafficPoliceId_fkey" FOREIGN KEY ("trafficPoliceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InsuredPoliceReport" ADD CONSTRAINT "InsuredPoliceReport_accidentRecordId_fkey" FOREIGN KEY ("accidentRecordId") REFERENCES "AccidentRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnInsuredPoliceReport" ADD CONSTRAINT "UnInsuredPoliceReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnInsuredPoliceReport" ADD CONSTRAINT "UnInsuredPoliceReport_policeBranchId_fkey" FOREIGN KEY ("policeBranchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnInsuredPoliceReport" ADD CONSTRAINT "UnInsuredPoliceReport_trafficPoliceId_fkey" FOREIGN KEY ("trafficPoliceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitAndRunPoliceReport" ADD CONSTRAINT "HitAndRunPoliceReport_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitAndRunPoliceReport" ADD CONSTRAINT "HitAndRunPoliceReport_policeBranchId_fkey" FOREIGN KEY ("policeBranchId") REFERENCES "Branch"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HitAndRunPoliceReport" ADD CONSTRAINT "HitAndRunPoliceReport_trafficPoliceId_fkey" FOREIGN KEY ("trafficPoliceId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Victim" ADD CONSTRAINT "Victim_unsuredPoliceReportId_fkey" FOREIGN KEY ("unsuredPoliceReportId") REFERENCES "UnInsuredPoliceReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ThirdPartyLog" ADD CONSTRAINT "ThirdPartyLog_claimUnInsuredId_fkey" FOREIGN KEY ("claimUnInsuredId") REFERENCES "ClaimUnInsured"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AccidentRecord" ADD CONSTRAINT "AccidentRecord_plateNumber_fkey" FOREIGN KEY ("plateNumber") REFERENCES "Vehicle"("chassisNumber") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_insuredToBranch" ADD CONSTRAINT "_insuredToBranch_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_insuredToBranch" ADD CONSTRAINT "_insuredToBranch_B_fkey" FOREIGN KEY ("B") REFERENCES "Insured"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToThirdPartyLog" ADD CONSTRAINT "_BranchToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Branch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BranchToThirdPartyLog" ADD CONSTRAINT "_BranchToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToThirdPartyLog" ADD CONSTRAINT "_OrganizationToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OrganizationToThirdPartyLog" ADD CONSTRAINT "_OrganizationToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipToThirdPartyLog" ADD CONSTRAINT "_MembershipToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Membership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipToThirdPartyLog" ADD CONSTRAINT "_MembershipToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToThirdPartyLog" ADD CONSTRAINT "_CertificateToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Certificate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CertificateToThirdPartyLog" ADD CONSTRAINT "_CertificateToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredToThirdPartyLog" ADD CONSTRAINT "_InsuredToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Insured"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredToThirdPartyLog" ADD CONSTRAINT "_InsuredToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToThirdPartyLog" ADD CONSTRAINT "_ClaimToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Claim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ClaimToThirdPartyLog" ADD CONSTRAINT "_ClaimToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToVictim" ADD CONSTRAINT "_InsuredPoliceReportToVictim_A_fkey" FOREIGN KEY ("A") REFERENCES "InsuredPoliceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToVictim" ADD CONSTRAINT "_InsuredPoliceReportToVictim_B_fkey" FOREIGN KEY ("B") REFERENCES "Victim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToThirdPartyLog" ADD CONSTRAINT "_InsuredPoliceReportToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "InsuredPoliceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_InsuredPoliceReportToThirdPartyLog" ADD CONSTRAINT "_InsuredPoliceReportToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HitAndRunPoliceReportToVictim" ADD CONSTRAINT "_HitAndRunPoliceReportToVictim_A_fkey" FOREIGN KEY ("A") REFERENCES "HitAndRunPoliceReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_HitAndRunPoliceReportToVictim" ADD CONSTRAINT "_HitAndRunPoliceReportToVictim_B_fkey" FOREIGN KEY ("B") REFERENCES "Victim"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TariffToThirdPartyLog" ADD CONSTRAINT "_TariffToThirdPartyLog_A_fkey" FOREIGN KEY ("A") REFERENCES "Tariff"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TariffToThirdPartyLog" ADD CONSTRAINT "_TariffToThirdPartyLog_B_fkey" FOREIGN KEY ("B") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToUser" ADD CONSTRAINT "_ThirdPartyLogToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToUser" ADD CONSTRAINT "_ThirdPartyLogToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToVehicle" ADD CONSTRAINT "_ThirdPartyLogToVehicle_A_fkey" FOREIGN KEY ("A") REFERENCES "ThirdPartyLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ThirdPartyLogToVehicle" ADD CONSTRAINT "_ThirdPartyLogToVehicle_B_fkey" FOREIGN KEY ("B") REFERENCES "Vehicle"("id") ON DELETE CASCADE ON UPDATE CASCADE;
