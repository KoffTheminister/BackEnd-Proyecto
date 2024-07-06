import { Guardia } from "./guardia.entity.js";
const guardias = [
    new Guardia('Brian', 'Griffin')
];
export class GuardiaRepository {
    getAll() {
        return guardias;
    }
    getOne(legajoBuscado) {
        return guardias.find((unGuardia) => unGuardia.legajo === legajoBuscado);
    }
    add(item) {
        guardias.push(item);
        return item;
    }
    update(modificacion, legToUpdate) {
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
    deleteOne(legajo) {
        const index = guardias.findIndex((unGuardia) => unGuardia.legajo === legajo);
        if (index !== -1) {
            guardias.splice(index, 1);
            return 'El guardia fue eliminado correctamente.';
        }
        else {
            return undefined;
        }
    }
}
//# sourceMappingURL=guardia.repository.js.map