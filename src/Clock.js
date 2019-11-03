class ClocK {
  constructor(rate, newTimeCallback) {
    this.time = 0;
    this.rate = rate;
    this.correction = true;
    this.newTimeCallback = newTimeCallback;
  }

  setAudio(audio) {
    this.audio = audio;
    console.log(this.audio);
  }

  start() {
    this.timerId = setInterval(() => this.onTick(), this.rate * 1000);
  }

  pause() {
    clearInterval(this.timerId);
    this.timerId = 0;
  }

  reset() {
    this.pause();
    this.time = 0;
  }

  // not sure if it is necessary
  setTime(value) {
    this.time = value * 1000;
  }

  onTick() {
    //this.time += this.rate * 1000;
    if (this.correction) {
      this.time = this.audio.currentTime * 1000;
    } else {
      this.time += this.rate * 1000;
    }
    this.newTimeCallback(this.time);
  }
}

export default ClocK;
