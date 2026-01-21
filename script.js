async function handleGoogleLogin() {
  console.log("구글 로그인 시도 중...");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) alert("로그인 에러: " + error.message);
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) alert("로그아웃 실패: " + error.message);
  else {
    alert("로그아웃 되었습니다.");
    location.reload();
  }
}

// --- 2. UI 제어 함수 (모달, 사이드바) ---

function toggleLoginBox() {
  const box = document.getElementById("login-box");
  if (box) box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
}

function toggleSidebar() {
  const sb = document.getElementById("sidebar");
  const ol = document.getElementById("overlay");
  if (sb && ol) {
    sb.classList.toggle("active");
    ol.classList.toggle("active");
  }
}

function openMenu() { document.getElementById('popup-menu').style.display = 'block'; }
function closeMenu() { document.getElementById('popup-menu').style.display = 'none'; }
function openSettingsModal() { document.getElementById('settingsModal').style.display = 'block'; }
function closeSettingsModal() { document.getElementById('settingsModal').style.display = 'none'; }
function openNicknameModal() { document.getElementById('nicknameModal').style.display = 'block'; }
function closeNicknameModal() { document.getElementById('nicknameModal').style.display = 'none'; }

// --- 3. 데이터베이스 작업 ---

async function saveNickname() {
  const { data: { user } } = await supabase.auth.getUser();
  const newNickname = document.getElementById('nicknameInput').value.trim();

  if (!user) return alert("로그인이 필요합니다.");
  if (!newNickname) return alert("닉네임을 입력해주세요.");

  const { error } = await supabase
    .from('profiles')
    .upsert({ id: user.id, nickname: newNickname });

  if (error) alert("저장 실패: " + error.message);
  else {
    alert("닉네임이 변경되었습니다!");
    location.reload();
  }
}

// --- 4. 페이지 로드 시 상태 감지 ---

document.addEventListener("DOMContentLoaded", () => {
  const loginNavBtn = document.getElementById('login-nav-btn');
  const accountArea = document.getElementById('profile-account-area');
  const profileName = document.getElementById('profile-name');
  const profileMeta = document.getElementById('profile-meta');
  const profileImg = document.getElementById('profile-img');

  // Supabase 인증 상태 감지
  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      const user = session.user;
      if (loginNavBtn) loginNavBtn.style.display = "none";
      if (accountArea) accountArea.style.display = "flex";
      
      // 구글 프로필 정보 반영
      if (profileName) profileName.textContent = user.user_metadata.full_name || user.email;
      if (profileImg && user.user_metadata.avatar_url) {
        profileImg.src = user.user_metadata.avatar_url;
      }
      
      const date = new Date(user.created_at);
      if (profileMeta) profileMeta.textContent = `[登録] ${date.getFullYear()}年 ${date.getMonth()+1}月 ${date.getDate()}일`;
    } else {
      if (loginNavBtn) loginNavBtn.style.display = "block";
      if (accountArea) accountArea.style.display = "none";
    }
  });

  // 검색 기능
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", () => {
      const query = searchInput.value.toLowerCase();
      document.querySelectorAll(".card").forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(query) ? "block" : "none";
      });
    });
  }
});

// 전역 연결 (HTML onclick용)
window.handleGoogleLogin = handleGoogleLogin;
window.handleLogout = handleLogout;
window.toggleLoginBox = toggleLoginBox;
window.toggleSidebar = toggleSidebar;
window.openMenu = openMenu;
window.closeMenu = closeMenu;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.openNicknameModal = openNicknameModal;
window.closeNicknameModal = closeNicknameModal;
window.saveNickname = saveNickname;