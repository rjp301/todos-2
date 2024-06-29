import { generateId } from "@/api/helpers/generate-id";
import { Category, Item, List, User, db } from "astro:db";
import { itemInserts } from "./seeds/items";

// https://astro.build/db/seed
export default async function seed() {
  const { id: userId } = await db
    .insert(User)
    .values({
      id: generateId(),
      githubId: 71047303,
      username: "rjp301",
      name: "Riley Paul",
      avatarUrl: "https://avatars.githubusercontent.com/u/71047303?v=4",
    })
    .returning()
    .then((rows) => rows[0]);

  const lists = await db
    .insert(List)
    .values([
      {
        id: generateId(),
        userId,
        name: "🏃🏻‍♂️ Trail Run",
        description:
          "3-10km run through the mountains or forest in the warmer months",
      },
      {
        id: generateId(),
        userId,
        name: "🥾 Multi-Day Hike",
        description: "1-7 night self-supported trip into the backcountry",
      },
      {
        id: generateId(),
        userId,
        name: "⛷️ Ski Day",
        description: "Day of ski touring in the mountains",
      },
      {
        id: generateId(),
        userId,
        name: "🧗 Crag Day",
        description: "All the gear needed for a day at the crag",
      },
    ])
    .returning();

  const items = await db.insert(Item).values(itemInserts(userId));

  const categories = await db.insert(Category).values([
    {
      id: generateId(),
      listId: lists[3].id,
      name: "Climbing Gear",
      userId,
    },
    {
      id: generateId(),
      listId: lists[3].id,
      name: "Clothing",
      userId,
    },
    {
      id: generateId(),
      listId: lists[3].id,
      name: "Pack",
      userId,
    },
    {
      id: generateId(),
      listId: lists[3].id,
      name: "Food",
      userId,
    },
  ]);
}
