import * as v from 'valibot'

const ERR_DIA_RANGE = 'El numero que representa al dia de la semana cuando ocurre la actividad debe estar entre 1 y 7'
const [NAME_LEN_MIN, NAME_LEN_MAX] = [8, 40]
const [DES_LEN_MIN, DES_LEN_MAX] = [0, 100]
const [LOC_LEN_MIN, LOC_LEN_MAX] = [10, 70]
const [EDAD_MIN, EDAD_MAX] = [16, 80]
const [HORA_MIN, HORA_MAX] = [0, 24]
const ERR_NAME_LEN = `El nombre de la actividad debe tener entre ${NAME_LEN_MIN} y ${NAME_LEN_MAX} caracteres.`
const ERR_DES_LEN = `La descripcion de la actividad debe tener entre ${DES_LEN_MIN} y ${DES_LEN_MAX} caracteres.`
const ERR_LOC_LEN = `La locacion de la actividad debe tener entre ${LOC_LEN_MIN} y ${LOC_LEN_MAX} caracteres.`
const ERR_EDAD_LEN = `La edad minima debe estar entre ${EDAD_MIN} y ${EDAD_MAX}`
const ERR_HORA = `La hora debe de estar entre ${HORA_MIN} y ${HORA_MAX}`
const ERR_CANT = `La cantidad minima minima debe ser dos`

const nombre = v.pipe(
    v.string(),
    v.minLength(NAME_LEN_MIN, ERR_NAME_LEN),
    v.maxLength(NAME_LEN_MAX, ERR_NAME_LEN)
)

const descripcion = v.pipe(
    v.string("la descripcion debe de ser un string"),
    v.minLength(DES_LEN_MIN, ERR_DES_LEN),
    v.maxLength(DES_LEN_MAX, ERR_DES_LEN)
)

const locacion = v.pipe(
    v.string("la locacion debe de ser un string"),
    v.minLength(LOC_LEN_MIN, ERR_LOC_LEN),
    v.maxLength(LOC_LEN_MAX, ERR_LOC_LEN)
)

const dia_de_la_semana = v.pipe(
    v.number("el dia de la semana debe de ser representado con un numero"),
    v.minValue(1, ERR_DIA_RANGE),
    v.maxValue(7, ERR_DIA_RANGE),
)

const hora_inicio = v.pipe(
    v.number("la hora de inicio debe de ser un numero"),
    v.integer("la hora de inicio debe de ser un entero"),
    v.minValue(HORA_MIN, ERR_HORA),
    v.maxValue(HORA_MAX, ERR_HORA),
)

const hora_fin = v.pipe(
    v.number("la hora de fin debe de ser un numero"),
    v.integer("la hora de fin debe de ser un entero"),
    v.minValue(HORA_MIN, ERR_HORA),
    v.maxValue(HORA_MAX, ERR_HORA),
)


const edad_minima = v.pipe(
    v.number("la edad minima debe de ser un numero"),
    v.integer("la edad minima debe de ser un entero"),
    v.minValue(EDAD_MIN, ERR_EDAD_LEN),
    v.maxValue(EDAD_MAX, ERR_EDAD_LEN),
)

const cantidad_minima = v.pipe(
    v.number("la cantidad minima debe de ser un numero"),
    v.integer("la cantidad minima debe de ser un entero"),
    v.minValue(2, ERR_CANT)
)

const cod_sector = v.pipe(
    v.number("el codigo de sector especificado debe de ser un numero"),
    v.integer("el codigo de sector especificado debe de ser un entero")
)


const actividad_schema = v.object({
    nombre: nombre,
    descripcion: descripcion,
    locacion: locacion,
    estado: v.boolean("el estado de la actividad debe de ser un booleano"),
    dia_de_la_semana: dia_de_la_semana,
    hora_inicio: hora_inicio,
    hora_fin: hora_fin,
    edad_minima: edad_minima,
    cantidad_minima: cantidad_minima,
    cod_sector: cod_sector
})

const actividad_schema_for_update = v.object({
    nombre: nombre,
    descripcion: descripcion,
    locacion: locacion,
    estado: v.boolean("el estado de la actividad debe de ser un booleano")
})

export const validar_nueva_actividad = v.safeParserAsync(actividad_schema)
export const validar_update_actividad = v.safeParserAsync(actividad_schema_for_update)

