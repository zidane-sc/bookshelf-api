const { nanoid } = require('nanoid');
const {
  saveBook,
  findBookById,
  destroyBook,
  getAllBooks,
} = require('./books');
const validateBookInput = require('./validate');

const storeBookHandler = (request, h) => {
  try {
    const {
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
    } = request.payload;
    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
      id,
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      insertedAt,
      updatedAt,
    };

    return validateBookInput(newBook)
      .then(async (bookValidated) => {
        const book = await saveBook(bookValidated, 'store');
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil ditambahkan',
          data: {
            bookId: book.id,
          },
        });
        response.code(201);
        return response;
      })
      .catch((error) => {
        const response = h.response({
          status: 'fail',
          message: `Gagal menambahkan buku. ${error.message}`,
        });
        response.code(400);
        return response;
      });
  } catch (error) {
    const response = h.response({
      status: 'fail',
      message: 'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;
  }
};

const getAllBooksHandler = async (request) => {
  const { name, reading, finished } = request.query;
  const responseBook = await getAllBooks(name, reading, finished);

  return {
    status: 'success',
    data: {
      books: responseBook.map((book) => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  return findBookById(bookId)
    .then((result) => ({
      status: 'success',
      data: {
        book: result,
      },
    }))
    .catch(() => {
      const response = h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan',
      });
      response.code(404);
      return response;
    });
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const {
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const book = {
    id: bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading,
    updatedAt,
  };

  return validateBookInput(book)
    .then((bookValidated) => saveBook(bookValidated, 'update')
      .then(() => {
        const response = h.response({
          status: 'success',
          message: 'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
      })
      .catch((error) => {
        const response = h.response({
          status: 'fail',
          message: error.message,
        });
        response.code(404);
        return response;
      }))
    .catch((error) => {
      const response = h.response({
        status: 'fail',
        message: `Gagal memperbarui buku. ${error.message}`,
      });
      response.code(400);
      return response;
    });
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  return destroyBook(bookId)
    .then(() => {
      const response = h.response({
        status: 'success',
        message: 'Buku berhasil dihapus',
      });
      response.code(200);
      return response;
    })
    .catch((error) => {
      const response = h.response({
        status: 'fail',
        message: error.message,
      });
      response.code(404);
      return response;
    });
};

module.exports = {
  storeBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};
