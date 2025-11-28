import { socketInteraction } from "./utils";

class Conference {
  name: string;
  constructor(name: string) {
    this.name = name;
  }

  join() {
    socketInteraction.register();
  }
  leave() {}
  getMembers() {}
}

export { Conference };
