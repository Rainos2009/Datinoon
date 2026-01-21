window.handleGoogleLogin = async function() {
  console.log("구글 로그인 시도...");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + window.location.pathname
    }
  });
  if (error) alert("로그인 실패: " + error.message);
};

window.handleLogout = async function() {
  await supabase.auth.signOut();
  alert("로그아웃 되었습니다.");
  location.reload();
};

window.toggleLoginBox = function() {
  const box = document.getElementById("login-box");
  if (box) box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
};

window.toggleSidebar = function() {
  document.getElementById("sidebar").classList.toggle("active");
  document.getElementById("overlay").classList.toggle("active");
};

window.openMenu = () => document.getElementById('popup-menu').style.display = 'block';
window.closeMenu = () => document.getElementById('popup-menu').style.display = 'none';
window.openSettingsModal = () => document.getElementById('settingsModal').style.display = 'block';
window.closeSettingsModal = () => document.getElementById('settingsModal').style.display = 'none';
window.openNicknameModal = () => document.getElementById('nicknameModal').style.display = 'block';
window.closeNicknameModal = () => document.getElementById('nicknameModal').style.display = 'none';

window.saveNickname = async function() {
  const { data: { user } } = await supabase.auth.getUser();
  const input = document.getElementById('nicknameInput');
  if (!user) return alert("로그인이 필요합니다.");
  if (!input.value) return alert("닉네임을 입력하세요.");

  const { error } = await supabase.from('profiles').upsert({ id: user.id, nickname: input.value.trim() });
  if (error) alert("저장 실패: " + error.message);
  else { alert("변경 완료!"); location.reload(); }
};

// 2. 상태 감지 (DOM 로드 후 실행)
document.addEventListener("DOMContentLoaded", () => {
  const loginNavBtn = document.getElementById('login-nav-btn');
  const accountArea = document.getElementById('profile-account-area');
  const profileName = document.getElementById('profile-name');
  const profileImg = document.getElementById('profile-img');

  supabase.auth.onAuthStateChange((event, session) => {
    if (session) {
      const user = session.user;
      if (loginNavBtn) loginNavBtn.style.display = "none";
      if (accountArea) accountArea.style.display = "flex";
      if (profileName) profileName.textContent = user.user_metadata.full_name || user.email;
      if (profileImg && user.user_metadata.avatar_url) profileImg.src = user.user_metadata.avatar_url;
    } else {
      if (loginNavBtn) loginNavBtn.style.display = "block";
      if (accountArea) accountArea.style.display = "none";
    }
  });
});