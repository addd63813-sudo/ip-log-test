const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();

app.set("trust proxy", true);

const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.get("/", async (req, res) => {
  try {
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    await db.collection("access").add({
      ip: ip,
      time: new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      }),
    });

    res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>오류</title>
<style>
body{
    margin:0;
    background:black;
    color:red;
    font-family:monospace;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    text-align:center;
}
h1{
    font-size:50px;
    animation: blink 0.5s infinite;
}
@keyframes blink{
    50%{opacity:0;}
}
</style>
</head>
<body>

<h1>
🚨 에러 발생 🚨<br><br>
에러 발생<br>
비상! 비상!
</h1>

</body>
</html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("에러 발생");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행: ${PORT}`);
});