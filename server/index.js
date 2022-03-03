
require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors")
app.use(cors())
const morgan = require("morgan");
const fs = require('fs').promises
const path = require("path")
require("./models/db")

const router = require("./Routers")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(morgan("common"));
// app.use(helmet())

const removeImg = async (req, res) => {
    try {
        await fs.unlink(path.join(__dirname, 'images', req.params.id))
        res.status(200).json('Image deleted')
    } catch (err) {
        console.log(err)
    }
}

// Router Middleware
app.use("/api", router)
// app.use('/', require('./controllers/DeleteImage'))

// remove images with this route
app.use('/api/rmvimage/:id', removeImg)

// post images using multer 
const multer = require("multer")

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name)
    }
});

app.use("/images", express.static(path.join(__dirname, "/images")))

const upload = multer({storage})
app.use('/api/upload', upload.single("file"), (req, res) => res.status(200).json('File has been uploaded'))


// Listening on port
const port = process.env.PORT || 8800
app.listen(port, () => console.log(`Backend Running on port ${port}`))