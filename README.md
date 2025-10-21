# 🏀 SportMatch — 運動場地預約與社群媒合系統  

![SportMatch Banner](https://user-images.githubusercontent.com/yourname/sportmatch-banner.png)

[![.NET](https://img.shields.io/badge/.NET%20Core-8.0-purple?logo=dotnet)](https://dotnet.microsoft.com/)
[![Bootstrap](https://img.shields.io/badge/Frontend-Bootstrap-blueviolet?logo=bootstrap)](https://getbootstrap.com/)
[![SQLServer](https://img.shields.io/badge/Database-SQL%20Server-red?logo=microsoftsqlserver)](https://www.microsoft.com/sql-server)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![GitHub repo size](https://img.shields.io/github/repo-size/Alex0307Eno/SportMatch-origin)](https://github.com/Alex0307Eno/SportMatch-origin)

---

## 📘 專案簡介  
SportMatch 是一款整合「場地預約」、「活動揪團」、「會員管理」的 Web 系統。  
使用者能線上預約運動場地、建立或加入活動，管理者可在後台維護場地與活動資訊。  

> 本專案為 **資策會課程五人團隊作品**，  
> **本人負責網站整體設計、前後端功能整合、登入頁面與後台模組開發。**

---

## 🧩 系統架構  

| 層級 | 技術 | 說明 |
|------|------|------|
| 前端 | HTML / CSS / JavaScript / Bootstrap | 響應式設計、互動式元件 |
| 後端 | ASP.NET Core MVC (C#) | 採用 MVC 架構、具高維護性與擴充性 |
| ORM | Entity Framework Core | Code-First 建模與 Migration 管理 |
| 資料庫 | Microsoft SQL Server | 關聯資料庫設計與交易控制 |
| 驗證 | ASP.NET Identity | 登入、角色權限、Session 管理 |
| 版本控管 | Git / GitHub | 分支開發、版本追蹤、團隊協作 |

---

## ⚙️ 系統功能  

| 類別 | 功能描述 |
|------|-----------|
| 🧑‍💻 會員系統 | 註冊 / 登入 / 登出 / 忘記密碼 / 權限控管 |
| 🏟️ 場地預約 | 查詢、預約、取消、避免時段重疊 |
| 🏃 活動媒合 | 建立活動、報名參加、留言互動 |
| 💬 通知系統 | 寄送活動與預約通知（Email） |
| 🧾 後台管理 | 管理場地、會員、活動與預約資料 |
| 📊 統計報表 | 場地使用率、活動參與分析 |

---

## 💼 個人負責項目  

| 項目 | 說明 |
|------|------|
| 🎨 網站整體設計 | 頁面排版、色彩風格、導覽列與整體一致性 |
| 🔧 功能開發整合 | Controller、ViewModel、資料綁定與驗證流程 |
| 🔑 登入模組 | 註冊、登入、忘記密碼、權限與驗證流程 |
| 🧱 後台模組 | 會員、場地、活動等後台管理頁面與邏輯 |
| 🧠 系統測試 | 確認資料流正確性與邏輯運作完整 |
| 🧾 文件撰寫 | 製作操作手冊、ERD 與 Use Case 流程圖 |

---

## 🧠 開發挑戰與收穫  

- 建立完整 **MVC 架構與資料流設計**（Controller → Service → ViewModel → View）  
- 使用 **LINQ 與 EF Core** 實作複雜資料查詢  
- 完成登入驗證與 **ASP.NET Identity 授權流程**  
- 以 **GitFlow** 管理團隊開發流程與版本控制  
- 提升協作溝通與程式維護能力  

---

## 🧾 資料庫設計  
採用 **Entity Framework Core Code First** 模式建置資料庫。  
主要資料表如下：

- `Members`：會員資料  
- `Venues`：場地資訊  
- `Reservations`：預約紀錄  
- `Events`：活動資料  
- `Messages`：留言互動  
- `Admins`：後台帳號管理  

---

👥 團隊成員
姓名	負責項目
Alex 李承樺	網站設計 / 登入模組 / 後台功能 / 系統整合
成員 A	前端互動設計 / 活動頁面開發
成員 B	資料庫建模 / 預約邏輯撰寫
成員 C	通知模組 / API 串接
成員 D	測試 / 文件與流程圖
📜 專案心得

這次開發讓我深刻體會團隊協作的重要性。
從需求討論、資料庫建構、到前後端串接，過程中學會如何拆解問題與溝通解法。
也在實作 MVC 架構與 Identity 權限管理時，真正掌握後端邏輯設計與資料流控制。

🧾 備註

本專案為資策會課程團隊開發成果，僅供學習與技術展示使用，無任何商業用途。

👤 作者

Alex 李承樺

💼 .NET 工程師

📍 台中

