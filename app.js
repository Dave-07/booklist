class Book {
    constructor({ title, author, isbn }) {
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

class UI {
    static displayBooks() {

        const books = Store.getBooks(); 

        books.forEach(el => UI.addBookToList(el));
    }

    static addBookToList(book) {
        const list = document.querySelector('#book-list');
        const row = document.createElement('tr');
        row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="btn btn-danger btn-sm delete">X</td>`;
        list.appendChild(row);
    }

    static resetForm(arr) {
        arr.forEach(el => el.value = "");
        return;
    }

    static displayMessage(message = "", className = ""){

        const parent = document.querySelector('.container');
        const doesExist = parent.querySelector('.alert');

        if (!doesExist) {
            const h1 = parent.querySelector('h1');
            const div = document.createElement('div');
            const text = document.createTextNode(message?.message ?? message);
    
            div.className = `${className}`;
            div.appendChild(text);
            h1.insertAdjacentElement('afterend', div);
        }

        const timer = setTimeout(function(){
            let formatClass = `.${className.replace(/[\s]/g, ".")}`;
            let removeEl = parent.querySelector(formatClass);
            return removeEl ? removeEl.remove() : "";
        }, 3000);

    }

    static removeBook(event) {

        if (event.target.classList.contains('delete')) {
            const grandparent = event.target.parentElement.parentElement;
            const isbn = grandparent.children[2].innerText;
            grandparent.innerHTML = "";
            UI.displayMessage('Книга удалена', 'alert alert-primary');
            Store.removeBook(isbn);
            
        }
    }

}

class Store {

    static getBooks(){

        let books;
        
        if(localStorage.getItem('books') === null){
            books = [];
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }

    static setBook(book){
        const books = Store.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(isbn){

        let books = Store.getBooks();
        
        books = books.filter(el => el.isbn !== isbn);

        localStorage.setItem('books', JSON.stringify(books));

    }
}

document.addEventListener('DOMContentLoaded', UI.displayBooks);


document.querySelector('#book-form').addEventListener('submit', function (e) {
    e.preventDefault();

    try {
        function validateInput(arr) {
            arr.forEach(el => {
                if(!el.value.length) throw new Error("Пожалуйста, заполните все поля!");
            });
        }

        function bookData() {
            const dataArr = Array.from(document.querySelectorAll('#title, #author, #isbn'));

            const dataObj = Object.fromEntries(dataArr.map(el => [el.id, el.value]));

            validateInput(dataArr);

            const book = new Book((({ title, author, isbn } = {}) => {
                return { title, author, isbn };
            })(dataObj));

            return { book, dataArr, dataObj };
        }

        UI.addBookToList(bookData()['book']);
        Store.setBook(bookData()['book']);

        UI.resetForm(bookData()['dataArr']);

        UI.displayMessage("Книга добавлена", 'alert alert-success');

    } catch (err) {
        UI.displayMessage(err, 'alert alert-warning');
        console.warn(`Custom catch err: ${err}`);
    }

});

document.querySelector('#book-list').addEventListener('click', UI.removeBook);