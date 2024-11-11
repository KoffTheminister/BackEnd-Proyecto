import { Request, Response, NextFunction } from "express"
import { Estadia } from './estadia.entity.js'
import { orm } from "../shared/db/orm.js"

const em = orm.em

async function getAll(req:Request, res:Response){
    try{
        const estadiasActivas = await em.getConnection().execute(`select * from estadia e where t.fecha_fin is null;`);
        res.status(201).json({ message: 'las estadias activas:', data: estadiasActivas})
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function getOne(req:Request, res:Response){
    try{
        const cod_recluso =  Number.parseInt(req.params.cod_recluso)
        const estadia = await em.getConnection().execute(`select * from estadia e where t.fecha_fin is null and e.cod_recluso_cod_recluso = ?;`, [cod_recluso]);
        res.status(201).json({ message: 'la estadia:', data: estadia})
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}



export { getAll, getOne } //, add }

