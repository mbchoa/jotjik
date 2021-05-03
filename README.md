This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, spin up MongoDB container:

```bash
docker-compose up
```

Second, copy the `env.local.example` to a `.env.local` file and update the environment variables in there with your own Google OAuth API keys:

```
GOOGLE_ID=YOUR_KEY_HERE
GOOGLE_SECRET=YOUR_KEY_HERE
```

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Seeding Database
```bash
DATABASE_URL=mongodb://localhost:7000/jotjik DATABASE_NAME=jotjik node lib/seedDatabase.js
```
Run the provided command to seed the Mongo database with session data. This assumes that users exist in the Mongo database already.


