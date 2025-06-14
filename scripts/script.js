import { initializeApp } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-analytics.js";
import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.8.0/firebase-database.js";
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

function getUserMovies(username, favorite) {
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
								<div style="display: inline-flex;">
									<span class="movie-title">${movies[movie].title}</span>
									<div class="favorite-movie-label">
										<i class="fa-solid fa-heart fa-fw fa-xs" style="filter: grayscale(1);"></i>
										<span style="margin-left: 3px;">Favorite</span>
									</div>
								</div>
								<span class="movie-year">${movies[movie].year}</span>
							</div>
						</div>
						<div class="description accent-container">
							<span class="default-text">${movies[movie].description}</span>
						</div>
						<div class="ratings accent-container" style="padding-top: 7px; padding-bottom: 10px; display: inline-flex; justify-content: center;">
							<div class="ratings-container ratings-names" style="width: 30%;">
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
									<progress value="${movies[movie].plotRating}" max="100" style="margin-top: 15px;"></progress>
								</div>
							</div>
							<div class="ratings-container ratings-values" style="width: 10%; margin-left: 20px;">
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
						<div class="average-ratings accent-container" style="padding-top: 5px; padding-bottom: 10px; display: inline-flex; justify-content: center;">
							<div class="ratings-container" style="width: 53%;">
								<span class="default-text rating-name">
									Your average rating:
								</span>
								<span class="default-text rating-name">
									Audience average rating:
								</span>
							</div>
							<div class="ratings-values-container" style="width: 30%; margin-left: 10px;">
								<div class="bottom-progress-container" style="width: 100%; height: 100%;">
									<progress value="${movies[movie].compositeRating}" max="100" style="vertical-align: top; margin-top: 12px; width: 100%;"></progress>
									<progress value="${movies[movie].usersAverageRating}" max="100" style="margin-top: 15px; width: 100%;"></progress>
								</div>
							</div>
							<div class="ratings-container ratings-values" style="width: 10%; margin-left: 20px;">
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
					document.querySelectorAll('.movie').forEach(el => el.classList.add('favorite-movie'));
				}
			}
			else {
				moviesList.innerHTML += movieItem;
			}
		}
	});
}

function showAuthorizationDialog(userAlreadyRegistered) {
	let moviesList = document.getElementById("moviesList");

	moviesList.innerHTML +=
		`
    <div id="authorizationForm" class="default-container authorization-form">
        <div class="default-container-content" style="position: relative; overflow: hidden;">
			<div id="authorizationFormHeaderContainer">
				<div style="display: flex; justify-content: center; align-items: center;">
					<img src="images/watchstorm-icon2.png" id="imageWatchStormLogo" class="watchstorm-logo">
				</div>
				<div style="display: flex; justify-content: center;">
					<header style="color: white; font-weight: 500; font-size: 20px ;margin-top: 10px;">WatchStormWeb</header>
				</div>
				<div style="display: flex; justify-content: center;">
					<div class="description accent-container">
						<span class="default-text">
							Welcome to WatchStormWeb! To sign in, enter your username and password in the fields below
							and click the "Sign In" button. If you don't have an account yet, please register first
							using the WatchStorm mobile app or WatchStormWeb, then you can sign in to your account here.
						</span>
					</div>
				</div>
			</div>
            <div style="display: flex; justify-content: center;">
                <div id="authorizationFormMainContentContainer" class="accent-container" style="padding: 20px;">
					<div id="authorizationFormInputsContainer">
						<div style="display: flex; justify-content: center;">
							<input autocomplete="off" id="inputLogin" class="input-field" placeholder="Your username">
						</div>
						<div style="display: flex; justify-content: center; margin-top: 10px;">
							<input autocomplete="off" type="password" id="inputPassword" class="input-field" placeholder="Your password">
						</div>
						<div style="display: flex; justify-content: center; margin-top: 10px;">
							<button id="buttonSignIn" class="default-button">Sign In</button>
						</div>
					</div>
					<div id="digitCodeContainer" class="totp-digit-code-container">
						<div style="display: inline-flex; align-items: center; justify-content: center; width: 100%;">
							<i class="fa-solid fa-lock fa-2xs fa-fw" style="color: white;"></i>
							<span class="default-text" style="margin-left: 2px;">Two-factor authentication</header>
						</div>
						<div style="margin-top: 10px; padding: 10px 20px; background-color: rgba(40, 40, 40, 1); border-radius: 15px;">
							<span class="default-text" style="opacity: 0.75;">
								Your account is protected by 2FA. Please enter the 6-digit code from the authenticator app
								in the field below and click the "Verify" button to continue.
							</span>
						</div>
						<input id="inputDigitCode" autocomplete="off" type="number" class="input-field" placeholder="6-digit code" style="margin-top: 10px;" oninput="if (this.value.length > 6) this.value = this.value.slice(0, 6); if (this.value.length === 6) buttonVerifyDigitCode.disabled = false; else buttonVerifyDigitCode.disabled = true;">
						<div style="display: flex; justify-content: center; margin-top: 10px;">
							<button id="buttonVerifyDigitCode" class="default-button" disabled>Verify</button>
						</div>
					</div>
					<div id="notificationAuthorizationPleaseFillInAllFields" class="notification">
						<div class="indicator-negative"></div>
						<span class="default-text negative">Please fill in all fields!</span>
					</div>
					<div id="notificationIncorrectLoginOrPassword" class="notification">
						<div class="indicator-negative"></div>
						<span class="default-text negative">Incorrect login or password!</span>
					</div>
					<div id="notificationThisUsernameIsTaken" class="notification">
						<div class="indicator-negative"></div>
						<span class="default-text negative">Sorry, but this username is already taken!</span>
					</div>
					<div id="notificationIncorrectDigitCode" class="notification">
						<div class="indicator-negative"></div>
						<span class="default-text negative">Please enter the correct 6-digit code!</span>
					</div>
                </div>
            </div>
        </div>
    </div>
	<div id="websiteInfo" class="website-info">
		<div style="display: flex; justify-content: center; align-items: center;">
			<i class="fa-solid fa-code"></i>
			<span style="margin-left: 5px;">
				Created and designed by
			</span>
			<div class="creator-info" onclick="window.open('https:\/\/github.com/KolyaFedorenko')">
				<img src="https://avatars.githubusercontent.com/u/79241854?v=4" style="width: 15px; height: 15px; border-radius: 50%; object-fit: cover; opacity: 0.75;">
				<span style="margin-left: 5px;">
					KolyaFedorenko
				</span>
			</div>
		</div>
	</div>
    `;

	let authorizationFormHeaderContainer = document.getElementById("authorizationFormHeaderContainer");
	let authorizationFormMainContentContainer = document.getElementById("authorizationFormMainContentContainer");
	let authorizationFormInputsContainer = document.getElementById("authorizationFormInputsContainer");

	let inputLogin = document.getElementById("inputLogin");
	let inputPassword = document.getElementById("inputPassword");
	let buttonSignIn = document.getElementById("buttonSignIn");

	let digitCodeContainer = document.getElementById("digitCodeContainer");
	let inputDigitCode = document.getElementById("inputDigitCode");
	let buttonVerifyDigitCode = document.getElementById("buttonVerifyDigitCode");

	let notificationAuthorizationPleaseFillInAllFields = document.getElementById("notificationAuthorizationPleaseFillInAllFields");
	let notificationIncorrectLoginOrPassword = document.getElementById("notificationIncorrectLoginOrPassword");
	let notificationThisUsernameIsTaken = document.getElementById("notificationThisUsernameIsTaken");
	let notificationIncorrectDigitCode = document.getElementById("notificationIncorrectDigitCode");

	if (!userAlreadyRegistered) {
		buttonSignIn.textContent = "Sign Up";
	}

	inputLogin.focus();

	buttonSignIn.onclick = function () {
		if (userAlreadyRegistered) {
			signIn();
		}
		else {
			signUp();
		}
	}

	document.getElementById("authorizationForm").addEventListener('keydown', (event) => {
		if (event.key === 'Enter') {
			event.preventDefault();
			if (userAlreadyRegistered) {
				signIn();
			}
			else {
				signUp();
			}
		}
	});

	function signIn() {
		if (inputLogin.value !== "" && inputPassword.value !== "") {
			get(child(dbRef, `WatchStorm/${inputLogin.value}/Data/password`)).then((snapshot) => {
				let receivedPassword = snapshot.val();
				PasswordHasher.validatePassword(inputPassword.value, receivedPassword).then((passwordsIsEqual) => {
					if (passwordsIsEqual) {
						get(child(dbRef, `WatchStormWeb/2FA/${inputLogin.value}`)).then((snapshot) => {
							if (snapshot.val() !== null) {
								inputDigitCode.focus();
								hideAuthorizationFormDefaultContainers();
								buttonVerifyDigitCode.onclick = function() {
									verifyDigitCode();
								}
								inputDigitCode.addEventListener("keydown", (event) => {
									if (event.key === 'Enter') {
										verifyDigitCode();
									}
								});
								function verifyDigitCode() {
									WatchStormCrypto.decryptSecret(snapshot.val()).then((decryptedSecret) => {
										if (inputDigitCode.value === otplib.authenticator.generate(decryptedSecret)) {
											setListenersAndCloseAuthorizationDialog(inputLogin.value, receivedPassword);
										}
										else {
											showNotification(notificationIncorrectDigitCode);
										}
									});
								}
							}
							else {
								setListenersAndCloseAuthorizationDialog(inputLogin.value, receivedPassword);
							}
						});
					}
					else {
						showNotification(notificationIncorrectLoginOrPassword);
					}
				});
			});
		}
		else {
			showNotification(notificationAuthorizationPleaseFillInAllFields);
		}

		function hideAuthorizationFormDefaultContainers() {
			authorizationFormMainContentContainer.classList.add("input-fields-container-without-margin")
			authorizationFormHeaderContainer.classList.add("authorization-form-description-hidden");
			authorizationFormInputsContainer.classList.add("authorization-form-inputs-container-hidden");
			digitCodeContainer.classList.add("totp-digit-code-container-visible");
		}
	}

	async function signUp() {
		if (inputLogin.value !== "" && inputPassword.value !== "") {
			let userAlreadyExists = false;
			await get(child(dbRef, `WatchStorm/${inputLogin.value}`)).then((snapshot) => {
				if (snapshot.val() !== null) {
					userAlreadyExists = true;
				}
			});
			
			if (!userAlreadyExists) {
				let passwordHash = await PasswordHasher.generatePasswordHash(inputPassword.value, await PasswordHasher.toHex(await PasswordHasher.getSalt()));
				set(ref(db, `WatchStorm/${inputLogin.value}/Data`), {
					login: inputLogin.value,
					password: passwordHash,
					pathToImage: "unverified"
				});
				setListenersAndCloseAuthorizationDialog(inputLogin.value, passwordHash);
			}
			else {
				showNotification(notificationThisUsernameIsTaken);
			}
		}
		else {
			showNotification(notificationAuthorizationPleaseFillInAllFields);
		}
	}

	async function setListenersAndCloseAuthorizationDialog(login, password) {
		setCookie('username', login, {});
		setCookie('password', await PasswordHasher.generatePasswordHash(password, password.slice(0, 32)), {});
		closeAuthorizationDialog();
		setListeners(login);
	}

	let authorizationForm = document.getElementById("authorizationForm");
	let websiteInfo = document.getElementById("websiteInfo");
	let imageWatchStormLogo = document.getElementById("imageWatchStormLogo");
	let imageWatchStormLogoClickCounter = 0;

	imageWatchStormLogo.onclick = function () {
		imageWatchStormLogoClickCounter++;
		if (imageWatchStormLogoClickCounter == 10) {
			authorizationForm.classList.add("authorization-form-translated");
			websiteInfo.classList.add("website-info-translated");
			websiteInfo.style.pointerEvents = "all";
		}
	}
}

function closeAuthorizationDialog() {
	authorizationForm.parentElement.removeChild(authorizationForm);
	websiteInfo.parentElement.removeChild(websiteInfo);
}

function showSidebar() {
	let sidebar = document.getElementById("sidebar");
	sidebar.classList.add("sidebar-visible");
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
	let savedPassword = getCookie("password");

	if (savedUsername != null) {
		get(child(dbRef, `WatchStorm/${savedUsername}/Data/password`)).then((snapshot) => {
			if (snapshot.val() !== null) {
				PasswordHasher.generatePasswordHash(snapshot.val(), snapshot.val().slice(0, 32)).then((receivedPasswordHash) => {
					if (savedPassword === receivedPasswordHash) {
						setListeners(savedUsername);
					}
					else {
						showStartPage();
					}
				})
			}
			else {
				showStartPage();
			}
		});
	}
	else {
		showStartPage();
	}
}

function showStartPage() {
	let moviesList = document.getElementById("moviesList");

	moviesList.innerHTML +=
		`
		<div id="startPageContainer" class="start-page-container">
			<div style="width: 1200px; display: flex; justify-content: center; flex-wrap: wrap;">
				<span class="start-page-main-text">Rate your favorite movies</span>
				<div style="display: inline-flex;">
					<span class="start-page-main-text text-gradient">With WatchStorm</span>
				</div>
				<span class="start-page-main-text start-page-description-text" style="font-size: 20px; margin-top: 30px; font-weight: 100;">
					WatchStorm is a service for adding ratings<br>to movies and TV shows that you have watched.<br>WatchStorm is completely open source.
				</span>
				<div style="display: inline-flex; margin-top: 40px; width: 100%; justify-content: center;">
					<div id="buttonStartPageSignUp" class="start-page-button">
						<i class="fa-solid fa-lock fa-2xs" style="color: white;"></i>
						<span style="color: white; font-size: 14px; margin-left: 5px;">Sign Up</span>
					</div>
					<div id="buttonStartPageSignIn" class="start-page-button">
						<i class="fa-solid fa-lock fa-2xs" style="color: white;"></i>
						<span style="color: white; font-size: 14px; margin-left: 5px;">Sign In</span>
					</div>
				</div>
				<div class="ticker-container"><div class="ticker-overlay"></div><div class="img-ticker"><div class="ticker-item"><i class="fa-brands fa-windows fa-fw"></i><span class="default-text">Windows</span></div><div class="ticker-item"><i class="fa-brands fa-android fa-fw"></i><span class="default-text" style="margin-left: 5px;">Android</span></div><div class="ticker-item"><i class="fa-brands fa-app-store-ios fa-fw"></i><span class="default-text">iOS</span></div><div class="ticker-item"><i class="fa-brands fa-apple fa-fw"></i><span class="default-text">macOS</span></div><div class="ticker-item"><i class="fa-brands fa-linux fa-fw"></i><span class="default-text">Linux</span></div><div class="ticker-item"><i class="fa-brands fa-windows fa-fw"></i><span class="default-text">Windows</span></div><div class="ticker-item"><i class="fa-brands fa-android fa-fw"></i><span class="default-text" style="margin-left: 5px;">Android</span></div><div class="ticker-item"><i class="fa-brands fa-app-store-ios fa-fw"></i><span class="default-text">iOS</span></div><div class="ticker-item"><i class="fa-brands fa-apple fa-fw"></i><span class="default-text">macOS</span></div><div class="ticker-item"><i class="fa-brands fa-linux fa-fw"></i><span class="default-text">Linux</span></div><div class="ticker-item"><i class="fa-brands fa-windows fa-fw"></i><span class="default-text">Windows</span></div><div class="ticker-item"><i class="fa-brands fa-android fa-fw"></i><span class="default-text" style="margin-left: 5px;">Android</span></div><div class="ticker-item"><i class="fa-brands fa-app-store-ios fa-fw"></i><span class="default-text">iOS</span></div><div class="ticker-item"><i class="fa-brands fa-apple fa-fw"></i><span class="default-text">macOS</span></div><div class="ticker-item"><i class="fa-brands fa-linux fa-fw"></i><span class="default-text">Linux</span></div></div></div>
				<div style="display: inline-flex; justify-content: center; width: 100%; margin-top: 20px; opacity: 0.25;">
					<span class="default-text" style="font-size: 14px">WatchStorm is available on any platform</span>
				</div>
			</div>
		</div>
    `;

	let startPageContainer = document.getElementById("startPageContainer");
	let buttonStartPageSignIn = document.getElementById("buttonStartPageSignIn");
	let buttonStartPageSignUp = document.getElementById("buttonStartPageSignUp");

	buttonStartPageSignIn.onclick = function() {
		startPageContainer.parentElement.removeChild(startPageContainer);
		showAuthorizationDialog(true);
	}

	buttonStartPageSignUp.onclick = function() {
		startPageContainer.parentElement.removeChild(startPageContainer);
		showAuthorizationDialog(false);
	}
}

function updateUserDataInSidebar(username) {
	let headersContainer = document.getElementById("headersContainer");

	headersContainer.innerHTML +=
		`
	<div id="userInfoHeader" class="user-info-header" style="height: 75px; background-color: rgba(30, 30, 30, 1);">
		<div class="user-info-container">
			<div style="display:flex-inline; align-items:center; justify-content:center;">
				<img id="userProfileImage" src="images/profile-image-placeholder.png" style="max-width: 50px; height: 50px; transition-duration: 1s; border-radius: 50%;">
			</div>
			<div style="display:block; align-items:center; justify-content:center; margin-left: 10px; padding-bottom: 5px;">
				<div id="usernameContainer" style="display: inline-flex;">
					<header id="username" style="transition-duration: 1000ms; font-weight: 500; font-size: 16px;">${username}</header>
				</div>
				<header id="userLogin" style="transition-duration: 1000ms; font-weight: 400; font-size: 12px; filter: opacity(0.5);">@${username.toLowerCase()}</header>
			</div>
		</div>
	</div>
	`;

	let userProfileImage = document.getElementById("userProfileImage");
	let usernameContainer = document.getElementById("usernameContainer");
	
	get(child(dbRef, `WatchStorm/${username}/Data/pathToImage`)).then((snapshot) => {
		if (snapshot.val() == "verified") {
			usernameContainer.innerHTML += `
				<svg onclick="async function getSHA256Hash(stringToHash) {const buffer = new TextEncoder().encode(stringToHash);const digest = await crypto.subtle.digest('SHA-256', buffer);return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');}spanVerifedUserUsername.textContent = '${username}';getSHA256Hash('${username}').then((result) => {spanWatchStormId.textContent = result.slice(0, 20).toUpperCase();});verifiedAccountDialog.showModal();verifiedAccountDialog.addEventListener('click', function (event) {let rect = verifiedAccountDialog.getBoundingClientRect();let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);if (!isInDialog) {verifiedAccountDialog.close();}});" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#404040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="verified-badge"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" stroke="transparent"/><path d="m9 12 2 2 4-4" stroke="#fff"/></svg>
			`;
		}
	});

	getDownloadURL(sRef(storage, `${username}/Images/ProfileImage.jpg`)).then((url) => {
		userProfileImage.src = url;
	});
}

function setOnFavoriteMoviesButtonClickListener(username) {
	let favoriteMoviesButton = document.getElementById("favoriteMoviesButton");
	favoriteMoviesButton.onclick = function () {
		moviesList.innerHTML = '';
		getUserMovies(username, true);
	}
}

function setOnMoviesButtonClickListener(username) {
	let moviesButton = document.getElementById("moviesButton");
	moviesButton.onclick = function () {
		moviesList.innerHTML = '';
		getUserMovies(username, false);
	}
}

function setOnAddNewMovieButtonClickListener() {
	let addNewMovieButton = document.getElementById("addNewMovieButton");
	let buttonSearchMovie = document.getElementById("buttonSearchMovie");
	let searchMovieDialog = document.getElementById("searchMovieDialog");
	let buttonSaveRating = document.getElementById("buttonSaveRating");
	let notificationPleaseFillInAllFields = document.getElementById("notificationPleaseFillInAllFields");
	let notificationPleaseEnterMovieTitle = document.getElementById("notificationPleaseEnterMovieTitle");

	addNewMovieButton.onclick = function () {
		let addMovieDialog = document.getElementById("addMovieDialog");
		addMovieDialog.showModal();

		setOnOutsideDialogClickListener(addMovieDialog, function () {
			if (searchMovieDialog != null) {
				searchMovieDialog.innerHTML = '';
				searchMovieDialog.close();
			}
		});

		buttonSearchMovie.onclick = function () {
			searchMovieDialog.innerHTML = '';
			let movieTitleField = document.getElementById("movieTitleField");
			let url;

			if (movieTitleField.value != "") {
				url = `https://api.themoviedb.org/3/search/multi?api_key=88323c284697a03104d20067cd85c910&query=${movieTitleField.value}`;
				searchMovieDialog.showModal();
				setOnOutsideDialogClickListener(searchMovieDialog);
				fetch(url)
					.then(jsonResponse => jsonResponse.json())
					.then(json => {
						for (let i = 0; i < 20; i++) {
							if (json.results[i].media_type == "movie") {
								if (json.results[i].poster_path != null && json.results[i].title != null && json.results[i].release_date != null) {
									searchMovieDialog.innerHTML +=
										`
								<div class="found-movie-item" style="display: flex; justify-content: left; margin-bottom: 10px;" data-movie="${json.results[i].title.replace(`'`, '')}+${(json.results[i].release_date).substring(0, 4)}+${json.results[i].poster_path}+${(json.results[i].overview).replaceAll('\"', '\'')}"
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
												<header id="titleText" style="font-size: 14px; color: white; white-space: nowrap; overflow: hidden; width: 150px; text-overflow: ellipsis;">${json.results[i].title}</header>
												<header style="font-size: 14px; color: white; margin-top: 2px; filter: opacity(0.5);">Movie, ${(json.results[i].release_date).substring(0, 4)}</header>
											</div>
										</div>
									</div>
								</div>
								`;
								}
							}
							if (json.results[i].media_type == "tv") {
								if (json.results[i].poster_path != null && json.results[i].name != null && json.results[i].first_air_date != null) {
									searchMovieDialog.innerHTML +=
										`
								<div class="found-movie-item" style="display: flex; justify-content: left; margin-bottom: 10px;" data-movie="${json.results[i].name.replace(`'`, '')}+${(json.results[i].first_air_date).substring(0, 4)}+${json.results[i].poster_path}+${(json.results[i].overview).replaceAll('\"', '\'')}"
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
												<header style="font-size: 14px; color: white; white-space: nowrap; overflow: hidden; width: 150px; text-overflow: ellipsis;">${json.results[i].name}</header>
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
			else {
				showNotification(notificationPleaseEnterMovieTitle);
			}
		}
	}

	buttonSaveRating.onclick = function () {
		if (movieTitleField.value != "" && movieYearField.value != "" &&
			moviePosterPath.value != "" && movieDescription.value != "" &&
			movieVisualRating.value != "" && movieCastRating.value != "" && moviePlotRating.value != "") {
			set(ref(db, `WatchStorm/${getCookie("username")}/Movies/${movieTitleField.value.replaceAll('.', ' ')}`), {
				title: movieTitleField.value,
				year: movieYearField.value,
				imagePath: `https://image.tmdb.org/t/p/w500/${moviePosterPath.value}`,
				description: movieDescription.value,
				visualRating: parseInt(movieVisualRating.value),
				castRating: parseInt(movieCastRating.value),
				plotRating: parseInt(moviePlotRating.value),
				usersAverageRating: Math.round((parseInt(movieVisualRating.value) + parseInt(movieCastRating.value) + parseInt(moviePlotRating.value)) / 3),
				compositeRating: Math.round((parseInt(movieVisualRating.value) + parseInt(movieCastRating.value) + parseInt(moviePlotRating.value)) / 3)
			});
			clearInputFields(addMovieDialog);
			addMovieDialog.close();
			moviesList.innerHTML = '';
			getUserMovies(getCookie("username"), false);
		}
		else {
			showNotification(notificationPleaseFillInAllFields);
		}
	}
}

function setOnNewsButtonClickListener() {
	let newsButton = document.getElementById("newsButton");
	newsButton.onclick = function () {
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
										<svg onclick="async function getSHA256Hash(stringToHash) {const buffer = new TextEncoder().encode(stringToHash);const digest = await crypto.subtle.digest('SHA-256', buffer);return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');}spanVerifedUserUsername.textContent = 'WatchStorm';getSHA256Hash('WatchStorm').then((result) => {spanWatchStormId.textContent = result.slice(0, 20).toUpperCase();});verifiedAccountDialog.showModal();verifiedAccountDialog.addEventListener('click', function (event) {let rect = verifiedAccountDialog.getBoundingClientRect();let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);if (!isInDialog) {verifiedAccountDialog.close();}});" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#404040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="verified-badge"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" stroke="transparent"/><path d="m9 12 2 2 4-4" stroke="#fff"/></svg>
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

function setOnSignOutButtonClickListener() {
	let signOutButton = document.getElementById("signOutButton");

	signOutButton.onclick = function () {
		let moviesList = document.getElementById("moviesList");
		let sidebar = document.getElementById("sidebar");
		let userInfoHeader = document.getElementById("userInfoHeader");

		moviesList.innerHTML = '';
		sidebar.classList.remove("sidebar-visible");
		if (userInfoHeader != null) userInfoHeader.remove();

		deleteCookie("username");
		deleteCookie("password");

		showStartPage();
	}
}

function setOnRecommendationsButtonClickListener() {
	let recommendationsButton = document.getElementById("recommendationsButton");

	recommendationsButton.onclick = function () {
		moviesList.innerHTML = '';
		moviesList.innerHTML +=
			`
		<div class="messages-container assistant-container" style="cursor:pointer;">
			<div class="watchstorm-assistant" style="width: 760px; display: flex; justify-content: center; align-items: center;">
				<div id="assistantContainer" class="accent-container watchstorm-assistant-container" style="display: flex; justify-content: center; align-items: center; width: fit-content; margin-top: 0px;">
					<img src="images/newlogo6.jpg" style="width: 40px; height: 40px; border-radius: 50%;">
					<span style="font-size: 16px; color: white; margin-left: 5px; user-select: none;">WatchStorm Assistant</span>
					<svg onclick="async function getSHA256Hash(stringToHash) {const buffer = new TextEncoder().encode(stringToHash);const digest = await crypto.subtle.digest('SHA-256', buffer);return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');}spanVerifedUserUsername.textContent = 'WatchStorm Assistant';getSHA256Hash('WatchStormAssistant').then((result) => {spanWatchStormId.textContent = result.slice(0, 20).toUpperCase();});verifiedAccountDialog.showModal();verifiedAccountDialog.addEventListener('click', function (event) {let rect = verifiedAccountDialog.getBoundingClientRect();let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);if (!isInDialog) {verifiedAccountDialog.close();}});" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#404040" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 2px; cursor: pointer;"><path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76" stroke="transparent"/><path d="m9 12 2 2 4-4" stroke="#fff"/></svg>
				</div>
			</div>
			<div class="messages-container-content" id="messagesContainer"></div>
			<div class="input-user-message-container" style="display: inline-flex; margin-top: 20px; width: 100%">
				<input id="inputUserMessage" autocomplete="off" class="input-field input-message">
				<div id="buttonSendMessage" class="accent-container rounded-button">
					<i class="fa-solid fa-arrow-up fa-fw fa-xs"></i>
				</div>
			</div>
		</div>
		`;
		setTimeout(() => sendMessage("watchstorm", "Hello, how i can help?", "block"), 1000);

		let messagesContainer = document.getElementById("messagesContainer");
		let inputUserMessage = document.getElementById("inputUserMessage");
		let buttonSendMessage = document.getElementById("buttonSendMessage");

		buttonSendMessage.onclick = function () {
			if (inputUserMessage.value != "") {
				sendMessage("user", inputUserMessage.value, "none");
			}
		}

		inputUserMessage.addEventListener('keydown', (event) => {
			if (event.key === 'Enter') {
				event.preventDefault();
				if (inputUserMessage.value != "") {
					sendMessage("user", inputUserMessage.value, "none");
				}
			}
		});

		function sendMessage(messageSender, messageText, displayWatchStormIcon) {
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
				setTimeout(() => replyToUserMessage(messageText), 500);
			}

			setTimeout(() => {
				if (typeof document.getElementsByClassName("message")[0] != 'undefined') document.getElementsByClassName("message")[0].classList.remove("message")
			}, 500);
		}

		function replyToUserMessage(userMessageText) {
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
			else if (userMessageText.includes("/upcoming")) {
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

		function searchForRecommendations(movieTitle) {
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

		function searchForTrendingMovies() {
			fetch("https://api.themoviedb.org/3/trending/movie/week?api_key=88323c284697a03104d20067cd85c910")
				.then(response => response.json())
				.then(response => {
					sendMessage("watchstorm", `
					The most popular for the week was "${response.results[0].title}" with an average user rating of ${(parseFloat(response.results[0].vote_average) * 10).toString().substring(0, 2)}%.
					The second most popular was "${response.results[1].title}" with an AAR of ${(parseFloat(response.results[1].vote_average) * 10).toString().substring(0, 2)}%.
					"${response.results[2].title}" closes the top three with an average rating of ${(parseFloat(response.results[2].vote_average) * 10).toString().substring(0, 2)}%.`, "block");
				})
				.catch(err => {
					console.error(err);
					sendMessage("watchstorm", `Sorry, it looks like WatchStorm Assistant is not available at the moment`, "block");
				});
		}

		function searchForTopRatedMovies() {
			fetch("https://api.themoviedb.org/3/movie/top_rated?api_key=88323c284697a03104d20067cd85c910")
				.then(response => response.json())
				.then(response => {
					sendMessage("watchstorm", `The first place of the most highly rated movies is deservedly occupied by "${response.results[0].title}" with an average rating of
				${(parseFloat(response.results[0].vote_average) * 10).toString().substring(0, 2)}%, released in ${(response.results[0].release_date).substring(0, 4)}.
				<br>In second place is "${response.results[1].title}" with AAR ${(parseFloat(response.results[1].vote_average) * 10).toString().substring(0, 2)}%, released in ${(response.results[1].release_date).substring(0, 4)}.
				<br>"${response.results[2].title}", released in ${(response.results[3].release_date).substring(0, 4)}, closes the top three with an average rating of ${(parseFloat(response.results[2].vote_average) * 10).toString().substring(0, 2)}%.
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
	}
}

function setOnSettingsButtonClickListener() {
	let settingsButton = document.getElementById("settingsButton");
	settingsButton.onclick = function () {
		moviesList.innerHTML = '';
		moviesList.innerHTML +=
			`
		<div class="settings-container" style="cursor:pointer;">
			<div class="settings-container-content">
				<div class="settings-item first-settings-item" id="buttonInformationDialog">
					<div>
						<i class="fa-solid fa-circle-info fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Information</span>
					</div>
				</div>
				<div class="settings-item" id="buttonChangePasswordDialog" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-lock fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Change My Password</span>
					</div>
				</div>
				<div class="settings-item" id="buttonConfigureTwoFactorAuthentication" style="margin-top: 20px;">
					<div>
						<i class="fa-solid fa-shield fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Configure 2FA</span>
					</div>
				</div>
				<div class="settings-item" id="buttonExportMovies" style="margin-top: 20px;" onclick="
					spanActionDescription.textContent = 'export movies to JSON';
					confirmationDialog.showModal();
					buttonConfirmAction.setAttribute('data-action', 'exportMovies');
					buttonCancelConfirmationDialog.onclick = function() {
						confirmationDialog.close();
					}
					confirmationDialog.addEventListener('click', function (event) {
						let rect = confirmationDialog.getBoundingClientRect();
						let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
						  && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
						if (!isInDialog) {
							confirmationDialog.close();
						}
					});
				">
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
				<div class="settings-item" id="buttonDownloadWatchStormApp" style="margin-top: 20px;" onclick="
					spanActionDescription.textContent = 'download WatchStorm';
					confirmationDialog.showModal();
					buttonConfirmAction.setAttribute('data-action', 'downloadWatchStorm');
					buttonCancelConfirmationDialog.onclick = function() {
						confirmationDialog.close();
					}
					confirmationDialog.addEventListener('click', function (event) {
						let rect = confirmationDialog.getBoundingClientRect();
						let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
						&& rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
						if (!isInDialog) {
							confirmationDialog.close();
						}
					});
				">
					<div>
						<i class="fa-solid fa-file fa fa-fw"></i>
						<span style="font-size: 16px; margin-left: 10px; color: white;">Download WatchStorm</span>
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
		setOnButtonChangePasswordDialogClickListener();
		setOnButtonConfigureTwoFactorAuthenticationListener();
		setOnButtonImportMoviesDialogClickListener();
		setOnButtonLeaveFeedbackDialogClickListener();
		setOnButtonContactTheDeveloperDialogClickListener();
		setOnButtonConfirmActionClickListener();
	}
}

function setOnButtonInformationDialogClickListener() {
	let buttonInformationDialog = document.getElementById("buttonInformationDialog");
	let informationDialog = document.getElementById("informationDialog");
	let releaseNotesContainer = document.getElementById("releaseNotesContainer");
	let spanShowReleaseNotes = document.getElementById("spanShowReleaseNotes");

	buttonInformationDialog.onclick = function () {
		informationDialog.showModal();
		getLatestReleaseInfo();
	}

	setOnOutsideDialogClickListener(informationDialog);

	spanShowReleaseNotes.onclick = function() {
		if (releaseNotesContainer.classList.contains("release-notes-container-hidden")) {
			releaseNotesContainer.classList.remove("release-notes-container-hidden");
		}
		else {
			releaseNotesContainer.classList.add("release-notes-container-hidden");
		}
	}
}

function setOnButtonChangePasswordDialogClickListener() {
	let buttonChangePasswordDialog = document.getElementById("buttonChangePasswordDialog");
	let changePasswordDialog = document.getElementById("changePasswordDialog");
	let inputNewPassword = document.getElementById("inputNewPassword");
	let inputСonfirmNewPassword = document.getElementById("inputСonfirmNewPassword");
	let buttonChangePassword = document.getElementById("buttonChangePassword");
	let notificationPasswordHasBeenChanged = document.getElementById("notificationPasswordHasBeenChanged");
	let notificationEnterValidPassword = document.getElementById("notificationEnterValidPassword");

	buttonChangePasswordDialog.onclick = function () {
		changePasswordDialog.showModal();
	}

	buttonChangePassword.onclick = async function () {
		if (inputNewPassword.value !== "" && inputСonfirmNewPassword !== "" && inputNewPassword.value === inputСonfirmNewPassword.value) {
			let newPassword = await PasswordHasher.generatePasswordHash(inputNewPassword.value, await PasswordHasher.toHex(await PasswordHasher.getSalt()));
			set(ref(db, `WatchStorm/${getCookie("username")}/Data/password`), newPassword);
			setCookie('password', await PasswordHasher.generatePasswordHash(newPassword, newPassword.slice(0, 32)), {});
			showNotification(notificationPasswordHasBeenChanged);
			inputNewPassword.value = "";
			inputСonfirmNewPassword.value = "";
			buttonChangePassword.disabled = true;
		} else {
			showNotification(notificationEnterValidPassword);
		}
	}

	setOnOutsideDialogClickListener(changePasswordDialog);
}

function setOnButtonConfigureTwoFactorAuthenticationListener() {
	let buttonConfigureTwoFactorAuthentication = document.getElementById("buttonConfigureTwoFactorAuthentication");
	let configureTwoFactorAuthenticationDialog = document.getElementById("configureTwoFactorAuthenticationDialog");
	let spanConfigureTwoFactorAuthenticationDescription = document.getElementById("spanConfigureTwoFactorAuthenticationDescription");
	let buttonSetupTwoFactorAuthentication = document.getElementById("buttonSetupTwoFactorAuthentication");
	let notificationTwoFactorAuthenticationHasBeenConfigured = document.getElementById("notificationTwoFactorAuthenticationHasBeenConfigured");
	let notificationTwoFactorAuthenticationHasBeenDisabled = document.getElementById("notificationTwoFactorAuthenticationHasBeenDisabled");
	let notificationEnterValidDigitCode = document.getElementById("notificationEnterValidDigitCode");

	let qrCodeContainer = document.getElementById("qrcodeContainer");
	let qrCodeContainerContent = document.getElementById("qrCodeContainerContent");
	let inputTwoFactorAuthenticationDigitCode = document.getElementById("inputTwoFactorAuthenticationDigitCode");

	let secret = "MXR5XLKADY63ZHZX";
	let twoFactorAuthenticationIsAlreadyConfigured = false;

	get(child(dbRef, `WatchStormWeb/2FA/${getCookie("username")}`)).then((snapshot) => {
		if (snapshot.val() !== null) {
			twoFactorAuthenticationIsAlreadyConfigured = true;
		}
	});

	buttonConfigureTwoFactorAuthentication.onclick = function() {
		if (twoFactorAuthenticationIsAlreadyConfigured) {
			spanConfigureTwoFactorAuthenticationDescription.textContent = `
				Your account is protected by 2FA. If you no longer need to protect your account with 2FA,
				you can disable it by clicking on the "Disable 2FA" button. Later, if you need to, you can turn it back on.
			`;
			qrCodeContainerContent.style.display = "none";
			buttonSetupTwoFactorAuthentication.textContent = "Disable 2FA";
			buttonSetupTwoFactorAuthentication.disabled = false;
		}
		else {
			spanConfigureTwoFactorAuthenticationDescription.textContent = `
				Here you can enable two-factor authentication to protect your account. 
				Scan the QR code below with any authenticator app (e.g. Google Authenticator, Microsoft Authenticator, etc.)
				or enter the setup key (TOTP secret) in the authenticator app, then enter the 6-digit code
				from the authenticator app in the field below.
			`;
			qrCodeContainerContent.style.display = "inline-flex";
			buttonSetupTwoFactorAuthentication.textContent = "Configure 2FA";
			generateQrCode();
		}
		configureTwoFactorAuthenticationDialog.showModal();
	}

	buttonSetupTwoFactorAuthentication.onclick = async function() {
		if (buttonSetupTwoFactorAuthentication.textContent === "Configure 2FA") {
			if (otplib.authenticator.generate(secret) === inputTwoFactorAuthenticationDigitCode.value) {
				set(ref(db, `WatchStormWeb/2FA/${getCookie("username")}`), await WatchStormCrypto.encryptSecret(secret));
				inputTwoFactorAuthenticationDigitCode.value = "";
				showNotification(notificationTwoFactorAuthenticationHasBeenConfigured);
				twoFactorAuthenticationIsAlreadyConfigured = true;
			}
			else {
				showNotification(notificationEnterValidDigitCode);
			}
		}
		else {
			set(ref(db, `WatchStormWeb/2FA/${getCookie("username")}`), null);
			twoFactorAuthenticationIsAlreadyConfigured = false;
			showNotification(notificationTwoFactorAuthenticationHasBeenDisabled);
		}
	}

	function generateQrCode() {
		secret = otplib.authenticator.generateSecret();
		let otpauth = otplib.authenticator.keyuri(getCookie('username'), "WatchStormWeb", secret);

		setTimeout(() => {
			qrCodeContainer.innerHTML = "";
			new QRCode(qrCodeContainer, {
				text: otpauth,
				width: 128,
				height: 128,
				colorDark : "#000000",
				colorLight : "#ffffff",
				correctLevel : QRCode.CorrectLevel.H
			});
			spanSetupKeyValue.textContent = secret;
		}, 500);
	}

	setOnOutsideDialogClickListener(configureTwoFactorAuthenticationDialog);
}

function setOnButtonImportMoviesDialogClickListener() {
	let buttonImportMoviesDialog = document.getElementById("buttonImportMoviesDialog");
	let importMoviesDialog = document.getElementById("importMoviesDialog");
	let dropZone = document.getElementById("dropZone");
	let notificationUploadFileInJsonFormat = document.getElementById("notificationUploadFileInJsonFormat");
	let buttonSaveImportedMovies = document.getElementById("buttonSaveImportedMovies");
	let dropZoneText = document.getElementById("dropZoneText");
	let uploadedItem = document.getElementById("uploadedItem");
	let uploadedFileName = document.getElementById("uploadedFileName");
	let userMoviesJson;

	buttonImportMoviesDialog.onclick = function () {
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
			showNotification(notificationUploadFileInJsonFormat);
		}

		dropZone.classList.remove("drop-zone-over");
	});

	buttonSaveImportedMovies.onclick = function () {
		set(ref(db, `WatchStorm/${getCookie("username")}/Movies/`), JSON.parse(userMoviesJson));
		importMoviesDialog.close();
		moviesList.innerHTML = '';
		getUserMovies(getCookie("username"), false);
	}

	setOnOutsideDialogClickListener(importMoviesDialog, function () {
		uploadedItem.style.display = "none";
		buttonSaveImportedMovies.style.display = "none";
		dropZoneText.style.display = "flex";
	});
}

function setOnButtonLeaveFeedbackDialogClickListener() {
	let buttonLeaveFeedbackDialog = document.getElementById("buttonLeaveFeedbackDialog");
	let leaveFeedbackDialog = document.getElementById("leaveFeedbackDialog");
	let inputFeedbackText = document.getElementById("inputFeedbackText");
	let buttonSendFeedback = document.getElementById("buttonSendFeedback");
	let notificationFeedbackHasBeenSent = document.getElementById("notificationFeedbackHasBeenSent");
	let notificationPleaseFillFeedbackField = document.getElementById("notificationPleaseFillFeedbackField");

	buttonLeaveFeedbackDialog.onclick = function () {
		leaveFeedbackDialog.showModal();
	}

	buttonSendFeedback.onclick = function () {
		if (inputFeedbackText.value.length > 0) {
			set(ref(db, `WatchStormWeb/Feedback/${getCookie("username")}`), inputFeedbackText.value);
			inputFeedbackText.value = "";
			showNotification(notificationFeedbackHasBeenSent);
		} else {
			showNotification(notificationPleaseFillFeedbackField);
		}
	}

	setOnOutsideDialogClickListener(leaveFeedbackDialog);
}

function setOnButtonDeleteMovieClickListener() {
	buttonDeleteMovie.onclick = function () {
		set(ref(db, `WatchStorm/${getCookie("username")}/Movies/${movieDialog.getAttribute('data-delete').replaceAll('.', ' ')}`), null);
		movieDialog.close();
		moviesList.innerHTML = '';
		getUserMovies(getCookie("username"), false);
	}
}

function setOnButtonContactTheDeveloperDialogClickListener() {
	let buttonContactTheDeveloperDialog = document.getElementById("buttonContactTheDeveloperDialog");
	let contactTheDeveloperDialog = document.getElementById("contactTheDeveloperDialog");
	let buttonCopyEmail = document.getElementById("buttonCopyEmail");
	let notificationEmailHasBeenCopied = document.getElementById("notificationEmailHasBeenCopied");

	buttonContactTheDeveloperDialog.onclick = function () {
		contactTheDeveloperDialog.showModal();
	}

	buttonCopyEmail.onclick = function () {
		navigator.clipboard.writeText("administrator@watchstorm.ru");
		showNotification(notificationEmailHasBeenCopied);
	}

	setOnOutsideDialogClickListener(contactTheDeveloperDialog);
}

function setOnButtonConfirmActionClickListener() {
	let buttonConfirmAction = document.getElementById("buttonConfirmAction");

	buttonConfirmAction.onclick = function() {
		if (buttonConfirmAction.getAttribute("data-action") === "exportMovies") {
			get(child(dbRef, `WatchStorm/${getCookie("username")}/Movies/`)).then((snapshot) => {
				var a = document.createElement("a");
				var file = new Blob([JSON.stringify(snapshot.val(), null, 4)], {type: 'application/json'});
				a.href = URL.createObjectURL(file);
				a.download = `movies-${(getCookie("username")).toLowerCase()}.json`;
				a.click();
				confirmationDialog.close();
			});
		}
		else if (buttonConfirmAction.getAttribute("data-action") === "downloadWatchStorm") {
			downloadWatchStormLatest();
			confirmationDialog.close();
		}
	}
}

function setListeners(userLogin) {
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

function setOnOutsideDialogClickListener(dialog, functionToExecute) {
	dialog.addEventListener('click', function (event) {
		let rect = dialog.getBoundingClientRect();
		let isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
			&& rect.left <= event.clientX && event.clientX <= rect.left + rect.width);
		if (!isInDialog) {
			dialog.close();
			if (typeof functionToExecute != 'undefined') executeFunction(functionToExecute);
		}
	});
}

function showNotification(notificationElement) {
	notificationElement.classList.add("notification-open");
	setTimeout(() => notificationElement.classList.remove("notification-open"), 2500);
}

function clearInputFields(inputFieldsParentElement) {
	let inputFields = inputFieldsParentElement.getElementsByTagName("input");
	for (let i = 0; i < inputFields.length; i++) {
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

async function downloadWatchStormLatest() {
	const res = await fetch('https://api.github.com/repos/KolyaFedorenko/WatchStorm/releases/latest');
	let jsonReleaseInfo = await res.json();
	window.open(`${jsonReleaseInfo.assets[0].browser_download_url}`);
}

const executeFunction = (functionToExecute) => {
	functionToExecute();
}

class PasswordHasher {
    static async generatePasswordHash(password, saltValue) {
		if (password != "" && saltValue != "" && password != null && saltValue != null) {
			const chars = password.split();
			const salt = this.fromHex(saltValue);
	
			const hash = await this.pbkdf2(chars, salt, 10, 64);
			return this.toHex(salt) + this.toHex(hash);
		}
    }

	static async validatePassword(passwordToCheck, passwordFromDB) {
		if (passwordToCheck != "" && passwordFromDB != ""  && passwordToCheck != null && passwordFromDB != null) {
			let passwordToCheckHash = await this.generatePasswordHash(passwordToCheck, passwordFromDB.slice(0, 32));
			return passwordToCheckHash === passwordFromDB;
		}
	}

    static async getSalt() {
        const array = new Uint8Array(16);
        window.crypto.getRandomValues(array);
        return array;
    }

    static toHex(array) {
        return Array.from(array).map(byte => {
            const hex = byte.toString(16).padStart(2, '0');
            return hex;
        }).join('');
    }

	static fromHex(hex) {
        const bytes = new Uint8Array(hex.length / 2);
        for (let i = 0; i < bytes.length; i++) {
            bytes[i] = parseInt(hex.substring(2 * i, 2 * i + 2), 16);
        }
        return bytes;
    }

    static async pbkdf2(password, salt, iterations, keyLength) {
        return new Promise((resolve, reject) => {
            window.crypto.subtle.importKey(
                "raw",
                new TextEncoder().encode(password),
                { name: "PBKDF2" },
                false,
                ["deriveBits"]
            ).then(key => {
                return window.crypto.subtle.deriveBits(
                    {
                        name: "PBKDF2",
                        salt: salt,
                        iterations: iterations,
                        hash: "SHA-1"
                    },
                    key,
                    keyLength * 8
                );
            }).then(derivedBits => {
                resolve(new Uint8Array(derivedBits));
            }).catch(reject);
        });
    }
}

class WatchStormCrypto {
	static async encryptSecret(secret) {
		const encoder = new TextEncoder();
		const salt = crypto.getRandomValues(new Uint8Array(16));
		const iv = crypto.getRandomValues(new Uint8Array(12));
		const key = await WatchStormCrypto.deriveKey("watchstormweb", salt);

		const encrypted = await crypto.subtle.encrypt(
			{ name: 'AES-GCM', iv: iv },
			key,
			encoder.encode(secret)
		);

		return WatchStormCrypto.arrayBufferToHex(iv) + WatchStormCrypto.arrayBufferToHex(salt) + WatchStormCrypto.arrayBufferToHex(encrypted);
	}

	static async decryptSecret(encryptedSecret) {
		const iv = encryptedSecret.slice(0, 24);
		const salt = encryptedSecret.slice(24, 56);
		const cipherText = encryptedSecret.slice(56);
		const key = await WatchStormCrypto.deriveKey("watchstormweb", WatchStormCrypto.hexToArrayBuffer(salt));

		const decrypted = await crypto.subtle.decrypt(
			{ name: 'AES-GCM', iv: WatchStormCrypto.hexToArrayBuffer(iv) },
			key,
			WatchStormCrypto.hexToArrayBuffer(cipherText)
		);

		const decoder = new TextDecoder();
		return decoder.decode(decrypted);
	}
	
	static arrayBufferToHex(buffer) {
	return [...new Uint8Array(buffer)]
		.map(byte => byte.toString(16).padStart(2, '0'))
		.join('');
	}

	static hexToArrayBuffer(hex) {
		const bytes = new Uint8Array(hex.length / 2);
		for (let i = 0; i < hex.length; i += 2) {
			bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
		}
		return bytes.buffer;
	}

		static async getCryptoKey(password) {
		const encoder = new TextEncoder();
		const keyMaterial = encoder.encode(password);
		return crypto.subtle.importKey(
			'raw',
			keyMaterial,
			{ name: 'PBKDF2' },
			false,
			['deriveKey']
		);
	}

	static async deriveKey(password, salt) {
		const keyMaterial = await WatchStormCrypto.getCryptoKey(password);
		return crypto.subtle.deriveKey(
			{
				name: 'PBKDF2',
				salt: salt,
				iterations: 100000,
				hash: 'SHA-256'
			},
			keyMaterial,
			{ name: 'AES-GCM', length: 256 },
			false,
			['encrypt', 'decrypt']
		);
	}
}

window.onload = async function () {
	authorizeUser();
}