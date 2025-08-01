
```
/app
├── /pacman
│   └── page.tsx
├── /features
│   └── /pacman
│       ├── Pacman.container.tsx      # メインコンテナ
│       ├── Pacman.presentational.tsx  # メインUI
│       ├── Pacman.use.ts             # ゲームロジック
│       └── /components
│           ├── GameBoard/            # ゲームボード
│           ├── Player/               # プレイヤー（パックマン）
│           ├── Ghost/                # ゴースト
│           └── GameInfo/             # ゲーム情報表示
├── /types
│   ├── pacman.type.ts               # パックマン関連の型
│   ├── game.type.ts                 # ゲーム状態の型
│   └── board.type.ts                # ボードの型
└── /utils
    └── /pacman
        ├── gameLogic.ts             # ゲームロジック
        ├── collision.ts             # 衝突判定
        └── constants.ts             # 定数定義
```