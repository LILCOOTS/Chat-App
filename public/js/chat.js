const socket = io();

socket.on("message", (msg) => {
  console.log(msg);
});

const input = document.getElementById("msg");
const form = document.getElementById("form");
const locBtn = document.getElementById("locBtn");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("sendMsg", input.value);
  }

  input.value = "";
});

locBtn.addEventListener("click", () => {
  if (!navigator.geolocation) {
    socket.emit("sendMsgSelf");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const loc = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };
      socket.emit("sendLocation", loc);
    });
  }
});

//                          COUNTER
// socket.on("countStatus", (count, id) => {
//   console.log("Count : " + count + " by " + id);
// });
//
// document.getElementById("click").addEventListener("click", () => {
//   socket.emit("updateCount", socket.id);
// });
