import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sentencia } from "./sentencia.entity.js"

const em = orm.em
em.getRepository(Sentencia)

function sanitizar_input_de_sentencia(req : Request, res : Response, next: NextFunction){
    req.body.sanitized_input = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion, 
        duracion_anios: req.body.duracion_anios,
        duracion_meses: req.body.duracion_meses,
        orden_de_gravedad: req.body.orden_de_gravedad
    }
    Object.keys(req.body.sanitizedInput).forEach((key) => {
        if (req.body.sanitizedInput[key] === undefined) {
            return res.status(400).json({message: 'faltan atributos'})
        }
    })
    
    next()
}

async function get_all(req : Request, res : Response){
    try{
        const sentencias = await em.find(Sentencia, {})
        //const sentencias = await em.getConnection().execute(`select * from sentencia s order by orden_de_gravedad desc;`);
        res.status(201).json({ data: sentencias})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function get_one(req: Request, res: Response){
    try {
        const cod_sentencia =  Number.parseInt(req.params.cod_sentencia) //
        const la_sentencia = get_sentencia(cod_sentencia)
        //const la_sentencia = await em.findOne(Sentencia, { cod_sentencia: cod_sentencia })
        if(la_sentencia == null){
            res.status(201).json({ data: la_sentencia} ) 
        } else{
            res.status(404).json({ message: 'no encontrada'} )
        }
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const sentencia_con_mismo_orden_gravedad_y_nombre = await em.findOne(Sentencia, { $or: [{orden_de_gravedad: req.body.sanitizedInput.orden_de_gravedad}, {nombre: req.body.sanitizedInput.nombre}]})
        /*
        const sentencia_con_mismo_orden_gravedad = await em.getConnection().execute(`select count(*) as cont 
            from sentencia s 
            where s.orden_de_gravedad = ? or s.nombre = ?;`, [req.body.sanitizedInput.orden_de_gravedad, req.body.sanitizedInput.nombre]);
        */
        if(sentencia_con_mismo_orden_gravedad_y_nombre != null){
            const laSentencia = em.create(Sentencia, req.body.sanitizedInput)
            await em.flush()
            res.status(201).json({message: 'sentencia creada'})
        } else {
            res.status(409).json({message: 'orden de gravedad o nombre concuerda con uno ya en existencia.'})
        }
    } catch (error: any) {
        res.status(500).json({message : error}) 
    }
}

async function get_sentencia(cod_sentencia: number){
    return await em.findOne(Sentencia, { cod_sentencia: cod_sentencia })
}

async function get_sentencias_especificas(cod_sentencias: number[]){
    return await em.find(Sentencia, { cod_sentencia: {$in: cod_sentencias} })
}

export { get_all, get_one, add, get_sentencia, get_sentencias_especificas, sanitizar_input_de_sentencia }

