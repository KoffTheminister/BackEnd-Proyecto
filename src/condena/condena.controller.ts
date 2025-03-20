import { Request, Response, NextFunction} from "express"
import { orm } from "../shared/db/orm.js"
import { Condena } from "./condena.entity.js"
import { Sentencia } from "../sentencia/sentencia.entity.js"
import { buscar_recluso, get_one } from "../recluso/recluso.controller.js"
import { get_sentencias_especificas } from "../sentencia/sentencia.controller.js"
import { get_sectores_con_sentencia } from "../sector/sector.controller.js"

const em = orm.em

async function sanitizar_input_de_condena(req:Request, res:Response, next: NextFunction) {
    const today = new Date();
    const el_recluso_verdadero = await buscar_recluso(req.body.cod_recluso)

    if(el_recluso_verdadero != null && req.body.cod_sentencias.length != 0){
        req.body.sanitized_input = {
            cod_recluso: el_recluso_verdadero,
            fecha_ini: today,
            fecha_fin_estimada: null,
            fecha_fin_real: null,
        }
        next()
    } else if (el_recluso_verdadero != null){
        return res.status(400).json({ message: 'el codigo de recluso no coincide con ninguno registrado'})
    } else if (req.body.cod_sentencias.length == 0){
        return res.status(400).json({ message: 'ninguna sentencia fue enviada'})
    }
}

async function get_all(req:Request, res:Response){
    try{
        const condenas = await em.find(Condena, {fecha_fin_real: null}, {populate: ['sentencias'], orderBy: {'fecha_ini': 'DESC'}})
        res.status(201).json({ message: 'las condenas:', data: condenas})
    } catch (error: any) {
        res.status(500).json({ message: error.message})
    }
}

async function add(req: Request, res: Response){
    try{
        const nueva_condena = em.create(Condena, req.body.sanitized_input)
        await em.flush()
        const mis_sentencias = await get_sentencias_especificas(req.body.cod_sentencias)
        //await nueva_condena.agregar_sentencias(mis_sentencias, em)

        let duracion_en_anios = 0
        for (const una_sentencia of mis_sentencias) {
            nueva_condena.sentencias.add(una_sentencia)
            duracion_en_anios += una_sentencia.duracion_anios
        }
        await em.flush()
        let fecha = new Date()
        let la_fecha_estimada = { fecha_fin_estimada: new Date(fecha.setFullYear(fecha.getFullYear() + duracion_en_anios)) }
        em.assign(nueva_condena, la_fecha_estimada);
        //await em.persistAndFlush(this)
        await em.flush()


        let la_sentencia_maxima: Sentencia = mis_sentencias[0]
        let i = 1
        while(i < mis_sentencias.length){
            if(mis_sentencias[i].orden_de_gravedad > la_sentencia_maxima.orden_de_gravedad) la_sentencia_maxima = mis_sentencias[i]
            i++
        }
        let los_sectores = await get_sectores_con_sentencia(la_sentencia_maxima)

        let j = 0
        while(j < los_sectores.length){
            let la_celda = await los_sectores[j].encarcelar_recluso(nueva_condena.cod_recluso, em)
            console.log(nueva_condena)
            if(la_celda != null) return res.status(201).json({ status: 201, celda: la_celda})
            j++
        }

        console.log(nueva_condena)
        await em.remove(nueva_condena)
        await em.flush() // esto es en caso de que no se encuentre lugar
        return res.status(409).json({ status: 409 })


    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function finalizar_condenas(req:Request, res:Response){
    try{
        const today = new Date();
        const condenas = await em.find(Condena, {fecha_fin_real: null, fecha_fin_estimada: { $lt: today }}, { populate: ['cod_recluso'] })

        if(condenas.length != 0){
            let reclusos:any = []
            let i = 0
            await em.populate(reclusos, ['celda']);
            while(i < condenas.length){
                reclusos.push(condenas[i].cod_recluso)
                condenas[i].fecha_fin_real = today
                condenas[i].cod_recluso.celda = null
                i++
            }
            console.log(reclusos)
            res.status(201).json({ status: 201, data: reclusos})
            while(i < condenas.length){
                condenas[i].cod_recluso.celda = null
                await em.flush()
                i++
            }
        } else {
            res.status(404).json({ status: 404, message: 'no se tienen que terminar condenas'})
        }
    } catch (error: any) {
        res.status(500).json({ message: error.message})
    }
}

export { get_all, add, finalizar_condenas, sanitizar_input_de_condena }









