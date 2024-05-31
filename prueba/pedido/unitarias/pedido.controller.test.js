const request = require('supertest');
const express = require('express');
const {
    readPedidoConFiltros,
    createPedido,
    updatePedido,
    deletePedido
} = require('../../../pedido/pedido.controller');
const { throwCustomError } = require('../../../utils/functions');

jest.mock('../../../pedido/pedido.actions', () => ({
    createPedidoMongo: jest.fn(),
    getPedidoMongo: jest.fn(),
    updatePedidoMongo: jest.fn(),
    deletePedidoMongo: jest.fn()
}));

const { createPedidoMongo, getPedidoMongo, updatePedidoMongo, deletePedidoMongo } = require('../../../pedido/pedido.actions');

jest.mock('../utils/functions', () => ({
    throwCustomError: jest.fn((status, message) => {
        const error = new Error(message);
        error.status = status;
        throw error;
    }),
    respondWithError: jest.fn()
}));

const app = express();
app.use(express.json());

app.get('/pedido', async (req, res) => {
    try {
        const result = await readPedidoConFiltros(req.query);
        res.status(200).json(result);
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

app.post('/pedido', async (req, res) => {
    try {
        const result = await createPedido(req.body);
        res.status(200).json({ mensaje: 'Éxito. 👍' });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

app.patch('/pedido', async (req, res) => {
    try {
        const result = await updatePedido(req.body);
        res.status(200).json({ mensaje: 'Éxito. 👍' });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

app.delete('/pedido/:id', async (req, res) => {
    try {
        const result = await deletePedido(req.params.id);
        res.status(200).json({ mensaje: 'Éxito. 👍' });
    } catch (e) {
        res.status(500).json({ msg: e.message });
    }
});

describe('Pedido Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('readPedidoConFiltros', () => {
        it('should return 400 if fecha_inicial or fecha_final are not provided', async () => {
            const response = await request(app).get('/pedido');
            expect(response.status).toBe(500);
            expect(response.body.msg).toBe('Debe proporcionar tanto la fecha inicial como la fecha final.');
        });

        it('should return 200 with valid filters', async () => {
            const filtros = { fecha_inicial: '2023-01-01', fecha_final: '2023-12-31' };
            getPedidoMongo.mockResolvedValue({ resultados: [], "Cantidad de pedidos": 0 });

            const response = await request(app).get('/pedido').query(filtros);
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ resultados: [], "Cantidad de pedidos": 0 });
        });
    });

    describe('createPedido', () => {
        it('should return 400 if estado is invalid', async () => {
            const datos = { estado: 'Invalido', lista_libros: ['Libro1'], usuario_do: 'Usuario1', usuario_rec: 'Usuario2', fecha: new Date() };

            const response = await request(app).post('/pedido').send(datos);
            expect(response.status).toBe(500);
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

    describe('updatePedido', () => {
        it('should return 400 if estado is invalid', async () => {
            const datos = { _id: '1', estado: 'Invalido' };

            const response = await request(app).patch('/pedido').send(datos);
            expect(response.status).toBe(500);
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

    describe('deletePedido', () => {
        it('should return 500 if id is invalid', async () => {
            const response = await request(app).delete('/pedido/invalid_id');
            expect(response.status).toBe(500);
            expect(response.body.msg).toBeDefined();
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
