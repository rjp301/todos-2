import { z } from "zod";

const googleUserSchema = z.object({
  id: z.string(),
  email: z.string(),
  name: z.string(),
  picture: z.string(),
});

export default async function getGoogleUser(accessToken: string) {
  const fetchInit: RequestInit = {
    headers: { Authorization: `Bearer ${accessToken}` },
  };

  try {
    const user = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      fetchInit,
    )
      .then((res) => res.json())
      .then(googleUserSchema.parse);

    return user;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch user data from Google");
  }
}
