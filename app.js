//Requerimos los modulos
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const multer = require ('multer');
const app = express();
const {check,validationResult} =require ('express-validator');
const session = require ('express-session')

//Requerimos los ruteadores
const indexRouter = require('./routes/index');
const formsRouter = require ('./routes/forms');


//Requerimos los controladores
const indexController = require ('./controllers/indexController');
const detailController = require ('./controllers/detailController');
const formsController = require ('./controllers/formsController');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//Middleware MULTER
const  storage = multer.diskStorage({//Definimos el almacenamiento
  destination:(req,file,cb)=>{//Ubicacion de almacen
    let folder = path.join (__dirname, './public/images');
    cb(null,folder)
  },
  filename:(req,file,cb)=>{//Nombre con el cual se va a almacenar
    cb(null,file.originalname )
    
  }
})
const upload=multer({
  //ALMACEN
  storage,

//DESTINO
  dest:path.join(__dirname,'./public/images'),

  fileFilter:(req,file,cb)=>{
    //FILTRO DE ARCHIVO
    const fileType= /jpeg|jpg|png/ //TIPO DE EXT ACEPTADO

    const mimeType= fileType.test(file.mimetype);//NOMBRE DE LA EXTENCION

    const extname = fileType.test (path.extname(file.originalname));//RECORTAMOS LA EXTENCION

    mimeType && extname?  cb(null,true):cb ('El tipo de extencion no es compatible')
    //SI MATCHEA-> CARGA //DE LO CONTRARIO Error
  }
}).single ('image')//TIPO DE SUBIDA DE IMAGEN INDIVIDUAL DEL FORMULARIO name = 'image'

//MIDDLEWARE GENERAL
app.use (upload)
app.use(logger('dev'));
app.use(express.json());//Con esto vamos a poder leer en formato JSON
app.use(express.urlencoded({ extended: false })); //Con esto lo que hacemos es establecer que toodo lo que viaje por forms se convierta en un  objeto literal 
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use (session({secret:"Shh, secreto"}));
app.use('/', indexRouter); //Desde esta pagina definimos las rutas
app.use ('/forms',formsRouter) ;



app.use(function(req, res, next) {// MIDDLEWARE GLOBAL En caso de no encontrar la ruta Error 404
  next(res.status(404).send ('Errores'));
});




module.exports = app;
