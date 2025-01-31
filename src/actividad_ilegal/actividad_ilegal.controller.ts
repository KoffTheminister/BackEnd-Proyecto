import { Request, Response, NextFunction } from "express"
import { Actividad_Ilegal } from "./actividad_ilegal.entity.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { orm } from "../shared/db/orm.js"
import { validar_nueva_actividad_ilegal, validar_update_actividad_ilegal } from "./actividad_ilegal.schema.js"

const em = orm.em

async function sanitizar_input_de_actividad_ilegal(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: true,
        cantidad_maxima: req.body.cantidad_maxima
    }

    for (const key of Object.keys(req.body.sanitized_input)){
        if(req.body.sanitized_input[key] === undefined){ //NO cambiar el === a ==
            return res.status(400).json({ status: 400,  message: `Falta el campo ${key}` });
        }
    }

    const incoming = await validar_nueva_actividad_ilegal(req.body.sanitized_input)
    if(!incoming.success){
        return res.status(400).json({status: 400, message: incoming.issues})
    }
    req.body.sanitized_input = incoming.output    
    
    next()
}

async function sanitizar_update_de_actividad_ilegal(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        estado: req.body.estado  //solo estos datos pueden ser modificados
    }

    for (const key of Object.keys(req.body.sanitized_input)) {
        if (req.body.sanitized_input[key] === undefined) {
            delete req.body[key]
        }
    }

    const incoming = await validar_update_actividad_ilegal(req.body)
    if(!incoming.success){
        return res.status(400).json({status: 400, message: incoming.issues[0].message})
    }
    req.body = incoming.output

    next()
}


async function get_all(req:Request, res:Response){
    try{
        const actividades_ilegales = await em.find(Actividad_Ilegal, {estado: true})
        res.status(201).json({ status: 201, data: actividades_ilegales})
    } catch (error: any) {
        res.status(500).json({ status: 500 })
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_act_ilegal =  Number.parseInt(req.params.cod_actividad_ilegal)
        const la_act_ilegal = await em.findOneOrFail(Actividad_Ilegal, { cod_act_ilegal: cod_act_ilegal, estado: true }, {populate: ['reclusos']})
        res.status(201).json({ data: la_act_ilegal, status: 201} )
    } catch (error: any){
        res.status(404).json({status: 404, message: 'actividad ilegal no encontrada'})
    }
}

async function add(req: Request, res: Response){
    try{
        const la_act_ilegal = await em.findOne(Actividad_Ilegal, {dia_de_la_semana: req.body.dia_de_la_semana, hora_inicio: req.body.hora_inicio, hora_fin: req.body.hora_fin, estado: true})
        if(la_act_ilegal == null){
            const nueva_act_ilegal = em.create(Actividad_Ilegal, req.body)
            await em.flush()
            res.status(201).json({status: 201, message: 'actividad ilegal almacenada'})
        }else{
            res.status(409).json({status: 409, message: 'no se puede crear la actividad ilegal debido a que pisaria a otra'})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_actividad : any[] = [];
        cod_actividad[0] = Number(req.params.cod_act_ilegal)
        const la_actividad_verdadera = await em.findOne(Actividad_Ilegal, {cod_act_ilegal: cod_actividad[0], estado: true})
        if(la_actividad_verdadera === null) {
            res.status(404).json({status: 404, message: 'actividad ilegal no encontrada'})
        } else {
            const laActividad = em.getReference(Actividad_Ilegal, cod_actividad[0])
            em.assign(laActividad, req.body)
            await em.flush()
            res.status(201).json({status: 201, message: 'cambios hechos'})
        }
    } catch (error: any) {
        res.status(500).json({ message : error.message })
    }
}

async function inscripcion(req: Request, res: Response) {
    try {
        const cod_actividad_ilegal : any[] = [];
        cod_actividad_ilegal[0] = Number(req.params.cod_act_ilegal)
        const cod_recluso : any[] = [];
        cod_recluso[0] = Number(req.params.cod_recluso)
        const actividad_ilegal = await em.findOne(Actividad_Ilegal, {cod_act_ilegal: cod_actividad_ilegal[0], estado: true}, {populate: ['reclusos']})
        const el_recluso_verdadero = await em.findOne(Recluso, cod_recluso[0])
        if(el_recluso_verdadero != null && actividad_ilegal != null){
            if(actividad_ilegal.reclusos.isInitialized()){
                if(actividad_ilegal.reclusos.length < actividad_ilegal.cantidad_maxima){
                    if(!actividad_ilegal.reclusos.contains(el_recluso_verdadero)){
                        actividad_ilegal.reclusos.add(el_recluso_verdadero)
                        await em.flush()
                        res.status(201).json({status: 201, message: 'inscripcion lograda'})
                    } else {
                        res.status(409).json({status: 409, message: 'recluso ya inscripto'})
                    }
                } else {
                    res.status(409).json({status: 409, message: 'no queda lugar disponible'})
                }
            } else {
                actividad_ilegal.reclusos.add(el_recluso_verdadero)
                await em.flush()
                res.status(201).json({status: 201, message: 'inscripcion lograda'})
            }
        }
        if(el_recluso_verdadero == null){
            return res.status(404).json({ status: 404 , message: 'recluso no encontrado'})
        }
        if(actividad_ilegal == null){
            return res.status(405).json({ status: 405 , message: 'actividad ilegal no encontrada'})
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { get_all, get_one, add, update, inscripcion, sanitizar_input_de_actividad_ilegal, sanitizar_update_de_actividad_ilegal }


