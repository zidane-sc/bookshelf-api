const validateBookInput = (input) => new Promise((resolve, reject) => {
  if (!input.name) {
    return reject(new Error('Mohon isi nama buku'));
  }

  if (input.readPage > input.pageCount) {
    return reject(new Error('readPage tidak boleh lebih besar dari pageCount'));
  }

  return resolve(input);
});

module.exports = validateBookInput;
