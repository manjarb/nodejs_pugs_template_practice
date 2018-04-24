const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
// Save image to memory
const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if (isPhoto) {
          next(null, true);
      } else {
          next({ message: 'File Type not Allowed' }, false);
      }
  }
};
// Save actual image
const jimp = require('jimp');
const uuid = require('uuid');

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
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully Created ${store.name} Care to leave a review`);
    res.redirect(`/stores/${store.slug}`);
};

exports.getStores = async(req, res) => {
    // 1. Query The database for a list of stores
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores });
};

const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
        throw Error('You must own a store in order to edit it!');
    }
};

exports.editStores = async(req, res) => {
    // 1. find store with given id
    const store = await Store.findOne({ _id: req.params.id});
    // 2. confirm store owner
    confirmOwner(store, req.user);
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

exports.upload = multer(multerOptions).single('photo');

exports.resize = async(req, res, next) => {
    // if check no new file to resize
    if(!req.file) {
        next(); // skip to next middle ware
        return;
    }
    const extension = req.file.mimetype.split('/')[1];
    req.body.photo = `${uuid.v4()}.${extension}`;
    // now we resize
    const photo = await jimp.read(req.file.buffer);
    await photo.resize(800, jimp.AUTO);
    await photo.write(`./public/uploads/${req.body.photo}`);
    // once we have written the photo to our file system, keep going
    next();
};

exports.getStoreBySlug = async(req, res, next) => {
  const store = await Store.findOne({ slug: req.params.slug }).populate('author');
  if(!store) {
      return next();
  }
  res.render("store", { store, title: store.name });
};

exports.getStoresByTag = async (req, res) => {
    const tag = req.params.tag;
    const tagQuery = tag || { $exists: true, $ne: [] };

    const tagsPromise = Store.getTagsList();
    const storesPromise = Store.find({ tags: tagQuery });
    const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

    res.render('tag', { tags, title: 'Tags', tag, stores });
};