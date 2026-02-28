# 기억력 챌린지 (Memory Challenge)

하루 1개 카테고리로 진행되는 1분 세션형 단어 기억 게임.  
같은 카테고리에 속한 12개의 단어 중 10개가 빠르게 지나가고, 플레이어는 순수 기억으로 봤던 것과 안 봤던 것을 구분해야 한다.

## 게임 방법

1. 오늘의 카테고리가 공개된다 (하루 1개, 모든 유저 동일)
2. 같은 카테고리 단어 12개 중 **10개**가 하나씩 빠르게 지나간다
3. 이후 12개 단어가 모두 섞여 선택지로 제시된다
   - **기본 모드**: 방금 봤던 단어 10개를 골라낸다
   - **리버스 모드**: 보여주지 않았던 단어 2개를 골라낸다
4. 오답 2회 또는 목표 단어를 모두 선택하면 종료
5. **다시 보기** 기능으로 단어를 재확인할 수 있으나 점수가 차감된다
6. 결과 화면에서 점수, 소요 시간, 놓친 단어를 확인하고 리더보드에 등록한다

> **핵심**: 12개 단어는 모두 같은 카테고리다. 카테고리에 맞지 않는 단어를 찾는 게임이 아니라, 순수하게 기억력으로 본 것과 안 본 것을 구별하는 게임이다.

## 점수 계산

| 항목 | 점수 |
|------|------|
| 기본 점수 | 1,000점 |
| 오답 1회 | -100점 |
| 다시 보기 1회 | -150점 |
| 소요 시간 | -1점/초 |

## 기술 스택

| 분류 | 기술 |
|------|------|
| 프론트엔드 | React + TypeScript + Vite |
| 스타일링 | Tailwind CSS |
| 애니메이션 | Framer Motion |
| 상태 관리 | Zustand |
| 백엔드/DB | Supabase (PostgreSQL + RLS) |
| 모바일 | Capacitor (iOS + Android) |
| 배포 | Vercel (웹), Xcode (App Store), Android Studio (Google Play) |

## 프로젝트 구조

```
src/
├── pages/
│   ├── Home.tsx          # 모드 선택, 오늘의 카테고리 안내
│   ├── Game.tsx          # 암기 및 선택 화면
│   ├── Result.tsx        # 결과 및 점수 등록
│   └── Leaderboard.tsx   # 일간/주간 리더보드
├── components/
│   ├── game/
│   │   ├── WordDisplay.tsx   # 단어 순차 표시 (플립 애니메이션)
│   │   ├── ChoiceGrid.tsx    # 12개 선택지 그리드
│   │   ├── Timer.tsx         # 소요 시간 타이머
│   │   └── ReviewModal.tsx   # 다시 보기 모달
│   └── leaderboard/
│       ├── ScoreRow.tsx
│       └── TabSwitcher.tsx   # 일간/주간 탭
├── hooks/
│   ├── useGame.ts        # 게임 진행 로직, Supabase 카테고리 fetch
│   ├── useTimer.ts       # 타이머 관리
│   └── useLeaderboard.ts # 리더보드 조회 및 점수 제출
├── store/
│   └── gameStore.ts      # Zustand 전역 상태
└── lib/
    └── supabase.ts       # Supabase 클라이언트, 게스트 ID 관리
```

## 시작하기

### 1. 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env` 파일 생성 (Supabase 없이도 데모 데이터로 실행 가능):

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

Supabase 연결 없이도 데모 카테고리(과일)로 바로 게임 테스트 가능하다.

## Supabase 설정 (리더보드 활성화)

[SUPABASE_SETUP.md](./SUPABASE_SETUP.md) 참고.

DB 스키마는 `supabase/migrations/` 에 있다:
- `001_initial_schema.sql` — 테이블 및 RLS 정책
- `002_sample_data.sql` — 오늘 날짜 샘플 카테고리 (과일 12개)

## 모바일 빌드

### iOS (App Store)

```bash
npm run cap:ios
```

Xcode가 열리면 **Signing & Capabilities**에서 Team을 설정하고 실행.

### Android (Google Play)

```bash
npm run cap:android
```

Android Studio가 열리면 Gradle Sync 완료 후 실행.

## 배포 (앱인토스 / 웹)

```bash
npm run build
# dist/ 폴더를 Vercel 등에 배포한 뒤, 해당 URL을 앱인토스 웹뷰로 등록
```

## 인증 전략

- **현재**: 게스트 플레이. 브라우저 `localStorage`에 UUID 저장, 닉네임만 입력하면 리더보드 참여 가능
- **추후**: Supabase Auth를 통한 카카오/구글 소셜 로그인 연동
