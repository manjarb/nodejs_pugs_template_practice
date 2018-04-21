const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const { catchErrors } = require('../handlers/errorHandlers');

// Do work here
// router.get('/', storeController.myMiddleware, storeController.homePage);
router.get('/', storeController.homePage);

router.get('/stores', catchErrors(storeController.getStores));
router.get('/stores/:id/edit', catchErrors(storeController.editStores));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/add', storeController.addStore);
router.post('/add',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
);
router.post('/add/:id',
    storeController.upload,
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
);

router.get('/reverse/:name', (reg, res) => {
  const reverse = [...reg.params.name].reverse().join('');
  res.send(reverse);
});

router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag*?', catchErrors(storeController.getStoresByTag));

router.get('/login', userController.loginForm);
router.get('/register', userController.registerForm);

// 1. Validate the registration data
// 2. register the user
// 3. we need to log them in
router.post('/register',
    userController.validateRegister,
    // we need to know about errors if
    // validation will be passed, but registration
    // will be failed in some reasons, e.g. second
    // registration with same email
    catchErrors(userController.register),
    authController.login
);

module.exports = router;
