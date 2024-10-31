const msgInfo = (msg, userName) => {
  return {
    userName,
    msg,
    time: new Date().getTime(),
  };
};

const locInfo = (lat, long, userName) => {
  return {
    userName,
    loc: `https://google.com/maps?q=${lat},${long}`,
    time: new Date().getTime(),
  };
};

module.exports = {
  msgInfo,
  locInfo,
};
