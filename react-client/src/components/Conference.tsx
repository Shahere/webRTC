import { useContext, useEffect, useState } from "react";
import { iConferenceContext, ConferenceContext } from "../App";
import { Conference, Contact, Stream } from "mitmi";
import { StreamDrawer } from "./conference/StreamDrawer";
import { Controls } from "./conference/Controls";
import { Session } from "mitmi";

export interface iStreamsDrawerProps {
  streams: Stream[];
  setStreams: React.Dispatch<React.SetStateAction<Stream[]>>;
}
/**
 *
 * @param props name
 * @returns
 */
export function InConference(props: any) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  const [streams, setStreams] = useState([stream!]);
  const [session, setSession] = useState<Session | null>(null);
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      try {
        const createdSession = await Session.create(props.name);
        setSession(createdSession);
        const conf = new Conference("test", createdSession);
        setConference(conf);
        setLoading(false);
      } catch (err) {
        console.error("Erreur init session/conf", err);
      }
    }

    init();
    return () => {};
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
    const newContact = new Contact(e.detail.contact.id, e.detail.contact.name);
    console.log("[FRONT] " + newContact.name + " join the conversation !");
    const newStream: Stream = new Stream(
      new MediaStream(),
      newContact.id,
      newContact.name
    );
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
        return item.ownerId !== e.detail.leaveId;
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
