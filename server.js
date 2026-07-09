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
    background:#000;
    color:#ff0000;
    font-family:Arial,sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    text-align:center;
}
h1{
    font-size:48px;
}
p{
    font-size:28px;
}
</style>
</head>
<body>

<div>
<h1>에러 발생</h1>
<p>클라이언트를 닫으시오.</p>
</div>

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