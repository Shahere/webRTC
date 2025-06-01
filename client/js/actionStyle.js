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
