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
    document.getElementById("login-box").style.display = "none";
    document.getElementById("logout-btn").style.display = "block";
    document.getElementById("profile-info").style.display = "block";
    document.getElementById("profile-info").innerHTML =
      `<span style="margin-right:10px;">${user.displayName || user.email}</span>`;
  } else {
    document.getElementById("login-box").style.display = "block";
    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("profile-info").style.display = "none";
  }
});

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert('로그아웃 완료!');
      document.getElementById('profile-info').style.display = 'none';
      document.getElementById('logout-btn').style.display = 'none';
      document.getElementById('login-box').style.display = 'block'; // 여기로 대체!
    })
    .catch((error) => {
      alert('로그아웃 실패: ' + error.message);
    });
}

document.getElementById('google-login-btn').onclick = function() {
  window.open('redirect-login.html', '_blank');
};

  // 필요하면 로그인 폼 비우기·숨기기 등…