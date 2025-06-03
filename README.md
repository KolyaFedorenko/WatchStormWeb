![WatchStormWeb Image](https://github.com/KolyaFedorenko/WatchStormWeb/blob/feature/images/WatchStormWebImage.png)
# WatchStormWeb
![GitHub Created At](https://img.shields.io/github/created-at/KolyaFedorenko/WatchStormWeb)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/KolyaFedorenko/WatchStormWeb?color=brighteen)
![Website](https://img.shields.io/website?url=https%3A%2F%2Fwatchstorm.ru%2F)
![GitHub Release](https://img.shields.io/github/v/release/KolyaFedorenko/WatchStormWeb?color=brighteen)
![GitHub Release Date](https://img.shields.io/github/release-date/KolyaFedorenko/WatchStormWeb)

WatchStormWeb is a web version of the WatchStorm mobile app designed to add ratings to movies or TV shows you've watched.

### Features of WatchStormWeb:
- Authorization using the 6-digit code specified in the WatchStorm mobile application
- Automatic synchronization with mobile application in real time
- Storing all data in Firebase Realtime Database and Firebase Storage
- Automatic movie search by title
- Score movies on three dimensions: plot, cast and visuals
- Calculating the average user rating for each movie
- Displaying the average audience rating of a movie if the movie was found via search
- Displaying the latest news about WatchStorm in the "WatchStorm News" section
- Download the latest version of the WatchStorm mobile application
- Import a list of user movies from JSON
- Export a list of user movies to JSON
- Access to WatchStorm Assistant

### Important notes
> [!NOTE]  
> WatchStormWeb uses the FontAwesome icon library to display icons, and the Roboto font to display text, as well as Firebase Realtime Database and Firestore as a data storages.
> Using these cloud storages allows you to automatically synchronize user data with the mobile application, as well as update data that has been changed by the user in real time.

> [!IMPORTANT]  
> WatchStormWeb uses dynamic updating of web page content, so the main HTML markup is contained in JavaScript files located in the "scripts" folder.
> This applies to all markup associated with lists, dialogs, etc., as well as markup of any elements caused by user interaction with the web page.

### Stack of used technologies
The list of technologies used in the project includes:
- HTML5, CSS3, JavaScript
- Font Awesome, Google Fonts
- Firebase Realtime Database, Firestore
