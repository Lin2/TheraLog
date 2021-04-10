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
            r1: "BA0b65sL48gO8EIK0VckwL7Ukcq1"
        }
    });*/
  }

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      writeUserData(user.uid);
    }
    else {
        console.log("error, user not logged in");
    }
  })