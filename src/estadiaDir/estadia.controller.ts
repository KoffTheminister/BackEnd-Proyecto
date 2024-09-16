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

async function add(req:Request, res:Response) {
    try{
        const cod_celda =  Number.parseInt(req.params.cod_celda)
        const celdas = await em.getConnection().execute(`select c.cod_celda as cod, c.cod_sector_cod_sector as sec, c.capacidad, count(e.cod_celda_cod_celda)
                                                         from celda c
                                                         inner join estadia e on c.cod_celda = e.cod_celda_cod_celda
                                                         where e.fecha_fin is null and c.cod_celda_cod_celda = ?
                                                         group by c.cod_celda
                                                         having c.capacidad > count(e.cod_celda_cod_celda);`, [cod_celda]);
        if(celdas.lenght !== 0){
            const cod_recluso =  Number.parseInt(req.params.cod_recluso)
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            let year = today.getFullYear();
            let finalDate = `${year}-${month}-${day}`
            const actualizacion = await em.getConnection().execute(`update estadia
                                                                    let fecha_fin = ?
                                                                    where cod_recluso_cod_recluso = ?;`, [finalDate, cod_recluso]);
            await em.flush()
            const asignacion = await em.getConnection().execute(`insert into estadia (cod_recluso_cod_recluso, cod_celda_cod_celda, cod_celda_cod_sector_cod_sector, fecha_ini, fecha_fin)
                                                                 values (?, ?, ?, ?, null);`, [cod_recluso, cod_celda, celdas[0].sec, finalDate]);
            await em.flush()
            res.status(200).json({ message: 'recluso cambiado de celda'})

        }else {
            res.status(500).json({ message: 'el recluso no puede ser cambiado a esa celda por falta de capacidad'})
        }
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}


export { getAll, getOne, add }

