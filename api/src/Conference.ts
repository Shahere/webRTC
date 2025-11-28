import { Stream } from "./Stream";
import { socketInteraction } from "./utils";

class Conference extends EventTarget {
  name: string;
  id: number;
  knownStreams: Array<Stream | void>;
  constructor(name: string) {
    super();
    this.name = name;
    this.id = 2; //TODO change later for a random
    this.knownStreams = [];
    this.setupListener();
  }

  private setupListener() {
    socketInteraction.addEventListener("stream", (e) => {
      this.newStream(e);
    });
  }

  publish(stream: Stream) {
    socketInteraction.publish(stream);
  }

  join() {
    socketInteraction.register(this.id);
  }

  leave() {
    socketInteraction.unregister();
  }
  getMembers() {}

  private newStream(e: any) {
    console.warn(this.knownStreams);
    if (this.knownStreams.includes(e.detail.stream)) return;
    this.knownStreams.push(e.detail.stream);
    const newevent = new CustomEvent("newstream", {
      detail: {
        stream: e.detail.stream,
      },
    });
    this.dispatchEvent(newevent);
  }
}

export { Conference };
