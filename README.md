# Clicker miniapp App Template
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb1.png)

## Description
The Clicker Game app template is a mini-app where users simply tap the screen to score points and earn rewards.

## Features

- Click-based Scoring System
Tracks user scores as they tap the screen, managing user score data efficiently.

- Invitation System
Allows users to invite others and tracks the onboarding of invited users.

- Mission System
Verifies if users have completed specific missions and provides rewards for completed tasks.

## Getting Started
### Prerequisites
- Node.js v20 or higher
- Create a [Habili Stack](https://docs.habili.ai/habili-system/key-concepts#2-stack) through [Joat.land](https://joat.land)

### Run locally
1. Clone the repository
```bash
git clone REPO_URL
```
2. Install dependencies
```bash
npm install
```
3. Setup environment variables
```env
VITE_BYPASS_TELEGRAM_AUTH=true # For local development to bypass getting telegram init data
VITE_API_ENDPOINT=http://localhost:54321/functions/v1 # your local functions endpoint
VITE_BOT_USERNAME=NutCoinClickerBot # your telegram bot username
VITE_APP_URL_SHORT_NAME=nutcoin # your app short name
VITE_TELEGRAM_CHANNEL=https://t.me/nutcoinclicker_news # your telegram channel
```
4. Run the app
```bash
npm run dev
```

### App Customization Guide
Clicker miniapp App Template은 간단하고 필수적인 UI를 제공하고 있습니다. 사용자는 필요에 따라 주요 UI 요소를 커스터마이즈 할 수 있습니다. 아래 수정 가능한 Asset을 참고하여 자신만의 Clicker Miniapp을 만들어보세요.🚀

#### Change background color
tailwind.config.js 파일에서 background color를 변경할 수 있습니다.
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb2.png)
```typescript
backgroundImage: {
    'gradient-main': 'linear-gradient(to top, BOTTOM_RGB, TOP_RGB)',
    ...
}
```

#### 2. Change Icons
- Main page
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb3.png)
  - Main Icon (도토리 아이콘) : Click 대상
  - Energy Icon (번개 아이콘) : Click 제한 시간 표시용
  - Frens Icon (곰돌이 아이콘) : Invite Friends 페이지로 이동
  - Earn Icon (코인 아이콘) : Earn 페이지로 이동
  - Boosts Icon (로켓 아이콘) : Booster 페이지로 이동

- Invite page
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb4.png)
  - Present Icon (선물 아이콘) : Invite-Based Reward Task 표시용
  - Friend Icon (다람쥐 아이콘) : Invited Friend Details 표시용
      - 초대된 친구가 없을 경우, Main 페이지에 있었던 [Frens Icon](https://www.notion.so/Clicker-Miniapp-Asset-14dee7e108d28009805dffa8526b7a76?pvs=21)이 표시됩니다.

- Earn page
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb5.png)
  - Earn Icon (코인 아이콘) : Main Page에 있는 [Earn Icon](https://www.notion.so/Clicker-Miniapp-Asset-14dee7e108d28009805dffa8526b7a76?pvs=21)을 변경할 경우, 자동 변경됩니다.
  - Invite Icon (프렌즈 아이콘) : Invite Count-Based Reward Task 표시용

| Telegram, YouTube, X Icon : 각 브랜드의 공식 UI 리소스를 사용하며, 해당 아이콘의 저작권은 각 브랜드에 있습니다.

- Booster page
![thumb](https://github.com/habiliai/template-clicker-mini-app/thumbnails/thumb6.png)
  - Daily booster Icon (번개 아이콘) : Click당 수익율 증가 + 제한 시간 충전 부스터
  - Multi tap Icon (다람쥐 아이콘) : Click당 수익율 증가 부스터
  - Energy limit Icon (배터리 아이콘) : Click 제한 시간 충전 부스터

### Deployment Guide
#### Frontend Deployment (Vercel)
TBD

#### Telegram Miniapp Deployment
TBD

#### Backend Deployment 
| Follow the [Joat.land projcect deployment guide](https://joat.land) to deploy the functions.

### API reference
Clicker miniapp App Template 에서는 아래와 같은 [Habili VAPI(Vertical API)](https://docs.habili.ai/habili-system/key-concepts#1-api) 를 사용하고 있으며, 각 API의 상세 사용법 및 커스텀 방법은 각 Guide 를 참고하세요.

- [twa-auth](https://github.com/chsy0823/vapi-twa-auth)
- [clicker-game-essentials](https://github.com/chsy0823/vapi-clicker-game-essentials)
- [referrals](https://github.com/chsy0823/vapi-referrals)
- [rewardable-tasks](https://github.com/chsy0823/vapi-rewardable-tasks)


