import React from 'react';
import { Link } from 'react-router-dom';
import * as BooksAPI from '../BooksAPI';
import Book from './Book'


class SearchPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      books: [],
      results: [],
      query: ""
    }
  }
  componentDidMount() {
    BooksAPI.getAll()
    .then(callResponse => {
      this.setState({books: callResponse});
    });
  }
  updateSearch = (query) => {
    this.setState({query:query}, this.searchResults);
  }
  searchResults() {
   if(this.state.query === "" || this.state.query === undefined) {
     return this.setState({ results: [] });
   }
   BooksAPI.search(this.state.query).then(callResponse => {
     if(callResponse.error) {
       this.setState({ results: [] });
     }
     else {
       callResponse.forEach(book => {
         let find  = this.state.books.filter(Book => Book.id === book.id);
         if(find[0]) {
           book.shelf = find[0].shelf;
         }
       });
       return this.setState({ results: callResponse});
     }
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
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
          <div className="search-books-input-wrapper">
            {/*
              NOTES: The search from BooksAPI is limited to a particular set of search terms.
              You can find these search terms here:
              https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

              However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
              you don't find a specific author or title. Every search is limited by search terms.
            */}
            <input type="text" placeholder="Search by title or author" value={this.state.query} onChange ={(event) => this.updateSearch(event.target.value)}/>

          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
          {
            this.state.results.map((book, key) => <Book changeShelf={this.changeShelf} book={book} key={key}/>)
          }
          </ol>
        </div>
      </div>
    );
  }
}
export default SearchPage;
