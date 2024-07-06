import { Repository } from "../shared/repository.js";
import { Guardia } from "./guardia.entity.js";
import { db } from "../shared/db/conn.js";

const guardias = db.collection<Guardia>('guardias')

export class GuardiaRepository implements Repository<Guardia>{

    public async getAll(): Promise <Guardia[] | undefined> {
        return await guardias.find().toArray()
    } 

    public async getOne(legajoBuscado: string): Promise <Guardia | undefined> {
        return (await guardias.findOne({_id: legajoBuscado })) || undefined
    }

    public async add(item: Guardia): Promise <Guardia | undefined> {
        await guardias.insertOne(item)
        return await item
    }

    public async update(modificacion: Guardia, idToUpdate: string): Promise <Guardia | undefined> {
        const guardiaToModificar = await guardias.findOne({_id: idToUpdate })
        if (guardiaToModificar !== null){
            guardias.updateOne({_id:idToUpdate}, { $set: modificacion})
            return (await guardias.findOne({_id: idToUpdate })) || undefined
        } else {
            return undefined
        }
    }

    public async deleteOne(idToDelete: string): Promise < string > {
        const rtaDelete = await guardias.deleteOne({_id: idToDelete })
        if(rtaDelete.acknowledged === true){
            return 'El guardia elegido fue eliminado correctamente.'
        } else {
            return 'El guardia elegido no existe, por ende no fue borrado.'
        }
    }   
}
