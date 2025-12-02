import { SocketInteraction } from "./core/SocketInteraction";

const socketInteraction = new SocketInteraction();
socketInteraction.init();

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

export { setUserId };
export { getId };
export { socketInteraction };
export { uidGenerator };
