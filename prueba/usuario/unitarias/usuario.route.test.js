const request = require('supertest');
const express = require('express');
const usuarioRoutes = require('../../../usuario/usuario.route');
const {
  readUsuarioConFiltros,
  createUsuario,
  updateUsuario,
  deleteUsuario
} = require('../../../usuario/usuario.controller');

jest.mock('../../../usuario/usuario.controller');
jest.mock('../../../middlewares/authMiddleware', () => jest.fn((req, res, next) => next()));

const app = express();
app.use(express.json());
app.use('/usuario', usuarioRoutes);

describe('Usuario Routes', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('Get should call readUsuarioConFiltros', async () => {
      const mockUsuarios = [{ username: 'user1', password: 'pass1', isActive: true }];
      readUsuarioConFiltros.mockResolvedValue(mockUsuarios);
      const token = "123456789"
      const response = await request(app)
          .get('/usuario')
          .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(readUsuarioConFiltros).toHaveBeenCalled();
    })

    it('POST should call createUsuario', async () => {
      const mockUsuario = { username: 'user1', password: 'pass1', isActive: true };
      createUsuario.mockResolvedValue(mockUsuario);
      const response = await request(app).post('/usuario').send(mockUsuario);

      expect(response.status).toBe(200);
      expect(createUsuario).toHaveBeenCalled();
    })

    it('PATCH should call updateUsuario', async () => {
      const mockUsuario = { id: '123', username: 'user1', password: 'pass1', isActive: true };
      const mockUsuario1 = { id: '123', username: 'user1', password: 'pass1', isActive: false };
      updateUsuario.mockResolvedValue(mockUsuario1);
      const response = await request(app).patch('/usuario').send(mockUsuario);

      expect(response.status).toBe(200)
      expect(updateUsuario).toHaveBeenCalled();
    })

    it('DELETE should call deleteUsuario', async () => {
      const mockUsuario1 = { id: '123', username: 'user1', password: 'pass1', isActive: false };
      deleteUsuario.mockResolvedValue(mockUsuario1);
      const id = '123'
      const response = await request(app).delete(`/usuario/${id}`)

      expect(response.status).toBe(200)
      expect(deleteUsuario).toHaveBeenCalledWith(id);
    })


})