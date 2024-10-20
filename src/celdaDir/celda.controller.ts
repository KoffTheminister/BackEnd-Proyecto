import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Celda } from "./celda.entity.js"

const em = orm.em
em.getRepository(Celda)

async function getAll(req:Request, res:Response){
    try{
        const celdas = await em.find(Celda, {})
        res.status(201).json({ message: 'todas las celdas:', data: celdas})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_celda =  Number.parseInt(req.params.cod_celda) 
        const laCelda = await em.getConnection().execute(`select * from celda cel where cel.cod_celda = ?;`, [cod_celda]);
        res.status(201).json({ data: laCelda } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

async function getFromSector(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const lasCeldas = await em.getConnection().execute(`select * from celda cel where cel.cod_sector_cod_sector = ?;`, [cod_sector]);
        if(lasCeldas.length !== 0){
            res.status(201).json({ data: lasCeldas } )
        } else {
            res.status(404).json({ message: 'sector invalido'})
        }
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

export { getAll, getOne, getFromSector }
