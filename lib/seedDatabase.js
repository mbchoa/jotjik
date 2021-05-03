const faker = require('faker');
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDB() {
  try {
    // connect to db
    await client.connect();

    // clear sessions collection
    const sessionsCollection = client.db('jotjik').collection('sessions');
    sessionsCollection.drop();

    const usersCollection = client.db('jotjik').collection('users');
    const users = await usersCollection.find({}).toArray();
    users.forEach(async ({ _id }) => {
      const dates = faker.date.betweens(new Date('2020-04-02'), new Date('2020-05-02'), 60);
      const sessionsData = dates.map((date) => ({
        startedAt: date.toISOString(),
        duration: faker.datatype.number({ min: 900000, max: 7200000 }),
        userId: _id.toString(),
      }));

      // insert session data
      await sessionsCollection.insertMany(sessionsData);
    });

    console.log('Database seeded! :)');
  } catch (err) {
    console.log(err.stack);
  }
}

seedDB();
