const request = require('supertest');
const express = require('express');
const libroRoutes = require('../../../libro/libro.route');
const { readLibroConFiltros, createLibro, updateLibro, deleteLibro } = require('../../../libro/libro.controller');

jest.mock('../../../libro/libro.controller');
jest.mock('../../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/libro', libroRoutes);

describe('Libro Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /libro', () => {
        it('should return libros with status 200', async () => {
            const query = { nombre: 'Libro A' };
            const libros = [{ nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A' }];
            readLibroConFiltros.mockResolvedValue({
                resultados: libros,
                "Cantidad de Libros": 1
            });

            const res = await request(app).get('/libro').query(query);
            expect(res.status).toBe(200);
            expect(res.body.resultados).toEqual(libros);
            expect(res.body["Cantidad de Libros"]).toBe(1);
            expect(readLibroConFiltros).toHaveBeenCalledWith(query); //Integracion
        });

        it('should handle errors correctly', async () => {
            readLibroConFiltros.mockRejectedValue(new Error('Error'));

            const res = await request(app).get('/libro').query({ nombre: 'Libro A' });
            expect(res.status).toBe(500);
            expect(res.body.msg).toBe("");
        });
    });

    describe('POST /libro', () => {
        it('should create a libro and return status 200', async () => {
            const datos = { nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date().toISOString(), editorial: 'Editorial A' };
            createLibro.mockResolvedValue(datos);

            const res = await request(app).post('/libro').send(datos);
            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe("Éxito. 👍");
            expect(createLibro).toHaveBeenCalledWith(datos); //Integracion
        });

        it('should handle invalid data', async () => {
            const datos = { autor: 'Autor A' }; // Missing required fields
            createLibro.mockRejectedValue(new Error('{"code": 400, "msg": "Invalid data"}'));

            const res = await request(app).post('/libro').send(datos);
            expect(res.status).toBe(400);
            expect(res.body.mensaje).toBe("Fallido. ✌");
        });
    });

    describe('PATCH /libro', () => {
        it('should update a libro and return status 200', async () => {
            const datos = { _id: '123', nombre: 'Libro B' };
            const updatedLibro = { _id: '123', nombre: 'Libro B' };
            updateLibro.mockResolvedValue(updatedLibro);

            const res = await request(app).patch('/libro').send(datos);
            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe("Éxito. 👍");
            expect(updateLibro).toHaveBeenCalledWith(datos);
        });

        it('should handle invalid data', async () => {
            const datos = { _id: '123', nombre: '' }; // Invalid data
            updateLibro.mockRejectedValue(new Error('{"code": 400, "msg": "Invalid data"}'));

            const res = await request(app).patch('/libro').send(datos);
            expect(res.status).toBe(400);
            expect(res.body.mensaje).toBe("Fallido. ✌");
        });
    });

    describe('DELETE /libro/:id', () => {
        it('should delete a libro and return status 200', async () => {
            const id = '123';
            const updatedLibro = { _id: '123', isActive: false };
            deleteLibro.mockResolvedValue(updatedLibro);

            const res = await request(app).delete(`/libro/${id}`);
            expect(res.status).toBe(200);
            expect(res.body.mensaje).toBe("Éxito. 👍");
            expect(deleteLibro).toHaveBeenCalledWith(id);
        });

        it('should handle invalid id', async () => {
            const id = 'invalid_id';
            deleteLibro.mockRejectedValue(new Error('{"code": 400, "msg": "Invalid ID"}'));

            const res = await request(app).delete(`/libro/${id}`);
            expect(res.status).toBe(400);
            expect(res.body.mensaje).toBe("Fallido. ✌");
        });
    });
});