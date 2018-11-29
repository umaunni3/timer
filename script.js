function toggleDropDown() {
    // either hide or display the dropdown menu
    var menu = document.getElementById("dropdown-content");
    if (menu.style.display == "none") {
        // unhide it
        menu.style.display = "block";
    } else {
        menu.style.display = "none";
    }
}


/* possible optimizations!
    - caching total for averages so that after each solve we just have to subtract the oldest time and add the newest time and divide by (5, 12, 100)
     (would require recomputing after deletion of value, but would still save time overall in terms of amortized performance)
     
*/


var timesList = [];
var numSolves = 0;

function addTime(time) {
    // add this time to the list of recorded times
    timesList.push(parseFloat(time));
    
    if (getComputedStyle(document.getElementById("timesList"), null).height == "0px") {
        // not yet been set; set the height of the element before pushing new time onto the list display
        setTimeListHeight();
    }
    appendTimeHTML(time);
    numSolves += 1;
    
    // also update averages
    updateAvg(3);
    updateAvg(5);
    updateAvg(12);
    updateAvg(100);
    
}

function deleteTime(index) {
    // delete the value at the specified index (if that index exists in the list)
    
    timesList.splice(index, 1);
    
    // also remove from displayed list
    var times = document.getElementById("timesList").childNodes;
    for (var i = 0; i < times.length; i++) {
        if (i == 1) {
            console.log("!!! " + typeof times[i].children);
            for (var j = 0; j < times[i].children.length; j++) {
                console.log(times[i].children[j]);
            }
        }
        console.log(times[i]);
    }
    var tableRows = times[1].children;
    // we have to reverse the index because the newest values (with highest indeces) are at smallest positions in list; if there are N solves in the list so far, then tableRows[0] is the Nth solve, tableRows[1] is the N-1st solve, and so on. To delete the Kth solve, delete the (N-K)th index.
    var rowToDelete = tableRows[timesList.length - index + 1];
   times[1].removeChild(rowToDelete);
    
    // re-enumerate the times starting from where we deleted
    console.log("88888");
    for (var i = timesList.length - index + 1; i >= 0; i--) {
        // shift all the numbers down by 1
        var rowIndex = tableRows[i];
        console.log(rowIndex);
        rowIndex.innerHTML = parseInt(rowIndex.innerHTML) - 1;
    }
}

function updateAvg(N) {
    // update the aoN row in the averages table
    if (N == 3) {
        var avg = mo3();
        var tag = "mo3";
    } else {
        var avg = aoN(N);
        var tag = "ao" + N;
    }
    document.getElementById(tag).innerHTML = avg;
}

function aoN(N) {
    // return the average over the last N solves
    if (N > timesList.length) {
        return "--";
    }
    var lastN = timesList.slice(-1*N);
    console.log(N, average(lastN));
    return average(lastN);
    
}

function mo3() {
    // return the mean of the middle 3 solves out of the last 5 (drop the fastest and slowest time)
    var lastFive = timesList.slice(-5);
    var top = Math.max.apply(null, lastFive);
    var bottom = Math.min.apply(null, lastFive);
    
    // remove the top and bottom elements
    lastFive.splice(lastFive.indexOf(top), 1 );
    lastFive.splice(lastFive.indexOf(bottom), 1 );
    
    // average the new list
    return average(lastFive);
}

function appendTimeHTML(time) {
    // append a time to the list being displayed onscreen
    var tab = document.getElementById("timesListTable");
    var newRow = document.createElement("tr");
    var indexEntry = document.createElement("th");
    var indexNum = document.createTextNode(timesList.length);
    indexEntry.appendChild(indexNum);
    indexEntry.setAttribute("class", "tg-0lax");

    // truncate the time to fit in the box neatly
    var timeEntry = document.createElement("th");
    var timeVal = document.createTextNode(time);
    timeEntry.appendChild(timeVal);
    timeEntry.setAttribute("class", "tg-0lax");
    newRow.appendChild(indexEntry);
    newRow.appendChild(timeEntry);
    tab.insertBefore(newRow, tab.childNodes.item(0));
}

function average(arr) {
    // return the average of an input array
    if (arr.length == 0) {
        return 0;
    }
    
    var total = 0;
    for (var i = 0; i < arr.length; i++) {
        total += arr[i];
    }
    return total/arr.length;
}

function setTimeListHeight() {
    // compute and set appropriate height for times list box according to page size and set it
    var height = document.documentElement.scrollHeight;
    var topPos = getComputedStyle(document.getElementById("timesList"), null).top;
//    console.log(height);
    
    topPos = parseInt(topPos.slice(0, topPos.length-2));
    var newHeight = (height - topPos - 0.01*height)+ "px";
    document.getElementById("timesList").style.height = newHeight;
}