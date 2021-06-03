import axios from "axios";

function GetRoomMessages(roomId) {
  return new Promise((resolve, reject) => {
    axios({
      url: "http://localhost:8888/rooms/room/" + roomId,
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
      url: "http://localhost:8888/rooms/join/" + roomId,
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
    axios({ url: "http://localhost:8888/rooms", method: "POST", data })
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
    axios({ url: "http://localhost:8888/rooms/search/" + roomName })
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
