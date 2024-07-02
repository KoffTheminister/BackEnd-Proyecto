import { Repository } from "../shared/repository.js";
import { Guardia } from "./guardia.entity.js";

const guardias = [
    new Guardia(
        'Brian',
        'Griffin',
    )
]

export class GuardiaRepository implements Repository<Guardia>{

    public getAll(): Guardia[] | undefined {
        return guardias
    } 

    public getOne(legajoBuscado: string): Guardia | undefined {
        return guardias.find((unGuardia) => unGuardia.legajo === legajoBuscado)
    }

    public add(item: Guardia): Guardia | undefined {
        guardias.push(item)
        return item
    }

    public update(modificacion: Guardia, legToUpdate: string): number {//Actividad | undefined {
        return 1
        /*
        let index = actividades.findIndex((actividad) => actividad.descripcion === desToUpdate)
        if (index !== -1){

            for (let atributo in modificacion){
                if (modificacion[atributo] === undefined)
            }
            actividades[index] = {...actividades[index], ...modifications}
            return actividades[index]
        } else {
            return undefined
        }
            */
    }

    public deleteOne(legajo: string): string | undefined {
        const index = guardias.findIndex((unGuardia) => unGuardia.legajo === legajo)
        if (index !== -1){
            guardias.splice(index,1)
            return 'El guardia fue eliminado correctamente.'
        }else{
            return undefined
        }
    }
}