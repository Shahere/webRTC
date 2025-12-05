import { Session } from "./Session";

function uidGenerator(): String {
  var S4 = function () {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  return (
    S4() +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    "-" +
    S4() +
    S4() +
    S4()
  );
}

let userId: undefined | string = undefined;
function setUserId(newId: string) {
  userId = newId;
}
function getId() {
  return userId;
}

let currentSession: Session | undefined = undefined;
function setCurrentSession(newSession: undefined | Session) {
  currentSession = newSession;
}
function getCurrentSession() {
  return currentSession;
}

interface ContactInfo {
  id: string;
  name: string;
}

export { ContactInfo };
export { setCurrentSession };
export { getCurrentSession };
export { setUserId };
export { getId };
export { uidGenerator };
