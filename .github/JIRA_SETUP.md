# GitHub Actions ↔ Jira 연동 설정

브랜치 push·PR 생성·머지 시 Jira 카드 상태를 자동으로 변경합니다. 날짜 필드는 **KST(Asia/Seoul)** 기준입니다.

| 이벤트                          | 워크플로                   | 기대 동작                                              |
| ------------------------------- | -------------------------- | ------------------------------------------------------ |
| 브랜치 push (`weather-*`)       | `jira-transition-push.yml` | **해야 할 일** → **진행 중**, **시작 날짜** (최초 1회) |
| PR 생성 (`opened` / `reopened`) | `jira-pull-request.yml`    | 진행 중 → **PR 대기**                                  |
| PR 머지 (`merged`)              | `jira-transition-pr.yml`   | 상위·**하위 subtask 전부** → **완료**, **End Date**    |
| PR 열림/업데이트                | `test-pull-request.yml`    | lint · typecheck · build                               |

## 구성

- Jira Cloud REST API: [`frieder/gha-jira-login`](https://github.com/frieder/gha-jira-login) · [`frieder/jira-issue-transition`](https://github.com/frieder/jira-issue-transition)
- push 시 이슈 키는 **브랜치 이름**(`weather-17` → `WEATHER-17`)과 **이번 push에 포함된 커밋 메시지 첫 줄**(`WEATHER-18 feat: ...` → `WEATHER-18`)에서 모두 추출합니다. 하위 작업(subtask)만 커밋 메시지에 적어도 해당 카드가 갱신됩니다.
- **시작 날짜**: push 시 해당 push 커밋 중 가장 이른 시각 → KST `yyyy-MM-dd`. 값이 있으면 덮어쓰지 않음.
- **End Date (PR 머지)**: **상위 이슈**는 머지일(KST)로 설정. **하위 subtask**는 End Date가 **비어 있을 때만** 머지일로 설정 (수동 입력값 유지).
- **End Date (하위 이슈 Jira에서 수동 완료)**: GitHub만으로는 불가 → **[JIRA_AUTOMATION_SUBTASK_END_DATE.md](./JIRA_AUTOMATION_SUBTASK_END_DATE.md)** 의 Jira Automation 규칙을 WEATHER 프로젝트에 켜야 합니다. 완료로 바꾼 **그날(KST)** · **End Date 비어 있을 때만** 설정.
- PR 머지 시 브랜치(`weather-17`)로 상위 키를 찾고, Jira API로 `subtasks`·`parent` 관계의 하위 이슈를 조회한 뒤 **각각** 완료 전환합니다.

### gnoon-in-dev (WEATHER) 예시 필드 ID

| Jira 화면 이름 | Variable Name           | 값                  |
| -------------- | ----------------------- | ------------------- |
| 시작 날짜      | `JIRA_FIELD_START_DATE` | `customfield_xxxxx` |
| End Date       | `JIRA_FIELD_END_DATE`   | `customfield_xxxxx` |

## 사전 조건

- 작업 브랜치 이름은 `weather-1`, `weather-2` 형식 (`weather-17-feature`처럼 suffix가 있으면 브랜치 키 추출 안 됨 → 커밋 메시지에 Jira 키 필수)
- subtask 작업 시 커밋 메시지에 **하위 이슈 키** 포함 (예: `WEATHER-18 feat: ...`). 브랜치는 상위(`weather-17`)여도 하위 카드가 **진행 중**·**시작 날짜** 대상이 됨
- PR 소스 브랜치도 동일 형식 (`weather-*` → `main` 머지)
- Jira 워크플로에 **해야 할 일** → `진행 중`, `진행 중` → `PR 대기`, `PR 대기` → `완료` 전환이 존재
- **시작 날짜** 필드가 Jira에서 **잠겨 있으면** API로 수정 불가 → 필드 설정에서 편집 허용 필요
- **Jira Automation**에서 push/PR과 **겹치는** 상태 전환 규칙이 있으면 **비활성화** (중복 전환 방지). 하위 이슈 **완료 시 End Date** 규칙은 [별도 문서](./JIRA_AUTOMATION_SUBTASK_END_DATE.md)대로 **추가**합니다.

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

- **키를 못 찾음**: 브랜치가 `weather-17` 형식인지, 커밋 첫 줄에 `WEATHER-18 feat: ...` 형식인지 확인. Actions 로그 `Extracted Jira keys` 확인
- **subtask만 반영 안 됨**: 예전 워크플로는 브랜치만 봄 → 커밋 메시지 추출이 포함된 최신 워크플로가 **main**에 머지됐는지 확인
- **시작 날짜 미반영**: `JIRA_FIELD_START_DATE` 설정·필드 **잠금** 해제·API 계정 권한 확인 (실패해도 push 워크플로 전체는 `continue-on-error`로 진행)
- **Start Date가 안 바뀜**: 이미 값이 있으면 의도적으로 스킵 (첫 push 날짜 유지)
- **End Date 미반영**: `JIRA_FIELD_END_DATE`·권한 확인
- **subtask가 완료 안 됨**: Jira에서 해당 항목이 **하위 작업(subtask)** 으로 연결돼 있는지 확인. Actions 로그 `Issues to complete` 배열 확인. 이미 완료된 subtask는 전환 실패할 수 있음 (`failOnError: false`로 나머지는 계속 처리)
- **하위 이슈 수동 완료인데 End Date 없음**: [JIRA_AUTOMATION_SUBTASK_END_DATE.md](./JIRA_AUTOMATION_SUBTASK_END_DATE.md) Automation 규칙이 켜져 있는지, JQL `End Date is EMPTY`·이슈 유형 Sub-task 조건 확인
