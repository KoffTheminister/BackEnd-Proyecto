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
        edad_minima: req.body.edad_minima,
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

async function getSome(req:Request, res:Response){
    try{
        const actividades = await em.find(Actividad, { nombre: '%req.params.nombreParcial%' })
        res.status(201).json({ message: 'las actividades:', data: actividades})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_actividad =  Number.parseInt(req.params.cod_actividad)
        const laActividad = await em.findOneOrFail(Actividad, { cod_actividad }, {populate: ['reclusos']})
        res.status(201).json({ data: laActividad, message: 'actividad encontrada.'} )
    } catch (error: any){
        res.status(404).json({ message: 'no se encontro la actividad buscada'})
    }
}

async function add(req: Request, res: Response){
    try{
        const cant_habilitados = await em.getConnection().execute(`select rec.cod_recluso as rec
                                                            from condena con
                                                            inner join recluso rec on con.cod_recluso_cod_recluso = rec.cod_recluso
                                                            inner join estadia est on est.cod_recluso_cod_recluso = rec.cod_recluso and est.fecha_fin is null
                                                            where abs(DATEDIFF(rec.fecha_nac, curdate())) > (?*365) and con.fecha_fin_real is null and est.cod_celda_cod_sector_cod_sector = ? and est.fecha_fin is null;`, [req.body.edadMinima, req.body.cod_sector]);
        if(cant_habilitados.length > req.body.cantidadMinima){
            const si_o_no = await em.getConnection().execute(`select count(*) as cont from actividad act where act.nombre = ?;`, [req.body.nombre]);
            let losGuardias = await em.getConnection().execute(`select gua.cod_guardia as cod
                                                                from guardia gua
                                                                left join guardia_actividad g_a on g_a.cod_guardia_cod_guardia = gua.cod_guardia
                                                                left join actividad a on a.cod_actividad = g_a.cod_actividad_cod_actividad
                                                                where a.estado = 1 and g_a.fecha_fin_real is null and ((a.hora_fin > ? or a.hora_inicio < ?) and a.dia_de_la_semana != ?);`, [req.body.horaInicio, req.body.horaFin, req.body.diaDeLaSemana]);
            if(si_o_no[0].cont === 0 && losGuardias.length !== 0){
                const laActividad = em.create(Actividad, req.body)
                await em.flush()
                const today = new Date();
                const day = today.getDate();
                const month = today.getMonth() + 1;
                let year = today.getFullYear();
                let finalDate = `${year}-${month}-${day}`
                const elGuardia = await em.getConnection().execute(`insert into guardia_actividad (cod_guardia_cod_guardia, cod_actividad_cod_actividad, fecha_ini, fecha_fin_real)
                                                                    values (?, ?, ?, null);`, [losGuardias[0].cod, laActividad.cod_actividad, finalDate])
                Object.keys(cant_habilitados).forEach(async (key) => {
                    const unaIns = await em.getConnection().execute(`insert into actividad_reclusos (actividad_cod_actividad, recluso_cod_recluso) values (?, ?);`, [laActividad.cod_actividad, cant_habilitados[key].rec])
                    await em.flush()
                })
                res.status(201).json({message: 'actividad creada', data: laActividad})
            }
            if(si_o_no[0].cont === 0){
                res.status(409).json({message: 'actividad ya creada'})
            }
            if(losGuardias.length === 0){
                res.status(409).json({message: 'no existen guardias que puedan encargarse de la actividad debido a estar ocupados en otras cuestiones'})
            }
        } else {
            res.status(404).json({message: 'no existen suficientes reclusos que cumplan las condiciones establecidas'})
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
        if (laActividadVerdadera == null) {
            res.status(400).json({ message: 'La actividad buscada no coincide con ninguna de las registradas'})
        }
        const laActividad = em.getReference(Actividad, cod_actividad[0])
        em.assign(laActividad, req.body)
        await em.flush()
        res.status(200).json({message: 'actividad modificada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

export { getAll, getOne, add, update, getSome, sanitizarInputDeActividad }
