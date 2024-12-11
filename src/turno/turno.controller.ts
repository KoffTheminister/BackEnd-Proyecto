import { Request, Response, NextFunction } from "express"
import { Turno } from './turno.entity.js'
import { orm } from "../shared/db/orm.js"
import { Guardia } from "../guardia/guardia.entity.js";
import { Sector } from "../sector/sector.entity.js";
import { get_guardia } from "../guardia/guardia.controller.js";
import { get_sector } from "../sector/sector.controller.js";

const em = orm.em

async function sanitizar_input_de_turno(req: Request, res: Response, next: NextFunction) {
    req.body.sanitized_input = {
        turno: req.body.turno
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if(req.body.sanitized_input[key] === undefined){
            return res.status(409)
        }
    })

    if(req.body.sanitized_input.turno != 'M' && req.body.sanitized_input.turno != 'T' && req.body.sanitized_input.turno != 'N'){
        return res.status(409).json({ message: 'el turno ingresado no corresponde ni con la mañana ni con la tarde ni con la noche'})
    }
    
    let cod_guardia = get_guardia(req.body.cod_guardia)
    if(cod_guardia == null){
        return res.status(404).json({ message: 'guardia no encontrado'})
    }else{
        req.body.sanitized_input.cod_guadia = cod_guardia
    }

    let cod_sector = get_sector(req.body.cod_sector)
    if(cod_sector == null){
        return res.status(404).json({ message: 'sector no encontrado'})
    }else{
        req.body.sanitized_input.cod_sector = cod_sector
    }

    next()
}


async function sanitizar_input_de_terminar_asignacion(req: Request, res: Response, next: NextFunction) {
    req.body.sanitized_input = {
        turno: req.body.turno
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if(req.body.sanitized_input[key] === undefined){
            return res.status(409)
        }
    })

    if(req.body.sanitized_input.turno != 'M' && req.body.sanitized_input.turno != 'T' && req.body.sanitized_input.turno != 'N'){
        return res.status(409).json({ message: 'el turno ingresado no corresponde ni con la mañana ni con la tarde ni con la noche'})
    }
    
    let cod_guardia = get_guardia(req.body.cod_guardia)
    if(cod_guardia == null){
        return res.status(404).json({ message: 'guardia no encontrado'})
    }else{
        req.body.sanitized_input.cod_guadia = cod_guardia
    }
    next()
}


async function get_all(req:Request, res:Response){
    try{
        const turnos = await em.find(Turno, {})
        //const turnos = await em.getConnection().execute(`select * from turno t where t.fecha_fin is null;`);
        res.status(201).json({ message: 'los turnos:', data: turnos})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function get_from_guardia(el_guardia: Guardia) {
    let turnos = await em.find(Turno, {cod_guardia: el_guardia, fecha_fin: null})
    return turnos
}

async function get_from_sector(el_sector: Sector){
    try{
        const turnos = await em.find(Turno, {cod_sector: el_sector, fecha_fin: null})
        //const turnos = await em.getConnection().execute(`select * from turno t where t.fecha_fin is null and t.cod_sector_cod_sector = ?;`, [cod_sector]);
        return turnos
    } catch (error: any) {
        //res.status(404).json({ message: 'error'})
    }
}

async function add(req:Request, res:Response) {
    try{
        const turnos = await em.findOne(Turno, {cod_guardia: req.body.sanitized_input.cod_guardia, fecha_fin: null, turno: req.body.sanitized_input.turno})
        /*
        const turnos = await em.getConnection().execute(
            `select count(*) as cont
            from turno t 
            where t.fecha_fin is null and t.cod_guardia_cod_guardia = ? and t.turno = ?;`, [req.body.cod_guardia, req.body.turno]);
        */
        if(turnos == null){
            const today = new Date();
            const nuevo_turno = await em.create(Turno, {cod_guardia: req.body.sanitized_input.cod_guardia, cod_sector: req.body.sanitized_input.cod_sector, turno: req.body.sanitized_input.turno, fecha_ini: today, fecha_fin: null})
            /*
            const turnos = await em.getConnection().execute(`insert into turno (cod_guardia_cod_guardia, cod_sector_cod_sector, turno, fecha_ini, fecha_fin)
                                                             values (?, ?, ?, ?, null);`, [req.body.cod_guardia, req.body.cod_sector, req.body.turno, finalDate]);
            */
            await em.flush()
            res.status(201).json({ status : 201})
        } else {
            res.status(409).json({ status: 409, message: 'guardia ocupado en ese turno.'})
        }
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function terminar_asignacion_de_turno(req:Request, res:Response) {
    try{
        const turnos = await em.findOne(Turno, {cod_guardia: req.body.sanitized_input.cod_guardia, fecha_fin: null, turno: req.body.sanitized_input.turno})
        /*
        const turnos = await em.getConnection().execute(
            `select count(*) as cont
             from turno t 
             where t.fecha_fin is null and t.cod_guardia_cod_guardia = ? and t.cod_sector_cod_sector = ? and t.turno = ?;`, [req.body.cod_guardia, req.body.cod_sector, req.body.turno]);
        */
        console.log(turnos)
        if(turnos != null){                                                 
            const today = new Date();
            turnos.fecha_fin = today
            /*
            const modif = await em.getConnection().execute(
                `update turno
                set fecha_fin = ?
                where cod_guardia_cod_guardia = ? and cod_sector_cod_sector = ? and turno = ? and fecha_fin is null;`, [finalDate, req.body.cod_guardia, req.body.cod_sector, req.body.turno]);
            */
            await em.flush()
            res.status(201).json({ status: 201})
        } else {
            res.status(409).json({ status: 409})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

export { get_all, get_from_sector, add, terminar_asignacion_de_turno, get_from_guardia, sanitizar_input_de_turno, sanitizar_input_de_terminar_asignacion}

