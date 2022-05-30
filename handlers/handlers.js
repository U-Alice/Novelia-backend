const uuid = require("uuid");
const { Book } = require("../models/bookModel");
const _ = require("lodash");
const cloudinary = require("cloudinary").v2;
const mongoose = require("mongoose");
const multer = require("multer");
const Grid = require("gridfs-stream");
const dotenv= require('dotenv');
const { ReadStream } = require("fs-extra");
const { GridFSBucket } = require("mongodb");
const rapidApi = require('rapidapi-connect');
const rapid = new rapidApi('', '')
dotenv.config()

cloudinary.config({
  cloud_name: "daso1btiz",
  api_key: "468557256968463",
  api_secret: "3S13jGO6WJPZ6-ojNFRUZmeshaY",
  secure: true,
});
const conn = mongoose.createConnection(process.env.URL);
// Init gfs
let gfs;
let gridFs;
conn.once('open', () => {
    gridFs = new mongoose.mongo.GridFSBucket(conn.db, {
        bucketName: 'uploads'
    })
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});
module.exports.uploadBook = (req, res) => {
  return async (req, res, next) => {
    try {
      if (req.file) {
        const newBook = _.pick(req.body, ['name', 'year', 'rating', 'author', 'preview'])
        const saveBook = new Book(newBook)
        await saveBook.save()
      } else {
        res.send("no file chosen");
      }
    } catch (error) {
      console.log(error);
    }
  };
};

module.exports.getUploads = (req, res, next) => {
    gfs.files.find().toArray((err, files) => {
      if (!files || files.length === 0) {
        return res.status(404).json({
          err: 'No files exist'
        });
      }
      return res.json(files);
    });
  };

module.exports.getOne = () => {
    return  async (req, res) => {
        await gfs.files.findOne({ filename: req.params.filename }, async (err, file) => {
            // Check if file
      if (!file || file.length === 0) {
          return res.status(404).json({
          err: 'No file exists'
        });
      }
      // Check if image
      if (file.contentType === 'image/jpeg' || file.contentType === 'image/png') {
          console.log(file)

          const readstream = gridFs.openDownloadStream(file._id)
          readstream.pipe(res);

        } else {
            res.status(404).json({
                err: 'Not an image'
            });
        }
    });
}
}
module.export.getBooks = ()=>{
  return async (req, res)=>{
    const fetch = require('node-fetch');

const url = 'https://hapi-books.p.rapidapi.com/book/56597885';

const options = {
  method: 'GET',
  headers: {
    'X-RapidAPI-Host': 'hapi-books.p.rapidapi.com',
    'X-RapidAPI-Key': '9657fe62f6msha6e9555c9710604p10b4a2jsn29b89285b70c'
  }
};

fetch(url, options)
	.then(res => res.json())
	.then(json => console.log(json))
	.catch(err => console.error('error:' + err));
  }
}