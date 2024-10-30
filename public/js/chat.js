const socket = io();

const input = document.getElementById("msg");
const form = document.getElementById("form");
const locBtn = document.getElementById("locBtn");
const messageArea = document.getElementById("message-area");

const messageTemplate = document.getElementById("message-templates").innerHTML; //mustache library will use this as a template

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    message: msg,
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  console.log(msg);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (input.value) {
    socket.emit("sendMsg", input.value, (confirmation) => {
      console.log(confirmation);
    });
  }

  input.value = "";
  input.focus();
});

locBtn.addEventListener("click", () => {
  locBtn.setAttribute("disabled", "true");

  if (!navigator.geolocation) {
    socket.emit("sendMsgSelf");
  } else {
    navigator.geolocation.getCurrentPosition((position) => {
      const loc = {
        lat: position.coords.latitude,
        long: position.coords.longitude,
      };
      socket.emit("sendLocation", loc, (confirmation) => {
        console.log(confirmation);
        locBtn.removeAttribute("disabled");
      });
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
