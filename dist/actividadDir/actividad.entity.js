//import crypto from 'node:crypto'
export class Actividad {
    constructor(descripcion, diaSemana, horaMinutoComienzo, horaMinutoFin, locacion) {
        this.descripcion = descripcion;
        this.diaSemana = diaSemana;
        this.horaMinutoComienzo = horaMinutoComienzo;
        this.horaMinutoFin = horaMinutoFin;
        this.locacion = locacion;
        this.idsDeReclusos = [];
    }
}
//# sourceMappingURL=actividad.entity.js.map