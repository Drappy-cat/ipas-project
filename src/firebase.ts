import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "proker-kkn-ipas",
  appId: "1:536301999351:web:5715d3576524f13283aff2",
  databaseURL: "https://proker-kkn-ipas-default-rtdb.asia-southeast1.firebasedatabase.app",
  storageBucket: "proker-kkn-ipas.firebasestorage.app",
  apiKey: "AIzaSyCUcDviGZGPhe3h68cXTxhN9qzJahVK2hU",
  authDomain: "proker-kkn-ipas.firebaseapp.com",
  messagingSenderId: "536301999351"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
  localCache: persistentLocalCache({ tabManager: persistentMultipleTabManager() })
});
