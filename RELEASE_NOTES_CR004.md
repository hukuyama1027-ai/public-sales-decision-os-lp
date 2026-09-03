# RELEASE NOTES｜AIMOS-CR-004

- 版数: v0.1
- 状態: PRODUCTION / SYSTEM_UAT_PASS / HUMAN_VISUAL_UAT_PENDING
- リリース日: 2026-09-03
- Production Commit: `35d0a68c7955131fd2bb96ddfd0fbe98c4932ca4`

CR-003の実公共案件機能を維持し、無料版UI/UXを「公共案件版の求人・就活サイト」メンタルモデルへ再設計した。

## 主な変更

- 「今日やること」を最上位にしたHome
- 「あなたへのおすすめ案件」を検索より前に表示
- 求人サイト型案件カード
- GO / WATCH / NO-GO + match band
- おすすめ理由 / 要確認事項
- WATCH保存と意味のある原典変更に基づく更新判定
- 企業プロフィール完成度
- 案件詳細の「判断 → 原典 → NEXT ACTION / 応募準備」導線
- スマホ主要5ナビ / PC主要ナビ
- CR-003/CR-004比較用 `release_version`
- GitHub Actions OIDCによるM3 Evidence自動取得
- synthetic UAT/smoke trafficを市場Evidenceから除外

## Production確認

- Automated Test: 102/102 PASS
- Production live-smoke: PASS
- Production P0 E2E: PASS
- D1 schema: `cr004`
- 実官公需案件検索: PASS
- OIDC Evidence export: PASS
- sanitized artifact: PASS
- BLOCKING: 0
- P0重大不具合: 0

## Evidence

Evidence export run `33735462738` で30日集計artifactを生成済み。
CR-004は公開直後のため実ユーザー利用Evidenceはまだ0であり、市場価値判定は継続する。

## 受入状態

System UATはPASS。
Human Visual UATはPENDINGであり、ユーザー本人の確認完了前にDONEとはしない。

## 既知の制約

- 官公需情報ポータルAPIは全公共案件を網羅しない。
- GO/WATCH/NO-GOは正式な参加資格・法的判断ではない。
- 期限・資格・条件は原典を優先する。
- 高度AI公共営業コンシェルジュ等はP1。
