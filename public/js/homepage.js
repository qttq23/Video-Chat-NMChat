n = new Date();
y = n.getFullYear();
m = n.getMonth() + 1;
d = n.getDate();
document.getElementById("date").innerHTML = d + "/" + m + "/" + y;

var btnCreate = document.getElementById("btn-create");
var btnJoin = document.getElementById("btn-join");
var loginEmail = document.getElementById("login-email");
var loginPass = document.getElementById("login-pass");
var signupEmail = document.getElementById("signup-email");
var signupPass = document.getElementById("signup-pass");
var audioCheckbox = document.getElementById("audio-checkbox");
var videoCheckbox = document.getElementById("video-checkbox");
var btnLogin = document.getElementById("btn-login");
var btnSignup = document.getElementById("btn-signup");
var btnJoinDialog = document.getElementById("btn-join-dialog");