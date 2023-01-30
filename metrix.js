async function getEventData(eventId){
    let url = "https://discgolfmetrix.com/api.php?content=result&id=" + eventId;
    const response = await fetch(url);
    const data = await response.json();
    return data
}

  function calculateScore(score, cName){
    let par;
    switch(cName) {
        case "RUFFEY":
            par = 56
            break;
        case "STONY":
            par = 57
            break;
        case "BALD":
            par = 58
            break;
        case "HEATHDALE":
            par = 55
            break;
        default:
            par = 54
    }
    let total = score - par;
    let totalStr = total > 0 ? "+" + total.toString() : total.toString()
    return totalStr
}

  function tableCreate(players, courseName) {
    tbl = document.createElement('table');
    tbl.style.width = '100px';
    tbl.style.border = '1px solid black';
    let thead = tbl.createTHead();
    let row = thead.insertRow();
    let th1 = document.createElement("th");
    let th2 = document.createElement("th");
    let th3 = document.createElement("th");
    let th4 = document.createElement("th");
    let text1 = document.createTextNode("Name");
    let text2 = document.createTextNode("Grade");
    let text3 = document.createTextNode("HC Score");
    let text4 = document.createTextNode("Score to Par");

    th1.appendChild(text1);
    th2.appendChild(text2);
    th3.appendChild(text3);
    th4.appendChild(text4);
    row.appendChild(th1);
    row.appendChild(th2);
    row.appendChild(th3);
    row.appendChild(th4);

    for (let p = 0; p < players.length; p++) {
        let change = (players[p].Change).toFixed(2)
        let tr = tbl.insertRow();
        
        let td1 = tr.insertCell();
        td1.appendChild(document.createTextNode(`${players[p].Name}`));

        let td2 = tr.insertCell();
        td2.appendChild(document.createTextNode(`${players[p].ClassName}`));
        
        let td3 = tr.insertCell();
        td3.appendChild(document.createTextNode(`${change}`));

        let td4 = tr.insertCell();
        td4.appendChild(document.createTextNode(`${calculateScore(players[p].Result, courseName)}`));
          
    }
    return tbl

}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function getIds(event) {
    ids = [];
    ids+=event.ID
    return ids
}

let parent = getEventData("2422116")
parent.then((json) => {
    let eventIds = json.Competition.Events.map(getIds)

    for (let i=0; i< eventIds.length; i++){
        let compArr = [];
        compArr[i] = getEventData(eventIds[i]);
    
        compArr[i].then((body) => {
            let compName = body.Competition.Name;
            let date = body.Competition.TourDateEnd;
            let course = body.Competition.CourseName.split(' ')[0].toUpperCase();
            
            let id = body.Competition.ID;
    
            let handicapPlayers = body.Competition.WeeklyHC
            let aplayers = []
            let bplayers = []
            let cplayers = []                                               
            if (handicapPlayers.length > 0){
                for(let j=0; j<handicapPlayers.length; j++){
                    if (handicapPlayers[j].ClassName === "Div A"){
                        aplayers.push(handicapPlayers[j])
                    } else if (handicapPlayers[j].ClassName === "Div B"){
                        bplayers.push(handicapPlayers[j])
                    } else if (handicapPlayers[j].ClassName ==="Div C"){
                        cplayers.push(handicapPlayers[j])
                    }
                }
            
            
                let newDiv = document.createElement("div");
                newDiv.style.border = "solid black"
                
                let resultDiv = document.getElementById('results');
                insertAfter(newDiv, resultDiv)
        
                let compHeader = document.createElement("h3")
                compHeader.innerHTML = compName
                newDiv.appendChild(compHeader)
        
                let dateHeader = document.createElement("h4")
                dateHeader.innerHTML = date
                insertAfter(dateHeader, compHeader)
    
                let urlHeader = document.createElement("a")
                urlHeader.innerHTML = "Full Results"
                urlHeader.href = "https://discgolfmetrix.com/" + id.toString()
                insertAfter(urlHeader,dateHeader)
        
                let aHeader = document.createElement("h4")
                aHeader.innerHTML = "A Grade Handicap Results"
                insertAfter(aHeader, urlHeader)
        
                let bHeader = document.createElement("h4")
                bHeader.innerHTML = "B Grade Handicap Results"
                insertAfter(bHeader, aHeader)
        
                let cHeader = document.createElement("h4")
                cHeader.innerHTML = "C Grade Handicap Results"
                insertAfter(cHeader, bHeader)
                
                let aTable = tableCreate(aplayers, course);
                let bTable = tableCreate(bplayers, course);
                let cTable = tableCreate(cplayers, course);
        
                cHeader.appendChild(cTable);
                aHeader.appendChild(aTable);
                bHeader.appendChild(bTable);
            
            }
        });
    }
})
