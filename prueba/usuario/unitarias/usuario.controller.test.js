const { getUsuarioMongo, createUsuarioMongo,
        updateUsuarioMongo, deleteUsuarioMongo
      } = require('../../../usuario/usuario.actions');
const { readUsuarioConFiltros, createUsuario,
        updateUsuario, deleteUsuario
      } = require('../../../usuario/usuario.controller');

jest.mock('../../../usuario/usuario.actions');


describe('Usuario Controller', () => {
  afterEach(() => {
      jest.clearAllMocks();
  });

  describe('readUsuario', () => {
    it('should return usuario', async () => {
        const query = { nombre: 'usuario A' };
        const usuarios = [{ username: 'Usuario A', username: '12345'}];
        getUsuarioMongo.mockResolvedValue({
            resultados: usuarios
        });

        const result = await readUsuarioConFiltros(query);
        expect(result).toEqual({
            resultados: usuarios
        });
        expect(getUsuarioMongo).toHaveBeenCalledWith(query);
    });
  });

  describe('createUsuario', () => {
    it('should create a Usuario successfully', async () => {
        const datos = { username: 'Usuario A', username: '12345'}
        createUsuarioMongo.mockResolvedValue(datos);

        const result = await createUsuario(datos);
        expect(result).toEqual(datos);
        expect(createUsuarioMongo).toHaveBeenCalledWith(datos);
    });

    it('should throw an error if data is invalid', async () => {
        const datos = { autor: 'Autor A' }; // Missing required fields
        createUsuarioMongo.mockRejectedValue(new Error('Invalid data'));

        await expect(createUsuario(datos)).rejects.toThrow('Invalid data');
        expect(createUsuarioMongo).toHaveBeenCalledWith(datos);
    });
  });

  describe('updateUsuario', () => {
    it('should update a Usuario successfully', async () => {
        const datos = { _id: '123', username: 'Usuario a' };
        const updatedUsuario = { _id: '123', username: 'Usuario B' };
        updateUsuarioMongo.mockResolvedValue(updatedUsuario);

        const result = await updateUsuario(datos);
        expect(result).toEqual(updatedUsuario);
        expect(updateUsuarioMongo).toHaveBeenCalledWith('123', { username: 'Usuario a' });
    });

    it('should throw an error if data is invalid', async () => {
        const datos = { _id: '123', nombre: '' }; // Invalid data
        updateUsuarioMongo.mockRejectedValue(new Error('Invalid data'));

        await expect(updateUsuario(datos)).rejects.toThrow('Invalid data');
        expect(updateUsuarioMongo).toHaveBeenCalledWith('123', { nombre: '' });
    });
  });

  describe('deleteUsuario', () => {
    it('should delete a Usuario successfully', async () => {
        const id = '123';
        const updatedUsuario = { _id: '123', isActive: false };
        deleteUsuarioMongo.mockResolvedValue(updatedUsuario);

        const result = await deleteUsuario(id);
        expect(result).toEqual(updatedUsuario);
        expect(deleteUsuarioMongo).toHaveBeenCalledWith(id);
    });

    it('should throw an error if id is invalid', async () => {
        const id = 'invalid_id';
        deleteUsuarioMongo.mockRejectedValue(new Error('Invalid ID'));

        await expect(deleteUsuario(id)).rejects.toThrow('Invalid ID');
        expect(deleteUsuarioMongo).toHaveBeenCalledWith(id);
    });
  });

});