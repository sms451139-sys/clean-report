# CleanReport デプロイガイド

## 📋 デプロイ前のチェックリスト

### ✅ 完了した準備
- [x] ビルドエラー修正
- [x] テスト自動化実装
- [x] 環境変数ファイルテンプレート準備
- [x] バックエンド：npm run build 成功
- [x] フロントエンド：npm run build 成功

### ⚠️ デプロイ時に必要な設定

## バックエンド (.env 本番環境版)

```bash
# .env ファイルを本番環境に作成
DATABASE_URL="postgresql://user:password@host:5432/clean_report"  # PostgreSQL推奨
JWT_SECRET="長い乱数生成文字列"  # 必ず変更！
JWT_REFRESH_SECRET="別の長い乱数生成文字列"  # 必ず変更！
NODE_ENV="production"
PORT=3000
LOG_LEVEL="info"
```

## フロントエンド (.env 本番環境版)

```bash
# .env ファイルを本番環境に作成
VITE_API_BASE_URL="https://api.example.com/api"  # 本番APIのURL
VITE_APP_NAME="CleanReport"
```

## デプロイ手順（参考例）

### 1. バックエンド デプロイ

```bash
# 1. リポジトリをクローン（または pull）
git clone https://github.com/your-repo/clean-report.git
cd clean-report/backend

# 2. 本番用 .env ファイルを作成
cp .env.production.example .env
# .env ファイルを編集して本番の設定を入力

# 3. 依存関係をインストール
npm install --omit=dev

# 4. ビルド
npm run build

# 5. Prisma マイグレーション実行
npm run prisma:deploy

# 6. アプリケーション起動
npm start
```

### 2. フロントエンド デプロイ

```bash
# 1. フロントエンドディレクトリへ移動
cd ../frontend

# 2. 本番用 .env ファイルを作成
cp .env.production.example .env
# .env ファイルを編集してAPI URLを設定

# 3. 依存関係をインストール
npm install --omit=dev

# 4. ビルド
npm run build

# 5. dist ディレクトリをデプロイ（静的ホスティング）
# Vercel, Netlify, S3 + CloudFront など
```

## 🔐 本番環境での重要な設定

1. **JWT シークレット** - 長くて複雑な文字列に変更
2. **データベース** - SQLite ではなく PostgreSQL を推奨
3. **HTTPS** - 必須
4. **CORS 設定** - フロントエンドのドメインを指定
5. **ロギング** - INFO または WARNING レベルに設定
6. **環境変数** - .env ファイルはバージョン管理外に

## 📊 ビルド成果物

- **バックエンド**: `backend/dist/` ディレクトリ
- **フロントエンド**: `frontend/dist/` ディレクトリ

## 🧪 本番前の検証

```bash
# バックエンド テスト実行
cd backend
npm test

# フロントエンド テスト実行
cd frontend
npm test
```

## 🚀 デプロイ後の確認

1. ヘルスチェック: `GET /health` → `{"status": "ok", ...}`
2. フロントエンド読み込み確認
3. ログイン機能テスト
4. レポート作成テスト

## 📝 サポートされているプラットフォーム

- **バックエンド**: Heroku, Railway, AWS EC2, DigitalOcean など
- **フロントエンド**: Vercel, Netlify, AWS S3+CloudFront など
