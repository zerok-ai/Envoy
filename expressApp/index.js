const express = require('express');
const axios = require('axios');

const ports = [1111, 2222, 3333, 4444];

function unleashServers(port) {
    const bodyParser = require('body-parser');
    const app = express();
    const mysql = require('mysql2');

    app.use(bodyParser.json());

    const conn = mysql.createConnection({
        host: 'localhost',
        user: 'node_user', /* MySQL User */
        password: 'password', /* MySQL Password */
        database: 'node_restapi' /* MySQL Database */
    });

    conn.connect((err) => {
        if (err) throw err;
        console.log('Mysql Connected with App...');
    });

    app.get('/api/items', (req, res) => {
        let sqlQuery = "SELECT * FROM items";

        let query = conn.query(sqlQuery, (err, results) => {
            if (err) throw err;
            res.send(apiResponse(results));
        });
    });

    /**
     * Get Single Item
     *
     * @return response()
     */
    app.get('/api/items/:id', (req, res) => {
        let sqlQuery = "SELECT * FROM items WHERE id=" + req.params.id;

        let query = conn.query(sqlQuery, (err, results) => {
            if (err) throw err;
            res.send(apiResponse(results));
        });
    });

    /**
     * Create New Item
     *
     * @return response()
     */
    app.post('/api/items', (req, res) => {
        let data = { title: req.body.title, body: req.body.body };

        let sqlQuery = "INSERT INTO items SET ?";

        let query = conn.query(sqlQuery, data, (err, results) => {
            if (err) throw err;
            res.send(apiResponse(results));
        });
    });

    /**
     * Update Item
     *
     * @return response()
     */
    app.put('/api/items/:id', (req, res) => {
        let sqlQuery = "UPDATE items SET title='" + req.body.title + "', body='" + req.body.body + "' WHERE id=" + req.params.id;

        let query = conn.query(sqlQuery, (err, results) => {
            if (err) throw err;
            res.send(apiResponse(results));
        });
    });

    /**
     * Delete Item
     *
     * @return response()
     */
    app.delete('/api/items/:id', (req, res) => {
        let sqlQuery = "DELETE FROM items WHERE id=" + req.params.id + "";

        let query = conn.query(sqlQuery, (err, results) => {
            if (err) throw err;
            res.send(apiResponse(results));
        });
    });

    /**
     * API Response
     *
     * @return response()
     */
    function apiResponse(results) {
        return JSON.stringify({ "status": 200, "error": null, "response": results });
    }


    app.get('/', (req, res) => {
        res.send(`Hello World! from ${port} `)
    })

    app.get('/forward/:port', (req, res) => {
        let fwd_port = req.params.port;
        fwd_port = port==1111 ? 9999 : 2222;
        axios({
            method:'get',
            url: "http://localhost:"+fwd_port+"/api/items",
        })
        .then(function (response) {
            res.send(JSON.stringify(response.data));
        })
        .catch(function (error) {
            console.log(error);
        });
    })

    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
}

ports.forEach((x) => {
    unleashServers(x);
})