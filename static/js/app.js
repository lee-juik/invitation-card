// ============ 갤러리 이미지 목록 ============
const GALLERY = [
    '/static/images/gallery/photo-02.jpg',
    '/static/images/gallery/photo-01.jpg',
    '/static/images/gallery/photo-03.jpg',
    '/static/images/gallery/photo-04.jpg',
    '/static/images/gallery/photo-06.jpg',
    '/static/images/gallery/photo-07.jpg',
    '/static/images/gallery/photo-09.jpg',
    '/static/images/gallery/photo-10.jpg',
    '/static/images/gallery/photo-11.jpg',
    '/static/images/gallery/photo-12.jpg',
    '/static/images/gallery/photo-13.jpg',
    '/static/images/gallery/photo-14.jpg',
    '/static/images/gallery/photo-15.jpg',
    '/static/images/gallery/photo-16.jpg',
    '/static/images/gallery/photo-17.jpg',
];
let currentIdx = 0;

// ============ 초기화 ============
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({ duration: 700, once: true, offset: 60 });
    initRosePetals();
    initGallery();
    initDday();
    initMap();
    loadGuestbook();
    initGuestbookForm();
});

// ============ D-DAY 카운트다운 ============
function initDday() {
    const wedding = new Date('2026-06-27T11:00:00+09:00');

    function update() {
        const now = new Date();
        const diff = wedding - now;
        if (diff <= 0) {
            document.getElementById('dday-days').textContent = '00';
            document.getElementById('dday-hours').textContent = '00';
            document.getElementById('dday-mins').textContent = '00';
            document.getElementById('dday-secs').textContent = '00';
            return;
        }
        const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs  = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById('dday-days').textContent  = String(days).padStart(2, '0');
        document.getElementById('dday-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('dday-mins').textContent  = String(mins).padStart(2, '0');
        document.getElementById('dday-secs').textContent  = String(secs).padStart(2, '0');
    }
    update();
    setInterval(update, 1000);
}

// ============ 장미꽃잎 ============
function initRosePetals() {
    const container = document.getElementById('rose-petals');
    if (!container) return;

    function makePetal() {
        const p = document.createElement('div');
        p.className = 'petal';
        const size = Math.random() * 8 + 8;
        p.style.cssText = `
            left: ${Math.random() * 100}%;
            width: ${size}px;
            height: ${size * 1.3}px;
            animation-duration: ${Math.random() * 4 + 5}s;
            animation-delay: ${Math.random() * 2}s;
            opacity: ${Math.random() * 0.5 + 0.4};
        `;
        container.appendChild(p);
        p.addEventListener('animationend', () => p.remove());
    }

    setInterval(makePetal, 350);
}

// ============ 갤러리 (Swiper) ============
function initGallery() {
    const wrapper = document.getElementById('gallery-wrapper');
    if (!wrapper) return;

    GALLERY.forEach((src, idx) => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `<img src="${src}" alt="갤러리 ${idx+1}" loading="lazy">`;
        slide.addEventListener('click', () => openModal(idx));
        wrapper.appendChild(slide);
    });

    new Swiper('.gallery-swiper', {
        slidesPerView: 1,
        spaceBetween: 0,
        centeredSlides: true,
        pagination: { el: '.swiper-pagination', clickable: true },
        navigation: {
            prevEl: '.swiper-button-prev',
            nextEl: '.swiper-button-next',
        },
        loop: true,
    });
}

// ============ 갤러리 모달 ============
function openModal(idx) {
    currentIdx = idx;
    document.getElementById('modal-img').src = GALLERY[idx];
    document.getElementById('gallery-modal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    document.getElementById('gallery-modal').classList.remove('active');
    document.body.style.overflow = '';
}

document.getElementById('modal-prev')?.addEventListener('click', () => {
    currentIdx = (currentIdx - 1 + GALLERY.length) % GALLERY.length;
    document.getElementById('modal-img').src = GALLERY[currentIdx];
});

document.getElementById('modal-next')?.addEventListener('click', () => {
    currentIdx = (currentIdx + 1) % GALLERY.length;
    document.getElementById('modal-img').src = GALLERY[currentIdx];
});

document.getElementById('gallery-modal')?.addEventListener('click', e => {
    if (e.target === e.currentTarget) closeModal();
});

document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
});

// ============ 계좌 복사 ============
function copyText(text, el) {
    navigator.clipboard.writeText(text).then(() => {
        const btn = el.querySelector('.copy-btn');
        if (btn) {
            btn.textContent = '✓ 복사됨';
            setTimeout(() => btn.textContent = '복사', 2000);
        }
    }).catch(() => {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        const btn = el.querySelector('.copy-btn');
        if (btn) {
            btn.textContent = '✓ 복사됨';
            setTimeout(() => btn.textContent = '복사', 2000);
        }
    });
}

// ============ 방명록 ============
function initGuestbookForm() {
    const form = document.getElementById('guestbook-form');
    if (!form) return;

    form.addEventListener('submit', async e => {
        e.preventDefault();
        const msg = document.getElementById('form-msg');
        const data = {
            visitor_name: document.getElementById('visitor-name').value.trim(),
            visitor_id: document.getElementById('visitor-id').value.trim(),
            password: document.getElementById('visitor-password').value.trim(),
            message: document.getElementById('visitor-message').value.trim(),
        };

        try {
            const res = await fetch('/api/guestbook/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            const result = await res.json();
            if (res.ok) {
                msg.style.color = '#5f8b9b';
                msg.textContent = '✓ 메시지가 등록되었습니다!';
                form.reset();
                loadGuestbook();
            } else {
                msg.style.color = '#BB7273';
                msg.textContent = result.error || '오류가 발생했습니다.';
            }
        } catch {
            msg.style.color = '#BB7273';
            msg.textContent = '네트워크 오류가 발생했습니다.';
        }
        setTimeout(() => msg.textContent = '', 3000);
    });
}

async function loadGuestbook() {
    const list = document.getElementById('guestbook-list');
    if (!list) return;

    try {
        const res = await fetch('/api/guestbook/list');
        const items = await res.json();

        if (!items.length) {
            list.innerHTML = '<p class="list-empty">첫 번째 축하 메시지를 남겨주세요 💌</p>';
            return;
        }

        list.innerHTML = items.map(item => {
            const d = new Date(item.date);
            const dateStr = `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
            return `
            <div class="guestbook-item" id="gi-${item.id}">
                <div class="guestbook-item-header">
                    <span class="guestbook-item-name">${esc(item.name)}</span>
                    <div style="display:flex;gap:8px;align-items:center;">
                        <span class="guestbook-item-date">${dateStr}</span>
                        <button class="del-btn" onclick="deleteItem(${item.id})">삭제</button>
                    </div>
                </div>
                <p class="guestbook-item-msg">${esc(item.message)}</p>
            </div>`;
        }).join('');
    } catch {}
}

function esc(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

// ============ 지도 ============
function initMap() {
    if (!document.getElementById('map')) return;
    const lat = 37.27256, lng = 127.44386;
    const map = L.map('map', { zoomControl: true, scrollWheelZoom: false }).setView([lat, lng], 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap'
    }).addTo(map);
    const icon = L.divIcon({
        className: '',
        html: `<div style="
            background:var(--bride,#BB7273);
            width:36px;height:36px;border-radius:50% 50% 50% 0;
            transform:rotate(-45deg);border:3px solid #fff;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
        "></div>`,
        iconSize: [36, 36],
        iconAnchor: [18, 36],
    });
    L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup('<b>빌라드아모르 이천</b><br>르블루 씨엘홀')
        .openPopup();
}

function navOpen(appUrl, webUrl) {
    const ua = navigator.userAgent;
    if (/android/i.test(ua) || /iphone|ipad/i.test(ua)) {
        window.location.href = appUrl;
        setTimeout(() => window.open(webUrl, '_blank'), 1500);
        return false;
    }
    return true;
}

// ============ 방명록 삭제 ============
async function deleteItem(id) {
    const pw = prompt('비밀번호를 입력하세요:');
    if (pw === null) return;
    try {
        const res = await fetch('/api/guestbook/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, password: pw }),
        });
        const result = await res.json();
        if (res.ok) {
            const el = document.getElementById(`gi-${id}`);
            if (el) el.remove();
        } else {
            alert(result.error || '삭제 실패');
        }
    } catch {
        alert('네트워크 오류');
    }
}

// ============ 교통 안내 모달 ============
function openTransportModal() {
    const modal = document.getElementById('transport-modal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

function closeTransportModal() {
    const modal = document.getElementById('transport-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// 모달 배경 클릭으로 닫기
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('transport-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeTransportModal();
            }
        });
    }
});

// ESC 키로 닫기
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeTransportModal();
    }
});
