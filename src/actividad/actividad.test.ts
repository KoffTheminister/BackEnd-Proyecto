import request from "supertest";

const url_base = "http://localhost:8080"

describe("crud de actividad", () => {

    let token: string
    let normal_token: string

    beforeAll(async () => {
        const res = await request(url_base).post("/administradores/logIn").send({ cod_administrador: 6, contrasenia: "123r"})
        token = res.body.token
    });

    it("should reject request without token", async () => {
        const res = await request(url_base).get("/actividades");
        expect(res.status).toBe(401)
    });

    it("should return a list of activities", async () => {
        const response = await request(url_base).get("/actividades").set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data[0]).toHaveProperty("nombre")
        expect(response.body.data.length).toBeGreaterThan(0)
    })

    it("should return only one activity", async () => {
        const response = await request(url_base).get("/actividades/1").set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
        expect(!(Array.isArray(response.body.data))).toBe(true)
        expect(response.body.data).toHaveProperty("nombre")
    })
    /*
    it("should create an activity", async () => {
        const new_activity = {
            nombre: "limpiar pisos",
            descripcion: "los reclusos deberan limpiar los pisos de el sector 4", 
            locacion: "todo sector 4", 
            dia_de_la_semana: 2, 
            hora_inicio: 10, 
            hora_fin: 12,
            estado: true,
            cantidad_minima: 10,
            edad_minima: 20, 
            cod_sector: 4
        }

        const response = await request(url_base).post("/actividades").send(new_activity).set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data.length).toBeGreaterThan(new_activity.cantidad_minima)
        expect(response.body.data[0]).toHaveProperty("dni")
    })
    */
    it("should not create an activity, due to nombre having a null value", async () => {
        const new_activity = {
            nombre: null,
            descripcion: "los reclusos deberan limpiar los pisos de el sector 4", 
            locacion: "todo sector 4", 
            dia_de_la_semana: 2, 
            hora_inicio: 10, 
            hora_fin: 12,
            estado: true,
            cantidad_minima: 10,
            edad_minima: 20, 
            cod_sector: 4
        }

        const response = await request(url_base).post("/actividades").send(new_activity).set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(400)
    })

    it("should not create an activity, due to cantidad_minima having a value below 2", async () => {
        const new_activity = {
            nombre: "limpiar pisos",
            descripcion: "los reclusos deberan limpiar los pisos de el sector 4", 
            locacion: "todo sector 4", 
            dia_de_la_semana: 2, 
            hora_inicio: 10, 
            hora_fin: 12,
            estado: true,
            cantidad_minima: 1,
            edad_minima: 20, 
            cod_sector: 4
        }

        const response = await request(url_base).post("/actividades").send(new_activity).set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(400)
    })

    it("should update an activity", async () => {
        const fields_to_update = {
            nombre: "limpiar pisos",
            descripcion: "los reclusos deberan limpiar los pisos de el sector 4", 
            locacion: "todo sector 4",
            estado: true
        }

        const response = await request(url_base).put(`/actividades/1`).send(fields_to_update).set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
    })

    it("shouldn't update an activity due to nombre crossing the lenght threshold", async () => {
        const fields_to_update = {
            nombre: "limpiar pisosasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasdasd",
            descripcion: "los reclusos deberan limpiar los pisos de el sector 4", 
            locacion: "todo sector 4",
            estado: true
        }

        const response = await request(url_base).put(`/actividades/1`).send(fields_to_update).set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
    })

})


