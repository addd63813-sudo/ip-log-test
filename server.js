const express = require("express");
const admin = require("firebase-admin");

const app = express();

app.set("trust proxy", true);

// Render 환경 변수에서 Firebase 키 읽기
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.get("/", async (req, res) => {
  try {
    const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

    await db.collection("access").add({
      ip: ip,
      time: new Date().toISOString(),
    });

    res.send("접속 기록 저장 완료");
  } catch (err) {
    console.error(err);
    res.status(500).send("오류 발생");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행: ${PORT}`);
});