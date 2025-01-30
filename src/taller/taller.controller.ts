import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Taller } from "./taller.entity.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { validar_nuevo_taller, validar_update_taller } from "./taller.schema.js"


const em = orm.em

async function sanitizar_input_de_taller(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: true
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if (req.body.sanitized_input[key] === undefined) {
            return res.status(400).json({ message: `Falta el campo ${key}` })
        }
    })

    const incoming = await validar_nuevo_taller(req.body.sanitized_input)
    if(!incoming.success){
        return res.status(400).json({status: 400, message: incoming.issues})
    }
    req.body.sanitized_input = incoming.output

    next()
}


function sanitizar_update_de_taller(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        estado: req.body.estado  //solo estos datos pueden ser modificados
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
        if (req.body.sanitized_input[key] === undefined) {
            delete req.body[key]
        }
    })

    next()
}



async function get_all(req:Request, res:Response){
    try{
        const talleres = await em.find(Taller, {estado: true}, { orderBy: { dia_de_la_semana: 'asc' } })
        res.status(201).json({ status: 201, data: talleres})
    } catch (error: any) {
        res.status(404).json({ status: 404})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_taller =  Number.parseInt(req.params.cod_taller)
        const el_taller = await em.findOneOrFail(Taller, { cod_taller: cod_taller }, {populate: ['reclusos']})
        res.status(201).json({ data: el_taller, status: 201} )
    } catch (error: any){
        res.status(404).json({ status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const un_taller = await em.findOne(Taller, {dia_de_la_semana: req.body.sanitized_input.dia_de_la_semana, hora_inicio: req.body.sanitized_input.hora_inicio, hora_fin: req.body.sanitized_input.hora_fin})
        if(un_taller == null){
            const elTaller = em.create(Taller, req.body.sanitized_input)
            await em.flush()
            res.status(201).json({status: 201, data: elTaller})
        }else{
            res.status(409).json({status: 409})
        }
    } catch (error: any) {
        console.log(error.message)
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const incoming = await validar_nuevo_taller(req.body)
        if(!incoming.success){
            return res.status(400).json({status: 400, message: incoming.issues})
        }
        req.body = incoming.output
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const elTallerVerdadero = await em.findOne(Taller, cod_taller[0])
        if (elTallerVerdadero == null) {
            return res.status(404).json({ status: 404})
        }
        const elTaller = em.getReference(Taller, cod_taller[0])
        em.assign(elTaller, req.body)
        await em.flush()
        res.status(201).json({status: 201})
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function inscripcion(req: Request, res: Response) {
    try {
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const el_taller_verdadero = await em.findOne(Taller, {cod_taller: cod_taller[0], estado: true}, {populate: ['reclusos']})
        const cod_recluso : any[] = [];
        cod_recluso[0] = Number(req.params.cod_recluso)
        const el_recluso_verdadero = await em.findOne(Recluso, cod_recluso[0])
        if(el_recluso_verdadero != null && el_taller_verdadero != null){
            if(el_taller_verdadero.reclusos.isInitialized()){
                try{
                    el_taller_verdadero.reclusos.add(el_recluso_verdadero)
                    await em.flush()
                    res.status(201).json({ status: 201 })
                } catch (error: any){
                    res.status(409).json({ status: 409 })
                }
            } else {
                el_taller_verdadero.reclusos.add(el_recluso_verdadero)
                await em.flush()
                res.status(201).json({status: 201})
            }
        } else {
            res.status(410).json({ status: 410})
        }

        if(el_recluso_verdadero === null){
            return res.status(404).json({ status: 404 })
        }
        if(el_taller_verdadero === null){
            return res.status(404).json({ status: 403 })
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { get_all, get_one, add, update, inscripcion, sanitizar_input_de_taller, sanitizar_update_de_taller }





