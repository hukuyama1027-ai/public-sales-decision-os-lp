# AGENTS.md

## Project
公共営業 意思決定OS｜需要検証LP

## Source of Truth
1. REQUIREMENTS.md
2. BASIC_DESIGN.md
3. UI_DESIGN.md
4. DETAIL_DESIGN.md
5. TEST_PLAN.md
6. PROJECT_STATE.md

## Rules
- 実課金を実装しない。
- 有料サービス、有料広告を追加しない。
- 架空の導入実績、顧客数、口コミ、受注成功率を掲載しない。
- 実サービス完成済みと誤認させない。
- 全国入札DB、クローラー、本格AI判定へスコープ拡張しない。
- 個人情報は最小限にし、GETで公開しない。
- 依存パッケージを追加する前に必要性を確認する。
- 仕様変更が必要ならコードで独断変更せずISSUE_LOGへ記録する。

## Completion
TEST_PLANの自動テストPASS、重大バグ0、公開可能な静的/Functions/D1構成、PROJECT_STATE更新。
