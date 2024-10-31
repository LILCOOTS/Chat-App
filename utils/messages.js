const msgInfo = (msg) => {
  return {
    msg,
    time: new Date().getTime(),
  };
};

const locInfo = (lat, long) => {
  return {
    loc: `https://google.com/maps?q=${lat},${long}`,
    time: new Date().getTime(),
  };
};

module.exports = {
  msgInfo,
  locInfo,
};
