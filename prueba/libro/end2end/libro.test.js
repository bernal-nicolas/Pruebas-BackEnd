const request = require('supertest');
const express = require('express');
const libroRoutes = require('../../../libro/libro.route');
const {
    createLibroMongo, getLibroMongo,
    updateLibroMongo, deleteLibroMongo
  } = require('../../../libro/libro.actions');

  jest.mock('../../../libro/libro.actions', () => ({
    createLibroMongo: jest.fn(),
    getLibroMongo: jest.fn(),
    updateLibroMongo: jest.fn(),
    deleteLibroMongo: jest.fn()
}));

jest.mock('../../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/libro', libroRoutes);

describe('Libro Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

  it('GET Should call getLibroMongo method in actions END2END', async() => {
    const query = { nombre: 'Libro A' };
    const libros = [{ nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A' }];

    const res = await request(app).get('/libro').query(query)
    expect(res.status).toBe(200);
    expect(getLibroMongo).toHaveBeenCalled(); // END2END
  })

  it('POST should call createLibroMongo method in actions', async() => {
    const datos = { nombre: 'Libro A' };
    const libros = [{ nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A' }];

    const res = await request(app).post('/libro').send(datos)
    expect(res.status).toBe(200);
    expect(createLibroMongo).toHaveBeenCalled(); // END2END
  })

  it('PATCH should call updateLibroMongo method in actions', async() => {
    const datos = { _id: 1, nombre: 'Libro B' };
    const updatedLibro = [{ nombre: 'Libro B', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A' }];
    updateLibroMongo.mockResolvedValue(updatedLibro);

    const response = await request(app).patch('/libro').send(datos)
    expect(response.status).toBe(200)
    expect(updateLibroMongo).toHaveBeenCalled() // END2END
  })

  it('DELETE should call deleteLibroMongo method in actions', async() => {
    const id = '1';
    const updatedLibro = [{ _id: '1', nombre: 'Libro B', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A', isActive: false }];
    deleteLibroMongo.mockResolvedValue(updatedLibro);

    const response = await request(app).delete(`/libro/${id}`);
    expect(response.status).toBe(200);
    expect(deleteLibroMongo).toHaveBeenCalled() // END2END
  })
    
})