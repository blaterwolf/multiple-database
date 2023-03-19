// % Import Important Modules
const express = require('express')
const dotenv = require('dotenv')
const {
    failedMessage,
    syncFailedMessage,
    attemptingToConnect,
    attemptingToSync,
    noSyncMessage,
    listeningMessage,
} = require('./db_message')
const jwt = require('jsonwebtoken')
const path = require('path')
const cors = require('cors')
const bodyParser = require('body-parser')
const { userLogger } = require('./helpers/logger')

// % Reference Models
const db = require('./models')

// % Initialize Express
var app = express()

// % Express Shenanigans
// ? parse requests of content-type application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }))
// ? parse requrests of content-type application/json
app.use(express.json())

// % .env config
dotenv.config()

// % PORT value
const PORT = process.env.PORT || 3700

// % Middleware
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(function (req, res, next) {
    const { method, socket, url, hostname } = req
    const { remoteAddress, remoteFamily } = socket

    // ? you can check session here.
    const log = {
        method,
        remoteAddress,
        remoteFamily,
        hostname,
        url,
    }
    userLogger.info(JSON.stringify(log, null, 2))

    next()
})

/**
 * ================================================================
 * * ROUTES
 * ================================================================
 */

const MAIN_API_ROUTE = '/multi_db/v1/'

// % Home Route
// >> localhost:3700/multi_db/v1/

/**
 * ================================================================
 * * DATABASE
 * ================================================================
 */

const databases = Object.keys(require(__dirname + '/config/config.json')['development'])

const db_log = process.env.ENABLE_DB_LOG === 'true' || false
const sync_log = process.env.ENABLE_SYNC_MODEL_LOG === 'true' || false

const connectToDB = async db => {
    db_log ? userLogger.info(attemptingToConnect()) : {}
    databases.forEach(database => {
        db.sequelize[database].authenticate().catch(err => {
            console.error(failedMessage(err))
        })
        // Print connection logs
        if (db_log) console.log(`✅ ${database} database is connected!`)
    })
}

const syncToDB = async db => {
    if (process.env.SEQUELIZE_ALTER_SYNC === 'true') {
        sync_log ? userLogger.info(attemptingToSync()) : {}
        databases.forEach(database => {
            db.sequelize[database]
                .sync({ alter: true })
                .catch(err => console.error(syncFailedMessage(err)))
            console.log(`✅ ${database} models have been synced to the database!`)
        })
    } else {
        userLogger.info(noSyncMessage())
    }
}

const connectAndSync = async () => {
    // Connect to all databases
    connectToDB(db)

    syncToDB(db)

    app.listen(PORT, () => {
        userLogger.info(listeningMessage(PORT, MAIN_API_ROUTE))
    })
}

/**
 * ================================================================
 * * APP LISTENING...
 * ================================================================
 */

// Start the connection and syncing process
connectAndSync()
