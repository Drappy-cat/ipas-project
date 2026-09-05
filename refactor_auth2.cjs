const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf-8');

// 1. Add imports
content = content.replace(
  /import \{ signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail \} from 'firebase\/auth';/,
  `import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';`
);

// 2. Add authMode state
content = content.replace(
  /const \[screen, setScreens\] = useState<Screen>\('splash'\);/,
  `const [screen, setScreens] = useState<Screen>('splash');\n  const [authMode, setAuthMode] = useState<'login'|'register'>('login');`
);

// We need to modify handleLogin (Guru) and handleLoginSiswa (Siswa).
const loginGuruStart = "  if (screen === 'loginGuru') {";
const loginGuruEnd = "  // ── 1x. LUPA PASSWORD ───────────────────────────────────────────────────────";

let guruBlock = content.substring(content.indexOf(loginGuruStart), content.indexOf(loginGuruEnd));

const newGuruBlock = `  if (screen === 'loginGuru') {
    const handleGoogleLogin = async () => {
      try {
        setLoginError('');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        setScreens(['teacherDash']);
      } catch (error: any) {
        setLoginError('Google Login gagal: ' + error.message);
      }
    };

    const handleLogin = async () => {
      if (!loginUser || !loginPass) {
        setLoginError('Email dan password harus diisi.');
        return;
      }
      if (captchaInput !== (captcha.n1 + captcha.n2).toString()) {
        setLoginError('Captcha salah. Silakan hitung kembali.');
        return;
      }

      setLoginError('');
      try {
        if (authMode === 'register') {
          await createUserWithEmailAndPassword(auth, loginUser, loginPass);
          await updateProfile(auth.currentUser!, { displayName: 'Guru' });
          setScreens(['teacherDash']);
        } else {
          await signInWithEmailAndPassword(auth, loginUser, loginPass);
          setScreens(['teacherDash']);
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setLoginError('Email ini sudah terdaftar. Silakan masuk (Login).');
        } else if (error.code === 'auth/invalid-credential') {
          setLoginError('Email atau password salah.');
        } else {
          setLoginError('Terjadi kesalahan: ' + error.message);
        }
      }
    };

    return (
      <div className="h-full bg-sky-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs font-semibold tracking-wider">Akses Khusus</p>
              <p className="text-white font-display text-xl flex items-center gap-2">{authMode === 'login' ? 'Login' : 'Daftar'} Guru <School className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
               <span className="text-5xl"> <Lock className="w-5 h-5" /> </span>
            </div>

            <h2 className="font-display text-2xl text-gray-800 mb-6 text-center mt-10">{authMode === 'login' ? 'Masuk Dashboard' : 'Buat Akun Guru'}</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2 border border-red-100">
                <span className="text-lg"> <AlertTriangle className="w-5 h-5" /> </span> {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <Mail className="w-5 h-5" /> </span>
                  <input type="email" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-gray-700" placeholder="Masukkan email..." />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Password (Min 6 karakter)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <Key className="w-5 h-5" /> </span>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-gray-700" placeholder="••••••••" />
                </div>
                {authMode === 'login' && (
                  <div className="text-right mt-2">
                    <button type="button" onClick={() => navigate('forgotPassword')} className="text-sm font-bold text-sky-600 hover:text-sky-700">Lupa password?</button>
                  </div>
                )}
              </div>
              
              <div className="pt-2">
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Verifikasi Keamanan (CAPTCHA)</label>
                <div className="flex items-center gap-3">
                  <div className="bg-gradient-to-r from-sky-100 to-indigo-100 text-indigo-700 font-black text-lg px-4 py-3 rounded-xl border border-indigo-200 shadow-inner flex-shrink-0 flex items-center gap-2">
                    <span>{captcha.n1}</span>
                    <span className="text-indigo-400">+</span>
                    <span>{captcha.n2}</span>
                    <span className="text-indigo-400">=</span>
                  </div>
                  <input type="number" value={captchaInput} onChange={e => setCaptchaInput(e.target.value)}
                    className="w-24 bg-white border-2 border-indigo-100 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-black text-indigo-700 text-center" placeholder="?" />
                  <button type="button" onClick={() => setCaptcha({ n1: Math.floor(Math.random() * 10) + 1, n2: Math.floor(Math.random() * 10) + 1 })}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-sky-50 hover:text-sky-600 active:scale-95 transition-all">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-4 rounded-xl font-bold mt-6 shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
            </button>
            
            <div className="flex items-center gap-4 my-5 opacity-60">
              <div className="h-px bg-gray-400 flex-1"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATAU</span>
              <div className="h-px bg-gray-400 flex-1"></div>
            </div>

            <button onClick={handleGoogleLogin} className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold mb-5 shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Lanjutkan dengan Google
            </button>

            <div className="text-center text-sm font-semibold text-gray-500">
              {authMode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setLoginError(''); }} className="text-sky-600 hover:text-sky-700 underline underline-offset-2">
                {authMode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

content = content.replace(guruBlock, newGuruBlock);

// Now handleLoginSiswa (Siswa)
const loginSiswaStart = "  if (screen === 'loginSiswa') {";
const loginSiswaEnd = "  // ── 2. TEACHER DASHBOARD ───────────────────────────────────────────────────"; 

let siswaBlock = content.substring(content.indexOf(loginSiswaStart), content.indexOf(loginSiswaEnd));

const newSiswaBlock = `  if (screen === 'loginSiswa') {
    const handleGoogleLoginSiswa = async () => {
      try {
        setLoginError('');
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        setScreens(['studentHome']);
        setActiveTab('home');
      } catch (error: any) {
        setLoginError('Google Login gagal: ' + error.message);
      }
    };

    const handleLoginSiswa = async () => {
      if (!loginUser || !loginPass) {
        setLoginError('Email dan password harus diisi.');
        return;
      }
      
      setLoginError('');
      // Kita asumsikan format email otomatis untuk siswa jika tidak ada @
      const email = loginUser.includes('@') ? loginUser : loginUser.split(' ').join('').toLowerCase() + '@siswa.sekolah.com';
      
      try {
        if (authMode === 'register') {
          await createUserWithEmailAndPassword(auth, email, loginPass);
          await updateProfile(auth.currentUser!, { displayName: loginUser.split('@')[0] });
          setScreens(['studentHome']);
          setActiveTab('home');
        } else {
          await signInWithEmailAndPassword(auth, email, loginPass);
          setScreens(['studentHome']);
          setActiveTab('home');
        }
      } catch (error: any) {
        if (error.code === 'auth/email-already-in-use') {
          setLoginError('Akun sudah terdaftar. Silakan masuk (Login).');
        } else if (error.code === 'auth/invalid-credential') {
          setLoginError('Email atau password salah! Jika lupa, minta tolong Guru ya.');
        } else if (error.code === 'auth/invalid-email') {
          setLoginError('Format email tidak valid.');
        } else {
          setLoginError('Terjadi kesalahan: ' + error.message);
        }
      }
    };

    return (
      <div className="h-full bg-emerald-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-emerald-100 text-xs font-semibold tracking-wider">Akses Belajar</p>
              <p className="text-white font-display text-xl flex items-center gap-2">{authMode === 'login' ? 'Login' : 'Daftar'} Siswa <GraduationCap className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            <h2 className="font-display text-2xl text-gray-800 mb-6 text-center mt-2">{authMode === 'login' ? 'Mulai Belajar' : 'Buat Akun Siswa'}</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2 border border-red-100">
                <span className="text-lg"><AlertTriangle className="w-5 h-5"/></span> {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Username / Email Siswa</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <User className="w-5 h-5" /> </span>
                  <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="budi atau budi@siswa.sekolah.com" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Password (Min 6)</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <Key className="w-5 h-5" /> </span>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button onClick={handleLoginSiswa} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold mt-6 shadow-lg shadow-emerald-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              {authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Sekarang'}
            </button>

            <div className="flex items-center gap-4 my-5 opacity-60">
              <div className="h-px bg-gray-400 flex-1"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">ATAU</span>
              <div className="h-px bg-gray-400 flex-1"></div>
            </div>

            <button onClick={handleGoogleLoginSiswa} className="w-full bg-white border border-gray-200 text-gray-700 py-3.5 rounded-xl font-bold mb-5 shadow-sm hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-3">
              <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Lanjutkan dengan Google
            </button>

            <div className="text-center text-sm font-semibold text-gray-500">
              {authMode === 'login' ? 'Belum punya akun? ' : 'Sudah punya akun? '}
              <button onClick={() => { setAuthMode(authMode === 'login' ? 'register' : 'login'); setLoginError(''); }} className="text-emerald-600 hover:text-emerald-700 underline underline-offset-2">
                {authMode === 'login' ? 'Daftar di sini' : 'Masuk di sini'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
`;

content = content.replace(siswaBlock, newSiswaBlock);

fs.writeFileSync('src/App.tsx', content);
console.log('Successfully refactored auth flow');
