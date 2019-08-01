const express = require('express'),
    app = express(),
    mysql = require('mysql'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    port = 8000

/**
 * Mysql Database Connection
 */
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'temp',
    password: 'root'
})

connection.connect(error => {
    error && console.log(error) || console.log(`Mysql Connected-----`)
})

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, error => {
    error && console.log(error) || console.log(`Localhost:${port} connected -----------`)
})

/**
 * Api to search property
 */
app.get('/property/search', (req, res, next) => {
    let { from, to } = req.query,
        base_query = `select * from property`,
        substring_query = ` where SUBSTRING_INDEX(p_code,'HTL',-1) `

    if (from && to) {
        base_query += ` ${substring_query} BETWEEN ${from} AND ${to}`
    }
    else if (from) {
        base_query += ` ${substring_query} > ${from}`
    }
    else if (to) {
        base_query += ` ${substring_query} < ${to}`
    }

    connection.query(base_query, (error, rows, fields) => {
        error && res.send(error)
        res.status(200).send({ data: rows })
    })
})
