# 전환스크립트 자동 설치/관리 MVP

광고대행사가 광고주 자사몰에 통합 스크립트 1개를 최초 1회 설치하도록 안내하고, 이후 관리자 페이지에서 GA4, Google Ads, Naver, Meta, Danggeun 태그와 이벤트 실행 조건을 관리하는 웹 기반 MVP입니다.

이 프로젝트는 광고주 사이트에 무단으로 코드를 삽입하지 않습니다. 광고주 또는 사이트 관리자 권한이 있는 담당자가 직접 공통 HEAD 영역에 통합 스크립트를 설치한다는 전제로 동작합니다.

## 설치 방법

```bash
npm install
```

## 실행 방법

```bash
npm run dev
```

브라우저에서 `http://localhost:3000`을 엽니다.

## 컴퓨터가 꺼져도 사용하는 방법

로컬 PC가 꺼져도 계속 사용하려면 Render, Railway, Fly.io, VPS 같은 클라우드 서버에 배포해야 합니다. 이 프로젝트는 Render 배포를 바로 할 수 있도록 `render.yaml`을 포함합니다.

Render 배포 흐름:

1. 이 프로젝트를 GitHub, GitLab, Bitbucket 저장소에 push합니다.
2. Render Dashboard에서 `New` → `Blueprint`를 선택합니다.
3. 저장소를 연결하고 `render.yaml`을 적용합니다.
4. Render가 `npm ci && npm run build` 후 `npm start`로 서버를 실행합니다.
5. `ADMIN_PASSWORD`를 설정하면 관리자 화면과 관리 API가 비밀번호로 보호됩니다.
6. `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`를 설정하면 광고주 데이터가 Supabase에 저장됩니다.

배포 후에는 설치 스크립트가 자동으로 Render 도메인을 사용합니다.

```html
<script src="https://YOUR-SERVICE.onrender.com/tag-loader.js" data-client-id="CLIENT_ID"></script>
```

무료 플랜은 일정 시간 미사용 시 cold start가 발생할 수 있습니다. Supabase를 연결하지 않으면 재배포/재시작 시 로컬 JSON 데이터가 초기화될 수 있으므로 실제 운영에서는 Supabase/Firebase 같은 외부 DB를 권장합니다.

## 운영 안전 설정

Render 서비스의 `Environment` 메뉴에서 아래 값을 설정하세요.

```text
ADMIN_USERNAME=admin
ADMIN_PASSWORD=원하는_관리자_비밀번호
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=Supabase service_role key
```

`ADMIN_PASSWORD`를 설정하면 관리자 페이지 접속 시 브라우저 기본 로그인 창이 뜹니다. `/tag-loader.js`, `/api/tags`, `/api/health`는 광고주 사이트에서 접근해야 하므로 공개 상태를 유지합니다.

## Supabase 연결 방법

1. Supabase에서 새 프로젝트를 만듭니다.
2. SQL Editor에서 [supabase-schema.sql](./supabase-schema.sql) 내용을 실행합니다.
3. Project Settings → API에서 `Project URL`을 복사해 Render의 `SUPABASE_URL`에 넣습니다.
4. `service_role` key를 복사해 Render의 `SUPABASE_SERVICE_ROLE_KEY`에 넣습니다.
5. Render에서 `Manual Deploy` → `Deploy latest commit`을 실행합니다.

`service_role` key는 서버 전용 비밀키입니다. 브라우저 코드에 노출하지 말고 Render 환경변수에만 저장하세요.

## 광고주 등록 방법

1. 좌측 메뉴에서 `광고주 관리`로 이동합니다.
2. `신규 광고주 등록` 버튼을 클릭합니다.
3. 광고주명, 사이트 URL, 쇼핑몰 솔루션 유형, 담당자 메모를 입력합니다.
4. Client ID는 자동 생성됩니다.
5. `저장` 버튼을 클릭합니다.

초기 더미 데이터는 다음 광고주로 구성되어 있습니다.

- 파르페by알레르망
- 엔젯오리진
- 하우스테일러

## 통합 스크립트 설치 방법

좌측 메뉴의 `설치 스크립트`에서 광고주별 통합 스크립트를 복사합니다.

```html
<script src="http://localhost:3000/tag-loader.js" data-client-id="CLIENT_ID"></script>
```

설치 위치:

- 공통 스크립트는 `</head>` 이전 또는 쇼핑몰의 공통 HEAD 영역에 설치합니다.
- 구매완료 이벤트는 구매완료 페이지 URL에 맞게 실행 조건 URL을 설정합니다.
- 관리자 권한이 있는 광고주 사이트에만 설치해야 합니다.

## 태그 관리 방법

`광고주 관리` 화면에서 광고주를 선택한 뒤 매체별 태그를 ON/OFF 할 수 있습니다.

- GA4: Measurement ID
- Google Ads: Conversion ID, Conversion Label
- Naver: 전환 스크립트 ID 또는 전체 스크립트
- Meta: Pixel ID
- Danggeun: Pixel ID 또는 전체 스크립트

이벤트는 PageView, ViewContent, AddToCart, BeginCheckout, Purchase, CompleteRegistration, Lead를 지원합니다. 각 이벤트마다 사용 여부, URL contains 조건, 전환값 사용 여부, 매출액 변수명, 주문번호 변수명을 설정할 수 있습니다.

## 설치 검수 방법

좌측 메뉴의 `설치 검수`에서 검수를 실행합니다.

검수 방식:

- URL 검수: 서버에서 광고주 URL HTML을 가져와 확인합니다.
- HTML 붙여넣기 검수: 브라우저 CORS, 방화벽, SSL 정책 등으로 URL 검수가 실패할 때 광고주 사이트 HTML 소스를 붙여넣어 확인합니다.

검수 항목:

- 통합 스크립트 설치 여부
- `data-client-id` 존재 여부
- 중복 설치 여부
- GA4 Measurement ID 형식
- Google Ads Conversion ID 형식
- Meta Pixel ID 형식
- 이벤트 URL 조건 설정 여부
- 구매완료 이벤트 설정 여부

## 주요 구조

- `app/api/clients`: 광고주 CRUD API
- `app/api/tags`: 광고주 사이트에서 읽는 태그 설정 API
- `app/api/validate`: 설치 검수 API
- `app/api/health`: 서버 상태 확인 API
- `public/tag-loader.js`: 광고주 사이트에 설치되는 통합 로더
- `data/clients.json`: 로컬 JSON 저장소
- `render.yaml`: Render 클라우드 배포 설정
- `supabase-schema.sql`: Supabase 테이블 생성 SQL
- `types/client.ts`: 타입 정의
- `lib/store.ts`: 저장소 추상화
- `lib/tag-utils.ts`: 설치 스크립트 및 태그 유틸
- `lib/validation.ts`: 검수 로직

## 추후 확장 방향

- Supabase 연동: `lib/store.ts`를 Supabase CRUD 구현으로 교체
- Firebase 연동: Firestore 기반 광고주/태그 설정 저장
- 로그인 기능: 대행사 내부 관리자 계정 로그인
- 권한 관리: 광고주별 조회/수정 권한 분리
- 크롬 확장 프로그램: 광고주 사이트에서 설치 여부와 이벤트 실행 여부를 현장 검수
- 카페24/Shopify API 연동: 앱 또는 테마 설정을 통한 관리자 승인 기반 설치 자동화

## 주의 사항

본 MVP는 로컬 개발과 구조 검증을 위한 도구입니다. 실제 운영에서는 HTTPS 배포, 인증/인가, 변경 이력, 스크립트 무결성, 광고주 동의 절차, 개인정보 처리 정책 검토가 필요합니다.
