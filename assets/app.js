// Initialize Firebase
var config = {
    apiKey: "AIzaSyADx_hkxvnPlQRhYD0iTtAW0rSf-a31DUw",
    authDomain: "project1-f1ba2.firebaseapp.com",
    databaseURL: "https://project1-f1ba2.firebaseio.com",
    projectId: "project1-f1ba2",
    storageBucket: "project1-f1ba2.appspot.com",
    messagingSenderId: "577191616839"
};
firebase.initializeApp(config);

$(document).ready(function() {
    var database = firebase.database();
    var tmdb = "b300de2804d6ecbfa5435065a4835711";
    var uid = JSON.parse(localStorage.getItem("cKDX9B90bvAYTGSiZq3W"));

    // setting date for IE8 and earlier
    if (!Date.now) {
        Date.now = function() { return new Date().getTime(); };
    };

    // ADDING A NEW USER
    // detecting presence and creating a unique id
    database.ref(".info/connected").on("value", function(snapshot) {
        if (uid === null) {
            database.ref("users").push("");
        };
        // if we need anything removed
        // database.ref().onDisconnect().remove(); 
    });

    // saving unique key for new player
    database.ref("users").once("child_added", function(snapshot) {
        var id = snapshot.key;
        if (uid === null) {
            localStorage.setItem("cKDX9B90bvAYTGSiZq3W", JSON.stringify(id));
        }

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
            for (let k = 0; k < genre.length; k++) {
                var button = $(`<button class="movie-genre">`);
                button.attr("id", genre[k].id).attr("name", genre[k].name);
                button.addClass("btn btn-primary");
                button.html(genre[k].name);
                $("#genres").append(button);
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
            for (let l = 0; l < genre.length; l++) {
                var glyph = $(`<span class="glyphicon glyphicon-blackboard" aria-hidden="true">`);
                var button = $(`<button class="tv-genre"><div>`);
                button.attr("id", genre[l].id);
                button.addClass("btn btn-primary");
                button.html(genre[l].name);
                $("#genres").append(button);
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
 
                var movieThumb = `
                    <div class="col-md-4 col-sm-6 portfolio-item">
                        <a href="#portfolioModal${m}" class="portfolio-link" data-toggle="modal">
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
                    <div class="portfolio-modal modal fade" id="portfolioModal${m}" tabindex="-1" role="dialog" aria-hidden="true">
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
                                                <h2>${movieTitle}<span id="heart" favorite="false" title="${movieTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                                <p class="item-intro text-muted">${overview}</p>
                                                <div id="youTube-${m}"></div>
                                                <div id="otherPicks"></div>
                                                <button type="button" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
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
                var movieTitle = searchResults[n].name;
                var overview = searchResults[n].overview;
                var poster = searchResults[n].backdrop_path;
 
                var movieThumb = `
                    <div class="col-md-4 col-sm-6 portfolio-item">
                        <a href="#portfolioModal${n}" class="portfolio-link" data-toggle="modal">
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
                    <div class="portfolio-modal modal fade" id="portfolioModal${n}" tabindex="-1" role="dialog" aria-hidden="true">
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
                                                <h2>${movieTitle}<span id="heart" favorite="false" title="${movieTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                                <p class="item-intro text-muted">${overview}</p>
                                                <div id="youTube-${n}"></div>
                                                <div id="otherPicks"></div>
                                                <button type="button" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
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

    //     $.ajax({
    //         url: searchRecs,
    //         method: "GET"
    //     }).done(function(response) {
    //         var searchResults = response.results;
    //         for (var p = 0; p < searchResults.length; p++) {
    //             var resultsBtn = $(`<div class="hvrbox movie-div otherRecs" id="${searchResults[p].id}">`);
    //             var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
    //             var title = searchResults[p].title;
    //             //var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">See More</div>`);           
    //             image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[p].poster_path);
    //             resultsBtn.prepend(image);
    //             //resultsBtn.append(layer);
    //             resultsBtn.attr("id", searchResults[p].id);
    //             resultsBtn.attr("alt", title);
    //             resultsBtn.attr("plot", searchResults[p].overview);
    //             resultsBtn.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[p].poster_path);
    //             $(".showMeDetails").append(resultsBtn);

    //         };
    //     });

    // });

    $("#movie-modals").on("click", "#heart", function(event) {
        var faveTitle = $(this).attr("title");
        var saved = $(this).attr("favorite");
        var id = $(this).attr("id");
        if (saved === "true") {
            database.ref("users/" + uid + "/TMDB_faves/" + faveTitle).remove();
        } else {
            database.ref("users/" + uid + "/TMDB_faves/").update({
                [faveTitle]: Date.now()
            });
        }
        $(this).attr("class", ($(this).attr("class") == "glyphicon glyphicon-heart glyphicon-heart-empty" ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart glyphicon-heart-empty"));
        $(this).attr("favorite", ($(this).attr("favorite") == "false" ? true : false));
    });

    $("#recipe-modals").on("click", "#heart", function(event) {
        var faveTitle = $(this).attr("title");
        var saved = $(this).attr("favorite");
        var id = $(this).attr("id");
        if (saved === "true") {
            database.ref("users/" + uid + "/Yummly_faves/" + faveTitle).remove();
        } else {
            database.ref("users/" + uid + "/Yummly_faves/").update({
                [faveTitle]: Date.now()
            });
        }
        $(this).attr("class", ($(this).attr("class") == "glyphicon glyphicon-heart glyphicon-heart-empty" ? "glyphicon glyphicon-heart" : "glyphicon glyphicon-heart glyphicon-heart-empty"));
        $(this).attr("favorite", ($(this).attr("favorite") == "false" ? true : false));
    });

    //yummly search
    var addedCuisines = [];
    var cuisineSearch;
    var state;
    var go=$(".go");
    //button animation
    var tl=new TimelineLite();
    tl.to(go, 0.7, {rotationX:-360,transformOrigin:'0% 50%', ease:Power2.easeInOut})
    tl.pause();
    $(".go").on("click", function(event) {
        event.preventDefault();
        // var Ing=[];
        tl.play();
        tl.restart();
        console.log(cuisineSearch);
        cuisineSearch = addedCuisines.join('');
        console.log(cuisineSearch);
        var food = $("#food").val().trim();
        $("#food").val('');
        $("#recipe_view").empty();
        $(".recipeImages").empty();
        $("#recipe-modals").empty();
        var yumQuery = "http://api.yummly.com/v1/api/recipes?_app_id=74c2c130&_app_key=dbe2b1012a02ca615dbe289501e4ef92&q=" + food + cuisineSearch + "&requirePictures=true";
        console.log(food);
        console.log(yumQuery);
        console.log(cuisineSearch);

        $.ajax({
            url: yumQuery,
            method: "GET"
        }).done(function(response) {
            result = response.matches;
            console.log(result);
            
            for (var z = 0; z < result.length; z++) {

                var id = (result[z].id)
                console.log(id);
                var recipeTitle = (result[z].recipeName);
                var imgUrl = result[z].imageUrlsBySize["90"].replace("s90-c", "s200-c");
                var ingredients=(result[z].ingredients);
                var IngAsString = ingredients.join(', ');
                console.log(ingredients);
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
                    <a href="#portfolioModal${z}" class="portfolio-link" data-toggle="modal">
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
                <div class="portfolio-modal modal fade" id="portfolioModal${z}" tabindex="-1" role="dialog" aria-hidden="true">
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
                                            <h2>${recipeTitle}<span id="heart" favorite="false" title="${recipeTitle}" class="glyphicon glyphicon-heart glyphicon-heart-empty"></span></h2>
                                            <center><img src="${imgUrl}" class="img-responsive" style="width:400px;"></center>
                                            <p class="item-intro text-muted"></p>
                                            <p class="Ingbtn">Main Ingredients: ${IngAsString}</p>
                                            <button type="button" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-times"></i> Close</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

                
                $(".recipeImages").append(recipeThumb);
                $("#recipe-modals").append(recipeModal);
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
        }

    };

    function animateBtn() {
        //we get the data-state attribute from the button clicked
        state = this.getAttribute('data-state');
        var cuisineSelected = $(this).attr("data-name").toLowerCase();
        var cuisineParameter = "&allowedCuisine=cuisine%5Ecuisine-" + cuisineSelected;
        // button initial state is unchecked...this status will only change on click
        // when it gets clicked, we change the state and css style
        if (state === "unchecked") {
            $(this).css({"background-color": "#333", "border-color": "#333", "opacity": "0.9"});
            $(this).attr("data-state", "checked");
            addedCuisines.push(cuisineParameter);
            console.log(addedCuisines);
            //otherwise, the button is already selected and needs to be unselected
        } else {
            $(this).removeAttr('style').css("background-color", "#feca30");
            $(this).attr("data-state", "unchecked");
            addedCuisines = addedCuisines.filter(a => a !== cuisineParameter);
            console.log(addedCuisines);
        }
    }
    createButtons();
    $(document).on("click", ".cuisines", animateBtn);
   
    $(".startBtn").on("click",function(){
    var sec=0.8;
    for (var x=0; x<=25; x++){
        var b=$(`#button${x}`);
        var tl2=new TimelineLite();
        tl2.from(b, 1.5,{x:-15, autoAlpha:0,ease:Power1.ease, delay:sec});
        tl2.play();
        tl2.restart();
        sec=sec+0.05;
        }
    })

    $(".whatchaWatching").on("click",function(){
        var sec=0.8;
        for (var x=0; x<=25; x++){
            var b=$(`#button${x}`);
            var tl2=new TimelineLite();
            tl2.from(b, 1.5,{x:-15, autoAlpha:0,ease:Power1.ease, delay:sec});
            tl2.play();
            tl2.restart();
            sec=sec+0.05;
            }
    })

});
