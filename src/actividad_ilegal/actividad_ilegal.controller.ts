import { Request, Response, NextFunction } from "express"
import { Actividad_Ilegal } from "./actividad_ilegal.entity.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { orm } from "../shared/db/orm.js"
import { ConstraintViolationException } from "@mikro-orm/core"

const em = orm.em

function sanitizar_input_de_actividad_ilegal(req : Request, res : Response, next: NextFunction){
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
}

async function get_all(req:Request, res:Response){
    try{
        const actividadesIlegales = await em.find(Actividad_Ilegal, {estado: true})
        //const actividadesIlegales = await em.getConnection().execute(`select * from actividad_ilegal act_il where act_il.estado = 1;`);
        res.status(201).json({ status: 201, data: actividadesIlegales})
    } catch (error: any) {
        res.status(404).json({ status: 404 })
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_act_ilegal =  Number.parseInt(req.params.cod_actividad_ilegal)
        const la_act_ilegal = await em.findOneOrFail(Actividad_Ilegal, { cod_act_ilegal })
        res.status(201).json({ data: la_act_ilegal, status: 201} )
    } catch (error: any){
        res.status(404).json({status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const la_act_ilegal = await em.findOne(Actividad_Ilegal, {dia_de_la_semana: req.body.dia_de_la_semana, hora_inicio: req.body.hora_inicio, hora_fin: req.body.hora_fin, estado: true})
        /*
        const si_o_no = await em.getConnection().execute(
            `select count(*) as cont 
            from actividad_ilegal act_il 
            where act_il.dia_de_la_semana = ? and act_il.hora_inicio = ? and act_il.hora_fin = ?;`, [req.body.diaDeLaSemana, req.body.horaInicio, req.body.horaFin]);
        */
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
        const la_actividad_verdadera = await em.findOne(Actividad_Ilegal, cod_actividad[0])
        if(la_actividad_verdadera === null) {
            res.status(404).json({status: 404})
        } else if (la_actividad_verdadera.estado == false) {
            res.status(409).json({status: 409})
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
        const actividad_ilegal = await em.findOne(Actividad_Ilegal, {cod_act_ilegal: cod_actividad_ilegal[0], estado: true})
        //const actividad_ilegal = await em.getConnection().execute(`select cod_act_ilegal as cod from actividad_ilegal where cod_act_Ilegal = ? and estado = 1`, [cod_actividad_ilegal[0]]);
        const el_recluso_verdadero = await em.findOne(Recluso, cod_recluso[0])
        if(el_recluso_verdadero !== null && actividad_ilegal !== null){
            /*
            const chequeo = await em.getConnection().execute(`select a_i.cod_act_ilegal, count(a_i_r.recluso_cod_recluso) as cont, cantidad_maxima
                                                                from actividad_ilegal a_i
                                                                left join actividad_ilegal_reclusos a_i_r on a_i_r.actividad_ilegal_cod_act_ilegal = a_i.cod_act_ilegal
                                                                where a_i.cod_act_ilegal = ?
                                                                group by a_i.cod_act_ilegal
                                                                having cantidad_maxima > count(a_i_r.recluso_cod_recluso);`, [cod_actividad_ilegal[0]]);
            */
            if(actividad_ilegal.reclusos.length == actividad_ilegal.cantidad_maxima){
                try{
                    /*
                    const inscripcion = await em.getConnection().execute(`insert into actividad_ilegal_reclusos(actividad_ilegal_cod_act_ilegal, recluso_cod_recluso) 
                                                                            values (?, ?);`, [cod_actividad_ilegal[0], cod_recluso[0]]);
                    */
                    actividad_ilegal.reclusos.add(el_recluso_verdadero)
                    await em.flush()
                    res.status(201).json({status: 201})
                } catch (error: any) {
                    res.status(201).json({status: 408})
                }

            } else {
                res.status(201).json({status: 409})
            }
        }
        if(el_recluso_verdadero === null){
            res.status(404).json({ status: 404 })
        }
        if(actividad_ilegal === null){
            res.status(405).json({ status: 405 })
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { get_all, get_one, add, update, inscripcion }
