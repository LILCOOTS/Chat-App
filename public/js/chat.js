const socket = io();

const input = document.getElementById("msg");
const form = document.getElementById("form");
const locBtn = document.getElementById("locBtn");
const messageArea = document.getElementById("message-area");
const sidebar = document.getElementById("sidebar");

const messageTemplate = document.getElementById("message-template").innerHTML; //mustache library will use this as a template
const locationTemplate = document.getElementById("location-template").innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;
const systemTemplate = document.getElementById("system-template").innerHTML;
const myMessageTemplate = document.getElementById(
  "my-message-template",
).innerHTML;

const { userName, roomName } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const autoscroll = () => {
  // New message element
  const $newMessage = messageArea.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = messageArea.offsetHeight;

  // Height of messages container
  const containerHeight = messageArea.scrollHeight;

  // How far have I scrolled?
  const scrollOffset = messageArea.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messageArea.scrollTop = messageArea.scrollHeight;
  }
};

socket.on("systemMsg", (msg) => {
  const html = Mustache.render(systemTemplate, {
    message: msg,
  });
  messageArea.insertAdjacentHTML("beforeend", html);
});

socket.on("message", (msg) => {
  const html = Mustache.render(messageTemplate, {
    userName: msg.userName,
    message: msg.msg,
    time: moment(msg.time).format("kk:mm"),
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("myMessage", (msg) => {
  const html = Mustache.render(myMessageTemplate, {
    userName: msg.userName,
    message: msg.msg,
    time: moment(msg.time).format("kk:mm"),
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("messageLocation", (loc) => {
  const html = Mustache.render(locationTemplate, {
    userName: loc.userName,
    location: loc.loc,
    time: moment(loc.time).format("kk:mm"),
  });
  messageArea.insertAdjacentHTML("beforeend", html);
  autoscroll();
});

socket.on("joinUser", (userList) => {
  const html = Mustache.render(sidebarTemplate, {
    roomName,
    users: userList[`${roomName}`],
  });
  sidebar.innerHTML = html;
  console.log(userList[`${roomName}`]);
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
