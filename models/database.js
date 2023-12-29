const {Sequelize} = require ('sequelize')

const db = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
    host:process.env.DB_HOST,
    dialect: 'postgres',
    logging: false

})

db.authenticate().then(()=>{
    console.log('connection has been established')
}).catch(err=>{
    console.error(err)
} )


module.exports = db