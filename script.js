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
    const box = document.querySelector(".login-box");
    box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
  }

  function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        alert("로그인 성공!");
        console.log("User:", userCredential.user);
      })
      .catch((error) => {
        alert("로그인 실패: " + error.message);
      });
  }

  // script.js

function addPost() {
  firebase.firestore().collection("posts").add({
    title: "첫 글",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("글 업로드 완료!");
}

function showSignupBox() {
  document.querySelector('.login-box').classList.remove('active');
  document.querySelector('.signup-box').classList.add('active');
}

function signup() {
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
  alert('회원가입 성공! 이제 로그인 해주세요.');
  // 창 전환
  document.querySelector('.signup-box').classList.remove('active');
  document.querySelector('.login-box').classList.add('active');
})
    .catch((error) => {
      alert('회원가입 실패: ' + error.message);
    });
}

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert('로그아웃 완료!');

      // 폼 전환 – 로그인 창만 보여주고 로그아웃 버튼 숨기기
      showLoginBox();
      document.getElementById('logout-btn').style.display = 'none';
    })
    .catch((error) => {
      alert('로그아웃 실패: ' + error.message);
    });
}

// login() 의 then 블록 안
.then((userCredential) => {
  alert("로그인 성공!");

  // 🔽 로그아웃 버튼 표시
  document.getElementById('logout-btn').style.display = 'inline';

  // 필요하면 로그인 폼 비우기·숨기기 등…
})