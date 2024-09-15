import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Sentencia } from "./sentencia.entity.js"

const em = orm.em
em.getRepository(Sentencia)

function sanitizarInputDeSentencia(req : Request, res : Response, next: NextFunction){
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === undefined) {
        delete req.body[key]
      }
    })
    next()
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
        const laSentencia = await em.findOne(Sentencia, { cod_sentencia })
        res.status(201).json({ data: laSentencia} )
    } catch (error: any){
        res.status(500).json({ message: 'error'})
    }
}

async function add(req: Request, res: Response){
    try{
        const laSentencia = em.create(Sentencia, req.body.inputSanitizado)
        await em.flush()
        res.status(201).json({message: 'actividad creada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function deleteOne(req: Request, res: Response) {
    try{
        const cod_sentencia : any[] = [];
        cod_sentencia[0] = Number(req.params.cod_actividad)
        const sentenciaParaBorrar = em.getReference(Sentencia, cod_sentencia[0])
        await em.removeAndFlush(sentenciaParaBorrar)
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_sentencia : any[] = [];
        cod_sentencia[0] = Number(req.params.cod_sentencia)
        const laSentenciaVerdadera = await em.findOne(Sentencia, cod_sentencia[0])
        if (laSentenciaVerdadera === null) {
            res.status(404).json({ message: 'La sentencia buscada no coincide con ninguna de las registradas'})
        }
        const sentenciaParaBorrar = em.getReference(Sentencia, cod_sentencia[0])
        em.assign(sentenciaParaBorrar, req.body)
        await em.flush()
        res.status(200).json({message: 'actividad eliminada'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

export { getAll, getSome, getOne, add, update, deleteOne, sanitizarInputDeSentencia }
