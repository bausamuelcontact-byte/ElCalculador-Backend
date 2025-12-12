const request = require('supertest');
const app = require('./app');

it('GET/recipes/:userId', async () => {
    const res = await request(app).get('/recipes/6936e4807da7893fdf4791e9');
    expect(res.statusCode).toEqual(200);
    expect(res.body.recipe).toEqual([
     {
      _id: "6939727e59d0e032e690f4e7",
          name: "Sandwich tomate",
          price: 6,
          TVA: 1,
          allergens: [],
          ingredients: [
               {
                   ingredient: "693944ad6c122b40745f6e53",
                   quantity: 100,
                   unit: "gr",
                   _id: "69394f1bdbc8abb2bea0fd08"
               },
               {
                   ingredient: "6939453a6c122b40745f6e56",
                   quantity: 1,
                   unit: "unité",
                   _id: "69394f1bdbc8abb2bea0fd09"
               }
          ],
          user: "6936e4807da7893fdf4791e9",
          __v: 0
     }
]);
})