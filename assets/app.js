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

    // now playing movies
    var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=b300de2804d6ecbfa5435065a4835711&language=en-US";
    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        $(".nowPlaying").html("");
        var searchResults = response.results;

        for (let i = 0; i < searchResults.length; i++) {
            var nowPlayingBtn = $(`<div class="movie-div" id="${searchResults[i].id}">`);
            var image = $(`<img class="movie-poster">`)
            var title = $(`<p class="movie-title">${searchResults[i].title}</p>`);
            nowPlayingBtn.append(title);
            image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[i].poster_path);
            image.attr("alt", title);
            image.attr("value", searchResults[i].title);
            nowPlayingBtn.append(image);
            $(".nowPlaying").prepend(nowPlayingBtn);
            console.log("I'm working")
        }

        console.log(searchResults);

    });

    // YouTube trailer feature
    $(document).on("click", ".movie-poster", function() {
        var searchFromMovie = $(this).attr("value");
        var youTubeQueryUrl = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=" + searchFromMovie + "+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g";

        $(".youTubeSearch").empty();
        console.log(searchFromMovie);

        $.ajax({
            url: youTubeQueryUrl,
            method: "GET"
        }).done(function(response) {
            var youTubeVidId = response.items[0].id.videoId;
            var vidURL = "src=https://www.youtube.com/embed/" + youTubeVidId;
            var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
            $(".youTubeSearch").append(youTubeVid);
            console.log(youTubeVidId);
            console.log(searchFromMovie);


        })
    })

    // similar movies results
    $(".nowPlaying").on("click", ".movie-div", function(event) {
        console.log(this.id);
        var searchSimilar = `https://api.themoviedb.org/3/movie/${this.id}/similar?api_key=b300de2804d6ecbfa5435065a4835711&language=en-US&page=1`
        console.log(searchSimilar);
        $.ajax({
            url: searchSimilar,
            method: "GET"
        }).done(function(response) {
            console.log(response.results)
            $(".nowPlaying").html("");
            var searchResults = response.results;

            for (let i = 0; i < searchResults.length; i++) {
                var nowPlayingBtn = $(`<div class="movie-div" id="${searchResults[i].id}">`);
                var image = $(`<img class="movie-poster">`)
                var title = $(`<p class="movie-title">${searchResults[i].title}</p>`);
                nowPlayingBtn.append(title);
                image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[i].poster_path);
                image.attr("alt", title);
                nowPlayingBtn.append(image);
                $(".nowPlaying").prepend(nowPlayingBtn);
                console.log("I'm working")    
          }
        });
    });

});