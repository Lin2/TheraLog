var app_fireBase = {};
(function() {

  var firebaseConfig = {
    apiKey: "AIzaSyA7T7u3QPWi5uUXWT5Z976iEwGd2vA6yCE",
    authDomain: "theralog-4e128.firebaseapp.com",
    databaseURL: "https://theralog-4e128-default-rtdb.firebaseio.com",
    projectId: "theralog-4e128",
    storageBucket: "theralog-4e128.appspot.com",
    messagingSenderId: "744919907625",
    appId: "1:744919907625:web:6079366aec650a0bce0b38"
  };
  firebase.initializeApp(firebaseConfig);
  
  app_fireBase = firebase;
})()