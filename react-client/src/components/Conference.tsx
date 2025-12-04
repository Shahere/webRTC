import { useContext, useEffect, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../App";
import { Conference, Stream } from "mitmi";
import { StreamDrawer } from "./conference/StreamDrawer";
import { Controls } from "./conference/Controls";
import { Session } from "mitmi";

export interface iStreamsDrawerProps {
  streams: Stream[];
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
}

export function InConference(props: any) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  const [streams, setStreams] = useState([stream!]);
  const [session, setSession] = useState<Session | null>(null);
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function init() {
      try {
        const createdSession = await Session.create("Savinien");
        if (!mounted) return;
        setSession(createdSession);
        const conf = new Conference("test");
        setConference(conf);
        setLoading(false);
      } catch (err) {
        console.error("Erreur init session/conf", err);
      }
    }

    init();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!conference) return;
    conference.join();
    setListeners(conference);

    return () => {
      conference.leave();
    };
  }, [conference]);

  function setListeners(conf: Conference) {
    conf.addEventListener("newstream", newstream);
    conf.addEventListener("newPeople", newPeople);
    conf.addEventListener("peopleLeave", peopleLeave);
  }

  useEffect(() => {
    console.log(streams);
  }, [streams]);

  function newPeople(e: any) {
    console.log("[FRONT] New People !");
    const newStream: Stream = new Stream(new MediaStream(), "nwepeople");
    setStreams((oldStreams) => {
      const alreadyExists = oldStreams.some((s) => s.id === newStream.id);
      if (alreadyExists) return oldStreams;

      return [...oldStreams, newStream];
    });
  }

  function newstream(e: any) {
    console.log("[FRONT] New stream !");
    const newStream: Stream = e.detail.stream;
    setStreams((oldStreams) => {
      const alreadyExists = oldStreams.some((s) => s.id === newStream.id);
      if (alreadyExists) return oldStreams;

      return [...oldStreams, newStream];
    });
  }

  function peopleLeave(e: any) {
    console.log("[FRONT] People leave : " + e.detail.leaveId);
    setStreams((prev) => {
      return prev.filter((item) => {
        return item.owner !== e.detail.leaveId;
      });
    });
  }

  if (loading) {
    return <div>Connexion en cours...</div>;
  }

  return (
    <div className="text-white bg-stone-900 w-full h-screen flex justify-center items-center flex-col">
      <Controls></Controls>
      <StreamDrawer streams={streams} setStreams={setStreams}></StreamDrawer>
    </div>
  );
}
