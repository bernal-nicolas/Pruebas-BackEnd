const { createUsuarioMongo, getUsuarioMongo, updateUsuarioMongo, deleteUsuarioMongo } = require('../../../usuario/usuario.actions');
const Usuario = require('../../../usuario/usuario.model');

jest.mock('../../../usuario/usuario.model');

describe('Usuario Actions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createUsuarioMongo', () => {
    it('should create a new user', async () => {
      const datos = { username: 'testuser', password: 'password' };
      Usuario.create.mockResolvedValue(datos);

      const result = await createUsuarioMongo(datos);

      expect(Usuario.create).toHaveBeenCalledWith(datos);
      expect(result).toEqual(datos);
    });

    it('should handle invalid data', async () => {
      const datos = { password: 'password' };
      Usuario.create.mockRejectedValue(new Error('Invalid data'));

      await expect(createUsuarioMongo(datos)).rejects.toThrow('Invalid data');
    });
  });

  describe('getUsuarioMongo', () => {
    it('should get users with filters', async () => {
      const filtros = { username: 'testuser' };
      const usuariosFiltrados = [{ username: 'testuser', password: 'password', isActive: true }];
      Usuario.find.mockResolvedValue(usuariosFiltrados);

      const result = await getUsuarioMongo(filtros);

      expect(Usuario.find).toHaveBeenCalledWith({ ...filtros, isActive: true });
      expect(result).toEqual(usuariosFiltrados);
    });
  });

  describe('updateUsuarioMongo', () => {
    it('should update a user by id', async () => {
      const id = '12345';
      const cambios = { username: 'updateduser' };
      const resultado = { _id: id, username: 'updateduser', password: 'password' };
      Usuario.findByIdAndUpdate.mockResolvedValue(resultado);

      const result = await updateUsuarioMongo(id, cambios);

      expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(id, cambios);
      expect(result).toEqual(resultado);
    });

    it('should handle invalid data', async () => {
      const id = '12345';
      const cambios = { username: '' };
      Usuario.findByIdAndUpdate.mockRejectedValue(new Error('Invalid data'));

      await expect(updateUsuarioMongo(id, cambios)).rejects.toThrow('Invalid data');
    });
  });

  describe('deleteUsuarioMongo', () => {
    it('should delete a user by id', async () => {
      const id = '12345';
      const resultado = { _id: id, username: 'testuser', isActive: false };
      Usuario.findByIdAndUpdate.mockResolvedValue(resultado);

      const result = await deleteUsuarioMongo(id);

      expect(Usuario.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
      expect(result).toEqual(resultado);
    });

    it('should handle invalid id', async () => {
      const id = 'invalid-id';
      Usuario.findByIdAndUpdate.mockRejectedValue(new Error('Invalid id'));

      await expect(deleteUsuarioMongo(id)).rejects.toThrow('Invalid id');
    });
  });
});
