import { connectToDatabase } from '../../../../util/mongodb';

export default async function sessionsHandler(req, res) {
  const { db } = await connectToDatabase();

  switch (req.method) {
    case 'GET':
      const { userId } = req.query;

      const userSessions = await db
        .collection('sessions')
        .find({ userId: req.query.userId })
        // omits the "userId" fields from each record
        .project({ userId: 0 })
        .toArray();

      res.json(userSessions.reverse());
      break;
    case 'POST':
      const { startedAt, duration } = req.body;

      await db.collection('sessions').insertOne({
        startedAt,
        duration,
        userId: req.query.userId,
      });

      res.json({ success: true });
      break;
  }
}
