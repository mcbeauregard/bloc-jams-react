import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import './App.css';
import Landing from './components/Landing';
import Library from './components/Library';
import Album from './components/Album';

class App extends Component {
  render() {
    return (
      <div className="App">
      <header>
        <div className="topbar">
        <nav>
          <div className="topbar-left">
          <Link className='App-logo' to='/'><img src='./../assets/images/bloc_jams_logo.png'/></Link>
          </div>
          <div className="topbar-right">
          <Link to='/library'>Library</Link>
          </div>
        </nav>
        </div>
        <div class="App-title">
        <h1>Bloc Jams</h1>
        </div>
      </header>
      <main>
        <Route exact path="/" component={Landing} />
        <Route path="/library" component={Library} />
        <Route path="/album/:slug" component={Album} />
      </main>
      </div>
    );
  }
}

export default App;
