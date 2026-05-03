# CleanReport（清掃報告アプリ）

民泊清掃スタッフが現場で5分で完了報告を作成できるアプリ。チェックリスト + AI自動生成で報告業務を80%削減。

## 🚀 プロジェクト構成

```
clean-report/
├── backend/       # Node.js + Express + TypeScript
├── frontend/      # React 18 + Vite + TypeScript
├── docker-compose.yml
└── README.md
```

## 📋 機能（MVP）

### 実装済み
- [x] プロジェクト骨組み（フロント/バック分離）
- [x] Docker環境（PostgreSQL + Redis）
- [x] バックエンド認証API（登録・ログイン）
- [x] フロントエンドログイン画面
- [x] 基本的なルーティング

### 次の実装
- [ ] 物件マスタ管理（1週目）
- [ ] チェックリスト機能（2週目）
- [ ] 写真アップロード（3週目）
- [ ] AI報告文生成（3週目）
- [ ] 報告履歴管理（4週目）

## 🛠 開発環境セットアップ

### 前提条件
- Node.js 18+
- Docker & Docker Compose
- Git

### 初期セットアップ

```bash
# 1. リポジトリをクローン
git clone <repository-url>
cd clean-report

# 2. Docker環境起動
docker-compose up -d

# 3. バックエンド初期化
cd backend
npm install
npx prisma migrate dev --name init

# 4. フロントエンド初期化
cd ../frontend
npm install
```

### 開発サーバー起動

**ターミナル 1: バックエンド**
```bash
cd backend
npm run dev
# http://localhost:3000
```

**ターミナル 2: フロントエンド**
```bash
cd frontend
npm run dev
# http://localhost:5173
```

### テストアカウント

```
Email: test@example.com
Password: password123
```

（実装後、別途登録してください）

## 📚 技術スタック

### バックエンド
- **ランタイム**: Node.js 18+
- **フレームワーク**: Express.js
- **言語**: TypeScript
- **DB**: PostgreSQL 15 + Prisma ORM
- **キャッシュ**: Redis
- **認証**: JWT + bcryptjs

### フロントエンド
- **フレームワーク**: React 18
- **ビルド**: Vite
- **スタイル**: Tailwind CSS
- **状態管理**: Zustand
- **フォーム**: React Hook Form
- **ルーティング**: React Router v6

## 🔑 API エンドポイント（認証済み）

```
POST   /api/auth/register       ユーザー登録
POST   /api/auth/login          ログイン
POST   /api/auth/refresh        トークンリフレッシュ

GET    /api/properties          物件一覧
POST   /api/properties          物件作成
PUT    /api/properties/:id      物件更新
DELETE /api/properties/:id      物件削除
```

## 📋 実装計画

### 第1週（完了予定）
- [x] プロジェクト初期化
- [x] DB設計
- [x] ログイン機能
- [ ] 物件マスタ管理

### 第2週
- [ ] 基本情報入力
- [ ] チェックリスト
- [ ] 異常報告

### 第3週
- [ ] 写真アップロード
- [ ] AWS S3連携
- [ ] OpenAI API統合
- [ ] 報告文生成

### 第4週
- [ ] 報告履歴保存
- [ ] UI/UX最適化
- [ ] テスト・デプロイ準備

## 🧪 テスト

```bash
# バックエンド
cd backend
npm run test

# フロントエンド
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

`.env` ファイルを作成（`.env.example` を参考に）

### バックエンド
```
DATABASE_URL="postgresql://..."
JWT_SECRET="your-secret"
OPENAI_API_KEY="sk-..."
AWS_S3_BUCKET="clean-report-dev"
```

### フロントエンド
```
VITE_API_BASE_URL="http://localhost:3000/api"
```

## 🤝 貢献

詳細は [実装計画.md](実装計画.md) を参照

## 📄 ライセンス

ISC

---

**初期化日**: 2026年5月4日  
**最終更新**: 2026年5月4日
