# TEST_PLAN｜需要検証LP

- 文書ID: AIMOS-LP-TP-001
- 版数: v0.1
- 状態: APPROVED_BY_AI_TEST_DESIGN

## 要件トレーサビリティ
- TEST-001 → REQ-F-001〜004: 必須セクション・コピー・CTA配置
- TEST-002 → REQ-F-005〜011: フォーム項目・価格・利用希望
- TEST-003 → REQ-F-012: イベント種別実装
- TEST-004 → REQ-F-014: 需要検証版表示
- TEST-005 → REQ-NF-004/005: viewport / label / responsive CSS / focus
- TEST-006 → REQ-SEC-002/005/006: API validation / consent / GET非公開
- TEST-007 → SEO: meta/canonical/OGP/robots/sitemap

## 自動テスト
Node built-in test runnerを使用し外部依存なし。
1. HTML構造と必須コピー
2. CTA 4箇所以上
3. フォーム必須項目
4. 価格3プラン
5. 需要検証の免責表示
6. event handlerの許可イベント/拒否イベント
7. lead handlerの正常/必須不足/同意なし/honeypot
8. robots/sitemap存在

## 手動/実環境テスト
- Chrome/Edge/Safari相当の主要ブラウザ表示
- 360px/768px/1440px
- Cloudflare Pages実公開URL
- D1実保存
- HTTPS
- CTA→診断→完了
- KPIイベント確認

## UAT
ユーザーは以下のみ確認:
1. 公開URLをスマホで開く
2. CTAを押し診断を1件送信
3. 料金カードを1つ押す
4. 表現や見づらさがあればそのまま伝える
