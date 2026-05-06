# CleanReport MVP

清掃レポート管理システム - 清掃スタッフが物件の清掃状況を報告・管理するためのWebアプリケーション

清掃現場で写真付きレポートを作成し、問題を記録。チェックリスト完了状態をリアルタイム更新できます。

## 🚀 プロジェクト構成

```
clean-report/
├── backend/           # Express.js + TypeScript + Prisma
├── frontend/          # React 18 + Vite + TypeScript + Tailwind CSS
├── docker-compose.yml # 開発環境設定
├── README.md          # このファイル
└── setup-db.sh        # データベース初期化スクリプト
```

## ✅ 実装済み機能（Week 3 MVP完成）

### 📋 レポート管理
- [x] レポート作成・一覧・詳細表示
- [x] 清掃日、チェックイン/アウト時刻、スタッフ名記録
- [x] レポート形式選択（オーナー向け・マネージャー向け・両方）
- [x] レポート提出機能（最終確定）

### 📸 写真ドキュメント
- [x] 複数写真アップロード（Base64、最大50MB）
- [x] 写真プレビュー表示・削除機能
- [x] レポート詳細ページで写真一覧表示

### ⚠️ イシュー報告
- [x] 問題タイプ・説明・重大度の記録
- [x] 複数問題対応（1レポートに複数問題）
- [x] イシュー削除・解決機能

### ✅ チェックリスト管理
- [x] チェック/アンチェック機能
- [x] 進捗バー表示（%表示）
- [x] リアルタイム完了状態更新
- [x] 複数チェックリスト対応

## 🛠 開発環境セットアップ

### 前提条件
- Node.js 16+
- npm または yarn

### バックエンド セットアップ

```bash
cd backend

# 依存パッケージをインストール
npm install

# .env ファイルを作成（必要に応じて）
# DATABASE_URL と JWT_SECRET を設定

# Prismaクライアント生成
npx prisma generate

# 開発サーバーを起動
npm run dev
```

**バックエンドは `http://localhost:3000` で起動**

### フロントエンド セットアップ

```bash
cd frontend

# 依存パッケージをインストール
npm install

# 開発サーバーを起動
npm run dev
```

**フロントエンドは `http://localhost:5173` で起動**

### テストアカウント

ログイン画面で新規登録するか、以下のテストアカウントを使用：

```
Email: test@example.com
Password: password123
```

## 📚 技術スタック

### バックエンド
- **ランタイム**: Node.js
- **フレームワーク**: Express.js
- **言語**: TypeScript
- **ORM**: Prisma
- **DB**: SQLite（ローカル開発）
- **認証**: JWT + bcryptjs
- **ロギング**: カスタムロガー

### フロントエンド
- **フレームワーク**: React 18
- **ビルドツール**: Vite
- **スタイリング**: Tailwind CSS
- **フォーム**: React Hook Form
- **ルーティング**: React Router v6
- **HTTP通信**: Axios
- **日時処理**: 標準 Date API + 日本語ロケール

## 🔑 API エンドポイント

### 認証
```
POST   /api/auth/register       ユーザー登録
POST   /api/auth/login          ログイン
```

### 物件管理
```
POST   /api/properties          物件作成
GET    /api/properties          物件一覧
GET    /api/properties/:id      物件詳細
PUT    /api/properties/:id      物件更新
DELETE /api/properties/:id      物件削除
```

### レポート
```
POST   /api/reports                          レポート作成
GET    /api/reports/property/:propertyId    物件のレポート一覧
GET    /api/reports/user/all                ユーザーのレポート一覧
GET    /api/reports/:id                     レポート詳細
PUT    /api/reports/:id                     レポート更新
POST   /api/reports/:id/submit              レポート提出
DELETE /api/reports/:id                     レポート削除
```

### レポート - 写真
```
POST   /api/reports/:reportId/photos        写真アップロード
DELETE /api/reports/:reportId/photos/:photoId  写真削除
```

### レポート - イシュー
```
POST   /api/reports/:reportId/issues                    イシュー作成
DELETE /api/reports/:reportId/issues/:issueId          イシュー削除
POST   /api/reports/:reportId/issues/:issueId/resolve  イシュー解決
```

### チェックリスト
```
POST   /api/checklists                       チェックリスト作成
GET    /api/properties/:propertyId/checklists  チェックリスト一覧
GET    /api/checklists/:id                   チェックリスト詳細
PUT    /api/checklists/:id                   チェックリスト更新
PATCH  /api/checklists/:id/items/:itemId    チェックリスト項目更新
DELETE /api/checklists/:id                   チェックリスト削除
```

## 📋 実装状況

### ✅ 完了（Week 1-3）
- [x] プロジェクト初期化
- [x] DB設計（SQLite + Prisma）
- [x] ログイン機能（JWT認証）
- [x] 物件マスタ管理
- [x] チェックリスト機能
- [x] レポート作成・管理
- [x] 写真アップロード（Base64）
- [x] イシュー報告機能
- [x] レポート提出機能

### 🔄 今後の拡張
- [ ] AWS S3連携（Base64から変更）
- [ ] OpenAI API統合（AI報告文生成）
- [ ] モバイルアプリ化
- [ ] パフォーマンス最適化
- [ ] テスト自動化
- [ ] CI/CDパイプライン構築

## 🧪 テスト

```bash
# バックエンド（未実装）
cd backend
npm run test

# フロントエンド（未実装）
cd frontend
npm run test
```

## 📦 ビルド・デプロイ

```bash
# バックエンド
cd backend
npm run build

# フロントエンド
cd frontend
npm run build
```

## 📝 環境変数

### バックエンド `.env`

```
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-secret-key-change-in-production"
PORT=3000
NODE_ENV=development
```

### フロントエンド `.env`

```
VITE_API_BASE_URL="http://localhost:3000/api"
```

## 📂 主要ファイル構成

### バックエンド
```
backend/src/
├── controllers/      # ビジネスロジック実装
│   ├── report.controller.ts      # レポート管理
│   └── checklist.controller.ts   # チェックリスト管理
├── routes/           # APIエンドポイント定義
├── middleware/       # 認証・エラーハンドリング
├── services/         # ビジネスロジック
├── utils/            # ユーティリティ（ロガーなど）
└── app.ts            # Expressメインアプリケーション
```

### フロントエンド
```
frontend/src/
├── components/       # Reactコンポーネント
│   ├── Forms/        # フォームコンポーネント
│   ├── Report/       # レポート表示
│   ├── Checklist/    # チェックリスト表示
│   └── Layout/       # レイアウト・ナビゲーション
├── pages/            # ページコンポーネント
├── services/         # API通信ロジック
├── utils/            # ユーティリティ（日時フォーマットなど）
├── store/            # 状態管理（Zustand）
└── App.tsx           # メインアプリケーション
```

## 🐛 トラブルシューティング

### バックエンドが起動しない
```bash
# Prismaクライアントを再生成
npx prisma generate

# データベースをリセット（開発時のみ）
npx prisma migrate reset
```

### 写真がアップロードできない
- ファイルサイズを確認（50MB以下）
- ブラウザの開発者ツール（DevTools）を確認
- バックエンドログで "Photo uploaded" メッセージを確認

### APIが接続できない
- バックエンド（localhost:3000）が起動しているか確認
- CORS設定を確認（`app.ts` の cors ミドルウェア）
- ネットワークタブでエラーを確認

## 🚀 本格展開への推奨改善

1. **クラウドストレージ連携** - AWS S3/GCSで写真保存
2. **AI統合** - OpenAI APIで報告文自動生成
3. **認証強化** - OAuth 2.0、多要素認証（MFA）
4. **パフォーマンス** - コード分割、画像最適化
5. **モバイル対応** - レスポンシブ改善、モバイルアプリ化
6. **テスト整備** - ユニットテスト、E2Eテスト
7. **デプロイ自動化** - CI/CD パイプライン構築

## 🤝 貢献

詳細は [実装計画.md](実装計画.md) を参照

## 📄 ライセンス

社内開発プロジェクト

---

**初期化日**: 2026年5月4日  
**Week 3 MVP完成**: 2026年5月6日  
**バージョン**: 1.0.0
