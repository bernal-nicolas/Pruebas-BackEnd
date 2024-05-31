const Pedido = require('../../../pedido/pedido.model');
const { createPedidoMongo, getPedidoMongo, updatePedidoMongo, deletePedidoMongo } = require('../../../pedido/pedido.actions');

jest.mock('../../../pedido/pedido.model');

describe('Pedido Actions', () => {

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createPedidoMongo', () => {
    it('should create a new pedido successfully', async () => {
      const datos = { fecha: new Date(), estado: 'En progreso', lista_libros: ['libro1'], usuario_do: 'user1', usuario_rec: 'user2' };
      const expectedPedido = { ...datos, _id: '123456789' };

      Pedido.create.mockResolvedValue(expectedPedido);

      const result = await createPedidoMongo(datos);
      expect(result).toEqual(expectedPedido);
      expect(Pedido.create).toHaveBeenCalledWith(datos);
    });

    it('should throw an error if datos are invalid', async () => {
      const datos = { estado: 'Invalido' }; // Datos inválidos

      Pedido.create.mockRejectedValue(new Error('Invalid data'));

      await expect(createPedidoMongo(datos)).rejects.toThrow('Invalid data');
      expect(Pedido.create).toHaveBeenCalledWith(datos);
    });
  });

  describe('getPedidoMongo', () => {
    it('should return filtered pedidos and count', async () => {
      const filtros = { fecha: { $gte: new Date(), $lte: new Date() }, isActive: true };
      const pedidos = [{}, {}];
      const cantidadPedidos = 2;

      Pedido.find.mockResolvedValue(pedidos);
      Pedido.countDocuments.mockResolvedValue(cantidadPedidos);

      const result = await getPedidoMongo(filtros);
      expect(result).toEqual({
        resultados: pedidos,
        'Cantidad de pedidos': cantidadPedidos
      });
      expect(Pedido.find).toHaveBeenCalledWith(filtros);
      expect(Pedido.countDocuments).toHaveBeenCalledWith(filtros);
    });

    it('should throw an error if there is a problem with the query', async () => {
      const filtros = { fecha: { $gte: new Date(), $lte: new Date() }, isActive: true };

      Pedido.find.mockRejectedValue(new Error('Query error'));

      await expect(getPedidoMongo(filtros)).rejects.toThrow('Query error');
      expect(Pedido.find).toHaveBeenCalledWith(filtros);
    });
  });

  describe('updatePedidoMongo', () => {
    it('should update an existing pedido successfully', async () => {
      const id = '123456789';
      const cambios = { estado: 'Completado' };
      const expectedPedido = { _id: id, ...cambios };

      Pedido.findByIdAndUpdate.mockResolvedValue(expectedPedido);

      const result = await updatePedidoMongo(id, cambios);
      expect(result).toEqual(expectedPedido);
      expect(Pedido.findByIdAndUpdate).toHaveBeenCalledWith(id, cambios);
    });

    it('should throw an error if the id or cambios are invalid', async () => {
      const id = '123456789';
      const cambios = { estado: 'Invalido' }; // Cambios inválidos

      Pedido.findByIdAndUpdate.mockRejectedValue(new Error('Invalid data'));

      await expect(updatePedidoMongo(id, cambios)).rejects.toThrow('Invalid data');
      expect(Pedido.findByIdAndUpdate).toHaveBeenCalledWith(id, cambios);
    });
  });

  describe('deletePedidoMongo', () => {
    it('should delete (soft delete) an existing pedido successfully', async () => {
      const id = '123456789';
      const expectedPedido = { _id: id, isActive: false };

      Pedido.findByIdAndUpdate.mockResolvedValue(expectedPedido);

      const result = await deletePedidoMongo(id);
      expect(result).toEqual(expectedPedido);
      expect(Pedido.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
    });

    it('should throw an error if the id is invalid', async () => {
      const id = 'invalid_id'; // ID inválido

      Pedido.findByIdAndUpdate.mockRejectedValue(new Error('Invalid id'));

      await expect(deletePedidoMongo(id)).rejects.toThrow('Invalid id');
      expect(Pedido.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
    });
  });
});
