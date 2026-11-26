// importamos los modelos servicio y producto, prodemos utilizar sus metodos
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
/*
export const getIndex = (req, res) => {
  res.status(200).json({
    ok: true,
    mesg: "esto es el index desde la api",
  });
};
*/

// ========================================
// CONTROLADOR PARA CREAR productos
// ========================================
// 401 si existe comprobar que exista el usuario

export const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    const nuevoProductoEnviado = req.body;

    // entre la req y la res puedo hacer un midelware para validar los datos

    // Desestructuramos el nombre para comprobar si ya existe
    const { nombre } = nuevoProductoEnviado;

    // Comprobamos si existe un producto con ese nombre
    // findOne devuelve un resgistro o null find me devolvia todos en un array

    const existe = await Producto.findOne({ nombre });

    if (existe) {
      return res.status(409).json({
        // sale del programa con el return
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
      error,
    });
  }
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
      productos, // devolvemos todos los productos
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
    // compruebo si es un id de mongo
    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
      return res.status(400).json({
        ok: false,
        msg: "ID no válido",
      });
    }

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
// CONTROLADOR PARA ACTUALIZAR UN PROCUCTO
// ========================================

export const updateProductById = async (req, res) => {
  try {
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Recogemos los nuevos datos enviados desde Postman
    const productoDatosActualizar = req.body;

    if (!productoDatosActualizar) {
      return res.status(404).json({
        ok: false,
        msg: "no has enviado datos para actualizar",
      });
    }

    // 3. Actualizamos el producto en MongoDB, devuelve el producto actualizado y si no null
    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      productoDatosActualizar,
      { new: true } // devuelve el documento actualizado, el producto
    );

    // 4. Comprobamos si existe el producto si es null
    if (!productoActualizado) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado",
      });
    }

    // 5. Devolvemos el producto actualizado
    res.status(200).json({
      ok: true,
      msg: `Has actualizado el producto ${productoDatosActualizar}`,
      productoActualizado,
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
// CONTROLADOR PARA BORRAR UN PRODUCTO
// ========================================


export const deleteProductById = async (req, res) => {
  try {
    // 1. Recogemos el ID de la URL
    const id = req.params.id;

    // 2. Buscamos y eliminamos el producto si encuentra el producto: devuelve el documento eliminado si no null.
    const productoEliminado = await Producto.findByIdAndDelete(id);

    // 3. Comprobamos si existe si devuelve null...
    if (!productoEliminado) {
      return res.status(404).json({
        ok: false,
        msg: "Producto no encontrado, no se ha borrado",
      });
    }

    // 4. Devolvemos la respuesta
    return res.status(200).json({
      ok: true,
      msg: `Has borrado el producto ${id}`,
      productoEliminado,
    });

  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Error del servidor",
    });
  }
};

