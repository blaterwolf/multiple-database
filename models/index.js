'use strict'

const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const process = require('process')
const basename = path.basename(__filename)
const env = process.env.NODE_ENV || 'development'
const config = require(__dirname + '/../config/config.json')[env]
const db = {}
const sequelizeInstances = {}

const databases = Object.keys(config)

for (let i = 0; i < databases.length; i++) {
    let database = databases[i]
    let dbConfig = config[database]
    sequelizeInstances[database] = new Sequelize(
        dbConfig.database,
        dbConfig.username,
        dbConfig.password,
        dbConfig
    )
}

databases.forEach(database => {
    fs.readdirSync(__dirname + `/${database}`)
        .filter(file => {
            return (
                file.indexOf('.') !== 0 &&
                file !== basename &&
                file.slice(-3) === '.js' &&
                file.indexOf('.test.js') === -1
            )
        })
        .forEach(file => {
            const model = require(path.join(__dirname + `/${database}`, file))(
                sequelizeInstances[database],
                Sequelize.DataTypes
            )
            db[model.name] = model
        })
})

Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db)
    }
})

db.sequelize = sequelizeInstances
db.Sequelize = Sequelize

module.exports = db
