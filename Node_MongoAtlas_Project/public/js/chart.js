class Currency {
    constructor(title, color, axisYIndex, axisYType) {
        this.axisYSpec = {
            title: title,
            lineColor: color,
            tickColor: color,
            labelFontColor: color,
            titleFontColor: color,
            includeZero: true,
            prefix: "$",
            minimum: 100000
        };
        this.data = {
            type: "line",
            name: title,
            color: color,
            axisYIndex: axisYIndex,
            axisYType: axisYType,
            connectNullData: true,
            showInLegend: true,
            dataPoints: []
        };
    }
}

window.onload = function () {
    var element = document.getElementById('chartContainer');
    var data = JSON.parse(element.dataset.dataList);
    var namesList = JSON.parse(element.dataset.nameList);

    var length = namesList.length;
    var colors = ['#C24642', '#369EAD', "#7F6084", "#52A816"];
    var currencyList = {};

    for(let i=0; i<length; i++){
        if(i==0) currencyList[namesList[i]] = new Currency(namesList[i],colors[i],0,'primary'); 
        else if(i==1) currencyList[namesList[i]] = new Currency(namesList[i],colors[i],0,'secondary'); 
        else if(i==2) currencyList[namesList[i]] = new Currency(namesList[i],colors[i],1,'primary'); 
        else if(i==3) currencyList[namesList[i]] = new Currency(namesList[i],colors[i],1,'secondary'); 
    };


    for (let doc of data) {
        if (doc.currencies) {
            for (let [key,object] of Object.entries(currencyList)) {
                if (doc.currencies[key]) {
                    if (doc.currencies[key] < object.axisYSpec.minimum) object.axisYSpec.minimum = doc.currencies[key];
                    object.data.dataPoints.push({ x: new Date(doc.date), y: doc.currencies[key] });
                }else object.data.dataPoints.push({ x: new Date(doc.date), y: null });
            }
        } else {
            for (let [key, object] of Object.entries(currencyList)) {
                object.data.dataPoints.push({ x: new Date(doc.date), y: null });
            }
        }
    }


    // var currencyList = JSON.parse(document.getElementById('chartContainer').dataset.currencyList);

    // var usdxArray = [], btcArray = [], eurArray = [], tryArray = [];
    // var usdxMin = 100000, btcMin = 1000000, eurMin = 100000, tryMin = 100000;

    // for (let doc of currencyList) {
    //     if (doc.currencies) {
    //         if (doc.currencies.USDX) {
    //             if (doc.currencies.USDX < usdxMin) usdxMin = doc.currencies.USDX;
    //             usdxArray.push({ x: new Date(doc.date), y: doc.currencies.USDX });
    //         } else usdxArray.push({ x: new Date(doc.date), y: null });
    //         if (doc.currencies.BTC_USD) {
    //             if (doc.currencies.BTC_USD < btcMin) btcMin = doc.currencies.BTC_USD;
    //             btcArray.push({ x: new Date(doc.date), y: doc.currencies.BTC_USD });
    //         } else btcArray.push({ x: new Date(doc.date), y: null });
    //         if (doc.currencies.TRY_USD) {
    //             if (doc.currencies.TRY_USD < tryMin) tryMin = doc.currencies.TRY_USD;
    //             tryArray.push({ x: new Date(doc.date), y: doc.currencies.TRY_USD });
    //         } else tryArray.push({ x: new Date(doc.date), y: null });
    //         if (doc.currencies.EUR_USD) {
    //             if (doc.currencies.EUR_USD < eurMin) eurMin = doc.currencies.EUR_USD;
    //             eurArray.push({ x: new Date(doc.date), y: doc.currencies.EUR_USD });
    //         } else eurArray.push({ x: new Date(doc.date), y: null });
    //     }
    //     else {
    //         usdxArray.push({ x: new Date(doc.date), y: null });
    //         btcArray.push({ x: new Date(doc.date), y: null });
    //         tryArray.push({ x: new Date(doc.date), y: null });
    //         eurArray.push({ x: new Date(doc.date), y: null });
    //     }
    // }

    // console.log(usdxArray);


    var axisYList = [], axisY2List = [], dataList = [];
    for (let [key, object] of Object.entries(currencyList)) {
        object.axisYSpec.minimum *= 0.99;

        if(object.data.axisYType === 'primary') axisYList.push(object.axisYSpec);
        else axisY2List.push(object.axisYSpec);

        dataList.push(object.data);
    }

    //console.log('1_' + JSON.stringify(axisYList) + '\n2_' + JSON.stringify(axisY2List) + '\n3_' + JSON.stringify(dataList));

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Daily Currency Performance"
        },
        theme: "dark2",
        axisX: {
            valueFormatString: "D MMM Y"
        },
        axisY: axisYList,
        axisY2: axisY2List,
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: dataList,
    });
    chart.render();


    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }

    return;
    
    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            text: "Daily Currency Performance"
        },
        theme: "dark2",
        axisY: [{
            title: "USDX",
            lineColor: "#C24642",
            tickColor: "#C24642",
            labelFontColor: "#C24642",
            titleFontColor: "#C24642",
            includeZero: true,
            prefix: "$",
            minimum: usdxMin * 0.99
        },
        {
            title: "EUR-USD",
            lineColor: "#369EAD",
            tickColor: "#369EAD",
            labelFontColor: "#369EAD",
            titleFontColor: "#369EAD",
            includeZero: true,
            prefix: "$",
            minimum: eurMin * 0.99
        }],
        axisY2: [{
            title: "TRY-USD",
            lineColor: "#7F6084",
            tickColor: "#7F6084",
            labelFontColor: "#7F6084",
            titleFontColor: "#7F6084",
            includeZero: true,
            prefix: "$",
            minimum: tryMin * 0.99
        }, {
            title: "BTC-USD",
            lineColor: "#52A816",
            tickColor: "#52A816",
            labelFontColor: "#52A816",
            titleFontColor: "#52A816",
            includeZero: true,
            prefix: "$",
            minimum: btcMin * 0.99
        }],
        toolTip: {
            shared: true
        },
        legend: {
            cursor: "pointer",
            itemclick: toggleDataSeries
        },
        data: [{
            type: "line",
            name: "USDX",
            color: "#C24642",
            showInLegend: true,
            connectNullData: true,
            axisYIndex: 0,
            dataPoints: usdxArray
        },
        {
            type: "line",
            name: "EUR-USD",
            color: "#369EAD",
            axisYIndex: 1,
            showInLegend: true,
            connectNullData: true,
            dataPoints: eurArray
        },
        {
            type: "line",
            name: "TRY-USD",
            color: "#7F6084",
            axisYIndex: 0,
            axisYType: "secondary",
            connectNullData: true,
            showInLegend: true,
            dataPoints: tryArray
        }, {
            type: "line",
            name: "BTC-USD",
            color: "#52A816",
            axisYIndex: 1,
            axisYType: "secondary",
            connectNullData: true,
            showInLegend: true,
            dataPoints: btcArray
        }]
    });
    chart.render();


    function toggleDataSeries(e) {
        if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
            e.dataSeries.visible = false;
        } else {
            e.dataSeries.visible = true;
        }
        e.chart.render();
    }
}