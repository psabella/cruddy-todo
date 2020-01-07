const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, id) => {
  //should not store in items, needs to create new txt file
  //id = txt files name
    var filePath = path.join(exports.dataDir, id + '.txt');
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        callback(new Error('somethings very wrong'));
      } else {
        callback(null, { id, text });
      }
    });
  // items[id] = text;
  // callback(null, { id, text });
  });
};

exports.readAll = (callback) => {
  //need to make asynch
  //items will be an array of file names (ids)
  //str.slice(0, 5)
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(null, []);
    } else {
      var pamsHope = files.map(file => {
        console.log(({ id: file.slice(0, 5), text: file.slice(0, 5) }));
        return { id: file.slice(0, 5), text: file.slice(0, 5) };
      });
      callback(null, pamsHope);
    }
  });
};


exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, {id, text: fileData.toString()});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
