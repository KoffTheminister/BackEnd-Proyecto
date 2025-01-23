import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sector } from "./sector.entity.js"
import { get_sentencias_especificas } from "../sentencia/sentencia.controller.js"
import { Sentencia } from "../sentencia/sentencia.entity.js"
import { Celda } from "../celda/celda.entity.js"
import { get_guardia } from "../guardia/guardia.controller.js";

const em = orm.em
em.getRepository(Sector)

async function get_all(req:Request, res:Response){
    try{
        const sectores = await em.find(Sector, {})
        res.status(201).json({ status: 201, data: sectores})
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function get_sector(cod_sector: number) {
    return await em.findOne(Sector, { cod_sector }, {populate: ['celdas', 'sentencias', 'turnos']})
}

async function get_one(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector: cod_sector }, {populate: ['celdas', 'sentencias', 'turnos']})
        res.status(201).json({ status: 201, data: el_sector } )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function get_sectores_con_sentencia(la_sentencia: Sentencia){
    let sectores_con_sentencia: any[] = []
    const sectores = await em.find(Sector, {}, {populate: ['sentencias', 'celdas']})
    let i = 0
    while(i < sectores.length){
        if(sectores[i].sentencias.contains(la_sentencia)){
            sectores_con_sentencia.push(sectores[i])
        }
        i++
    }
    return sectores_con_sentencia
}

async function get_celdas(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector }, {populate: ['celdas']})
        res.status(201).json({ status: 201, data: el_sector.celdas} )
    } catch (error: any){
        res.status(404).json({status: 404 })
    }
}

async function agregar_sentencia_a_sector(req : Request, res : Response){
    try{
        const cod_sector =  Number.parseInt(req.body.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector }, {populate: ['sentencias']})
        const las_sentencias = await get_sentencias_especificas(req.body.cod_sentencias)
        const sentencias_agregadas = await el_sector.agregar_sentencias(las_sentencias, em)
        res.status(201).json({ status: 201, data: sentencias_agregadas})
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

export { get_all, get_one, get_celdas, agregar_sentencia_a_sector, get_sector, get_sectores_con_sentencia }
