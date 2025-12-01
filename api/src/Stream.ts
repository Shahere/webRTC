import { uidGenerator } from "./utils";

class Stream {
  mediastream: MediaStream;
  domElement: undefined | HTMLVideoElement;
  id: String;

  constructor(mediastream: MediaStream) {
    this.mediastream = mediastream;
    this.id = uidGenerator();
  }

  static async getCamera(video: boolean, audio: boolean): Promise<Stream> {
    let mediastream = await navigator.mediaDevices.getUserMedia({
      video: video,
      audio: audio,
    });
    let newStream = new Stream(mediastream);
    return newStream;
  }
  static getScreen() {}

  attachToElement(domElement: HTMLVideoElement): void {
    this.domElement = domElement;
    domElement.srcObject = this.mediastream;
  }

  detachToElement() {
    if (!this.domElement) return;
    this.domElement.srcObject = null;
  }
}

export { Stream };
