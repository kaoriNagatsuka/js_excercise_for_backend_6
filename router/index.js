const express = require('express');
const router = express.Router();

router
    .get('/', (req, res) => {
        res.render('index');
    })
    .get('/quiz', (req, res) => {
        res.render('quiz');
    });

module.exports = router;