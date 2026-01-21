// 1. 초기화 및 UI 요소 참조
document.addEventListener("DOMContentLoaded", function () {
  const loginBtn = document.querySelector('.right button'); // 상단 로그인 버튼
  const loginBox = document.getElementById('login-box');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const accountArea = document.getElementById('profile-account-area');
  const profileName = document.getElementById('profile-name');
  const profileMeta = document.getElementById('profile-meta');

  // 2. 로그인 상태 감지 (onAuthStateChange)
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("AUTH 상태 변화:", event, session);

    if (session) {
      const user = session.user;
      // 로그인 상태 UI 처리
      if (loginBtn) loginBtn.style.display = "none";
      if (accountArea) accountArea.style.display = "flex";
      if (loginBox) loginBox.style.display = "none";

      // 프로필 정보 표시 (구글 계정 정보)
      profileName.textContent = user.user_metadata.full_name || user.email;
      
      const createdAt = new Date(user.created_at);
      const joinDate = `${createdAt.getFullYear()}年 ${createdAt.getMonth() + 1}月 ${createdAt.getDate()}日`;
      profileMeta.textContent = `[登録] ${joinDate}`;

      // 프로필 이미지 설정
      if (user.user_metadata.avatar_url && document.querySelector('.profile-logo')) {
        document.querySelector('.profile-logo').src = user.user_metadata.avatar_url;
      }
    } else {
      // 로그아웃 상태 UI 처리
      if (loginBtn) loginBtn.style.display = "block";
      if (accountArea) accountArea.style.display = "none";
      profileName.textContent = '';
      profileMeta.textContent = '';
    }
  });

  // 3. 구글 로그인 실행
  if (googleLoginBtn) {
    googleLoginBtn.onclick = async () => {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/Datinoon/' // 깃허브 배포 주소 확인 필수
        }
      });
      if (error) alert("로그인 실패: " + error.message);
    };
  }

  // 4. 검색 기능 (기존 로직 유지)
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const query = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".card"); // HTML에 .card 클래스가 있어야 함
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
      });
    });
  }
});

// 5. 전역 함수 (HTML onclick 연결용)
function toggleLoginBox() {
  const box = document.getElementById("login-box");
  if (box) box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) alert("로그아웃 실패: " + error.message);
  else {
    alert("로그아웃 완료!");
    location.reload();
  }
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (sidebar && overlay) {
    sidebar.classList.toggle("active");
    overlay.classList.toggle("active");
  }
}

// 6. 설정 및 닉네임 모달 제어
function openSettingsModal() { document.getElementById('settingsModal').style.display = 'block'; }
function closeSettingsModal() { document.getElementById('settingsModal').style.display = 'none'; }
function openNicknameModal() { document.getElementById('nicknameModal').style.display = 'block'; }
function closeNicknameModal() { document.getElementById('nicknameModal').style.display = 'none'; }
function openMenu() { document.getElementById('popup-menu').style.display = 'block'; }
function closeMenu() { document.getElementById('popup-menu').style.display = 'none'; }

// 7. 닉네임 저장 (Supabase DB 사용)
async function saveNickname() {
  const { data: { user } } = await supabase.auth.getUser();
  const newNickname = document.getElementById('nicknameInput').value.trim();

  if (!user) {
    alert("로그인이 필요합니다.");
    return;
  }

  if (newNickname) {
    const { error } = await supabase
      .from('profiles')
      .upsert({ id: user.id, nickname: newNickname });

    if (error) alert("저장 실패: " + error.message);
    else {
      alert("닉네임이 변경되었습니다!");
      location.reload();
    }
  }
}

// 창 닫기 및 외부 클릭 시 닫기 설정 (전역 노출)
window.toggleLoginBox = toggleLoginBox;
window.handleLogout = handleLogout;
window.toggleSidebar = toggleSidebar;
window.openMenu = openMenu;
window.closeMenu = closeMenu;