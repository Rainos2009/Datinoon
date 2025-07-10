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
  storageBucket: "datinoon-login.appspot.com",    // ← 이게 맞음!!
  messagingSenderId: "668031477218",
  appId: "1:668031477218:web:39e5474e643dce4bd985bb",
  measurementId: "G-1DS969657B"
};
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
  console.log("AUTH 상태 변화:", user);
  const loginBtn = document.querySelector('.right button'); // 로그인 버튼
  const accountArea = document.getElementById('profile-account-area'); // 계정 박스
  const accountMenu = document.getElementById('account-menu'); // 드롭다운 메뉴

  if (user) { // 53번째 줄 쯤!

    if (user.photoURL && document.getElementById('profile-img')) {
      document.getElementById('profile-img').src = user.photoURL;
    }
    // 로그인 상태
    if (loginBtn) loginBtn.style.display = "none";
    if (accountArea) accountArea.style.display = "flex";
    if (accountMenu) accountMenu.style.display = "none";
    document.getElementById('profile-name').textContent = user.displayName || user.email;
    const joinDate = user.metadata && user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'short',
        timeZone: 'UTC'
      })
    : '';
  document.getElementById('profile-meta').textContent = `[가입] ${joinDate}`;

  } else { // 62번째 줄 쯤!
    // 로그아웃 상태
    if (loginBtn) loginBtn.style.display = "block";
    if (accountArea) accountArea.style.display = "none";
    if (accountMenu) accountMenu.style.display = "none";
    document.getElementById('profile-name').textContent = '';
    document.getElementById('profile-meta').textContent = '';
  }
}); // onAuthStateChanged

function logout() {
  firebase.auth().signOut()
    .then(() => {
      alert('로그아웃 완료!');
      document.getElementById('login-box').style.display = 'block';
    })
    .catch((error) => {
      alert('로그아웃 실패: ' + error.message);
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const googleLoginBtn = document.getElementById('google-login-btn');
  if (googleLoginBtn) {
    googleLoginBtn.onclick = () => {
      const provider = new firebase.auth.GoogleAuthProvider();
      firebase.auth().signInWithPopup(provider);
    };
  } else {
    console.warn('⚠️ google-login-btn 엘리먼트가 없습니다!');
  }
});

function openMenu() {
  document.getElementById('popup-menu').style.display = 'block';
}
function closeMenu() {
  document.getElementById('popup-menu').style.display = 'none';
}
window.openMenu = openMenu;
window.closeMenu = closeMenu;

function openSettingsModal() {
  document.getElementById('settingsModal').style.display = 'block';
}
function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;

function openNicknameModal() {
  const user = firebase.auth().currentUser;
  document.getElementById('newNickname').value = user && user.displayName ? user.displayName : "";
  document.getElementById('nicknameModal').style.display = 'block';
}

async function updateNickname() {
  const user = firebase.auth().currentUser;
  const newNickname = document.getElementById('newNickname').value.trim();

  if (!newNickname) {
    alert('닉네임을 입력하세요!');
    return;
  }
  if (newNickname.length < 2 || newNickname.length > 20) {
    alert('닉네임은 2~20자로 해주세요.');
    return;
  }

  const nickRef = firebase.firestore().collection('nicknames').doc(newNickname);

  try {
    // 1. 닉네임이 이미 등록되어 있는지 확인
    const doc = await nickRef.get();
    if (doc.exists && doc.data().uid !== user.uid) {
      alert('이미 사용 중인 닉네임입니다!');
      return;
    }

    // 2. 기존 닉네임이 있으면 닉네임 컬렉션에서 삭제
    const oldNickname = user.displayName;
    if (oldNickname && oldNickname !== newNickname) {
      await firebase.firestore().collection('nicknames').doc(oldNickname).delete();
    }

    // 3. 사용자 프로필 업데이트
    await user.updateProfile({ displayName: newNickname });

    // 4. 닉네임 컬렉션에 등록
    await nickRef.set({ uid: user.uid });

    alert('닉네임이 변경되었습니다!');
    closeNicknameModal();
    location.reload();
  } catch (error) {
    alert('변경 실패: ' + error.message);
  }
}

  // 필요하면 로그인 폼 비우기·숨기기 등…/