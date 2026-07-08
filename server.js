const express = require("express");
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

const app = express();

app.set("trust proxy", true);

// Render 환경 변수에서 Firebase 키 읽기
const serviceAccount = JSON.parse(process.env.FIREBASE_KEY);

// Firebase 초기화
initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

app.get("/", async (req, res) => {
  try {
    // 실제 접속자 IP만 가져오기
    const forwarded = req.headers["x-forwarded-for"];
    const ip = forwarded
      ? forwarded.split(",")[0].trim()
      : req.socket.remoteAddress;

    // Firestore에 저장
    await db.collection("access").add({
      ip,
      time: new Date().toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
      }),
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