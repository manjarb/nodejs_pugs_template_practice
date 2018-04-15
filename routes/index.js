const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');

// Do work here
// router.get('/', storeController.myMiddleware, storeController.homePage);
router.get('/', storeController.homePage);
router.get('/add', storeController.addStore);
router.post('/add', storeController.createStore);

router.get('/reverse/:name', (reg, res) => {
  const reverse = [...reg.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
