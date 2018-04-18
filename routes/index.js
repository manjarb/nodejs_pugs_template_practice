const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// router.get('/', storeController.myMiddleware, storeController.homePage);
router.get('/', storeController.homePage);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStores));

router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore));
router.post('/add/:id', catchErrors(storeController.updateStore));

router.get('/reverse/:name', (reg, res) => {
  const reverse = [...reg.params.name].reverse().join('');
  res.send(reverse);
});

module.exports = router;
