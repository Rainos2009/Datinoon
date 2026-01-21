// 1. 전역 함수 선언 (HTML onclick에서 바로 호출할 수 있도록 위로 올림)
function toggleLoginBox() {
  const box = document.getElementById("login-box");
  if (box) {
    box.style.display = (box.style.display === "none" || box.style.display === "") ? "block" : "none";
  }
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  if (error) {
    alert("로그아웃 실패: " + error.message);
  } else {
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

// 모달 제어 함수들
function openSettingsModal() { document.getElementById('settingsModal').style.display = 'block'; }
function closeSettingsModal() { document.getElementById('settingsModal').style.display = 'none'; }
function openNicknameModal() { document.getElementById('nicknameModal').style.display = 'block'; }
function closeNicknameModal() { document.getElementById('nicknameModal').style.display = 'none'; }
function openMenu() { document.getElementById('popup-menu').style.display = 'block'; }
function closeMenu() { document.getElementById('popup-menu').style.display = 'none'; }

// 2. 메인 로직 시작
document.addEventListener("DOMContentLoaded", function () {
  // UI 요소 참조
  const loginNavBtn = document.querySelector('.right button') || document.getElementById('login-nav-btn');
  const loginBox = document.getElementById('login-box');
  const googleLoginBtn = document.getElementById('google-login-btn');
  const accountArea = document.getElementById('profile-account-area');
  const profileName = document.getElementById('profile-name');
  const profileMeta = document.getElementById('profile-meta');
  const profileImg = document.querySelector('.profile-logo') || document.getElementById('profile-img');

  // [중요] 3. 로그인 상태 실시간 감지
  supabase.auth.onAuthStateChange((event, session) => {
    console.log("현재 상태:", event, session);

    if (session) {
      const user = session.user;
      // 로그인 상태 UI 처리
      if (loginNavBtn) loginNavBtn.style.display = "none";
      if (accountArea) accountArea.style.display = "flex";
      if (loginBox) loginBox.style.display = "none";

      // 프로필 정보 표시
      if (profileName) profileName.textContent = user.user_metadata.full_name || user.email;
      
      if (profileMeta) {
        const createdAt = new Date(user.created_at);
        profileMeta.textContent = `[登録] ${createdAt.getFullYear()}年 ${createdAt.getMonth() + 1}月 ${createdAt.getDate()}日`;
      }

      // 프로필 이미지 설정
      if (user.user_metadata.avatar_url && profileImg) {
        profileImg.src = user.user_metadata.avatar_url;
      }
    } else {
      // 로그아웃 상태 UI 처리
      if (loginNavBtn) loginNavBtn.style.display = "block";
      if (accountArea) accountArea.style.display = "none";
    }
  });

  // [핵심] 4. 구글 로그인 버튼 이벤트 바인딩
  if (googleLoginBtn) {
    googleLoginBtn.addEventListener('click', async (e) => {
      e.preventDefault(); // 기본 동작 방지
      console.log("구글 로그인 시도...");
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // GitHub Pages 환경에 맞게 리다이렉트 주소 설정
          redirectTo: window.location.origin + window.location.pathname
        }
      });
      
      if (error) {
        console.error("Auth Error:", error.message);
        alert("로그인 창을 여는 데 실패했습니다: " + error.message);
      }
    });
  }

  // 5. 검색 기능
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("keyup", function () {
      const query = searchInput.value.toLowerCase();
      const cards = document.querySelectorAll(".card");
      cards.forEach((card) => {
        const text = card.textContent.toLowerCase();
        card.style.display = text.includes(query) ? "block" : "none";
      });
    });
  }
});

// 6. 닉네임 저장 기능
async function saveNickname() {
  const { data: { user } } = await supabase.auth.getUser();
  const input = document.getElementById('nicknameInput') || document.getElementById('newNickname');
  const newNickname = input ? input.value.trim() : "";

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

// 전역 윈도우 객체 노출
window.toggleLoginBox = toggleLoginBox;
window.handleLogout = handleLogout;
window.toggleSidebar = toggleSidebar;
window.saveNickname = saveNickname;
window.openSettingsModal = openSettingsModal;
window.closeSettingsModal = closeSettingsModal;
window.openNicknameModal = openNicknameModal;
window.closeNicknameModal = closeNicknameModal;
window.openMenu = openMenu;
window.closeMenu = closeMenu;