const books = [];

const RENDER_EVENT = 'render-book';
const STORAGE_KEY = 'data-buku';
const SAVED_EVENT = 'saved-book';

function generateId() {
    return Math.floor(Math.random() * 1000);
}

function generateBookObject(id, judul, penulis, penerbit, tahunTerbit, jumlahHalaman, link, isCompleted) {
    return {
        id,
        judul,
        penulis,
        penerbit,
        tahunTerbit,
        jumlahHalaman,
        link,
        isCompleted
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
      for (const book of data) {
        books.push(book);
      }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
    if (typeof (Storage) !== 'undefined'){
        return true;
    } else {
        alert('Browser kamu tidak mendukung web storage.');
        return false;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const submitForm = document.getElementById('form');
    if (isStorageExist()) {
        loadDataFromStorage();
    }
    submitForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });
});

function findBook(bookId) {
    for (bookItem of books) {
      if (bookItem.id === bookId) {
        return bookItem;
      }
    }
    return null;
}

function findBookIndex(bookId) {

    const indexOfBook = books.findIndex(bookItem => {
        return bookItem.id == bookId;
    });

    return indexOfBook;
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    const titleLink = document.createElement('a');
    titleLink.classList.add('link-buku');
    titleLink.setAttribute('href', bookObject.link);
    titleLink.setAttribute('target', '_blank');

    titleLink.innerText = bookObject.judul;
    textTitle.style.fontWeight = 'bold';
    textTitle.append(titleLink);

    const textJumlahHal = document.createElement('p');
    textJumlahHal.innerText = bookObject.jumlahHalaman + " halaman";

    const textPenerbit = document.createElement('p');
    textPenerbit.innerText = "Penerbit : " + bookObject.penerbit;

    const textPenulis = document.createElement('p');
    textPenulis.innerText = "Penulis : " + bookObject.penulis;

    const textTahunTerbit = document.createElement('p');
    textTahunTerbit.innerText = "Tahun terbit : " + bookObject.tahunTerbit;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textJumlahHal, textPenulis, textPenerbit, textTahunTerbit);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    const trashButton = document.createElement('button');
    trashButton.classList.add('trash-button');
    trashButton.addEventListener('click', function () {
        removeBookFromCompleted(bookObject.id);
    });

    if (bookObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        });



        container.append(undoButton, trashButton);
    } else {
        const finishButton = document.createElement('button');
        finishButton.classList.add('check-button');

        finishButton.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });

        container.append(finishButton, trashButton);
    }

    return container;

}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function addBook() {
    const judulValue = document.getElementById('judul').value;
    const jumlahHalamanValue = document.getElementById('jumlahHalaman').value;
    const penulisValue = document.getElementById('penulis').value;
    const penerbitValue = document.getElementById('penerbit').value;
    const tahunTerbitValue = document.getElementById('tahunTerbit').value;
    const linkValue = document.getElementById('link').value;

    const generateID = generateId();

    const bookObject = generateBookObject(generateID, judulValue, penulisValue, penerbitValue, tahunTerbitValue, jumlahHalamanValue, linkValue, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function addBookToCompleted (bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;

    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBooksList = document.getElementById('belumSelesai');
    uncompletedBooksList.innerHTML = '';

    const completedBooksList = document.getElementById('sudahSelesai');
    completedBooksList.innerHTML = '';

    for (const bookItem of books) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isCompleted) {
            uncompletedBooksList.append(bookElement);
        } else {
            completedBooksList.append(bookElement);
        }
    }


})
