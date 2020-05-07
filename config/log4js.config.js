let path = require("path");
let root = path.join(__dirname, "../");

module.exports = {
  appenders: {
    ConsoleLogAppender: {
      type: "console"
    },
    FileLogAppender: {
      type: "file",
      filename: path.join(root, "./log/system/system.log"),
      maxLogSize: 5000000,
      bakups: 10
    },
    MuitiFileAppender: {
      type: "multiFile",
      base: path.join(root, "./log/application/"),
      property: "key",
      extension: ".log"
    },
    DateRollingFileAppender: {
      type: "dateFile",
      filename: path.join(root, "./log/access/access.log"),
      pattern: "-yyyyMMdd",
      daysToKeep: 30
    }

  },
  categories: {
    "default": {
      appenders: ["ConsoleLogAppender"],
      level: "ALL"
    },
    system: {
      appenders: ["FileLogAppender"],
      level: "ERROR"
    },
    application: {
      appenders: ["MuitiFileAppender"],
      level: "ERROR"
    },
    access: {
      appenders: ["DateRollingFileAppender"],
      level: "INFO"
    }
  }
};