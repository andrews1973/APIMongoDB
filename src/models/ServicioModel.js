// DEFINICIÓN DEL ESQUEMA Y MODELO
// Un Modelo es la clase con la que interactuamos desde el código para realizar operaciones sobre una colección, 
// construida a partir de un Esquema (Schema).
// importamos Schema y model 
// Creamos un Schema: define la estructura que tendrán los documentos de nuestra colección.
// validamos los datos, definimos su tipo y si es requerido ect, define las reglas
import { Schema, model } from "mongoose"; 

// La clase de mongoose Schema, hay que instanciarla llamando al constructor new Schema({})
// que necesita un objeto, este va a contener las propiedades del modelo

const ServicioSchema = new Schema({
    id:{
        type:Number,
        unique: true,
    },
    nombre:{
        type: String,
        required: true, // Campo obligatorio
        unique: [true, "El nombre es obligatorio"],
        trim: true // Elimina espacios en blanco al inicio y al final
    },
    descripcion:{
        type: String,
        required: true,
        default: "Sin descripción" // Valor por defecto si no se envía
    }
}); 

export const Servicio = model("Servicios", ServicioSchema) 
// crea el modelo llamado Servicio utilizando el Schema que acabamos de definir y que le pasamos como segundo parametro.
// Creamos y exportamos un Model: nos permite interactuar con la colección de MongoDB 
// si hacemos export default Servicio y entonces importacion en controllores sin llaves
// Nota: Mongoose convertirá automáticamente "servicio" en la colección plural "servicios" si lo pones en singular
// hare uso de este modelo en los controladores Servicio, import { Servicio } from "../models/ServicioModel.js"
// Y utilizar sus métodos const servicio = await Servicio.find(), create({model}) findById(id) findByIdAndDelete(id)