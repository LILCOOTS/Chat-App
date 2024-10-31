const socket = io();

const input = document.getElementById("msg");
const form = document.getElementById("form");
const locBtn = document.getElementById("locBtn");
const messageArea = document.getElementById("message-area");

const messageTemplate = document.getElementById("message-template").innerHTML; //mustache library will use this as a template
const locationTemplate = document.getElementById("location-template").innerHTML;

const { userName, roomName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log(userName, roomName);

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    message: msg.msg,
    time: moment(msg.time).format("kk:mm"),
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  console.log(msg);
});

socket.on("messageLocation", (loc) => {
  const html = Mustache.render(locationTemplate, {
    location: loc.loc,
    time: moment(loc.time).format("kk:mm"),
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  console.log(loc);
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const value = input.value;
  if (value) {
    socket.emit("sendMsg", { value, userName, roomName }, (confirmation) => {
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
      socket.emit(
        "sendLocation",
        { loc, userName, roomName },
        (confirmation) => {
          console.log(confirmation);
          locBtn.removeAttribute("disabled");
        },
      );
    });
  }
});

socket.emit("roomJoin", { userName, roomName });

//                          COUNTER
// socket.on("countStatus", (count, id) => {
//   console.log("Count : " + count + " by " + id);
// });
//
// document.getElementById("click").addEventListener("click", () => {
//   socket.emit("updateCount", socket.id);
// });
