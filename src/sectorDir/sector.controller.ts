import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sector } from "./sector.entity.js"

const em = orm.em
em.getRepository(Sector)

async function getAll(req:Request, res:Response){
    try{
        const sectores = await em.find(Sector, {})
        res.status(201).json({ message: 'los sectores:', data: sectores})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function getSome(req : Request, res : Response){
    try{
        const sectores = await em.find(Sector, { nombre: '%req.params.nombreParcial%'})
        res.status(201).json({ data: sectores })
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const elSector = await em.findOneOrFail(Sector, { cod_sector })
        res.status(201).json({ data: elSector } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

export { getAll, getSome, getOne }
