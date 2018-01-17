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
            var nowPlayingBtn = $(`<div class="hvrbox movie-div" id="${searchResults[i].id}">`);
            var image = $(`<img class="hvrbox-layer_bottom movie-poster">`);
            var title = searchResults[i].title;
            var layer = $(`<div class="hvrbox-layer_top hvrbox-layer_slideup"><div class="hvrbox-text">${title}</div></div>`);           
            image.attr("src", "https://image.tmdb.org/t/p/w500" + searchResults[i].poster_path);
            image.attr("alt", title);
            nowPlayingBtn.prepend(image);
            nowPlayingBtn.append(layer);
            $(".nowPlaying").prepend(nowPlayingBtn);
        }

    });


    // similar movies results
    $(".nowPlaying").on("click", ".movie-div", function(event) {
        var searchSimilar = `https://api.themoviedb.org/3/movie/${this.id}/similar?api_key=b300de2804d6ecbfa5435065a4835711&language=en-US&page=1`

        $.ajax({
            url: searchSimilar,
            method: "GET"
        }).done(function(response) {
            $(".nowPlaying").html("");
            var searchResults = response.results;
            for(var i = 0 ; i < searchResults.length ; i++) {
                $(`<div class="item"><img src="https://image.tmdb.org/t/p/w500${searchResults[i].poster_path}" alt="${searchResults[i].title}><div class="carousel-caption"><p class="synopsis">${searchResults[i].overview}</p></div></div>`).appendTo('.carousel-inner');
                $(`<li data-target="#carousel-movies" data-slide-to="${i}"></li>`).appendTo('.carousel-indicators')
              }
              $('.item').first().addClass('active');
              $('.carousel-indicators > li').first().addClass('active');
              $('#carousel-movies').carousel();
        });
    });

    // YouTube trailer feature

    $(document).on("click", ".similar-movie", function() {
        var movieTitle = $(this).attr("alt");
        var youTubeQueryUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&q=${movieTitle}+trailer&key=AIzaSyCQfE0z-4oO65KlRi2bPQ7i2X-CyZ8C_6g`;

        $(".youTubeSearch").empty();

        $.ajax({
            url: youTubeQueryUrl,
            method: "GET"
        }).done(function(response) {
            var youTubeVidId = response.items[0].id.videoId;
            var vidURL = `src="https://www.youtube.com/embed/${youTubeVidId}"`;
            var youTubeVid = $(`<iframe width='420' height='315' ${vidURL}>`);
            $(".youTubeSearch").append(youTubeVid);
        });

    });

     //yummly search
    $(".go").on("click",function(){
    
        $("#moviesCarousel").addClass("carousel slide");
        $(".carousel-inner").empty();
        var food=$("#food").val().trim();
        var yumQuery="http://api.yummly.com/v1/api/recipes?_app_id=74c2c130&_app_key=dbe2b1012a02ca615dbe289501e4ef92&q="+food;
    
        $.ajax({
            url: yumQuery,
            method: "GET"
        }).done(function(response){
        
            var result=response.matches
            var imgDiv1=$("<div class='item active'>").html(`<img id="img1" src=" " alt="Pic" style="width:100%;">
            <div class="carousel-caption">
                <p id="recipe_name1"></p>
            `)
            $(".carousel-inner").prepend(imgDiv1)
            $("#img1").attr("src",result[1].imageUrlsBySize["90"])
            $("#recipe_name1").text(result[1].recipeName)
            //prepend recipe images
            for(var z=2; z<result.length; z++){
                var id="#img"+z;
                var recipe="#recipe_name"+z
                var imgDiv2=$("<div class='item'>").html(`<img id="img${z}" src=" " alt="Pic" style="width:100%;">
                    <div class="carousel-caption">
                        <p id="recipe_name${z}"></p>
                    `)
                $(".carousel-inner").prepend(imgDiv2)
                $(id).attr("src",result[z].imageUrlsBySize["90"])
                $(recipe).text(result[z].recipeName)
            }
        });

    });

});