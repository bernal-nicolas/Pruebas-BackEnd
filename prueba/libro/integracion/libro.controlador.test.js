const request = require('supertest');
const express = require('express');
const libroRoute = require('../../../libro/libro.route');
const libroController = require('../../../libro/libro.controller');
const jwt = require('jsonwebtoken');
const { throwCustomError } = require('../../../utils/functions');

const app = express();
app.use(express.json());
app.use('/libro', libroRoute);

jest.mock('../../../libro/libro.controller');

// Configurar JWT_SECRET para propósitos de testing
process.env.JWT_SECRET = process.env.JWT_SECRET || 'your_test_secret_key';

const mockUser = { id: '1', username: 'testuser' };
const token = jwt.sign(mockUser, process.env.JWT_SECRET);

describe('Libro Controller Integration Tests', () => {

    describe('GET /libro', () => {
        it('should return libros with filters', async () => {
            const mockResponse = {
                resultados: [{ nombre: 'Libro 1', autor: 'Autor 1' }],
                "Cantidad de Libros": 1
            };
            libroController.readLibroConFiltros.mockResolvedValue(mockResponse);

            const response = await request(app)
                .get('/libro')
                .set('Authorization', `Bearer ${token}`)
                .query({ nombre: 'Libro 1' });

            expect(response.status).toBe(200);
            expect(response.body.resultados).toHaveLength(1);
            expect(response.body["Cantidad de Libros"]).toBe(1);
        });
    });

    describe('POST /libro', () => {
        it('should create a new libro', async () => {
            const mockLibro = { nombre: 'Libro 1', autor: 'Autor 1' };
            libroController.createLibro.mockResolvedValue(mockLibro);

            const response = await request(app)
                .post('/libro')
                .send(mockLibro);

            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe("Éxito. 👍");
        });

        it('should return error for invalid data', async () => {
            const invalidData = { autor: 'Autor 1' };
            libroController.createLibro.mockImplementation(() => throwCustomError(400, 'Nombre es requerido'));

            const response = await request(app)
                .post('/libro')
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.mensaje).toBe("Fallido. ✌");
            expect(response.body.err).toBe("Nombre es requerido");
        });
    });

    describe('PATCH /libro', () => {
        it('should update an existing libro', async () => {
            const mockLibro = { _id: '1', nombre: 'Libro 1' };
            libroController.updateLibro.mockResolvedValue(mockLibro);

            const response = await request(app)
                .patch('/libro')
                .set('Authorization', `Bearer ${token}`)
                .send(mockLibro);

            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe("Éxito. 👍");
        });

        it('should return error for invalid data', async () => {
            const invalidData = { _id: '1' }; // missing fields
            libroController.updateLibro.mockImplementation(() => throwCustomError(400, 'Datos incompletos'));

            const response = await request(app)
                .patch('/libro')
                .set('Authorization', `Bearer ${token}`)
                .send(invalidData);

            expect(response.status).toBe(400);
            expect(response.body.mensaje).toBe("Fallido. ✌");
            expect(response.body.err).toBe("Datos incompletos");
        });
    });

    describe('DELETE /libro/:id', () => {
        it('should delete an existing libro', async () => {
            const mockLibro = { _id: '1', isActive: false };
            libroController.deleteLibro.mockResolvedValue(mockLibro);

            const response = await request(app)
                .delete('/libro/1')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe("Éxito. 👍");
        });

        it('should return error for invalid id', async () => {
            libroController.deleteLibro.mockImplementation(() => throwCustomError(400, 'ID inválido'));

            const response = await request(app)
                .delete('/libro/invalid-id')
                .set('Authorization', `Bearer ${token}`);

            expect(response.status).toBe(400);
            expect(response.body.mensaje).toBe("Fallido. ✌");
            expect(response.body.err).toBe("ID inválido");
        });
    });
});