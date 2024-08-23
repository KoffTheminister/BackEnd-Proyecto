import { Repository } from "../shared/repository.js";
import { Actividad } from './actividad.entity.js'
import { db } from "../shared/db/conn.js";

const actividades = db.collection<Actividad>('actividades')

export class ActividadRepository implements Repository<Actividad>{

    public async getAll(): Promise <Actividad[] | undefined> {
        return await actividades.find().toArray()
    } 

    public async getOne(idActBuscado: string): Promise <Actividad | undefined> {
        return (await actividades.findOne({_id: idActBuscado })) || undefined
    }

    public async add(item: Actividad): Promise <Actividad | undefined> {
        await actividades.insertOne(item)
        return await item
    }

    public async update(modificacion: Actividad, idToUpdate: string): Promise <Actividad | undefined> {
        const actividadToModificar = await actividades.findOne({_id: idToUpdate })
        if (actividadToModificar !== null){
            actividades.updateOne({_id:idToUpdate}, { $set: modificacion})
            return (await actividades.findOne({_id: idToUpdate })) || undefined
        } else {
            return undefined
        }
    }

    public async deleteOne(idToDelete: string): Promise < string > {
        const rtaDelete = await actividades.deleteOne({_id: idToDelete })
        if(rtaDelete.acknowledged === true){
            return 'La actividad elegida fue eliminada correctamente.'
        } else {
            return 'La actividad elegida no existe, por ende no fue borrada.'
        }
    }   
}


