import { Stream } from "./Stream";
import { socketInteraction } from "./utils";

class Conference {
  name: string;
  id: number;
  constructor(name: string) {
    this.name = name;
    this.id = 2; //TODO change later for a random
    this.setupListener();
  }

  private setupListener() {}

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
}

export { Conference };
