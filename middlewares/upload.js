const multer = require('multer')


const DIR = './public/images'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, DIR)
    },
    filename: (req, file, cb) => {
        let extArray = file.mimetype.split("/")
        let extension = extArray[1]
        const uniqueSuffix = Date.now()
        cb(null, file.fieldname + "-" + uniqueSuffix + "." + extension)
    }
})


const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
            cb(null, true)
        } else {
            cb(new multer.MulterError("not a picture"))
        }
    }
})

module.exports = upload