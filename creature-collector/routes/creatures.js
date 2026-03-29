const express = require('express');
const router = express.Router();
const creatureCtrl = require('../controllers/creatureController');

router.get('/', creatureCtrl.getCreatures);
router.post('/', creatureCtrl.addCreature);
router.delete('/:id', creatureCtrl.deleteCreature);

module.exports = router;
