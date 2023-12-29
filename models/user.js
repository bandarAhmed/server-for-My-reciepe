const {Sequelize, DataTypes} = require('sequelize')
const db = require('./database')
const models = require('.')

const User = db.define('User', {
    name: {
        type: Sequelize.DataTypes.STRING
    },
    email: {
        type: Sequelize.DataTypes.STRING,
        unique: true
    },
    password: {
        type: Sequelize.DataTypes.STRING
    },
    img_uri: {
        type: Sequelize.DataTypes.STRING
    }
},{
    timestamps: false
});


User.associte = models => {
    User.hasMany(models.Post)
    User.hasMany(models.Comment)
}

module.exports = User