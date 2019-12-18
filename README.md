# WeatherBot!

A Discord bot that provides information about the weather.

## Example Forecast call
![]( Capture.png )
## Technology Stack
- Node.js
- Discord.js
- OpenWeatherMap API

## Adding to your server
[Click this link to add the bot to your server](https://discordapp.com/api/oauth2/authorize?client_id=655884213916008504&permissions=313408&scope=bot)
**Note:** The person adding the bot to the server needs "Manage Server" permissions to do so.
## If I had more time...
**Code for errors**
If the OpenWeatherMap API endpoint is unavailable, no information would be displayed. Could display a specific message detailing why in this case.

**10 minute calls**
OpenWeatherMap API says calls should only be made every 10 minutes, which my code does not enforce. 

**Search by coordinates**
OpenWeatherMap API can find weather information from geo-coordinates. This could be a nice feature.
