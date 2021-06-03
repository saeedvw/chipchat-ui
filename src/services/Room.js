import axios from "axios";

const api = process.env.VUE_APP_API_URL;

function GetRoomMessages(roomId) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${api}/rooms/room/${roomId}`,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

function JoinRoom(roomId) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${api}/rooms/join/${roomId}`,
      method: "GET",
    })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

function CreateRoom(data) {
  return new Promise((resolve, reject) => {
    axios({ url: `${api}/rooms`, method: "POST", data })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}
function SearchRooms(roomName) {
  return new Promise((resolve, reject) => {
    axios({ url: `${api}/rooms/search/${roomName}` })
      .then((res) => {
        console.log(res.data);
        resolve(res.data);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

export { GetRoomMessages, JoinRoom, CreateRoom, SearchRooms };
