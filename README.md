This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, spin up your Postgres container:

```bash
docker build -t jotjik_db .
docker run -d --name jotjik_db -p 5432:5432 jotjik_db:latest
```

Second, run Prisma migration command to setup database tables:

```bash
npx prisma migrate dev
```

Third, copy the `env.example` to a `.env` file and update the environment variables in there with your own Google OAuth API keys:

```
GOOGLE_CLIENT_ID=YOUR_KEY_HERE
GOOGLE_CLIENT_SECRET=YOUR_KEY_HERE
```

Lastly, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
