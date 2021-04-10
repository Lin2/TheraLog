var database = firebase.database();

function writeUserData(userId) {
    /*firebase.database().ref('users/' + userId).set({
        isPatient: true,
        entries: {
            e1: {
                rank: 5,
                moods: "nervous",
                entry: "dofijeijfoiajfoief"
            },
            e2: {
                rank: 3,
                moods: "happy",
                entry: "dqweiotnvoqin"
            }
        },
        relation: {
            r1: "Ri0I74dAeiSzv7Alb71SoUj4swI3"
        }
    });*/
  }

  function outputEntry(userId, entryNum) {
    var entryRef = firebase.database().ref('users/' + userId + '/entries/e' + entryNum);
    entryRef.on('value', (snapshot) => {
        if (snapshot.exists()) {
            const data = snapshot.val();
            document.body.innerHTML = data.date + ': ' + data.entry;
        }
    });
  }

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
        writeUserData(user.uid);
      outputEntry(user.uid, 1);
      console.log(user.displayName);
    }
    else {
        console.log("error, user not logged in");
    }
  })