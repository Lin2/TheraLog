function something() {
    var database = firebase.database();

    function writeTodaysEntry(userId) {
        //get today's date mm/dd/yyyy
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0');
        var yyyy = today.getFullYear();
        today = mm + '/' + dd + '/' + yyyy;

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

    function writeEntry(userId, num, dateData) {
        var rankData = document.getElementById("rank").value;
        var moodData = document.getElementById("mood").value;
        var entryData = document.getElementById("entry").value;

        firebase.database().ref('users/' + userId + '/entries/').update({
            [num]:{
                date: dateData,
                rank: rankData,
                mood: moodData,
                entry: entryData
            }
        });
    }

    function outputEntry(userId, entryNum) {
        var entryRef = firebase.database().ref('users/' + userId + '/entries/' + entryNum);
        entryRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                document.body.innerHTML = data.date + ': ' + data.entry;
            }
        });
    }

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            writeTodaysEntry(user.uid);
        }
        else {
            console.log("error, user not logged in");
        }
    })
}