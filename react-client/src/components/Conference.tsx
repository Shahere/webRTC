import { useContext, useEffect, useRef, useState } from "react";
import { ConferenceContext } from "../App";
import { Conference, Contact, Stream } from "mitmi";
import { StreamDrawer } from "./conference/StreamDrawer";
import { StreamPanel } from "./conference/StreamPanel";
import { Controls } from "./conference/Controls";
import { Session } from "mitmi";
import { iInConference } from "../interfaces";
import { iConferenceContext } from "../interfaces";
import { SelectDisplayConference } from "./conference/SelectDisplayConference";
import LoadConference from "./LoadConference";

export enum DisplayConference {
  Drawer,
  Panel,
}

/**
 *
 * @param props name
 * @returns
 */
export function InConference({ name, leaveConference }: iInConference) {
  const { stream, setStream }: iConferenceContext =
    useContext(ConferenceContext);

  const [streams, setStreams] = useState([stream!]);
  const [session, setSession] = useState<Session | null>(null);
  const [conference, setConference] = useState<Conference | null>(null);
  const [loading, setLoading] = useState(true);
  const [displayConference, setDisplayConference] = useState(
    DisplayConference.Drawer,
  );

  const conferenceRef = useRef<Conference | null>(null);

  useEffect(() => {
    async function init() {
      try {
        const createdSession = await Session.create(name);
        setSession(createdSession);
        const conf = new Conference("test", createdSession);
        setConference(conf);
        conferenceRef.current = conf;
        setLoading(false);
      } catch (err) {
        console.error("Erreur init session/conf", err);
      }
    }

    init();
    const handleUnload = () => {
      if (conferenceRef.current) conferenceRef.current.leave();
    };
    window.addEventListener("beforeunload", handleUnload); //handle window close/tab close

    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      if (conferenceRef.current) conferenceRef.current.leave();
    };
  }, []);

  useEffect(() => {
    if (!conference) return;
    conference.join();
    setListeners(conference);

    console.log("[FRONT] Publish local stream");
    if (stream) {
      conference.publish(stream);
    }

    return () => {
      conference.leave();
    };
  }, [conference]);

  function leaveConferenceAction() {
    if (!conference) return;
    conference.leave();
    leaveConference();
  }

  function publishScreenShare(newScreen: Stream) {
    if (!conference) return;
    conference.publish(newScreen);
  }

  function setListeners(conf: Conference) {
    conf.addEventListener("newstream", newstream);
    conf.addEventListener("newPeople", newPeople);
    conf.addEventListener("peopleLeave", peopleLeave);
  }

  function newPeople(e: any) {
    const newContact = new Contact(e.detail.contact.id, e.detail.contact.name);
    console.log("[FRONT] " + newContact.name + " join the conference !");
    const newStream: Stream = new Stream(
      new MediaStream(),
      newContact.id,
      newContact.name,
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
    console.log("[FRONT] People leave : " + e.detail.name);
    setStreams((prev) => {
      return prev.filter((item) => {
        return item.ownerId !== e.detail.leaveId;
      });
    });
  }

  function displayStreams() {
    if (displayConference === DisplayConference.Drawer) {
      return (
        <StreamDrawer streams={streams} setStreams={setStreams}></StreamDrawer>
      );
    }
    if (displayConference === DisplayConference.Panel) {
      return (
        <StreamPanel streams={streams} setStreams={setStreams}></StreamPanel>
      );
    }
  }

  if (loading) {
    return <LoadConference />;
  }

  return (
    <div className="text-white bg-stone-900 w-full h-full flex justify-center items-center flex-col overflow-x-hidden overflow-y-hidden">
      <Controls
        leaveConference={leaveConferenceAction}
        publishScreenShare={publishScreenShare}
      ></Controls>
      <SelectDisplayConference
        displayConference={displayConference}
        setDisplayConference={setDisplayConference}
      ></SelectDisplayConference>
      {displayStreams()}
    </div>
  );
}
