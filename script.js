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

  // script.js
import { db } from './firebase-config.js';
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

async function addPost() {
  await firebase.firestore().collection("posts").add({
    title: "첫 글",
    timestamp: firebase.firestore.FieldValue.serverTimestamp()
  });
  alert("글 업로드 완료!");
}