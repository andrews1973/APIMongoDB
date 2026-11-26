// importamos los modelos servicio y producto, prodemos utilizar sus metodos
import { Servicio } from "../models/ServicioModel.js";
import { Producto } from "../models/ProductoModel.js";


// ========================================
// CONTROLADOR DE LA PÁGINA PRINCIPAL
// ========================================

// Exportamos la función getIndex para poder utilizarla
// desde nuestro archivo publicRoutes.js donde la importaremos
// req (request): contiene la información de la petición que recibimos del cliente.
// res (response): nos permite enviar una respuesta al cliente.
// Cuando recibimos una petición GET a "/", ejecutamos este controlador.
// Indicamos que la petición ha sido procesada correctamente mediante el código de estado HTTP 200 (OK).
// .json() envía una respuesta en formato JSON al cliente.
export const getIndex = (req, res) => {
  res.status(200).json({
    ok: true,
    mesg: "esto es el index desde la api",
  });
};

// ========================================
// CONTROLADOR PARA OBTENER PRODUCTOS
// ========================================
// Esta función se ejecuta cuando recibimos una petición
// GET a la ruta "/productos" Enviamos una respuesta HTTP 200 (OK).
// Dentro de .json() como hemos comentado enviamos un objeto JavaScript
// que Express convierte automáticamente a formato JSON.
// Es Array con los productos (objetos) que queremos devolver al cliente, procedera de bd

export const getProducts = async (req, res) => {
  try {
    const productos = await Producto.find(); // si no  encuentra productos devuelve array vacio

    // Comprobamos si el array está vacío
    if (productos.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay ningún producto",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Estos son los productos",
      productos // devolvemos todos los productos
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};


// ========================================
// CONTROLADOR PARA OBTENER UN PRODUCTO POR ID
// ========================================

export const getProdctById = async (req, res) => {
  try {
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Buscamos el servicio en MongoDB por su ID
    const productoEncontrado = await Producto.findById(id);

    // 3. Comprobamos si existe
    if (!productoEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    // 4. Devolvemos el servicio encontrado
    res.status(200).json({
      ok: true,
      msg: `Has pedido el producto ${id}`,
      data: productoEncontrado,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

// ========================================
// CONTROLADOR PARA CREAR productos
// ========================================
// 401 si existe comprobar que exista el usuario

export const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const nuevoProductoEnviado = req.body;

    // entre la req y la res puedo hacer un midelware para validar los datos

    // llamo a base de datos y crear nuevo servicios con los datos del objeto
    // findOne devuelve un resgistro o null find me devolvia todos

    // accedemos a sus metodos miramos la documentacion findOne

    const existe = await Producto.findOne({ nombre: nuevoProductoEnviado.nombre });

    if (existe) {
      return res.status(409).json({ // sale del programa con el return
        ok: false,
        msg: "el producto ya exite",
      });
    }
    // creamos el producto
    const producto = await Producto.create(nuevoProductoEnviado); // devuelve una promesa hay que poner await

    res.status(201).json({
      ok: true,
      msg: "Has creado un producto",
      producto, // si se llama la propiedad igual a la clave no hace falta ponerla
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
      error
    });
  }
};

// ========================================
// CONTROLADOR PARA ACTUALIZAR UN PROCUCTO
// ========================================

export const updateProductById = async (req, res) => {
  try {
    // obtener el id
    // console.log(req.params);

    //en el router tengo servicios/:id y si tuviera ademas :/cat tambieen estaria
    const id = req.params.id; // el id que se pase en la url de postma
    // Recogeremos los datos que nos envía el front en el body algo asi ya lo veremos
    // const { id, nombre } = req.body;
    const productoActualizar = req.body;
    // para caputrar querys seria con req.query ?page=1&
    // necesito comprobar si existe ese producto

    res.status(200).json({
      ok: true,
      msg: `Has actualizado el producto ${id}`,
    });
    // throw error // para comprobar que entra en el catch
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
    });
  }
};

// ========================================
// CONTROLADOR PARA BORRAR UN PRODUCTO
// ========================================

export const deleteProductById = async (req, res) => {
  try {
    const id = req.params.id;

    res.status(200).json({
      ok: true,
      msg: `Has borrado el producto ${id}`,
    });
    // throw error // para comprobar que entra en el catch
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
    });
  }
};

// ========================================
// CONTROLADOR PARA OBTENER SERVICIOS
// ========================================

// Esta función se ejecuta cuando recibimos una petición de tipo GET a la ruta "/servicios".
// Indicamos que la operación ha sido correcta con 200 y el mensaje y el array de servicios.

export const getServices = async (req, res) => {
  try {
    const servicios = await Servicio.find()

    if (servicios.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay ningun servicio",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Servicios encontrados",
      servicios
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
    });
  }
};

// ========================================
// CONTROLADOR PARA CREAR servicios
// ========================================

// Esta función se ejecuta cuando recibimos una petición del front de tipo
// POST a la ruta "/servicio".
// Normalmente utilizaremos POST para enviar información desde el cliente al servidor y crear un nuevo producto.
// Enviamos el código de estado HTTP 201 (Created). Este código indica que se ha creado un recurso.
// tambien habria que comprobar si existe el servicio y entonces no dejara crearlo devolviendo 401 etc...
export const createService = async (req, res) => {
  try {
    console.log(req.body);

    // 1. Recogemos los datos enviados
    const nuevoServicioEnviado = req.body;

    // 2. Comprobamos que el nombre no esté vacío, en los datos que recibimos del front
    if (!nuevoServicioEnviado.nombre) {
      return res.status(400).json({
        ok: false,
        msg: "El nombre del servicio es obligatorio"
      });
    }

    // 3. Comprobamos si el servicio ya existe
    // findOne(): busca un único documento que cumpla la condición. Si no lo encuentra devuelve null
    const existe = await Servicio.findOne({nombre: nuevoServicioEnviado.nombre});

    if (existe) {
      return res.status(409).json({
        ok: false,
        msg: "El servicio ya existe, no ha sido creado"
      });
    }

    // 4. Creamos el servicio
    const servicio = await Servicio.create(nuevoServicioEnviado);

    // 5. Devolvemos el servicio creado
    res.status(201).json({
      ok: true,
      msg: "Has creado un servicio",
      servicio
    });

  } catch (error) {
    console.log(error);

    if (error.code === 11000) {
      return res.status(409).json({
        ok: false,
        msg: "error de clave duplicada en MongoDB, El servicio ya existe"
      });
    }

    return res.status(500).json({
      ok: false,
      msg: "Error interno del servidor"
    });
  }
};

/* 
findOne()	Comprobar previamente si existe.
error.code === 11000	Evitar duplicados incluso con peticiones simultáneas donde una ser crea y la otra no. 
Por eso necesitamos capturarlo en el catch.
unique: true	Garantizar la unicidad en MongoDB. 
MongoDB tiene el índice único creado por unique: true, así que solo permite guardar uno
*/

// ========================================
// CONTROLADOR PARA OBTENER un SERVICIO
// ========================================
// Recogemos el ID de la URL 
// es decir requiero esos datos que me los manda el front y iran en el parmetro req
export const getServiceByid = async (req, res) => {
  try {
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Buscamos el servicio en MongoDB por su ID
    const servicioEncontrado = await Servicio.findById(id);

    // 3. Comprobamos si existe
    if (!servicioEncontrado) {
      return res.status(404).json({
        ok: false,
        msg: "Servicio no encontrado",
      });
    }

    // 4. Devolvemos el servicio encontrado
    res.status(200).json({
      ok: true,
      msg: `Has pedido el producto ${id}`,
      data: servicioEncontrado,
    });

  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

// ========================================
// CONTROLADOR PARA actualizar un SERVICIO
// ========================================

export const updateServiceById = async (req, res) => {
  try {
    const id = req.params.id;

    res.status(200).json({
      ok: true,
      msg: `Has actualizado el servicio ${id}`,
    });
    // throw error // para comprobar que entra en el catch
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
    });
  }
};

// ========================================
// CONTROLADOR PARA borrar un SERVICIO
// ========================================
export const deleteServiceById = async (req, res) => {
  try {
    const id = req.params.id;

    res.status(200).json({
      ok: true,
      msg: `Has borrado el servicio ${id}`,
    });
    // throw error // para comprobar que entra en el catch
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
    });
  }
};

/* querys
Model.deleteMany()
Model.deleteOne()
Model.find() // para read y mostrar todos si no encuentra devuelve array vacio
Model.findById() // para mostrar uno
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()
Model.findOne() para buscar si existe cuando vayas a crear uno, devuelve uno o null
Model.findOneAndDelete()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne() 
*/