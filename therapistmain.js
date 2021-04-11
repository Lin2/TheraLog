//testing functions for main therapist
var names = [];
var uid = [];
function getPatients(callback) {
    var entryRef = firebase.database().ref('users/');
    entryRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            for (var key in data) {
                if (data[key].hasOwnProperty("isPatient") && data[key].isPatient === true) {
                    names.push(data[key].name);
                    uid.push(key);
                }
            }
        }
        callback();
    });
}

function setName(userId, nameData) {
    firebase.database().ref('users/' + userId).update({
        name: nameData
    });
}

function start() {
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            setName(user.uid, user.displayName);
            firebase.database().ref('users/' + user.uid).on('value', (snapshot) => {
                const data = snapshot.val();
                if (!data.hasOwnProperty("isPatient") || data.isPatient) {
                    localStorage.clear();
                    localStorage.setItem("isTherapist", "false");
                    window.location.href = "main.html";
                } else {
                    getPatients(setTable);
                    document.getElementById("temp-hidden").style.visibility = "inherit";
                    document.getElementById("temp-hidden").style.visibility = "visible";
                }
            });
        }
        else {
            console.log("error, user not logged in");
        }
    })
}

function setTable() {
    var table = document.getElementById("table-with-names");
    console.log(uid);
    
    for(const key in names) {
        table.innerHTML += "<tr> <td class = \"table-item\">" + names[key]+ "</td> <td class = \"table-button\" onclick=\"return goToMainPage('"+uid[key]+"');\">View Log</td> <td class = \"table-button\">Call</td> </tr>"
    }
}

function goToMainPage(id) {
    localStorage.setItem("id",id);
    localStorage.setItem("isTherapist", "true");
    window.location.href = "main.html";
}

start();