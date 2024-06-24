import { NOW, column, defineDb, defineTable } from "astro:db";

const User = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    githubId: column.number({ unique: true }),
    username: column.text({ unique: true }),
    name: column.text(),
    avatarUrl: column.text(),
    createdAt: column.text({ default: NOW }),
  },
});

const UserSession = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    expiresAt: column.number(),
    createdAt: column.text({ default: NOW }),
  },
});

const Item = defineTable({
  columns: {
    id: column.text({ primaryKey: true }),
    userId: column.text({ references: () => User.columns.id }),
    createdAt: column.text({ default: NOW }),
    name: column.text({ default: "" }),
    description: column.text({ default: "" }),
    weight: column.number({ default: 0 }),
    weightUnit: column.text({ default: "g" }),
    image: column.text({ optional: true }),
  },
});

// https://astro.build/db/config
export default defineDb({
  tables: { User, UserSession, Item },
});
