import { Request, Response, NextFunction } from "express"
import { Sentencia } from "./sentencia.entity.js"
import { orm } from "../shared/db/orm.js"

const em = orm.em
em.getRepository(Sentencia)

function sanitizarInputDeSentencia(req : Request, res : Response){
    req.body.inputSanitizado = {
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      duracion_anios: req.body.duracion_anios,
      duracion_meses: req.body.duracion_meses,
      duracion_dias: req.body.duracion_dias,
    }

    Object.keys(req.body.inputSanitizado).forEach((key) => {
      if (req.body.inputSanitizado[key] === undefined) {
        delete req.body.inputSanitizado[key]
      }
    })
    
}

async function getAll(req : Request, res : Response){
    try{
        const sentencias = await em.find(Sentencia, {})
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
        const cod_sentencia =  Number.parseInt(req.params.cod_actividad) //
        const laSentencia = await em.findOneOrFail(Sentencia, { cod_sentencia })
        res.status(201).json({ data: laSentencia} )
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const laSentencia = em.create(Sentencia, req.body.inputSanitizado)
        await em.flush()  //ejecuta todas las operaciones previamente establecidas (modificaciones, creaciones, etc)
        res.status(201).json({message: 'actividad creada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_sentencia = Number.parseInt(req.params.cod_actividad)
        const laSentencia = await em.findOne(Sentencia, { cod_sentencia })
        const sentenciaParaBorrar = em.getReference(Sentencia, cod_sentencia) // genera un registro del tipo Actividad pero solo con el id
        await em.removeAndFlush(sentenciaParaBorrar)
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_sentencia = Number.parseInt(req.params.cod_sentencia)
        const laSentencia = await em.findOne(Sentencia, { cod_sentencia })
        if (laSentencia === null) {
            res.status(404).json({ message: 'La actividad buscada no coincide con ninguna de las registradas'})
        }
        sanitizarInputDeSentencia(req, res)
        em.assign(laSentencia, req.body.sanitizarInputDeSentencia)
        await em.flush()
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

export { getAll, getSome, getOne, add, update, deleteOne }
