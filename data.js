/* Script to keep track of previous solve times; here we define a class to store previous times and allow for easy deletion, manipulation and usage. */

var index = 0; // keep track of how many results have been logged so far

var resultList = [];

class Result {
    
    constructor(time, scramble) {
        /* PARAMS:
        - time: length of solve in seconds
        - scramble (optional): string containing scramble pattern for this solve.
        */
        this.time = time;
        console.log("constructor!");
        console.log(scramble);
        this.scramble = scramble;
        this.index = index;
        index += 1;
        resultList.push(this);
        
    }
    
    repr() {
        // return a table row element to allow this element to be shown in a table of solve times
        
        // create the row object
        var newRow = document.createElement("tr");
        
        // create the cell to display this solve's index
        var indexEntry = document.createElement("th");
        var indexNum = document.createTextNode(this.index);
        indexEntry.appendChild(indexNum);
        indexEntry.setAttribute("class", "tg-0lax");

        // create the cell to display this solve's time
        var timeEntry = document.createElement("th");
        var timeVal = document.createTextNode(this.time);
        timeEntry.appendChild(timeVal);
        timeEntry.setAttribute("class", "tg-0lax");
        newRow.appendChild(indexEntry);
        newRow.appendChild(timeEntry);
        newRow.addEventListener('click', function(e) {
            var row = e.currentTarget;
            console.log(e.currentTarget.firstChild.innerHTML); 
            /* remove this element from resultList and then force an update to the displayed table, to reenumerate elements */ 
            // find index from table row value
            var ind = row.firstChild.innerHTML;
            resultList[ind].onclick(row);
            
            displayTimesTable(resultList);
            
            // TODO: Update the averages, best solve, etc
            
            // remove the element itself from the DOM tree
            
        }, false);
        
        return newRow;
        
        
    }
    
    onclick(row) {
        /* Open a popup window displaying the scramble and time. Display an exit button and a delete button. If delete is clicked, delete this time. Row parameter contains the table row corresponding to this Result; if user decides to delete the Result, we will also need to delete the row.
        */
        
        // but for now we're just gonna delete the time
        
        var dispText;
        if (this.scramble) {
            dispText = this.time + "\n" + this.scramble + "\n Press OK to keep this time, or press cancel to delete it.";
        } else {
            dispText = this.time + "\n Press OK to keep this time, or press cancel to delete it.";
        }
        
        if (!confirm(dispText)) {
            console.log("cool!");
            resultList.splice(this.ind, 1);
            row.remove(); // remove from DOM tree
        }
        
        
        
        
    }
    
    setIndex(i) {
        /* Set this result's index to a new value (most likely in case of deletion of times) */
        this.index = i;
    }
}

function generateTable(results) {
    /* Takes in a list of Result objects (in ascending order by index) and generates a Table element with the solve times */
    
    // going to start at front of list and keep adding subsequent times to front of DOM node to end up with most recent solves at the top of the table. after adding all the nodes, we will append <colgroup> element at the front.
    
    var table = document.createElement("table");
    table.setAttribute("class", "tg");
    table.setAttribute("style", "undefined;table-layout: fixed; width: 75px");
    
    // first, adding all the results as rows in the table. re-enumerate the rows as we go; in case there were deletions
    for (var i=0; i < results.length; i++) {
        var res = results[i];
        res.setIndex(i);
        var row = res.repr();
        table.insertBefore(row, table.firstChild);
    }
    
    // now, add the colgroup element
    var colgroup = document.createElement("colgroup");
    var col1 = document.createElement("col");
    col1.setAttribute("style", "width:25px");
    colgroup.appendChild(col1);
    var col2 = document.createElement("col");
    col2.setAttribute("style", "width:50px");
    colgroup.appendChild(col2);
    table.insertBefore(colgroup, table.firstChild);
    
    return table;
    
}

function displayTimesTable(results) {
    /* Generate a table to display the list of results, and set it as the child of the appropriate timesList element in index.html
    */
    
    var table = generateTable(results);
    // remove whatever is already stored under timesList, in case we already had a table there
    var timesList = document.getElementById("timesList");
    timesList.innerHTML = '';
    document.getElementById("timesList").appendChild(table);
}

function mo3() {
    // return the mean of the middle 3 solves out of the last 5 (drop the fastest and slowest time)
    var lastFive = resultList.slice(-5).map(function(x){return x.time;});
    var top = Math.max.apply(null, lastFive);
    var bottom = Math.min.apply(null, lastFive);
    
    // remove the top and bottom elements
    lastFive.splice(lastFive.indexOf(top), 1 );
    lastFive.splice(lastFive.indexOf(bottom), 1 );
    
    // average the new list
    return average(lastFive);
}

function aoN(N) {
    /* Return the aoN (average of N times) */
    var lastN = resultList.slice(-1*N).map(function(x){return x.time;});
    return average(lastN);
}

function average(vals) {
    /* compute the average of a list of values */
    var total = 0;
    for (var i = 0; i < vals.length; i++) {
        total += vals[i];
    }
    
    return total / vals.length;
}

function updateAvg(N) {
    // update the aoN or mo3 row in the averages table
    if (N == 3) {
        var avg = mo3();
        var tag = "mo3";
    } else {
        var avg = aoN(N);
        var tag = "ao" + N;
    }
    // convert avg to string and truncate it to 3 decimal places
    console.log("'" + avg);
    avg = "" + avg;
//    console.log(avg);
    avg = avg.slice(0, 5);
    console.log(avg);
    document.getElementById(tag).innerHTML = avg;
}

function addTime(time, scramble) {
    new Result(time, scramble);
    
    if (getComputedStyle(document.getElementById("timesList"), null).height == "0px") {
        // not yet been set; set the height of the element before pushing new time onto the list display
        setTimeListHeight();
    }
    
    // update the table being displayed
    displayTimesTable(resultList);
    
    // also update averages
    updateAvg(3);
    updateAvg(5);
    updateAvg(12);
    updateAvg(100);
}