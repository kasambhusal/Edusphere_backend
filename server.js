const http = require("http");
const app = require("./app");
const port = process.env.PORT || 3000;
const server = http.createServer(app);
// const localIp = "192.168.1.70";

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
