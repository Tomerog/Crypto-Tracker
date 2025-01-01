"use strict";

(async () => {

    // show/hide tabs
     document.getElementById('navCoins').addEventListener('click', () => {
        document.getElementById('coinsContainer').style.display = 'flex'
        document.getElementById('reports').style.display = 'none'
        document.getElementById('about').style.display = 'none'
    })

    document.getElementById('navReports').addEventListener('click', () => {
        document.getElementById('coinsContainer').style.display = 'none'
        document.getElementById('reports').style.display = 'block'
        document.getElementById('about').style.display = 'none'
    })

    document.getElementById('navAbout').addEventListener('click', () => {
        document.getElementById('coinsContainer').style.display = 'none'
        document.getElementById('reports').style.display = 'none'
        document.getElementById('about').style.display = 'block'
    })

    // api call + retry if failed
    const getData = (url) => fetch(url).then(response => response.json())
    const fetchRetry = async (url) => {
        let isSuccess = false;
        do {
            try {
                const data = await getData(url)
                isSuccess = true
                return data
            } catch (e) {
                await new Promise(resolve => setTimeout(resolve, 5000));              
            }
        } while (!isSuccess)
    }

    

    // const getAllCoins = async () => getData('https://api.coingecko.com/api/v3/coins/list')
    const getAllCoins = async () => getData('assets/json/coins.json')
    const getSingleCoin = async (coin) => fetchRetry(`https://api.coingecko.com/api/v3/coins/${coin}`)
    const getGraphData = async (coins) => getData(`https://min-api.cryptocompare.com/data/pricemulti?fsyms=${coins.join(',')}&tsyms=USD`)

    const coins = await getAllCoins()
    
    // generate coins tab html
    const html = coins.splice(0,50)
        .map(coin=> `
            <div class="coin">
                <h3>${coin.id}</h3>
                <p>${coin.name}</p>
                <button id="${coin.id}">more info </button>
                <div id="${coin.id}Info" class="moreInfoContainer"></div>
            </div>
            `)
        .join(``)
   


    // generate coins tab
    document.getElementById(`coinsContainer`).innerHTML = html

    // generate more info on coins+loading spinner
    document.querySelectorAll(`#coinsContainer button`).forEach(button => button.addEventListener(`click`, async ()=> {

        const currentButton = document.getElementById(`${button.id}Info`)
       
       
        // add a loading spinner (fix later)
        currentButton.innerHTML = `<span class="loader"></span>`
        
        const coinData = await getSingleCoin(button.id)
        
        
        currentButton.innerHTML =  `
            <img src="${coinData.image.small}" alt="${coinData.name}">
            <p>Current Price in USD: $${coinData.market_data.current_price.usd}</p>
            <p> Current Price in ILS: ₪${coinData.market_data.current_price.ils}</p>
            <p> Current Price in EUR: €${coinData.market_data.current_price.eur}</p> 
        `;

        // toggle show/hide more info (check later if there is a better way to do this online)
        if(currentButton.style.display === 'block')currentButton.style.display = 'none'; else {
            currentButton.style.display = 'block';
            currentButton.innerHTML = coinDataHTML;
        }
    }))
})()