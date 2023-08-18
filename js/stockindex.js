// let DataGovUrl = "http://mopsfin.twse.com.tw/opendata/t187ap03_L.csv";
const stockClass = [];
let DataGovUrl = "./data/t187ap03_L.csv";
let tBody;
let json = '';
$.ajax({
    url: DataGovUrl,
    method: 'GET',
    dataType: "text",
    success: function (data) {
        json = csvToJson(data);
        tableVal(json);
        $("tbody").html(tBody);
        $('#myTable').DataTable({
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.6/i18n/zh-HANT.json',
            }
        });
        $('#myTable_filter').addClass("row w-100 m-auto p-auto");
        navbaradd(stockClass);
        // $('input[type="search"]').addClass("form-control");
        // $('input[type="search"]').parent().addClass("d-flex w-100");
        // $('input[type="search"]').attr("placeholder", 'search');
        // console.log($('#myTable_filter').children().val());
        // $('#myTable_filter').children().contents().filter(function () {
        //     return this.nodeType === 3;
        // }).remove();
        // let s ="/Search:/gi";
        // $('#myTable_filter').children(0).text().replace(s,'123')
        // $('#myTable_filter').html(
        //     `<div class="input-group mb-3 input-group-lg">
        //     <span class="input-group-text">股票代號名稱</span>

        //     </div>`
        // );
        // console.log($('input[type="Search"]').parent());
        // $('input[type="search"]').parent().replace('Search:','');
        // $('#myTable_filter').html(
        //     `<div class="input-group mb-3 input-group-lg">
        //     <span class="input-group-text">股票代號名稱</span>
        //     <input type="text" class="form-control" id="selectInput">
        //     </div>`
        // );
        // name="myTable_length"
        // $('#myTable_length').remove();

        // $('#myTable_filter').prepend(`<input type="search" class placeholder aria-controls="myTable"></input>`);
        // $('#myTable_filter').prepend(`<span class="input-group-text">股票代號名稱</span>`);

    }
})

function tableVal(json) {
    $.each(json, function (index, value) {
        tBody += `<tr>`;
        tBody += `<td>` + value['公司代號'] + `<br></td>`;
        tBody += `<td>` + value['公司名稱'] + `<br>(` + value['公司簡稱'] + `)` + `</td>`;
        tBody += `<td class="d-none">` + value['產業別'] + `</td>`;
        tBody += `<td>` + value['成立日期'] + `</td>`;
        tBody += `<td>` + value['上市日期'] + `</td>`;
        tBody += `<td>` + value['實收資本額'] + `</td>`;
        tBody += `<td>` + value['董事長'] + `</td>`;
        tBody += `<td>
                   <div class="d-sm-flex flex-column">   
                        <div class="btn btn-secondary m-1" onclick="window.open('`+ value['網址'] + `')">公司網址</div>
                        <div class="btn btn-success m-1" onclick="location.href='stocks.html?num=`+ value['公司代號'] + `'">財報資料</div>
                    </div>   
                </td>`;
        // <button type="button" class="btn btn btn-primary">加入選股</button>
        // <button type="button" class="btn btn-warning">交易情形</button>

        tBody += `</tr>`;
    })
    // return tBody;
}
function navbaradd(stockClass) {
    let navbarLi = '';
    console.log(stockClass)
    $.each(stockClass, function (index, value) {
        console.log(industry(value))
        navbarLi += `<li class="nav-item">`;
        navbarLi += `<a class="nav-link" href="#">${industry(value)}</a>`;
        navbarLi += `</li>`;
    });
    console.log('navbarLi', navbarLi);
    $(".navbarindex").append(navbarLi);
}
// function處理CSV數據轉換為json
function csvToJson(csv) {
    const lines = csv.split('\n');
    const delimeter = '","';
    const result = [];
    const headers = lines[0].split(',');
    $.each(lines, function (index, value) {
        if (index != 0) {
            const obj = [];
            rows = value.split(delimeter);
            $.each(rows, function (index, value) {
                let header = headers[index].replace(/"/g, "");
                let row = value.split(delimeter);
                switch (header) {
                    case '公司簡稱':
                    case '公司代號':
                    case '公司名稱':
                    case '董事長':
                        obj[header] = row[0];
                        break;
                    case '成立日期':
                    case '上市日期':
                        obj[header] = row[0].substring(0, 4) + '-'
                            + row[0].substring(4, 6) + '-'
                            + row[0].substring(6, 8);
                        break;
                    case '網址':
                        if (row[0].substring(0, 3) != "htt") {
                            obj[header] = `http://` + row[0];
                        } else {
                            obj[header] = row[0];
                        }
                        break;
                    case '實收資本額':
                        if (parseInt(row[0]) > 10000000) {
                            obj[header] = (row[0] / 100000000).toFixed(1) + `億元`;
                        }
                        break;
                    case '產業別':
                        obj[header] = industry(row[0]);
                        if (stockClass.indexOf(row[0]) == -1) {
                            stockClass.push(row[0]);
                        }
                        break;
                }
            });
            result.push(obj);
        }

    });
    result.splice(-1, 100)
    console.log(result)
    return result;
}
function industry(num) {
    let induStr = '';
    switch (num) {
        case '01':
            induStr = '水泥工業';
            break;
        case '02':
            induStr = '食品工業';
            break;
        case '03':
            induStr = '塑膠工業';
            break;
        case '04':
            induStr = '紡織纖維';
            break;
        case '05':
            induStr = '電機機械';
            break;
        case '06':
            induStr = '電器電纜';
            break;
        case '21':
            induStr = '化學工業';
            break;
        case '22':
            induStr = '生技醫療業';
            break;
        case '08':
            induStr = '玻璃陶瓷';
            break;
        case '09':
            induStr = '造紙工業';
            break;
        case '10':
            induStr = '鋼鐵工業';
            break;
        case '11':
            induStr = '橡膠工業';
            break;
        case '12':
            induStr = '汽車工業';
            break;
        case '24':
            induStr = '半導體業';
            break;
        case '25':
            induStr = '電腦及週邊設備業';
            break;
        case '26':
            induStr = '光電業';
            break;
        case '27':
            induStr = '通信網路業';
            break;
        case '28':
            induStr = '電子零組件業';
            break;
        case '29':
            induStr = '電子通路業';
            break;
        case '30':
            induStr = '資訊服務業';
            break;
        case '31':
            induStr = '其他電子業';
            break;
        case '14':
            induStr = '建材營造';
            break;
        case '15':
            induStr = '航運業';
            break;
        case '16':
            induStr = '觀光事業';
            break;
        case '17':
            induStr = '金融保險';
            break;
        case '18':
            induStr = '貿易百貨';
            break;
        case '23':
            induStr = '油電燃氣業';
            break;
        case '19':
            induStr = '綜合';
            break;
        case '20':
            induStr = '其他';
            break;
    }
    return induStr;
}
// $('#selectInput').change(function () {
//     isNum($(this).val());
// })
// function isNum(num) {
//     if ($.isNumeric(num)) {
//         console.log(1)
//     } else {
//         console.log(0)
//     }
// }