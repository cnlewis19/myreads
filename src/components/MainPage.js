import React from 'react';
import { Link } from 'react-router-dom';
import Shelf from './Shelf';
import * as BooksAPI from '../BooksAPI'

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: []
    }
  }
  componentDidMount() {
    BooksAPI.getAll()
    .then(callResponse => {
      this.setState({books: callResponse});
    });
  }

  changeShelf = (book, shelf) => {
    BooksAPI.update(book, shelf)
    .then(books => {
     book.shelf = shelf;
     this.setState(state => ({
       book: state.books.filter(b => b.id !== book.id).concat({book})
     }));
    });
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">
          <div>
            <Shelf changeShelf={this.changeShelf} name="Currently Reading" books={this.state.books.filter(b => b.shelf === "currentlyReading")}/>
            <Shelf changeShelf={this.changeShelf} name="Want to Read" books={this.state.books.filter(b => b.shelf === "wantToRead")}/>
            <Shelf changeShelf={this.changeShelf} name="Read" books={this.state.books.filter(b => b.shelf === "read")}/>
          </div>
        </div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}
export default MainPage;
