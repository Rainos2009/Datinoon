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
    appId: "1:668031477218:web:02f435a7194ab715d985bb",
    measurementId: "G-F63ENDYFZF"
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

function openNicknameModal() {
  const user = firebase.auth().currentUser;
  const input = document.getElementById('newNickname');
  if (input) input.value = user && user.displayName ? user.displayName : "";
  const modal = document.getElementById('nicknameModal');
  if (modal) modal.style.display = 'block';
}

function openLanguageModal() {
  document.getElementById('languageModal').style.display = 'block';
}
function openFriendModal() {
  document.getElementById('friendModal').style.display = 'block';
}
function downloadMyData() {
  alert('내 데이터 다운로드 기능 준비중!');
}
function openAccountModal() {
  document.getElementById('accountModal').style.display = 'block';
}
function openActivityModal() {
  document.getElementById('activityModal').style.display = 'block';
}

// 로그인 후 사용자 정보 로드 시 호출되는 함수에 아래 코드 추가
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {

    if (user.photoURL && document.getElementById('profile-img')) {
      document.getElementById('profile-img').src = user.photoURL;
    }

    // 닉네임 불러오기
    firebase.firestore().collection("nicknames").doc(user.uid).get().then((doc) => {
      if (doc.exists) {
        const nickname = doc.data().nickname;
        document.getElementById("profile-name").textContent = nickname; // ← 여기 닉네임
      } else {
        document.getElementById("profile-name").textContent = user.displayName || "사용자"; // 닉네임 없을 경우 대체
      }

      // 가입일 표시 (예전처럼)
      const createdAt = new Date(user.metadata.creationTime);
      const joinDate = `${createdAt.getFullYear()}년 ${createdAt.getMonth() + 1}월 ${createdAt.getDate()}일`;
      document.getElementById("profile-meta").textContent = `[가입] ${joinDate}`;
      
      document.getElementById("profile-account-area").style.display = "flex";
    });
  }
});

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  sidebar.classList.toggle("active");
  overlay.classList.toggle("active");
}
window.toggleSidebar = toggleSidebar;

  // 필요하면 로그인 폼 비우기·숨기기 등…/

  document.querySelector('.profile-actions button:nth-child(1)').onclick = addPost;

  document.querySelector('.profile-actions button:nth-child(2)').onclick = () => {
    window.location.href = '/channel/community.html';
  };

  tabPanel.innerHTML = `<b>설명</b>${data.desc ? data.desc.replace(/\n/g, "<br>") : "소개글이 없습니다."}`;