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
    // const store = new Store(req.body);
    // Traditional Promise
    /*store
        .save()
        .then(store => {
            res.json(store);
        })
        .catch(err => {
            throw Error(err);
        })*/
    // await store.save();
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name} Care to leave a review`);
    res.redirect(`/store/${store.slug}`);
};

exports.getStores = async(req, res) => {
    // 1. Query The database for a list of stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

exports.editStores = async(req, res) => {
    // 1. find store with given id
    const store = await Store.findOne({ _id: req.params.id});
    // 2. confirm store owner
    // TODO
    // 3. Render out the edit form so the user can update their store
    res.render('editStore', { title: `Edit ${store.name}`, store})
};

exports.updateStore = async(req, res) => {
    // Set the location data to be a point
    req.body.location.type = 'Point';
    // Find and update store
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, res.body, {
        new: true, // return new store instead of the old one
        runValidators: true
    }).exec();
    req.flash('success', `Success fully update <strong>${store.name}</strong>. <a href="/stores/${store.slug}">View Store</a> `);
    res.redirect(`/stores/${store._id}/edit`);
    // redirect them the store and tell them it worked
};