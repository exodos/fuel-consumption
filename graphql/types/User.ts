import { changePhone } from "@/lib/config";
import { Prisma } from "@prisma/client";
import {
  arg,
  enumType,
  extendType,
  inputObjectType,
  intArg,
  list,
  nonNull,
  objectType,
  stringArg,
} from "nexus";
import { Sort } from "./Consumption";
import { hashPassword, verifyPassword } from "@/lib/auth";

export const User = objectType({
  name: "User",
  definition(t) {
    t.string("id");
    t.string("firstName");
    t.string("middleName");
    t.string("lastName");
    t.string("email");
    t.string("mobileNumber");
    t.string("password");
    t.field("role", { type: Role });
    t.boolean("adminResetPassword");
    t.date("createdAt");
    t.date("updatedAt");
  },
});

export const UserPagination = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("feedUser", {
      type: FeedUser,
      args: {
        filter: stringArg(),
        skip: intArg(),
        take: intArg(),
        orderBy: arg({ type: list(nonNull(UserOrderByInput)) }),
      },
      resolve: async (parent, args, ctx) => {
        const where = args.filter
          ? {
              OR: [
                { firstName: args.filter },
                { lastName: args.filter },
                { email: args.filter },
                { mobileNumber: changePhone(args.filter) },
              ],
            }
          : {};

        const user = await ctx.prisma.user.findMany({
          where,
          skip: args?.skip as number | undefined,
          take: args?.take as number | undefined,
          orderBy: args?.orderBy as
            | Prisma.Enumerable<Prisma.UserOrderByWithRelationInput>
            | undefined,
        });

        const totalUser = await ctx.prisma.user.count({
          where,
        }); // 2
        const maxPage = Math.ceil(totalUser / args?.take);

        return {
          user,
          maxPage,
          totalUser,
        };
      },
    });
  },
});

export const usersByIDQuery = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("usersByID", {
      type: User,
      args: { userId: nonNull(stringArg()) },
      resolve(_parent, args, ctx) {
        const user = ctx.prisma.user.findUnique({
          where: {
            id: args.userId,
          },
        });
        return user;
      },
    });
  },
});

export const userByEmail = extendType({
  type: "Query",
  definition(t) {
    t.nonNull.field("userByEmail", {
      type: User,
      args: { email: nonNull(stringArg()) },
      resolve: async (_parent, args, ctx) => {
        return ctx.prisma.user.findUnique({
          where: {
            email: args.email,
          },
        });
      },
    });
  },
});

// Mutation
export const createUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("createUser", {
      type: User,
      args: {
        input: nonNull(userCreateInput),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
        });
        if (!user || user.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform this action`);
        }

        return await ctx.prisma.user.create({
          data: {
            firstName: args.input.firstName,
            middleName: args.input.middleName,
            lastName: args.input.lastName,
            email: args.input.email,
            mobileNumber: changePhone(args.input.mobileNumber),
            password: await hashPassword(args.input.password),
          },
        });
      },
    });
  },
});

export const updateUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("updateUser", {
      type: User,
      args: {
        userId: nonNull(stringArg()),
        input: nonNull(userUpdateInput),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
        });
        if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
          throw new Error(`You do not have permission to perform action`);
        }

        return ctx.prisma.user.update({
          where: { id: args.userId },
          data: {
            ...args.input,
          },
        });
      },
    });
  },
});

export const deleteUserMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("deleteUser", {
      type: User,
      args: {
        id: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
        });
        if (!user || (user.role !== "SUPERADMIN" && user.role !== "ADMIN")) {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.user.delete({
          where: {
            id: args.id,
          },
        });
      },
    });
  },
});

export const changeUserPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("changeUserPassword", {
      type: User,
      args: {
        id: nonNull(stringArg()),
        currentPassword: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            id: args.id,
          },
        });
        const hashedPass = await hashPassword(args.password);

        const verify = verifyPassword(args.currentPassword, user.password);

        if (!verify) {
          throw new Error(`Current Password And New Password Must Much!!`);
        }

        return await ctx.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            password: hashedPass,
            adminResetPassword: false,
          },
        });
      },
    });
  },
});

export const adminChangeUserPasswordMutation = extendType({
  type: "Mutation",
  definition(t) {
    t.nonNull.field("adminChangeUserPassword", {
      type: User,
      args: {
        id: nonNull(stringArg()),
        password: nonNull(stringArg()),
      },
      resolve: async (_parent, args, ctx) => {
        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.session.user.email,
          },
        });
        if (!user || user.role !== "SUPERADMIN") {
          throw new Error(`You do not have permission to perform action`);
        }

        return await ctx.prisma.user.update({
          where: {
            id: args.id,
          },
          data: {
            password: await hashPassword(args.password),
            adminResetPassword: true,
          },
        });
      },
    });
  },
});

export const FeedUser = objectType({
  name: "FeedUser",
  definition(t) {
    t.nonNull.list.nonNull.field("user", { type: User });
    t.nonNull.int("totalUser");
    t.int("maxPage");
  },
});

export const UserOrderByInput = inputObjectType({
  name: "UserOrderByInput",
  definition(t) {
    t.field("createdAt", { type: Sort });
    t.field("updatedAt", { type: Sort });
  },
});

export const userCreateInput = inputObjectType({
  name: "userCreateInput",
  definition(t) {
    t.string("firstName");
    t.string("middleName");
    t.string("lastName");
    t.string("email");
    t.string("mobileNumber");
    t.string("password");
    t.field("role", { type: Role });
  },
});

export const userUpdateInput = inputObjectType({
  name: "userUpdateInput",
  definition(t) {
    t.string("firstName");
    t.string("middleName");
    t.string("lastName");
    t.string("email");
    t.string("mobileNumber");
    t.field("role", { type: Role });
  },
});

export const Role = enumType({
  name: "Role",
  members: ["SUPERADMIN", "ADMIN", "USER"],
});
