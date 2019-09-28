window.onload = function() {

    const tLS = 120000;
    let coinsToChart = [];
    let arrOfObjToChart = [];

    // --------------functions-----------------
    function fetchData(url){
        return $.get(url);
    }

    function write(coin_id, value) {
        window.localStorage.setItem(coin_id, value);
    }
    
    function read(key) {
        return JSON.parse(window.localStorage.getItem(key));
    }

    const chekCoin=(checkInMod, arrOfObjToChart, sixElem)=>{
        checkInMod.change(function() {
            if($(this).prop("checked") == true){
                let indOfDeletCoin = arrOfObjToChart.findIndex(coin => coin.name == $(this).next('label').text());
                
                $(`#${arrOfObjToChart[indOfDeletCoin].idOfSwitch}`).prop("checked", false);
                arrOfObjToChart.splice(indOfDeletCoin, 1);
                $(`#${sixElem.idOfSwitch}`).prop("checked", true);
                arrOfObjToChart.push(sixElem);
                $('#errModal').modal('hide');
            }
        })
    }

    function cleanCurrency(coinIndex) {
        $(`#card${coinIndex+1} img`).attr('src', '');
        $(`#card${coinIndex+1} .usd`).empty()
        $(`#card${coinIndex+1} .eur`).empty()
        $(`#card${coinIndex+1} .ils`).empty()
    }

    function drawReport(arrOfObjToChart) {
        $('#reportPage').click(function() {
            coinsToChart = arrOfObjToChart.map(coin => coin.name);
            
            if (coinsToChart.length !== 0) {
                $(".navbar-collapse").collapse('hide');
                $('#homePage').removeClass('active');
                $('#aboutPage').removeClass('active');
                $(this).addClass('active');
                $('#rowForCoins').css("display", "none");
                $('#MyPage').css("display", "none");
                $('#chartContainer').show();
                drawPlot(coinsToChart);
            }
            else {
                if (confirm('No Coins selected. On the Home page select coins to create chart')) {
                   
                }
                else {
                    
                }
            }
        })
    }

    function drawPlot(coinsToChart) {
        let titleForChart = '';
        for (let i = 0; i < coinsToChart.length; i++) {
            titleForChart += `${coinsToChart[i]}, `;
        }
 
        let arrForCoin1 = [];
        let arrForCoin2 = [];
        let arrForCoin3 = [];
        let arrForCoin4 = [];
        let arrForCoin5 = [];

        let arrOfAllChartCoins = [arrForCoin1, arrForCoin2, arrForCoin3, arrForCoin4, arrForCoin5];

        let lineColor = ['red', 'green', 'blue', 'orange', 'black']

        
        let dataForMyCanvas = coinsToChart.map((data, idx) => ({
            type: "line",
            showInLegend: true,
            name: data,
            markerType: "square",
            xValueFormatString: "mm:ss",
            color: lineColor[idx],
            dataPoints: arrOfAllChartCoins[idx]
        }));

        // ------------------------

            var chart = new CanvasJS.Chart("chartContainer", {
                animationEnabled: true,
                theme: "light2",
                title:{
                    text: `${(titleForChart.slice(0, -2))} to USD`
                },
                axisX:{
                    valueFormatString: "mm:ss",
                    crosshair: {
                        enabled: true,
                        snapToDataPoint: true
                    }
                },
                axisY: {
                    title: "Coin Value",
                    suffix : " $",
                    crosshair: {
                        enabled: true
                    }
                },
                toolTip:{
                    shared:true
                },  
                legend:{
                    cursor:"pointer",
                    verticalAlign: "bottom",
                    horizontalAlign: "left",
                    dockInsidePlotArea: true,
                    itemclick: toogleDataSeries
                },
                
                data: dataForMyCanvas
            });
            
            function toogleDataSeries(e){
                if (typeof(e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
                    e.dataSeries.visible = false;
                } else{
                    e.dataSeries.visible = true;
                }
            }
       


        let dataLength = 15;
        var updateChart = function (count) {
            count = count || 1;

            fetchData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coinsToChart.join()}&tsyms=USD`).then(price => {

            for (let i = 0; i < coinsToChart.length; i++) {
            
                let dataForCoin = {
                    x: new Date(),
                    y: price[`${coinsToChart[i]}`].USD
                }

                arrOfAllChartCoins[i].push(dataForCoin);
                if (arrOfAllChartCoins[i].length > dataLength) {
                    arrOfAllChartCoins[i].shift();
                }
            }
            chart.render();
        })


        }

        updateChart(dataLength); 
        let intervOfFetch = setInterval(function(){ updateChart() }, 2000); 

        
        
        $('#homePage,#aboutPage,#search').click(function(){
            clearInterval(intervOfFetch);
        })
    
        
    }

    function drawHomePage(){
        $('#MyPage').css("display", "none");
        $('#chartContainer').css("display", "none");
        $('#homePage').click(function() {
            $(".navbar-collapse").collapse('hide');
            $('#reportPage').removeClass('active');
            $('#aboutPage').removeClass('active');
            $(this).addClass('active');
            $('#MyPage').css("display", "none");
            $('#chartContainer').css("display", "none");
            $('#rowForCoins').show();
            $('.card').show();
        })
    }

    function drawAboutPage() {
        $('#aboutPage').click(function() {
            $(".navbar-collapse").collapse('hide');
            $('#homePage').removeClass('active');
            $('#reportPage').removeClass('active');
            $(this).addClass('active');
            $('#rowForCoins').css("display", "none");
            $('#chartContainer').css("display", "none");
            $('#MyPage').show();
        })
    }


    function drawCoinsCard(coinArr) {
        for (let i = 0; i <coinArr.length; i++) {
            let cardCoins = `<div class="card col-12 col-sm-6 col-md-4 cardSrh" style="width: 18rem;">
            <div class="card-body">
            <div class="row">
            <h5 class="card-title col-md-8 col-sm-9 col-9">${coinArr[i].symbol.toUpperCase()}</h5>
            <div class="custom-control custom-switch col-md-4 col-sm-3 col-3">
            <input type="checkbox" class="custom-control-input myToggle" id="customSwitch${i+1}">
            <label class="custom-control-label" for="customSwitch${i+1}"></label>
            </div>
            </div>	
            <h6 class="card-subtitle mb-2 text-muted">${coinArr[i].name}</h6>
            <button id="${coinArr[i].id}" class="btn btn-primary" data-toggle="collapse" data-target="#collapseExample${i+1}" aria-expanded="false" aria-controls="collapseExample${i+1}">More Info</button>
            </div>
            
            <div class="collapse" id="collapseExample${i+1}">
            <div class="card">								
            <div id="card${i+1}" class="card-body">
            
            <img   alt="${coinArr[i].symbol}" style="width: 50px; float: left;">
            <p>USD: <span class="usd"></span> &#36;<br>
            EUR: <span class="eur"></span> &euro;<br>
            ILS: <span class="ils"></span> &#8362;<br></p>
            

            </div>
            </div>
            </div>

            </div>`
      
            $('#rowForCoins').append(cardCoins)
        }
    }

    function drawSpinner(coinIndex) {
        $(`#card${coinIndex+1} img,p`).css("display", "none");
        let spinner = `<div class="spinner loading"></div>`;
        $(`#card${coinIndex+1}`).append(spinner);
    }

    function addListToModal(arrOfObjToChart) {
        $('.modal-body').empty();
        for (let i = 0; i < arrOfObjToChart.length; i++) {
            let listOfCoins = `<div class="custom-control custom-switch">
            <input type="checkbox" class="custom-control-input" id="c${i+1}">
            <label class="custom-control-label" for="c${i+1}">${arrOfObjToChart[i].name}</label>
            </div>`;

            $('.modal-body').append(listOfCoins);
        }
    }

    const selectCoinsToChart=(arrOfObjToChart)=> {
        $('.myToggle').change(function() {
            if($(this).prop("checked") == true){
                let toggledCoin = $(this).parent().prev('h5').text();
                let idOfSwitch = $(this).attr('id');
                let objOfTogCoins = {
                    name: toggledCoin,
                    idOfSwitch: idOfSwitch,
                };
                arrOfObjToChart.push(objOfTogCoins);

                if (arrOfObjToChart.length>5) {
                    let sixElem = arrOfObjToChart[arrOfObjToChart.length-1];
                    arrOfObjToChart.splice((arrOfObjToChart.length-1), 1);
                    $(this).prop("checked", false);

                    addListToModal(arrOfObjToChart);

                    $('#errModal').modal('show');
                    
                    let checkInMod = $('.modal-body .custom-control-input');
                    chekCoin(checkInMod, arrOfObjToChart, sixElem);        
                }
             }else{
                let elToRemove = $(this).parent().prev('h5').text();

                let indOfSwc = arrOfObjToChart.findIndex(coin => coin.name == elToRemove);
                arrOfObjToChart.splice(indOfSwc, 1); 
             }
        });
    } 


    // -------------end of functions-----------------


    fetchData('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false').then(data => {
        $('#rowForCoins').empty();
        $('#chartContainer').css("display", "none");
        const coinArr = data.slice(0,100);

        drawCoinsCard(coinArr);

        let infoButtons = $('h6 + button');

        infoButtons.click(function(e) {
            let coinIndex = coinArr.findIndex(coin => coin.id == $(this).attr('id'));

            let initData = read(`coin_${($(this).attr('id'))}`);
            let end = new Date().getTime();
            if (initData != null && ($(this).attr('aria-expanded') === 'false') && ((initData.ts+tLS)>(end))) {
                
                cleanCurrency(coinIndex);
                
                $(`#card${coinIndex+1} img`).attr('src', initData.image);
                $(`#card${coinIndex+1} .usd`).append(initData.usd)
                $(`#card${coinIndex+1} .eur`).append(initData.euro)
                $(`#card${coinIndex+1} .ils`).append(initData.nis)
            }

            else if (($(this).attr('aria-expanded') === 'false')) {
                drawSpinner(coinIndex);

                $.get('https://api.coingecko.com/api/v3/coins/'+($(this).attr('id'))).then(data => {
            
                $('.spinner.loading').css("display", "none");
                $(`#card${coinIndex+1} img,p`).show();

                let coinToLS = {
                    image: data.image.small,
                    usd: data.market_data.current_price.usd.toFixed(3),
                    euro: data.market_data.current_price.eur.toFixed(3),
                    nis: data.market_data.current_price.ils.toFixed(3),
                    ts: new Date().getTime(),
                }

                write(`coin_${($(this).attr('id'))}`, JSON.stringify(coinToLS));

                cleanCurrency(coinIndex);

                $(`#card${coinIndex+1} img`).attr('src', data.image.small);
                $(`#card${coinIndex+1} .usd`).append(data.market_data.current_price.usd.toFixed(3))
                $(`#card${coinIndex+1} .eur`).append(data.market_data.current_price.eur.toFixed(3))
                $(`#card${coinIndex+1} .ils`).append(data.market_data.current_price.ils.toFixed(3))
           
                })

            }

        })

        let myModal = `<div class="modal fade" id="errModal" tabindex="-1" role="dialog" aria-labelledby="errModalLabel" aria-hidden="true">
                    <div class="modal-dialog" role="document" style="max-width: 300px;">
                    <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="errModalLabel">Change selection</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                    </div>
                </div>
                </div>`
        $(document.body).append(myModal);

        selectCoinsToChart(arrOfObjToChart);
        

        $('#search').click(function(e) {
            let symbolOfCoin = $('#searchCoin').val();
            $(".navbar-collapse").collapse('hide');

            $('#reportPage').removeClass('active');
            $('#aboutPage').removeClass('active');
            $('#homePage').addClass('active');
            $('#MyPage').css("display", "none");
            $('#chartContainer').css("display", "none");
            $('#rowForCoins').show();

            let filterCoin = coinArr.filter(coin => coin.symbol === symbolOfCoin.toLowerCase());
            
            if (filterCoin.length != 0 ) {
                $('.cardSrh').hide();
                $('.cardSrh').has(`h5:contains(${filterCoin[0].symbol.toUpperCase()})`).show();
                $('#searchCoin').val('');
            }
        })

        drawReport(arrOfObjToChart);
        
        drawHomePage();

        drawAboutPage();
        
    })
}