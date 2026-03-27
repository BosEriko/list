# list.boseriko.com
Anime and Manga Listing with Discord Integration.

## Run Project Locally
```sh
yarn install
yarn develop
```

## Run Project in Docker
```sh
./docker.sh
```

## Deploy to Production
To deploy to production, push your latest changes, then promote the most recent commit [here](https://vercel.com/boseriko/list-boseriko-com/deployments).

## ENV
```sh
cp example.env .env.local
```

## Generate New Model
You can generate a new model using `generateModel`
```sh
# Generate a new model called UserActivity
yarn generate:model UserActivity
```
