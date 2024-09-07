import { IServerLog } from "../data/interfaces/logs/log.interface";
import { getLogSaveDateFormat, parseData } from "../utils/shared-functions";
import fs from "fs";

export const saveServerLogs = (log: IServerLog) => {
  try {
    const { requestTime, url, action, body, responseTime, response } = log;
    const logInfo =
      [
        "Request Time: " + requestTime,
        "URL: " + url,
        "Action: " + action,
        "Body: " +
          (body && Object.keys(body).length !== 0 ? parseData(body) : ""),
        "Response Time: " + responseTime,
        "Respons: " +
          (response && Object.keys(response).length !== 0
            ? parseData(response)
            : ""),
      ].join(" | ") + "\n";

    const saveDate = getLogSaveDateFormat(requestTime);
    if (!fs.existsSync(`./logs/server-logs/${saveDate.date}`)) {
      fs.mkdirSync(`./logs/server-logs/${saveDate.date}`);
    }

    fs.writeFile(
      `./logs/server-logs/${saveDate.date}/${saveDate.time}.log`,
      logInfo,
      { flag: "a" },
      (err) => {}
    );
  } catch (e) {}
};
