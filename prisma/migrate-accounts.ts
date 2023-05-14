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
    const users = await usersCollection.find({}).toArray();
    const accounts = await accountsCollection.find({}).toArray();

    await prisma.$transaction(async (tx) => {
      // await tx.user.createMany({
      //   data: users.map((user) => {
      //     return {
      //       name: user.name,
      //       email: user.email,
      //       image: user.image,
      //     };
      //   }),
      // });
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
            userId: "clhnfx1930001hc2mgvu4hycg",
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
            userId: "clhnfx1930002hc2mgseavufx",
          },
        ],
      });

      /**
       * [
  {
    _id: new ObjectId("60849dc8d3b0fb0008d4cf22"),
    compoundId: '5dd8361814af5f345e9ffa4117d5ead4ae0c1604ef135e8bb606bf4421bb96de',
    userId: new ObjectId("60849dc8d3b0fb0008d4cf21"),
    providerType: 'oauth',
    providerId: 'google',
    providerAccountId: '113708295991195694837',
    refreshToken: null,
    accessToken: 'ya29.a0AfH6SMA_iu_DBG0Nk0x8SrBAEF5Gr6s1j8xlXmFzGcPFgd0xnTkzqseslckQmdz1WxLMxQXzrbXnkVgWYDIKEuHenih_SaLPGNnoaaoxIbxWPqtHeX1_ywvCfEGVbUjj9RsoKQV1t9uMHBzvMVSXs76ebawQ',
    accessTokenExpires: null,
    createdAt: 2021-04-24T22:38:00.275Z,
    updatedAt: 2021-04-24T22:38:00.275Z
  },
  {
    _id: new ObjectId("6086d5fd92be5b0008b4187d"),
    compoundId: '405f878ab437a0f7e76ad9963a7a24e453ede870d72bd0fbc78dabf14f1ae3f2',
    userId: new ObjectId("6086d5fd92be5b0008b4187c"),
    providerType: 'oauth',
    providerId: 'google',
    providerAccountId: '115578235515828145802',
    refreshToken: null,
    accessToken: 'ya29.a0AfH6SMCVe0h2PJX3FjyKdPJmCwrdndyMRWvDbhu6mkWXQDucQizSTj8-jeScYe_EKuECrFpFoIAL6GG_WR_jECQ9vyDHDbYlS4-Zs_vrm2r_14UufgbydcXniSb3H1eUKHKPiBz4EbtjlZ3szAqIiVDi1CHX',
    accessTokenExpires: null,
    createdAt: 2021-04-26T15:02:21.880Z,
    updatedAt: 2021-04-26T15:02:21.880Z
  }
]
       */
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
