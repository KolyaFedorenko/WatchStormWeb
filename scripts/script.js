import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-analytics.js";
import {getDatabase, ref, get, set, child, update, remove} from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
import { getStorage, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";
import { ref as sRef } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyBq5ny6wmV1Mef-M3yS5tNL3Zf5CXYUtcY",
    authDomain: "distribution-bc332.firebaseapp.com",
    databaseURL: "https://distribution-bc332-default-rtdb.firebaseio.com",
    projectId: "distribution-bc332",
    storageBucket: "distribution-bc332.appspot.com",
    messagingSenderId: "460016977857",
    appId: "1:460016977857:web:0a96dba347f3d61f111140",
    measurementId: "G-0Q6PE8G26E"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const db = getDatabase();
const storage = getStorage(app);

const dbRef = ref(db);

const moviesList = document.getElementById("moviesList");

function getUserMovies(username, favorite){
    get(child(dbRef, "WatchStorm/" + username + "/Movies/")).then((snapshot) => {
        let movies = snapshot.val();
        for (let movie in movies) {
            let movieItem = 
            `
            <div class="default-container movie" style="cursor:pointer;" 
			onclick="
			 selectedMovieImage.src='images/movie_placeholder2.jpg';
			 movieDialog.setAttribute('data-delete', '${movies[movie].title}');
			 movieDialog.showModal();
			 movieDialog.addEventListener('click', function (event) {
				let rect = movieDialog.getBoundingClientRect();
				let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
				  && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
				if (!isInDialog) {
					movieDialog.close();
				}
			});
			">
				<div class="default-container-content">
					<div class="movie-item">
						<div class="movie-main-info">
							<img class="movie-image" src="images/movie_placeholder2.jpg">
							<div class="movie-title-and-year">
								<span class="movie-title">${movies[movie].title}</span>
								<span class="movie-year">${movies[movie].year}</span>
							</div>
						</div>
						<div class="description accent-container">
							<span class="default-text">${movies[movie].description}</span>
						</div>
						<div class="ratings accent-container" style="padding-top: 10px; padding-bottom: 10px; display: inline-flex; justify-content: center;">
							<div class="ratings-container" style="width: 30%;">
								<span class="default-text rating-name">
									Visual Rating:
								</span>
								<span class="default-text rating-name">
									Cast Rating:
								</span>
								<span class="default-text rating-name">
									Plot Rating:
								</span>
							</div>
							<div class="ratings-values-container" style="width: 52%; margin-left: 10px;">
								<div style="width: 100%; height: 100%;">
									<progress value="${movies[movie].visualRating}" max="100" style="vertical-align: top; margin-top: 12px"></progress>
									<progress value="${movies[movie].castRating}" max="100" style="margin-top: 15px;"></progress>
									<progress value="${movies[movie].plotRating}" max="100" style="margin-top: 16px;"></progress>
								</div>
							</div>
							<div class="ratings-container" style="width: 10%; margin-left: 20px;">
								<span class="default-text rating-name">
									${movies[movie].visualRating}%
								</span>
								<span class="default-text rating-name">
                                    ${movies[movie].castRating}%
								</span>
								<span class="default-text rating-name">
                                    ${movies[movie].plotRating}%
								</span>
							</div>
						</div>
						<div class="average-ratings accent-container" style="padding-top: 10px; padding-bottom: 10px; display: inline-flex; justify-content: center;">
							<div class="ratings-container" style="width: 53%;">
								<span class="default-text rating-name">
									Your average rating:
								</span>
								<span class="default-text rating-name">
									Audience average rating:
								</span>
							</div>
							<div class="ratings-values-container" style="width: 30%; margin-left: 10px;">
								<div style="width: 100%; height: 100%;">
									<progress value="${movies[movie].compositeRating}" max="100" style="vertical-align: top; margin-top: 12px; width: 100%;"></progress>
									<progress value="${movies[movie].usersAverageRating}" max="100" style="margin-top: 15px; width: 100%;"></progress>
								</div>
							</div>
							<div class="ratings-container" style="width: 10%; margin-left: 20px;">
								<span class="default-text rating-name">
									${movies[movie].compositeRating}%
								</span>
								<span class="default-text rating-name">
                                    ${movies[movie].usersAverageRating}%
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
            `;
			if (favorite) {
				if (movies[movie].compositeRating == 100) {
					moviesList.innerHTML += movieItem;
					document.querySelectorAll('.movie').forEach(el=>el.classList.add('favorite-movie'));
				}
			}
			else {
				moviesList.innerHTML += movieItem;
			}
        }
    });
}

function showAuthorizationDialog(){
	let moviesList = document.getElementById("moviesList");

    moviesList.innerHTML += 
    `
    <div id="authorizationForm" class="default-container movie">
        <div class="default-container-content" style="position: relative; overflow: hidden;">
            <div style="display: flex; justify-content: center; align-items: center;">
                <img src="images/watchstorm-icon2.png" style="width: 116px; height: 116px;">
				<img src="images/watchstorm-icon2.png" style="width: 116px; height: 116px; position: absolute; filter: blur(50px); opacity: 0.5;">
            </div>
            <div style="display: flex; justify-content: center;">
                <header style="color: white; font-weight: 500; font-size: 20px ;margin-top: 10px;">WatchStormWeb</header>
            </div>
            <div style="display: flex; justify-content: center;">
                <div class="description accent-container">
                    <span class="default-text">Welcome to the web version of WatchStorm!
						To log in, enter your username and the 6-digit code
                        that you specified in the mobile application to access the
                        web version of WatchStorm. If you haven't specified it yet,
                        go to the settings of the WatchStorm mobile application
                        and click the "WatchStormWeb" section, and then specify
                        and save a 6-digit code to access the web version of
                        WatchStorm, after which you can log in here.</span>
                </div>
            </div>
            <div style="display: flex; justify-content: center;">
                <div class="input-fields-container accent-container" style="margin-top: 10px; padding: 20px;">
                    <div style="display: flex; justify-content: center;">
                        <input autocomplete="off" id="loginField" class="input-field" placeholder="Your username">
                    </div>
                    <div style="display: flex; justify-content: center; margin-top: 10px;">
                        <input autocomplete="off" type="password" maxlength="6" id="digitCodeField" class="input-field" placeholder="6-digit code">
                    </div>
                    <div style="display: flex; justify-content: center; margin-top: 10px;">
                        <button id="buttonSignIn" class="button-login">Sign In</button>
                    </div>
					<div id="notificationIncorrectLoginOrPassword" style="display: none; align-items: center; justify-content: center;">
						<div class="indicator-negative"></div>
						<span class="default-text notification negative">Incorrect login or password!</span>
					</div>
                </div>
            </div>
        </div>
    </div>   
    `;

	let loginField = document.getElementById("loginField");
	let digitCodeField = document.getElementById("digitCodeField");
	let buttonSignIn = document.getElementById("buttonSignIn");
	let notificationIncorrectLoginOrPassword = document.getElementById("notificationIncorrectLoginOrPassword");

	buttonSignIn.onclick = function() {
		signIn();
	}

	digitCodeField.addEventListener('keydown', (event) => {
		if(event.key === 'Enter') {
			event.preventDefault();
			signIn();
		}
	});

	function signIn(){
		let userLogin = loginField.value;
		let userDigitCode = digitCodeField.value;

		get(child(dbRef, `WatchStormWeb/WebCodes/${userLogin}`)).then((snapshot) => {
			let receivedDigitCode = snapshot.val();
			if (userDigitCode == receivedDigitCode) {
				setCookie('username', userLogin, {});
				setCookie('digitCode', userDigitCode, {});
				closeAuthorizationDialog();
				setListeners(userLogin);
			} 
			else {
				showNotification(notificationIncorrectLoginOrPassword, "flex");
			}
		});
	}
}

function closeAuthorizationDialog() {
	let authorizationForm = document.getElementById("authorizationForm");
	authorizationForm.parentElement.removeChild(authorizationForm);
}

function showSidebar() {
	let sidebar = document.getElementById("sidebar");
	sidebar.style.transform = "translate(0px, 0px)";
}

function getCookie(name) {
	let matches = document.cookie.match(new RegExp(
	  "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	));
	return matches ? decodeURIComponent(matches[1]) : undefined;
}

function setCookie(name, value, options = {}) {
	options = {
		path: '/',
		expires: 'Tue, 19 Jan 2038 03:14:07 GMT',
		...options
	};

	if (options.expires instanceof Date) {
		options.expires = options.expires.toUTCString();
	}

	let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);

	for (let optionKey in options) {
			updatedCookie += "; " + optionKey;
			let optionValue = options[optionKey];
			if (optionValue !== true) {
			updatedCookie += "=" + optionValue;
		}
	}

	document.cookie = updatedCookie;
}

function deleteCookie(name) {
	setCookie(name, "", {
	  'max-age': -1
	});
  }

function authorizeUser() {
	let savedUsername = getCookie("username");
	let savedDigitCode = getCookie("digitCode");

	if(savedUsername != null) {
		get(child(dbRef, `WatchStormWeb/WebCodes/${savedUsername}`)).then((snapshot) => {
			let receivedDigitCode = snapshot.val();
			if (savedDigitCode == receivedDigitCode) {
				setListeners(savedUsername);
			} 
			else {
				showAuthorizationDialog();
			}
		});
	}
	else{
		showAuthorizationDialog();
	}
}

function updateUserDataInSidebar(username) {
	let headersContainer = document.getElementById("headersContainer");

	headersContainer.innerHTML +=
	`
	<div id="userInfoHeader" class="user-info-header" style="height: 75px; background-color: rgb(30, 30, 30);">
		<div class="user-info-container">
			<div style="display:flex-inline; align-items:center; justify-content:center;">
				<img id="userProfileImage" src="images/profile-image-placeholder.png" style="max-width: 50px; height: 50px; transition-duration: 1s; border-radius: 50%;">
			</div>
			<div style="display:block; align-items:center; justify-content:center; margin-left: 10px; padding-bottom: 5px;">
				<header id="username" style="transition-duration: 1000ms; font-weight: 500; font-size: 16px;">${username}</header>
				<header id="userLogin" style="transition-duration: 1000ms; font-weight: 400; font-size: 12px; filter: opacity(0.5);">@${username.toLowerCase()}</header>
			</div>
		</div>
	</div>
	`;
	
	let userProfileImage = document.getElementById("userProfileImage");

	getDownloadURL(sRef(storage, `${username}/Images/ProfileImage.jpg`)).then((url) => {
		userProfileImage.src = url;
	});
}

function setOnFavoriteMoviesButtonClickListener(username){
	let favoriteMoviesButton = document.getElementById("favoriteMoviesButton");
	favoriteMoviesButton.onclick = function() {
		moviesList.innerHTML = '';
		getUserMovies(username, true);
	}
}

function setOnMoviesButtonClickListener(username){
	let moviesButton = document.getElementById("moviesButton");
	moviesButton.onclick = function() {
		moviesList.innerHTML = '';
		getUserMovies(username, false);
	}
}

function setOnAddNewMovieButtonClickListener(){
	let addNewMovieButton = document.getElementById("addNewMovieButton");
	let buttonSearchMovie = document.getElementById("buttonSearchMovie");
	let searchMovieDialog = document.getElementById("searchMovieDialog");
	let buttonSaveRating = document.getElementById("buttonSaveRating");
	let notificationPleaseFillInAllFields = document.getElementById("notificationPleaseFillInAllFields");
	let notificationPleaseEnterMovieTitle = document.getElementById("notificationPleaseEnterMovieTitle");

	addNewMovieButton.onclick = function() {
		let addMovieDialog = document.getElementById("addMovieDialog");
		addMovieDialog.showModal();

		setOnOutsideDialogClickListener(addMovieDialog, function(){
			if (searchMovieDialog != null){
				searchMovieDialog.innerHTML = '';
				searchMovieDialog.close();
			}
		});

		buttonSearchMovie.onclick = function(){
			searchMovieDialog.innerHTML = '';
			let movieTitleField = document.getElementById("movieTitleField");
			let url;
			
			if (movieTitleField.value != ""){
				url = `https://api.themoviedb.org/3/search/multi?api_key=88323c284697a03104d20067cd85c910&query=${movieTitleField.value}`;
				searchMovieDialog.showModal();
				fetch(url)
				.then(jsonResponse => jsonResponse.json())
				.then(json => {
					for (let i = 0; i < 20; i++) {
						if (json.results[i].media_type == "movie"){
							if(json.results[i].poster_path != null && json.results[i].title != null && json.results[i].release_date != null){
								searchMovieDialog.innerHTML +=
								`
								<div class="found-movie-item" style="display: flex; justify-content: left; margin-bottom: 10px;" data-movie="${json.results[i].title}+${(json.results[i].release_date).substring(0, 4)}+${json.results[i].poster_path}+${(json.results[i].overview).replaceAll('\"', '\'')}"
								 onclick="
									let movieData = (this.getAttribute('data-movie')).split('\+');
									movieTitleField.value = movieData[0];
									movieYearField.value = movieData[1];
									moviePosterPath.value = movieData[2];
									movieDescription.value = movieData[3];
									searchMovieDialog.close();
								 ">
									<div>
										<img class="movie-image" src="images/movie_placeholder2.jpg">
										<div style="float: right; margin-left: 10px; height: 50px; display: flex; align-items: center;">
											<div>
												<header id="titleText" style="font-size: 14px; color: white;">${json.results[i].title.substring(0, 25)}</header>
												<header style="font-size: 14px; color: white; margin-top: 2px; filter: opacity(0.5);">Movie, ${(json.results[i].release_date).substring(0, 4)}</header>
											</div>
										</div>
									</div>
								</div>
								`;
							}
						}
						if (json.results[i].media_type == "tv"){
							if(json.results[i].poster_path != null && json.results[i].name != null && json.results[i].first_air_date != null){
								searchMovieDialog.innerHTML +=
								`
								<div class="found-movie-item" style="display: flex; justify-content: left; margin-bottom: 10px;" data-movie="${json.results[i].name}+${(json.results[i].first_air_date).substring(0, 4)}+${json.results[i].poster_path}+${(json.results[i].overview).replaceAll('\"', '\'')}"
								 onclick="
								 	let movieData = (this.getAttribute('data-movie')).split('\+');
									movieTitleField.value = movieData[0];
									movieYearField.value = movieData[1];
									moviePosterPath.value = movieData[2];
									movieDescription.value = movieData[3];
									searchMovieDialog.close();
								 ">
									<div>
										<img class="movie-image" src="images/movie_placeholder2.jpg">
										<div style="float: right; margin-left: 10px; height: 50px; display: flex; align-items: center;">
											<div>
												<header style="font-size: 14px; color: white;">${json.results[i].name.substring(0, 25)}</header>
												<header style="font-size: 14px; color: white; margin-top: 2px; filter: opacity(0.5);">TV, ${(json.results[i].first_air_date).substring(0, 4)}</header>
											</div>
										</div>
									</div>
								</div>
								`;
							}
						}
					}
				});
			}
			else
			{
				showNotification(notificationPleaseEnterMovieTitle, "flex");
			}
		}
	}

	buttonSaveRating.onclick = function(){
		if (movieTitleField.value != "" && movieYearField.value != "" &&
			moviePosterPath.value != "" && movieDescription.value != "" &&
			movieVisualRating.value != "" && movieCastRating.value != "" && moviePlotRating.value != ""){
			set(ref(db, `WatchStorm/${getCookie("username")}/Movies/${movieTitleField.value}`), {
				title: movieTitleField.value,
				year: movieYearField.value,
				imagePath: `https://image.tmdb.org/t/p/w500/${moviePosterPath.value}`,
				description: movieDescription.value,
				visualRating: parseInt(movieVisualRating.value),
				castRating: parseInt(movieCastRating.value),
				plotRating: parseInt(moviePlotRating.value),
				usersAverageRating: Math.round((parseInt(movieVisualRating.value) + parseInt(movieCastRating.value) + parseInt(moviePlotRating.value))/3),
				compositeRating: Math.round((parseInt(movieVisualRating.value) + parseInt(movieCastRating.value) + parseInt(moviePlotRating.value))/3)
			});
			clearInputFields(addMovieDialog);
			addMovieDialog.close();
			moviesList.innerHTML = '';
			getUserMovies(getCookie("username"), false);
		}
		else
		{
			showNotification(notificationPleaseFillInAllFields, "flex");
		}
	}
}

function setOnNewsButtonClickListener(){
	let newsButton = document.getElementById("newsButton");
	newsButton.onclick = function() {
		moviesList.innerHTML = '';

		get(child(dbRef, "WatchStormWeb/News/")).then((snapshot) => {
			let news = snapshot.val();
			for (let neww in news) {
				let newwItem = 
				`
				<div class="default-container news" style="user-select: none;">
					<div class="default-container-content">
						<div class="movie-item">
							<div class="movie-main-info">
								<img class="movie-image" src="images/newlogo6.jpg">
								<div class="movie-title-and-year">
									<div style="display: inline-flex">
										<span class="movie-title">WatchStorm</span>
										<i class="fa-solid fa-circle-check fa-sm fa verified"></i>
									</div>
									<span class="movie-year">${news[neww].date}</span>
								</div>
							</div>
							<div class="description accent-container">
								<span class="default-text">${news[neww].description}</span>
							</div>
						</div>
					</div>
				</div>
				`;
				moviesList.innerHTML += newwItem;
			}
		});
	}
}

function setOnSignOutButtonClickListener(){
	let signOutButton = document.getElementById("signOutButton");

	signOutButton.onclick = function(){
		let moviesList = document.getElementById("moviesList");
		let sidebar = document.getElementById("sidebar");
		let userInfoHeader = document.getElementById("userInfoHeader");

		moviesList.innerHTML = '';
		sidebar.style.transform = "translate(-300px, 0px)";
		if(userInfoHeader != null) userInfoHeader.remove();

		deleteCookie("username");
		deleteCookie("digitCode");
		
		showAuthorizationDialog();
	}
}

function setOnRecommendationsButtonClickListener(){
	let recommendationsButton = document.getElementById("recommendationsButton");
	let TMDBisAvailable = false;

	recommendationsButton.onclick = function(){
		moviesList.innerHTML = '';
		moviesList.innerHTML += 
		`
		<div class="messages-container" style="cursor:pointer;">
			<div style="width: 760px; height: 40px; display: flex; justify-content: center; align-items: center;">
				<div id="assistantContainer" class="accent-container" style="display: flex; justify-content: center; align-items: center; width: fit-content; cursor: pointer;">
					<img src="images/newlogo6.jpg" style="width: 40px; height: 40px; border-radius: 50%;">
					<span style="font-size: 16px; color: white; margin-left: 5px; user-select: none;	">WatchStorm Assistant</span>
					<div id="availableStatusContainer" class="availability-status-container">
						<div class="availability-indicator"></div>
						<span class="availability-status">available</span>
					</div>
					<div id="unavailableStatusContainer" class="availability-status-container" style="background-color: rgba(255, 83, 83, 0.1);">
						<div class="availability-indicator" style="  background-color: rgb(255, 83, 83, 0.6);"></div>
						<span class="availability-status" style="color: rgb(255, 83, 83, 0.6);">unavailable</span>
					</div>
				</div>
			</div>
			<div class="messages-container-content" id="messagesContainer"></div>
			<div style="display: inline-flex; margin-top: 20px;">
				<input id="inputUserMessage" autocomplete="off" class="input-field input-message">
				<div id="buttonSendMessage" class="accent-container rounded-button">
					<i class="fa-solid fa-arrow-up fa fa-fw"></i>
				</div>
			</div>
		</div>
		`;
		setTimeout(()=> sendMessage("watchstorm", "Hello, how i can help?", "block"), 1000);
		checkTMDBAvailability();
		
		let messagesContainer = document.getElementById("messagesContainer");
		let assistantContainer = document.getElementById("assistantContainer");
		let availableStatusContainer = document.getElementById("availableStatusContainer");
		let unavailableStatusContainer = document.getElementById("unavailableStatusContainer");
		let inputUserMessage = document.getElementById("inputUserMessage");
		let buttonSendMessage = document.getElementById("buttonSendMessage");

		assistantContainer.onclick = function(){
			if (availableStatusContainer.style.display != "flex" && unavailableStatusContainer.style.display != "flex") {
				if (TMDBisAvailable) {
					availableStatusContainer.style.display = "flex";
				} else {
					unavailableStatusContainer.style.display = "flex";
				}
			} else {
				availableStatusContainer.style.display = "none";
				unavailableStatusContainer.style.display = "none";
			}
		}

		buttonSendMessage.onclick = function(){
			sendMessage("user", inputUserMessage.value, "none");
		}

		inputUserMessage.addEventListener('keydown', (event) => {
			if(event.key === 'Enter') {
				event.preventDefault();
				sendMessage("user", inputUserMessage.value, "none");
			}
		});

		function sendMessage(messageSender, messageText, displayWatchStormIcon){
			messagesContainer.innerHTML +=
			`
			<div class="message-from-${messageSender}-container message">
				<img src="images/newlogo6.jpg" style="width: 40px; height: 40px; border-radius: 50%; display: ${displayWatchStormIcon};">
				<div class="message-from-${messageSender}">
					<span class="default-text">${messageText}</span>
				</div>
			</div>
			`
			messagesContainer.scrollTop = messagesContainer.scrollHeight;
			inputUserMessage.value = "";

			if (messageSender == "user") {
				setTimeout(()=> replyToUserMessage(messageText), 500);
			}

			setTimeout(()=> {
				if (typeof  document.getElementsByClassName("message")[0] != 'undefined') document.getElementsByClassName("message")[0].classList.remove("message")
			}, 500);
		}

		function replyToUserMessage(userMessageText){
			if (userMessageText.includes("/commands") || userMessageText.includes("/help")) {
				sendMessage("watchstorm",
				 `List of supported commands: <br> <span onclick="document.getElementById('inputUserMessage').value='/recommendations'" class="command">/recommendations</span>
				 command is used to get recommendations. Enter the title of the movie or series you liked after the command, and WatchStorm Assistant will recommend movies
				 that you should like! <br> <span onclick="document.getElementById('inputUserMessage').value='/upcoming'" class="command">/upcoming</span>
				 command is used to get the list of upcoming movies. <br> <span onclick="document.getElementById('inputUserMessage').value='/trending'" class="command">/trending</span>
				 command is used to get movies that are currently trending. <br> <span onclick="document.getElementById('inputUserMessage').value='/top'" class="command">/top</span>
				 command is used to get a list of the highest rated movies. <br> <span onclick="document.getElementById('inputUserMessage').value='/help'" class="command">/help</span>
				 command is identical to the /commands command. <br>`, "block");
			}
			else if (userMessageText.includes("/recommendations")) {
				if (userMessageText.split("/recommendations")[1] != "") {
					searchForRecommendations(userMessageText.split("/recommendations ")[1]);
				} else {
					sendMessage("watchstorm", "Please enter the movie name after the command!", "block")
				}
			}
			else if (userMessageText.includes("/trending")) {
				searchForTrendingMovies();
			}
			else if (userMessageText.includes("/top")) {
				searchForTopRatedMovies();
			}
			else if (userMessageText.includes("/upcoming")){
				searchForUpcomingMovies();
			}
			else if ((userMessageText.includes("ello") || userMessageText.includes("ey") || userMessageText.includes("sup")) && !userMessageText.includes("\/")) {
				sendMessage("watchstorm", "Hello!", "block");
			}
			else if ((userMessageText.includes("hank you") || userMessageText.includes("anks")) && !userMessageText.includes("\/")) {
				sendMessage("watchstorm", "You're welcome!", "block");
			}
			else if (userMessageText.includes("ye") && !userMessageText.includes("\/")) {
				sendMessage("watchstorm", "See you again!", "block");
			}
			else {
				sendMessage("watchstorm", "Sorry, I can't recognize your message. Please see the list of supported commands by sending " +
				"<span onclick=\"document.getElementById(\'inputUserMessage\').value='\/commands'\" class=\"command\">\"\/commands\"</span>", "block");
			}
		}

		function searchForRecommendations(movieTitle){
			fetch(`https://api.themoviedb.org/3/search/multi?api_key=88323c284697a03104d20067cd85c910&query=${movieTitle}`)
			.then(response => response.json())
			.then(response => {
				fetch(`https://api.themoviedb.org/3/movie/${response.results[0].id}/recommendations?api_key=88323c284697a03104d20067cd85c910`)
				.then(response => response.json())
				.then(response => {
					sendMessage("watchstorm", `If you liked the movie "${movieTitle}", I can recommend you movies like ${response.results[0].title} (${(response.results[0].release_date).substring(0, 4)}),
					${response.results[1].title} (${(response.results[1].release_date).substring(0, 4)}) and ${response.results[2].title} (${(response.results[2].release_date).substring(0, 4)}).
					You might also like ${response.results[3].title} (${(response.results[3].release_date).substring(0, 4)}), ${response.results[4].title} (${(response.results[4].release_date).substring(0, 4)}),
					${response.results[5].title} (${(response.results[5].release_date).substring(0, 4)}), ${response.results[6].title} (${(response.results[6].release_date).substring(0, 4)})
					and ${response.results[7].title} (${(response.results[7].release_date).substring(0, 4)}).`, "block");
				})
				.catch(err => console.error(err));
			})
			.catch(err => {
				console.error(err);
				sendMessage("watchstorm", `Sorry, it looks like WatchStorm Assistant is not available at the moment`, "block");
			});
		}

		function searchForTrendingMovies(){
			fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=88323c284697a03104d20067cd85c910")
			.then(response => response.json())
			.then(response => {
				sendMessage("watchstorm", `
					The most popular for the week was "${response.results[0].title}" with an average user rating of ${(parseFloat(response.results[0].vote_average)*10).toString().substring(0, 2)}%.
					The second most popular was "${response.results[1].title}" with an AAR of ${(parseFloat(response.results[1].vote_average)*10).toString().substring(0, 2)}%.
					"${response.results[2].title}" closes the top three with an average rating of ${(parseFloat(response.results[2].vote_average)*10).toString().substring(0, 2)}%.`, "block");
			})
			.catch(err => {
				console.error(err);
				sendMessage("watchstorm", `Sorry, it looks like WatchStorm Assistant is not available at the moment`, "block");
			});
		}

		function searchForTopRatedMovies(){
			fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=88323c284697a03104d20067cd85c910")
			.then(response => response.json())
			.then(response => {
				sendMessage("watchstorm", `The first place of the most highly rated movies is deservedly occupied by "${response.results[0].title}" with an average rating of
				${(parseFloat(response.results[0].vote_average)*10).toString().substring(0, 2)}%, released in ${(response.results[0].release_date).substring(0, 4)}.
				<br>In second place is "${response.results[1].title}" with AAR ${(parseFloat(response.results[1].vote_average)*10).toString().substring(0, 2)}%, released in ${(response.results[1].release_date).substring(0, 4)}.
				<br>"${response.results[2].title}", released in ${(response.results[3].release_date).substring(0, 4)}, closes the top three with an average rating of ${(parseFloat(response.results[2].vote_average)*10).toString().substring(0, 2)}%.
				<br>Also, the list of the most highly rated movies includes "${response.results[3].title}", "${response.results[4].title}", "${response.results[5].title}", "${response.results[6].title}" and "${response.results[7].title}".`, "block");
			})
			.catch(err => {
				console.error(err);
				sendMessage("watchstorm", `Sorry, it looks like WatchStorm Assistant is not available at the moment`, "block");
			});
		}

		function searchForUpcomingMovies() {
			fetch("https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1&region=US&api_key=88323c284697a03104d20067cd85c910")
			.then(response => response.json())
			.then(response => {
				sendMessage("watchstorm", `The most anticipated upcoming movie is "${response.results[0].title}", which is scheduled to be released on ${new Date(Date.parse(response.results[0].release_date)).toLocaleDateString("ru-RU")}.
				The second most popular upcoming movie is "${response.results[1].title}", which is scheduled to be released on ${new Date(Date.parse(response.results[1].release_date)).toLocaleDateString("ru-RU")}.
				Closes the top three is "${response.results[2].title}", which is scheduled to be released on ${new Date(Date.parse(response.results[2].release_date)).toLocaleDateString("ru-RU")}.
				Also due out in the near future are movies such as "${response.results[3].title}", "${response.results[4].title}", "${response.results[5].title}", "${response.results[6].title}" and "${response.results[7].title}".`, "block");
			})
			.catch(err => {
				console.error(err);
				sendMessage("watchstorm", `Sorry, it looks like WatchStorm Assistant is not available at the moment`, "block");
			});
		}

		function checkTMDBAvailability(){
			fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=88323c284697a03104d20067cd85c910")
			.then(response => response.json())
			.then(TMDBisAvailable = true)
			.catch(err => {
				console.error(err);
				TMDBisAvailable = false;
			});
		}
	}
}

function setOnSettingsButtonClickListener(){
	let settingsButton = document.getElementById("settingsButton");
	settingsButton.onclick = function() {
		moviesList.innerHTML = '';
		moviesList.innerHTML += 				
		`
		<div class="settings-container" style="cursor:pointer;">
			<div class="awardLine">
				<div class="settings-item" id="buttonInformationDialog">
					<div>
						<i class="fa-solid fa-circle-info fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Information</span>
					</div>
				</div>
				<div class="settings-item" id="buttonChangeDigitCodeDialog" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-lock fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Change 6-digit Code</span>
					</div>
				</div>
				<div class="settings-item" id="buttonExportMovies" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-file-arrow-down fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Export Movies to JSON</span>
					</div>
				</div>
				<div class="settings-item" id="buttonImportMoviesDialog" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-file-arrow-up fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Import Movies from JSON</span>
					</div>
		   		</div>
				<div class="settings-item" id="buttonDownloadWatchStormApp" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-file fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Download WatchStorm</span>
					</div>
				</div>
				<div class="settings-item" id="buttonWatchStormWebRepository" style="margin-top: 20px;">
					<div>
						<i class="fa-brands fa-github fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">WatchStormWeb GitHub Repository</span>
					</div>
				</div>
				<div class="settings-item" id="buttonLeaveFeedbackDialog" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-star fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Leave a Feedback</span>
					</div>
				</div>
				<div class="settings-item" id="buttonContactTheDeveloperDialog" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-envelope fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Contact The Developer</span>
					</div>
				</div>
			</div>
		</div>
		`;
		setOnButtonInformationDialogClickListener();
		setOnButtonChangeDigitCodeDialogListener();
		setOnButtonImportMoviesDialogClickListener();
		setOnButtonExportMoviesClickListener();
		setOnButtonDownloadWatchStormAppClickListener();
		setOnButtonWatchStormWebRepositoryClickListener();
		setOnButtonLeaveFeedbackDialogClickListener();
		setOnButtonContactTheDeveloperDialogClickListener();
	}
}

function setOnButtonInformationDialogClickListener(){
	let buttonInformationDialog = document.getElementById("buttonInformationDialog");
	let informationDialog = document.getElementById("informationDialog");
	let releaseNotesContainer = document.getElementById("releaseNotesContainer");
	let spanShowReleaseNotes = document.getElementById("spanShowReleaseNotes");

	buttonInformationDialog.onclick = function(){
		informationDialog.showModal();
		getLatestReleaseInfo();
	}

	setOnOutsideDialogClickListener(informationDialog);

	spanShowReleaseNotes.addEventListener('click', function (event) {
		event.stopPropagation();
		if (releaseNotesContainer.style.display == 'none'){
			releaseNotesContainer.style.display = 'block';
		}
		else {
			releaseNotesContainer.style.display = 'none';
		}
	});
}

function setOnButtonChangeDigitCodeDialogListener(){
	let buttonChangeDigitCodeDialog = document.getElementById("buttonChangeDigitCodeDialog");
	let changeDigitCodeDialog = document.getElementById("changeDigitCodeDialog");
	let inputNewDigitCode = document.getElementById("inputNewDigitCode");
	let buttonSaveDigitCode = document.getElementById("buttonSaveDigitCode");
	let notificationDigitCodeHasBeenChanged = document.getElementById("notificationDigitCodeHasBeenChanged");
	let notificationEnterValidDigitCode = document.getElementById("notificationEnterValidDigitCode");

	buttonChangeDigitCodeDialog.onclick = function(){
		changeDigitCodeDialog.showModal();
	}

	inputNewDigitCode.addEventListener('input', function(event){
		if (inputNewDigitCode.value.length == 6) {
			buttonSaveDigitCode.disabled = false;
		} else {
			buttonSaveDigitCode.disabled = true;
		}
	});

	buttonSaveDigitCode.onclick = function(){
		if (inputNewDigitCode.value.length == 6){
			set(ref(db, `WatchStormWeb/WebCodes/${getCookie("username")}`), inputNewDigitCode.value);
			setCookie('digitCode', inputNewDigitCode.value, {});
			showNotification(notificationDigitCodeHasBeenChanged, "flex");
			inputNewDigitCode.value = "";
		} else {
			showNotification(notificationEnterValidDigitCode, "flex");
		}
	}

	setOnOutsideDialogClickListener(changeDigitCodeDialog);
}

function setOnButtonExportMoviesClickListener(){
	let buttonExportMovies = document.getElementById("buttonExportMovies");

	buttonExportMovies.onclick = function(){
		get(child(dbRef, `WatchStorm/${getCookie("username")}/Movies/`)).then((snapshot) => {
			var a = document.createElement("a");
			var file = new Blob([JSON.stringify(snapshot.val(), null, 4)], {type: 'application/json'});
			a.href = URL.createObjectURL(file);
			a.download = `movies-${(getCookie("username")).toLowerCase()}.json`;
			a.click();
		});
	}
}

function setOnButtonImportMoviesDialogClickListener(){
	let buttonImportMoviesDialog = document.getElementById("buttonImportMoviesDialog");
	let importMoviesDialog = document.getElementById("importMoviesDialog");
	let dropZone = document.getElementById("dropZone");
	let notificationUploadFileInJsonFormat = document.getElementById("notificationUploadFileInJsonFormat");
	let buttonSaveImportedMovies = document.getElementById("buttonSaveImportedMovies");
	let dropZoneText = document.getElementById("dropZoneText");
	let uploadedItem = document.getElementById("uploadedItem");
	let uploadedFileName = document.getElementById("uploadedFileName");
	let userMoviesJson;

	buttonImportMoviesDialog.onclick = function(){
		importMoviesDialog.showModal();
	}

	dropZone.addEventListener("dragover", (e) => {
		e.preventDefault();
		dropZone.classList.add("drop-zone-over");
	});

	["dragleave", "dragend"].forEach((type) => {
		dropZone.addEventListener(type, (e) => {
			dropZone.classList.remove("drop-zone-over");
		});
	});

	dropZone.addEventListener("drop", (e) => {
		e.preventDefault();

		const files = Array.from(e.dataTransfer.files);
		const textFiles = files.filter(file => file.type === 'application/json');

		const reader = new FileReader();
		try {
			reader.readAsText(textFiles[0]);
			reader.addEventListener('load', () => {
				const content = reader.result.toString();
				userMoviesJson = content;
				dropZoneText.style.display = "none";
				uploadedItem.style.display = "block";
				buttonSaveImportedMovies.style.display = "block";
				uploadedFileName.innerHTML = `${textFiles[0].name}`;
			});
		} catch (e) {
			showNotification(notificationUploadFileInJsonFormat, "flex");
		}
	
		dropZone.classList.remove("drop-zone-over");
	});

	buttonSaveImportedMovies.onclick = function(){
		set(ref(db, `WatchStorm/${getCookie("username")}/Movies/`), JSON.parse(userMoviesJson));
		importMoviesDialog.close();
		moviesList.innerHTML = '';
		getUserMovies(getCookie("username"), false);
	}

	setOnOutsideDialogClickListener(importMoviesDialog, function(){
		uploadedItem.style.display = "none";
		buttonSaveImportedMovies.style.display = "none";
		dropZoneText.style.display = "flex";
	});
}

function setOnButtonDownloadWatchStormAppClickListener(){
	let buttonDownloadWatchStormApp = document.getElementById("buttonDownloadWatchStormApp");

	buttonDownloadWatchStormApp.onclick = function(){
		downloadWatchStormLatest();
	}
}

function setOnButtonLeaveFeedbackDialogClickListener(){
	let buttonLeaveFeedbackDialog = document.getElementById("buttonLeaveFeedbackDialog");
	let leaveFeedbackDialog = document.getElementById("leaveFeedbackDialog");
	let inputFeedbackText = document.getElementById("inputFeedbackText");
	let buttonSendFeedback = document.getElementById("buttonSendFeedback");
	let notificationFeedbackHasBeenSent = document.getElementById("notificationFeedbackHasBeenSent");
	let notificationPleaseFillFeedbackField = document.getElementById("notificationPleaseFillFeedbackField");

	buttonLeaveFeedbackDialog.onclick = function(){
		leaveFeedbackDialog.showModal();
	}

	buttonSendFeedback.onclick = function(){
		if (inputFeedbackText.value.length > 0){
			set(ref(db, `WatchStormWeb/Feedback/${getCookie("username")}`), inputFeedbackText.value);
			inputFeedbackText.value = "";
			showNotification(notificationFeedbackHasBeenSent, "flex");
		} else {
			showNotification(notificationPleaseFillFeedbackField, "flex");
		}
	}

	setOnOutsideDialogClickListener(leaveFeedbackDialog);
}

function setOnButtonDeleteMovieClickListener(){
	buttonDeleteMovie.onclick = function() {
		set(ref(db, `WatchStorm/${getCookie("username")}/Movies/${movieDialog.getAttribute('data-delete')}`), null);
		movieDialog.close();
		moviesList.innerHTML = '';
		getUserMovies(getCookie("username"), false);
	}
}

function setOnButtonWatchStormWebRepositoryClickListener(){
	let buttonWatchStormWebRepository = document.getElementById("buttonWatchStormWebRepository");

	buttonWatchStormWebRepository.onclick = function(){
		window.open("https://github.com/KolyaFedorenko/WatchStormWeb");
	}
}

function setOnButtonContactTheDeveloperDialogClickListener(){
	let buttonContactTheDeveloperDialog = document.getElementById("buttonContactTheDeveloperDialog");
	let contactTheDeveloperDialog = document.getElementById("contactTheDeveloperDialog");
	let buttonCopyEmail = document.getElementById("buttonCopyEmail");
	let notificationEmailHasBeenCopied = document.getElementById("notificationEmailHasBeenCopied");

	buttonContactTheDeveloperDialog.onclick = function(){
		contactTheDeveloperDialog.showModal();
	}

	buttonCopyEmail.onclick = function(){
		navigator.clipboard.writeText("administrator@watchstorm.ru");
		showNotification(notificationEmailHasBeenCopied, "flex");
	}

	setOnOutsideDialogClickListener(contactTheDeveloperDialog);
}

function setListeners(userLogin){
	showSidebar();
	updateUserDataInSidebar(userLogin);
	getUserMovies(userLogin, false);
	setOnFavoriteMoviesButtonClickListener(userLogin);
	setOnMoviesButtonClickListener(userLogin);
	setOnAddNewMovieButtonClickListener();
	setOnButtonDeleteMovieClickListener();
	setOnNewsButtonClickListener();
	setOnRecommendationsButtonClickListener();
	setOnSettingsButtonClickListener();
	setOnSignOutButtonClickListener();
}

function setOnOutsideDialogClickListener(dialog, functionToExecute){
	dialog.addEventListener('click', function (event) {
		let rect = dialog.getBoundingClientRect();
		let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
		  && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog) {
			dialog.close();
			if(typeof functionToExecute != 'undefined') executeFunction(functionToExecute);
		}
	});
}

function showNotification(notificationElement, displayType){
	notificationElement.style.display = displayType;
	setTimeout(()=> notificationElement.style.display = "none", 4000);
}

function clearInputFields(inputFieldsParentElement){
	let inputFields = inputFieldsParentElement.getElementsByTagName("input");
	for(let i=0; i<inputFields.length; i++){
		inputFields[i].value = '';
	}
}

async function getLatestReleaseInfo() {
	let spanReleaseVersion = document.getElementById("spanReleaseVersion");
	let spanReleaseDate = document.getElementById("spanReleaseDate");
	let spanReleaseNotes = document.getElementById("spanReleaseNotes");
	let jsonReleaseInfo;
  
	const res = await fetch('https://api.github.com/repositories/511941040/releases/latest');
	jsonReleaseInfo = await res.json();

	spanReleaseDate.innerHTML = `Released: ${new Date(Date.parse(jsonReleaseInfo.published_at)).toLocaleDateString("ru-RU")}`;
	spanReleaseVersion.innerHTML = 
	`
		Version: <span class="version" onclick="
		timelineDialog.showModal();
		timelineDialog.addEventListener('click', function (event) {
		   let rect = timelineDialog.getBoundingClientRect();
		   let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
			 && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		   if (!isInDialog) {
			timelineDialog.close();
		   }
	   	});">${(jsonReleaseInfo.tag_name).replace('v.', '')}</span>
	`;
	spanReleaseNotes.innerHTML = `${(jsonReleaseInfo.body).slice(30).replaceAll('\r\n', '<br>').replaceAll('*', '').replaceAll('-', '•')}`;
}

async function downloadWatchStormLatest(){
	const res = await fetch('https://api.github.com/repos/KolyaFedorenko/WatchStorm/releases/latest');
	let jsonReleaseInfo = await res.json();
	window.open(`${jsonReleaseInfo.assets[0].browser_download_url}`);
}

const executeFunction = (functionToExecute) => {
	functionToExecute();
}

window.onload = function(){
	authorizeUser();
}