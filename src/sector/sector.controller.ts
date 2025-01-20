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
    try {
        const el_sector = await em.findOneOrFail(Sector, { cod_sector })
        return el_sector
    } catch (error: any){
        return null
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector })
        res.status(201).json({ status: 201, data: el_sector } )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function get_sectores_con_sentencia(la_sentencia: Sentencia){
    let sectores_con_sentencia: any[] = []
    const sectores = await em.find(Sector, {}) //, {populate: ['celdas', 'sentencias']})
    let i = 0
    let bool = true
    sectores.forEach(un_sector => {
        console.log('holi')
        if(un_sector.sentencias.contains(la_sentencia)){
            sectores_con_sentencia.push(un_sector)
        }
    })
    return sectores_con_sentencia
}

async function get_celdas(req: Request, res: Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector }) //, {populate: ['celdas', 'sentencias']})
        await el_sector.sentencias.init()
        await em.flush()
        res.status(201).json({ status: 201, data: el_sector.sentencias} )
    } catch (error: any){
        res.status(404).json({status: 404 })
    }
}


async function agregar_sentencia_a_sector(req : Request, res : Response){
    try{
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector }) //, {populate: ['sentencias']})
        const las_sentencias = await get_sentencias_especificas(req.body.cod_sentencias)
        const sentencias_agregadas = el_sector.agregar_sentencias(las_sentencias)
        await em.flush()
        res.status(201).json({ status: 201, data: sentencias_agregadas})
    } catch (error: any) {
        console.log(error.message)
        res.status(404).json({ message: error.message})
    }
}

//parte de turno de aca en adelante:

const turnos_posibles = ['M', 'T', 'N']

async function sanitizar_input_de_turno(req: Request, res: Response, next: NextFunction) {
    req.body.sanitized_input = {
        turno: req.body.turno
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if(req.body.sanitized_input[key] === undefined){
            return res.status(409)
        }
    })

    if(!(req.body.sanitized_input.turno in turnos_posibles)){
    //if(req.body.sanitized_input.turno != 'M' && req.body.sanitized_input.turno != 'T' && req.body.sanitized_input.turno != 'N'){
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

    if(!(req.body.sanitized_input.turno in turnos_posibles)){
    //if(req.body.sanitized_input.turno != 'M' && req.body.sanitized_input.turno != 'T' && req.body.sanitized_input.turno != 'N'){
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

async function get_from_sector(req:Request, res:Response){
    try {
        const cod_sector =  Number.parseInt(req.params.cod_sector) 
        const el_sector = await em.findOneOrFail(Sector, { cod_sector }, {populate: ['guardias_m', 'guardias_t', 'guardias_n']})
        res.status(201).json({ status: 201, guardias_m: el_sector.guardias_m, guardias_t: el_sector.guardias_t, guardias_n: el_sector.guardias_n } )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function add_turno(req:Request, res:Response) {
    try{
        if(req.body.sanitized_input.turno == 'M' && req.body.sanitized_input.cod_guardia.cod_sector_m == undefined){
            req.body.sanitized_input.cod_guardia.cod_sector_m = req.body.sanitized_input.cod_sector
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        if(req.body.sanitized_input.turno == 'T' && req.body.sanitized_input.cod_guardia.cod_sector_t == undefined){
            req.body.sanitized_input.cod_guardia.cod_sector_t = req.body.sanitized_input.cod_sector
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        if(req.body.sanitized_input.turno == 'N' && req.body.sanitized_input.cod_guardia.cod_sector_n == undefined){
            req.body.sanitized_input.cod_guardia.cod_sector_n = req.body.sanitized_input.cod_sector
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        res.status(409).json({ status: 409, message: 'guardia ocupado en ese turno.'})
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

async function end_turno(req:Request, res:Response) {
    try{
        if(req.body.sanitized_input.turno == 'M' && req.body.sanitized_input.cod_guardia.cod_sector_m == req.body.sanitized_input.cod_sector){
            req.body.sanitized_input.cod_guardia.cod_sector_m = undefined
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        if(req.body.sanitized_input.turno == 'T' && req.body.sanitized_input.cod_guardia.cod_sector_t == req.body.sanitized_input.cod_sector){
            req.body.sanitized_input.cod_guardia.cod_sector_t = undefined
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        if(req.body.sanitized_input.turno == 'N' && req.body.sanitized_input.cod_guardia.cod_sector_n == req.body.sanitized_input.cod_sector){
            req.body.sanitized_input.cod_guardia.cod_sector_n = undefined
            await em.flush()
            return res.status(201).json({ status : 201})
        }

        res.status(409).json({ status: 409, message: 'guardia ocupado en ese turno.'})
    } catch (error: any) {
        res.status(404).json({ message: error.message})
    }
}

export { get_all, get_one, get_celdas, agregar_sentencia_a_sector, get_sector, get_sectores_con_sentencia, sanitizar_input_de_terminar_asignacion, sanitizar_input_de_turno, get_from_sector, add_turno, end_turno }
