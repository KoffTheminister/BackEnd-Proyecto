import request from "supertest";

const url_base = "http://localhost:8080"

describe("crud de administrador", () => {

    let token: string;

    beforeAll(async () => {
        const res = await request(url_base).post("/administradores/logIn").send({ cod_administrador: 1, contrasenia: "123r"})
        token = res.body.token
    });

    /*
    it("should reject request without token", async () => {
      const res = await request(app).get("/protected-route");
      expect(res.status).toBe(401); // Unauthorized
    });
    */

    it("should return a list of admins", async () => {
        const response = await request(url_base).get("/administradores").set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
        expect(Array.isArray(response.body.data)).toBe(true)
        expect(response.body.data[0]).toHaveProperty("nombre")
        expect(response.body.data.length).toBeGreaterThan(0)
    })

    it("should return only one admin", async () => {
        const response = await request(url_base).get("/administradores/1").set("Authorization", `Bearer ${token}`)
        expect(response.status).toBe(201)
        expect(!(Array.isArray(response.body.data))).toBe(true)
        expect(response.body.data).toHaveProperty("nombre")
    })
})


