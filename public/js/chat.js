const socket = io();

socket.on("countStatus", (count, id) => {
  console.log("Count : " + count + " by " + id);
});

document.getElementById("click").addEventListener("click", () => {
  socket.emit("updateCount", socket.id);
});
