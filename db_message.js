/**
 * ================================================================
 * * DATABASE CONFIGURATIONS
 * ================================================================
 */

const attemptingToConnect = () => {
    return `
=========================================================================
ATTEMPTING TO CONNECT TO MULTIPLE DATABASES...
-------------------------------------------------------------------------`
}

const attemptingToSync = () => {
    return `
=========================================================================
ATTEMPTING TO SYNC MULTIPLE DATABASES...
-------------------------------------------------------------------------`
}

const listeningMessage = (PORT, MAIN_API_ROUTE) => {
    return `
=========================================================================
App is currently listening... 🎶
Base URL: http://localhost:${PORT}${MAIN_API_ROUTE}
=========================================================================
    `
}

const failedMessage = err => {
    return `
=========================================================================
FAILED TO CONNECT TO THE DATABASE!
-------------------------------------------------------------------------
${err}
=========================================================================
Have you already done the following?
- Check the database credentials in ./src/config/config.js.
- Check connection in Datagrip.
- Have you created the database? You can check it on the Datagrip.
If you can't solve this, please contact the developer who is probably crying screaming shaking rn.
`
}

const noSyncMessage = () => {
    return `
=========================================================================
Sync is disabled. All databases will not be synced.
If you want to sync, change SEQUELIZE_ALTER_SYNC=true in the .env file.
=========================================================================`
}

const syncFailedMessage = err => {
    return err
}

module.exports = {
    failedMessage,
    syncFailedMessage,
    attemptingToConnect,
    attemptingToSync,
    noSyncMessage,
    listeningMessage,
}
