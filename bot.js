const Discord = require('discord.js');
const auth = require('./auth.json');
const schedule = require('node-schedule');  
const rp = require('request-promise');
const fetch = require('node-fetch');

// Initialize Discord Bot
const bot = new Discord.Client();
var today = new Date();
const prefix = '!';


var key = "87e98570a9100d9e99f711797411f2c7";

bot.on('ready', () => {
    var time = today.getHours() + ':' + today.getMinutes();
    console.log('Connected');
    console.log('Logged in as: ' + bot.user.username + ' - (' + bot.user.id + ')');
    console.log('Time at: ' + time);
    bot.user.setActivity("with the clouds");
});

bot.on('guildMemberAdd', member => {
});

var dict = {
    "f" : "imperial",
    "c" : "metric",
    "k" : ""
}

bot.on('message', async message => {
    // Code to be executed when bot receives message
    // Prevent bot from replying to other bots.
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    // 
    const args = message.content.split(" ");
    const command = args[0].slice(1).toLowerCase();
    const city = args[1];
    if (args.length < 3) { 
        var type = 'c';
    } else {
        var type = args[2];
    }

    var url = 'https://api.openweathermap.org/data/2.5/weather?q=' + city + '&units=' + dict[type] + '&appid=' + key;
    switch (command) {
        case "temp":
            getTemp(url).then(info => {
                message.channel.send(info);
            }).catch(err => {
                console.log('Got error', err);
            });
            break;
        case "weather":
            getWeather(url).then(info => {
                message.channel.send(info);
            }).catch(err => {
                console.log('Got error', err);
            });
            break
        case "forecast":
            url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&mode=json&units=metric&appid=' + key;
            getForecast(url).then(info => {
                message.channel.send(info);
            }).catch(err => {
                console.log('Got error', err);
            })
            break
        default:
            message.channel.send("Syntax error");
            break
    }
});
bot.login(auth.token);

function getTemp(url) {
    return rp(url).then(body => {
        let responseJSON = JSON.parse(body)
        let message = `It's ${responseJSON.main.temp} degrees in ${responseJSON.name}!`;
        console.log(responseJSON);
        return message;
    });
}

function getWeather(url) {
    return rp(url).then(body => {
        let responseJSON = JSON.parse(body);
        let message = `It is ${responseJSON.weather[0].main} with ${responseJSON.weather[0].description}!`;
        return message;
    });
}

function getForecast(url) {
    return rp(url).then(body => {
        let responseJSON = JSON.parse(body);
        // Send embed message
        return buildEmbed(responseJSON);
        // Send text message
        // return buildMessage(responseJSON); 
    });
}

function buildEmbed(info) {
    let indexes = findNoons(info);
    // Counter for indexes
    let i = 0;
    return {embed: {
        color: 3447003,
        title: "5 day forecast for " + info.city.name + ', ' + info.city.country,
        description: 'Given temperatures are forecast for noon (Celsius).',
        fields: [{
            name: dateName(info.list[indexes[i]].dt_txt),
            value: info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i]].weather[0].description 
                                                + '\n' + addEmote(info.list[indexes[i++]].weather[0].description),
            inline: true
            }, 
            {
            name: dateName(info.list[indexes[i]].dt_txt),
            value: info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i]].weather[0].description
                                                + '\n' + addEmote(info.list[indexes[i++]].weather[0].description),
            inline: true
            },
            {
            name: dateName(info.list[indexes[i]].dt_txt),
            value: info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i]].weather[0].description
                                                + '\n' + addEmote(info.list[indexes[i++]].weather[0].description),
            inline: true
            },
            {
            name: dateName(info.list[indexes[i]].dt_txt),
            value: info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i]].weather[0].description
                                                + '\n' + addEmote(info.list[indexes[i++]].weather[0].description),
            inline: true
            },
            {
            name: dateName(info.list[indexes[i]].dt_txt),
            value: info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i]].weather[0].description
                                                + '\n' + addEmote(info.list[indexes[i++]].weather[0].description),
            inline: true
            }
        ],
        timestamp: new Date(),
        footer: {
            icon_url: bot.user.avatarURL,
            text: bot.user.username
        }
        }
    }
}

function buildMessage(info) {
    let indexes = findNoons(info);
    let city = "**5 day forecast for *" + info.city.name + ', ' + info.city.country + '* ** \n';
    // Counter for indexes
    let i = 0;
    let day1 = dateName(info.list[indexes[i]].dt_txt) + '\n';
    let weather1 = info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i++]].weather[0].description + '\n';
    let day2 = dateName(info.list[indexes[i]].dt_txt) + '\n';
    let weather2 = info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i++]].weather[0].description + '\n';
    let day3 = dateName(info.list[indexes[i]].dt_txt) + '\n';
    let weather3 = info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i++]].weather[0].description + '\n';
    let day4 = dateName(info.list[indexes[i]].dt_txt) + '\n';
    let weather4 = info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i++]].weather[0].description + '\n';
    let day5 = dateName(info.list[indexes[i]].dt_txt) + '\n';
    let weather5 = info.list[indexes[i]].main.temp + "° with " + info.list[indexes[i++]].weather[0].description + '\n';
    return city + day1 + weather1 + '\n' + day2 + weather2 + '\n' + day3 + weather3 + '\n' + day4 + weather4 + '\n' + day5 + weather5;
}

function findNoons(info) {
    var indexes = [];
    info.list.forEach(function (item, index) {
        let dateTime = item.dt_txt.split(' ');
        if (dateTime[1].includes('12')) {
            indexes.push(index);
        }
    });
    return indexes;
}

/**
 * Created by jjansen on 09-Mar-15 4:56 PM.
 * stackoverflow
 */
function dateName(dateInfo) {
    var monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    var dayNames = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
    ];
    var dateDay = dateInfo.split(' ');
    var today = new Date( dateDay[0] );
    var dd = today.getDate();
    var dayname = dayNames[today.getDay()-1];
    var mm = monthNames[today.getMonth()];
    var yyyy = today.getFullYear();
    // var fullDate = dayname + " " + dd + " " + mm + " " + yyyy;
    var fullDate = dayname + ", " + mm + " " + dd;

    return fullDate ;
}

function addEmote(weather) {
    if (weather.includes('cloud')) {
        return ':cloud:';
    } else if (weather.includes('rain')) {
        return ':cloud_rain:';
    } else if (weather.includes('sun')) {
        return ':sunny:';
    } else if (weather.includes('snow')) {
        return ':cloud_snow:';
    } else if (weather.includes('clear')) {
        return ':black_circle:';
    } else if (weather.includeS('thunder')) {
        return ':cloud_lightning:';
    } else if (weather.includes('drizzle')) {
        return ':umbrella:';
    } else if (weather.includes('fog')) {
        return ':fog:';
    }
}