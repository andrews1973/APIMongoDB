//1- importamos schema y model de mongoose
import { Schema, model } from "mongoose"
//2- instaciamos Schema con un objeto con las reglas propiedades de nuestro modelo
const ProductosSchema = new Schema({
    nombre: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    descripcion: {
        type: String,
        required: true,
        default: "Sin descripción"
    }
})
//3- exportamos el modelo pasandole el schema como parametro
export const Producto = model("Producto", ProductosSchema) 