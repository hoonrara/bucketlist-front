# 🎯 버킷리스트 (Bucketlist) 프론트엔드

내가 이루고 싶은 버킷리스트들을 등록하고, 완료하면 사진, 후기 등을 기록할 수 있는  
**버킷리스트 기록 + 감성 시각화 웹앱**입니다.

> 📌 현재는 localStorage 기반으로 작동되며, 추후 Spring Boot 백엔드와 연동 예정입니다.

---

## 🚀 주요 기능 (Frontend - React + Vite)

### ✅ 버킷리스트 메인
- 전체 / 완료 / 미완료 필터 보기
- 드래그로 순서 정렬
- 감성 카드 디자인 UI

### ✅ 상세 페이지 (Detail)
- 제목/설명 수정
- 완료 여부 토글 (날짜 직접 선택)
- 사진 여러 장 업로드 및 삭제
- 후기(감상평) 작성 및 수정

---

## 🛠 기술 스택

- **Frontend**: React (Vite), Tailwind CSS
- **State 관리**: useState, useEffect (localStorage 기반)
- **기타 라이브러리**
  - `react-datepicker`: 완료 날짜 선택
  - `@hello-pangea/dnd`: 드래그 앤 드롭 카드 정렬

---

## 📂 폴더 구조

```bash
bucketlist-front/
├── public/
├── src/
│   ├── components/   # 재사용 가능한 UI 컴포넌트
│   ├── pages/        # 라우팅되는 페이지
│   ├── App.jsx
│   └── main.jsx
├── .gitignore
├── README.md
├── package.json
└── vite.config.js
