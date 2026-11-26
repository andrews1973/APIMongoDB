import { Servicio } from "../models/ServicioModel.js";

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
    const nuevoServicioEnviado = req.body;

    // entre la req y la res puedo hacer un midelware para validar los datos

    // llamo a base de datos y crear nuevo servicios con los datos del objeto
    // findOne devuelve un resgistro o null find me devolvia todos

    // accedemos a sus metodos miramos la documentacion findOne

    const existe = await Servicio.findOne({
      nombre: nuevoServicioEnviado.nombre,
    });

    if (existe) {
      return res.status(409).json({
        // sale del programa con el return
        ok: false,
        msg: "el servicio ya exite",
      });
    }
    // creamos el producto
    const producto = await Servicio.create(nuevoServicioEnviado); // devuelve una promesa hay que poner await

    res.status(201).json({
      ok: true,
      msg: "Has creado un servicio",
      producto, // si se llama la propiedad igual a la clave no hace falta ponerla
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
      error,
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
    const servicios = await Servicio.find();

    if (servicios.length === 0) {
      return res.status(404).json({
        ok: false,
        msg: "No hay ningun servicio",
      });
    }

    res.status(200).json({
      ok: true,
      msg: "Servicios encontrados",
      servicios,
    });
  } catch (error) {
    res.status(500).json({
      ok: false,
      msg: "error del servidor siempre 500",
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

    // Comprobamos que tenga 24 caracteres hexadecimales
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        msg: "ID no válido",
      });
    }

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
      msg: `Has pedido el servicio ${id}`,
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
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Recogemos los nuevos datos enviados desde Postman
    const servicioDatosActualizar = req.body;

    // 3. Actualizamos el servicio en MongoDB
    const servicioActualizado = await Servicio.findByIdAndUpdate(
      id,
      servicioDatosActualizar,
      { new: true, runValidators: true }
    );

    // 4. Comprobamos si existe el servicio
    if (!servicioActualizado) {
      return res.status(404).json({
        ok: false,
        msg: "Servicio no encontrado",
      });
    }

    // 5. Devolvemos el servicio actualizado
    return res.status(200).json({
      ok: true,
      msg: "Servicio actualizado correctamente",
      servicioActualizado,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};


// ========================================
// CONTROLADOR PARA borrar un SERVICIO
// ========================================

export const deleteServiceById = async (req, res) => {
  try {
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Buscamos y eliminamos el servicio
    const servicioEliminado = await Servicio.findByIdAndDelete(id);

    // 3. Comprobamos si existe
    if (!servicioEliminado) {
      return res.status(404).json({
        ok: false,
        msg: "Servicio no encontrado, no se ha borrado",
      });
    }

    // 4. Devolvemos la respuesta
    return res.status(200).json({
      ok: true,
      msg: `Has borrado el servicio ${id}`,
      servicioEliminado,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
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
