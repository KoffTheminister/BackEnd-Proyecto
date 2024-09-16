import { Request, Response, NextFunction } from "express"
import { Turno } from './turno.entity.js'
import { orm } from "../shared/db/orm.js"

const em = orm.em

async function getAll(req:Request, res:Response){
    try{
        const turnos = await em.getConnection().execute(`select * from turno t where t.fecha_fin is not null;`);
        res.status(201).json({ message: 'los turnos:', data: turnos})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getFromSector(req:Request, res:Response){
    try{
        const cod_sector =  Number.parseInt(req.params.cod_sector)
        const turnos = await em.getConnection().execute(`select * from turno t where t.fecha_fin is not null and t.cod_sector_cod_sector = ?;`, [cod_sector]);
        res.status(201).json({ message: 'los sectores:', data: turnos})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function add(req:Request, res:Response) {
    try{
        const turnos = await em.getConnection().execute(`select count(*) as cont
                                                         from turno t 
                                                         where t.fecha_fin is null and t.cod_guardia_cod_guardia = ? and t.turno = ?;`, [req.body.cod_guardia_cod_guardia, req.body.turno]);
        if(turnos[0].cont === 0){
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            let year = today.getFullYear();
            let finalDate = `${year}-${month}-${day}`
            const turnos = await em.getConnection().execute(`insert into turno (cod_guardia_cod_guardia, cod_sector_cod_sector, turno, fecha_ini, fecha_fin)
                                                             values (?, ?, ?, ?, null);`, [req.body.cod_guardia_cod_guardia, req.body.cod_sector_cod_sector, req.body.turno, finalDate]);
            await em.flush()
            res.status(200).json({ message: 'turno creado'})
        } else {
            res.status(500).json({ message: 'el guardia tiene un turno en el mismo horario, no se puede crear turno'})
        }
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function terminarAsignacionDeTurno(req:Request, res:Response) {
    try{
        const cod_guardia =  Number.parseInt(req.params.cod_guardia)
        const turnos = await em.getConnection().execute(`select count(*) as cont
                                                         from turno t 
                                                         where t.fecha_fin is null and t.cod_guardia_cod_guardia = ? and t.turno = ?;`, [cod_guardia, req.params.turno]);
        console.log(turnos)
        if(turnos[0].cont === 1){                                                 
            const today = new Date();
            const day = today.getDate();
            const month = today.getMonth() + 1;
            let year = today.getFullYear();
            let finalDate = `${year}-${month}-${day}`
            const modif = await em.getConnection().execute(`update turno
                                                            set fecha_fin = ?
                                                            where cod_guardia_cod_guardia = ? and fecha_fin is null and turno = ?;`, [finalDate, cod_guardia, req.params.turno]);
            await em.flush()
            res.status(200).json({ message: 'turno finalizado'})
        } else {
            res.status(404).json({ message: 'no existen turnos con esas especificaciones'})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

export { getAll, getFromSector, add, terminarAsignacionDeTurno}
