import { uidGenerator, getId } from "./utils";

class Stream {
  mediastream: MediaStream;
  domElement: undefined | HTMLVideoElement;
  ownerId: string;
  ownerName: string;
  id: String;

  /**
   *
   * @param mediastream
   * @param owner "" => ourself, id instead
   */
  constructor(mediastream: MediaStream, ownerId: string, ownerName: string) {
    this.mediastream = mediastream;
    this.ownerId = ownerId;
    this.ownerName = ownerName;
    this.id = ownerId + "_usermedia";
  }

  static async getCamera(video: boolean, audio: boolean): Promise<Stream> {
    let mediastream = await navigator.mediaDevices.getUserMedia({
      video: video,
      audio: audio,
    });
    let newStream = new Stream(mediastream, "", "");
    return newStream;
  }
  static getScreen() {}

  attachToElement(domElement: HTMLVideoElement): void {
    this.domElement = domElement;
    domElement.srcObject = this.mediastream;
  }

  detachToElement(): void {
    if (!this.domElement) return;
    this.domElement.srcObject = null;
  }

  muteAudio(): void {
    this.mediastream.getAudioTracks()[0].enabled = false;
  }

  unmuteAudio(): void {
    this.mediastream.getAudioTracks()[0].enabled = true;
  }
}

export { Stream };
