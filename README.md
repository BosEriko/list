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
You can generate a new model using `GenerateModel`
```sh
# Generate a new model called UserActivity
yarn nails generate model UserActivity
```

## Generate New Scaffold
You can generate a new scaffold using `GenerateScaffold`
```sh
# Generate a new scaffold called UserActivity
yarn nails generate scaffold UserActivity
```
