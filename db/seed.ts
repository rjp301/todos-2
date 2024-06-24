import { generateId } from "@/api/helpers/generate-id";
import { List, User, db } from "astro:db";

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

  const lists = await db.insert(List).values([
    {
      id: generateId(),
      userId,
      name: "🏃🏻‍♂️ Trail Run",
      description:
        "3-10km run through the mountains or forest in the warmer months",
    },
  ]);
}
