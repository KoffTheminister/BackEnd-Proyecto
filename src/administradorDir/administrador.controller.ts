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
        const elGuardia = await em.findOneOrFail(Administrador, { cod_administrador })
        if(elGuardia?.contrasenia === req.body.contrasenia){
            res.status(201).json({ message: 'ok' } )
        }else{
            res.status(401).json({ message: 'contra incorrecta' } )
        }
        if(elGuardia === null){
            res.status(404).json({ message: 'no encontrado' } )
        }
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}


async function getAll(req:Request, res:Response){
    try{
        const administradores = await em.find(Administrador, {})
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

async function update(req: Request, res: Response) {
    try{
        const cod_administrador: any[] = [];
        cod_administrador[0] = Number(req.params.cod_administrador)
        const elAdministradorVerdadero = await em.findOne(Administrador, cod_administrador[0])
        if (elAdministradorVerdadero === null) {
            res.status(404).json({ message: 'el administrador no coincide con ninguno de los registrados'})
        }
        const administradorParaActualizar = em.getReference(Administrador, cod_administrador[0])
        em.assign(administradorParaActualizar, req.body.sanitizedInput)
        await em.flush()
        res.status(200).json({ message: 'administrador cambiado' })
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_administrador: any[] = [];
        cod_administrador[0] = Number(req.params.cod_administrador)
        const administradorVerdadero = await em.findOne(Administrador, cod_administrador[0])
        if (administradorVerdadero === null){
            return res.status(500).json({message: 'administrador no encontrado'})
        }
        const administradorParaBorrar = await em.getReference(Administrador, cod_administrador[0])
        await em.removeAndFlush(administradorParaBorrar)
        res.status(200).json({ message: 'administrador eliminado'})
    } catch (error: any) {
        res.status(500).json({ message : error.message })
    }
}

export { getAll, getOne, logIn, update, deleteOne, sanitizarInputDeAdministrador }
