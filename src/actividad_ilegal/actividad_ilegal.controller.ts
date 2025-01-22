import { Request, Response, NextFunction } from "express"
import { Actividad_Ilegal } from "./actividad_ilegal.entity.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizar_input_de_actividad_ilegal(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: req.body.estado,
        cantidad_maxima: req.body.cantidad_maxima
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
      if (req.body[key] === undefined) {
        return res.status(409).json({ message: 'falta un atributo'})
      }
    })
    next()
}

async function get_all(req:Request, res:Response){
    try{
        const actividadesIlegales = await em.find(Actividad_Ilegal, {estado: true})
        res.status(201).json({ status: 201, data: actividadesIlegales})
    } catch (error: any) {
        res.status(404).json({ status: 404 })
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_act_ilegal =  Number.parseInt(req.params.cod_actividad_ilegal)
        const la_act_ilegal = await em.findOneOrFail(Actividad_Ilegal, { cod_act_ilegal }, {populate: ['reclusos']})
        res.status(201).json({ data: la_act_ilegal, status: 201} )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const la_act_ilegal = await em.findOne(Actividad_Ilegal, {dia_de_la_semana: req.body.dia_de_la_semana, hora_inicio: req.body.hora_inicio, hora_fin: req.body.hora_fin, estado: true})
        if(la_act_ilegal == null){
            const nueva_act_ilegal = em.create(Actividad_Ilegal, req.body)
            await em.flush()
            res.status(201).json({status: 201})
        }else{
            res.status(409).json({status: 409})
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
            res.status(404).json({status: 404})
        } else {
            const laActividad = em.getReference(Actividad_Ilegal, cod_actividad[0])
            em.assign(laActividad, req.body)
            await em.flush()
            res.status(201).json({status: 201})
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
                    try{
                        actividad_ilegal.reclusos.add(el_recluso_verdadero)
                        await em.flush()
                        res.status(201).json({status: 201, message: 'smebiulok'})
                    } catch (error: any) {
                        console.log(error.message)
                        res.status(201).json({status: 408, message: 408})
                    }
                } else {
                    res.status(201).json({status: 409})
                }
            } else {
                actividad_ilegal.reclusos.add(el_recluso_verdadero)
                await em.flush()
                res.status(201).json({status: 201})
            }
        }
        if(el_recluso_verdadero == null){
            return res.status(404).json({ status: 404 })
        }
        if(actividad_ilegal == null){
            return res.status(405).json({ status: 405 })
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { get_all, get_one, add, update, inscripcion, sanitizar_input_de_actividad_ilegal }
