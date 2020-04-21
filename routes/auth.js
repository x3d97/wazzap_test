const express = require('express');
const knex = require('../db');
const config = require('../config');
const Exceptions = require('../exceptions')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const { TABLES } = require('../utils/Constants');

const router = express.Router();

const hashHandler = (password, salt) => crypto
  .createHash('sha256')
  .update(password + salt)
  .digest('hex');

router.post('/auth/registration', async (req, res, next) => {
  const { login, password } = req.body
  try {
    if (!login || !password) throw new Exceptions.AuthenticationError(null, 'wrong_params')

    const isExist = await knex(TABLES.USERS).where({ login }).first()
    if (isExist) throw new Exceptions.ConflictError(`User with login: "${login}" alredy exist`)

    const hash = hashHandler(password, config.passwordSalt)

    await knex(TABLES.USERS).insert({ login, password: hash })

    res.json({ user: await knex(TABLES.USERS).where({ login }).first() })
  } catch (error) {
    next(error)
  }
})

router.post('/auth/login', async (req, res, next) => {
  const { login, password } = req.body
  try {
    if (!login || !password) throw new Exceptions.AuthenticationError(null, 'wrong_params')

    const user = await knex(TABLES.USERS).where({ login }).first()
    const hash = hashHandler(password, config.passwordSalt)

    if (!user || user.password !== hash) throw new Exceptions.AuthenticationError('Wrong login or password.', 'login_failure');

    const token = jwt.sign({ id_user: user.id, login: user.login }, config.tokenSecret, { expiresIn: '1d' });

    await knex('jwt_sessions').insert({ id_user: user.id, token })

    res.json({ token })
  } catch (error) {
    next(error)
  }
})

module.exports = router;