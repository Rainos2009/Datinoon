const firebaseConfig = {
  apiKey: "AIzaSyAbAK0yvj1wwF-CChOZbMfrx0u2f2G9uVQ",
  authDomain: "datinoon-login.firebaseapp.com",
  projectId: "datinoon-login",
  storageBucket: "datinoon-login.appspot.com",
  messagingSenderId: "668031477218",
  appId: "1:668031477218:web:afd52e141fcdf555d985bb",
  measurementId: "G-75TKBRKKFJ"
};

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
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  function toggleLoginBox() {
    document.querySelector(".login-box").classList.toggle("active");
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