import multer from 'multer';
import path from 'path';
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       return cb(null, './uploads')
//     },
//     filename: function (req, file, cb) {
//       return cb(null, `${Date.now()}-${file.originalname}`)
//     }
//   })

//   const upload = multer({ storage: storage })

                    // OR
                    
const upload = multer({
    dest: 'uploads/',
    limits: { fileSize: 50 * 1024 * 1024 },
    storage: multer.diskStorage({
        destination: function(req, file, cb){
            cb(null,'./uploads');
        },
        
        filename: function (req, file, cb) {
            return cb(null, `${Date.now()}-${file.originalname}`)
        }
    }),
    fileFilter: function(req,file,cb){
        let extension = path.extname(file.originalname);
        if( extension !== '.png' && 
            extension !== '.jpg' && 
            extension !== '.jpeg' && 
            extension !== '.mp4'  && 
            extension !== '.webp'
        ){
            return cb(new Error(`Unsupported file type! ${extension}`), false);       
        }
        cb(null, true);
    },
});

export default upload;
