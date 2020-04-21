const express = require('express');
const knex = require('../db');
const { TABLES } = require('../utils/Constants');

const router = express.Router();

router.delete('/auth/logout', async (req, res, next) => {
  try {
    await knex(TABLES.JWT_SESSIONS).where({ id_user: req.decoded.id_user }).del()

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

module.exports = router;