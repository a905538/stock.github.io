
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRlIjoiMjAyMy0wOC0wOSAyMzo1NToxMCIsInVzZXJfaWQiOiJhOTA1NTM4QGdtYWlsLmNvbSIsImlwIjoiMTgyLjIzMy4xMzMuMTc0In0.eLQV2K2n4AHTQizhvP0Wl5qCSbvswNFQLWrh56O46Nw";
let FinMindUrl = "https://api.finmindtrade.com/api/v4/data";
let url = location.href;
let stocknum;
// console.log(url);
if (url.indexOf('?') != -1) {
    //逐次分割字串，並把分割後陣列值再去分割，最終取得num值
    stocknum = url.split('?')[1].split('&')[0].split('=')[1];
    console.log(stocknum);
}
CashAjax(stocknum);
newsAjax(stocknum);
StaPag3Ajax(stocknum);
StaPag1Ajax(stocknum);
// 獲取API
// 股利政策
function CashAjax(stocknum) {
    let start_date = new Date();
    let start_date1 = start_date.setFullYear(start_date.getFullYear() - 11);
    let fDate = start_date.getFullYear() + '-' + start_date.getMonth() + '-' + start_date.getDate();
    let parameters = {
        dataset: "TaiwanStockDividend",
        data_id: stocknum,
        start_date: fDate,
        token: token,
    }
    console.log(parameters);
    $.ajax({
        url: FinMindUrl,
        method: 'GET',
        data: parameters,
    }).done(function (re1) {
        // parameters['token'] = re;
        console.log('re1.data', re1.data);
        let cash = '';
        let stock = '';
        for (let i = re1.data.length - 1; i >= 0; i--) {
            cash += `<tr>`;
            cash += `<td>${re1.data[i].CashExDividendTradingDate.substr(0, 4)}</td>`;
            cash += `<td>${re1.data[i].CashExDividendTradingDate}</td>`;
            cash += `<td>${re1.data[i].CashDividendPaymentDate}</td>`;
            cash += `<td>${re1.data[i].CashEarningsDistribution.toFixed(1)}</td>`;
            cash += `</tr>`;
            stock += `<tr>`;
            stock += `<td>${re1.data[i].CashExDividendTradingDate.substr(0, 4)}</td>`;
            stock += `<td>${re1.data[i].CashExDividendTradingDate}</td>`;
            stock += `<td>${re1.data[i].StockEarningsDistribution.toFixed(1)}</td>`;
            stock += `</tr>`;
        }
        $(".cash").find("tbody").append(cash);
        $(".stock").find("tbody").append(stock);
    });
}
//資產負債表
function StaPag3Ajax(stocknum) {
    let start_date = new Date();
    let start_date1 = start_date.setFullYear(start_date.getFullYear() - 1);
    let fDate = start_date.getFullYear() + '-' + start_date.getMonth() + '-' + start_date.getDate();
    let parameters = {
        dataset: "TaiwanStockBalanceSheet",
        data_id: stocknum,
        start_date: fDate,
        token: token,
    }
    console.log(parameters);
    $.ajax({
        url: FinMindUrl,
        method: 'GET',
        data: parameters,
    }).done(function (re3) {
        // parameters['token'] = re;
        console.log('re3.data', re3.data);
        let num = re3.data.length;
        let date = re3.data[num - 1].date;
        let data = [];
        let datanum = 0;
        // console.log(date);
        for (let i = 0; i <= re3.data.length - 1; i++) {
            let dataID = re3.data[i].origin_name;
            if (re3.data[i].date == date) {
                if (re3.data[i].type.substr(-3, 3) == "per") {
                    if (!data.hasOwnProperty(re3.data[i].origin_name)) {
                        datanum++;
                        data[re3.data[i].origin_name] = { 'per': re3.data[i].value }
                    } else {
                        data[re3.data[i].origin_name]['per'] = re3.data[i].value
                    }
                } else {
                    if (!data.hasOwnProperty(re3.data[i].origin_name)) {
                        datanum++;
                        data[re3.data[i].origin_name] = { 'str': re3.data[i].value }
                    } else {
                        data[re3.data[i].origin_name]['str'] = re3.data[i].value
                    }
                }
            }
        }
        // console.log('data', data);
        let content = '';
        for (let key in data) {
            // console.log(key)
            content += `<tr>`;
            content += `<td>${key}</td>`;
            content += `<td>${data[key]['per']}</td>`;
            content += `<td>${(data[key]['str'] / 100000000).toFixed(1)}</td>`;
            content += `</tr>`;
        }
        // console.log('content', content)
        $('#page3').find('tbody').append(content);
    });

}
//財務報表
function StaPag1Ajax(stocknum) {
    let start_date = new Date();
    let start_date1 = start_date.setFullYear(start_date.getFullYear() - 1);
    let fDate = start_date.getFullYear() + '-' + start_date.getMonth() + '-' + start_date.getDate();
    let parameters = {
        dataset: "TaiwanStockFinancialStatements",
        data_id: stocknum,
        start_date: fDate,
        token: token,
    }
    console.log(parameters);
    $.ajax({
        url: FinMindUrl,
        method: 'GET',
        data: parameters,
    }).done(function (re4) {
        // parameters['token'] = re;
        console.log('re4.data', re4.data);
        let num = re4.data.length;
        let date = re4.data[num - 1].date;
        // let data = [];
        let content = '';
        // let datanum=0;
        // // console.log(date);
        for (let i = 0; i <= re4.data.length - 1; i++) {
            //     let dataID = re4.data[i].origin_name;
            if (re4.data[i].date == date) {
                content += `<tr>`;
                content += `<td>${re4.data[i].origin_name}</td>`;
                content += `<td>${(re4.data[i].value / 100000000).toFixed(1)}</td>`;
                content += `</tr>`;
            }
            $('#page1').find('tbody').append(content);
        }
        // console.log('data', data);
        // for (let key in data) {
        //     console.log(key)
        //     content += `<tr>`;
        //     content += `<td>${key}</td>`;
        //     content += `<td>${data[key]['per']}</td>`;
        //     content += `<td>${data[key]['str']}</td>`;
        //     content += `</tr>`;
        // }
        // console.log('content', content)
        // $('#page3').find('tbody').append(content);
    });

}
//新聞
function newsAjax(stocknum) {
    let start_date = new Date();
    let start_date1 = start_date.setMonth(start_date.getMonth() - 1);

    let fDate = start_date.getFullYear() + '-' + start_date.getMonth() + '-' + start_date.getDate();
    let parameters = {
        dataset: "TaiwanStockNews",
        data_id: stocknum,
        start_date: fDate,
        token: token,
    }
    console.log(parameters);
    $.ajax({
        url: FinMindUrl,
        method: 'GET',
        data: parameters,
    }).done(function (re2) {
        // parameters['token'] = re;
        console.log('re2.data', re2.data);
        let data = '';
        for (let i = re2.data.length - 1; i >= re2.data.length - 20; i--) {
            data += `<tr>`;
            data += `<td>${re2.data[i].date}</td>`;
            data += `<td><a href="${re2.data[i].link}" target="_blank">${re2.data[i].title}</a></td>`;
            data += `</tr>`;
        }
        $(".news").find("tbody").append(data);
    });
}
//"TaiwanStockMonthRevenue",月營收表
// "TaiwanStockDividendResult",除權息結果表
// "TaiwanStockDividend",股利政策
// "TaiwanStockBalanceSheet",資產負債表
// "TaiwanStockCashFlowsStatement",現金流量表
// "TaiwanStockFinancialStatements",綜合損益表(財報)
// "TaiwanStockHoldingSharesPer",股權持股分級表
// "TaiwanStockInstitutionalInvestorsBuySell",個股三大法人買賣表
// "TaiwanStockPriceTick",歷史股價(權限不足)
// "TaiwanStockPriceTick",即時股價(權限不足)
// "TaiwanStockNews",2個月相關新聞
// "TaiwanStockPrice",//2日股價日成交資訊
// let license={
// };