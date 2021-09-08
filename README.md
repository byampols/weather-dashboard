# weather-dashboard

## Description 

A weather dashboard which takes a place name and displays current and future weather conditions.

Source: [github repository](https://github.com/byampols/weather-dashboard).

Deployed application: [the deployed application](https://byampols.github.io/weather-dashboard/).

## Usage 

[The Dashboard](assets/images/screenshot.png)

* When a place is entered into the search field, it will display a dashboard with weather information for that location.
    * This is done using a weather and geocoding api. 
        * The geocoding api takes the location name, and forwards the latitude and longitude to the weather api
    * The dashboard diplays the chosen location, the current date, temperature, wind, and UV Index, as well as a 5 day forecast
    * The UV index is highlighted in colors to demonstrate severity 
        * Green is safe, yellow is a warning, red is a high uv index, and black is dangerously high
    * The icons featured represent the weather. Clouds represent cloudy, the orange circle represents sunny, etc.
* Your search history is saved in the sidebar, which will track the last 8 searches you made
    * You can reopen those dashboards by clicking a name in the search history

## Credits

* [jQuery](https://jquery.com/)
* [Bootstrap](https://getbootstrap.com/)
* [Popper](https://popper.js.org/)
* [moment.js](https://momentjs.com/)
* [Opencagedata's geocoding api](https://opencagedata.com/)
* [Openweather api](https://openweathermap.org)


## License

[Creative Commons License](LICENSE)