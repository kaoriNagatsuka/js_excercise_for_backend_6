const express = require('express');
const router = require('./router/index');
const app = express();
const PORT = '3001';

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/', router);
app.listen(PORT, () => {
    console.log(`Example listener on port${PORT}`);
});

