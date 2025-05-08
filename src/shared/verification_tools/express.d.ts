import { Administrador } from "../../administrador/administrador.entity.js"

declare global {
    namespace Express {
        interface Request {
            administrador?: {
                cod_administrador: req.body.cod_administrador
                nombre: req.body.nombre,
                apellido: req.body.apellido,
                dni: req.body.dni,
                contrasenia: req.body.contrasenia,
                es_especial: req.body.es_especial
            }
        }
    }
}



