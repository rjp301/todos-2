import { z } from "zod";

const githubUserSchema = z.object({
  id: z.number(),
  login: z.string(),
  name: z.string(),
  avatar_url: z.string().nullable(),
});

const githubEmailSchema = z.object({
  email: z.string(),
  primary: z.boolean(),
  verified: z.boolean(),
  visibility: z.string().nullable(),
});
const githubEmailsSchema = z.array(githubEmailSchema);

export default async function getGithubUser(accessToken: string) {
  const fetchInit: FetchRequestInit = {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
  };

  try {
    const user = await fetch("https://api.github.com/user", fetchInit)
      .then((res) => res.json())
      .then((data) => {
        console.log("user", data);
        return data;
      })
      .then(githubUserSchema.parse);

    const emails = await fetch("https://api.github.com/user/emails", fetchInit)
      .then((res) => res.json())
      .then((data) => {
        console.log("emails", data);
        return data;
      })
      .then(githubEmailsSchema.parse);

    const primaryEmail = emails.find(
      (email) => email.primary && email.verified,
    );
    if (!primaryEmail) {
      throw new Error("Primary email not found");
    }

    return {
      ...user,
      email: primaryEmail.email,
    };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch user data from GitHub");
  }
}
