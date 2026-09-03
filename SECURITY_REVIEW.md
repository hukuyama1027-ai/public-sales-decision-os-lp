# SECURITY_REVIEW｜AIMOS-CR-004

- 文書ID: AIMOS-LP-SEC-001
- 版数: v0.2
- 状態: PASS_WITH_CONTROLS
- 対象: CR-003 Production + CR-004 + Evidence Export

## 1. 結論
CR-004 P0およびEvidence自動集計の実装を妨げるBLOCKINGセキュリティ事項は0。CR-003既存controlを維持し、OIDC認証controlを追加する。

## 2. 継続Control
- high-entropy client token / D1 raw token非保存
- private stateはclient_key scope
- source/user textはHTMLとして挿入しない
- arbitrary URL fetch禁止
- 官公需API endpoint固定
- PIIをProduct Usage eventへ保存しない
- source情報とOS/AI参考情報を分離
- AI単独で正式資格/期限/金額/法的適格性を確定しない
- CSP / nosniff / referrer / permissions policy

## 3. CR-004 UIリスク
### S-CR004-01 誤認誘導
GO/マッチ度が正式参加可否に見えるリスク。
Control: GO/WATCH/NO-GOの意味を明示、マッチ度はband主表示、正式可否保証noticeをDetailへ常設。

### S-CR004-02 推測tag
取得できない条件を便利tagとして生成するリスク。
Control: feature tagは直接原典またはdeterministic matcher根拠のみ。公共実績不要/オンライン提出等は構造化根拠なしでは表示禁止。

### S-CR004-03 WATCH更新誤警告
Control: source_hash_snapshotと現在raw_hashの差がある時だけ更新あり。legacy NULLはfalse。

## 4. Evidence Endpoint Threat Model
### S-EV-01 無認証アクセス
Control: GitHub OIDC JWT必須。missing/malformed 401。

### S-EV-02 他repo/workflowの正規GitHub JWT
Control: signatureだけでなくaud/repository/ref/workflow_refをexact verify。403。

### S-EV-03 JWT偽造
Control: RS256 signatureをGitHub fixed JWKSでWebCrypto verify。alg固定、kid一致。JWT supplied jku/x5uを使わない。

### S-EV-04 Replay
GitHub OIDCは短命。exp/nbf/iatを検証し、集計APIはread-only/idempotent。リプレイされても短期間の同じaggregate取得以上の権限を持たない。

### S-EV-05 Metrics data leakage
Control: raw event/IDs/session/search terms/profile/company/emailを出力しない。固定集計fieldのみ。

### S-EV-06 SQL abuse
Control: days allowlist、固定SQL。任意dimension/filter/query/sql入力なし。

### S-EV-07 JWKS SSRF
Control: JWKS URLはコード定数。token header URLを参照しない。

### S-EV-08 Artifact leakage
Artifact内容は集計値のみ。raw identifiersを含めない。GitHub runによる監査性を確保。

## 5. GitHub OIDC Trust
Expected:
- issuer: token.actions.githubusercontent.com
- audience: aimos-public-sales-evidence
- repository: hukuyama1027-ai/public-sales-decision-os-lp
- ref: refs/heads/main
- workflow_ref: .../.github/workflows/evidence-export.yml@refs/heads/main

Workflow権限はcontents:read + id-token:writeのみ。

## 6. Event Comparison
release_versionはserver-side constantで付与し、client bodyから採用しない。ユーザーが比較groupを偽装できない。

## 7. Data Retention
既存D1 retention方針を維持。Evidence artifact retentionは30日。artifact生成失敗でもProduction public機能に影響させない。

## 8. Cost Abuse
Evidence workflowはdaily + manualのみ。Endpoint自身はOIDC必須のため外部botによるD1集計乱用を防ぐ。

## 9. Security Gate
- BLOCKING: 0
- Mandatory before merge: OIDC signature/claims tests, unauthorized production smoke, raw-field absence test, existing CR-003 security regression
- Re-review trigger: real account auth, payment, automated submission, new external provider, public metrics exposure
