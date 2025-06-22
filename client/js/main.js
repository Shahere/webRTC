let localStream;
let nbPeople = 0;
let videoDOM = document.getElementById("videos");
let localStreamDOM = document.getElementById("user-1");
let myUserId = null;
let streamList = [];

let serverUrl = "http://localhost:3030";
serverUrl = "https://signaling.savinienbarbotaud.fr";

const socket = io(serverUrl);

//WEBRTC
let peerConnections = {};
let mediaStream = {};
const servers = {
  iceServers: [
    {
      urls: [
        "stun:stun.l.google.com:19302",
        "stun:stun2.l.google.com:19302",
        "stun:stun4.l.google.com:19302",
      ],
    },
  ],
};

let init = async () => {
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });
  let fullscreenvideo = document.getElementById("user-1");
  fullscreenvideo.srcObject = localStream;
  nbPeople++;
  changeRoll(nbPeople);

  //Se register auprès du serveur :
  socket.emit("message", {
    from: myUserId,
    payload: {
      action: "join",
    },
  });
};

// Socket stuff

socket.on("message", async ({ from, payload }) => {
  if (payload.action === "join") {
    console.log("Join reçu de : " + from);
    await createPeerConnection(from, true);
    nbPeople++;
    changeRoll(nbPeople);
  }
  if (payload.action === "offer") {
    console.log("Offre reçu de : " + from);
    await createPeerConnection(from, false);
    await peerConnections[from].setRemoteDescription(
      new RTCSessionDescription(payload.sdp)
    );
    const answer = await peerConnections[from].createAnswer();
    await peerConnections[from].setLocalDescription(answer);

    socket.emit("message", {
      from: myUserId,
      target: from,
      payload: {
        action: "answer",
        sdp: answer,
      },
    });
  }

  if (payload.action === "answer") {
    console.log("Answer reçu de :" + from);
    const pc = peerConnections[from];
    if (!pc) {
      console.warn(`Aucune peerConnection trouvée pour ${from}`);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
  }

  if (payload.action === "ice") {
    console.log("Ice candidate reçu de : " + from);
    const pc = peerConnections[from];
    if (pc && payload.candidate) {
      await pc.addIceCandidate(payload.candidate);
    }
  }

  if (payload.action == "close") {
    let userId = payload.disconnect;
    console.log(userId + " has disconnect, reason : " + payload.message);
    //TODO Clean the user
    peerConnections[userId] = null;
    let videoToDelete = document.getElementById("video-" + userId);
    videoToDelete.remove();
    streamList = streamList.filter((id) => id !== userId);
    nbPeople--;
    changeRoll(nbPeople);
  }
});

socket.on("connect", () => {
  console.log("Connected to signaling server avec l'id : ", socket.id);
  myUserId = socket.id;

  init();
});

async function createPeerConnection(remoteUserId, isInitiator) {
  if (peerConnections[remoteUserId]) return;

  const pc = new RTCPeerConnection();
  peerConnections[remoteUserId] = pc;

  localStream.getTracks().forEach((track) => {
    pc.addTrack(track, localStream);
  });

  pc.ontrack = (event) => {
    if (!streamList.includes(remoteUserId)) {
      streamList.push(remoteUserId);
      createDOMVideoElement(videoDOM, remoteUserId, event.streams[0]);
    }
  };

  /*pc.oniceconnectionstatechange = (ev) => {
    console.log(ev);
  };*/

  pc.onicecandidate = (event) => {
    console.log("oncandidate", pc.iceConnectionState);
    if (event.candidate) {
      socket.emit("message", {
        from: myUserId,
        payload: {
          action: "ice",
          candidate: event.candidate,
        },
      });
    }
  };

  if (isInitiator) {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("message", {
      from: myUserId,
      target: remoteUserId,
      payload: {
        action: "offer",
        sdp: pc.localDescription,
      },
    });
  }
}

function getLocalTracks() {
  return localStream.getTracks();
}

function getSocket() {
  return socket;
}
