import { Request, Response, NextFunction } from "express"
import { Actividad } from "./actividad.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em

function sanitizarInputDeActividad(req : Request, res : Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: req.body.estado,
        /*
        cantidad_minima: req.body.cantidad_minima,
        edad_minima: req.body.edad_minima,                     estos atributos no se pueden cambiar una vez declarados
        cod_sector_cod_sector: req.body.cod_sector_cod_sector
        */
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
}

async function getAll(req:Request, res:Response){
    try{
        const actividades = await em.getConnection().execute(`select * from actividad act where act.estado = 1;`);
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad }, {populate: ['reclusos']})
        res.status(201).json({ data: laActividad} )
    } catch (error: any){
        res.status(404).json({ data: '0'})
    }
}

async function add(req: Request, res: Response){
    try{
        const cant_habilitados = await em.getConnection().execute(
            `select distinct rec.cod_recluso as rec
            from condena con
            inner join recluso rec on con.cod_recluso_cod_recluso = rec.cod_recluso
            inner join estadia est on est.cod_recluso_cod_recluso = rec.cod_recluso and est.fecha_fin is null
            where abs(DATEDIFF(rec.fecha_nac, curdate())) > (?*365) and con.fecha_fin_real is null and est.cod_celda_cod_sector_cod_sector = ? and est.fecha_fin is null;`, [req.body.edadMinima, req.body.cod_sector]);             
        if(cant_habilitados.length >= req.body.cantidadMinima){
            const si_o_no = await em.getConnection().execute(
                `select count(*) as cont 
                from actividad act 
                where act.nombre = ? and act.hora_inicio = ? = act.cod_sector_cod_sector = ?;`, [req.body.nombre, req.body.horaInicio, req.body.cod_sector]);                          
            if(si_o_no[0].cont === 0){
                const laActividad = em.create(Actividad, req.body)
                await em.flush()
                Object.keys(cant_habilitados).forEach(async (key) => {
                    const unaIns = await em.getConnection().execute(`
                        insert into actividad_reclusos (actividad_cod_actividad, recluso_cod_recluso) values (?, ?);`, [laActividad.cod_actividad, cant_habilitados[key].rec])
                    await em.flush()
                })
                res.status(201).json({ data: '1'})
            }
            if(si_o_no[0].cont === 1){
                res.status(409).json({ data: '0'})
            }
        } else {
            res.status(404).json({ data: '2'})
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
            res.status(400).json({ data: '0'})
        } else {
            const laActividad = em.getReference(Actividad, cod_actividad[0])
            em.assign(laActividad, req.body)
            await em.flush()
            res.status(201).json({data: '1'})
        }
    } catch (error: any) {
        res.status(500).json({ message : error.message })
    }
}

export { getAll, getOne, add, update, sanitizarInputDeActividad }









