import { Contact } from "./Contact";
import { SocketInteraction } from "./core/SocketInteraction";
import { setCurrentSession } from "./utils";

class Session {
  name: string;
  socketInteraction: SocketInteraction;
  contact!: Contact;

  private constructor(name: string) {
    this.name = name;
    this.socketInteraction = new SocketInteraction();
  }

  static async create(name: string): Promise<Session> {
    const session = new Session(name);

    console.warn("init");
    const socketId = await session.socketInteraction.init();
    session.contact = new Contact(socketId, name);
    setCurrentSession(session);

    return session;
  }
}

export { Session };
