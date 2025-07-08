document.addEventListener("DOMContentLoaded", function () {
    const input = document.getElementById("searchInput");
    const cards = document.querySelectorAll(".card");
  
    input.addEventListener("keyup", function () {
      const query = input.value.toLowerCase();
  
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        if (text.includes(query)) {
          card.style.display = "block";
        } else {
          card.style.display = "none";
        }
      });
    });
  });
  
  const firebaseConfig = {
    apiKey: "AIzaSyAbAKoyjv1wwF-CChOZbMfrx0u2f2G9uVQ",
    authDomain: "datinoon-login.firebaseapp.com",
    projectId: "datinoon-login",
    storageBucket: "datinoon-login.firebasestorage.app",
    messagingSenderId: "668031477218",
    appId: "1:668031477218:web:39e5474e643dce4bd985bb",
    // measurementId: "측정ID" (필요시)
  };

  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function toggleLoginBox() {
    const box = document.getElementById("login-box");
    box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
  }
  window.toggleLoginBox = toggleLoginBox;

  // script.js

function addPost() {
  firebase.firestore().collection("posts").add({
    title: "첫 글",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("글 업로드 완료!");
}

firebase.auth().onAuthStateChanged(user => {
  if (user) {
    // 로그인 상태일 때
    document.getElementById("login-btn-area").style.display = "none";   // 로그인 버튼 숨김
    document.getElementById("login-box").style.display = "none";        // 로그인 창 숨김
    document.getElementById("logout-btn").style.display = "block";      // 로그아웃 보임
    document.getElementById("profile-info").style.display = "block";    // 프로필 보임
    document.getElementById("profile-info").innerHTML =
      `<span style="margin-right:10px;">${user.displayName || user.email}</span>`;
  } else {
    // 로그아웃 상태일 때
    document.getElementById("login-btn-area").style.display = "block";  // 로그인 버튼 보임
    document.getElementById("profile-info").style.display = "none";     // 프로필 숨김
    document.getElementById("logout-btn").style.display = "none";       // 로그아웃 숨김
    document.getElementById("login-box").style.display = "none";        // 로그인 창은 기본적으로 숨김
  }
});

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert('로그아웃 완료!');
    })
    .catch((error) => {
      alert('로그아웃 실패: ' + error.message);
    });
}

document.getElementById('google-login-btn').onclick = function() {
  window.open('redirect-login.html', '_blank');
};

  // 필요하면 로그인 폼 비우기·숨기기 등…