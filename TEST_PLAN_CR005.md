# TEST PLAN｜AIMOS-CR-005

- 文書ID: AIMOS-LP-TP-005
- 版数: v0.1
- 状態: APPROVED_FOR_BUILD

## 1. P0 Regression
1. flat opportunity `{source:"kkj", id, title,...}` を正しく正規化する。
2. nested view model `{source:{id,title,...}, decision,...}` を正しく正規化する。
3. flat itemの `source` 文字列を案件本体として扱わない。
4. 有効idのない案件でWATCH APIを呼ばない。
5. 有効案件のWATCH POST bodyが `{opportunity_id:<id>}` になる。
6. WATCH成功後に `aria-pressed=true` / label更新。
7. WATCH解除成功後に `aria-pressed=false` / label更新。

## 2. UI Static
8. Home visual heroが存在する。
9. Quick Access Tileに4種以上のSVG iconが存在する。
10. Search visual headerが存在する。
11. Bottom navigationにSVG iconが存在する。
12. 外部画像/CDN依存を追加しない。
13. mobile breakpointでillustration縮小・横overflow防止指定がある。

## 3. Existing Regression
- CR-003 tests 全PASS
- CR-004 tests 全PASS
- Evidence/OIDC tests 全PASS
- API tests 全PASS

## 4. Production Smoke
- `/api/health` PASS
- `/api/opportunities/search?q=AI&limit=3` に実案件id/titleが存在
- `/app/` 200

## 5. Production UI/E2E
- synthetic tokenで検索
- 実案件cardのtitle/organization表示
- WATCH追加
- WATCH一覧に同案件表示
- WATCH解除
- cleanup

## 6. UAT
修正Production反映後、Human Visual UATを再実施。
必須確認:
- 案件表示
- WATCH
- NEXT ACTION
- モバイル表示
- イラスト/アイコンを含む視覚的な分かりやすさ

## 7. Gate
P0 FAIL=0、BLOCKING=0、Production UI/E2E PASS後のみ再UATへ進む。
