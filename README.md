# Mask Map for South Korea Online, Made in Taiwan (台灣製的南韓口罩地圖上線)

![Mask Map for South Korea](https://kiang.github.io/covid19-kr-masks/og_image.png)

(中文內容放在英文後面)

I had built a Mask Map for Taiwan before(*1). A member of FtO(*2) in South Korea told me that the government of South Korea is planning to release real-time inventory information of face masks. Then I started to build the Mask Map for South Korea. As the South Korea government provides a completed API(*3), it's easier for developers. I only have to deal with the interface and data.

Mask Map for South Korea - https://kiang.github.io/covid19-kr-masks/

By opening the website, the browser will show an alert window to ask permission for the location information from your device. Please click accept and the map will navigate to your current location, which is marked with a blue circle. Each triangle in the map represents a pharmacy or a place you could buy face masks. The color of the triangle indicates how many face masks are left. Green means plenty, yellow means some, red means few, and grey means empty. Clicking on the triangle will provide details of the pharmacy/point. At the bottom of the information box, you could find buttons providing navigation services by Google/Here WeGo/Bing. Clicking the button will bring you to each service and it will guide you to the place.

Clicking the gear icon in the sidebar, you could get two drop down lists for provinces and cities. Each time you choose a location, the map will navigate you to the center of that province or city. Once the map is moved, the URL will change according to the center of the map. You could copy the full URL to share the real-time stock information with your friends.

The information is for reference only. The accurate inventory is not guaranteed. But with the map, you could prevent wasting too much time traveling everywhere.

#TaiwanCanHelp

基於製作藥局口罩採購地圖(*1)的經驗，在 FtO(*2) 的南韓朋友轉知南韓政府也打算釋出即時的口罩庫存資訊後，我就嘗試製作了南韓的版本；南韓政府提供的是完整的應用程式介面(API)(*3)，因此對於應用開發者來說簡單很多，只要處理畫面與資料的呈現。

南韓口罩地圖 - https://kiang.github.io/covid19-kr-masks/

透過瀏覽器開啟後一般會跳出提示，如果願意授權使用設備的位置，網頁會自動定位到行動裝置提供的地理點位，同時在地圖會以藍色圓點標記所在位置；藥局位置就是地圖中的三角形圖示，綠色代表口罩庫存充裕、黃色表示庫存開始吃緊、紅色表示庫存即將售完、灰色則是代表已經售完，點選個別圖示後會顯示該地點的詳細資料，資料下方則是 Google / Here WeGo / Bing 等地圖應用提供的導航服務，點選後就會帶出個別地圖的路線導航。

點選右邊選單的齒輪圖示會看到兩個下拉選單，包含省份與城市，每次選擇一個項目地圖就會自動導引你到這個省份或城市的中間點；地圖的中心點變動時網址會跟著改變，你可以直接把網址複製給朋友來分享這個地方的口罩庫存資訊。

提供的資訊僅供參考，實際上還是以個別單位現場的庫存為主，但是這樣的資訊可以作為採購的參考，避免花太多時間去尋找可以購買口罩的地方。

1. 藥局口罩採購地圖 - https://kiang.github.io/pharmacies/
2. FtO - https://g0v.hackmd.io/@pm5/rJriRnlqE/%2FbpFogRpfRj-7QcTXnX5ZEw?type=book
3. 南韓政府口罩庫存 API - https://app.swaggerhub.com/apis/Promptech/public-mask-info/20200307-oas3

## Datasets using by this project

1. [corona19-masks API](https://app.swaggerhub.com/apis/Promptech/public-mask-info/20200307)
2. [Administrative areas of South Korea](https://github.com/southkorea/southkorea-maps)

## Credits

1. Most of the information was provided by [FtO](https://g0v.hackmd.io/@pm5/rJriRnlqE/%2FbpFogRpfRj-7QcTXnX5ZEw?type=book) members in South Korea
2. Find more information at https://hackmd.io/@6VWj8d9yQkKavs-wIUuzLQ/ry5TAjZr8

## Notices

1. Please use English if you want to report any bug/issue here as I don't know Korean at all.
