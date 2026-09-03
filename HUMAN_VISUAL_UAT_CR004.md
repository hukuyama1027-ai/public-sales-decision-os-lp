# HUMAN VISUAL UAT｜AIMOS-CR-004

- 文書ID: AIMOS-LP-HUAT-004
- 版数: v0.2
- 状態: PENDING / USER ACTION REQUIRED
- 対象URL: https://public-sales-decision-os-lp.pages.dev/app/

## ユーザー確認はこの5つだけ

1. **Homeを開く**
   - 「今日やること」と「あなたへのおすすめ案件」が最初に分かるか。

2. **おすすめ案件を1件開く**
   - 案件名、発注機関、GO/WATCH/NO-GO、おすすめ理由、要確認が短時間で理解できるか。

3. **WATCHを1回追加してWATCH画面を見る**
   - 何を押せば保存できるか、保存した案件がどこにあるか迷わないか。

4. **案件詳細のNEXT ACTIONを見る**
   - 「次に何を確認すればいいか」が分かり、原典情報とOS参考判断を混同しないか。

5. **スマホ表示を確認する**
   - 下部5ナビが押しやすく、横スクロールや致命的な表示崩れがなく、主要操作に迷わないか。

## 判定方法

確認後、次のどれかだけ回答すればよい。

- **PASS**: このまま使える。
- **CONDITIONAL PASS**: 使えるが、直したい点がある。
- **FAIL**: 主要操作で迷う / 表示崩れ / 期待と違う。

細かい試験表への記入は不要。

「ここが分かりにくい」「このボタンの意味が分からない」も正式な不具合・改善Evidenceとして扱う。

## 完了条件

ユーザー本人の確認結果が記録されるまでHuman Visual UATはPENDING。
Automated Test / System UATのPASSでは代替しない。
