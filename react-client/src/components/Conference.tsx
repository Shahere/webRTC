import { useContext, useEffect, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../App";
import { Conference, Stream } from "meetmesavinien";
import { StreamDrawer } from "./conference/StreamDrawer";

export interface iStreamsDrawerProps {
  streams: Stream[];
}

export function InConference(props: any) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);
  let conference: Conference;
  const [streams, setStreams] = useState([stream!]);

  useEffect(() => {
    conference = new Conference("test");
    conference.publish(stream!);
    conference.join();

    setListeners();
  }, []);

  function setListeners() {
    conference.addEventListener("newstream", newstream);
  }

  function newstream(e: any) {
    setStreams([...streams, e.detail.stream]);
  }

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <h2 className="mb-4 text-4xl font-extrabold leading-none tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
        <StreamDrawer streams={streams}></StreamDrawer>
      </h2>
    </div>
  );
}
