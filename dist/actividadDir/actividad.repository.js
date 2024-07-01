import { Actividad } from './actividad.entity.js';
const actividades = [
    new Actividad('recoleccion_de_mandarinas', 2, '14:30', '17:00', 'campo de mandarinas')
];
export class ActividadRepository {
    getAll() {
        return actividades;
    }
    getOne(descripcion) {
        return actividades.find((unaActividad) => unaActividad.descripcion === descripcion);
    }
    add(item) {
        actividades.push(item);
        return item;
    }
    update(modificacion, desToUpdate) {
        return 1;
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
    deleteOne(descripcion) {
        const index = actividades.findIndex((unaActividad) => unaActividad.descripcion === descripcion);
        if (index !== -1) {
            actividades.splice(index, 1);
            return 'La actividad fue eliminada correctamente.';
        }
        else {
            return undefined;
        }
    }
}
//# sourceMappingURL=actividad.repository.js.map