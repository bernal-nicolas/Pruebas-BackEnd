const { readPedidoConFiltros, createPedido,
  updatePedido, deletePedido, validarEstado
} = require('../../../pedido/pedido.controller');

const { getPedidoMongo, createPedidoMongo,
  updatePedidoMongo, deletePedidoMongo
} = require('../../../pedido/pedido.actions');

jest.mock('../../../pedido/pedido.actions');

describe('Pedido Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('readPedidoConFiltros', () => {
    it('should return filtered pedidos', async () => {
      const query = { estado: 'Completado', fecha_inicial: "20-02-2024", fecha_final: "20-03-2025" };
      const pedidos = [{
                        fecha: new Date(), estado: 'Completado',
                        lista_libros: ['id Libro 1', 'id Libro 2'],
                        usuario_do: "id User1", usuario_rec: 'id User2' 
                       },
                       {
                        fecha: new Date(), estado: 'Completado',
                        lista_libros: ['id Libro 1', 'id Libro 2'],
                        usuario_do: "id User1", usuario_rec: 'id User2'
                       }
                      ];
      getPedidoMongo.mockResolvedValue({
        resultados: pedidos,
        "Cantidad de Pedidos": 2
      });
      
      const result = await readPedidoConFiltros(query);
      expect(result).toEqual({
        resultados: pedidos,
        "Cantidad de Pedidos": 2
      });
    });
  });

  describe('createPedido', () => {
    it('should throw an error if data is invalid', async () => {
      const datos = { estado: 'Completado' }; // missing required fields
      
      createPedidoMongo.mockRejectedValue(new Error('Invalid data'));

      await expect(createPedido(datos)).rejects.toThrow('Invalid data');
      expect(createPedidoMongo).toHaveBeenCalledWith(datos);
    });
    
    it('should create a pedido with valid data', async () => {
      const datos = { estado: 'En progreso', lista_libros: ['Libro1'], usuario_do: 'Usuario1', usuario_rec: 'Usuario2', fecha: new Date() };
      createPedidoMongo.mockResolvedValue(datos);
      
      const result = await createPedido(datos);
      expect(result).toEqual(datos);
      expect(createPedidoMongo).toHaveBeenCalledWith(datos);
    });
  });

  describe('updatePedido', () => {
    it('should throw an error if data is invalid', async () => {
      const datos = { _id: '1', estado: 'Invalido' };
      const wrongStatus = "{\"code\":400,\"msg\":\"Estado inválido o no colocaste ningun estado. Los estados permitidos son: 'En progreso', 'Completado', 'Cancelado'.\"}"

      await expect(updatePedido(datos)).rejects.toThrow(wrongStatus)
    });
    
    it('should update a pedido with valid data', async () => {
      const datos = { _id: '1', estado: 'Completado' };
      const updatedPedido = { _id: '1', estado: 'Completado' };
      updatePedidoMongo.mockResolvedValue(updatedPedido);
      
      const result = await updatePedido(datos);
      expect(result).toEqual(updatedPedido);
      expect(updatePedidoMongo).toHaveBeenCalledWith('1', { estado: 'Completado' });
    });
  });

  describe('deletePedido', () => {
    it('should throw error if id is invalid', async () => {
      const id = 'invalid_id';
      deletePedidoMongo.mockRejectedValue(new Error('Invalid ID'));
      await expect(deletePedido(id)).rejects.toThrow('Invalid ID');
      expect(deletePedidoMongo).toHaveBeenCalledWith(id);
    });
    
    it('should delete a pedido with valid id', async () => {
      const id = '1';
      const updatedPedido = { _id: '1', isActive: 'false' };
      deletePedidoMongo.mockResolvedValue(updatedPedido);
      
      const result = await deletePedido(id);
      expect(deletePedidoMongo).toHaveBeenCalledWith(id);
    });
  });
});
