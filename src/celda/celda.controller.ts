import { Request, Response } from "express"
import { orm } from "../shared/db/orm.js"
import { Celda } from "./celda.entity.js"

const em = orm.em
em.getRepository(Celda)

async function get_all(req:Request, res:Response){
    try{
        const celdas = await em.find(Celda, {}, {populate: ['reclusos']})
        res.status(201).json({ message: 'todas las celdas:', data: celdas})
    } catch (error: any) {
        res.status(404).json({ message: 'error get all'})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_celda =  Number.parseInt(req.params.cod_celda) 
        const la_celda = await em.findOne(Celda, {cod_celda: cod_celda}, {populate: ['reclusos']})
        res.status(201).json({ data: la_celda } )
    } catch (error: any){
        res.status(500).json({ message: error.message})
    }
}

export { get_one, get_all } 
