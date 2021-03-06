import React from 'react';
import '../index.css'
import './Landing.css';

const Landing = () => (
  <section className="landing">
    <div>
      <h1 className="app-title">Bloc Jams</h1>
    </div>
    <h1 className="hero-title">Turn the music up!</h1>
    <section className="selling-points">
      <div className="selling-points-left">
      <div className="point">
       <h2 className="point-title">Choose your music</h2>
       <p className="point-description">The world is full of music; why should you have to listen to music that someone else chose?</p>
      </div>
      <div className="point">
       <h2 className="point-title">Unlimited, streaming, ad-free</h2>
       <p className="point-description">No arbitrary limits. No distractions.</p>
      </div>
      <div className="point">
       <h2 className="point-title">Mobile enabled</h2>
       <p className="point-description">Listen to your music on the go. This streaming service is available on all mobile platforms.</p>
      </div>
      </div>
      <div className="selling-points-right">
        <img className="album-covers-01" src='./../assets/images/album_covers/01.jpg' alt='album cover'/>
        <img className="album-covers-02" src='./../assets/images/album_covers/02.jpg' alt='album cover'/>
        <img className="album-covers-03" src='./../assets/images/album_covers/03.jpg' alt='album cover'/>
        <img className="album-covers-04" src='./../assets/images/album_covers/04.jpg' alt='album cover'/>
      </div>
    </section>
  </section>
);

export default Landing;
