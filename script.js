let timerobj = {
    minutes : 0,
    seconds : 0,
    timerId : 0 
}

function soundAlarm() {
    let amount = 3;
    let audio = new Audio("Timer_Sound_Effect.mp3");

    function playsound(){
        audio.pause();
        audio.currentTime = 0;
        audio.play();
    }

    for(let i = 0; i< amount; i++){
        setTimeout(playsound, 1200*i)
    }

}

function updateValue(key, value) {

    if (value < 0) {
        value = 0;
        console.log("positive nos only");
    
    }
    if (key == "seconds"){
        if(value < 10){
            value = "0" + value;
        }
        if(value > 59){
            value = 59;
        }
    }
    $("#" + key).html(value || 0);
    timerobj[key] = value;

  
}
/* self call functions */
(function detectchanges(key){
    console.log("Detect Changes");
    
    let input = "#" + key + "-input";

    $(input).change(function(){
        updateValue(key, $(input).val());
    });

    $(input).keyup(function(){
        updateValue(key, $(input).val());
    });

    return arguments.callee;

})("minutes")("seconds"); 



function startTimer() {
    buttonManager(["start", false], ["stop", true], ["pause", true]);
    freezeInput();
    timerobj.timerId = setInterval(function()  {
        timerobj.seconds--;
        if(timerobj.seconds<0){
            if(timerobj.minutes == 0){
                soundAlarm();
                return stopTimer();
            }
            timerobj.seconds = 59;
            timerobj.minutes--;

        }

        updateValue("minutes", timerobj.minutes );
        updateValue("seconds", timerobj.seconds );

    }, 1000);
}

function stopTimer(){
    clearInterval(timerobj.timerId);
    buttonManager(["start", true], ["stop", false], ["pause", false]);
    unfreezeInput();
    updateValue("minutes", $("minutes-input").val());

    // If the seconds is falsy, or undefined, set seconds to "0". Just 1 zero because line 29 checks if the value is less than 10, and if it is it will add an extra zero for you. 
    // The seconds will by default be undefined.  Expliclty setting the seconds to 0 will prevent formats such as 1:0 or 2:0 when the timer expires, where the correct format should be 1:00 or 2:00.

    let seconds = $("#seconds-input").val() || "0";
    updateValue("seconds", seconds);
}


function pauseTimer(){
    buttonManager(["start", true], ["stop", true], ["pause", false]);
    clearInterval(timerobj.timerId);
}


function buttonManager(...buttonsArray){
    for(let i = 0; i < buttonsArray.length; i++) {
        let button = "#" + buttonsArray[i][0] + "-button";
        if(buttonsArray[i][1]){
            $(button).removeAttr("disabled");
        } else {
            $(button).attr("disabled", "disabled"); 
        }

    }

}




function freezeInput(){
    $("#minutes-input").attr("disabled", "disabled");
    $("#seconds-input").attr("disabled", "disabled");
}

function unfreezeInput(){
    $("#minutes-input").removeAttr("disabled");
    $("#seconds-input").removeAttr("disabled");
}