const express = require('express');
const knex = require('../db');
const Exceptions = require('../exceptions')
const { TABLES } = require('../utils/Constants');

const router = express.Router();

//Get all notes
router.get('/notes/', async (req, res, next) => {
  const page = +req.query.page || 1
  const pageSize = +req.query.pageSize || 50
  const offset = (page - 1) * pageSize

  try {
    res.json(
      await knex(TABLES.NOTES)
        .select('id', 'text')
        .where({ id_user: req.decoded.id_user })
        .offset(offset)
        .limit(pageSize)
    )
  } catch (error) {
    next(error)
  }
})

// Create note
router.post('/notes/', async (req, res, next) => {
  const { text, isPublic } = req.body

  try {
    if (!text || text === '') throw new Exceptions.NotFoundError(`Note must be not empty!`)

    await knex(TABLES.NOTES).insert({
      id_user: req.decoded.id_user,
      text,
      hash: isPublic ? +new Date().toString(36) : null,
    })

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// Update note
router.patch('/notes/:id', async (req, res, next) => {
  const { id } = req.params
  const { text } = req.body

  try {
    const note = await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).first()
    if (!note) throw new Exceptions.NotFoundError(`No such note: ${id}`)

    await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).update({ text })

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// Delete note
router.delete('/notes/:id', async (req, res, next) => {
  const { id } = req.params

  try {
    const note = await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).first()
    if (!note) throw new Exceptions.NotFoundError(`No such note: ${id}`)

    await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).del()

    res.json({ success: true })
  } catch (error) {
    next(error)
  }
})

// Share note (creating hash and send it to client) or unshare
router.patch('/notes/share/:id', async (req, res, next) => {
  const { id } = req.params
  const { isPrivate } = req.query

  try {
    const note = await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).first()
    if (!note) throw new Exceptions.NotFoundError(`No such note: ${id}`)
    if (!isPrivate && note.hash) throw new Exceptions.ConflictError(`Note: "${id}" already is public`)
    if (isPrivate && !note.hash) throw new Exceptions.ConflictError(`Note: "${id}" already is private`)

    await knex(TABLES.NOTES)
      .where({ id, id_user: req.decoded.id_user })
      .update({ hash: isPrivate ? null : (+new Date()).toString(36) })

    const link = await knex(TABLES.NOTES).where({ id, id_user: req.decoded.id_user }).first('hash').then(row => `${req.headers.host}/api/public/${row.hash}`)

    res.json({ link: isPrivate ? 'private' : link })

  } catch (error) {
    next(error)
  }
})

module.exports = router;