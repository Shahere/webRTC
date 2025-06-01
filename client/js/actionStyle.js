//Buttons and all that...

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
