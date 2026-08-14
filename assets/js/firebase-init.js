// ============================================
// Mundo Braille - Firebase Init (compat SDK)
// Requiere cargar antes los scripts CDN:
//  firebase-app-compat.js
//  firebase-auth-compat.js
//  firebase-firestore-compat.js
// ============================================
window.FirebaseApp = (function() {
  var firebaseConfig = {
    apiKey: "AIzaSyBu0mBAoJgiBXEeH6Th5A7lbLA6TrmxOnc",
    authDomain: "mundo-digital-7ee28.firebaseapp.com",
    projectId: "mundo-digital-7ee28",
    storageBucket: "mundo-digital-7ee28.firebasestorage.app",
    messagingSenderId: "966209497008",
    appId: "1:966209497008:web:024906aa15c1f94e059875"
  };

  var app = firebase.initializeApp(firebaseConfig);

  return {
    app: app,
    auth: firebase.auth(app),
    db: firebase.firestore(app)
  };
})();
