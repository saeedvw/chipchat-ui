import axios from "axios";

//function GetMessages(room) {}

function UploadAttachment(data, progressCb) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("data", data.blob);
    fd.append("roomId", data.roomId);
    axios({
      url: "http://localhost:8888/messages/upload",
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      data: fd,
      onUploadProgress: progressCb ? progressCb : null,
    })
      .then((res) => {
        console.log(res);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export { UploadAttachment };
