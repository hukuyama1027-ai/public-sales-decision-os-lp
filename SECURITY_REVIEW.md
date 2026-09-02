# SECURITY_REVIEW｜AIMOS-CR-003

- 文書ID: AIMOS-LP-SEC-001
- 版数: v0.1
- 状態: PASS_WITH_CONTROLS
- 対象: LP + 無料版公共営業OS v0.1

## 1. 結論
P0実装を妨げるBLOCKINGセキュリティ事項は0。以下の設計Controlを必須実装とする。

## 2. Threat / Control
### S-01 匿名状態の乗っ取り
Risk: client token漏洩によりprofile/WATCH参照。
Control: 256bit相当token、localStorage、URL非掲載、D1にはSHA-256のみ、same-origin TLS、他client_key検索禁止。

### S-02 IDOR
Risk: opportunity/profile/watch IDの差替え。
Control: public opportunityは公開データのみ。private stateはすべて`client_key`をWHERE条件へ含める。profile IDを外部入力にしない。

### S-03 XSS
Risk: 公共案件タイトル/概要/会社入力にHTML。
Control: DOM `textContent`中心。innerHTMLでsource/user dataを描画しない。CSP。URL scheme validation。

### S-04 SSRF/Open Proxy
Risk: source URLを利用してFunctionに任意fetch。
Control: upstream endpointはコード定数。任意fetch endpointを作らない。source linksはブラウザ遷移のみ。

### S-05 API abuse / upstream excessive access
Control: D1 cache、query freshness、同一query短時間抑止、Count上限、upstream1検索1回以下、Cron低頻度。

### S-06 PII leakage
Control: LP leadsとproduct profileを自動結合しない。product eventsにemail/company/services本文を入れない。AIへlead情報を渡さない。

### S-07 AI hallucinated eligibility
Control: deterministic source/rule優先。AI単独で正式資格/法的適格/期限/金額を決定しない。UIラベルと原典確認notice。

### S-08 Prompt injection from procurement text
Risk: 原典本文にAIへの命令文が含まれる。
Control: source textを`untrusted source facts`としてsystem instructionより下位に配置。外部tool execution権限をAIへ与えない。AI回答で自動応募/外部送信しない。

### S-09 Free quota exhaustion
Control: Free枠上限時は503/AI_FREE_LIMITで縮退。自動Paid移行しない。静的LP/キャッシュ閲覧を可能な限り維持。

### S-10 Data deletion
Control: `DELETE /api/profile`でcurrent client private stateを削除。確認UI。eventsのclient_keyは匿名化(null)可能。既存leadsは別の同意/用途で保持。

## 3. Privacy Classification
- opportunity source data: public
- anonymous token hash: pseudonymous technical identifier
- company profile: business information / potentially identifying company data
- WATCH/search/recent: behavioral data
- LP email: direct contact data, product profileと分離

## 4. Headers
CSP / Referrer-Policy / X-Content-Type-Options / frame-ancestors / Permissions-PolicyをP0必須。

## 5. Logging
console logsへraw token、profile本文、email、AI question全文を出さない。外部APIエラーはstatus/error code中心。

## 6. External Data Compliance
官公需情報ポータルAPI利用表記・リンク・非網羅性免責をUIへ表示。大量/継続アクセスを避け、キャッシュする。競合サービスデータは取得しない。

## 7. AI Safety Gate
AIコンシェルジュP1を公開する前に、TP-AI-001..005をPASSする。P0はAIなしでも価値検証可能。

## 8. Security Gate
- BLOCKING: 0
- P0 Mandatory Controls: token hash, IDOR scoping, input validation, CSP, URL validation, upstream allowlist, event PII policy, deletion endpoint
- Re-review trigger: 認証/課金/外部送信/自動応募/新しいデータ源/AI tool-use追加
