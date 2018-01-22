function animation(){
    var h=1000000;
    var inputBox=$("#searchEntry");
    var something=$("#something");
    var myTitle=$(".title");
    var icon=$(".startBtn");
    var watching=$(".whatchaWatching");
    var tl1=new TimelineLite();
    var tl3=new TimelineLite();
    var tl6=new TimelineLite();
    var tl7=new TimelineLite();
    var member=["khamel","rachel","amy","eddie"];
   

    
    tl3.from(something,2,{opacity:100,y:50, onUpdate:onUpdate, onComplete:onComplete});
    // var tl=new TimelinLite();
    tl1.to(icon,1,{rotationX:-360,transformOrigin:'50% 50%', ease:Power2.easeInOut})
    
    tl3.pause();
    tl1.pause();
    tl6.pause();
    TweenLite.from(inputBox,1,{opacity:0,y:50});
  
    
    TweenLite.from(myTitle,1,{autoAlpha:0,y:50,delay:1, ease:Elastic.easeOut,delay:0.8});
    
    watching.on("click",function(){
       
        tl3.play();
        tl3.restart();
       
        
    })

    icon.on("click",function(){
        
        tl3.play();
        tl3.restart();
    })
    function onUpdate(){
        
        h=h+300;
        $("#something").text(`You can find more than ${h} recipes here!`)
        
    }
    function onComplete(){
        h=1048767;
        $("#something").text(`You can find more than ${h} recipes here!`)
        h=1000000
    }

    $(".startBtn").mouseenter(function(){
       tl1.play();
       tl1.restart();
       
    })

    
    $(".team-member").on("click",function(){
        var numberOne = Math.floor(Math.random() * 4);
        
        // run this loop until numberTwo is different than numberThree and numberOne
        do {
            var numberTwo = Math.floor(Math.random() * 4);
        } while(numberTwo === numberOne);
        
    
        tl6
        .from($("#khamel"), 2,{rotationX:-3600,transformOrigin:'50% 50%', ease:Power2.easeInOut})
        .from($("#rachel"), 2,{rotationX:-3600,transformOrigin:'50% 50%', ease:Power2.easeInOut},'-=2')
        .from($("#amy"), 2,{rotationX:-3600,transformOrigin:'50% 50%', ease:Power1.easeOut},'-=2')
        .from($("#eddie"), 2,{rotationX:-3600,transformOrigin:'50% 50%', ease:Elastic.easeOut},'-=2')
        .to($(`#${member[numberOne]}`), 2,{y:600, autoAlpha:0, transformOrigin:'50% 50%', ease:Elastic.easeOut},'-=0.5')
        .to($(`#${member[numberTwo]}`), 2,{y:600, autoAlpha:0, transformOrigin:'50% 50%', ease:Elastic.easeOut},'-=1.5')
        .to($(`#${member[numberOne]}`),1,{y:0, autoAlpha:10, transformOrigin:'50% 50%', ease:Elastic.easeOut},'-=0.5')
        .to($(`#${member[numberTwo]}`), 1,{y:0, autoAlpha:10, transformOrigin:'50% 50%', ease:Elastic.easeOut},'-=0.4')
       
        tl6.play();




    })
}


animation();