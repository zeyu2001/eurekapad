import * as dotenv from "dotenv";
import { createClerkClient } from "@clerk/backend";

dotenv.config();

const LIMIT = 10;

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

const totalCount = await clerkClient.users.getCount();
console.log(`Total users: ${totalCount}`);

const userEmails = [];

for (let offset = 0; offset < totalCount; offset += LIMIT) {
  const users = await clerkClient.users.getUserList({
    limit: LIMIT,
    offset,
  });
  userEmails.push(
    ...users.data.map((user) => user.emailAddresses[0].emailAddress)
  );
}

console.log(userEmails.join(",\n"));
