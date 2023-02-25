const express = require('express')
const mongodb = require('mongodb')

const PORT = (process.env.PORT && parseInt(process.env.PORT)) || 3000
const DBHOST = process.env.DBHOST
const DBNAME = process.env.DBNAME

function connectDb() {
  return mongodb.MongoClient.connect(DBHOST).then((client) => {
    return client.db(DBNAME)
  })
}

function randomArray(array) {
  return array[Math.floor(Math.random() * array.length)]
}

function setupHandlers(app, advertisingDB) {
  app.get('/ads', (_, res) => {
    const advertising = advertisingDB.collection('advertising')
    advertising
      .find()
      .toArray()
      .then((ads) => {
        const ad = randomArray(ads)
        console.log(ad)
        res.status(200).json(ad)
      })
  })
}

function startHttpServer(db) {
  return new Promise((resolve) => {
    // Wrap in a promise so we can be notified when the server has started.
    const app = express()
    setupHandlers(app, db)

    app.listen(PORT, () => {
      resolve() // HTTP server is listening, resolve the promise.
    })
  })
}

async function main() {
  const db = await connectDb() // Connect to the database...

  return await startHttpServer(db) // start the HTTP server.
}

main()
  .then(() => console.log('Advertising microservice online.'))
  .catch((err) => {
    console.error('Advertising microservice failed to start.')
    console.error((err && err.stack) || err)
  })
