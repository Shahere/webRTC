let localStream;
let remoteStream = [];
let videoDOM = document.getElementById("videos");
let localStreamDOM = document.getElementById("user-1");

let myUserId = null;

const socket = io("http://localhost:3030");

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
    audio: false,
  });
  localStreamDOM.srcObject = localStream;

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
    await createPeerConnection(payload.from, true);
  }
  if (payload.action === "offer") {
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
    const pc = peerConnections[from];
    if (!pc) {
      console.warn(`Aucune peerConnection trouvée pour ${from}`);
      return;
    }

    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
  }

  if (payload.action === "ice-candidate") {
    const pc = peerConnections[from];
    if (pc && payload.candidate) {
      await pc.addIceCandidate(payload.candidate);
    }
  }

  if (payload.action == "close") {
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

  localStream.getTracks().forEach((track) => pc.addTrack(track, localStream));

  pc.ontrack = (event) => {
    console.log(event);
    stream.addTrack(event.track);
    let videoDOMElement = document.createElement("video");
    videoDOMElement.id = socket.id;
    videoDOMElement.srcObject = event.streams[0];

    videoDOM.appendChild(videoDOMElement);
  };

  pc.onicecandidate = (event) => {
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
        action: "answer",
        sdp: pc.localDescription,
      },
    });
  }
}
