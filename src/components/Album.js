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
      currentTime: 0, // sets the initial state for the time control
      duration: album.songs[0].duration,
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

//method to play next song when users clicks - this method is passed to PlayerBar below, and then is assigned as event handler in the PlayerBar component.
handleNexClick() {
  const currentIndex = this.state.album.songs.findIndex(song => this.state.currentSong === song);
  const newIndex = Math.min(this.state.album.songs.length - 1, currentIndex + 1); // calculates new index by adding one. Use Math.min and length-1s, so index doesn't go beyond the last song (you can only click next on second to last song)
  const newSong =  this.state.album.songs[newIndex];
  this.setSong(newSong);
  this.play();
}

// Udates seek bar on playback by using events triggered by the audio element
componentDidMount() { // This method is called by React when a component has been added to the DOM (i.e. handleVolumeChange)via events or API calls. * This method was updated to remove an event listener, so that it doesn't keep executing callback.
  this.eventListeners = { // <- This is done by storing the callbacks via keyword `this`.
    timeupdate: e => {
      this.setState({ currentTime: this.audioElement.currentTime });
    },
    durationchange: e => {
      this.setState({ duration: this.audioElement.duration });
    },
    volumechange: e => {
      this.setState({ volume: this.audioElement.volume}); // volumechange callback
    }
  };
  this.audioElement.addEventListener('timeupdate', this.eventListeners.timeupdate);
  this.audioElement.addEventListener('durationchange', this.eventListeners.durationchange);
  this.audioElement.addEventListener('volumechange', this.eventListeners.volumechange);
}

componentWillUnmount() {   /// Prevents  event listeners from spawning errors, so set this.audioElement.src to null - this tells the HTML5 web audio API to terminate playback if user leaves the page otherwise it could keep running.
  this.audioElement.src = null;
  this.audioElement.removeEventListener('timeupdate', this.eventListeners.timeupdate); // terminates timeupdate eventListeners
  this.audioElement.removeEventListener('durationchange', this.eventListeners.durationchange); // terminates durationchange eventListeners
  this.audioElement.removeEventListener('volumechange', this.eventListeners.volumechange); // terminates volumechange eventListeners
}


handleTimeChange(e) { // new method to handle time change by user on the slider. Accepts event data.
  const newTime = this.audioElement.duration * e.target.value; // Calculates new time in the song by multiplying duration by value of range input from user.
  this.audioElement.currentTime = newTime; // Updates audioElement's currentTime to a `newTime`.
  this.setState({ currentTime: newTime }); // Updates current time to new time.
}

handleVolumeChange(e) { // new method to handle volume change by user on the volume slider. Accepts event data.
  console.log('handle change called')
  const newVolume = e.target.value; // Calculates the new volume in the song by value of range input from user.
  this.audioElement.volume = newVolume; // Updates audioElement's volume to a `newVolume`
  this.setState({ volume: newVolume}); // Updates new volume levels.
}


formatTime(newTimeFormat){
  const min = Math.floor(newTimeFormat / 60);
  const sec = parseInt(newTimeFormat % 60);
  if (sec < 10) {
    return "0:0" + sec;
  } else if (isNaN(min || sec)) {
    return "-:--";
  } else {
    return min + ":" + sec;
  }
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
                <td className="song-duration">{Math.floor(song.duration / 60) + ":" + parseInt(song.duration  % 60)} </td>
              </tr>
            )}
          </tbody>
        </table>
        <PlayerBar
          isPlaying={this.state.isPlaying}
          currentSong={this.state.currentSong}
          currentTime={this.audioElement.currentTime} // Pass the inital state from the Album to PlayerBar so that it can re-renders when time or duration change.
          duration={this.audioElement.duration}
          volume={this.audioElement.volume}
          handleSongClick={() => this.handleSongClick(this.state.currentSong)}
          handlePrevClick={() => this.handlePrevClick()}
          handleNexClick={() => this.handleNexClick()}
          handleTimeChange={(e) => this.handleTimeChange(e)}
          handleVolumeChange={(e) => this.handleVolumeChange(e)}
          formatTime={(e) => this.formatTime(e)}
        />
      </section>
    );
  }
}

export default Album;
