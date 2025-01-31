import * as v from 'valibot'

const ERR_DIA_RANGE = 'El numero que representa al dia de la semana cuando ocurre la actividad debe estar entre 1 y 7'
const [NAME_LEN_MIN, NAME_LEN_MAX] = [8, 100]
const [DES_LEN_MIN, DES_LEN_MAX] = [0, 200]
const [LOC_LEN_MIN, LOC_LEN_MAX] = [10, 100]
const [HORA_MIN, HORA_MAX] = [0, 24]
const ERR_NAME_LEN = `El nombre del taller debe tener entre ${NAME_LEN_MIN} y ${NAME_LEN_MAX} caracteres.`
const ERR_DES_LEN = `La descripcion del taller debe tener entre ${DES_LEN_MIN} y ${DES_LEN_MAX} caracteres.`
const ERR_LOC_LEN = `La locacion del taller debe tener entre ${LOC_LEN_MIN} y ${LOC_LEN_MAX} caracteres.`
const ERR_HORA = `La hora debe de estar entre ${HORA_MIN} y ${HORA_MAX}`

const nombre = v.pipe(
    v.string(),
    v.minLength(NAME_LEN_MIN, ERR_NAME_LEN),
    v.maxLength(NAME_LEN_MAX, ERR_NAME_LEN)
)

const descripcion = v.pipe(
    v.string(),
    v.minLength(DES_LEN_MIN, ERR_DES_LEN),
    v.maxLength(DES_LEN_MAX, ERR_DES_LEN)
)

const locacion = v.pipe(
    v.string(),
    v.minLength(LOC_LEN_MIN, ERR_LOC_LEN),
    v.maxLength(LOC_LEN_MAX, ERR_LOC_LEN)
)

const dia_de_la_semana = v.pipe(
    v.number(),
    v.minValue(1, ERR_DIA_RANGE),
    v.maxValue(7, ERR_DIA_RANGE),
)

const hora_inicio = v.pipe(
    v.number(),
    v.minValue(HORA_MIN, ERR_HORA),
    v.maxValue(HORA_MAX, ERR_HORA),
)

const hora_fin = v.pipe(
    v.number(),
    v.minValue(HORA_MIN, ERR_HORA),
    v.maxValue(HORA_MAX, ERR_HORA),
)

const actividad_ilegal_schema = v.object({
    nombre: nombre,
    descripcion: descripcion,
    locacion: locacion,
    dia_de_la_semana: dia_de_la_semana,
    hora_inicio: hora_inicio,
    hora_fin: hora_fin,
    estado: v.boolean()
})

const actividad_ilegal_schema_for_update = v.object({
    nombre: v.optional(nombre),
    descripcion: v.optional(descripcion),
    locacion: v.optional(locacion),
    estado: v.optional(v.boolean())
})


export const validar_nuevo_taller = v.safeParserAsync(actividad_ilegal_schema)
export const validar_update_taller = v.safeParserAsync(actividad_ilegal_schema_for_update)

