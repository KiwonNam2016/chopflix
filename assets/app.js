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

    // genres for movies
    $("#movie").on("click", function() {
        var queryURL = `https://api.themoviedb.org/3/genre/movie/list?api_key=${tmdb}&language=en-US`;
        $.ajax({
            url: queryURL,
            method: "GET"
        }).done(function(response) {
            $("#genres").html("");
            var genre = response.genres;        
            for (let k = 0; k < genre.length; k++) {
                var button = $(`<button class="movie-genre">`);
                button.attr("id", genre[k].id);
                button.addClass("btn btn-default");
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
                var button = $(`<button class="tv-genre">`);
                button.attr("id", genre[l].id);
                button.addClass("btn btn-default");
                button.html(genre[l].name);
                $("#genres").append(button);
            };
        });
    });

    // discover movies
    $(".genre-buttons").on("click", ".movie-genre", function(event) {
        var discover = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdb}&language=en-US&sort_by=popularity.desc&certification.lte=pg-13&include_adult=false&include_video=false&page=1&with_genres=${this.id}`

        $.ajax({
            url: discover,
            method: "GET"
        }).done(function(response) {
            $(".nowPlaying").html("");
            var searchResults = response.results;
            for(var m = 0 ; m < searchResults.length ; m++) {
                var resultsBtn = $(`<div class="hvrbox movie-div" id="${searchResults[m].id}"><a href="#movieJump">`);
                var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
                var title = searchResults[m].title;
                var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">${title}<div class="line"/>Click to See Details</div></div>`);           
                image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[m].poster_path);
                resultsBtn.prepend(image);
                resultsBtn.append(layer);
                resultsBtn.attr("id", searchResults[m].id).attr("alt", title).attr("plot", searchResults[m].overview);
                resultsBtn.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[m].poster_path);
                $(".nowPlaying").prepend(resultsBtn);
            };
        });
    });

    // discover tv
    $(".genre-buttons").on("click", ".tv-genre", function(event) {
        var discover = `https://api.themoviedb.org/3/discover/tv?api_key=${tmdb}&language=en-US&sort_by=popularity.desc&certification.lte=pg-13&include_adult=false&include_video=false&page=1&with_genres=${this.id}`

        $.ajax({
            url: discover,
            method: "GET"
        }).done(function(response) {
            $(".nowPlaying").html("");
            var searchResults = response.results;
            for(var n = 0 ; n < searchResults.length ; n++) {
                var resultsBtn = $(`<div class="hvrbox movie-div" id="${searchResults[n].id}">`);
                var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
                var title = searchResults[n].name;
                var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">${title}<div class="line"/>Click to See Details</div></div>`);           
                image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[n].poster_path);
                resultsBtn.prepend(image);
                resultsBtn.append(layer);
                resultsBtn.attr("id", searchResults[n].id).attr("alt", title).attr("plot", searchResults[n].overview);
                resultsBtn.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[n].poster_path);
                $(".nowPlaying").prepend(resultsBtn);
            };
        });
    });

    // now playing movies
    // var queryURL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${tmdb}&language=en-US`;
    // $.ajax({
    //     url: queryURL,
    //     method: "GET"
    // }).done(function(response) {
    //     $(".nowPlaying").html("");
    //     var searchResults = response.results;


    //     for (let i = 0; i < searchResults.length; i++) {
    //         var nowPlayingBtn = $(`<div class="hvrbox movie-div" id="${searchResults[i].id}">`);
    //         var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
    //         var title = searchResults[i].title;
    //         var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">${title}</div></div>`);           
    //         image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[i].poster_path);
    //         image.attr("alt", title);
    //         nowPlayingBtn.prepend(image);
    //         nowPlayingBtn.append(layer);
    //         $(".nowPlaying").prepend(nowPlayingBtn);
    //     }

    // });


    // similar movies results
    // $(".nowPlaying").on("click", ".movie-div", function(event) {
    //     var searchSimilar = `https://api.themoviedb.org/3/movie/${this.id}/similar?api_key=b300de2804d6ecbfa5435065a4835711&language=en-US&page=1`

    //     $.ajax({
    //         url: searchSimilar,
    //         method: "GET"
    //     }).done(function(response) {
    //         $(".nowPlaying").html("");
    //         var searchResults = response.results;
    //         for(var j = 0 ; j < searchResults.length ; j++) {
    //             $(`<div class="item"><img src="https://image.tmdb.org/t/p/w500${searchResults[i].poster_path}" alt="${searchResults[i].title}><div class="carousel-caption"><p class="synopsis">${searchResults[i].overview}</p></div></div>`).appendTo('.carousel-inner');
    //             $(`<li data-target="#carousel-movies" data-slide-to="${i}"></li>`).appendTo('.carousel-indicators')
    //           }
    //           $('.item').first().addClass('active');
    //           $('.carousel-indicators > li').first().addClass('active');
    //           $('#carousel-movies').carousel();
    //     });
    // });

    // additional details screen
    $(".nowPlaying").on("click", ".movie-div", function() {
        var movieTitle = $(this).attr("alt");
        var overview = $(this).attr("plot");
        var poster = $(this).attr("poster");
        console.log(movieTitle);
        console.log(overview);
        console.log(poster);
        var youTubeQueryUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${movieTitle}+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g`;
        var searchRecs = `https://api.themoviedb.org/3/movie/${this.id}/recommendations?api_key=${tmdb}&language=en-US&page=1`


        $(".showMeDetails").empty();
        $(".showMeDetails").append(`<h1>${movieTitle}</h1>`).append(overview).append(`<h3>Other Movies You Might Like:</h3>`);
        $(".showMeDetails").prepend(`<div id="movieJump">`);

        $.ajax({
            url: youTubeQueryUrl,
            method: "GET"
        }).done(function(response) {
            var youTubeVidId = response.items[0].id.videoId;
            var vidURL = `src="https://www.youtube.com/embed/${youTubeVidId}"`;
            var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
            $(".showMeDetails").prepend(youTubeVid);
        });

        $.ajax({
            url: searchRecs,
            method: "GET"
        }).done(function(response) {
            var searchResults = response.results;
            for(var o = 0 ; o < searchResults.length ; o++) {
                var resultsBtn = $(`<div class="hvrbox movie-div otherRecs" id="${searchResults[o].id}">`);
                var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
                var title = searchResults[o].title;
                //var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">See More</div>`);           
                image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[o].poster_path);
                resultsBtn.prepend(image);
                //resultsBtn.append(layer);
                resultsBtn.attr("id", searchResults[o].id).attr("alt", title).attr("plot", searchResults[o].overview);
                resultsBtn.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[o].poster_path);
                $(".showMeDetails").append(resultsBtn);
            };
        });
    });

    // nth degree details screens
    $(".showMeDetails").on("click", ".otherRecs", function() {
        var movieTitle = $(this).attr("alt");
        var overview = $(this).attr("plot");
        var poster = $(this).attr("poster");
        var youTubeQueryUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${movieTitle}+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g`;
        var searchRecs = `https://api.themoviedb.org/3/movie/${this.id}/recommendations?api_key=${tmdb}&language=en-US&page=1`

        $(".showMeDetails").empty();
        $(".showMeDetails").append(`<h1>${movieTitle}</h1>`).append(overview).append(`<h3>Other Movies You Might Like:</h3>`);

        $.ajax({
            url: youTubeQueryUrl,
            method: "GET"
        }).done(function(response) {
            var youTubeVidId = response.items[0].id.videoId;
            var vidURL = `src="https://www.youtube.com/embed/${youTubeVidId}"`;
            var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
            $(".showMeDetails").prepend(youTubeVid);
        });

        $.ajax({
            url: searchRecs,
            method: "GET"
        }).done(function(response) {
            var searchResults = response.results;
            for(var p = 0 ; p < searchResults.length ; p++) {
                var resultsBtn = $(`<div class="hvrbox movie-div otherRecs" id="${searchResults[p].id}">`);
                var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
                var title = searchResults[p].title;
                //var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">See More</div>`);           
                image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[p].poster_path);
                resultsBtn.prepend(image);
                //resultsBtn.append(layer);
                resultsBtn.attr("id", searchResults[p].id);
                resultsBtn.attr("alt", title);
                resultsBtn.attr("plot", searchResults[p].overview);
                resultsBtn.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[p].poster_path);
                $(".showMeDetails").append(resultsBtn);
            };
        });
    });

    //yummly search
    var addedCuisines  = [];
    var cuisineSearch;
    var state;
    $(".go").on("click", function() {
        console.log(cuisineSearch);
		cuisineSearch = addedCuisines.join('');
		console.log(cuisineSearch);
        var food = $("#food").val().trim();
        var yumQuery = "http://api.yummly.com/v1/api/recipes?_app_id=74c2c130&_app_key=dbe2b1012a02ca615dbe289501e4ef92&q=" + food + cuisineSearch;
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

                $("#recipe_view").append(recipeDiv);      
          }
      });
  });

  function createButtons() {
        var cuisines = ["American", "Italian", "Asian", "Mexican", "Southern & Soul Food", "French", "Southwestern", "Barbecue", "Indian", "Chinese", "Cajun & Creole", "English", "Mediterranean", "Greek", "Spanish", "German", "Thai", "Moroccan", "Irish", "Japanese", "Cuban", "Hawaiin", "Swedish", "Hungarian", "Portugese"];
        for (var a = 0; a < cuisines.length; a++) {
            var button = $("<button>");
            button.addClass("cuisines btn btn-primary btn-lg");
            button.attr({"data-name": cuisines[a], "data-state": "unchecked"});
            button.text(cuisines[a]);
            
            $(".recipeButtons").append(button);
        }

    };

    function animateImg() {
        //we get the data-state attribute from the image clicked
        state = this.getAttribute('data-state');
        var cuisineSelected = $(this).attr("data-name");
        var cuisineParameter = "&allowedCuisine[]=cuisine^cuisine-" + cuisineSelected
        //if image is at still state...url and state are changed to match animated
        if (state === "unchecked") {
            // $(this).removeAttr('style').css("background-color", "red");
            $(this).css("background-color", "#204d74");
            $(this).attr("data-state", "checked");
            addedCuisines.push(cuisineParameter);
            console.log(addedCuisines);

            //otherwise, the image is animated and needs to be switched to still...url and state are changed to match still
        } else {
            $(this).removeAttr('style').css("background-color", "#337ab7");
            // $(this).css("background-color", "red");
            $(this).attr("data-state", "unchecked");
            addedCuisines = addedCuisines.filter(a => a !== cuisineParameter);
            console.log(addedCuisines);
        }
    }
    createButtons();
    $(document).on("click", ".cuisines", animateImg);

});