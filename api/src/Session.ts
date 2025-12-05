import { Contact } from "./Contact";
import { Conference } from "./Conference";
import { SocketInteraction } from "./core/SocketInteraction";
import { setCurrentSession } from "./utils";

class Session {
  name: string;
  socketInteraction: SocketInteraction;
  contact?: Contact;
  private static session: Session;
  private static initializing?: Promise<Session>;

  private constructor(name: string) {
    this.name = name;
    this.socketInteraction = new SocketInteraction();
    this.contact = undefined;
  }

  static async create(name: string): Promise<Session> {
    console.warn("helo1");
    if (Session.session && Session.session.contact) {
      console.warn("all good");

      setCurrentSession(Session.session);
      return Session.session;
    }

    if (Session.initializing) {
      console.warn("init en cours");

      return await Session.initializing;
    }

    Session.initializing = (async () => {
      console.warn("first time");

      const session = new Session(name);
      Session.session = session;

      console.warn("init");

      const socketId = await session.socketInteraction.init();
      session.contact = new Contact(socketId, name);

      setCurrentSession(session);
      Session.initializing = undefined;

      return session;
    })();

    return await Session.initializing;
  }
}

export { Session };
