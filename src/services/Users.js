import axios from "axios";

const api = process.env.VUE_APP_API_URL;
console.log({ api });
function Login(username, password) {
  return new Promise((resolve, reject) => {
    axios({
      url: `${api}/user/login`,
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
  console.log(process.env);
  return new Promise((resolve, reject) => {
    axios({ url: `${api}/user/me`, method: "GET" })
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
      url: `${api}/user/search/${username}`,
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
