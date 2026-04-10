// ============ 전역 변수 ============
const GALLERY_IMAGES = Array.from({ length: 17 }, (_, i) => 
    `/static/images/gallery/photo-${String(i + 1).padStart(2, '0')}.jpg`
);
let currentGalleryIndex = 0;

// ============ 초기화 ============
document.addEventListener('DOMContentLoaded', function() {
    initRosePetals();
    initGallery();
    initGuestbook();
});

// ============ 장미꽃잎 애니메이션 ============
function initRosePetals() {
    const container = document.getElementById('rose-petals');
    
    function createPetal() {
        const petal = document.createElement('div');
        petal.className = 'rose-petal';
        petal.style.left = Math.random() * 100 + '%';
        petal.style.animationDuration = (Math.random() * 3 + 4) + 's';
        petal.style.opacity = Math.random() * 0.6 + 0.3;
        
        container.appendChild(petal);
        
        // 애니메이션 끝 후 제거
        setTimeout(() => petal.remove(), 7000);
    }
    
    // 지속적으로 꽃잎 생성
    setInterval(createPetal, 300);
}

// ============ 갤러리 초기화 ============
function initGallery() {
    const galleryGrid = document.getElementById('gallery-grid');
    const modal = document.getElementById('gallery-modal');
    const modalImage = document.getElementById('modal-image');
    const closeBtn = document.querySelector('.modal-close');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    // 갤러리 그리드 생성
    GALLERY_IMAGES.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `<img src="${src}" alt="Gallery ${index + 1}">`;
        item.addEventListener('click', () => openGallery(index));
        galleryGrid.appendChild(item);
    });

    function openGallery(index) {
        currentGalleryIndex = index;
        modalImage.src = GALLERY_IMAGES[index];
        modal.classList.add('active');
    }

    function closeGallery() {
        modal.classList.remove('active');
    }

    closeBtn.addEventListener('click', closeGallery);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeGallery();
    });

    prevBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex - 1 + GALLERY_IMAGES.length) % GALLERY_IMAGES.length;
        modalImage.src = GALLERY_IMAGES[currentGalleryIndex];
    });

    nextBtn.addEventListener('click', () => {
        currentGalleryIndex = (currentGalleryIndex + 1) % GALLERY_IMAGES.length;
        modalImage.src = GALLERY_IMAGES[currentGalleryIndex];
    });

    // 키보드 네비게이션
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') prevBtn.click();
        if (e.key === 'ArrowRight') nextBtn.click();
        if (e.key === 'Escape') closeGallery();
    });
}

// ============ 방명록 초기화 ============
function initGuestbook() {
    const form = document.getElementById('guestbook-form');
    const list = document.getElementById('guestbook-list');
    const count = document.getElementById('guestbook-count');
    const formMessage = document.getElementById('form-message');

    // 방명록 로드
    loadGuestbook();

    // 폼 제출
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const visitorName = document.getElementById('visitor-name').value.trim();
        const visitorId = document.getElementById('visitor-id').value.trim();
        const password = document.getElementById('visitor-password').value.trim();
        const message = document.getElementById('visitor-message').value.trim();

        if (!visitorName || !visitorId || !password || !message) {
            showFormMessage('모든 필드를 입력해주세요.', 'error');
            return;
        }

        try {
            const response = await fetch('/api/guestbook/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    visitor_name: visitorName,
                    visitor_id: visitorId,
                    password: password,
                    message: message
                })
            });

            const data = await response.json();

            if (response.ok) {
                showFormMessage('축하 메시지가 등록되었습니다! ✨', 'success');
                form.reset();
                loadGuestbook();
            } else {
                showFormMessage(data.error || '오류가 발생했습니다.', 'error');
            }
        } catch (error) {
            showFormMessage('네트워크 오류가 발생했습니다.', 'error');
            console.error(error);
        }
    });

    function showFormMessage(message, type) {
        formMessage.textContent = message;
        formMessage.style.color = type === 'error' ? '#d32f2f' : '#388e3c';
        setTimeout(() => {
            formMessage.textContent = '';
        }, 3000);
    }

    async function loadGuestbook() {
        try {
            const response = await fetch('/api/guestbook/list');
            const guestbooks = await response.json();

            list.innerHTML = '';
            count.textContent = guestbooks.length;

            if (guestbooks.length === 0) {
                list.innerHTML = '<p style="text-align: center; color: #999;">첫 번째 축하 메시지를 남겨주세요! 💌</p>';
                return;
            }

            guestbooks.forEach((item) => {
                const div = document.createElement('div');
                div.className = 'guestbook-item';
                
                const date = new Date(item.date);
                const dateStr = date.toLocaleDateString('ko-KR', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                });

                div.innerHTML = `
                    <div class="guestbook-item-header">
                        <span class="guestbook-item-name">${escapeHtml(item.name)}</span>
                        <span class="guestbook-item-date">${dateStr}</span>
                    </div>
                    <div class="guestbook-item-message">${escapeHtml(item.message)}</div>
                `;
                
                list.appendChild(div);
            });
        } catch (error) {
            console.error('방명록 로드 오류:', error);
        }
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}



// ============ 관리자 패널 (비상 사용) ============
window.adminLogin = function() {
    const modal = document.getElementById('admin-login-modal');
    const loginBtn = document.getElementById('admin-login-btn');
    const closeBtn = modal.querySelector('.modal-close');

    modal.classList.add('active');

    loginBtn.addEventListener('click', async () => {
        const adminId = document.getElementById('admin-id').value;
        const adminPw = document.getElementById('admin-pw').value;

        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    admin_id: adminId,
                    admin_pw: adminPw
                })
            });

            if (response.ok) {
                alert('관리자 로그인 성공!');
                modal.classList.remove('active');
                // TODO: 관리자 대시보드로 이동
            } else {
                alert('로그인 실패: 아이디 또는 비밀번호를 확인하세요.');
            }
        } catch (error) {
            console.error('로그인 오류:', error);
        }
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });
};

// ============ 스크롤 네비게이션 ============
document.addEventListener('DOMContentLoaded', () => {
    // 부드러운 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
