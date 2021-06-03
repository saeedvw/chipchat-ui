import axios from "axios";

function Login(username, password) {
  return new Promise((resolve, reject) => {
    axios({
      url: "http://localhost:8888/user/login",
      method: "POST",
      data: { username, password },
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

function Me() {
  return new Promise((resolve, reject) => {
    axios({ url: "http://localhost:8888/user/me", method: "GET" })
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
function SearchByUsername(username) {
  return new Promise((resolve, reject) => {
    axios({
      url: "http://localhost:8888/user/search/" + username,
      method: "GET",
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
export { Me, Login, SearchByUsername };
