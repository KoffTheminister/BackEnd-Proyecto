import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Administrador } from "./administrador.entity.js"

const em = orm.em
em.getRepository(Administrador)

function sanitizarInputDeAdministrador(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fechaIniContrato: req.body.fechaIniContrato,
        fechaFinContrato: req.body.fechaFinContrato,
        contrasenia: req.body.contrasenia
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function logIn(req: Request, res: Response){
    try {
        const cod_administrador = Number.parseInt(req.body.cod_administrador) 
        const elAdmin = await em.findOneOrFail(Administrador, { cod_administrador })
        if(elAdmin.contrasenia === req.body.contrasenia){
            if(elAdmin.cod_administrador === 11){
                res.status(202).json({ message: 'ok' } )
            } else {
                res.status(201).json({ message: 'ok' } )
            }
        }else{
            res.status(401).json({ message: 'contraseña incorrecta' } )
        }
    } catch (error: any){
        res.status(404).json({ message: 'no encontrado' } )
    }
}

async function getAll(req:Request, res:Response){
    try{
        const administradores = await em.getConnection().execute(`select * from administrador admin where admin.fecha_fin_contrato is null;`);
        res.status(201).json({ message: 'los administradores:', data: administradores})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_administrador =  Number.parseInt(req.params.cod_administrador) 
        const elGuardia = await em.findOne(Administrador, { cod_administrador })
        res.status(201).json({ data: elGuardia } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

export { getAll, getOne, logIn, sanitizarInputDeAdministrador }
