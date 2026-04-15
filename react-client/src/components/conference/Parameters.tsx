import { DeviceManager } from "mitmi";
import { useContext, useEffect, useState } from "react";
import { iConferenceContext, iConferenceParameters } from "../../interfaces";
import { ConferenceContext } from "../../App";
import CrossButton from "../buttons/cross";

export function Parameters({
  openParameters,
  setOpenParameters,
}: iConferenceParameters) {
  const [audioInput, setAudioInput] = useState<MediaDeviceInfo[]>([]);
  const [videoInput, setVideoInput] = useState<MediaDeviceInfo[]>([]);
  const [deviceManager, setDeviceManager] = useState<DeviceManager>();
  const { useWindowDimensions, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  useEffect(() => {
    const deviceManager = DeviceManager.createInstance();
    setDeviceManager(deviceManager);

    deviceManager.getAvailableDevices("audioinput").then((audioDevices) => {
      setAudioInput(audioDevices);
    });
    deviceManager.getAvailableDevices("videoinput").then((videoDevices) => {
      setVideoInput(videoDevices);
    });
  }, []);

  async function changeAudioInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDevice = audioInput[Number(e.target.value)];
    if (!deviceManager) return;
    const newStream = await deviceManager.changeAudioDevice(selectedDevice);
    setStream(newStream);
    setOpenParameters(false);
  }

  async function changeVideoInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDevice = videoInput[Number(e.target.value)];
    if (!deviceManager) return;
    const newStream = await deviceManager.changeVideoDevice(selectedDevice);
    setStream(newStream);
    setOpenParameters(false);
  }

  async function closeParameters(e: any) {
    setOpenParameters(false);
  }

  return (
    <div
      className={`z-[99999] h-screen ${useWindowDimensions().width > 500 ? "w-[30%]" : "w-[100%]"} absolute ${useWindowDimensions().width > 500 ? (openParameters ? "right-0" : "right-[-30%]") : openParameters ? "right-0" : "right-[-100%]"} top-0 bg-gray-800 flex justify-center transition-all`}
    >
      {useWindowDimensions().width < 500 && (
        <div className="absolute top-[2%] right-[2%]">
          <CrossButton onClick={closeParameters}></CrossButton>
        </div>
      )}
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
