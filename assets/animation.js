function animation(){
    var h=8000;
    var inputBox=$("#searchEntry");
    var jumbotron=$(".jumbotron");
    var myTitle=$(".title");
    TweenLite.from(inputBox,1,{opacity:0,y:50});
  
    TweenLite.to(jumbotron,2,{opacity:100,y:50, onUpdate:onUpdate});
    TweenLite.from(myTitle,1,{autoAlpha:0,y:50,delay:1, ease:Elastic.easeOut});

    function onUpdate(){
        h=h+50;
        $("h2").text(`You can find more than ${h} recipes here!`)
    }
}

animation();