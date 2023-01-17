const express = require('express');

const router = express.Router();
const db = require('../../../models');
const q = require('../../queries');

// Fetch combined data for a specific Memorial
router.get('/data/:id', async (req, res) => {
  const { id } = req.params;
  let MemorialData;
  try {
    MemorialData = await q.queryMemorialData(id);
  } catch (err) {
    console.error(`Error encountered: queryMemorialData. ${err}`);
  }
  res.json(MemorialData);
});

// Fetch a Memorial Text Entry
router.get('/text/:id', (req, res) => {
  const { id } = req.params;
  db.MemorialMeta.findAll({
    where: {
      MemorialID: id,
    },
    order: [['Heading', 'ASC']],
  }).then((dbPost) => {
    res.json(dbPost);
  });
});

// Fetch status of memorial for a given user
router.get('/status/:memid/:userid', async (req, res) => {
  const memId = req.params.memid;
  const userId = req.params.userid;
  let MemorialStatus;
  try {
    MemorialStatus = await q.queryMemorialStatusByUser(memId, userId);
  } catch (err) {
    console.error(`Error encountered: queryMemorialStatusByUser. ${err}`);
  }
  if (MemorialStatus.length === 0) {
    MemorialStatus = [
      {
        Status: 9,
      },
    ];
  }
  console.log(MemorialStatus);
  res.json(MemorialStatus);
});

module.exports = router;
