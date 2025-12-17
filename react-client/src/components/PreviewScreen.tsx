import { DeviceManager, Stream } from "mitmi";
import React, { useContext, useEffect, useRef, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../App";

/**
 *
 * @param props joinConference,
 * @returns
 */
export function PreviewScreen(props: any) {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const errorNoStreamRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLTextAreaElement>(null);

  const [audioInput, setAudioInput] = useState<MediaDeviceInfo[]>([]);
  const [videoInput, setVideoInput] = useState<MediaDeviceInfo[]>([]);

  const {
    stream,
    setStream,
    deviceManager,
    setDeviceManager,
  }: iConferenceContext = useContext(ConferenceContext);

  useEffect(() => {
    let deviceManager = DeviceManager.createInstance();
    setDeviceManager(deviceManager);
  }, []);

  useEffect(() => {
    if (!stream) return;
    if (!deviceManager) return;
    deviceManager.getAvailableDevices("audioinput").then((audioDevices) => {
      setAudioInput(audioDevices);
    });
    deviceManager.getAvailableDevices("videoinput").then((videoDevices) => {
      setVideoInput(videoDevices);
    });

    stream.attachToElement(localStreamRef.current!);
  }, [stream]);

  async function startLocalStream() {
    if (stream) return;
    let localStreamPre = await Stream.getCamera(true, true);
    setStream(localStreamPre);
    errorNoStreamRef.current!.style.display = "none";

    if (localStreamRef.current) {
      localStreamPre.attachToElement(localStreamRef.current);
    }
  }

  function stopLocalStream() {
    if (!stream) return;
    stream.detachToElement();
    setStream(undefined);
  }

  function joinConference() {
    if (!stream) {
      errorNoStreamRef.current!.style.display = "block";
      return;
    }
    setStream((prev) => {
      const newLocalStream = prev;
      if (!newLocalStream) return prev;
      newLocalStream.ownerName = props.name;
      return newLocalStream;
    });
    props.joinConference();
  }

  async function changeAudioInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDevice = audioInput[Number(e.target.value)];
    if (!deviceManager) return;
    const newStream = await deviceManager.changeAudioDevice(selectedDevice);
    setStream(newStream);
  }

  async function changeVideoInput(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedDevice = videoInput[Number(e.target.value)];
    if (!deviceManager) return;
    const newStream = await deviceManager.changeVideoDevice(selectedDevice);
    setStream(newStream);
  }

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        Preview
      </h2>

      <div className="">
        <div className="flex justify-center">
          <video
            className={`${stream == null ? "size-0" : ""}`}
            autoPlay
            ref={localStreamRef}
          ></video>
        </div>
        <div ref={errorNoStreamRef} className="hidden text-red-800">
          Vous devez avoir une camera pour rejoindre
        </div>
        <div className="flex justify-center space-between mt-[5%]">
          <button
            id="startstream"
            onClick={startLocalStream}
            className="focus:outline-none text-white bg-green-700 hover:bg-green-800 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
          >
            Start stream
          </button>
          <button
            id="stopstream"
            onClick={stopLocalStream}
            className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
          >
            Stop stream
          </button>
        </div>
        <div className="flex justify-center mt-[5%] px-[10%]">
          {audioInput.length > 0 && (
            <select
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              onChange={changeAudioInput}
            >
              {audioInput.map((mediaDeviceInfo, key) => (
                <option key={key} value={key}>
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
                <option value={key}>{mediaDeviceInfo.label}</option>
              ))}
            </select>
          )}
        </div>
        <div className="flex col justify-center p-5 px-[10%]">
          <textarea
            ref={nameRef}
            className="resize-none block p-2.5 w-full h-10 text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Your name"
            onChange={(e) => {
              props.setName(e.target.value);
            }}
          ></textarea>
        </div>
        <div className="flex justify-center">
          <button
            id="stopstream"
            onClick={joinConference}
            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
          >
            Join conférence
          </button>
        </div>
      </div>
    </div>
  );
}
