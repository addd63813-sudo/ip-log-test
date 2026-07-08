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
    // 실제 접속 IP 가져오기
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

    // 사용자에게 보여줄 문구
    res.status(500).send("에러: 클라이언트를 닫고 다시 시도하세요.");
  } catch (err) {
    console.error(err);
    res.status(500).send("에러: 클라이언트를 닫고 다시 시도하세요.");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버 실행: ${PORT}`);
});
