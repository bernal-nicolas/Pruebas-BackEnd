const Libro = require('../../../libro/libro.model');
const { createLibroMongo, getLibroMongo, updateLibroMongo, deleteLibroMongo } = require('../../../libro/libro.actions');

jest.mock('../../../libro/libro.model'); // Mock de Mongoose model

describe('Libro Actions', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('createLibroMongo', () => {
        it('should create a libro successfully', async () => {
            const datos = { nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date(), editorial: 'Editorial A' };
            Libro.create.mockResolvedValue(datos);

            const result = await createLibroMongo(datos);
            expect(result).toEqual(datos);
            expect(Libro.create).toHaveBeenCalledWith(datos);
        });

        it('should throw an error if data is invalid', async () => {
            const datos = { autor: 'Autor A' }; // Missing required fields
            Libro.create.mockRejectedValue(new Error('Invalid data'));

            await expect(createLibroMongo(datos)).rejects.toThrow('Invalid data');
            expect(Libro.create).toHaveBeenCalledWith(datos);
        });
    });

    describe('getLibroMongo', () => {
        it('should get libros successfully', async () => {
            const filtros = { nombre: 'Libro A' };
            const libros = [{ nombre: 'Libro A', autor: 'Autor A', genero: 'Genero A', fecha: new Date(), editorial: 'Editorial A' }];
            Libro.find.mockResolvedValue(libros);
            Libro.countDocuments.mockResolvedValue(1);

            const result = await getLibroMongo(filtros);
            expect(result).toEqual({
                resultados: libros,
                "Cantidad de Libros": 1
            });
            expect(Libro.find).toHaveBeenCalledWith({ ...filtros, isActive: true });
            expect(Libro.countDocuments).toHaveBeenCalledWith({ ...filtros, isActive: true });
        });
    });

    describe('updateLibroMongo', () => {
        it('should update a libro successfully', async () => {
            const id = '123';
            const cambios = { nombre: 'Libro B' };
            const updatedLibro = { _id: id, ...cambios };
            Libro.findByIdAndUpdate.mockResolvedValue(updatedLibro);

            const result = await updateLibroMongo(id, cambios);
            expect(result).toEqual(updatedLibro);
            expect(Libro.findByIdAndUpdate).toHaveBeenCalledWith(id, cambios);
        });

        it('should throw an error if data is invalid', async () => {
            const id = '123';
            const cambios = { nombre: '' }; // Invalid data
            Libro.findByIdAndUpdate.mockRejectedValue(new Error('Invalid data'));

            await expect(updateLibroMongo(id, cambios)).rejects.toThrow('Invalid data');
            expect(Libro.findByIdAndUpdate).toHaveBeenCalledWith(id, cambios);
        });
    });

    describe('deleteLibroMongo', () => {
        it('should delete a libro successfully', async () => {
            const id = '123';
            const updatedLibro = { _id: id, isActive: false };
            Libro.findByIdAndUpdate.mockResolvedValue(updatedLibro);

            const result = await deleteLibroMongo(id);
            expect(result).toEqual(updatedLibro);
            expect(Libro.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
        });

        it('should throw an error if id is invalid', async () => {
            const id = 'invalid_id';
            Libro.findByIdAndUpdate.mockRejectedValue(new Error('Invalid ID'));

            await expect(deleteLibroMongo(id)).rejects.toThrow('Invalid ID');
            expect(Libro.findByIdAndUpdate).toHaveBeenCalledWith(id, { isActive: false }, { new: true });
        });
    });
});
