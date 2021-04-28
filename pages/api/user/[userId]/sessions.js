import { connectToDatabase } from '../../../../lib/mongodb';

export default async function sessionsHandler(req, res) {
  const { db } = await connectToDatabase();

  switch (req.method) {
    case 'GET':
      const userSessions = await db
        .collection('sessions')
        .find({ userId: req.query.userId })
        .sort({ startedAt: -1 })
        // omits the "userId" fields from each record
        .project({ _id: 0, userId: 0 })
        .toArray();

      res.json(userSessions);
      break;
    case 'POST':
      const { startedAt, duration } = req.body;

      try {
        await db.collection('sessions').insertOne({
          startedAt,
          duration,
          userId: req.query.userId,
        });
        res.json({ success: true });
      } catch (err) {
        console.error(err);
        res.json({
          success: false,
          message: err.message,
        });
      }

      break;
  }
}
