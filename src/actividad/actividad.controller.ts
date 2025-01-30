import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { get_sector } from "../sector/sector.controller.js"
import { validar_nueva_actividad } from "./actividad.schema.js"

const em = orm.em

async function sanitizar_input_de_actividad(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: req.body.estado,
        cantidad_minima: req.body.cantidad_minima,
        edad_minima: req.body.edad_minima,          
    }

    for (const key of Object.keys(req.body.sanitized_input)) {
        if (req.body.sanitized_input[key] === undefined) {
            return res.status(400).json({ status: 400, message: 'faltan atributos' });
        }
    }

    const incoming = await validar_nueva_actividad(req.body.sanitized_input)
    if(!incoming.success){
        return res.status(400).json({status: 400, message: incoming.issues})
    }
    req.body.sanitized_input = incoming.output

    req.body.sanitized_input.cod_sector = await get_sector(req.body.sanitized_input.cod_sector)
    if(req.body.sanitized_input.cod_sector == null){
        return res.status(404).json({ message: 'sector invalido'})
    }
    next()
}

async function get_all(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, { estado: true })
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad: cod_actividad , estado: true}, {populate: ['reclusos']}) 
        res.status(201).json({ status: 201, data: laActividad} )
    } catch (error: any){
        res.status(404).json({ status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const actividad = await em.findOne(Actividad, { estado: true , cod_sector: req.body.sanitized_input.cod_sector, dia_de_la_semana: req.body.sanitized_input.dia_de_la_semana, })
        const reclusos_validos = await req.body.sanitized_input.cod_sector.conseguir_reclusos_con_edad(req.body.sanitized_input.edad_minima)
        if(reclusos_validos.length >= req.body.sanitized_input.cantidad_minima && actividad == null){     
            req.body.sanitized_input.reclusos = reclusos_validos                 
            const la_actividad = await em.create(Actividad, req.body.sanitized_input)
            await em.flush()
            res.status(201).json({ status: 201})
        } else if (reclusos_validos.length < req.body.cantidad_minima){
            res.status(404).json({ status: 404})
        } else if (actividad != null){
            res.status(409).json({ status: 409})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_actividad : any[] = [];
        cod_actividad[0] = Number(req.params.cod_actividad)
        const laActividadVerdadera = await em.findOne(Actividad, {cod_actividad: cod_actividad[0], estado: true})
        if(laActividadVerdadera == null) {
            res.status(404).json({ status: 404})
        } else {
            const laActividad = em.getReference(Actividad, cod_actividad[0])
            em.assign(laActividad, req.body)
            await em.flush()
            res.status(201).json({status: 201})
        }
    } catch (error: any) {
        res.status(500).json({ message : error.message })
    }
}

export { get_all, get_one, add, update, sanitizar_input_de_actividad }



