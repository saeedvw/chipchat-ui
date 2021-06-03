import axios from "axios";

//function GetMessages(room) {}
const api = process.env.VUE_APP_API_URL;

function UploadAttachment(data, progressCb) {
  return new Promise((resolve, reject) => {
    const fd = new FormData();
    fd.append("data", data.blob);
    fd.append("roomId", data.roomId);
    axios({
      url: `${api}/messages/upload`,
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
