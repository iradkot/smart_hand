const express = require('express')

const router = express.Router()
const { getDirectoryStructure } = require('./directoryStructure')

router.get('/folder-structure', async (req, res) => {
  try {
    const structure = await getDirectoryStructure('/path/to/directory')
    res.json(structure)
  } catch (error) {
    res.status(500).send(error.toString())
  }
})

module.exports = router
