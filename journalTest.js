//get today's date mm/dd/yyyy
var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();
today = mm + '/' + dd + '/' + yyyy;

var rankField = document.getElementById("rank");
var moodField = document.getElementById("mood");
var entryField = document.getElementById("entry");

//something(loadEntryFromDate, "04/10/2021", false, "WKAMZ1wfhJNniutBhtzKkG0gdE03");
something(loadEntryFromDate, "04/10/2021", false);

function loadEntryFromDate(userId, date, isReadOnly) {
    if (date === today) {
        loadEntryIfExists(userId, -1, isReadOnly);
    } else {
        firebase.database().ref('users/' + userId + '/entries/').on('value', (snapshot) => {
            var data = snapshot.val();
            console.log(data);
            for (var key in data) {
                if (data[key].date === date) {
                    loadEntryIfExists(userId, key, isReadOnly);
                    return;
                }
            }
            console.log("date doesn't exist");
        });
    }
}

//load the corresponding entry, -1 for today's entry
function loadEntryIfExists(userId, entryNum, isReadOnly) {
    if (isReadOnly) {
        document.getElementById("form-field").disabled = true;
    }

    //load today's entry (or nothing if there's no entry for today)
    if (entryNum === -1) {
        var lastEntry = firebase.database().ref('users/' + userId + '/todayEntry');
        lastEntry.on('value', (snapshot) => {
            var data = snapshot.val();
            if (snapshot.exists() && data.date === today) {
                //there's an entry for today
                setFields(userId, data.entryNum);
            }
        });
    } else {
        //load the corresponding past day
        document.getElementById("form-field").disabled = true;
        setFields(userId, entryNum);
    }
}

//set fields of form with entry at entryNum
function setFields(userId, entryNum) {
    var entryRef = firebase.database().ref('users/' + userId + '/entries/' + entryNum);
    entryRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            rankField.value = data.rank;
            moodField.value = data.mood;
            entryField.value = data.entry;
        }
    });
}

function writeEntry(userId, num, dateData) {
    firebase.database().ref('users/' + userId + '/entries/').update({
        [num]: {
            date: dateData,
            rank: rankField.value,
            mood: moodField.value,
            entry: entryField.value
        }
    });
}

function writeTodaysEntry(userId) {
    var lastEntry = firebase.database().ref('users/' + userId + '/todayEntry');
    lastEntry.on('value', (snapshot) => {
        var data = snapshot.val();
        if (snapshot.exists() && data.date === today) {
            //an entry for today already exists
            writeEntry(userId, data.entryNum, today);
        } else {
            //create new entry for today
            //find next entry number
            var nextEntryNum = 1;
            if (snapshot.exists()) {
                nextEntryNum = snapshot.val().entryNum + 1;
            }
            //update today's entry
            firebase.database().ref('users/' + userId).update({
                todayEntry: {
                    date: today,
                    entryNum: nextEntryNum
                }
            });
            writeEntry(userId, nextEntryNum, today);
        }
    });
}

//save data in fields
function something(func, num, bool, userId) {
    if (userId != null) {
        func(userId, num, bool);
    } else {

        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                func(user.uid, num, bool);
            }
            else {
                console.log("error, user not logged in");
            }
        })
    }
}
