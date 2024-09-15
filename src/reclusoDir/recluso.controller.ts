import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Recluso } from "./recluso.entity.js"

const em = orm.em
em.getRepository(Recluso)

function sanitizarInputDeRecluso(req: Request, res: Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        apellido: req.body.apellido,
        dni: req.body.dni,
        fecha_nac: req.body.fecha_nac
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if(req.body.sanitizedInput[key] === undefined){
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const reclusos = await em.find(Recluso, {})
        res.status(201).json({ message: 'los reclusos:', data: reclusos})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function getSome(req : Request, res : Response){
    try{
        const reclusos = await em.find(Recluso, { nombre: '%req.params.nombreParcial%'})
        res.status(201).json({ data: reclusos })
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_recluso =  Number.parseInt(req.params.cod_recluso) 
        const elRecluso = await em.findOneOrFail(Recluso, { cod_recluso })
        res.status(201).json({ data: elRecluso } )
    } catch (error: any){
        res.status(404).json({ message: error.message})
    }
}

async function add(req: Request, res: Response){
    try{
        const rec = await em.getConnection().execute(`select * from recluso rec where rec.dni = ?;`, [req.body.dni]);
        console.log(rec[0])
        if(rec[0] === undefined){
            const elRecluso = await em.create(Recluso, req.body) 
            await em.flush()
            res.status(201).json({message: 'recluso creado', data: elRecluso})
        }else{
            res.status(409).json({message: 'recluso ya creado', data: rec[0].cod_recluso})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

export { getAll, getSome, getOne, add, sanitizarInputDeRecluso }
