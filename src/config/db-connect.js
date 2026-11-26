// Para trabajar con MongoDB desde Node.js de forma estructurada utilizamos Mongoose // npm install mongoose   
// permite definir esquemas y validar datos antes de guardarlos en la base de datos.
// Importa el módulo en tu archivo principal
// El método mongoose.connect() es asíncrono y devuelve una promesa, por lo que se gestiona 
// mediante async/await y try/catch
// llamare a la funcion dbConect() en app.js y gestionare el .then (opcional) y el catch para resolver la promesa
import mongoose from "mongoose";  

export const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.URI); // variable de entorno donde esta la uri, archivo .env
        return "Base de datos local conectada correctamente"; // no haria falta gestionar el then 
    } catch (error) {
        throw 'No hay conexion'
    }
}
// en cuanto haga el primer registro se crea la base de datos si no esta creada, y las colecciones y documentos