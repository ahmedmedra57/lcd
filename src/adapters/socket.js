let socket;

export const initiateSocket = () => {
  const host = window.location.host;
  socket = new WebSocket(`ws://${host}/socket`);

  socket.addEventListener("open", () => {
    localStorage.removeItem("refresh");
    localStorage.removeItem("opened");
    
  });

  socket.addEventListener("error", (e) => {
    localStorage.setItem("refresh", true);
    localStorage.setItem("opened", "false");
  });

  socket.addEventListener("close", (e) => {
    socket.close();
    localStorage.setItem("refresh", true);
    localStorage.setItem("opened", "false");
  });
};

export const disconnectSocket = () => {
  console.log("Disconnecting socket...");
};

export { socket };
