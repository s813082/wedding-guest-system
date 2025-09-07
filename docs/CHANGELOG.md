# Wedding System - Google Sheets Integration

## 開發紀錄 (2025-09-07)

### 🗂️ 最新更新 - 專案結構重組與安全性強化

✅ **今日重大更新**：

#### 1. 檔案結構專業化重組
- **目錄分層**：建立專業的前端/後端/文檔分離結構
- **檔案移動**：
  - `checkin.html, guestlist.html` → `src/pages/`
  - `config.*.js` → `src/config/`
  - `google-apps-script.*.js` → `backend/`
  - `CHANGELOG.md, quick-start.md` → `docs/`
- **路徑引用修正**：更新所有HTML中的配置檔案路徑
- **邏輯分組**：按功能將檔案分組，提高專案可維護性

#### 2. 安全性配置系統
- **敏感資訊分離**：建立 `config.example.js` 安全範例系統
- **版本控制優化**：`.gitignore` 正確排除敏感配置檔案
- **範例代碼**：提供 `google-apps-script.example.js` 供參考
- **配置化管理**：移除硬編碼 URL，改用配置變數載入

#### 3. 文檔結構優化
- **README.md 重構**：全新的視覺化說明文檔，包含目錄、表格、折疊式內容
- **路徑說明更新**：所有檔案路徑和操作步驟都更新到新結構
- **專業化呈現**：使用 GitHub 友好的 Markdown 格式

#### 4. 新的專案架構
```
WeddingSystem/
├── src/                             # 前端源碼
│   ├── pages/
│   │   ├── checkin.html             # 報到介面
│   │   └── guestlist.html           # 賓客清單
│   ├── config/
│   │   ├── config.example.js        # 安全範例
│   │   └── config.js                # 實際配置 (已忽略)
│   └── assets/css/                  # 靜態資源 (預留)
├── backend/                         # 後端代碼
│   ├── google-apps-script.example.js
│   └── google-apps-script.js        # 實際代碼 (已忽略)
├── docs/                           # 文檔資料
│   ├── CHANGELOG.md                # 本檔案
│   └── quick-start.md              # 快速指南
├── README.md, CLAUDE.md, .gitignore
```

🎯 **架構設計原則**：
- **關注點分離**：前端、後端、配置、文檔各司其職
- **安全優先**：敏感資訊完全從版本控制中排除
- **開發者友好**：清晰的檔案組織便於理解和維護
- **部署簡化**：標準化的配置流程

⚡ **破壞性變更**：
- 網址路徑: `/checkin.html` → `/src/pages/checkin.html`
- 配置位置: `/config.js` → `/src/config/config.js`
- 文檔位置: `/CHANGELOG.md` → `/docs/CHANGELOG.md`

---

## 開發紀錄 (2025-09-06)

### 最新更新 - 系統架構優化與搜尋功能完成

✅ **今日重大更新**：

#### 1. 檔案結構重整
- **檔案移動**：將 `報到畫面/code.html` 和 `報到清單/code.html` 移至根目錄
- **檔名英化**：改名為 `checkin.html` 和 `guestlist.html`
- **資料夾清理**：刪除中文資料夾，統一檔案管理
- **快速啟動文件**：新增 `quick-start.md` 提供伺服器啟動指引

#### 2. 分頁與搜尋系統實作
- **搜尋功能**：新增即時搜尋，支援賓客編號和姓名模糊搜尋
- **分頁系統**：每頁顯示20筆資料，支援頁碼跳轉
- **性能優化**：從伺服器端分頁改為一次性載入全部資料 + 前端分頁
- **搜尋性能**：本地搜尋，毫秒級響應，大幅提升使用體驗

#### 3. Google Apps Script 後端強化
- **更新邏輯修正**：修改報到功能從「新增資料」改為「更新現有賓客記錄」
- **JSONP支援**：完整的跨域支援，解決CORS問題
- **錯誤處理**：完善的錯誤記錄和回應處理
- **分頁參數支援**：支援伺服器端分頁（雖然前端改為一次性載入）

#### 4. 用戶體驗改進
- **導航功能**：報到畫面新增「回到賓客清單」按鈕
- **URL參數預填**：從賓客清單點擊「未報到」會預填賓客資訊
- **即時狀態更新**：報到完成自動跳回賓客清單並刷新
- **視覺優化**：已報到賓客以綠色背景標示

#### 5. 開發架構最佳化
```
WeddingSystem/
├── checkin.html          # 報到畫面 (原 報到畫面/code.html)
├── guestlist.html        # 賓客清單 (原 報到清單/code.html)
├── google-apps-script.js # Google Apps Script 後端代碼
├── quick-start.md        # 快速啟動指南
└── README.md            # 開發文件
```

🎯 **關鍵技術決策**：
- **資料載入策略**：選擇一次性載入全部資料，犧牲初始載入時間換取搜尋和分頁的極致性能
- **搜尋方案**：本地搜尋取代伺服器端搜尋，避免每次搜尋都發送請求的延遲
- **分頁邏輯**：前端分頁確保換頁瞬間完成，提升用戶體驗

⚡ **性能表現**：
- 初始載入：~2.24s（一次性載入全部資料）
- 搜尋響應：<10ms（本地搜尋）
- 分頁切換：<5ms（本地資料切片）

---

## 開發紀錄 (2025-09-05)

### 完成項目

#### 1. 報到畫面 Google Sheets 整合
**檔案路徑**: `/報到畫面/code.html`

**功能**:
- 將報到表單資料提交到Google Sheets
- 表單驗證和狀態顯示
- 自動重置表單

**修改內容**:
- 添加表單提交處理JavaScript
- 整合fetch API連接Google Apps Script
- 添加提交狀態反饋(提交中/成功/失敗)
- 表單自動重置功能

#### 2. 報到清單 Google Sheets 資料連接
**檔案路徒**: `/報到清單/code.html`

**功能**:
- 從Google Sheets讀取賓客資料並顯示
- 即時更新賓客狀態
- 自動刷新機制

**修改內容**:
- 移除靜態HTML表格資料
- 添加動態載入JavaScript功能
- 實作賓客詳細資訊查看
- 添加手動刷新按鈕
- 每30秒自動重新載入資料
- 載入中/錯誤狀態處理

### 必要的Google Apps Script設定

#### 1. 寫入功能 (用於報到畫面)
```javascript
function doPost(e) {
  const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
  const data = JSON.parse(e.postData.contents);
  
  sheet.appendRow([
    new Date(),
    data.serialNumber,
    data.guestName,
    data.collectMoney,
    data.giftAmount,
    data.hasCake,
    data.cakeGiven
  ]);
  
  return ContentService.createTextOutput(JSON.stringify({success: true}))
    .setMimeType(ContentService.MimeType.JSON);
}
```

#### 2. 讀取功能 (用於報到清單)
```javascript
function doGet() {
  const sheet = SpreadsheetApp.openById('YOUR_SPREADSHEET_ID').getActiveSheet();
  const data = sheet.getDataRange().getValues();
  
  // 跳過標題行，從第二行開始讀取
  const guests = [];
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    guests.push({
      timestamp: row[0],
      serialNumber: row[1],
      guestName: row[2],
      collectMoney: row[3],
      giftAmount: row[4],
      hasCake: row[5],
      cakeGiven: row[6],
      checkedIn: row[3] || row[5] // 如果有收禮金或喜餅就算已報到
    });
  }
  
  return ContentService.createTextOutput(JSON.stringify(guests))
    .setMimeType(ContentService.MimeType.JSON);
}
```

### 設定步驟

#### 1. Google Sheets準備
- 建立新的Google Sheets
- 第一行設定標題：`時間`, `序號`, `姓名`, `收禮金`, `金額`, `有喜餅`, `發喜餅`

#### 2. Google Apps Script設定
1. 前往 [script.google.com](https://script.google.com)
2. 建立新專案
3. 貼上上述JavaScript程式碼
4. 替換 `YOUR_SPREADSHEET_ID` 為你的Google Sheets ID
5. 部署為Web App
   - 執行身分：我
   - 存取權限：任何人
6. 複製Web App URL

#### 3. HTML檔案設定
- **報到畫面**: 修改第189行的 `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`
- **報到清單**: 修改第173行的 `YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE`

### 系統架構

```
婚禮系統
├── 報到畫面 (code.html)
│   ├── 表單輸入
│   ├── 資料驗證
│   └── 提交到Google Sheets
│
├── 報到清單 (code.html)
│   ├── 從Google Sheets讀取資料
│   ├── 動態顯示賓客清單
│   ├── 即時狀態更新
│   └── 自動/手動刷新
│
└── Google Sheets (資料庫)
    ├── 儲存賓客簽到資料
    ├── 記錄禮金和喜餅資訊
    └── 提供即時資料存取
```

### 功能特色

#### 報到畫面
- ✅ 賓客基本資料輸入
- ✅ 禮金收取記錄
- ✅ 喜餅發放管理
- ✅ 表單驗證和狀態回饋
- ✅ 自動重置表單

#### 報到清單
- ✅ 即時顯示所有賓客資料
- ✅ 報到狀態視覺化(綠色已報到/白色未報到)
- ✅ 賓客詳細資訊查看
- ✅ 每30秒自動更新
- ✅ 手動刷新功能
- ✅ 錯誤處理和重試機制

---

## 明日開發計劃 (2025-09-07)

### 🎯 核心功能：同行人設定系統

#### 需求分析
- **核心邏輯**：同一家人只要一個人報到，就全部的人報到成功
- **資料來源**：需要讀取另一個 Google Sheet 分頁來得知誰跟誰是一起的
- **UI整合**：報到畫面中顯示同行人員資訊，讓工作人員清楚知道誰跟誰是一起的

#### 技術規劃

##### 1. Google Sheets 架構擴展
```
Google Sheets 結構:
├── guestList (現有)     # 賓客基本資料
│   ├── 時間、序號、姓名、收禮金、金額、有喜餅、發喜餅
├── groupRelations (新增) # 同行人關係表
│   ├── 群組ID、主要聯絡人、成員序號、成員姓名、關係
```

##### 2. 前端功能擴展
- **checkin.html 強化**：
  - 顯示同行人員清單
  - 批量報到確認介面
  - 部分成員報到狀態顯示
- **guestlist.html 強化**：
  - 群組狀態視覺化（全部報到/部分報到/未報到）
  - 展開/收合同行人員顯示

##### 3. Google Apps Script 邏輯強化
- **讀取功能**：新增群組關係資料讀取
- **寫入功能**：批量更新同行人員報到狀態
- **狀態計算**：判斷群組報到完成狀態

#### 開發步驟
1. 設計群組關係資料結構
2. 修改 Google Apps Script 支援多分頁讀取
3. 更新前端顯示邏輯
4. 實作批量報到功能
5. 測試群組報到流程

---

### 未來開發項目

1. **賓客管理功能**
   - ~~新增賓客資料~~ (已完成基礎版)
   - ~~編輯賓客資訊~~ (已完成基礎版)
   - 刪除賓客記錄

2. **進階查詢功能**
   - ~~賓客姓名搜尋~~ ✅ (已完成)
   - ~~報到狀態篩選~~ ✅ (已完成)
   - 禮金統計報表

3. **系統優化**
   - 離線功能支援
   - 資料快取機制
   - 批量操作功能

4. **安全性強化**
   - 使用者認證
   - 資料加密
   - 存取權限控制

### 技術棧

- **前端**: HTML5, CSS3 (Tailwind), JavaScript (ES6+)
- **後端**: Google Apps Script
- **資料庫**: Google Sheets
- **部署**: 靜態網頁 + Google Cloud

### 注意事項

1. **Google Apps Script限制**
   - 每天最多6小時執行時間
   - 每次請求最多6分鐘執行時間
   - 建議批量處理大量資料

2. **瀏覽器相容性**
   - 需要現代瀏覽器支援ES6+
   - fetch API支援
   - 建議使用Chrome/Firefox/Safari

3. **資料同步**
   - 多人同時使用時可能有資料衝突
   - 建議定期備份Google Sheets資料

### 聯絡資訊

開發日期: 2025-09-05  
開發者: Claude Code Assistant  
系統版本: v1.0.0