<center>

![version](https://img.shields.io/badge/Version-0.0.3-green?style=plastic) ![version](https://img.shields.io/badge/Contributors-2-green?style=plastic&logo=github)

</center>

## Installation

1. Télécharger le projet `git clone https://github.com/GuiguiBoy91/PureBeerBackend.git`
2. Aller dans le dossier du projet `cd PureBeer-back`
3. Installer les dépendances `yarn install`
4. Lancer le serveur `npm run dev`

## STARTING

### .ENV

Don't forget to do the `.env` and `.babelrc` file

### BDD

- 1 `cd docker`
- 2 `sudo docker-compose up`
- 3 `npx prisma migrate dev`

### LAUNCH

If you're using npm : `npm i`
yarn : `yarn`

##### after :

npm: `nodemon`
yarn: `yarn`


## Bonnes pratiques

### API CALL | ERROR

##### SAMPLE :

```
api.get("url", (req, res)=> {
    try {
        ...
        res.status(CODE).json({data: {data_name: data}})
    } catch (error) {
        ...
        res.status(CODE).json(error: {message: error_msg, status: error_status})
    }
})
```

### ARCHITECTURE

- contain:

`/backend/prisma :~` -> migrations, prisma.schema

`/backend/src :~` -> helpers, middlewares, routes, main.ts, server.ts

`/backend/src/main.ts :~` -> middlewares init

## All routes are in the postman file at `/postman/...`