const books = [];

const findBookById = (id) => new Promise((resolve, reject) => {
  const book = books.find((data) => data.id === id);
  if (book) {
    return resolve(book);
  }
  return reject(book);
});

const saveBook = (book, type) => new Promise((resolve, reject) => {
  findBookById(book.id)
    .then((value) => {
      const index = books.findIndex((data) => data.id === value.id);
      if (index > -1) {
        books[index] = {
          ...books[index],
          ...book,
        };

        resolve(book);
      }
    })
    .catch(() => {
      if (type === 'store') {
        books.push(book);
        const isSuccess = books.filter((data) => data.id === book.id).length > 0;
        if (isSuccess) {
          return resolve(book);
        }
        return reject(new Error('Buku gagal ditambahkan'));
      }

      return reject(new Error('Gagal memperbarui buku. Id tidak ditemukan'));
    });
});

const getAllBooks = (name, reading, finished) => new Promise((resolve) => {
  let resultBook = books;

  if (name) {
    resultBook = books.filter((book) => book.name.toLowerCase().indexOf(name.toLowerCase()) !== -1);
  }

  if (reading) {
    resultBook = books.filter((book) => {
      if (Number(reading) === 1) {
        return book.reading === true;
      } if (Number(reading) === 0) {
        return book.reading === false;
      }
      return true;
    });
  }

  if (finished) {
    resultBook = books.filter((book) => {
      if (Number(finished) === 1) {
        return book.finished === true;
      } if (Number(finished) === 0) {
        return book.finished === false;
      }
      return true;
    });
  }

  resolve(resultBook);
});

const destroyBook = (bookId) => new Promise((resolve, reject) => {
  findBookById(bookId)
    .then((value) => {
      const index = books.findIndex((data) => data.id === value.id);
      if (index > -1) {
        books.splice(index, 1);

        resolve();
      }
    })
    .catch(() => reject(new Error('Buku gagal dihapus. Id tidak ditemukan')));
});

module.exports = {
  findBookById,
  saveBook,
  getAllBooks,
  destroyBook,
};
