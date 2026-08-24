import { DeviceManager, Stream } from "mitmi";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ConferenceContext } from "../App";
import { iPreviewScreen } from "../interfaces";
import { iConferenceContext } from "../interfaces";

/**
 *
 * @param props joinConference,
 * @returns
 */
export function PreviewScreen({
  name,
  setName,
  hub,
  setHub,
  joinConference,
}: iPreviewScreen) {
  const localStreamRef = useRef<HTMLVideoElement>(null);
  const errorNoStreamRef = useRef<HTMLDivElement>(null);
  const errorNoNameRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
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

    return () => {
      stream.detachToElement();
    };
  }, [stream]);

  async function startLocalStream() {
    if (stream) return;
    let localStreamPre = await Stream.getCamera(true, true);
    setStream(localStreamPre);
    errorNoStreamRef.current!.style.display = "none";
    errorRef.current!.style.display = "none";

    if (localStreamRef.current) {
      localStreamPre.attachToElement(localStreamRef.current);
    }
  }

  function stopLocalStream() {
    if (!stream) return;
    stream.detachToElement();
    setStream(undefined);
  }

  function joinConferenceAction() {
    if (!stream) {
      errorNoStreamRef.current!.style.display = "block";
      errorRef.current!.style.display = "block";
      return;
    }
    if (!name) {
      errorNoNameRef.current!.style.display = "block";
      errorRef.current!.style.display = "block";
      return;
    }
    setStream((prev) => {
      const newLocalStream = prev;
      if (!newLocalStream) return prev;
      newLocalStream.ownerName = name;
      return newLocalStream;
    });
    joinConference();
  }

  function changeName(changeVal: string) {
    errorNoNameRef.current!.style.display = "none";
    errorRef.current!.style.display = "none";
    setName(changeVal);
  }

  function changeHub(changeVal: string) {
    setHub(changeVal);
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
    <div className="text-white bg-stone-900 w-full h-screen pt-10 flex items-center flex-col">
      <div className="w-full flex justify-center">
        <h3 className="mb-4 text-4xl font-extrabold leading-none tracking-tight md:text-5xl lg:text-6xl text-white">
          Mitmi
        </h3>
      </div>

      <div className="w-full h-full flex">
        <div className="bg-red-500 w-[100%]"></div>
        <div className="w-[70%]">
          <div className="flex flex-col h-full justify-center text-center">
            <h4 className="font-bold text-2xl">
              Parler en toute confidentialité
            </h4>
            <p className="p-5">
              Les communications sont chiffrés de bout en bout. Aucune cookies
              sauvegardés sur votre navigateur.
            </p>
            <div className="x-fit">
              <div className="relative h-11 w-[50%] min-w-[200px] left-[50%] translate-x-[-50%] mt-10">
                <input
                  className="peer h-full w-full border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                  placeholder=" "
                />
                <label className="after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-1.5 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-blue-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-blue-500 peer-focus:after:scale-x-100 peer-focus:after:border-blue-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                  Your name
                </label>
              </div>
              <button className="rounded-3xl mt-5 relative inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-base group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-cyan-200 dark:focus:ring-cyan-800">
                <span className="relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                  Join conference
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
