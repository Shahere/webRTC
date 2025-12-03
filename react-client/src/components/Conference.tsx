import { useContext, useEffect, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../App";
import { Conference, Stream } from "meetmesavinien";
import { StreamDrawer } from "./conference/StreamDrawer";

export interface iStreamsDrawerProps {
  streams: Stream[];
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
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
    conference.addEventListener("peopleLeave", peopleLeave);
  }

  useEffect(() => {
    console.log(streams);
  }, [streams]);

  function newstream(e: any) {
    setStreams([e.detail.stream, ...streams]);
  }

  function peopleLeave(e: any) {
    console.log(e.detail.leaveId);
    setStreams((prev) => {
      return prev.filter((item) => {
        return item.owner !== e.detail.leaveId;
      });
    });
  }

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <StreamDrawer streams={streams} setStreams={setStreams}></StreamDrawer>
    </div>
  );
}
