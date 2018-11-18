/* Code for timer methods: starting and stopping timer, getting
time elapsed, possibly other methods later. */

var timerStarted = false; // to be set to true when timer starts

var startTime = null; // store Date object of start

var displayUpdates = false; // if true, show time in real-time (continuously update screen) while timing

var updateInterval = 1000; // number of milliseconds in between timer display updates

var continueUpdating = false; // to be used by updateScreen() method to determine when to stop looping

var hideAll = true; // hide all elements onscreen, including solve times and averages; only show indicator that timer is running


function updateScreen() {
    // update the time <p> elem in index.html to reflect time, at time intervals specified by updateInterval
    if (continueUpdating) {
        var currTime = Date.now();
        var currDiff = currTime - startTime;
        if (displayUpdates) {
            // show the actual time
            var dispString = formatTime(currDiff);
            // trim off last 2 digits before displaying because milliseconds are hard to time accurately in realtime
            dispString = dispString.slice(0, dispString.length - 1);
            document.getElementById("time").innerHTML = dispString;

            setTimeout(updateScreen, updateInterval);
        } else {
            // just show an elipsis animation to show that timing is active
            var elipsisUpdateInterval = 800; // millisecond delay in animating elipsis
            currDiff = Math.floor(currDiff/780); // floor to nearest second
            var timeElem = document.getElementById("time");
            if (currDiff % 3 == 0) {
                // update the animation to a single period
                timeElem.innerHTML = ".    ";
            } else if (currDiff % 3 == 1) {
                // update the animation to two periods
                timeElem.innerHTML = ". .  ";
            } else if (currDiff % 3 == 2) {
                // update the animation to all three periods
                timeElem.innerHTML = ". . .";
            }
            
            setTimeout(updateScreen, 100);
        }
        
    } 
            
    
    
}

function updateTimerUpdate() {
    // called when user checks/unchecks "display time while solving" box; if checking it, display a text input box to fetch timer update interval; if unchecking it, hide the text input box
    
    // first check the checkbox's value and update our variable
    displayUpdates = document.getElementById("displayTime").checked;
    // get the update input field and update its visibility depending on whether we checked/unchecked the box
    var inputfield = document.getElementById("timerUpdateInputElems");
    if (displayUpdates) {
        // display the textbox
        inputfield.style.display = "block";
    } else {
        inputfield.style.display = "none";
    }
    
}

function toggleHideAll() {
    // to be called when "hide all times and averages" is checked or unchecked
    hideAll = document.getElementById("hideAll").checked;
    if (hideAll) {
        document.getElementById("timesAndAvgs").style.display = "none";
    } else {
        document.getElementById("timesAndAvgs").style.display = "block";
    }
    
}



function getTime() {
    // extract the time values from a Date object and return in an array: [hour, min, sec, millisec]
    var date = new Date();
    var hr = date.getHours();
    var min = date.getMinutes();
    var sec = date.getSeconds();
    var mill = date.getMilliseconds();
    return [hr, min, sec, mill];
}

function startTimer() {
    // check if the user has entered a time into the timerUpdateInterval box; if so, update value
    if (displayUpdates) {  // input box only visible if displayUpdates is true
        var updateValue = document.getElementById("timerUpdateInt").value;
        if (updateValue < 10) {
            updateValue = 10; // bump up to smallest acceptable update interval (10 ms)
        } else if (updateValue > 60000) {
            updateValue = 60000; // bump down to longest acceptable update interval (1 minute)
        }
        updateInterval = updateValue;
    }
    
    // start the timer; log the time when timer was started, and update timerStarted variable
    startTime = Date.now();
    timerStarted = true;
    // clear the time display element
    document.getElementById("time").innerHTML = "...";
    
    // hide the scramble
    document.getElementById("scramble").innerHTML = "";
    
    // trigger the function to continuously update the screen (either with time or ... animation)
    continueUpdating = true;
    updateScreen();
}

function stopTimer() {
    // stop the timer, determine time elapsed, reset timerStarted and startTime variables, optionally do something with the time recorded
    if (timerStarted) {
        var endTime = Date.now();
        var secDiff = formatTime(endTime - startTime); // convert to seconds
        if (!hideAll) {
            document.getElementById("time").innerHTML = secDiff;
        } else {
            document.getElementById("time").innerHTML = " "; // show that timer has stopped
        }
        
        timerStarted = false;
        continueUpdating = false;
        startTime = null;
        addTime(secDiff);
        
        // put up a new scramble
        document.getElementById("scramble").innerHTML = generateScramble();
    }
    // if timer hasn't been started yet, we can't stop it! don't do anything
    
}

function formatTime(time) {
    // given an elapsed time in milliseconds, convert to a human-readable format (hh:mm:ss:mill)
    
    // first get mills and pad with zeroes as necessary
    var mills = time % 1000;
    if (mills < 10) {
        mills = "00" + mills;
    } else if (mills < 100) {
        mills = "0" + mills;
    }
    
    time = Math.floor(time/1000);
    // now get seconds and pad with zeros as necessary
    var secs = time % 100;
    time = Math.floor(time/100);

    // now get mins, add hours to time and pad with zeros if necessary
    if (secs > 59) {
        var mins = Math.floor(secs/60);
        secs = secs % 60;
        if (secs < 10) {
            secs = "0" + secs;
        }
        
        // return format including mins
        return mins + ":" + secs + "." + mills;
    } 
    
    // without mins
    return secs + "." + mills;
}

// if the user hits any of these keys, timer should stop
var timerStopKeys = ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', '[', ']', '\\', ';', "'", ',', '.', '/', ' '];

window.onload = function(){
    setTimeListHeight();
    // put up a new scramble
    document.getElementById("scramble").innerHTML = generateScramble();
    document.onkeypress = function(e){
        var key = e.key;//code(e);
        // do something with key
//        console.log(key == " ");
        if (key == " " && !timerStarted) {
            startTimer();
        } else if (timerStarted && timerStopKeys.includes(key)) {
            stopTimer();
        }
    };
};

