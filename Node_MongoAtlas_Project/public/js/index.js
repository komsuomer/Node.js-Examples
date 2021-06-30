console.log("This is coming from script.js");

var dateStart = document.getElementsByName('dateStart')[0];
var dateEnd = document.getElementsByName('dateEnd')[0];


function updateDateStart(e){
    dateEnd.setAttribute('min',e.target.value);
}

function updateDateEnd(e){
    dateStart.setAttribute('max',e.target.value);
}