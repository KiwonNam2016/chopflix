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

    var queryURL = "https://api.themoviedb.org/3/movie/now_playing?api_key=b300de2804d6ecbfa5435065a4835711&language=en-US";

    $.ajax({
        url: queryURL,
        method: "GET"
    }).done(function(response) {
        var id = response.results[0].id;
        var title = response.results[0].title;
        var thumb = response.results[0].poster_path;
        var allthestuff = [id, title, thumb];

        console.log(allthestuff);
        console.log(response);

    })

});