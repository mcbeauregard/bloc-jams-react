import React, { Component } from 'react';
import albumData from './../data/albums';

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
      isHovering: false,
    };

    this.audioElement = document.createElement('audio'); // audio element: not assigning to state so it doesn't re-render. Need to access the audio element from within class methods, however, so we assign it to this.
    this.audioElement.src = album.songs[0].audioSrc; // play the first song source. Song list is accessbile from album.song

    this.handleMouseHover = this.handleMouseHover.bind(this);
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

 handleMouseHover() {
   this.setState(this.toggleHoverState);
 }

 toggleHoverState(state) {
   return {
     isHovering: !state.isHovering,
   };
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
              <tr className="song" key={index} onClick={() => this.handleSongClick(song)}>
                    <button id="icon-play-pause" onMouseEnter={this.handleMouseHover} onMouseLeave={this.handleMouseHover} >
                    {this.state.isHovering &&
                      <div>
                     <span className="song-number">{index + 1}</span></div>}
                     <span className="ion-play"></span>
                     <span className="ion-pause"></span>
                   </button>
                    <td id="song-title" >{song.title}</td>
                    <td id="song-duration">{Math.floor(song.duration / 60) + ":" + parseInt(song.duration  % 60) + " seconds" } </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    );
  }
}

export default Album;
