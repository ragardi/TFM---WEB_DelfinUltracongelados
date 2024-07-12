const express = require("express");
const mysql = require("mysql");
const cors = require("cors");
const bcryptjs = require("bcryptjs");
const util = require('util');
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser")
const { body, validationResult } = require('express-validator');

const app = express();

app.use(express.json());
app.use(cookieParser())

app.use(cors({
    origin: 'http://localhost:3000', //URL frontend
    methods: ["POST", "GET", "PUT"],
    credentials: true
}));

//middelware
app.use((req, res, next) => {
    const token = req.cookies.access_token
    req.session = {user:null}

    try{
        const data = jwt.verify(token, "proyecto_desarrollo_tienda_ultacongelados_2024")
        req.session = {user:data}
    } catch { console.log("Invitado")}

    next() //seguimos a la siguiente ruta o middleware
})

const db = mysql.createConnection({
    host: "localhost",
    user: "rgarcia",
    password: "1234",
    database: "tienda_ultracongelados"
});

db.connect((error) => {
    if (error) {
        console.log("Error de conexion: " + error);
        return;
    }
    console.log("CONECTADOS");
});

// Necesario para poder hacer sentencias anidadas 
const query = util.promisify(db.query).bind(db);

app.listen(3001, () => {
    console.log("Servidor corriendo http://localhost:3001");
});


/*****************************/
/********** SESION ***********/
/*****************************/
app.post("/login", [
    body('email').isEmail().withMessage("Formato de correo incorrecto"),
    body('clave').notEmpty().withMessage("La clave es obligatoria")
],async (req, res) => {

    //validamos campos
    const error = validationResult(req)
    if(!error.isEmpty()){
        const firstErrorMessage = error.array()[0].msg;
        
        return res.json({success:false, message:firstErrorMessage})
    }

    const { email, clave } = req.body;

    try {
        const resp = await query('SELECT * FROM clientes WHERE email = ?', [email]);
        if (resp.length === 0 || !(await bcryptjs.compare(clave, resp[0].clave))) {
            return res.json({ success: false, message: "Usuario o contraseña incorrectos" });
        } else {
            const token = jwt.sign({
                codigo: resp[0].c_cliente,
                nombre: resp[0].d_cliente,
                email: resp[0].email,
                administrador: resp[0].administrador }
                ,"proyecto_desarrollo_tienda_ultacongelados_2024" //secreto de la cookie
                ,{expiresIn: '1h'}
            )
                
            return res.cookie("access_token", token, {
                        httpOnly: true,
                        secure: false,
                        sameSite:'strict',
                        maxAge: 1000 * 60 * 60
                    })
                    .json({ success: true, message: "Bienvenido" });
        }
    } catch (error) {
        return res.json({ success: false, message: "Errores al comprobar los parámetros" });
    }
});

app.post("/registro", [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Formato de correo incorrecto'),
    body('clave').isLength({ min: 10 }).withMessage('La clave debe tener al menos 10 caracteres'),
    body('provincia').notEmpty().withMessage('La provincia es obligatoria'),
    body('poblacion').notEmpty().withMessage('La población es obligatoria'),
    body('codpos').isPostalCode('any').withMessage('El código postal incorrecto'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('telefono').isMobilePhone('any').withMessage('El teléfono no es válido')
], async (req, res) => {

    //validamos campos
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const firstErrorMessage = error.array()[0].msg;
        
        return res.json({success:false, message:firstErrorMessage})
    }

    const { nombre, email, clave, provincia, poblacion, codpos, direccion, telefono } = req.body;
    let fecha = new Date();
    let claveHash = await bcryptjs.hash(clave, 8);

    try {
        //Busco ese correo
        const response = await query('SELECT count(*) AS totalCli FROM clientes WHERE email = ?',[email]);
        const cliente = response[0].totalCli || 0;
        if (cliente > 0) {
           return res.json({success: false, message: "Usuario ya registrado en la plataforma"})
        }
       
        //Busco el código del cliente
        const result = await query('SELECT max(c_cliente) AS maxCodigo FROM clientes');
        const maxCodigo = result[0].maxCodigo || 0; // 0 si no hay valores
        const codigo = maxCodigo + 1;

        // Insert cliente
        await query('INSERT INTO clientes(c_cliente, d_cliente, email, clave, fecha_alta, provincia, poblacion, codigo_postal, direccion, telefono, administrador) VALUES (?,?,?,?,?,?,?,?,?,?,?)', 
            [codigo, nombre, email, claveHash, fecha, provincia, poblacion, codpos, direccion, telefono, "N"]);

        return res.json({ success: true, message: "Cuenta creada correctamente" });
    } catch (err) {
        console.log(err);
        return res.json({ success: false, message: "Error al crear sesión" });
    }
});

app.put("/olvidaClave", [
    body('email').isEmail().withMessage('Debe ser un correo electrónico válido'),
    body('clave').isLength({ min: 10 }).withMessage('La clave debe tener al menos 10 caracteres'),
    body('clave2').custom((value, { req }) => {
        if (value !== req.body.clave) {
            throw new Error('Las claves no coinciden');
        }
        return true;
    })
],async (req,res) => {

    //validaciones 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstErrorMessage = errors.array()[0].msg;
        return res.json({success:false, message:firstErrorMessage})
    }

    const {email, clave, clave2} = req.body;
    let claveHash;
    try{
        //Busco si está dado de alta el cliente
        const result = await query('SELECT c_cliente AS codigo FROM clientes WHERE email = ?', [email]);
        const codigo = result[0].codigo || 0
        if(codigo > 0){       
            claveHash = await bcryptjs.hash(clave, 8);
            await query('UPDATE clientes SET clave = ? WHERE c_cliente = ? AND email = ?', [claveHash, codigo, email]);
            return res.json({ success: true, message: "Datos actualizados" });                    
        
        }else{
            return res.json({ success: false, message: "Usuario no registrado en la base de datos" });
            
        }
    }catch(err){
        return res.json({ success: false, message: "Error, intentelo mas tarde" });
    }
});

app.post("/logout", (req, res) => {
    res.clearCookie("access_token")
       .send({success: true})
})

app.get("/datosCliente", async(req, res) => {
    const { user } = req.session
   
    if (!req.session) {
        return res.json({success:false, message:"Usuario no autenticado"})
    }
    res.json(user)
    
})

app.get("/autenticacion", async(req, res) => {
    try {
        const { user } = req.session;
        
        if (!user) {
            return res.json({ success: false, message: "Usuario no autenticado" });
        }

        res.json({ success: true });

    } catch (error) {
       res.json({ success: false, message: "Error interno del servidor" });
    }
    
})


/*****************************/
/******* CAMBIO CLAVE ********/
/*****************************/
app.put("/cambiaClave", [
    body('clave').isLength({ min: 10 }).withMessage('La clave debe tener al menos 10 caracteres'),
    body('clave2').custom((value, { req }) => {
        if (value !== req.body.clave) {
            throw new Error('Las claves no coinciden');
        }
        return true;
    })
],async (req,res) => {

    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    //validaciones 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const firstErrorMessage = errors.array()[0].msg;
        return res.json({success:false, message:firstErrorMessage, auth:true})
    }
   
    const { codigo } = req.session.user
    const {clave, clave2} = req.body;
    let claveHash

    try{
        if(clave === clave2){            
            claveHash = await bcryptjs.hash(clave, 8);    
            await query('UPDATE clientes SET clave = ? WHERE c_cliente = ?', [claveHash, codigo]);
            return res.json({ success: true, message: "Clave actualizada", auth:true });                    
        } else {
            return res.json({ success: false, message: "Las claves no coinciden", auth:true });
        }
        
    }catch(err){
        return res.json({ success: false, message: "Error, intentelo mas tarde", auth:true });
    }
});


/*****************************/
/******* MIS PEDIDOS *********/
/*****************************/
app.get("/mispedidos", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user

    try {
        const result = await query('SELECT * FROM pedidos WHERE c_cliente = ?', [codigo]);
        return res.send({success: true, result});
    } catch (err) {
        console.log(err);
        return res.send({ success: false, message: "Error al obtener pedidos" });
    }
});


app.get("/productospedido", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    const { pedido } = req.query
    try {
        const detalle_pedido = await query("SELECT  pedidos.c_pedido, lpedidos.c_produ, lpedidos.cantidad, round(lpedidos.precio,2) as precio, productos.d_produ, productos.formato, productos.url_foto, round(lpedidos.cantidad * lpedidos.precio,2) as importe, pedidos.fecha, pedidos.c_cliente, pedidos.formaPago FROM pedidos, lpedidos, productos WHERE pedidos.c_pedido = lpedidos.c_pedido and   lpedidos.c_produ = productos.c_produ and   c_cliente = ? AND pedidos.c_pedido = ?",[codigo, pedido])
        
        res.json({success: true, detalle_pedido: detalle_pedido, auth:true})
       
    } catch (err) {
        return res.json({success:false, message:"No hay pedidos en la cesta", auth:true})
    }
});

app.get("/mispedidosdet", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    let c_pedido = 0

    try {
        const pedido = await query ('SELECT c_pedido FROM pedidos WHERE estado = "C" and c_cliente = ?', [codigo])
        c_pedido = pedido[0].c_pedido
        const detalle_pedido = await query("SELECT  pedidos.c_pedido, lpedidos.c_produ, lpedidos.cantidad, round(lpedidos.precio,2) as precio, productos.d_produ, productos.formato, productos.url_foto, round(lpedidos.cantidad * lpedidos.precio,2) as importe, pedidos.fecha, pedidos.c_cliente, pedidos.formaPago FROM pedidos, lpedidos, productos WHERE pedidos.c_pedido = lpedidos.c_pedido and   lpedidos.c_produ = productos.c_produ and   c_cliente = ? AND pedidos.c_pedido = ?",[codigo, c_pedido])
        res.json({success: true, detalle_pedido: detalle_pedido, auth:true})
       
    } catch (err) {
        return res.json({success:false, message:"No hay pedidos en la cesta", auth:true})
    }
});


/*****************************/
/******** MIS DATOS **********/
/*****************************/

app.get("/getcliente", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    try {
        const result = await query('SELECT * FROM clientes WHERE c_cliente = ?', [codigo]);
        if (result.length > 0) {
            res.send({ success: true, result:result}); 
        }
       
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error servdior" });
    }
});

app.put("/actualizacliente", [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Formato de correo incorrecto'),
    body('provincia').notEmpty().withMessage('La provincia es obligatoria'),
    body('poblacion').notEmpty().withMessage('La población es obligatoria'),
    body('codpos').isPostalCode('any').withMessage('El código postal incorrecto'),
    body('direccion').notEmpty().withMessage('La dirección es obligatoria'),
    body('telefono').isMobilePhone('any').withMessage('El teléfono no es válido')
], async(req,res) => {

    //validamos campos
    const error = validationResult(req);
    if (!error.isEmpty()) {
        const firstErrorMessage = error.array()[0].msg;
        
        return res.json({success:false, message:firstErrorMessage})
    }

    const {cliente, nombre, email, provincia, poblacion, codpos, direccion,telefono} = req.body
    try{
        await query('UPDATE clientes SET d_cliente=?, email=?, provincia=?, poblacion=?, codigo_postal=?, direccion=?, telefono=? WHERE c_cliente = ?', [nombre, email, provincia, poblacion, codpos, direccion, telefono, cliente])
        res.json({success:true, message: "Tus datos han sido actualizados"})
    } catch(err) {
        console.log(err)
        res.json({success:false, message: "Error al actualizar los datos"})
    }

})


/*****************************/
/*** MIS PRODUCTOS PEDIDOS ***/
/*****************************/
app.get("/getproductospedidos", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    
    try {
        const result = await query('SELECT c_pedido as pedidos FROM pedidos WHERE c_cliente = ?', [codigo]);
        if(result.length > 0) {
            const pedidos = result.map(row => row.pedidos)
            
            const productoPedidos =  await query ('SELECT * FROM productos WHERE c_produ IN (SELECT DISTINCT c_produ FROM lpedidos WHERE c_pedido IN (?))',  [pedidos])
            res.send({productoPedidos:productoPedidos, success:true, auth:true})
            
        }else{
            res.send({ success: false, message: "No existen pedidos", auth:true});            
        }
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener productos" });
    }
});



/*****************************/
/********* CLIENTES **********/
/*****************************/
//MOSTRAR TODOS
app.get("/clientes", async (req, res) => {
    try {
        const result = await query('SELECT * FROM clientes');
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener clientes" });
    }
});

//GUARDAR CLIENTE - dentro del modal
app.post("/nuevocliente", async(req, res) => {
    const { d_cliente, email, provincia, poblacion, codigo_postal, direccion, telefono, administrador} = req.body.datosCliente
    const clave = await bcryptjs.hash("clave@provisional", 8); //clave que debe cambiar el usuario al iniciar sesión - por seguridad
    const fecha = new Date();

    try{
        //Busco el código del cliente
        const resp = await query('SELECT max(c_cliente) AS maxCodigo FROM clientes');
        const maxCodigo = resp[0].maxCodigo || 0; // 0 si no hay valores
        const c_cliente = maxCodigo + 1;

        const result = await query('INSERT INTO clientes (c_cliente, d_cliente, email, clave, fecha_alta, provincia, poblacion, codigo_postal, direccion, telefono, administrador) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        [c_cliente, d_cliente, email, clave, fecha, provincia, poblacion, codigo_postal, direccion, telefono, administrador]);
        
        res.json({ success: true, message: "Cliente creada correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al crear el cliente" });
    }
})


app.put("/actualizacliente2", async(req, res) => {
    const { c_cliente, d_cliente, email, provincia, poblacion, codigo_postal, direccion, telefono, administrador} = req.body.datosCliente

    try{
        await query('UPDATE clientes SET d_cliente=?, email=?, provincia=?, poblacion=?, codigo_postal=?, direccion=?, telefono=?, administrador=? WHERE c_cliente=?',
        [d_cliente, email, provincia, poblacion, codigo_postal, direccion, telefono, administrador, c_cliente]);
        res.send({ success: true, message: "Cliente creado correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar cliente" });
    }
 })

//ELIMINAR CLIENTE
app.put("/eliminacliente", async(req, res) => {
    const { c_cliente } = req.body.datosCliente

    try{
        await query('DELETE FROM clientes WHERE c_cliente = ?', [c_cliente]);
        res.send({ success: true, message: "Cliente eliminado"})

    }catch{
        console.log(err)
        res.send({ success:false, message:"Error al eliminar el cliente"})
    }

})


/*****************************/
/********** RECETAS **********/
/*****************************/
//MOSTRAR TODAS
app.get("/getRecetas", async (req, res) => {
    try {
        const result = await query('SELECT * FROM recetas');
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener recetas" });
    }
});

//MOSTRAR RECETA
app.get("/mostrarreceta/:c_rec", async (req, res) => {
    const c_receta = req.params.c_rec;

    try {
        const result = await query('SELECT * FROM recetas WHERE estado = "A" AND c_receta = ?', [c_receta]);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener receta" });
    }
});

//GUARDA RECETA
app.post("/nuevareceta", async(req, res) => {
    const { d_receta, desc_receta, personas, minutos_elab, dificultad, url_foto, estado} = req.body.datosRecetas

    try{
        //Busco el código del cliente
        const resp = await query('SELECT max(c_receta) AS maxCodigo FROM recetas');
        const maxCodigo = resp[0].maxCodigo || 0; // 0 si no hay valores
        const c_receta = maxCodigo + 1;

        const result = await query('INSERT INTO recetas (c_receta, d_receta, desc_receta, personas, minutos_elab, dificultad, url_foto, estado) VALUES(?,?,?,?,?,?,?,?)',
        [c_receta, d_receta, desc_receta, personas, minutos_elab, dificultad, url_foto, estado]);
        
        res.json({ success: true, message: "Receta creada correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar receta" });
    }
})
//ACTUALIZAR RECETA
app.put("/actualizareceta", async(req, res) => {    
    const { c_receta, d_receta, desc_receta, personas, minutos_elab, dificultad, url_foto, estado} = req.body.datosRecetas

    try{
        await query('UPDATE recetas SET d_receta=?, desc_receta=?, personas=?, minutos_elab=?, dificultad=?, url_foto=?, estado=? WHERE c_receta=?',
        [d_receta, desc_receta, personas, minutos_elab, dificultad, url_foto, estado, c_receta]);
        res.send({ success: true, message: "Receta creada correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar receta" });
    }
 })

//ELIMINAR RECETA
app.put("/eliminareceta", async(req, res) => {
    const { c_receta } = req.body.datosRecetas

    try{
        const result = await query('DELETE FROM recetas WHERE c_receta = ?', [c_receta]);
        res.send({ success: true, message: "Receta eliminada"})

    }catch{
        console.log(err)
        res.send({ success:false, message:"Error al eliminar la receta"})
    }

})


/*****************************/
/******** PRODUCTOS **********/
/*****************************/
//MOSTRAR TODOS
app.get("/getProductos", async (req, res) => {
    try {
        const result = await query('SELECT * FROM productos');
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener productos" });
    }
});

//MOSTRAR PRODUCTO
app.get("/mostrarproducto/:c_produ", async (req, res) => {
    const c_produ = req.params.c_produ;
    try {
        const result = await query('SELECT * FROM productos WHERE c_produ = ?', [c_produ]);
        res.send(result);
    } catch (err) {
        console.log(err);
        res.status(500).send({ success: false, message: "Error al obtener producto" });
    }
});

//GUARDA PRODUCTO
app.post("/nuevoproducto", async(req, res) => {
    const { d_produ, c_tipo, unidad, formato, precio, url_foto, estado, contenido, informacion, consejos, definicion} = req.body.datosProducto

    try{
        //Busco el código del producto
        const resp = await query('SELECT max(c_produ) AS maxCodigo FROM productos');
        const maxCodigo = resp[0].maxCodigo || 0; // 0 si no hay valores
        const c_produ = maxCodigo + 1;

        await query('INSERT INTO productos (c_produ, d_produ, c_tipo, unidad, formato, precio, url_foto, estado, contenido, informacion, consejos, definicion) VALUES(?,?,?,?,?,?,?,?,?,?,?)',
        [c_produ, d_produ, c_tipo, unidad, formato, precio, url_foto, estado, contenido, informacion, consejos, definicion]);
        
        res.json({ success: true, message: "Prodcuto creado correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar producto" });
    }
})

//ACTUALIZAR PRODUCTO
app.put("/actualizaproducto", async(req, res) => {
    const { c_produ, d_produ, c_tipo, unidad, formato, precio, url_foto, estado, contenido, informacion, consejos, definicion} = req.body.datosProducto    

    try{
        await query('UPDATE productos SET d_produ=?, c_tipo=?, unidad=?, formato=?, precio=?, url_foto=?, estado=?, contenido=?, informacion=?, consejos=?, definicion=? WHERE c_produ=?',
        [d_produ, c_tipo, unidad, formato, precio, url_foto, estado, contenido, informacion, consejos, definicion, c_produ]);
        res.send({ success: true, message: "Producto creado correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar producto" });
    }
 })

//ELIMINAR PRODUCTO
app.put("/eliminaproducto", async(req, res) => {
    const { c_produ } = req.body.datosProducto

    try{
        const result = await query('DELETE FROM productos WHERE c_produ = ?', [c_produ]);
        res.send({ success: true, message: "Producto eliminado"})

    }catch{
        console.log(err)
        res.send({ success:false, message:"Error al eliminar la producto"})
    }
})

/*****************************/
/****** TIPO PRODUCTOS *******/
/*****************************/
app.get("/getTipoProductos", async (req, res) => {
    try {
        const result = await query('SELECT * FROM tipoprodu');
        res.send(result);
    } catch (err) {
        console.log(err);
        res.send({ success: false, message: "Error al obtener tipos de productos" });
    }
});


// /*****************************/
// /******* INGREDIENTES ********/
// /*****************************/
app.get("/getIngredientes/:codigoReceta", async (req, res) => {
    const codigoReceta = req.params.codigoReceta;
    try {
        const result = await query('SELECT * FROM ingredientes WHERE c_receta = ?', [codigoReceta]);
        res.send(result);
    } 
    catch (err) {
        console.log(err);
    }
});

//GUARDA INGREDIENTES
app.post("/guardaingrediente", async(req, res) => {
    const {datosIngredientes, codigoReceta} = req.body
    
    try{

        await query('DELETE FROM ingredientes WHERE c_receta = ?', [codigoReceta]);

        for (const ingrediente of datosIngredientes) {
            const { c_ingrediente, d_ingrediente } = ingrediente;
            const result = await query('INSERT INTO ingredientes (c_ingrediente, d_ingrediente, c_receta) VALUES(?,?,?)',
            [c_ingrediente, d_ingrediente, codigoReceta]);
        }
        
        res.json({ success: true, message: "Ingrediente creada correctamente" });

    }catch(err){
        console.log(err)
        res.send({ success: false, message: "Error al guardar Ingrediente" });
    }
})

//ELIMINAR INGREDIENTES
app.put("/eliminaingrediente", async(req, res) => {
    const {c_ingrediente, codigoReceta} = req.body
   
    try{
        await query('DELETE FROM ingredientes WHERE c_receta = ? AND c_ingrediente= ?', [codigoReceta, c_ingrediente]);
        res.send({ success: true, message: "Ingrediente eliminado"})

    }catch(err){
        console.log(err)
        res.send({ success:false, message:"Error al eliminar la ingrediente"})
    }
})


/*****************************/
/*********** MENU ************/
/*****************************/
app.get("/pedidopendiente", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user

    const pedidoCarro = await query ('SELECT c_pedido FROM pedidos WHERE c_cliente = ? AND estado = "C"', [codigo])
    if (pedidoCarro.length <= 0) return res.send({success:false})

    const productosCarro = await query ('SELECT count(*) AS totalProductos FROM lpedidos WHERE c_pedido = ?', [pedidoCarro[0].c_pedido])
    const totalProductos = productosCarro[0].totalProductos
        
    if (totalProductos > 0) {
        res.send({success:true})
    } else {
        res.send({success:false})
    }
})

/*****************************/
/********* CARRITO ***********/
/*****************************/
app.post("/anadirCarro", async (req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    const {c_produ, cantidad, precio} = req.body
    const fecha = new Date()
    let c_pedido

    try{
        //BUSCO UN PEDIDO PENDIENTE 
        const pedidoCarro = await query ('SELECT c_pedido FROM pedidos WHERE c_cliente = ? AND estado = "C"', [codigo])
        
        if (pedidoCarro.length > 0) {
            c_pedido = pedidoCarro[0].c_pedido
        } else {
            //CONSIGO EL CÓDIGO DEL PEDIDO 
            const resp = await query('SELECT max(c_pedido) AS maxCodigo FROM pedidos');
            const maxCodigo = resp[0].maxCodigo || 0; // 0 si no hay valores
            c_pedido = maxCodigo + 1;
            
            //CREO EL PEDIDO
            await query('INSERT INTO pedidos (c_pedido, fecha, c_cliente, estado) VALUES(?,?,?,?)',
            [c_pedido, fecha, codigo, "C"]);

            //CREO LAS LINEAS DEL PEDIDO
            await query("INSERT INTO lpedidos (c_pedido, c_produ, cantidad, precio) VALUES(?,?,?,?)",[c_pedido, c_produ, cantidad, precio])
        }

        //COMPRUEBO SI ESE ARTICULO ESTA EN MI CESTA
        const existeProdu = await query('SELECT count(*) AS total FROM lpedidos WHERE c_pedido=? AND c_produ = ?', [c_pedido, c_produ])

        if (existeProdu[0].total === 0) {
            await query("INSERT INTO lpedidos (c_pedido, c_produ, cantidad, precio) VALUES(?,?,?,?)",[c_pedido, c_produ, cantidad, precio])
        } else {
            //tengo que conseguir la cantidad anterior para poder sumar al contador
            let cantidadCesta = await query ('SELECT cantidad FROM lpedidos WHERE c_pedido = ? AND c_produ = ?', [c_pedido, c_produ])
            cantidadCesta = cantidad + cantidadCesta[0].cantidad
            await query("UPDATE lpedidos SET cantidad=?, precio=? WHERE c_pedido=? AND c_produ=?", [cantidadCesta, precio, c_pedido, c_produ])
        }
        
        res.send({ success: true, message: "Producto añadido con éxito", auth:true})
        

    } catch(err) {
        console.log(err)
        res.send({ success: false, message: "No se ha podido añadir al carrito", auth:true });

    }
})

//ELIMINAR PRODUCTO CESTA
app.put("/eliminaproductocesta", async(req, res) => {
    const {c_produ, c_pedido} = req.body
   
    try{
        await query('DELETE FROM lpedidos WHERE c_produ = ? AND c_pedido = ?', [c_produ, c_pedido]);
        res.send({ success: true, message: "Producto eliminada"})

    }catch(err){
        console.log(err)
        res.send({ success:false, message:"Error al eliminar el producto"})
    }

})

//ACTUALIZA CARRITO
app.put("/actualizacesta", async(req, res) => {
    const {c_produ, c_pedido, cantidad} = req.body

    try{
        const result = await query('UPDATE lpedidos SET cantidad = ? WHERE c_produ = ? AND c_pedido = ?', [cantidad, c_produ, c_pedido]);
        res.send({ success: true, message: "Producto eliminada"})

    }catch(err){
        console.log(err)
        res.send({ success:false, message:"Error al actualizar el pedido"})
    }
})


/*****************************/
/**** TRATAMIENTO PEDIDO *****/
/*****************************/
app.get("/getdatoscliente", async(req, res) => {
    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user

    try {
        const result = await query ('SELECT * FROM clientes WHERE c_cliente = ?',[codigo])
        res.send({success:true, result:result, auth:true})

    } catch (err){
        res.send({success:false, message:"No tenemos datos de este cliente", auth:true})
    }
})

app.put("/actualizaestadopedido", [
    body('tarjeta').notEmpty().withMessage("La tarjeta es obligatoria"),
    body('fecha').notEmpty().withMessage("La fecha es obligatoria"), 
    body('cvv').notEmpty().withMessage("El CVV es obligatorio"), 
], async(req, res) => {

    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    //validamos campos
    const error = validationResult(req)
    if(!error.isEmpty()){
        const firstErrorMessage = error.array()[0].msg;
         
        return res.json({success:false, message:firstErrorMessage, auth:true})
    }

    const { codigo } = req.session.user
    let fecha = new Date()
    let c_pedido

    try{
        const pedido = await query ('SELECT c_pedido FROM pedidos WHERE estado = "C" and c_cliente = ?', [codigo])
        c_pedido = pedido[0].c_pedido

        const result = await query ('UPDATE pedidos SET fecha = ?, estado = "P", formaPago = "T" WHERE c_cliente = ? AND c_pedido = ?', [fecha, codigo, c_pedido])
        res.send({success:true, auth:true})

    } catch (err){
        console.log(err)
        res.send({success:false, message:"Error al realizar el pago", auth:true})
    }
})

app.put("/actualizapedidocontrareembolso", async(req, res) => {

    if(req.session.user === null) {
        return res.send({success:false, auth:false})
    }

    const { codigo } = req.session.user
    let fecha = new Date()
    let c_pedido

    try{
        const pedido = await query ('SELECT c_pedido FROM pedidos WHERE estado = "C" and c_cliente = ?', [codigo])
        c_pedido = pedido[0].c_pedido

        const result = await query ('UPDATE pedidos SET fecha = ?, estado = "P", formaPago = "R" WHERE c_cliente = ? AND c_pedido = ?', [fecha, codigo, c_pedido])
        res.send({success:true, auth:true})

    } catch (err){
        console.log(err)
        res.send({success:false, message:"Error al finalizar el pedido", auth:true})
    }
})


/**********************/
/**** CARGAR FOTOS ****/
/**********************/

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../client/public/images');  // Ruta donde se guardarán las imágenes
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);  // Nombre del archivo tal cual se subió
    }
});

const upload = multer({ storage });

app.post('/cargafoto', upload.single('image'), (req, res) => {
    
    try {
        res.json({ success: true, fileName: req.file.originalname });
    } catch (error) {
        console.log(error)
        res.status(400).json({ success: false, message: 'Error al subir la imagen' });
    }
});


