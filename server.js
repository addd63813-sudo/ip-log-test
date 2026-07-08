const express = require("express");
const fs = require("fs");

const app = express();

app.set("trust proxy", true);

app.get("/", (req, res) => {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    const time = new Date().toLocaleString();

    const log = `${time} | IP: ${ip}\n`;

    fs.appendFileSync("access.log", log);

    res.send("접속 기록 저장 완료");
});

app.listen(3000, () => {
    console.log("서버 실행: http://localhost:3000");
});