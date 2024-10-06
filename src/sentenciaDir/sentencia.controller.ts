import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sentencia } from "./sentencia.entity.js"

const em = orm.em
em.getRepository(Sentencia)

function sanitizarInputDeSentencia(req : Request, res : Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion, 
        duracion_anios: req.body.duracion_anios,
        duracion_meses: req.body.duracion_meses,
        duracion_dias: req.body.duracion_dias,
        orden_de_gravedad: req.body.orden_de_gravedad
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            delete req.body.sanitizedInput[key]
        }
    })
    next()
}

async function getAll(req : Request, res : Response){
    try{
        const sentencias = await em.getConnection().execute(`select * from sentencia s order by orden_de_gravedad desc;`);
        res.status(201).json({ data: sentencias})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}
 
async function getSome(req : Request, res : Response){
    try{
        const sentencias = await em.find(Sentencia, { nombre: '%req.params.nombreParcial%'})
        res.status(201).json({ data: sentencias })
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_sentencia =  Number.parseInt(req.params.cod_sentencia) //
        const laSentencia = await em.findOne(Sentencia, { cod_sentencia })
        res.status(201).json({ data: laSentencia} )
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const sentencia_con_mismo_orden_gravedad = await em.getConnection().execute(`select count(*) as cont from sentencia s where s.orden_de_gravedad = ? or s.nombre = ?;`, [req.body.sanitizedInput.orden_de_gravedad, req.body.sanitizedInput.nombre]);
        console.log('antes del if')
        if(sentencia_con_mismo_orden_gravedad[0].cont === 0){
            const laSentencia = em.create(Sentencia, req.body.sanitizedInput)
            await em.flush()
            res.status(201).json({message: 'sentencia creada'})
        } else {
            res.status(409).json({message: 'orden de gravedad concuerda con uno ya en existencia.'})
        }
    } catch (error: any) {
        res.status(500).json({message : error}) 
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_sentencia : any[] = [];
        cod_sentencia[0] = Number(req.params.cod_sentencia)
        const laSentencia = await em.findOne(Sentencia, { cod_sentencia })
        if(laSentencia !== null){
            const condenas_con_sentencias = await em.getConnection().execute(`select count(c_s.condena_cod_recluso_cod_recluso) as cont
                                                                                from sentencia s
                                                                                inner join condena_sentencias c_s on c_s.sentencia_cod_sentencia = ? and s.cod_sentencia = ?
                                                                                inner join condena c on c_s.condena_fecha_ini = c.fecha_ini and c_s.condena_cod_recluso_cod_recluso = c.cod_recluso_cod_recluso
                                                                                where c.fecha_fin_real is null;`, [cod_sentencia[0]]);
            if(condenas_con_sentencias[0].cont > 0){
                const sentenciaParaBorrar = em.getReference(Sentencia, cod_sentencia[0])
                await em.removeAndFlush(sentenciaParaBorrar)
                res.status(200).json({message: 'sentencia eliminada'})
            } else {
                res.status(409).json({message : 'condenas activas con esa sentencia'})
            }
        } else {
            res.status(404).json({message: 'sentencia no encontrada'})
        }
    } catch (error: any) {
        res.status(500).json({message : error})
    }
}

export { getAll, getSome, getOne, add, deleteOne, sanitizarInputDeSentencia }
