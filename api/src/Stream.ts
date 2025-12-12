import { Conference } from "./Conference";
import { uidGenerator, getId } from "./utils";

export interface StreamParams {
  audio: boolean;
  video: boolean;
}

class Stream {
  mediastream: MediaStream;
  domElement: undefined | HTMLVideoElement;
  ownerId: string;
  ownerName: string;
  id: String;
  //If undefined, its a localstream otherwise the stream is publish
  conferencePublish?: Conference;
  params: StreamParams;

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
    this.params = { audio: true, video: false };
    this.setListeners();
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

  /**
   * If the stream is published (so its yours) :
   *  - video will be disabled for everyone
   * If the stream is not published (its yours but not publish, or other ppl stream):
   *  - video will be disabled for you only
   */
  muteVideo() {
    this.params.video = false;
    if (this.conferencePublish) {
      //your publish stream
      this.conferencePublish.session.socketInteraction.setConstraint(this);
    }
    this.mediastream.getVideoTracks()[0].enabled = false;
  }

  unmuteVideo() {
    this.params.video = true;
    if (this.conferencePublish) {
      //your publish stream
      this.conferencePublish.session.socketInteraction.setConstraint(this);
    }
    this.mediastream.getVideoTracks()[0].enabled = true;
  }

  muteAudio(): void {
    this.params.audio = false;
    if (this.conferencePublish) {
      this.conferencePublish.session.socketInteraction.setConstraint(this);
    }
    this.mediastream.getAudioTracks()[0].enabled = false;
  }

  unmuteAudio(): void {
    this.mediastream.getAudioTracks()[0].enabled = true;
  }

  private setListeners() {
    console.warn("ready to mute");
    this.mediastream.getVideoTracks().forEach((track) => {
      track.addEventListener("mute", () => {
        console.warn("MUTE");
      });
    });
  }
}

export { Stream };
