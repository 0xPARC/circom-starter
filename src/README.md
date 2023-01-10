This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Start Prisma Database

To view the state of the database:

```bash
npx prisma studio
```

Open [http://localhost:5555](http://localhost:5555) with your browser to see the result.


## Load in Env Variables

The variables necessary are the following:

```bash
DATABASE_URL
ETH_PRIV_KEY (for the relayer)
ETH_RPC_URL (for the relayer)
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
