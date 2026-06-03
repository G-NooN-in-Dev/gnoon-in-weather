# GitHub Actions ↔ Jira 연동 설정

브랜치 push·PR 생성·머지 시 Jira 카드 상태를 자동으로 변경합니다. 날짜 필드는 **KST(Asia/Seoul)** 기준입니다.

| 이벤트                          | 워크플로                   | 기대 동작                                              |
| ------------------------------- | -------------------------- | ------------------------------------------------------ |
| 브랜치 push (`weather-*`)       | `jira-transition-push.yml` | **해야 할 일** → **진행 중**, **시작 날짜** (최초 1회) |
| PR 생성 (`opened` / `reopened`) | `jira-pull-request.yml`    | 진행 중 → **PR 대기**                                  |
| PR 머지 (`merged`)              | `jira-transition-pr.yml`   | PR 대기 → **완료**, **End Date**                       |
| PR 열림/업데이트                | `test-pull-request.yml`    | lint · typecheck · build                               |

## 구성

- Jira Cloud REST API: [`frieder/gha-jira-login`](https://github.com/frieder/gha-jira-login) · [`frieder/jira-issue-transition`](https://github.com/frieder/jira-issue-transition)
- 이슈 키는 `weather-1`, `weather-2` … **브랜치 이름**에서 추출합니다 (Jira API 호출 시 `WEATHER-1`로 정규화).
- **시작 날짜**: push 시 해당 push 커밋 중 가장 이른 시각 → KST `yyyy-MM-dd`. 값이 있으면 덮어쓰지 않음.
- **End Date**: PR 머지 시 `merged_at` → KST `yyyy-MM-dd`.

### gnoon-in-dev (WEATHER) 예시 필드 ID

| Jira 화면 이름 | Variable Name           | 값                  |
| -------------- | ----------------------- | ------------------- |
| 시작 날짜      | `JIRA_FIELD_START_DATE` | `customfield_xxxxx` |
| End Date       | `JIRA_FIELD_END_DATE`   | `customfield_xxxxx` |

## 사전 조건

- 작업 브랜치 이름은 `weather-1`, `weather-2` 형식
- PR 소스 브랜치도 동일 형식 (`weather-*` → `main` 머지)
- Jira 워크플로에 **해야 할 일** → `진행 중`, `진행 중` → `PR 대기`, `PR 대기` → `완료` 전환이 존재
- **시작 날짜** 필드가 Jira에서 **잠겨 있으면** API로 수정 불가 → 필드 설정에서 편집 허용 필요
- **Jira Automation**에서 동일한 push/PR 전환 규칙이 있으면 **비활성화** (중복 전환 방지)

---

## 1. GitHub Secrets (필수)

**Settings → Secrets and variables → Actions → Secrets**

| Secret Name       | 넣을 값                                                                           |
| ----------------- | --------------------------------------------------------------------------------- |
| `JIRA_BASE_URL`   | `https://gnoon-in-dev.atlassian.net` (본인 Jira 도메인)                           |
| `JIRA_USER_EMAIL` | Atlassian 계정 이메일 (API 토큰을 만든 계정과 동일)                               |
| `JIRA_API_TOKEN`  | [Atlassian API 토큰](https://id.atlassian.com/manage-profile/security/api-tokens) |

---

## 2. GitHub Variables

**Settings → Secrets and variables → Actions → Variables**

### 날짜 필드 (자동 입력 시)

| Variable Name           | 예시 (gnoon-in-dev) | 설명             |
| ----------------------- | ------------------- | ---------------- |
| `JIRA_FIELD_START_DATE` | `customfield_xxxxx` | **시작 날짜** ID |
| `JIRA_FIELD_END_DATE`   | `customfield_xxxxx` | **End Date** ID  |

Variable이 없으면 해당 날짜 단계만 건너뜁니다.

### 상태 전환 이름 (기본값과 다를 때만)

| Variable Name                    | 기본값    |
| -------------------------------- | --------- |
| `JIRA_TRANSITION_TO_IN_PROGRESS` | `진행 중` |
| `JIRA_TRANSITION_TO_PR_WAIT`     | `PR 대기` |
| `JIRA_TRANSITION_TO_DONE`        | `완료`    |

---

## 3. 필드 ID 조회 (curl)

```bash
EMAIL="본인@이메일.com"
TOKEN="API토큰"
SITE="https://gnoon-in-dev.atlassian.net"

curl -sL -u "${EMAIL}:${TOKEN}" -H "Accept: application/json" \
  "${SITE}/rest/api/3/field" \
  | jq '.[] | select(.name | test("시작|End Date"; "i")) | {name, id}'
```

`SITE`는 **`/jira/software/...` 경로 없이** 도메인만 사용합니다. `301` HTML이 나오면 `-sL`과 URL을 확인하세요.

---

## 트러블슈팅

- **키를 못 찾음**: 브랜치·PR 소스가 `weather-xxx` 형식인지 확인
- **시작 날짜 미반영**: `JIRA_FIELD_START_DATE` 설정·필드 **잠금** 해제·API 계정 권한 확인 (실패해도 push 워크플로 전체는 `continue-on-error`로 진행)
- **Start Date가 안 바뀜**: 이미 값이 있으면 의도적으로 스킵 (첫 push 날짜 유지)
- **End Date 미반영**: `JIRA_FIELD_END_DATE`·권한 확인
