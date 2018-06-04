import React, { Component } from 'react';
import albumData from './../data/albums';
import './Album.css';
import PlayerBar from './PlayerBar';

class Album extends Component {
    constructor(props) {
    super(props);

    const album = albumData.find( album => {
      return album.slug === this.props.match.params.slug
    });

    console.log("Looked for album matching '" + this.props.match.params.slug + "', found: " + JSON.stringify(album));

    this.state = {
      album: album,
      currentSong: album.songs[0],
      isPlaying: false,
      hovering: false,
    };

    this.audioElement = document.createElement('audio'); // audio element: not assigning to state so it doesn't re-render. Need to access the audio element from within class methods, however, so we assign it to this.
    this.audioElement.src = album.songs[0].audioSrc; // play the first song source. Song list is accessbile from album.song
  }

  play() { // metod that plays an audio file
    this.audioElement.play(); // tells audio element to play song
    this.setState({ isPlaying: true }); // state of isPlaying is true so song is playing
  }

   pause() {
     this.audioElement.pause(); // tells audio element to pause song
     this.setState({ isPlaying: false }); // state of isPlaying is false so song has stopped
   }


  setSong(song) { // recieves song
   this.audioElement.src = song.audioSrc; // song is recieved and updates this.audioElement.src with the new song source
   this.setState({ currentSong: song }); // song is recieved and updates this.state.currentSong
 }

 handleSongClick(song) {
   const isSameSong = this.state.currentSong === song; // Event: when a song is clicked, this variable returns true if a user clicks on the current song, and false if otherwise.
   if (this.state.isPlaying && isSameSong) { // if this.state.isPlaying and isSameSong are true, pause song, if not play song.
     this.pause();
   } else {
   if (!isSameSong) { this.setSong(song); } // if another song is clicked, on click new song should play.
     this.play();
   }
 }

mouseEnter = () => {
  this.setState({ hovering: true });
  console.log('enter');
}

mouseLeave = () => {
  this.setState({ hovering: false });
  console.log('leave');
}

//method to play previous song when users clicks - this method is passed to PlayerBar below, and then is assigned as event handler in the PlayerBar component.
handlePrevClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song); // finds index of first song
  const newIndex = Math.max(0, currentIndex - 1); // calculates new index by subtracting one. Use Math.Max to ensure index doesn't go below 0
  const newSong = this.state.album.songs[newIndex]; // Finds song with new index
  this.setSong(newSong); // song with new index
  this.play(); // plays new song
}

  render() {
    return (
      <section className="album">
        <section id="album-info">
          <img id="album-cover-art" src={this.state.album.albumCover} alt={this.state.album.title}/>
          <div className="album-details">
            <h1 id="album-title">{this.state.album.title}</h1>
            <h2 className="artist">{this.state.album.artist}</h2>
            <div id="release-info">{this.state.album.releaseInfo}</div>
          </div>
        </section>
        <table id="song-list">
          <colgroup>
            <col id="song-number-column" />
            <col id="song-title-column" />
            <col id="song-duration-column" />
          </colgroup>
          <tbody>
          {this.state.album.songs.map( (song, index) =>
            <tr className="song" key={index} onClick={() => this.handleSongClick(song, index)}>
                <td className={this.state.isPlaying && this.state.currentSong === this.state.album.songs[index]
                    ? "song-playing" : "not-playing"}>
                  <button>
                    <span className="ion-play"></span>
                    <span className="ion-pause"></span>
                    <span className="song-number">{index+1}</span>
                  </button>
                </td>
                <td className="song-title" >{song.title}</td>
                <td className="song-duration">{Math.floor(song.duration / 60) + ":" + parseInt(song.duration  % 60) + " seconds" } </td>
              </tr>
            )}
          </tbody>
        </table>
        <PlayerBar isPlaying={this.state.isPlaying} currentSong={this.state.currentSong} />
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
        />
      </section>
    );
  }
}

export default Album;
