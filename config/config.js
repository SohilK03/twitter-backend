if (process.env.NODE_ENV === "production") keys = require("./config_prod");
else
  keys = require("./config_dev")
    ? require("./config_dev")
    : require("./config_prod");
module.exports = keys;
