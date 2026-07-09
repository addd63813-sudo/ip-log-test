res.send(`
<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<title>오류</title>
<style>
body{
    background:#000;
    color:#ff0000;
    font-family:Arial,sans-serif;
    display:flex;
    justify-content:center;
    align-items:center;
    height:100vh;
    margin:0;
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