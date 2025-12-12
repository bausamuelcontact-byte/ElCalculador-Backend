const request = require("supertest");
const app = require("../backend/app");

it("POST /ingredients", async () => {
  const res = await request(app).post("/ingredients").send({
    name: "Kaki",
    quantity: 12,
    unit: "Kg",
    price: 7.89,
    user: "6937f28fb4d4f0be72695c79",
    tva: 5,
  });

  expect(res.statusCode).toBe(200);
  expect(res.body.result).toBe(true);
});
