# GitHub Actions ↔ Jira 연동 설정

PR 생성·머지 시 Jira 카드 상태를 자동으로 변경합니다.

| 이벤트                          | 워크플로                 | 기대 동작                |
| ------------------------------- | ------------------------ | ------------------------ |
| PR 생성 (`opened` / `reopened`) | `jira-pull-request.yml`  | 진행 중 → **PR 대기**    |
| PR 머지 (`merged`)              | `jira-transition-pr.yml` | PR 대기 → **완료**       |
| PR 열림/업데이트                | `test-pull-request.yml`  | lint · typecheck · build |

## 구성

- Jira Cloud REST API 연동: [`frieder/gha-jira-login`](https://github.com/frieder/gha-jira-login) · [`frieder/jira-issue-transition`](https://github.com/frieder/jira-issue-transition)
- 이슈 키는 PR **제목**과 **소스 브랜치**에서 `WEATHER-16` 형식으로 추출합니다.
- 공통 로직:
  - `.github/actions/extract-jira-key`
  - `.github/actions/jira-transition`

## 사전 조건

- PR **제목** 또는 **소스 브랜치**에 Jira 키 포함 (예: `WEATHER-16 feat: ...`, `WEATHER-16/header`)
- Jira 워크플로에 `진행 중` → `PR 대기`, `PR 대기` → `완료` 전환이 존재
- **Jira Automation**에서 동일한 PR 전환 규칙이 있으면 **비활성화** (중복 전환 방지)

## GitHub Secrets (필수)

레포 **Settings → Secrets and variables → Actions → New repository secret**

| Secret            | 예시                                                                              |
| ----------------- | --------------------------------------------------------------------------------- |
| `JIRA_BASE_URL`   | `https://your-team.atlassian.net`                                                 |
| `JIRA_USER_EMAIL` | Jira 로그인 이메일                                                                |
| `JIRA_API_TOKEN`  | [Atlassian API 토큰](https://id.atlassian.com/manage-profile/security/api-tokens) |

## Repository Variables (선택)

전환 이름이 워크플로 기본값과 다를 때만 설정합니다.

| Variable                     | 기본값    | 설명                            |
| ---------------------------- | --------- | ------------------------------- |
| `JIRA_TRANSITION_TO_PR_WAIT` | `PR 대기` | PR 생성 시 실행할 **전환** 이름 |
| `JIRA_TRANSITION_TO_DONE`    | `완료`    | PR 머지 시 실행할 **전환** 이름 |

> **상태 이름 ≠ 전환 이름**일 수 있습니다. Jira 이슈 → **전환** 메뉴에 표시되는 라벨을 그대로 넣으세요.

## 트러블슈팅

- **키를 못 찾음**: PR 제목·브랜치에 `WEATHER-16` 형식이 있는지 확인
- **전환 실패**: 현재 상태에서 해당 전환이 가능한지, Variable/전환 이름이 맞는지 확인
- **권한 오류**: API 토큰 사용자가 해당 이슈를 전환할 수 있는지 확인
- **Actions 실패**: Secrets·전환 이름·Jira Automation 중복 여부 확인
