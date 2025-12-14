import { Stream } from "./Stream";

export class DeviceManager {
  private static _instance: DeviceManager;

  currentAudioInput?: string;
  currentVideoInput?: string;
  currentAudioOutput?: string;

  private constructor() {
    this.setListeners();
  }

  public static createInstance(): DeviceManager {
    if (!DeviceManager._instance) {
      DeviceManager._instance = new DeviceManager();
    }

    return DeviceManager._instance;
  }

  async getAvailableDevices(): Promise<MediaDeviceInfo[]> {
    await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    return await navigator.mediaDevices.enumerateDevices();
  }

  getCurrentDevices() {
    return {
      audioInput: this.currentAudioInput,
      videoInput: this.currentVideoInput,
      audioOutput: this.currentAudioOutput,
    };
  }

  private setListeners() {
    navigator.mediaDevices.addEventListener("devicechange", (event) => {
      console.warn("Device change");
    });
  }
}
