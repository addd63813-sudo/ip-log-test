const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();

app.set("trust proxy", true);

// Firebase 서비스 계정
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// Firebase 초기화
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.get("/", async (req, res) => {
  try {
    // 접속한 사람의 실제 IP
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    // Firestore 저장
    await db.collection("access").add({
      ip: ip,
      time: new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      }),
    });

    // 접속한 사람에게 자신의 IP 표시
    res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>IP 확인</title>
<style>
body{
    background:#000;
    color:#00ff00;
    font-family:monospace;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
}
.box{
    text-align:center;
}
h1{
    font-size:48px;
}
p{
    font-size:32px;
}
</style>
</head>
<body>
<div class="box">
    <h1>접속 완료</h1>
    <p>당신의 IP 주소</p>
    <p>${ip}</p>
</div>
</body>
</html>
    `);

  } catch (err) {
    console.error(err);
    res.status(500).send("오류가 발생했습니다.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행: ${PORT}`);
});