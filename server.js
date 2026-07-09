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