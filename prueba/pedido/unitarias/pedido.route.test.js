const request = require('supertest');
const express = require('express');
const pedidoRoute = require('../../../pedido/pedido.route');
const { throwCustomError } = require('../../../utils/functions');
const { createPedidoMongo, getPedidoMongo, updatePedidoMongo, deletePedidoMongo } = require('../../../pedido/pedido.actions');

jest.mock('../../../pedido/pedido.actions', () => ({
    createPedidoMongo: jest.fn(),
    getPedidoMongo: jest.fn(),
    updatePedidoMongo: jest.fn(),
    deletePedidoMongo: jest.fn()
}));

jest.mock('../../../middlewares/authMiddleware', () => (req, res, next) => next());

jest.mock('../../../utils/functions', () => ({
    throwCustomError: jest.fn((status, message) => {
        const error = new Error(message);
        error.status = status;
        throw error;
    }),
    respondWithError: jest.fn((res, e) => {
        res.status(e.status || 500).json({ msg: e.message || '' });
    })
}));

const app = express();
app.use(express.json());
app.use('/pedido', pedidoRoute);

describe('Pedido Routes', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /pedido', () => {
        it('should return 500 if fecha_inicial or fecha_final are not provided', async () => {
            // Simular el caso en el que se lanzará un error desde el controlador
            const mockReadPedidoConFiltros = jest.fn(() => {
                throwCustomError(500, 'Debe proporcionar tanto la fecha inicial como la fecha final.');
            });

            const controller = require('../../../pedido/pedido.controller');
            controller.readPedidoConFiltros = mockReadPedidoConFiltros;

            const response = await request(app).get('/pedido');
            expect(response.status).toBe(500);
        });

        it('should return 200 with valid filters', async () => {
            const filtros = { fecha_inicial: '2023-01-01', fecha_final: '2023-12-31' };
            getPedidoMongo.mockResolvedValue({ resultados: [], "Cantidad de pedidos": 0 });

            const response = await request(app).get('/pedido').query(filtros);
            expect(response.status).toBe(200);
            expect(response.body.resultados).toEqual([]);
            expect(response.body["Cantidad de pedidos"]).toBe(0);
        });
    });

    describe('POST /pedido', () => {
        it('should return 400 if estado is invalid', async () => {
            const datos = { estado: 'Invalido', lista_libros: ['Libro1'], usuario_do: 'Usuario1', usuario_rec: 'Usuario2', fecha: new Date() };

            const response = await request(app).post('/pedido').send(datos);
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Estado inválido o no colocaste ningun estado. Los estados permitidos son: 'En progreso', 'Completado', 'Cancelado'.");
        });

        it('should create a pedido with valid data', async () => {
            const datos = { estado: 'En progreso', lista_libros: ['Libro1'], usuario_do: 'Usuario1', usuario_rec: 'Usuario2', fecha: new Date() };
            createPedidoMongo.mockResolvedValue(datos);

            const response = await request(app).post('/pedido').send(datos);
            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe('Éxito. 👍');
        });
    });

    describe('PATCH /pedido', () => {
        it('should return 400 if estado is invalid', async () => {
            const datos = { _id: '1', estado: 'Invalido' };

            const response = await request(app).patch('/pedido').send(datos);
            expect(response.status).toBe(400);
            expect(response.body.msg).toBe("Estado inválido o no colocaste ningun estado. Los estados permitidos son: 'En progreso', 'Completado', 'Cancelado'.");
        });

        it('should update a pedido with valid data', async () => {
            const datos = { _id: '1', estado: 'Completado' };
            updatePedidoMongo.mockResolvedValue(datos);

            const response = await request(app).patch('/pedido').send(datos);
            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe('Éxito. 👍');
        });
    });

    describe('DELETE /pedido/:id', () => {
        it('should return 500 if id is invalid', async () => {
            deletePedidoMongo.mockImplementationOnce(() => {
                throwCustomError(500, 'Invalid ID');
            });

            const response = await request(app).delete('/pedido/invalid_id');
            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Invalid ID');
        });

        it('should delete a pedido with valid id', async () => {
            const id = '1';
            deletePedidoMongo.mockResolvedValue({ _id: id, isActive: false });

            const response = await request(app).delete(`/pedido/${id}`);
            expect(response.status).toBe(200);
            expect(response.body.mensaje).toBe('Éxito. 👍');
        });
    });
});
