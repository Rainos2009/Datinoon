// 1. 구글 로그인
window.handleGoogleLogin = async function() {
  console.log("구글 로그인 시도...");
  const { error } = await supabaseClient.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) alert("로그인 실패: " + error.message);
};

// 2. 로그아웃
window.handleLogout = async function() {
  await supabaseClient.auth.signOut();
  alert("로그아웃 되었습니다.");
  location.reload();
};

// 3. UI 토글 함수들
window.toggleLoginBox = () => {
  const box = document.getElementById("login-box");
  if (box) box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
};

window.toggleSidebar = () => {
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  if (sidebar) sidebar.classList.toggle("active");
  if (overlay) overlay.classList.toggle("active");
};

// 메뉴 및 모달 제어 (한 줄로 정리)
window.openMenu = () => { const m = document.getElementById('popup-menu'); if(m) m.style.display = 'block'; };
window.closeMenu = () => { const m = document.getElementById('popup-menu'); if(m) m.style.display = 'none'; };
window.openSettingsModal = () => { const m = document.getElementById('settingsModal'); if(m) m.style.display = 'block'; };
window.closeSettingsModal = () => { const m = document.getElementById('settingsModal'); if(m) m.style.display = 'none'; };
window.openNicknameModal = () => { const m = document.getElementById('nicknameModal'); if(m) m.style.display = 'block'; };
window.closeNicknameModal = () => { const m = document.getElementById('nicknameModal'); if(m) m.style.display = 'none'; };

// 4. 닉네임 저장 (신분증 정보 업데이트)
window.saveNickname = async function() {
  const { data: { user } } = await supabaseClient.auth.getUser();
  const input = document.getElementById('nicknameInput');
  
  if (!user) return alert("로그인이 필요합니다.");
  if (!input || !input.value.trim()) return alert("닉네임을 입력하세요.");

  // profiles 테이블에 닉네임 저장 (upsert는 있으면 수정, 없으면 생성)
  const { error } = await supabaseClient
    .from('profiles')
    .upsert({ id: user.id, nickname: input.value.trim() });

  if (error) {
    alert("저장 실패: " + error.message);
  } else {
    alert("닉네임 변경 완료!");
    location.reload();
  }
};

// 5. 상태 감지 및 프로필 UI 업데이트
document.addEventListener("DOMContentLoaded", () => {
  const loginNavBtn = document.getElementById('login-nav-btn');
  const accountArea = document.getElementById('profile-account-area');
  const profileName = document.getElementById('profile-name');
  const profileImg = document.getElementById('profile-img');
  const authArea = document.getElementById('auth-area'); // index.html용

  supabaseClient.auth.onAuthStateChange(async (event, session) => {
    if (session) {
      const user = session.user;

      // DB에서 닉네임 가져오기 시도
      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('nickname')
        .eq('id', user.id)
        .single();

      const displayName = (profile && profile.nickname) ? profile.nickname : (user.user_metadata.full_name || user.email);

      // 1) 프로필 페이지용 UI
      if (loginNavBtn) loginNavBtn.style.display = "none";
      if (accountArea) accountArea.style.display = "flex";
      if (profileName) profileName.textContent = displayName;
      if (profileImg && user.user_metadata.avatar_url) profileImg.src = user.user_metadata.avatar_url;

      // 2) index.html 헤더용 UI (신분증 표시)
      if (authArea) {
        authArea.innerHTML = `<span onclick="location.href='profile.html'" style="cursor:pointer; font-weight:bold;">🪪 ${displayName}</span>`;
      }
    } else {
      // 로그아웃 상태
      if (loginNavBtn) loginNavBtn.style.display = "block";
      if (accountArea) accountArea.style.display = "none";
      if (authArea) {
        authArea.innerHTML = `<button style="font-weight:900; cursor:pointer;" onclick="handleGoogleLogin()">로그인</button>`;
      }
    }
  });
});