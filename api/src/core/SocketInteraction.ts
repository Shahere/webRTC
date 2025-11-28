import { io, Socket } from "socket.io-client";
import { serverUrl, localServerUrl } from "../constants";
import { Stream } from "../Stream";

class SocketInteraction extends EventTarget {
  socket!: Socket;
  private _userId?: string;
  peerConnections: any = {};
  private _confId?: number;
  publishStream: Stream | undefined;

  async init() {
    this.socket = io(localServerUrl);
    this._confId = undefined;

    return new Promise<void>((resolve, reject) => {
      this.socket.on("connect", () => {
        this._userId = this.socket.id;
        this.setupListeners();
        resolve();
      });

      this.socket.on("error", (err) => {
        reject(err);
      });
    });
  }

  get userId(): string {
    if (!this._userId) throw new Error("User not connected yet");
    return this._userId;
  }

  publish(stream: Stream) {
    this.publishStream = stream;
  }

  register(id: number) {
    console.log("Join id : " + id);
    if (!this.publishStream) {
      throw new Error("call publish first");
    }
    this.socket.emit("message", {
      from: this.userId,
      payload: {
        action: "join",
      },
    });
    this._confId = id;
  }

  unregister() {
    this._confId = undefined;
    this.socket.disconnect();
  }

  private setupListeners() {
    this.socket.on("message", async ({ from, payload }) => {
      if (!this._confId) return;
      if (payload.action === "join") {
        console.log("Join reçu de : " + from);
        await this.createPeerConnection(from, true);
      }
      if (payload.action === "offer") {
        console.log("Offre reçu de : " + from);
        await this.createPeerConnection(from, false);
        await this.peerConnections[from].setRemoteDescription(
          new RTCSessionDescription(payload.sdp)
        );
        const answer = await this.peerConnections[from].createAnswer();
        await this.peerConnections[from].setLocalDescription(answer);

        const event = new CustomEvent("new people");
        this.dispatchEvent(event);
        //nbPeople++;

        this.socket.emit("message", {
          from: this._userId,
          target: from,
          payload: {
            action: "answer",
            sdp: answer,
          },
        });
      }

      if (payload.action === "answer") {
        console.log("Answer reçu de :" + from);
        const pc = this.peerConnections[from];
        if (!pc) {
          console.warn(`Aucune peerConnection trouvée pour ${from}`);
          return;
        }

        const event = new CustomEvent("new people");
        this.dispatchEvent(event);
        //nbPeople++;

        await pc.setRemoteDescription(new RTCSessionDescription(payload.sdp));
      }

      if (payload.action === "ice") {
        console.log("Ice candidate reçu de : " + from);
        const pc = this.peerConnections[from];
        if (pc && payload.candidate) {
          await pc.addIceCandidate(payload.candidate);
        }
      }

      if (payload.action == "close") {
        let userId = payload.disconnect;
        console.log(userId + " has disconnect, reason : " + payload.message);
        //TODO Clean the user
        this.peerConnections[userId] = null;
        /*let videoToDelete = document.getElementById("video-" + userId);
        videoToDelete.remove();
        streamList = streamList.filter((id) => id !== userId);*/

        const event = new CustomEvent("people leave");
        this.dispatchEvent(event);
        //nbPeople--;
      }
    });
  }

  private async createPeerConnection(
    remoteUserId: string,
    isInitiator: boolean
  ) {
    if (this.peerConnections[remoteUserId]) return; // Si la peer existe déjà

    const pc = new RTCPeerConnection();
    this.peerConnections[remoteUserId] = pc;

    // ajouter un flux à la peer
    /*
    localStream.getTracks().forEach((track) => {
      pc.addTrack(track, localStream);
    });*/
    this.publishStream?.mediastream.getTracks().forEach((track) => {
      pc.addTrack(track, this.publishStream!.mediastream);
    });

    pc.ontrack = (event) => {
      console.log("ONTRACK");
      /*
      if (!streamList.includes(remoteUserId)) {
        streamList.push(remoteUserId);
        createDOMVideoElement(videoDOM, remoteUserId, event.streams[0]);
      }*/
      const newevent = new CustomEvent("stream", {
        detail: {
          stream: new Stream(event.streams[0]),
        },
      });
      this.dispatchEvent(newevent);
    };

    pc.onicecandidate = (event) => {
      console.log("oncandidate", pc.iceConnectionState);
      if (event.candidate) {
        this.socket.emit("message", {
          from: this._userId,
          target: remoteUserId,
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
      this.socket.emit("message", {
        from: this._userId,
        target: remoteUserId,
        payload: {
          action: "offer",
          sdp: pc.localDescription,
        },
      });
    }
  }
}

export { SocketInteraction };
