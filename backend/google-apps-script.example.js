/**
 * 婚禮系統 Google Apps Script 範例
 * 功能：處理報到清單的資料讀取和報到畫面的資料寫入
 * 部署：Web App，執行身分：我，存取權限：任何人
 * 
 * 使用說明：
 * 1. 複製此文件內容到 Google Apps Script
 * 2. 替換 YOUR_SPREADSHEET_ID_HERE 為實際的 Google Sheets ID
 * 3. 調整 SHEET_NAME 為實際的工作表名稱
 * 4. 部署為 Web App 並取得 URL
 */

/**
 * 創建帶有 CORS 標頭的回應
 */
function createCORSResponse(data, isJSON = true) {
  const output = isJSON
    ? ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON)
    : ContentService.createTextOutput(data).setMimeType(ContentService.MimeType.TEXT);

  return output.setHeaders({
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    'Access-Control-Max-Age': '86400'
  });
}

/**
 * 處理 GET 請求 - 用於報到清單讀取資料
 * URL: https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec
 */
function doGet(e) {
  try {
    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    const SHEET_NAME = 'guestList'; // 指定工作表名稱
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // 解析分頁參數
    const page = parseInt(e.parameter.page) || 1;
    const limit = parseInt(e.parameter.limit) || 20;
    const searchTerm = e.parameter.search || '';

    console.log(`分頁請求 - 頁碼: ${page}, 每頁: ${limit}, 搜尋: ${searchTerm}`);

    // 取得所有資料來計算總數和進行搜尋
    const allData = sheet.getDataRange().getValues();
    console.log(`工作表總行數: ${allData.length}`);

    // 跳過標題行，處理所有資料
    let filteredData = [];
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const guestData = {
        timestamp: row[0],      // 時間
        serialNumber: row[1],   // 序號
        guestName: row[2],      // 姓名
        collectMoney: row[3],   // 收禮金 (boolean)
        giftAmount: row[4],     // 金額 (number)
        hasCake: row[5],        // 有喜餅 (boolean)
        cakeGiven: row[6],      // 發喜餅 (boolean)
        checkedIn: row[0] != null && row[0] != '' // 有報到時間就算已報到
      };

      // 如果有搜尋條件，進行過濾
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSerial = guestData.serialNumber.toString().toLowerCase().includes(searchLower);
        const matchesName = guestData.guestName.toString().toLowerCase().includes(searchLower);

        if (matchesSerial || matchesName) {
          filteredData.push(guestData);
        }
      } else {
        filteredData.push(guestData);
      }
    }

    // 計算分頁資訊
    const totalRecords = filteredData.length;
    const totalPages = Math.ceil(totalRecords / limit);
    const offset = (page - 1) * limit;

    // 取得當前頁面的資料
    const pageData = filteredData.slice(offset, offset + limit);

    console.log(`過濾後總數: ${totalRecords}, 總頁數: ${totalPages}, 當前頁資料數: ${pageData.length}`);

    // 準備回傳的分頁資料
    const result = {
      data: pageData,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalRecords: totalRecords,
        limit: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    };

    // 檢查是否為 JSONP 請求
    const callback = e.parameter.callback;
    if (callback) {
      // 返回 JSONP 格式的分頁資料
      const jsonpResponse = `${callback}(${JSON.stringify(result)})`;
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // 返回一般 JSON 資料，支援 CORS
      return createCORSResponse(result);
    }

  } catch (error) {
    const callback = e.parameter.callback;
    const errorData = {
      error: error.toString(),
      message: '讀取資料失敗'
    };

    if (callback) {
      // 返回 JSONP 錯誤格式
      const jsonpResponse = `${callback}(${JSON.stringify(errorData)})`;
      return ContentService
        .createTextOutput(jsonpResponse)
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    } else {
      // 錯誤處理
      return createCORSResponse(errorData);
    }
  }
}

/**
 * 處理 POST 請求 - 用於報到畫面提交資料
 * 接收 JSON 格式的賓客資料並寫入 Google Sheets
 */
function doPost(e) {
  // 最基本的日誌記錄 - 確保函數被調用
  console.log('=== doPost 開始執行 ===');

  try {
    // 檢查是否有收到資料
    if (!e.postData || !e.postData.contents) {
      console.log('錯誤：沒有收到 POST 資料');
      return createCORSResponse({
        success: false,
        message: '沒有收到資料'
      });
    }

    console.log('收到的原始資料:', e.postData.contents);

    const SPREADSHEET_ID = 'YOUR_SPREADSHEET_ID_HERE';
    const SHEET_NAME = 'guestList'; // 指定工作表名稱
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);

    // 解析 POST 資料
    const data = JSON.parse(e.postData.contents);
    console.log('解析後的資料:', data);

    // 創建時間格式 yyyy/mm/dd HH:MM:SS
    const now = new Date();
    const formattedTime = Utilities.formatDate(now, Session.getScriptTimeZone(), 'yyyy/MM/dd HH:mm:ss');
    console.log('格式化時間:', formattedTime);

    // 讀取所有現有資料
    const allData = sheet.getDataRange().getValues();
    console.log('工作表總行數:', allData.length);

    let targetRowIndex = -1;

    // 搜尋匹配的賓客資料（從第2行開始，跳過標題）
    for (let i = 1; i < allData.length; i++) {
      const row = allData[i];
      const existingSerial = row[1]?.toString().trim(); // B欄：序號
      const existingName = row[2]?.toString().trim();   // C欄：姓名

      console.log(`檢查第${i+1}行: 序號=${existingSerial}, 姓名=${existingName}`);

      // 根據序號和姓名雙重匹配
      if (existingSerial === data.serialNumber.toString().trim() &&
          existingName === data.guestName.toString().trim()) {
        targetRowIndex = i + 1; // Google Sheets 行號從1開始
        console.log(`找到匹配資料在第${targetRowIndex}行`);
        break;
      }
    }

    if (targetRowIndex > 0) {
      // 找到匹配資料，更新現有行
      console.log('更新現有賓客資料');

      // 更新特定欄位（保留序號和姓名）
      sheet.getRange(targetRowIndex, 1).setValue(formattedTime);           // A欄：時間
      sheet.getRange(targetRowIndex, 4).setValue(data.collectMoney);       // D欄：收禮金
      sheet.getRange(targetRowIndex, 5).setValue(data.giftAmount || 0);    // E欄：金額
      sheet.getRange(targetRowIndex, 6).setValue(data.hasCake);            // F欄：有喜餅
      sheet.getRange(targetRowIndex, 7).setValue(data.cakeGiven || false); // G欄：發喜餅

      console.log('資料更新成功');

    } else {
      // 找不到匹配資料，新增一行
      console.log('找不到匹配資料，新增新行');

      const newRowData = [
        formattedTime,           // 時間 (yyyy/mm/dd HH:MM:SS)
        data.serialNumber,       // 序號
        data.guestName,          // 姓名
        data.collectMoney,       // 收禮金
        data.giftAmount || 0,    // 金額
        data.hasCake,            // 有喜餅
        data.cakeGiven || false  // 發喜餅
      ];

      sheet.appendRow(newRowData);
      console.log('新資料新增成功');
    }

    // 返回成功回應
    return createCORSResponse({
      success: true,
      message: '資料已成功儲存'
    });

  } catch (error) {
    // 詳細的錯誤記錄
    console.log('=== 發生錯誤 ===');
    console.log('錯誤訊息:', error.toString());
    console.log('錯誤堆疊:', error.stack);

    return createCORSResponse({
      success: false,
      error: error.toString(),
      message: '儲存資料失敗'
    });
  }
}

/**
 * 處理 OPTIONS 預檢請求 - CORS 支援
 */
function doOptions(e) {
  return createCORSResponse('', false);
}

/*
 * Google Sheets 欄位結構：
 * A欄: 時間 (timestamp)
 * B欄: 序號 (serialNumber)
 * C欄: 姓名 (guestName)
 * D欄: 收禮金 (collectMoney) - boolean
 * E欄: 金額 (giftAmount) - number
 * F欄: 有喜餅 (hasCake) - boolean
 * G欄: 發喜餅 (cakeGiven) - boolean
 */

/*
 * 部署設定：
 * 1. 在 Google Apps Script 中建立新專案
 * 2. 貼上此程式碼
 * 3. 替換 YOUR_SPREADSHEET_ID_HERE 為實際的 Google Sheets ID
 * 4. 部署為 Web App：
 *    - 執行身分：我
 *    - 存取權限：任何人
 * 5. 複製 Web App URL 到 config.js 檔案中
 */