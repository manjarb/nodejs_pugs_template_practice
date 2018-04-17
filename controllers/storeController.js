const mongoose = require('mongoose');
const Store = mongoose.model('Store');

/*exports.myMiddleware = (req, res, next) => {
    req.name = 'wes';
    if(req.name === 'wes') {
        throw Error('That is a stupid name');
    }
    next();
};*/

exports.homePage = (req, res) => {
    console.log(req.name);
    // const wes = { name: 'wes', age: 99 };
    // res.send('Hey! It works!');
    // res.json(wes);
    // res.send(req.query);
    res.render('index', {
        name: 'wes',
        dog: 'sneaker',
        title: 'I Love food'
    });
};

exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
    // res.json(req.body)
    const store = new Store(req.body);
    // Traditional Promise
    /*store
        .save()
        .then(store => {
            res.json(store);
        })
        .catch(err => {
            throw Error(err);
        })*/
    await store.save();
    res.redirect('/');
};