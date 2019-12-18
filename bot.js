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
    bot.user.setActivity("");
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
            url = 'https://api.openweathermap.org/data/2.5/forecast?q=' + city + '&mode=mode&appid=' + key;
            getForecast(url).then(info => {
                message.channel.send(info);
            }).catch(err => {
                console.log('Got error', err);
            })

        default:
            break;
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
        console.log(responseJSON);
        return "Working";
    });
}