const { createLibroMongo, getLibroMongo, updateLibroMongo, deleteLibroMongo } = require('../../../libro/libro.actions');
const { readLibroConFiltros, createLibro, updateLibro, deleteLibro } = require('../../../libro/libro.controller');

jest.mock('../../../libro/libro.actions');

describe('Libro Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('readLibroConFiltros', () => {
        it('should return filtered libros', async () => {
            const query = { nombre: 'Libro A' };
            const libros = [{ nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date(), editorial: 'Editorial A' }];
            getLibroMongo.mockResolvedValue({
                resultados: libros
            });

            const result = await readLibroConFiltros(query);
            expect(result).toEqual({
                resultados: libros
            });
            expect(getLibroMongo).toHaveBeenCalledWith(query);
        });
    });

    describe('createLibro', () => {
        it('should create a libro successfully', async () => {
            const datos = { nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date(), editorial: 'Editorial A' };
            createLibroMongo.mockResolvedValue(datos);

            const result = await createLibro(datos);
            expect(result).toEqual(datos);
            expect(createLibroMongo).toHaveBeenCalledWith(datos);
        });

        it('should throw an error if data is invalid', async () => {
            const datos = { autor: 'Autor A' }; // Missing required fields
            createLibroMongo.mockRejectedValue(new Error('Invalid data'));

            await expect(createLibro(datos)).rejects.toThrow('Invalid data');
            expect(createLibroMongo).toHaveBeenCalledWith(datos);
        });
    });

    describe('updateLibro', () => {
        it('should update a libro successfully', async () => {
            const datos = { _id: '123', nombre: 'Libro B' };
            const updatedLibro = { _id: '123', nombre: 'Libro B' };
            updateLibroMongo.mockResolvedValue(updatedLibro);

            const result = await updateLibro(datos);
            expect(result).toEqual(updatedLibro);
            expect(updateLibroMongo).toHaveBeenCalledWith('123', { nombre: 'Libro B' });
        });

        it('should throw an error if data is invalid', async () => {
            const datos = { _id: '123', nombre: '' }; // Invalid data
            updateLibroMongo.mockRejectedValue(new Error('Invalid data'));

            await expect(updateLibro(datos)).rejects.toThrow('Invalid data');
            expect(updateLibroMongo).toHaveBeenCalledWith('123', { nombre: '' });
        });
    });

    describe('deleteLibro', () => {
        it('should delete a libro successfully', async () => {
            const id = '123';
            const updatedLibro = { _id: '123', isActive: false };
            deleteLibroMongo.mockResolvedValue(updatedLibro);

            const result = await deleteLibro(id);
            expect(result).toEqual(updatedLibro);
            expect(deleteLibroMongo).toHaveBeenCalledWith(id);
        });

        it('should throw an error if id is invalid', async () => {
            const id = 'invalid_id';
            deleteLibroMongo.mockRejectedValue(new Error('Invalid ID'));

            await expect(deleteLibro(id)).rejects.toThrow('Invalid ID');
            expect(deleteLibroMongo).toHaveBeenCalledWith(id);
        });
    });
});
