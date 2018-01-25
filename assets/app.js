// Initialize Firebase
var config = {
    apiKey: "AIzaSyCv396BwTp_pKEasMT6JNHoMcGhUiqtRiw",
    authDomain: "chopflix-65749.firebaseapp.com",
    databaseURL: "https://chopflix-65749.firebaseio.com",
    projectId: "chopflix-65749",
    storageBucket: "chopflix-65749.appspot.com",
    messagingSenderId: "583066994313",
    signInSuccessUrl: '<url-to-redirect-to-on-success>',
};

firebase.initializeApp(config);

$(document).ready(function() {
    var database = firebase.database();
    var tmdb = "b300de2804d6ecbfa5435065a4835711";
    var height = window.screen.height;
    var uid;

    // adjusting mobile navbar menu so it closes
    $(document).on("click", ".navbar-toggle", function() {
        $("#bs-example-navbar-collapse-1").toggle();
    });

    // FirebaseUI config.
    var uiConfig = {
        callbacks: {
            signInSuccess: function(currentUser, credential, redirectUrl) {
                window.location.href = "#page-top";
                $("#sign-in-section").hide();
                $("#user-auth-here").html(`<a id="sign-out" class="yellow">SIGN OUT</a>`);
                return false;
            }
        },
        signInSuccessUrl: "index.html",
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
            firebaseui.auth.CredentialHelper.NONE
        ],
    };

    // Initialize the FirebaseUI Widget using Firebase.
    var ui = new firebaseui.auth.AuthUI(firebase.auth());

    // The start method will wait until the DOM is loaded.
    ui.start('#firebaseui-auth-container', uiConfig);


    // USER AUTH FOR FIREBASE
    // function to store user data object
    function writeUserData(uid, name, email, emailVerified) {
        firebase.database().ref('users/' + uid).update({
            username: name,
            email: email,
            verified_email : emailVerified,
        });
      }

    // detecting user and writing data to firebase
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) { // User is signed in.
            window.user = user;
            uid = user.uid; 
            var name = user.displayName;
            var email = user.email;
            var emailVerified = user.emailVerified;
            var providerData = user.providerData;
            writeUserData(uid, name, email, emailVerified);
        } // User is signed out.
    });

    // switch to sign-out button
    $("#user-auth-here").on("click", "#sign-in", function(event) {
        $("#sign-in-section").show();
    });

    // sign out
    $("#user-auth-here").on("click", "#sign-out", function(event) {
        event.preventDefault();
        event.stopPropagation();
        firebase.auth().signOut();
        $("#user-auth-here").html(`
            <a id="sign-in" class="yellow">SIGN IN</a>
        `);
    });


    // genres for movies
    $("#movie").on("click", function() {
        var queryURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdb}&language=en-US`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            $("#genres").html("");
            var glyph = $(`<span class="glyphicon glyphicon-film" aria-hidden="true"></span>`);
            var genre = response.genres;
            var sec = 0;
            for (let k = 0; k < genre.length; k++) {
                var button = $(`<button class="movie-genre">`);
                button.attr("id", genre[k].id).attr("name", genre[k].name);
                button.addClass("btn btn-primary");
                button.html(genre[k].name);
                button.addClass(`button2${k}`);
                $("#genres").append(button);
                var o = $(`.button2${k}`);
                var tl10 = new TimelineLite();
                tl10.from(o, 1.5, { x: -15, autoAlpha: 0, ease: Power1.ease, delay: sec });
                tl10.play();
                tl10.restart();
                sec = sec + 0.05;
            };
        });
    });

    // genres for tv
    $("#tv").on("click", function() {
        var queryURL = `https://api.themoviedb.org/3/genre/tv/list?api_key=${tmdb}&language=en-US`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            $("#genres").html("");
            var genre = response.genres;
            var sec = 0;
            for (let l = 0; l < genre.length; l++) {
                var glyph = $(`<span class="glyphicon glyphicon-blackboard" aria-hidden="true">`);
                var button = $(`<button class="tv-genre">`);
                button.attr("id", genre[l].id).attr("name", genre[l].name);
                button.addClass("btn btn-primary");
                button.addClass(`button${l}`);
                button.html(genre[l].name);
                $("#genres").append(button);

                var b = $(`.button${l}`);
                var tl9 = new TimelineLite();
                tl9.from(b, 1.5, { x: -15, autoAlpha: 0, ease: Power1.ease, delay: sec });
                tl9.play();
                tl9.restart();
                sec = sec + 0.05;
            };
        });
    });

    // discover movies
    $(".genre-buttons").on("click", ".movie-genre", function(event) {
        var discover = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdb}&language=en-US&sort_by=popularity.desc&certification.lte=pg-13&include_adult=false&include_video=false&page=1&with_genres=${this.id}`
        var showArray = [];

        $(".vidImages").empty();
        $("#movie-modals").empty();

        $.ajax({
            url: discover,
            method: "GET"
        }).done(function(response) {
            var searchResults = response.results;
            for (var m = 0; m < searchResults.length; m++) {
                var movieTitle = searchResults[m].title;
                var overview = searchResults[m].overview;
                var poster = searchResults[m].backdrop_path;
                var movieID = searchResults[m].id;

                var movieThumb = `
                        <div class="col-md-4 col-sm-6 portfolio-item">
                            <a href="#moviePortfolioModal${m}" class="portfolio-link" data-toggle="modal">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content">
                                        <i class="fa fa-plus fa-3x"></i>
                                    </div>
                                </div>
                                <img src="https://image.tmdb.org/t/p/w500${poster}" onerror="this.src='assets/images/default.jpg'" class="img-responsive" alt="${movieTitle}">
                            </a>
                            <div class="portfolio-caption">
                                <h4 class="thumbTitle">${movieTitle}</h4>
                            </div>
                        </div>`;

                var movieModal = `
                        <div class="portfolio-modal videoModal modal fade" id="moviePortfolioModal${m}" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="close-modal" data-dismiss="modal">
                                        <div class="lr">
                                            <div class="rl">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-8 col-lg-offset-2">
                                                <div class="modal-body">
                                                    <h2 class="modal-title">${movieTitle}&nbsp;<span id="heart" db-id="${movieID}" favorite="false" title="${movieTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                                    <p class="item-intro text-muted">${overview}</p>
                                                    <div id="youTube-${m}" class="youtubeVid"></div>
                                                    <div id="otherPicks"></div>
                                                    <a href="https://www.themoviedb.org/movie/${movieID}" target="_blank" type="button" class="btn btn-primary" ><i class="fa fa-film"></i>See More Details</a>
                                                    <a href="https://www.netflix.com/search?q=${movieTitle}" target="_blank" type="button" class="btn btn-primary middleBtn"><i class="fa fa-search"></i>Find on Netflix</a>
                                                    <a id="show-select" data-title="${movieTitle}" data-plot="${overview}" data-poster="${poster}" data-dismiss="modal" type="button" class="btn btn-primary"><i class="fa fa-check-square"></i>Select This Movie</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                $(".vidImages").append(movieThumb);
                $("#movie-modals").append(movieModal);
                JSON.stringify(movieTitle);
                showArray.push(movieTitle);
            };

            for (let s = 0; s < showArray.length; s++) {
                $.ajax({
                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${showArray[s]}+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g`,
                    method: "GET"
                }).done(function(response) {
                    var youTubeVidId = response.items[0].id.videoId;
                    var vidURL = `src="https://www.youtube.com/embed/${youTubeVidId}"`;
                    var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
                    $(`#youTube-${s}`).html(youTubeVid);
                });
            };

        });

    });



    // discover tv
    $(".genre-buttons").on("click", ".tv-genre", function(event) {
        var discover = `https://api.themoviedb.org/3/discover/tv?api_key=${tmdb}&language=en-US&sort_by=popularity.desc&certification.lte=pg-13&include_adult=false&include_video=false&page=1&with_genres=${this.id}`
        var showArray = [];

        $(".vidImages").empty();
        $("#movie-modals").empty();

        $.ajax({
            url: discover,
            method: "GET"
        }).done(function(response) {
            var searchResults = response.results;
            for (var n = 0; n < searchResults.length; n++) {
                var tvTitle = searchResults[n].name;
                var overview = searchResults[n].overview;
                var poster = searchResults[n].backdrop_path;
                var tvID = searchResults[n].id;

                var tvThumb = `
                        <div class="col-md-4 col-sm-6 portfolio-item">
                            <a href="#tvPortfolioModal${n}" class="portfolio-link" data-toggle="modal">
                                <div class="portfolio-hover">
                                    <div class="portfolio-hover-content">
                                        <i class="fa fa-plus fa-3x"></i>
                                    </div>
                                </div>
                                <img src="https://image.tmdb.org/t/p/w500${poster}" onerror="this.src='assets/images/default.jpg'" class="img-responsive" alt="${tvTitle}">
                            </a>
                            <div class="portfolio-caption">
                                <h4 class="thumbTitle">${tvTitle}</h4>
                            </div>
                        </div>`;

                var tvModal = `
                        <div class="portfolio-modal videoModal modal fade" id="tvPortfolioModal${n}" tabindex="-1" role="dialog" aria-hidden="true">
                            <div class="modal-dialog">
                                <div class="modal-content">
                                    <div class="close-modal" data-dismiss="modal">
                                        <div class="lr">
                                            <div class="rl">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="container">
                                        <div class="row">
                                            <div class="col-lg-8 col-lg-offset-2">
                                                <div class="modal-body">
                                                    <h2 class="modal-title">${tvTitle}&nbsp;<span id="heart" db-id="${tvID}" favorite="false" title="${tvTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                                    <p class="item-intro text-muted">${overview}</p>
                                                    <div id="youTube-${n}" class="youtubeVid"></div>
                                                    <div id="otherPicks-${n}"></div>
                                                    <a href="https://www.themoviedb.org/tv/${tvID}" target="_blank" type="button" class="btn btn-primary" ><i class="fa fa-film"></i>See More Details</a>
                                                    <a href="https://www.netflix.com/search?q=${tvTitle}" target="_blank" type="button" class="btn btn-primary middleBtn"><i class="fa fa-search"></i>Find on Netflix</a>
                                                    <a id="show-select" data-title="${tvTitle}" data-plot="${overview}" data-poster="${poster}" data-dismiss="modal" type="button" class="btn btn-primary"><i class="fa fa-check-square"></i>Select This TV Show</a> 
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>`;

                $(".vidImages").append(tvThumb);
                $("#movie-modals").append(tvModal);
                JSON.stringify(tvTitle);
                showArray.push(tvTitle);
            };

            for (let t = 0; t < showArray.length; t++) {
                $.ajax({
                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${showArray[t]}+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g`,
                    method: "GET"
                }).done(function(response) {
                    var youTubeVidId = response.items[0].id.videoId;
                    var vidURL = `src="https://www.youtube.com/embed/${youTubeVidId}"`;
                    var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
                    $(`#youTube-${t}`).html(youTubeVid);
                });
            };

        });

    });

    // stopping video playback on modal close
    $("#movie-modals").on('hide.bs.modal', '.videoModal', function(e) {
        var id = e.target.id;
        var $if = $(`#${id}`).find('iframe');
        var src = $if.attr("src");
        $if.attr("src", '/empty.html');
        $if.attr("src", src);
    });

    // favoriting movies/shows (updating data on firebase)
    $("#movie-modals").on("click", "#heart", function(event) {
        var faveTitle = $(this).attr("title");
        var saved = $(this).attr("favorite");
        var id = $(this).attr("db-id");
        if (saved === "true") {
            database.ref("users/" + uid + "/tmdb_faves/" + id).remove();
        } else {
            database.ref("users/" + uid + "/tmdb_faves/").update({
                [id]: faveTitle
            });
        }
        $(this).attr("class", ($(this).attr("class") == "glyphicon glyphicon-heart glyphicon-heart-empty" ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart glyphicon-heart-empty"));
        $(this).attr("favorite", ($(this).attr("favorite") == "false" ? true : false));
    });

    // favoriting recipes (updating data on firebase)
    $("#recipe-modals").on("click", "#heart", function(event) {
        var faveTitle = $(this).attr("title");
        var saved = $(this).attr("favorite");
        var id = $(this).attr("db-id");
        if (saved === "true") {
            database.ref("users/" + uid + "/yummly_faves/" + id).remove();
        } else {
            database.ref("users/" + uid + "/yummly_faves/").update({
                [id]: faveTitle
            });
        }
        $(this).attr("class", ($(this).attr("class") == "glyphicon glyphicon-heart glyphicon-heart-empty" ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart glyphicon-heart-empty"));
        $(this).attr("favorite", ($(this).attr("favorite") == "false" ? true : false));
    });

    //yummly search
    var addedCuisines = [];
    var cuisineSearch;
    var state;
    var go = $(".go");
    //button animation
    var tl = new TimelineLite();
    tl.to(go, 0.7, { rotationX: -360, transformOrigin: '0% 50%', ease: Power2.easeInOut })
    tl.pause();

    $('#foodForm').on('submit', function(event) {
        event.preventDefault();
        $("#recipe_results").empty();
        $("#tryAgainButton").empty();
        window.location.href = '#recipe-results-section';
        tl.play();
        tl.restart();
        cuisineSearch = addedCuisines.join('');
        var food = $("#food").val().trim();
        resetRecipe();
        var yumQuery = "https://api.yummly.com/v1/api/recipes?_app_id=74c2c130&_app_key=dbe2b1012a02ca615dbe289501e4ef92&q=" + food + cuisineSearch + "&requirePictures=true";
        resetButtons();
        $("#your-results").hide();
        $.ajax({
            url: yumQuery,
            method: "GET"
        }).done(function(response) {
            result = response.matches;
            if (result.length === 0) {
                $("#recipe_results").html("Your search did not match any recipes");
                $("#tryAgainButton").html("<a href='#recipe-search-section' class='page-scroll btn btn-xl startBtn'>Search again</a>");
            } else {
                $("#recipe_results").html("Choose from these tasty offerings:");
                for (var z = 0; z < result.length; z++) {
                    var id = (result[z].id)
                    var recipeTitle = (result[z].recipeName);
                    var imgUrl = result[z].imageUrlsBySize["90"].replace("s90-c", "s200-c");
                    var ingredients = (result[z].ingredients);
                    var IngAsString = ingredients.join(', ');
                    var ingSearch = ingredients.join("&ingredients%5B%5D=");
                    var recipeURL = "https://www.yummly.com/recipe/" + id
                    var recipeDiv = $("<div class='recipeImgDiv'>");
                    var p = $("<p>").text(recipeTitle);
                    var recipeImg = $("<img>");
                    var recipeLink = $("<a>");

                    recipeImg.addClass("recipeItem");
                    recipeImg.attr("src", imgUrl);

                    recipeLink.attr("href", recipeURL);
                    recipeLink.append(recipeImg);

                    recipeDiv.append(p);
                    recipeDiv.append(recipeLink);

                    var recipeThumb = `

                    <div class="col-md-4 col-sm-6 portfolio-item">
                        <a href="#foodPortfolioModal${z}" class="portfolio-link" data-toggle="modal" data-link="#show-search-section">
                            <div class="portfolio-hover">
                                <div class="portfolio-hover-content">
                                    <i class="fa fa-plus fa-3x"></i>
                                </div>
                            </div>
                            <img src="${imgUrl}"  class="img-responsive" style="width:100%" alt="${recipeTitle}">
                        </a>
                        <div class="portfolio-caption" >
                            <h4 class="thumbTitle">${recipeTitle}</h4>
                        </div>
                    </div>`;


                    var recipeModal = `
                    <div class="portfolio-modal modal fade" id="foodPortfolioModal${z}" tabindex="-1" role="dialog" aria-hidden="true">
                        <div class="modal-dialog">
                            <div class="modal-content">
                                <div class="close-modal" data-dismiss="modal">
                                    <div class="lr">
                                        <div class="rl">
                                        </div>
                                    </div>
                                </div>
                                <div class="container">
                                    <div class="row">
                                        
                                        <div class="col-lg-8 col-lg-offset-2">
                                            <div class="modal-body">
                                                <h2 class="modal-title">${recipeTitle}&nbsp;<span id="heart" db-id="${id}" favorite="false" title="${recipeTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                                <p class="item-intro text-muted">Ingredients: ${IngAsString}</p>
                                                <img src="${imgUrl}" class="img-responsive recipe-pic" style="width:400px;">                    
                                                <a href="${recipeURL}" target="_blank" type="button" class="btn btn-primary" ><i class="fa fa-cutlery"></i>See More Details</a>
                                                <a href="https://www.instacart.com/store/partner_recipe?recipe_url=https%3A%2F%2Fwww.yummly.com%2F%23recipe%2F${id}&partner_name=www.yummly.com&ingredients%5B%5D=${ingSearch}&title=${recipeTitle}&description=&image_url=${imgUrl}" target="_blank" type="button" class="btn btn-primary middleBtn"><i class="fa fa-shopping-cart"></i>Add to Instacart</a>
                                                <a id="recipe-select" data-title="${recipeTitle}" data-ing="${IngAsString}" data-poster="${imgUrl}" data-dismiss="modal" type="button" class="btn btn-primary"><i class="fa fa-check-square"></i>Select This Recipe</a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;

                    $(".recipeImages").append(recipeThumb);
                    $("#recipe-modals").append(recipeModal);

                    $("#recipe-select").on("click", function() {
                        $("#finalModalRecipe").empty();
                        $("#finalModalRecipe").append("recipe section stuff");
                    });
                };
            }
        });
    });

    function createButtons() {
        var cuisines = ["American", "Kid-Friendly", "Italian", "Asian", "Mexican", "Southern", "French", "Southwestern", "Barbecue-bbq", "Indian", "Chinese", "Cajun", "English", "Mediterranean", "Greek", "Spanish", "German", "Thai", "Moroccan", "Irish", "Japanese", "Cuban", "Hawaiin", "Swedish", "Hungarian", "Portugese"];
        for (var a = 0; a < cuisines.length; a++) {
            var button = $(`<button id="button${a}">`);
            button.addClass("cuisines btn btn-primary");
            button.attr({ "data-name": cuisines[a], "data-state": "unchecked" });
            button.text(cuisines[a]);

            $(".recipeButtons").append(button);
        };
    };

    function animateBtn() {
        //we get the data-state attribute from the button clicked
        state = this.getAttribute('data-state');
        var cuisineSelected = $(this).attr("data-name").toLowerCase();
        var cuisineParameter = "&allowedCuisine=cuisine%5Ecuisine-" + cuisineSelected;
        // button initial state is unchecked...this status will only change on click
        // when it gets clicked, we change the state and css style
        if (state === "unchecked") {
            $(this).css({ "background-color": "#333", "border-color": "#333", "opacity": "0.9" });
            $(this).attr("data-state", "checked");
            addedCuisines.push(cuisineParameter);
            //otherwise, the button is already selected and needs to be unselected
        } else {
            $(this).removeAttr('style').css("background-color", "#fff");
            $(this).attr("data-state", "unchecked");
            addedCuisines = addedCuisines.filter(a => a !== cuisineParameter);
        };
    };

    function resetRecipe() {
        $("#food").val('');
        $("#recipe_view").empty();
        $(".recipeImages").empty();
        $("#recipe-modals").empty();
    };

    function resetButtons() {
        addedCuisines = [];
        $(".cuisines.btn.btn-primary").removeAttr('style').css("background-color", "#fff");
        $(".cuisines.btn.btn-primary").attr("data-state", "unchecked");
    };

    $("#name").keyup(function() {
        $("#danger").html("")
        var contactName = $("#name").val().trim();
        var letters = /^[A-Za-z\s]+$/;
        if (contactName.match(letters) || contactName === "") {
            $("#danger").html("")
        } else if (!contactName.match(letters)) {
            $("#danger").html(`<ul role="alert"><li>Letters only please</li></ul>`);
        };
    });


    createButtons();
    $(document).on("click", ".cuisines", animateBtn);

    $(".startBtn").on("click", function() {
        var sec = 0.8;
        for (var x = 0; x <= 25; x++) {
            var b = $(`#button${x}`);
            var tl2 = new TimelineLite();
            tl2.from(b, 1.5, { x: -15, autoAlpha: 0, ease: Power1.ease, delay: sec });
            tl2.play();
            tl2.restart();
            sec = sec + 0.05;
        };
    });

    $(".whatchaWatching").on("click", function() {
        var sec = 0.8;
        for (var x = 0; x <= 25; x++) {
            var t = $(`.button${x}`);
            var tl2 = new TimelineLite();
            tl2.from(t, 1.5, { x: -15, autoAlpha: 0, ease: Power1.ease, delay: sec });
            tl2.play();
            tl2.restart();
            sec = sec + 0.05;
        };
    });

    $(document).on("click", ".portfolio-hover", function() {
        $(".index").css("padding-right", "0px");
    });

    $(document).on("click", "#recipe-select", function() {
        setTimeout(function() { $(document).scrollTop(11 / 8 * height); }, 800);
        $("#rp-final-section").empty();
        var title = $(this).attr("data-title");
        var ing = $(this).attr("data-ing");
        var poster = $(this).attr("data-poster");
        $(".final-section").html(`
            <div class="col-md-6" id="rp-final-section">
                <div class="row">
                    <h2>${title}</h2>
                </div>
                <div class="row">    
                    <img class="rp-pic" src="${poster}">
                </div>
                <div class="row">        
                    <h3 class="section-subheading text-muted rp-text">Ingredients: ${ing}</h3>
                </div>
            </div>
                `);
        $("#your-results").show();
    });

    $(document).on("click", "#show-select", function() {
        $("#mv-final-section").empty();
        var title = $(this).attr("data-title");
        var plot = $(this).attr("data-plot");
        var poster = $(this).attr("data-poster");
        setTimeout(function() { $(document).scrollTop(56 / 8 * height); }, 800);
        $(".final-section").append(`
            <div class="col-md-6" id="mv-final-section">
                <div class="row">
                    <h2>${title}</h2>
                </div>
                 <div class="row">
                    <img class="show-pic" src="https://image.tmdb.org/t/p/w500${poster}">
                </div>
                <div class="row">
                    <h3 class="section-subheading text-muted mv-text">${plot}</h3>
                </div>
            </div>
        `);
        $("#your-results").show();
    });

    $("#appReset").on("click", function(event) {
        $("#mv-final-section").empty();
        $("#rp-final-section").empty();
        $("#your-results").hide();
    });

});
