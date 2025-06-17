//Buttons and all that...
let btnMute = document.getElementsByClassName("mute")[0];
let btnLeave = document.getElementsByClassName("leave")[0];
let displayEndPage = document.getElementsByClassName("endPage")[0];

function createDOMVideoElement(parent, remoteUserId, mediaStream) {
  const videoElement = document.createElement("video");
  videoElement.id = "video-" + remoteUserId;
  videoElement.autoplay = true;
  videoElement.muted = true;
  videoElement.className = "video-player";

  parent.appendChild(videoElement);

  videoElement.srcObject = mediaStream;

  return videoElement;
}

function changeRoll(nbUser) {
  let videoDOM = document.getElementById("videos");

  if (nbUser >= 2) {
    console.log("More 2");
    videoDOM.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    return;
  }

  console.log("less 2");
  videoDOM.style.backgroundColor = "rgba(0, 0, 0, 0)";
}

btnLeave.addEventListener("click", () => {
  let socket = getSocket();
  socket.disconnect();
  displayEndPage.style.visibility = "visible";
});

btnMute.addEventListener("click", () => {
  let tracks = getLocalTracks();
  tracks.forEach((track) => {
    if (track.kind === "audio") {
      track.enabled = !track.enabled;
    }
  });
});
