require('dotenv').config();
const express = require('express')
const router = require('./routes')
const cors = require('cors')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const db = require('./models/database')

const models = require('./models')

const port = process.env.PORT || 5000

const app = express();


app.use(cors());

app.use(morgan('dev'))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', router);


db.sync({alter: true}).then(()=> {
    app.listen(port, () => {
        console.log('server started on port ' + port)
    })
})


app.use('*/images', express.static(__dirname + '/public/images'))