import { Stream } from "./Stream";

export class MediaDeviceManager {
  currentAudioInput?: string;
  currentVideoInput?: string;
  currentAudioOutput?: string;

  private stream: Stream;

  constructor(stream: Stream) {
    this.stream = stream;
  }

  async getAvailableDevices(): Promise<MediaDeviceInfo[]> {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    return navigator.mediaDevices.enumerateDevices();
  }

  getCurrentDevices() {
    return {
      audioInput: this.currentAudioInput,
      videoInput: this.currentVideoInput,
      audioOutput: this.currentAudioOutput,
    };
  }
}
