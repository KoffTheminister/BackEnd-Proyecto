import { Request, Response, NextFunction } from "express"
import { orm } from "../shared/db/orm.js"
import { Taller } from "./taller.entity.js"
import { Recluso } from "../reclusoDir/recluso.entity.js"


const em = orm.em

function sanitizarInputDeTaller(req : Request, res : Response, next: NextFunction){
    req.body.sanitizedInput = {
        nombre: req.body.nombre,
        descripcion: req.body.descripcion,
        locacion: req.body.locacion,
        dia_de_la_semana: req.body.dia_de_la_semana,
        hora_inicio: req.body.hora_inicio,
        hora_fin: req.body.hora_fin,
        estado: req.body.estado,
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
        const talleres = await em.getConnection().execute(`select * from taller tall where tall.estado = 1 group by dia_de_la_semana;`);
        res.status(201).json({ message: 'los talleres:', data: talleres})
    } catch (error: any) {
        res.status(404).json({ message: 'error'})
    }
}

async function getOne(req: Request, res: Response){
    try {
        const cod_taller =  Number.parseInt(req.params.cod_taller)
        const elTaller = await em.findOneOrFail(Taller, { cod_taller }, {populate: ['reclusos']})
        res.status(201).json({ data: elTaller, message: 'taller encontrado'} )
    } catch (error: any){
        res.status(404).json({ message: 'actividad no encontrada'})
    }
}

async function add(req: Request, res: Response){
    try{
        const si_o_no = await em.getConnection().execute(`select count(*) as cont from taller ta where ta.nombre = ?;`, [req.body.nombre]);
        console.log(si_o_no[0].cont)
        if(si_o_no[0].cont === 0){
            const elTaller = em.create(Taller, req.body)
            await em.flush()
            res.status(201).json({message: 'taller creado', data: elTaller})
        }else{
            res.status(409).json({message: 'taller ya creado'})
        }
    } catch (error: any) {
        res.status(500).json({message : error.message})
    }
}

async function update(req: Request, res: Response) {
    try{
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const elTallerVerdadero = await em.findOne(Taller, cod_taller[0])
        if (elTallerVerdadero == null) {
            res.status(400).json({ message: 'el taller buscado no coincide con ninguno de los registrados'})
        }
        const elTaller = em.getReference(Taller, cod_taller[0])
        em.assign(elTaller, req.body)
        await em.flush()
        res.status(200).json({message: 'taller modificado'})
    } catch (error: any) {
        res.status(500).json({message : 'error'})
    }
}

async function inscripcion(req: Request, res: Response) {
    try {
        const cod_taller : any[] = [];
        cod_taller[0] = Number(req.params.cod_taller)
        const elTallerVerdadero = await em.findOne(Taller, cod_taller[0])
        const cod_recluso : any[] = [];
        cod_recluso[0] = Number(req.params.cod_recluso)
        const elReclusoVerdadero = await em.findOne(Recluso, cod_recluso[0])
        if(elReclusoVerdadero !== null && elTallerVerdadero !== null){
            if(elTallerVerdadero.estado === 1){
                const inscripcion = await em.getConnection().execute(`insert into taller_reclusos(taller_cod_taller, recluso_cod_recluso) values (?, ?);`, [cod_taller[0], cod_recluso[0]]);
                res.status(200).json({ message: 'inscripcion hecha' })
            }
        }
        if(elReclusoVerdadero === null){
            res.status(404).json({ message: 'recluso no encontrado' })
        }
        if(elTallerVerdadero === null){
            res.status(404).json({ message: 'taller no encontrado' })
        }
    }catch (error: any) {
        res.status(500).json({ message: error.message })
    }
}

export { getAll, getOne, add, update, inscripcion, sanitizarInputDeTaller }
