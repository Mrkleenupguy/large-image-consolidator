import React from 'react';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { results: null };
    
    this.searchImages = this.searchImages.bind(this);
    this.handleSubmitClick = this.handleSubmitClick.bind(this);
  }

  searchImages(searchValue = 'mars') {
    fetch('https://images-api.nasa.gov/search?q=' + searchValue)
      .then((response) => {
        console.log(response.status);
        if (response.status >= 200 && response.status < 300) {
          return response.json();
        } else {
          var error = new Error(response.statusText);
          error.response = response;
          throw error;
        }
      })
      .then((jsonData) => {
        var {collection} = jsonData;
        var {items} = collection;
        var results = items.map(item => ({src: item.links[0].href, desc: item.data[0].description}));
        this.setState({results});
      }).catch((error) => {
        console.log('Something went wrong', error);
      });
  }

  handleSubmitClick() {
    let searchValue = document.getElementById('searchInput').value;
    if(searchValue !== '') {
      this.searchImages(searchValue);
    } else {
      this.searchImages();
    }
  }

  imageList(items) {
    return (
      <div id="imageGrid">
        {items.map((item, index) => <img className="cardThumbnail" src={item.src} key={index} />)}
      </div>
      );
  }

  render() {
    return (
      <div className="App">
        <h1>Large Image Consolidator</h1>
        <input type="text" id="searchInput" placeholder="mars"></input>
        <button id="searchSubmit" onClick={this.handleSubmitClick}>
          Search
        </button>
        <br/>
        {this.state.results ? this.imageList(this.state.results) : <div></div>}
      </div>
    );
  }
}

export default App;