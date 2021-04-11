//testing functions for main therapist
function getPatients() {
    var entryRef = firebase.database().ref('users/');
    entryRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        for (var key in data) {
          if (data[key].hasOwnProperty("isPatient") && data[key].isPatient === true) {
            console.log(data[key].name);
          }
        }
      }
    });
  }
  
  function setName(userId, nameData) {
    firebase.database().ref('users/' + userId).update({
      name: nameData
    });
  }
  
  function start() {
  var database = firebase.database();
  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setName(user.uid, user.displayName);
      firebase.database().ref('users/' + user.uid).on('value', (snapshot) =>{
        const data = snapshot.val();
        if (!data.hasOwnProperty("isPatient") || data.isPatient) {
          window.location.href = "main.html";
        } else {
            //unhide webpage
        }
      });
    }
    else {
      console.log("error, user not logged in");
    }
  })
}

start();