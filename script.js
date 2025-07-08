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
    storageBucket: "datinoon-login.appspot.com",
    messagingSenderId: "668031477218",
    appId: "1:668031477218:web:39e5474e643dce4bd985bb",
    // measurementId: "측정ID" (필요시)
  };

  // ─── 1) Firebase 초기화 ─────────────────────────────────
firebase.initializeApp(firebaseConfig);

// ─── 2) 리다이렉트 결과 받기 ───────────────────────────
firebase.auth().getRedirectResult()
  .then(result => {
    if (result.user) {
      console.log('✅ 리디렉트 로그인 성공:', result.user.email);
      // onAuthStateChanged가 UI를 이어서 처리해 줘
    }
  })
  .catch(error => {
    alert('로그인 실패: ' + error.message);
    console.error(error);
  });

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
  const loginBtnArea = document.getElementById("login-btn-area");
  const loginBox = document.getElementById("login-box");
  const logoutBtn = document.getElementById("logout-btn");
  const profileInfo = document.getElementById("profile-info");

  if (user) {
    // 로그인 상태
    if (loginBtnArea) loginBtnArea.style.display = "none";
    if (loginBox) loginBox.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "block";
    if (profileInfo) {
      profileInfo.style.display = "block";
      profileInfo.innerHTML = `<span style="margin-right:10px;">${user.displayName || user.email}</span>`;
    }
  } else {
    // 로그아웃 상태
    if (loginBtnArea) loginBtnArea.style.display = "block";
    if (profileInfo) profileInfo.style.display = "none";
    if (logoutBtn) logoutBtn.style.display = "none";
    if (loginBox) loginBox.style.display = "none";
  }
});

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert('로그아웃 완료!');
      document.getElementById('profile-info').style.display = 'none';
      document.getElementById('logout-btn').style.display = 'none';
      document.getElementById('login-box').style.display = 'block';
    })
    .catch((error) => {
      alert('로그아웃 실패: ' + error.message);
      console.error(error);
    });
}

document.getElementById('google-login-btn').onclick = () => {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);   // ← 팝업 대신 리다이렉트
};

  // 필요하면 로그인 폼 비우기·숨기기 등…/