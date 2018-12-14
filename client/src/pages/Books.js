import React, { Component } from "react";
import Jumbotron from "../components/Jumbotron";
import DeleteBtn from "../components/DeleteBtn";
import { Col, Row, Container } from "../components/Grid";
import { List, ListItem } from "../components/List";
import { Input, TextArea, FormBtn } from "../components/Form";
import API from "../utils/API"
import $ from 'jquery';
import './Books.css';
//import { isArray } from "util";


class Books extends Component {
  // Initialize this.state.books as an empty array
  state = {
    books: [],
    title: "",
    author: "",
    synopsis: "",
    image: "",
    link: "",
    search: [],
    searchTerm: ""
  };

  // Add code here to get all books from the database and save them to this.state.books
  componentDidMount() {
    this.loadBooks();
    $(".searchResults").hide();


  }

  saveSearch = (img, link, title, authors, description) => {

    API.saveBook({
      title: title,
      author: authors,
      synopsis: description,
      img: img,
      link: link
    })
      .then(res => this.loadBooks())
      .catch(err => console.log(err))

    

  }

  searchBooks = event => {
    $(".searchResults").show();

    event.preventDefault();
    API.getBookTitle(this.state.searchTerm)
      .then(res => {

        this.setState({ search: res.data.items })

        console.log(this.state.search)
        this.setState({ searchTerm: "" })

      }).catch(err => console.log(err))



  }

  loadBooks = () => {
    API.getBooks()
      .then(res => {
        this.setState({ books: res.data, title: "", author: "", synopsis: "" })
        console.log(res.data);
      }).catch(err => console.log(err));
  }


  deleteBook = id => {
    API.deleteBook(id)
      .then(res => this.loadBooks())

  }

  handleInputChange = event => {
    const { name, value } = event.target;
    this.setState({
      [name]: value
    })
  }

  handleFormSubmit = event => {
    event.preventDefault();
    if (this.state.title && this.state.author) {
      API.saveBook({
        title: this.state.title,
        author: this.state.author,
        synopsis: this.state.synopsis
      })
        .then(res => this.loadBooks())
        .catch(err => console.log(err))
    }
  }


  render() {
    return (
      <Container fluid>
        <Row>
          <Col size="md-6">
            <Jumbotron>
              <h1>What Books Should I Read?</h1>
            </Jumbotron>
            {/* <form>
              <Input name="title" placeholder="Title (required)" value={this.state.title} onChange={this.handleInputChange} />
              <Input name="author" placeholder="Author (required)" value={this.state.author} onChange={this.handleInputChange} />
              <TextArea name="synopsis" placeholder="Synopsis (Optional)" value={this.state.synopsis} onChange={this.handleInputChange} />
              <FormBtn
              disabled={!(this.state.author && this.state.title)}
              onClick={this.handleFormSubmit}
              >Submit Book</FormBtn>

            </form> */}

            <form>
              <Input name="searchTerm" placeholder="Search Books" value={this.state.searchTerm} onChange={this.handleInputChange} />
              <FormBtn
                disabled={!this.state.searchTerm}
                onClick={this.searchBooks}

              >Search</FormBtn>
            </form>

            <br />
            <hr />

<div className="searchResults">
            <List>              

                {this.state.search.map(book => (

                  <ListItem key={book.id}>
                    {book.volumeInfo.imageLinks ? <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="searchImage" /> : <img src="http://www.scottishbooktrust.com/files/styles/blog_detail/public/cover-not-available_202.png?itok=4odMZp7s" alt={book.volumeInfo.title} />}

                    <strong> <a href={book.volumeInfo.previewLink} target="_blank">{book.volumeInfo.title} by {Array.isArray(book.volumeInfo.authors) ? book.volumeInfo.authors.join(" ") : book.volumeInfo.authors} </a></strong>
                    <br />
                    {book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200).concat("...") : "N/A"}
                    <br />
                    <FormBtn onClick={() => {
                      let img = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "http://www.scottishbooktrust.com/files/styles/blog_detail/public/cover-not-available_202.png?itok=4odMZp7s",
                        link = book.volumeInfo.previewLink,
                        title = book.volumeInfo.title,
                        authors = Array.isArray(book.volumeInfo.authors) ? book.volumeInfo.authors.join(" ") : book.volumeInfo.authors,
                        description = book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200).concat("...") : "N/A";

                      this.saveSearch(img, link, title, authors, description)

                    }}>Save</FormBtn>


                  </ListItem>
                ))}

              
            </List>
            </div>


            {/* <div id="searchResults">
              {this.state.search.map(book => (

                <div key={book.id} className="row">

                  <div className="col-md-1">

                    {book.volumeInfo.imageLinks ? <img src={book.volumeInfo.imageLinks.thumbnail} alt={book.volumeInfo.title} className="searchImage" /> : <img src="http://www.scottishbooktrust.com/files/styles/book-cover-book-page/public/cover-not-available_201.png?itok=XV_bm-Xa" alt={book.volumeInfo.title} />}
                  </div>

                  <div className="col-md-10">
                    <p><a href={book.volumeInfo.previewLink} target="_blank">{book.volumeInfo.title} by {Array.isArray(book.volumeInfo.authors) ? book.volumeInfo.authors.join(" ") : book.volumeInfo.authors} </a>

                      <br />

                      {book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200).concat("...") : "N/A"}
                      <br />

                      <button onClick={() => {
                        let img = book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : "http://www.scottishbooktrust.com/files/styles/book-cover-book-page/public/cover-not-available_201.png?itok=XV_bm-Xa",
                          link = book.volumeInfo.previewLink,
                          title = book.volumeInfo.title,
                          authors = Array.isArray(book.volumeInfo.authors) ? book.volumeInfo.authors.join(" ") : book.volumeInfo.authors,
                          description = book.volumeInfo.description ? book.volumeInfo.description.slice(0, 200).concat("...") : "N/A";

                        this.saveSearch(img, link, title, authors, description)

                      }}>Save</button>
                    </p>

                  </div>

                </div>
              ))}
            </div> */}


          </Col>
          <Col size="md-6 sm-12">
            <Jumbotron>
              <h1>Books On My List</h1>
            </Jumbotron>
            {this.state.books.length ? (
              <List>
                {this.state.books.map(book => (
                  <ListItem key={book._id}>
                    <DeleteBtn onClick={() => this.deleteBook(book._id)} />
                    <img src={book.img} alt={book.title} className="savedBook" />


                    <strong> <a href={book.link} target="_blank">{book.title} by {book.author}</a></strong>
                    <br />

                    {book.synopsis}

                  </ListItem>
                ))}
              </List>
            ) : (
                <h3>No Results to Display</h3>
              )}

          </Col>
        </Row>
      </Container>
    );
  }
}

export default Books;
