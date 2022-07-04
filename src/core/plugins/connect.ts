import { io } from "socket.io-client";

class SocketioService {
  socket;
  options = {};
  uniqueId = null;
  constructor() {
    this.connectFirst();
  }
  connectFirst() {
    this.socket = io(process.env.VUE_APP_SOCKET_ENDPOINT);
  }
  setupSocketConnection() {
    this.socket.on("streamEnd", () => {
      console.warn("LIVE has ended!");
      this.uniqueId = null;
    });
    this.socket.on("tiktokDisconnected", (errMsg) => {
      console.warn(errMsg);
      if (errMsg && errMsg.includes("LIVE has ended")) {
        this.uniqueId = null;
      }
    });
  }
  disconnect() {
    this.socket.close();
    console.log("this.socket disconnect");
  }
  connect(uniqueId, options) {
    this.uniqueId = uniqueId;
    this.options = options || {};
    if (this.socket.close === true) {
      this.connectFirst();
    }
    this.setUniqueId();

    return new Promise((resolve, reject) => {
      this.socket.once("tiktokConnected", resolve);
      this.socket.once("tiktokDisconnected", reject);

      setTimeout(() => {
        reject("Connection Timeout");
      }, 15000);
    });
  }

  setUniqueId() {
    this.socket.emit("setUniqueId", this.uniqueId, this.options);
  }

  getUserLists() {
    this.socket.emit("getUserLists", {}, this.options);
  }
  userLists(data) {
    this.socket.emit("commentLists", data, this.options);
  }
  on(eventName, eventHandler) {
    this.socket.on(eventName, eventHandler);
  }
}

export default new SocketioService();
