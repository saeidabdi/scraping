
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let urlBase = 'https://www.accuweather.com',
    Month = 'october';

let urlInput = 'https://www.accuweather.com/en/gb/london/ec4a-2/october-weather/328328?year=2021'

axios.get(urlInput)

    .then(response => {

        const $ = cheerio.load(response.data.toString());

        var linksMonth = $('.monthly-calendar').children('.monthly-daypanel');

        for (let key = 0; key < linksMonth.length; key++) {

            if (linksMonth[key].attribs.href)
                gotoDay(urlBase + '' + linksMonth[key].attribs.href)

        }

    })


async function gotoDay(urlDay) {

    console.log('in func gotoDay : ' + urlDay);

    var response = await axios.get(urlDay);

    const $2 = cheerio.load(response.data.toString());

    obj = {
        Day : mkObject(response.data, 0),
        Night : mkObject(response.data, 1)
    }
    

    console.log('in func response : ' + obj);


    var dayTitle = $2('.subnav-pagination > div').text();

    var filePath = './storage/' + Month;
    var fileName = dayTitle + '.json'

    if (!fs.existsSync(filePath))
        fs.mkdirSync(filePath, { recursive: true });

    fs.writeFileSync(filePath + '/' + fileName, JSON.stringify(obj,null,4));


}

function mkObject(data, index) {

    const $2 = cheerio.load(data.toString());

    obj = {
        Degree: $2('.half-day-card').eq(index).find('.temperature').html().split(';')[0],
        DegreeModel: $2('.half-day-card').eq(index).find('.temperature > .hi-lo-label').html(),
        RealFeel: $2('.half-day-card').eq(index).find('.real-feel > div').html(),
        MaxUvIndex: $2('.half-day-card').eq(index).find('.half-day-card-content > .panels > .left > .panel-item').eq(0).find('span').html(),
        Wind: $2('.half-day-card').eq(index).find('.half-day-card-content > .panels > .left > .panel-item').eq(1).find('span').html(),
        WindGusts: $2('.half-day-card').eq(index).find('.half-day-card-content > .panels > .left > .panel-item').eq(2).find('span').html(),
        ProbabilityOfPrecipitation: $2('.half-day-card').eq(index).find('.half-day-card-content > .panels > .left > .panel-item').eq(3).find('span').html(),
    }

    return obj;

}