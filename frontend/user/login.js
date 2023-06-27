
function login (){
    //const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

console.log("リクエスト内容");
console.log("email: " , email);
console.log("パスワード: " , password);

    fetch('/user/login', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({email, password}),
})
.then((res) => res.json())
.then((data) => {
    console.log("レスポンス内容", data);
    if (data.error){
        alert(data.error);
    } else {
        alert("User login successfully");
        
        //ログインが成功したらマイページ(account.html)に遷移
        // window.location.href = "/user/account";
        //user/accountを指定すると、APIのエンドポイントになってしまうので、account.htmlに遷移するようにする
        ///Users/hashibasakiko/backend/routes/user.jsの19~21行目を参照
        window.location.href = "/user/account.html";
    }
})
.catch((err) => {
    alert(err);
});
}