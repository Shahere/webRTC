let localStream;
let localStreamDOM = document.getElementById("user-1");
let remoteStream;
let remoteStreamDOM = document.getElementById("user-2");

const socket = io("http://localhost:3030");

//WEBRTC
let peerConnection;
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

  remoteStream = new MediaStream();
  remoteStreamDOM.srcObject = remoteStream;

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    console.log("onTrack event");
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("message", {
        from: "peerId123",
        payload: {
          action: "ice",
          candidate: event.candidate,
        },
      });
    }
  };

  let offer = await peerConnection.createOffer();
  await peerConnection.setLocalDescription(offer); //trigger onicecandidate
  //console.log("Offer :", offer);
  console.log("Sending offer !");
  socket.emit("message", {
    from: "peerId123",
    payload: {
      action: "offer",
      sdp: offer,
    },
  });
};

// Socket stuff

socket.on("message", async ({ from, target, payload }) => {
  if (payload.action === "offer") {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.sdp)
    );
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);

    socket.emit("message", {
      from: "peerId456",
      target: from,
      payload: {
        action: "answer",
        sdp: peerConnection.localDescription,
      },
    });
  }

  if (payload.action === "answer") {
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.sdp)
    );
  }

  if (payload.action === "ice") {
    await peerConnection.addIceCandidate(payload.candidate);
  }
});

socket.on("connect", () => {
  console.log("Connected to signaling server");
  init();
});
