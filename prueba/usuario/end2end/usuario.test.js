const request = require('supertest');
const express = require('express');
const bodyParser = require('body-parser');
const usuarioRoutes = require('../../../usuario/usuario.route');
const { createUsuarioMongo, getUsuarioMongo, updateUsuarioMongo, deleteUsuarioMongo } = require('../../../usuario/usuario.actions');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Cargar variables de entorno

// Mock de las acciones del modelo
jest.mock('../../../usuario/usuario.actions');

// Crear una aplicación Express para pruebas
const app = express();
app.use(bodyParser.json());
app.use('/usuario', usuarioRoutes);

// Generar un token JWT válido
const generateValidToken = () => {
    const payload = { username: 'testuser' };
    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Configuración de los tests
describe('Pruebas End-to-End de Usuario', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('GET /usuario - éxito', async () => {
        const mockUsuarios = [{ username: 'user1', password: 'pass1', isActive: true }];
        getUsuarioMongo.mockResolvedValue(mockUsuarios);

        const token = generateValidToken();

        const response = await request(app)
            .get('/usuario')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(Object.values(response.body)).toEqual(mockUsuarios);
    });

    test('POST /usuario - éxito', async () => {
        const newUsuario = { username: 'newuser', password: 'newpass' };
        createUsuarioMongo.mockResolvedValue(newUsuario);

        const response = await request(app)
            .post('/usuario')
            .send(newUsuario);

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Éxito. 👍');
    });

    test('POST /usuario - datos inválidos', async () => {
        const invalidUsuario = { username: '' };
        createUsuarioMongo.mockImplementation(() => {
            throw new Error(JSON.stringify({ code: 400, msg: 'Datos inválidos' }));
        });

        const response = await request(app)
            .post('/usuario')
            .send(invalidUsuario);

        expect(response.status).toBe(400);
        expect(response.body.err).toBe('Datos inválidos');
    });

    test('PATCH /usuario - éxito', async () => {
        const updatedUsuario = { _id: '123', username: 'updateduser', password: 'updatedpass' };
        updateUsuarioMongo.mockResolvedValue(updatedUsuario);

        const token = generateValidToken();

        const response = await request(app)
            .patch('/usuario')
            .send(updatedUsuario)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Éxito. 👍');
    });

    test('PATCH /usuario - datos inválidos', async () => {
        const invalidUpdate = { _id: '123', username: '' };
        updateUsuarioMongo.mockImplementation(() => {
            throw new Error(JSON.stringify({ code: 400, msg: 'Datos inválidos' }));
        });

        const token = generateValidToken();

        const response = await request(app)
            .patch('/usuario')
            .send(invalidUpdate)
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.err).toBe('Datos inválidos');
    });

    test('DELETE /usuario/:id - éxito', async () => {
        const deletedUsuario = { _id: '123', isActive: false };
        deleteUsuarioMongo.mockResolvedValue(deletedUsuario);

        const token = generateValidToken();

        const response = await request(app)
            .delete('/usuario/123')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.mensaje).toBe('Éxito. 👍');
    });

    test('DELETE /usuario/:id - datos inválidos', async () => {
        deleteUsuarioMongo.mockImplementation(() => {
            throw new Error(JSON.stringify({ code: 400, msg: 'Datos inválidos' }));
        });

        const token = generateValidToken();

        const response = await request(app)
            .delete('/usuario/invalid-id')
            .set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(400);
        expect(response.body.err).toBe('Datos inválidos');
    });
});

