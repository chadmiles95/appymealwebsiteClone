This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Google Cloud
CircleCI is configured to handle deployment automatically when merging `stage` to `master`.
In order to deploy changes, a typically dev cycle workflow should look like this:
```
git checkout master
git pull
git ch -b zachs-feature-branch
# makes some changes to the code
git add .
git commit -m "feat: added a new feature"
git pull origin master
# Resolve any merge conflicts
git pull origin stage
# Resolve any merge conflicts
git push

# Then go to github and make a PR from your feature branch to stage
# merge it immediately or after someone review if you'd like
# Wait for circleci to finish the build successfully.

# Make a PR from stage to master
# Merge and wait for green build 
```
