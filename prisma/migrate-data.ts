import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { MongoClient } from "mongodb";

const prisma = new PrismaClient();
const mongo = new MongoClient(process.env.MONGO_DATABASE_URL!);

async function main() {
  try {
    // connect to db
    await mongo.connect();
    console.log("Connected to database");

    const sessionsCollection = mongo.db("jotjik").collection("sessions");
    const usersCollection = mongo.db("jotjik").collection("users");
    const accountsCollection = mongo.db("jotjik").collection("accounts");
    const timedSessions = await sessionsCollection.find({}).toArray();
    const users = await usersCollection.find({}).toArray();
    const accounts = await accountsCollection.find({}).toArray();

    await prisma.$transaction(async (tx) => {
      await tx.user.createMany({
        data: users.map((user) => {
          return {
            name: user.name,
            email: user.email,
            image: user.image,
          };
        }),
      });

      const newUsers = await tx.user.findMany({});
      if (newUsers[0] === undefined || newUsers[1] === undefined) {
        throw new Error("Error creating new users");
      }

      await tx.account.createMany({
        data: [
          {
            type: "oauth",
            provider: "google",
            providerAccountId: "113708295991195694837",
            access_token:
              "ya29.a0AWY7Cklh0SYomXtm11G03AjhrgOnfFjhhYSIWIXfS5-5jmnHSjp2kVBlFhLoeNiV4BrQcGhlMKQmPuymh4YpxDy5hKBrA4NxtF02YVAlmMCUxMwOPnnFuKX4eZ8nn6_u1HF_bJGLi1OaLIcOc_tVAtk0eIsWaCgYKAe0SARESFQG1tDrpQx7gJMsuHrS5YOoFtpjTHw0163",
            expires_at: null,
            token_type: "Bearer",
            scope:
              "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
            userId: newUsers[0].id,
          },
          {
            type: "oauth",
            provider: "google",
            providerAccountId: "115578235515828145802",
            access_token:
              "ya29.a0AfH6SMCVe0h2PJX3FjyKdPJmCwrdndyMRWvDbhu6mkWXQDucQizSTj8-jeScYe_EKuECrFpFoIAL6GG_WR_jECQ9vyDHDbYlS4-Zs_vrm2r_14UufgbydcXniSb3H1eUKHKPiBz4EbtjlZ3szAqIiVDi1CHX",
            expires_at: null,
            token_type: "Bearer",
            scope:
              "openid https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
            userId: newUsers[1].id,
          },
        ],
      });

      await tx.timedSessions.createMany({
        data: [
          ...timedSessions
            .filter(({ userId }) => userId === "637a895072775d000f6abb76")
            .map((timedSession) => ({
              startedAt: timedSession.startedAt,
              duration: timedSession.duration,
              userId: newUsers[1]?.id,
            })),
          ...timedSessions
            .filter(({ userId }) => userId === "62f614bcdd66d426e4b1cb24")
            .map((timedSession) => ({
              startedAt: timedSession.startedAt,
              duration: timedSession.duration,
              userId: newUsers[0]?.id,
            })),
        ],
      });
    });

    console.log(accounts);
  } catch (err: unknown) {
    console.error(err);
  } finally {
    console.log("Closing database connection");
    await mongo.close();
  }
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
