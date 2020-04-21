const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const tokenMiddleware = require('./middlewares/tokenHandler')

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const router = express.Router();

app.use('/api', router);

// Unprotected routes
router.use('/', routes.auth);
router.use('/', routes.public);

router.use(tokenMiddleware());

// Protected routes
router.use('/', routes.notes);
router.use('/', routes.logout);

module.exports = app