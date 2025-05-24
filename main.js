let localStream;
let remoteStream = [];
let videoDOM = document.getElementById("videos");
let localStreamDOM = document.getElementById("user-1");

let myUserId = null;

const socket = io("http://localhost:3030");

//WEBRTC
let peerConnection = {};
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

  createOffer();
};

let createOffer = async () => {
  peerConnection = new RTCPeerConnection(servers);

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer); //trigger onicecandidate
  //console.log("Offer :", offer);
  console.log("Sending offer !");
  socket.emit("message", {
    from: myUserId,
    payload: {
      action: "offer",
      sdp: offer,
    },
  });
};

// Socket stuff

socket.on("message", async ({ from, payload }) => {
  console.log(from);
  if (payload.action === "offer") {
    const pc = new RTCPeerConnection();
    peerConnection[from] = pc;

    const stream = new MediaStream();
    mediaStream[from] = stream;

    pc.ontrack = (event) => {
      stream.addTrack(event.track);
      console.log("New track !");
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

    await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
    const answer = await pc.createAnswer();
    await pc.setLocalDescription(answer);

    socket.emit("message", {
      from: myUserId,
      target: from,
      payload: {
        action: "answer",
        sdp: pc.localDescription,
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
