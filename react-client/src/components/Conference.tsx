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
      <StreamDrawer streams={streams}></StreamDrawer>
    </div>
  );
}
