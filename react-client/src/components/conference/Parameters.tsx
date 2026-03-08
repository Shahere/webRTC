import { DeviceManager } from "mitmi";
import { useEffect, useState } from "react";
import { iConferenceParameters } from "../../interfaces";

export function Parameters({ openParameters }: iConferenceParameters) {
  const [audioInput, setAudioInput] = useState<MediaDeviceInfo[]>([]);
  const [videoInput, setVideoInput] = useState<MediaDeviceInfo[]>([]);

  useEffect(() => {
    const deviceManager = DeviceManager.createInstance();

    deviceManager.getAvailableDevices("audioinput").then((audioDevices) => {
      setAudioInput(audioDevices);
    });
    deviceManager.getAvailableDevices("videoinput").then((videoDevices) => {
      setVideoInput(videoDevices);
    });
  }, []);

  function changeAudioInput(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  function changeVideoInput(e: React.ChangeEvent<HTMLSelectElement>) {
    console.log(e.target.value);
  }

  //TODO Add transition
  return (
    <div
      className={`z-[99999] h-screen w-[30%] absolute ${openParameters ? "right-0" : "right-[-30%]"} top-0 bg-gray-800 flex justify-center transition-all`}
    >
      <div className="mt-[10%] p-[7%]">
        <h1 className="text-4xl font-bold text-heading mb-[7%]">Parameters</h1>
        <div className="flex flex-col gap-5">
          {audioInput.length > 0 && (
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={changeAudioInput}
            >
              {audioInput.map((mediaDeviceInfo, key) => (
                <option key={mediaDeviceInfo.deviceId} value={key}>
                  {mediaDeviceInfo.label}
                </option>
              ))}
            </select>
          )}
          {videoInput.length > 0 && (
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={changeVideoInput}
            >
              {videoInput.map((mediaDeviceInfo, key) => (
                <option key={mediaDeviceInfo.deviceId} value={key}>
                  {mediaDeviceInfo.label}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
}
