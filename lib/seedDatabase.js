const { faker } = require('@faker-js/faker');
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function seedDB() {
  try {
    // connect to db
    await client.connect();
    console.log('Connected to database');

    const sessionsCollection = client.db('jotjik').collection('sessions');
    await client.db('jotjik').dropCollection('sessions');

    const usersCollection = client.db('jotjik').collection('users');

    const users = await usersCollection.find({}).toArray();

    await Promise.all(
      users.map(async ({ _id }) => {
        const dates = faker.date.betweens(new Date('2020-04-02'), new Date('2020-05-02'), 60);
        const sessionsData = dates.map((date) => ({
          startedAt: date.toISOString(),
          duration: faker.datatype.number({ min: 900000, max: 7200000 }),
          userId: _id.toString(),
        }));

        // insert session data
        await sessionsCollection.insertMany(sessionsData);
      })
    );

    console.log('Database seeded! :)');
  } catch (err) {
    console.log(err.stack);
  } finally {
    console.log('Closing database connection');
    client.close();
  }
}

seedDB();
