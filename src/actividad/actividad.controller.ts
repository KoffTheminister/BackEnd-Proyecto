import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"
import { Recluso } from "../recluso/recluso.entity.js"
import { get_sector } from "../sector/sector.controller.js"

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
        //cod_sector: req.body.cod_sector
    }

    Object.keys(req.body.sanitized_input).forEach((key) => {
      if (req.body[key] === undefined) {
        return res.status(409).json({ message: 'falta un atributo'})
      }
    })

    req.body.sanitized_input.cod_sector = await get_sector(req.body.cod_sector)
    if(req.body.sanitized_input.cod_sector == null){
        return res.status(404).json({ message: 'sector invalido'})
    }
    next()
}

async function get_all(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, { estado: true })
        //const actividades = await em.getConnection().execute(`select * from actividad act where act.estado = 1;`);
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad: cod_actividad , estado: true}) 
        res.status(201).json({ status: 201, data: laActividad} )
    } catch (error: any){
        res.status(404).json({ status: 404})
    }
}

async function add(req: Request, res: Response){
    try{
        const actividad = await em.findOne(Actividad, { estado: true , cod_sector: req.body.sanitized_input.cod_sector, dia_de_la_semana: req.body.sanitized_input.dia_de_la_semana, })
        const reclusos_validos = req.body.sanitized_input.cod_sector.conseguir_reclusos_con_edad(req.body.sanitized_input.edad_minima)
        /*
        const cant_habilitados = await em.getConnection().execute(
            `select distinct rec.cod_recluso as rec
            from condena con
            inner join recluso rec on con.cod_recluso_cod_recluso = rec.cod_recluso
            inner join estadia est on est.cod_recluso_cod_recluso = rec.cod_recluso and est.fecha_fin is null
            where abs(DATEDIFF(rec.fecha_nac, curdate())) > (?*365) and con.fecha_fin_real is null and est.cod_celda_cod_sector_cod_sector = ? and est.fecha_fin is null;`, [req.body.edadMinima, req.body.cod_sector]);
        */             
        if(reclusos_validos.length >= req.body.sanitized_input.cantidad_minima && actividad == null){     
            req.body.sanitized_input.reclusos = reclusos_validos                 
            const la_actividad = await em.create(Actividad, req.body.sanitized_input)
            await em.flush()
            /*
            Object.keys(cant_habilitados).forEach(async (key) => {
                
                const unaIns = await em.getConnection().execute(`
                    insert into actividad_reclusos (actividad_cod_actividad, recluso_cod_recluso) values (?, ?);`, [laActividad.cod_actividad, cant_habilitados[key].rec])
                
                await em.flush()
            })
            */
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
        const laActividadVerdadera = await em.findOne(Actividad, cod_actividad[0])
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



