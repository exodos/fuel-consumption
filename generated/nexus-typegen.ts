/**
 * This file was generated by Nexus Schema
 * Do not make changes to this file directly
 */


import type { Context } from "./../graphql/context"
import type { core } from "nexus"
declare global {
  interface NexusGenCustomInputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, opts?: core.CommonInputFieldConfig<TypeName, FieldName>): void // "DateTime";
  }
}
declare global {
  interface NexusGenCustomOutputMethods<TypeName extends string> {
    /**
     * A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar.
     */
    date<FieldName extends string>(fieldName: FieldName, ...opts: core.ScalarOutSpread<TypeName, FieldName>): void // "DateTime";
  }
}


declare global {
  interface NexusGen extends NexusGenTypes {}
}

export interface NexusGenInputs {
  ConsumptionOrderByInput: { // input type
    createdAt?: NexusGenEnums['Sort'] | null; // Sort
    updatedAt?: NexusGenEnums['Sort'] | null; // Sort
  }
  UserOrderByInput: { // input type
    createdAt?: NexusGenEnums['Sort'] | null; // Sort
    updatedAt?: NexusGenEnums['Sort'] | null; // Sort
  }
  userCreateInput: { // input type
    email?: string | null; // String
    firstName?: string | null; // String
    lastName?: string | null; // String
    middleName?: string | null; // String
    mobileNumber?: string | null; // String
    password?: string | null; // String
    role?: NexusGenEnums['Role'] | null; // Role
  }
  userUpdateInput: { // input type
    email?: string | null; // String
    firstName?: string | null; // String
    lastName?: string | null; // String
    middleName?: string | null; // String
    mobileNumber?: string | null; // String
    role?: NexusGenEnums['Role'] | null; // Role
  }
}

export interface NexusGenEnums {
  Role: "ADMIN" | "SUPERADMIN" | "USER"
  Sort: "asc" | "desc"
}

export interface NexusGenScalars {
  String: string
  Int: number
  Float: number
  Boolean: boolean
  ID: string
  DateTime: any
}

export interface NexusGenObjects {
  Consumption: { // root type
    amount?: number | null; // Float
    companyId?: string | null; // String
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    creditAccountNumber?: string | null; // String
    debitAccountNumber?: string | null; // String
    firstName?: string | null; // String
    fuelInLiters?: number | null; // Float
    fuelStationId?: string | null; // String
    fuelStationKebele?: string | null; // String
    fuelStationName?: string | null; // String
    fuelStationRegion?: string | null; // String
    fuelStationWoreda?: string | null; // String
    fuelStationZone?: string | null; // String
    fuelType?: string | null; // String
    id?: number | null; // Int
    lastKiloMeter?: number | null; // Int
    lastName?: string | null; // String
    middleName?: string | null; // String
    mobileNumber?: string | null; // String
    paidAt?: NexusGenScalars['DateTime'] | null; // DateTime
    plateCode?: string | null; // String
    plateNumber?: string | null; // String
    plateRegion?: string | null; // String
    reasonTypeCode?: string | null; // String
    reasonTypeName?: string | null; // String
    sourceId?: string | null; // String
    transactionNumber?: string | null; // String
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  DailyConsumption: { // root type
    amount?: number | null; // Float
    companyId?: string | null; // String
    day?: NexusGenScalars['DateTime'] | null; // DateTime
    fuelInLiters?: number | null; // Float
    fuelStationId?: string | null; // String
    fuelStationRegion?: string | null; // String
    fuelType?: string | null; // String
    id?: number | null; // Int
    sourceId?: string | null; // String
    transactionCount?: number | null; // Int
  }
  FeedConsumption: { // root type
    consumptions: NexusGenRootTypes['Consumption'][]; // [Consumption!]!
    maxPage?: number | null; // Int
    totalConsumption: number; // Int!
  }
  FeedUser: { // root type
    maxPage?: number | null; // Int
    totalUser: number; // Int!
    user: NexusGenRootTypes['User'][]; // [User!]!
  }
  MonthlyConsumption: { // root type
    amount?: number | null; // Float
    fuelInLiters?: number | null; // Float
    fuelStationId?: string | null; // String
    fuelType?: string | null; // String
    id?: number | null; // Int
    month?: NexusGenScalars['DateTime'] | null; // DateTime
    sourceId?: string | null; // String
  }
  Mutation: {};
  Query: {};
  User: { // root type
    adminResetPassword?: boolean | null; // Boolean
    createdAt?: NexusGenScalars['DateTime'] | null; // DateTime
    email?: string | null; // String
    firstName?: string | null; // String
    id?: string | null; // String
    lastName?: string | null; // String
    middleName?: string | null; // String
    mobileNumber?: string | null; // String
    password?: string | null; // String
    role?: NexusGenEnums['Role'] | null; // Role
    updatedAt?: NexusGenScalars['DateTime'] | null; // DateTime
  }
  WeeklyConsumption: { // root type
    amount?: number | null; // Float
    fuelInLiters?: number | null; // Float
    fuelStationId?: string | null; // String
    fuelType?: string | null; // String
    id?: number | null; // Int
    sourceId?: string | null; // String
    week?: NexusGenScalars['DateTime'] | null; // DateTime
  }
}

export interface NexusGenInterfaces {
}

export interface NexusGenUnions {
}

export type NexusGenRootTypes = NexusGenObjects

export type NexusGenAllTypes = NexusGenRootTypes & NexusGenScalars & NexusGenEnums

export interface NexusGenFieldTypes {
  Consumption: { // field return type
    amount: number | null; // Float
    companyId: string | null; // String
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    creditAccountNumber: string | null; // String
    debitAccountNumber: string | null; // String
    firstName: string | null; // String
    fuelInLiters: number | null; // Float
    fuelStationId: string | null; // String
    fuelStationKebele: string | null; // String
    fuelStationName: string | null; // String
    fuelStationRegion: string | null; // String
    fuelStationWoreda: string | null; // String
    fuelStationZone: string | null; // String
    fuelType: string | null; // String
    id: number | null; // Int
    lastKiloMeter: number | null; // Int
    lastName: string | null; // String
    middleName: string | null; // String
    mobileNumber: string | null; // String
    paidAt: NexusGenScalars['DateTime'] | null; // DateTime
    plateCode: string | null; // String
    plateNumber: string | null; // String
    plateRegion: string | null; // String
    reasonTypeCode: string | null; // String
    reasonTypeName: string | null; // String
    sourceId: string | null; // String
    transactionNumber: string | null; // String
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  DailyConsumption: { // field return type
    amount: number | null; // Float
    companyId: string | null; // String
    day: NexusGenScalars['DateTime'] | null; // DateTime
    fuelInLiters: number | null; // Float
    fuelStationId: string | null; // String
    fuelStationRegion: string | null; // String
    fuelType: string | null; // String
    id: number | null; // Int
    sourceId: string | null; // String
    transactionCount: number | null; // Int
  }
  FeedConsumption: { // field return type
    consumptions: NexusGenRootTypes['Consumption'][]; // [Consumption!]!
    maxPage: number | null; // Int
    totalConsumption: number; // Int!
  }
  FeedUser: { // field return type
    maxPage: number | null; // Int
    totalUser: number; // Int!
    user: NexusGenRootTypes['User'][]; // [User!]!
  }
  MonthlyConsumption: { // field return type
    amount: number | null; // Float
    fuelInLiters: number | null; // Float
    fuelStationId: string | null; // String
    fuelType: string | null; // String
    id: number | null; // Int
    month: NexusGenScalars['DateTime'] | null; // DateTime
    sourceId: string | null; // String
  }
  Mutation: { // field return type
    adminChangeUserPassword: NexusGenRootTypes['User']; // User!
    changeUserPassword: NexusGenRootTypes['User']; // User!
    createUser: NexusGenRootTypes['User']; // User!
    deleteUser: NexusGenRootTypes['User']; // User!
    updateUser: NexusGenRootTypes['User']; // User!
  }
  Query: { // field return type
    consumptionById: NexusGenRootTypes['Consumption'] | null; // Consumption
    consumptionByPlateNumber: NexusGenRootTypes['Consumption'] | null; // Consumption
    feedConsumption: NexusGenRootTypes['FeedConsumption']; // FeedConsumption!
    feedUser: NexusGenRootTypes['FeedUser']; // FeedUser!
    userByEmail: NexusGenRootTypes['User']; // User!
    usersByID: NexusGenRootTypes['User']; // User!
  }
  User: { // field return type
    adminResetPassword: boolean | null; // Boolean
    createdAt: NexusGenScalars['DateTime'] | null; // DateTime
    email: string | null; // String
    firstName: string | null; // String
    id: string | null; // String
    lastName: string | null; // String
    middleName: string | null; // String
    mobileNumber: string | null; // String
    password: string | null; // String
    role: NexusGenEnums['Role'] | null; // Role
    updatedAt: NexusGenScalars['DateTime'] | null; // DateTime
  }
  WeeklyConsumption: { // field return type
    amount: number | null; // Float
    fuelInLiters: number | null; // Float
    fuelStationId: string | null; // String
    fuelType: string | null; // String
    id: number | null; // Int
    sourceId: string | null; // String
    week: NexusGenScalars['DateTime'] | null; // DateTime
  }
}

export interface NexusGenFieldTypeNames {
  Consumption: { // field return type name
    amount: 'Float'
    companyId: 'String'
    createdAt: 'DateTime'
    creditAccountNumber: 'String'
    debitAccountNumber: 'String'
    firstName: 'String'
    fuelInLiters: 'Float'
    fuelStationId: 'String'
    fuelStationKebele: 'String'
    fuelStationName: 'String'
    fuelStationRegion: 'String'
    fuelStationWoreda: 'String'
    fuelStationZone: 'String'
    fuelType: 'String'
    id: 'Int'
    lastKiloMeter: 'Int'
    lastName: 'String'
    middleName: 'String'
    mobileNumber: 'String'
    paidAt: 'DateTime'
    plateCode: 'String'
    plateNumber: 'String'
    plateRegion: 'String'
    reasonTypeCode: 'String'
    reasonTypeName: 'String'
    sourceId: 'String'
    transactionNumber: 'String'
    updatedAt: 'DateTime'
  }
  DailyConsumption: { // field return type name
    amount: 'Float'
    companyId: 'String'
    day: 'DateTime'
    fuelInLiters: 'Float'
    fuelStationId: 'String'
    fuelStationRegion: 'String'
    fuelType: 'String'
    id: 'Int'
    sourceId: 'String'
    transactionCount: 'Int'
  }
  FeedConsumption: { // field return type name
    consumptions: 'Consumption'
    maxPage: 'Int'
    totalConsumption: 'Int'
  }
  FeedUser: { // field return type name
    maxPage: 'Int'
    totalUser: 'Int'
    user: 'User'
  }
  MonthlyConsumption: { // field return type name
    amount: 'Float'
    fuelInLiters: 'Float'
    fuelStationId: 'String'
    fuelType: 'String'
    id: 'Int'
    month: 'DateTime'
    sourceId: 'String'
  }
  Mutation: { // field return type name
    adminChangeUserPassword: 'User'
    changeUserPassword: 'User'
    createUser: 'User'
    deleteUser: 'User'
    updateUser: 'User'
  }
  Query: { // field return type name
    consumptionById: 'Consumption'
    consumptionByPlateNumber: 'Consumption'
    feedConsumption: 'FeedConsumption'
    feedUser: 'FeedUser'
    userByEmail: 'User'
    usersByID: 'User'
  }
  User: { // field return type name
    adminResetPassword: 'Boolean'
    createdAt: 'DateTime'
    email: 'String'
    firstName: 'String'
    id: 'String'
    lastName: 'String'
    middleName: 'String'
    mobileNumber: 'String'
    password: 'String'
    role: 'Role'
    updatedAt: 'DateTime'
  }
  WeeklyConsumption: { // field return type name
    amount: 'Float'
    fuelInLiters: 'Float'
    fuelStationId: 'String'
    fuelType: 'String'
    id: 'Int'
    sourceId: 'String'
    week: 'DateTime'
  }
}

export interface NexusGenArgTypes {
  Mutation: {
    adminChangeUserPassword: { // args
      id: string; // String!
      password: string; // String!
    }
    changeUserPassword: { // args
      currentPassword: string; // String!
      id: string; // String!
      password: string; // String!
    }
    createUser: { // args
      input: NexusGenInputs['userCreateInput']; // userCreateInput!
    }
    deleteUser: { // args
      id: string; // String!
    }
    updateUser: { // args
      input: NexusGenInputs['userUpdateInput']; // userUpdateInput!
      userId: string; // String!
    }
  }
  Query: {
    consumptionById: { // args
      id: number; // Int!
    }
    consumptionByPlateNumber: { // args
      plateCode: string; // String!
      plateNumber: string; // String!
      plateRegion: string; // String!
    }
    feedConsumption: { // args
      filter?: string | null; // String
      orderBy?: NexusGenInputs['ConsumptionOrderByInput'][] | null; // [ConsumptionOrderByInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    feedUser: { // args
      filter?: string | null; // String
      orderBy?: NexusGenInputs['UserOrderByInput'][] | null; // [UserOrderByInput!]
      skip?: number | null; // Int
      take?: number | null; // Int
    }
    userByEmail: { // args
      email: string; // String!
    }
    usersByID: { // args
      userId: string; // String!
    }
  }
}

export interface NexusGenAbstractTypeMembers {
}

export interface NexusGenTypeInterfaces {
}

export type NexusGenObjectNames = keyof NexusGenObjects;

export type NexusGenInputNames = keyof NexusGenInputs;

export type NexusGenEnumNames = keyof NexusGenEnums;

export type NexusGenInterfaceNames = never;

export type NexusGenScalarNames = keyof NexusGenScalars;

export type NexusGenUnionNames = never;

export type NexusGenObjectsUsingAbstractStrategyIsTypeOf = never;

export type NexusGenAbstractsUsingStrategyResolveType = never;

export type NexusGenFeaturesConfig = {
  abstractTypeStrategies: {
    isTypeOf: false
    resolveType: true
    __typename: false
  }
}

export interface NexusGenTypes {
  context: Context;
  inputTypes: NexusGenInputs;
  rootTypes: NexusGenRootTypes;
  inputTypeShapes: NexusGenInputs & NexusGenEnums & NexusGenScalars;
  argTypes: NexusGenArgTypes;
  fieldTypes: NexusGenFieldTypes;
  fieldTypeNames: NexusGenFieldTypeNames;
  allTypes: NexusGenAllTypes;
  typeInterfaces: NexusGenTypeInterfaces;
  objectNames: NexusGenObjectNames;
  inputNames: NexusGenInputNames;
  enumNames: NexusGenEnumNames;
  interfaceNames: NexusGenInterfaceNames;
  scalarNames: NexusGenScalarNames;
  unionNames: NexusGenUnionNames;
  allInputTypes: NexusGenTypes['inputNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['scalarNames'];
  allOutputTypes: NexusGenTypes['objectNames'] | NexusGenTypes['enumNames'] | NexusGenTypes['unionNames'] | NexusGenTypes['interfaceNames'] | NexusGenTypes['scalarNames'];
  allNamedTypes: NexusGenTypes['allInputTypes'] | NexusGenTypes['allOutputTypes']
  abstractTypes: NexusGenTypes['interfaceNames'] | NexusGenTypes['unionNames'];
  abstractTypeMembers: NexusGenAbstractTypeMembers;
  objectsUsingAbstractStrategyIsTypeOf: NexusGenObjectsUsingAbstractStrategyIsTypeOf;
  abstractsUsingStrategyResolveType: NexusGenAbstractsUsingStrategyResolveType;
  features: NexusGenFeaturesConfig;
}


declare global {
  interface NexusGenPluginTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginInputTypeConfig<TypeName extends string> {
  }
  interface NexusGenPluginFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginInputFieldConfig<TypeName extends string, FieldName extends string> {
  }
  interface NexusGenPluginSchemaConfig {
  }
  interface NexusGenPluginArgConfig {
  }
}