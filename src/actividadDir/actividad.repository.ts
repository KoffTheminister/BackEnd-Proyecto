import { Actividad } from './actividad.entity.js'
import { Repository } from '../shared/repository.js'

const actividades = [
    new Actividad(
        'recoleccion_de_mandarinas',
        2,
        '14:30',
        '17:00',
        'campo de mandarinas',
    )
]


export class ActividadRepository implements Repository<Actividad> {

    public getAll(): Actividad[] | undefined {
        return actividades
    } 

    public getOne(descripcion: string): Actividad | undefined {
        return actividades.find((unaActividad) => unaActividad.descripcion === descripcion)
    }

    public add(item: Actividad): Actividad | undefined {
        actividades.push(item)
        return item
    }

    public update(modificacion: Actividad, desToUpdate: string): number {//Actividad | undefined {
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

    public deleteOne(descripcion: string): string | undefined {
        const index = actividades.findIndex((unaActividad) => unaActividad.descripcion === descripcion)
        if (index !== -1){
            actividades.splice(index,1)
            return 'La actividad fue eliminada correctamente.'
        }else{
            return undefined
        }
    }
}
