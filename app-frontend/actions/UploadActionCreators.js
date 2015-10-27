import Logger from "../libs/Logger";
const logger = Logger.create("UploadActionCreators");

export default {
  upload(roomId, files) {
    logger.info(`Uploading ${files.length} file(s) to '${roomId}'`);
    let filesInfo = files.map(file => file.name);
    logger.info(...filesInfo);
  }
};
