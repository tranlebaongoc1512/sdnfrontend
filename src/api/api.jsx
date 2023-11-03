import axios from "axios";

const url = "https://d3g05hxy37njpf.cloudfront.net";
const instance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
});

export default instance;
