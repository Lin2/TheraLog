//save data in fields
var uid;
function start(userId) {
    if (userId != null) {
        getDatesAndApply(userId, applyDates);
        uid = userId;
    } else {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                getDatesAndApply(user.uid, applyDates);
                uid = user.uid;
                console.log(user.uid);
            }
            else {
                console.log("error, user not logged in");
            }
        })
    }
}

var dates = []
function getDatesAndApply(userId, callback) {
    firebase.database().ref('users/' + userId + '/entries/').on('value', (snapshot) => {
        var data = snapshot.val();
        console.log(userId);
        var i = 1;
        while (true) {
            if (data.hasOwnProperty(String(i))) {
                dates.push(data[i].date);
                i++;
            } else {
                break;
            }
        }
        callback(userId);
    });
}

function applyDates(userId) {
    var table = document.getElementById("table-with-dates");
    
    for(const key in dates) {
        table.innerHTML += "<tr> <td class = \"table-button\" onclick = \"return goToEntry('" + [userId] + "', '" + dates[key] + "');\">Date: " + dates[key] + "</td> </tr>";
    }
}

function goToEntry(userId, date) {
    localStorage.setItem("id", userId);
    localStorage.setItem("date", date);
    console.log(userId);
    window.location.href = "journalTest.html";
}

function goToTodaysEntry() { 
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0');
    var yyyy = today.getFullYear();
    today = mm + '/' + dd + '/' + yyyy;
    goToEntry(uid, today);
}

window.onload = function () {
    start(localStorage.getItem("id"));
}