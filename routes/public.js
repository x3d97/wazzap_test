const express = require('express');
const knex = require('../db');

const router = express.Router();

router.get('/public/:hash', async (req, res, next) => {
  const { hash } = req.params
  try {
    res.json({ note: await knex('notes').where({ hash }).first('text') })
  } catch (error) {
    next(error)
  }
})

module.exports = router;