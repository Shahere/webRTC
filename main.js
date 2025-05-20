let localStream;
let remoteStream = [];
let videoDOM = document.getElementById("videos");
let localStreamDOM = document.getElementById("user-1");

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

  localStream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, localStream);
  });

  peerConnection.ontrack = (event) => {
    let newMediaStream = new MediaStream();
    let newVideoDOM = document.createElement("video");
    newVideoDOM.autoplay = true;
    newVideoDOM.className = "video-player";
    //console.log("onTrack event");
    event.streams[0].getTracks().forEach((track) => {
      newMediaStream.addTrack(track);
    });

    newVideoDOM.srcObject = newMediaStream;
    remoteStream.push(newMediaStream);
    videoDOM.appendChild(newVideoDOM);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("message", {
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
    payload: {
      action: "offer",
      sdp: offer,
    },
  });
};

// Socket stuff

socket.on("message", async ({ from, target, payload }) => {
  if (payload.action === "offer") {
    console.log(payload.socketID);
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
    console.log(payload.socketID);
    await peerConnection.setRemoteDescription(
      new RTCSessionDescription(payload.sdp)
    );
  }

  if (payload.action === "ice") {
    await peerConnection.addIceCandidate(payload.candidate);
  }

  if (payload.action == "close") {
    console.log(payload);
    console.log(payload.disconnect + " as left the conversation");
  }
});

socket.on("connect", () => {
  console.log("Connected to signaling server");
  init();
});
