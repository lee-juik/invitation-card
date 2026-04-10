# 🎉 이주익 & 손주현 결혼식 모바일 청첩장

## 📋 프로젝트 개요
- **신랑**: 이주익
- **신부**: 손주현
- **예식일**: 2026년 6월 27일 (토) 11:00
- **장소**: 빌라드아모르 이천 르블루 씨엘홀
- **배포 기한**: 2026년 7월 1일

## 🎨 기능

### ✨ 메인페이지
- 풀스크린 배경 이미지
- 장미꽃잎 애니메이션 (CSS 기반)
- 우아한 분홍색 테마

### 📸 갤러리
- 17장 사진 반응형 그리드
- 모달 팝업 (확대 기능 제거)
- 좌우 네비게이션 + 키보드 컨트롤

### 📝 방명록
- 비회원 간편 입력 (ID 2자, PW 4자 이상)
- 실시간 방명록 목록
- IP 주소 자동 기록 (관리자만 조회)
- 마스터 로그인으로 악플 삭제 기능

### 💰 축의금 안내
- 신랑측 & 신부측 계좌 (2개씩)
- 화환 사양 멘트 포함

### 🚗 오시는 길
- 자가용 & 대중교통 정보
- 주소 및 약도

## 🛠 기술 스택
- **Backend**: Flask (Python 3.8+)
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Database**: SQLite
- **Hosting**: Heroku / Railway (7월 1일까지)

## 📁 프로젝트 구조
```
invitation-card/
├── app.py                    # Flask 메인 앱
├── requirements.txt          # Python 패키지
├── invitation.db             # SQLite 데이터베이스 (자동 생성)
├── templates/
│   └── index.html            # 메인 HTML
└── static/
    ├── css/
    │   └── style.css         # 메인 스타일 (분홍 우아한 테마)
    ├── js/
    │   └── app.js            # 자바스크립트 (갤러리, 방명록 등)
    └── images/
        ├── main/
        │   └── main.jpg      # 메인 배경 사진 (받음)
        └── gallery/
            ├── photo-01.jpg
            ├── photo-02.jpg
            ...
            └── photo-17.jpg  # 갤러리 17장 (받음)
```

## 🚀 실행 방법

### 1. 환경 설정
```bash
cd /home/leejuik/projects/invitation-card
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. 사진 배치
```bash
# 메인사진을 static/images/main/ 에 main.jpg 로 저장
# 갤러리 17장을 static/images/gallery/ 에 photo-01.jpg ~ photo-17.jpg 로 저장
```

### 3. 앱 실행
```bash
python app.py
# http://localhost:5000 에서 접근
```

### 4. 배포 (Railway 예시)
```bash
# Procfile 생성
echo "web: python app.py" > Procfile

# Git 커밋 & 푸시
git add .
git commit -m "Initial commit"
git push origin main
```

## 🔑 마스터 계정
- **ID**: `wndlrdl123`
- **PW**: `wndlrl123`

## 📋 체크리스트

- [x] 메인사진 main.jpg 저장
- [x] 갤러리 17장 photo-01.jpg ~ photo-17.jpg 저장
- [x] Flask 설치 & 로컬 테스트 완료
- [x] 자가용 + 버스 안내 이미지 (transport-guide.jpg) 적용
- [ ] Railway 배포 설정
- [ ] 도메인 설정 (선택)
- [ ] 최종 테스트

## 🎯 다음 단계
1. 사진 저장 & 배포 테스트
2. 자가용/버스 안내 이미지 적용
3. Railway 배포 및 SSL 설정
4. 최종 테스트 및 배포 (2026년 7월 1일 이전)

## 📞 문의
주익님께 직접 문의하세요.

---
**최종 배포일**: 2026년 7월 1일
