import { useState, useEffect, useRef } from 'react';

// ─── Types ─────────────────────────────────────────────────────────────────
type Screen =
  | 'homepage' | 'splash' | 'onboarding'
  | 'roleSelect' | 'loginGuru'
  | 'teacherDash' | 'uploadMateri' | 'buatInteraktif' | 'progressSiswa' | 'kelolaBab' | 'pengaturanGuru'
  | 'studentHome' | 'daftarBab' | 'detailBab'
  | 'bacaMateri' | 'mediaHub'
  | 'dragDrop' | 'flipCards' | 'virtualEksperimen' | 'simulasiAir'
  | 'quiz' | 'hasilKuis' | 'proyekP5' | 'arena';

// ─── Kurikulum Merdeka · IPAS Kelas 4 ──────────────────────────────────────
const BAB_LIST = [
  {
    id: 1, emoji: '🌿',
    judul: 'Tumbuhan, Sumber Kehidupan di Bumi',
    gradient: 'from-green-500 to-emerald-600',
    cp: 'Peserta didik mendeskripsikan bagian tumbuhan dan fungsinya serta proses fotosintesis.',
    topics: ['Bagian-bagian Tumbuhan', 'Proses Fotosintesis', 'Manfaat Tumbuhan bagi Kehidupan', 'Perkembangbiakan Tumbuhan'],
    done: 2, total: 4, progress: 50,
    materi: [
      { type: 'pdf', icon: '📄', title: 'Rangkuman Bab 1 — Tumbuhan', uploader: 'Bu Sari', tanggal: '2 hari lalu' },
    ],
    interaktif: [
      { type: 'matching', icon: '🧩', title: 'Cocokkan Bagian Tumbuhan & Fungsinya', screen: 'dragDrop' as Screen },
      { type: 'simulasi', icon: '🔬', title: 'Simulasi Siklus Air', screen: 'simulasiAir' as Screen },
    ],
  },
  {
    id: 2, emoji: '🧪',
    judul: 'Wujud Zat dan Perubahannya',
    gradient: 'from-blue-500 to-cyan-600',
    cp: 'Peserta didik mengelompokkan wujud zat dan mendeskripsikan perubahan wujud dalam kehidupan.',
    topics: ['Wujud Padat, Cair, Gas', 'Perubahan Wujud Zat', 'Perubahan Fisika & Kimia'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [
      { type: 'flipcard', icon: '🃏', title: 'Kartu Konsep Wujud Zat', screen: 'flipCards' as Screen },
    ],
  },
  {
    id: 3, emoji: '⚡',
    judul: 'Gaya di Sekitar Kita',
    gradient: 'from-violet-500 to-purple-600',
    cp: 'Peserta didik menjelaskan jenis-jenis gaya dan pengaruhnya terhadap benda.',
    topics: ['Pengertian Gaya', 'Gaya Magnet & Gravitasi', 'Gaya Gesek', 'Pengaruh Gaya'],
    done: 0, total: 4, progress: 0,
    materi: [],
    interaktif: [
      { type: 'eksperimen', icon: '🔭', title: 'Percobaan Virtual: Sifat Magnet', screen: 'virtualEksperimen' as Screen },
    ],
  },
  {
    id: 4, emoji: '🔋',
    judul: 'Mengubah Bentuk Energi',
    gradient: 'from-amber-500 to-orange-500',
    cp: 'Peserta didik mengidentifikasi sumber energi dan menjelaskan perubahan bentuk energi.',
    topics: ['Sumber Energi Terbarukan', 'Bentuk-bentuk Energi', 'Perubahan Energi'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [],
  },
  {
    id: 5, emoji: '🏡',
    judul: 'Cerita tentang Daerahku',
    gradient: 'from-rose-500 to-pink-600',
    cp: 'Peserta didik mengenal dan menghargai keunikan daerah tempat tinggalnya.',
    topics: ['Sejarah Daerah', 'Keunikan Budaya', 'Keunggulan Daerah'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [],
  },
  {
    id: 6, emoji: '🏝️',
    judul: 'Indonesiaku Kaya Raya',
    gradient: 'from-red-500 to-orange-600',
    cp: 'Peserta didik mengidentifikasi keragaman SDA Indonesia dan pentingnya menjaga kelestariannya.',
    topics: ['Keragaman Alam Indonesia', 'Sumber Daya Alam', 'Menjaga Kelestarian SDA'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [],
  },
  {
    id: 7, emoji: '🛒',
    judul: 'Bagaimana Mendapatkan Keperluan?',
    gradient: 'from-teal-500 to-cyan-600',
    cp: 'Peserta didik memahami kebutuhan, keinginan, dan kegiatan ekonomi sederhana.',
    topics: ['Kebutuhan vs Keinginan', 'Cara Pemenuhan Kebutuhan', 'Kegiatan Ekonomi'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [],
  },
  {
    id: 8, emoji: '🌍',
    judul: 'Memelihara Ekosistem',
    gradient: 'from-lime-600 to-green-700',
    cp: 'Peserta didik mendeskripsikan ekosistem dan rantai makanan serta upaya pelestariannya.',
    topics: ['Komponen Ekosistem', 'Rantai Makanan & Jaring Makanan', 'Peran Manusia dalam Ekosistem'],
    done: 0, total: 3, progress: 0,
    materi: [],
    interaktif: [],
  },
];

const MEDIA_TEMPLATES = [
  { id: 'matching', icon: '🧩', name: 'Pasang-Pasangkan', desc: 'Siswa mencocokkan konsep dengan definisi / fungsinya', color: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'flipcard', icon: '🃏', name: 'Kartu Konsep', desc: 'Kartu balik dua sisi untuk menghafal istilah & penjelasan', color: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'quiz', icon: '📝', name: 'Kuis Interaktif', desc: 'Buat soal pilihan ganda dengan feedback otomatis dan XP', color: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { id: 'simulasi', icon: '🔬', name: 'Simulasi Virtual', desc: 'Animasi proses sains step-by-step yang interaktif', color: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  { id: 'observasi', icon: '🔭', name: 'Lembar Observasi', desc: 'Panduan pengamatan digital terpandu untuk siswa', color: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
];

// Drag-drop data — Bab 1: Bagian Tumbuhan
const PLANT_LEFT = ['🌱 Akar', '🌿 Batang', '🍃 Daun', '🌸 Bunga'];
const PLANT_RIGHT = [
  'Mengangkut air & nutrisi ke seluruh tubuh',  // → Batang (idx 1)
  'Menyerap air & mineral dari dalam tanah',    // → Akar (idx 0)
  'Alat perkembangbiakan tumbuhan',             // → Bunga (idx 3)
  'Tempat berlangsungnya fotosintesis',         // → Daun (idx 2)
];
// CORRECT_MATCH[leftIdx] = rightIdx
const CORRECT_MATCH: Record<number, number> = { 0: 1, 1: 0, 2: 3, 3: 2 };

// Flip cards — Bab 2: Wujud Zat
const FLIP_CARDS = [
  { front: 'Padat', back: 'Bentuk & volume tetap. Partikel tersusun sangat rapat. Contoh: batu, kayu, es batu.' },
  { front: 'Cair', back: 'Volume tetap, bentuk mengikuti wadahnya. Contoh: air, minyak, susu.' },
  { front: 'Gas', back: 'Tidak punya bentuk & volume tetap — mengisi seluruh ruang. Contoh: udara, uap air.' },
  { front: 'Membeku', back: 'Perubahan cair → padat saat suhu turun. Contoh: air menjadi es di freezer.' },
  { front: 'Mencair', back: 'Perubahan padat → cair saat suhu naik. Contoh: es cream di panas matahari.' },
  { front: 'Menguap', back: 'Perubahan cair → gas saat dipanaskan. Contoh: air mendidih menjadi uap.' },
];

// Virtual experiment — Bab 3: Sifat Magnet
const EXP_STEPS = [
  { step: 1, icon: '🔧', title: 'Siapkan Alat & Bahan', body: 'Siapkan: 1 magnet batang, klip kertas (besi), koin logam, pensil kayu, penggaris plastik, dan paku kecil.', tip: '⚠️ Mintalah bantuan guru ketika menggunakan benda tajam.' },
  { step: 2, icon: '🤔', title: 'Buat Prediksi', body: 'Sebelum mencoba, prediksi: benda mana yang akan ditarik magnet? Tulis perkiraanmu di buku catatan!', tip: '💡 Pikirkan: dari bahan apa setiap benda dibuat?' },
  { step: 3, icon: '🧲', title: 'Lakukan Percobaan', body: 'Dekatkan magnet satu per satu ke setiap benda. Amati apakah benda tertarik atau tidak tertarik oleh magnet.', tip: '📋 Catat hasil: Tertarik (✓) atau Tidak Tertarik (✗)' },
  { step: 4, icon: '📊', title: 'Catat Hasil', body: 'Klip kertas ✓ | Koin (tembaga) ✗ | Pensil (kayu) ✗ | Penggaris (plastik) ✗ | Paku besi ✓', tip: '🔍 Mengapa koin tidak tertarik padahal terbuat dari logam?' },
  { step: 5, icon: '🎯', title: 'Simpulkan!', body: 'Magnet hanya menarik benda yang mengandung besi atau baja (bahan feromagnetik). Tidak semua logam bersifat magnetis!', tip: '🌟 Kamu sudah menjadi ilmuwan cilik! Luar biasa!' },
];

// Simulasi siklus air
const SIM_STEPS = [
  { label: 'Evaporasi', icon: '☀️', color: 'text-amber-500', desc: 'Panas matahari memanaskan permukaan air laut, danau, dan sungai. Air berubah menjadi uap air dan naik ke atmosfer.' },
  { label: 'Kondensasi', icon: '☁️', color: 'text-blue-400', desc: 'Uap air yang naik ke atmosfer mendingin dan berubah menjadi titik-titik air kecil yang membentuk awan.' },
  { label: 'Presipitasi', icon: '🌧️', color: 'text-sky-600', desc: 'Ketika awan sudah jenuh, air jatuh ke bumi sebagai hujan, salju, atau hujan es.' },
  { label: 'Infiltrasi & Aliran', icon: '🏞️', color: 'text-emerald-600', desc: 'Air hujan meresap ke tanah (infiltrasi) atau mengalir melalui sungai kembali ke laut, lalu siklus berulang.' },
];

// IPAS Kuis (lintas bab)
const QUIZ_IPAS = [
  { q: 'Bagian tumbuhan yang berfungsi menyerap air dan mineral dari dalam tanah adalah...', opts: ['Daun', 'Batang', 'Akar', 'Bunga'], correct: 2, img: '🌱' },
  { q: 'Proses pembuatan makanan pada tumbuhan dengan bantuan cahaya matahari disebut...', opts: ['Respirasi', 'Fotosintesis', 'Transpirasi', 'Pollinasi'], correct: 1, img: '☀️' },
  { q: 'Perubahan wujud zat dari cair menjadi gas disebut...', opts: ['Membeku', 'Mencair', 'Mengembun', 'Menguap'], correct: 3, img: '💧' },
  { q: 'Magnet dapat menarik benda yang terbuat dari...', opts: ['Plastik', 'Kayu', 'Besi/Baja', 'Karet'], correct: 2, img: '🧲' },
  { q: 'Manakah yang termasuk sumber energi terbarukan?', opts: ['Minyak bumi', 'Batu bara', 'Gas alam', 'Sinar matahari'], correct: 3, img: '🔋' },
];

// SAINS SPRINT — arena adu-cepat pernyataan Benar/Salah (lintas bab IPAS)
const ARENA_STATEMENTS = [
  { s: 'Akar berfungsi menyerap air dan mineral dari dalam tanah.', benar: true, bab: 'Tumbuhan', emoji: '🌱' },
  { s: 'Fotosintesis dapat berlangsung di malam hari tanpa cahaya matahari.', benar: false, bab: 'Tumbuhan', emoji: '☀️' },
  { s: 'Perubahan wujud dari cair menjadi gas disebut menguap.', benar: true, bab: 'Wujud Zat', emoji: '💧' },
  { s: 'Es batu yang mencair adalah contoh perubahan padat menjadi gas.', benar: false, bab: 'Wujud Zat', emoji: '🧊' },
  { s: 'Magnet dapat menarik semua jenis logam, termasuk emas dan tembaga.', benar: false, bab: 'Gaya', emoji: '🧲' },
  { s: 'Gaya gesek dapat memperlambat gerak sebuah benda.', benar: true, bab: 'Gaya', emoji: '⚡' },
  { s: 'Sinar matahari termasuk sumber energi terbarukan.', benar: true, bab: 'Energi', emoji: '🔋' },
  { s: 'Batu bara adalah sumber energi yang tidak akan pernah habis.', benar: false, bab: 'Energi', emoji: '🪨' },
  { s: 'Dalam rantai makanan, tumbuhan hijau berperan sebagai produsen.', benar: true, bab: 'Ekosistem', emoji: '🌍' },
  { s: 'Bunga adalah bagian tumbuhan yang bertugas menyerap air dari tanah.', benar: false, bab: 'Tumbuhan', emoji: '🌸' },
];

const UPLOADED_FILES = [
  { icon: '📄', name: 'Rangkuman_Bab1_Tumbuhan.pdf', size: '1.2 MB', bab: 'Bab 1', status: 'Aktif' },
  { icon: '🎬', name: 'Video_Fotosintesis.mp4', size: '45 MB', bab: 'Bab 1', status: 'Aktif' },
  { icon: '🖼️', name: 'Infografis_WujudZat.png', size: '800 KB', bab: 'Bab 2', status: 'Draf' },
];

// ─── Scroll Animation Component ───────────────────────────────────────────────
const ScrollReveal = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      {children}
    </div>
  );
};

// ─── App ────────────────────────────────────────────────────────────────────
export default function App() {
  const [screens, setScreens] = useState<Screen[]>(['splash']);
  const [onboardSlide, setOnboardSlide] = useState(0);
  const screen = screens[screens.length - 1];
  const navigate = (s: Screen) => setScreens(p => [...p, s]);
  const goBack = () => setScreens(p => (p.length > 1 ? p.slice(0, -1) : p));

  // Dev Menu Navigation listener
  useEffect(() => {
    const handleDevNav = (e: any) => {
      if (e.detail && e.detail.screen) {
        setScreens([e.detail.screen as Screen]);
      }
    };
    window.addEventListener('dev-nav', handleDevNav);
    return () => window.removeEventListener('dev-nav', handleDevNav);
  }, []);

  const [activeTab, setActiveTab] = useState('home');
  const [currentBabIdx, setCurrentBabIdx] = useState(0);

  // Upload flow (multi-step wizard)
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadChapter, setUploadChapter] = useState('');
  const [uploadType, setUploadType] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);

  // Buat Interaktif
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [pairRows, setPairRows] = useState([{ kiri: '', kanan: '' }, { kiri: '', kanan: '' }]);
  
  // Guru Media Interaktif: Kuis
  const [quizUploadMode, setQuizUploadMode] = useState<'manual' | 'upload'>('manual');
  const [isProcessingUpload, setIsProcessingUpload] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  // Flip cards
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  // Virtual experiment
  const [expStep, setExpStep] = useState(0);

  // Simulation
  const [simStep, setSimStep] = useState(0);

  // Login Guru
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [captcha, setCaptcha] = useState({ n1: 5, n2: 3 });
  const [captchaInput, setCaptchaInput] = useState('');
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    if (screen === 'loginGuru') {
      setCaptcha({
        n1: Math.floor(Math.random() * 10) + 1,
        n2: Math.floor(Math.random() * 10) + 1
      });
      setCaptchaInput('');
      setLoginUser('');
      setLoginPass('');
      setLoginError('');
    }
  }, [screen]);

  // Video
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [vidProgress, setVidProgress] = useState(38);
  const [checkpointShown, setCheckpointShown] = useState(false);
  const [checkpointAns, setCheckpointAns] = useState<number | null>(null);

  // Quiz
  const [quizQ, setQuizQ] = useState(0);
  const [quizAns, setQuizAns] = useState<number | null>(null);
  const [quizFeed, setQuizFeed] = useState(false);
  const [quizCorrect, setQuizCorrect] = useState(0);

  // Drag-drop matching
  const [selLeft, setSelLeft] = useState<number | null>(null);
  const [matched, setMatched] = useState<Record<number, number>>({});
  const [wrongPair, setWrongPair] = useState<[number, number] | null>(null);

  // P5 project
  const [p5Phase, setP5Phase] = useState(1);

  // SAINS SPRINT arena
  const [arenaPhase, setArenaPhase] = useState<'intro' | 'play' | 'over'>('intro');
  const [arenaQ, setArenaQ] = useState(0);
  const [arenaScore, setArenaScore] = useState(0);
  const [arenaCombo, setArenaCombo] = useState(0);
  const [arenaBest, setArenaBest] = useState(0);
  const [arenaHits, setArenaHits] = useState(0);
  const [arenaLives, setArenaLives] = useState(3);
  const [arenaTimer, setArenaTimer] = useState(100);
  const [arenaLocked, setArenaLocked] = useState<null | { pick: boolean; correct: boolean; gained: number }>(null);
  const [arenaShake, setArenaShake] = useState(false);

  const startArena = () => {
    setArenaPhase('play'); setArenaQ(0); setArenaScore(0); setArenaCombo(0);
    setArenaBest(0); setArenaHits(0); setArenaLives(3); setArenaTimer(100); setArenaLocked(null);
  };

  const answerArena = (pick: boolean | null) => {
    if (arenaLocked) return;
    const st = ARENA_STATEMENTS[arenaQ];
    const correct = pick !== null && pick === st.benar;
    const gained = correct ? 100 + Math.round(arenaTimer) * 5 + arenaCombo * 50 : 0;
    setArenaLocked({ pick: pick === null ? !st.benar : pick, correct, gained });
    if (correct) {
      setArenaScore(s => s + gained);
      setArenaHits(h => h + 1);
      setArenaCombo(c => { const n = c + 1; setArenaBest(b => Math.max(b, n)); return n; });
    } else {
      setArenaCombo(0);
      setArenaLives(l => l - 1);
      setArenaShake(true);
      setTimeout(() => setArenaShake(false), 500);
    }
    setTimeout(() => {
      const lastQ = arenaQ >= ARENA_STATEMENTS.length - 1;
      const dead = !correct && arenaLives - 1 <= 0;
      if (dead || lastQ) setArenaPhase('over');
      else { setArenaQ(q => q + 1); setArenaTimer(100); setArenaLocked(null); }
    }, 1150);
  };

  // Arena countdown clock
  useEffect(() => {
    if (screen !== 'arena' || arenaPhase !== 'play' || arenaLocked) return;
    const iv = setInterval(() => setArenaTimer(t => Math.max(0, t - 2)), 55);
    return () => clearInterval(iv);
  }, [screen, arenaPhase, arenaLocked, arenaQ]);

  // Arena timeout → counts as a miss
  useEffect(() => {
    if (screen === 'arena' && arenaPhase === 'play' && !arenaLocked && arenaTimer <= 0) answerArena(null);
  }, [arenaTimer]);

  useEffect(() => {
    if (screen === 'splash') {
      const t = setTimeout(() => setScreens(['homepage']), 2800);
      return () => clearTimeout(t);
    }
  }, [screen]);

  // Homepage Auto-Slide
  useEffect(() => {
    if (screen === 'homepage') {
      const timer = setInterval(() => {
        setOnboardSlide(s => (s + 1) % 4);
      }, 4000);
      return () => clearInterval(timer);
    }
  }, [screen]);

  const ONBOARD_SLIDES = [
    {
      bg: 'from-emerald-600 via-teal-600 to-cyan-700',
      icon: '🔬',
      iconBg: 'bg-white/20',
      tag: 'IPAS Kelas 4 · Kurikulum Merdeka',
      title: 'Belajar IPAS\nJadi Seru!',
      body: 'Platform belajar digital yang dirancang khusus untuk siswa Kelas 4 SD — sesuai Kurikulum Merdeka 2024.',
      detail: ['📚 8 Bab Pembelajaran', '🎮 Media Interaktif', '🌱 Proyek P5'],
    },
    {
      bg: 'from-violet-600 via-purple-600 to-indigo-700',
      icon: '✨',
      iconBg: 'bg-white/20',
      tag: 'Untuk Guru',
      title: 'Guru Lebih\nMudah Mengajar',
      body: 'Upload materi PDF, video, dan gambar. Buat kuis, kartu konsep, simulasi virtual, dan media interaktif langsung dari aplikasi.',
      detail: ['📤 Upload PDF & Video', '🧩 Buat Media Interaktif', '📊 Pantau Progress Siswa'],
    },
    {
      bg: 'from-green-600 via-emerald-600 to-teal-700',
      icon: '🧑‍🎓',
      iconBg: 'bg-white/20',
      tag: 'Untuk Siswa',
      title: 'Eksplorasi,\nCoba & Pahami!',
      body: 'Pelajari materi lewat video interaktif, percobaan virtual, simulasi, dan kartu konsep yang menyenangkan.',
      detail: ['🔭 Percobaan Virtual', '🃏 Kartu Konsep Flip', '🌊 Simulasi Siklus Air'],
    },
    {
      bg: 'from-amber-500 via-orange-500 to-rose-600',
      icon: '🌱',
      iconBg: 'bg-white/20',
      tag: 'Proyek Nyata',
      title: 'Belajar dengan\nProyek P5',
      body: 'Kuatkan Profil Pelajar Pancasila melalui proyek nyata — dari perencanaan, riset, kreasi, hingga presentasi!',
      detail: ['📋 Fase Proyek Terstruktur', '🔍 Observasi Lapangan', '🗣️ Presentasi Karya'],
    },
  ];

  const resetQuiz = () => { setQuizQ(0); setQuizAns(null); setQuizFeed(false); setQuizCorrect(0); };
  const resetDrag = () => { setSelLeft(null); setMatched({}); setWrongPair(null); };

  const handleQuizAns = (idx: number) => {
    if (quizFeed) return;
    setQuizAns(idx);
    setQuizFeed(true);
    if (idx === QUIZ_IPAS[quizQ].correct) setQuizCorrect(c => c + 1);
  };
  const nextQ = () => {
    if (quizQ < QUIZ_IPAS.length - 1) { setQuizQ(q => q + 1); setQuizAns(null); setQuizFeed(false); }
    else navigate('hasilKuis');
  };

  const handleMatchLeft = (i: number) => { if (matched[i] !== undefined) return; setSelLeft(i); };
  const handleMatchRight = (i: number) => {
    if (selLeft === null) return;
    if (CORRECT_MATCH[selLeft] === i && !Object.values(matched).includes(i)) {
      setMatched(p => ({ ...p, [selLeft]: i })); setSelLeft(null); setWrongPair(null);
    } else {
      setWrongPair([selLeft, i]);
      setTimeout(() => { setWrongPair(null); setSelLeft(null); }, 700);
    }
  };

  const simulateUpload = () => {
    setUploadProgress(0); setUploadDone(false);
    let v = 0;
    const iv = setInterval(() => {
      v += Math.floor(Math.random() * 18) + 8;
      if (v >= 100) { v = 100; clearInterval(iv); setUploadDone(true); }
      setUploadProgress(v);
    }, 180);
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    const map: Record<string, Screen> = { home: 'studentHome', bab: 'daftarBab', aktivitas: 'mediaHub', proyek: 'proyekP5' };
    setScreens([map[tab]]);
  };

  const STUDENT_TABS: Screen[] = ['studentHome', 'daftarBab', 'mediaHub', 'proyekP5'];

  // ── Reusable UI ──
  const BackBtn = ({ onBack, light }: { onBack: () => void; light?: boolean }) => (
    <button onClick={onBack}
      className={`w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0 ${light ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
      ←
    </button>
  );

  const ProgressBar = ({ pct, gradient, h = 'h-2' }: { pct: number; gradient: string; h?: string }) => (
    <div className={`${h} bg-white/20 rounded-full overflow-hidden`}>
      <div className={`h-full bg-gradient-to-r ${gradient} rounded-full transition-all duration-700`} style={{ width: `${pct}%` }} />
    </div>
  );

  const StudentBottomNav = () => (
    <div className="bg-white border-t border-gray-100 px-1 py-2 flex justify-around items-center flex-shrink-0">
      {[
        { id: 'home', icon: '🏠', label: 'Beranda' },
        { id: 'bab', icon: '📚', label: 'Bab' },
        { id: 'aktivitas', icon: '🎮', label: 'Aktivitas' },
        { id: 'proyek', icon: '🌱', label: 'Proyek P5' },
      ].map(t => {
        const active = activeTab === t.id;
        return (
          <button key={t.id} onClick={() => handleTabPress(t.id)}
            className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-2xl transition-all ${active ? 'bg-emerald-100' : ''}`}>
            <span className="text-2xl">{t.icon}</span>
            <span className={`text-[10px] font-bold ${active ? 'text-emerald-700' : 'text-gray-400'}`}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );

  const TeacherBottomNav = () => (
    <div className="bg-white border-t border-gray-100 px-1 py-2 flex justify-around items-center flex-shrink-0">
      {[
        { id: 'home', icon: '🏠', label: 'Home' },
        { id: 'statistik', icon: '📈', label: 'Statistik' },
        { id: 'pengaturan', icon: '⚙️', label: 'Pengaturan' },
      ].map(t => {
        const isActive = 
          (t.id === 'home' && screen === 'teacherDash') ||
          (t.id === 'statistik' && screen === 'progressSiswa') ||
          (t.id === 'pengaturan' && screen === 'pengaturanGuru');

        const onClick = () => {
          if (t.id === 'home') setScreens(['teacherDash']);
          else if (t.id === 'statistik') navigate('progressSiswa');
          else if (t.id === 'pengaturan') navigate('pengaturanGuru');
        };

        return (
          <button key={t.id} onClick={onClick}
            className={`flex flex-col items-center gap-1 px-8 py-2 rounded-2xl transition-all ${isActive ? 'bg-indigo-100' : ''}`}>
            <span className="text-2xl">{t.icon}</span>
            <span className={`text-[10px] font-bold ${isActive ? 'text-indigo-700' : 'text-gray-400'}`}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );

  const bab = BAB_LIST[currentBabIdx];

  // ═══════════════════════════════════════════════════════════════════════════
  // SCREENS
  // ═══════════════════════════════════════════════════════════════════════════

  // ── 0. HOMEPAGE / PENGANTAR ───────────────────────────────────────────────
  if (screen === 'homepage') return (
    <div className="h-screen bg-white flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative w-full h-[520px] rounded-b-[3rem] shadow-xl overflow-hidden flex flex-col transition-colors duration-700"
          style={{
            background: onboardSlide === 0 ? 'linear-gradient(160deg, #064e3b 0%, #065f46 40%, #0d9488 100%)' :
                        onboardSlide === 1 ? 'linear-gradient(160deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)' :
                        onboardSlide === 2 ? 'linear-gradient(160deg, #0c4a6e 0%, #075985 45%, #0891b2 100%)' :
                        'linear-gradient(160deg, #431407 0%, #9a3412 40%, #ea580c 80%, #f59e0b 100%)'
          }}>
          
          {/* Slide 1: Welcome */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${onboardSlide === 0 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 relative flex items-center justify-center pt-8">
              <div className="absolute w-64 h-64 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
              
              {/* Arc Elements */}
              {[
                { e: '🌿', label: 'Tumbuhan', a: -70, r: 110 },
                { e: '🧪', label: 'Wujud Zat', a: -20, r: 125 },
                { e: '⚡', label: 'Gaya', a: 30, r: 120 },
                { e: '🔋', label: 'Energi', a: 75, r: 108 },
              ].map((c, i) => (
                <div key={i} className="absolute flex flex-col items-center gap-1"
                  style={{
                    left: `calc(50% + ${Math.cos((c.a * Math.PI)/180) * c.r}px)`,
                    top: `calc(50% + ${Math.sin((c.a * Math.PI)/180) * c.r}px)`,
                    transform: 'translate(-50%, -50%)',
                    animation: `floatX ${3.2 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                  }}>
                  <div className="w-12 h-12 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl border border-white/25 shadow-lg">{c.e}</div>
                  <span className="text-white/70 text-[9px] font-bold">{c.label}</span>
                </div>
              ))}

              <div className="relative z-10 flex flex-col items-center mt-6">
                <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center text-5xl mb-2 animate-pulse-glow"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.35)' }}>
                  🌍
                </div>
                <div className="flex">
                  {'IPAS'.split('').map((ch, i) => (
                    <span key={i} className="font-display text-white inline-block text-4xl" style={{ animation: `bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.1 + i * 0.08}s both` }}>{ch}</span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="px-6 pb-10 text-center flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.4s both' }}>
              <div className="bg-white/10 rounded-full px-3 py-1 inline-block mb-3 border border-white/20">
                <span className="text-emerald-200 text-[10px] font-black tracking-widest">KURIKULUM MERDEKA 2024</span>
              </div>
              <h2 className="font-display text-white text-3xl leading-tight mb-2">
                Jelajah Ilmu Alam<br/>& Sosial 🎉
              </h2>
              <p className="text-white/70 text-xs leading-relaxed font-medium px-4">
                Platform interaktif untuk guru dan siswa. Belajar jadi petualangan seru!
              </p>
            </div>
          </div>

          {/* Slide 2: Guru */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${onboardSlide === 1 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 relative flex items-center justify-center pt-8">
              <div className="absolute w-56 h-56 rounded-full opacity-15"
                style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl mb-4 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                  👩‍🏫
                </div>

                {[
                  { icon: '📤', text: 'Upload Materi', color: 'from-sky-500 to-blue-600', pos: '-top-4 -left-28', delay: '0s' },
                  { icon: '✨', text: 'Buat Interaktif', color: 'from-violet-500 to-purple-600', pos: 'top-0 -right-28', delay: '0.2s' },
                  { icon: '📊', text: 'Pantau Siswa', color: 'from-emerald-500 to-teal-600', pos: 'bottom-0 -left-24', delay: '0.4s' },
                  { icon: '🧩', text: 'Kuis & Game', color: 'from-amber-500 to-orange-500', pos: 'bottom-4 -right-24', delay: '0.6s' },
                ].map((f, i) => (
                  <div key={i} className={`absolute ${f.pos} bg-gradient-to-r ${f.color} rounded-2xl px-2.5 py-2 flex items-center gap-1.5 shadow-xl`}
                    style={{ animation: `floatX ${3 + i * 0.3}s ease-in-out infinite ${f.delay}`, minWidth: 110 }}>
                    <span className="text-lg">{f.icon}</span>
                    <span className="text-white text-[10px] font-black whitespace-nowrap">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 pb-10 text-center flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/10 rounded-full px-3 py-1 inline-block mb-3 border border-white/20">
                <span className="text-violet-200 text-[10px] font-black tracking-widest">UNTUK GURU</span>
              </div>
              <h2 className="font-display text-white text-3xl leading-tight mb-2">
                Manajemen Kelas<br/>Lebih Mudah 📋
              </h2>
              <p className="text-white/70 text-xs leading-relaxed px-4">
                Upload PDF, video. Buat kuis & simulasi. Pantau progress seluruh siswa real-time.
              </p>
            </div>
          </div>

          {/* Slide 3: Siswa */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${onboardSlide === 2 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 relative flex items-center justify-center px-6 pt-12">
              <div className="grid grid-cols-2 gap-3 z-10 w-full max-w-sm">
                {[
                  { icon: '🧩', title: 'Drag & Drop', sub: 'Cocokkan bagian', color: 'from-green-500 to-emerald-600', delay: '0s' },
                  { icon: '🃏', title: 'Kartu Konsep', sub: 'Balik & pelajari', color: 'from-blue-500 to-cyan-500', delay: '0.15s' },
                  { icon: '🔭', title: 'Eksperimen', sub: 'Coba virtual', color: 'from-violet-500 to-purple-600', delay: '0.3s' },
                  { icon: '🌊', title: 'Simulasi Air', sub: 'Animasi interaktif', color: 'from-sky-500 to-blue-600', delay: '0.45s' },
                ].map((a, i) => (
                  <div key={i} className={`bg-gradient-to-br ${a.color} rounded-2xl p-3 shadow-xl`} style={{ animation: `stagger-in 0.5s ease-out ${a.delay} both` }}>
                    <span className="text-2xl block mb-1">{a.icon}</span>
                    <p className="text-white font-black text-xs leading-tight">{a.title}</p>
                    <p className="text-white/70 text-[9px] mt-0.5">{a.sub}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="px-6 pb-10 text-center flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/10 rounded-full px-3 py-1 inline-block mb-3 border border-white/20">
                <span className="text-sky-200 text-[10px] font-black tracking-widest">UNTUK SISWA</span>
              </div>
              <h2 className="font-display text-white text-3xl leading-tight mb-2">
                Belajar Sambil<br/>Bermain! 🎮
              </h2>
              <p className="text-white/70 text-xs leading-relaxed px-4">
                Video interaktif, percobaan virtual, simulasi — belajar tidak lagi membosankan.
              </p>
            </div>
          </div>

          {/* Slide 4: Final */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${onboardSlide === 3 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 relative flex flex-col items-center justify-center pt-8">
              {['🌿', '⭐', '🔬', '✦', '🧪', '✦', '⚡', '🌟'].map((p, i) => (
                <div key={i} className="absolute text-xl select-none"
                  style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 20}%`, animation: `floatX ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`, opacity: 0.6 }}>{p}</div>
              ))}

              <div className="relative z-10 text-center mt-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.4)', animation: 'float 3s ease-in-out infinite' }}>
                  🚀
                </div>
                
                <div className="flex flex-wrap justify-center gap-1.5 mb-4 max-w-[250px] mx-auto">
                  {[1,2,3,4].map(id => (
                    <div key={id} className="bg-white/15 backdrop-blur-sm rounded-full px-2 py-0.5 border border-white/25"
                      style={{ animation: `bounce-in 0.4s ease-out ${(id - 1) * 0.07}s both` }}>
                      <span className="text-white text-[10px] font-bold">Bab {id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-6 pb-10 text-center flex-shrink-0">
              <h2 className="font-display text-white text-3xl leading-tight mb-2">
                Ayo Mulai<br/>Sekarang! 🌟
              </h2>
              <p className="text-white/70 text-xs leading-relaxed px-4">
                Siap untuk mengeksplorasi ilmu alam & sosial?
              </p>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-20">
            {[0, 1, 2, 3].map(i => (
              <button key={i} onClick={() => setOnboardSlide(i)}
                className="rounded-full transition-all duration-400"
                style={{ width: i === onboardSlide ? 24 : 6, height: 6, background: i === onboardSlide ? 'white' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>

        <div className="px-6 py-8 space-y-10">
          {/* Section 1: Pengantar Kurikulum */}
          <ScrollReveal delay={100}>
            <div className="inline-block bg-teal-50 text-teal-700 px-3 py-1 rounded-full text-xs font-bold mb-3">Pendekatan Baru</div>
            <h2 className="font-display text-2xl text-gray-800 mb-3">Sesuai Kurikulum Merdeka</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-5">
              Aplikasi ini dirancang khusus mengikuti Capaian Pembelajaran (CP) terbaru. Kami mengubah cara belajar dari sekadar menghafal menjadi bereksplorasi secara aktif.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
                <span className="text-2xl block mb-2">🧠</span>
                <p className="font-bold text-emerald-800 text-sm mb-1">Berpikir Kritis</p>
                <p className="text-emerald-600 text-xs">Melalui simulasi & eksperimen virtual.</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <span className="text-2xl block mb-2">🌱</span>
                <p className="font-bold text-orange-800 text-sm mb-1">Proyek P5</p>
                <p className="text-orange-600 text-xs">Misi nyata pelestarian lingkungan.</p>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Fitur Spesifik */}
          <div>
            <ScrollReveal delay={0}>
              <h2 className="font-display text-2xl text-gray-800 mb-5 text-center">Apa Saja Keunggulannya?</h2>
            </ScrollReveal>
            
            {/* Siswa Card */}
            <ScrollReveal delay={100}>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl p-6 mb-4 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10">👦</div>
                <h3 className="font-bold text-xl mb-1">Untuk Siswa</h3>
                <p className="text-blue-100 text-xs mb-4">Belajar jadi petualangan seru!</p>
                <ul className="space-y-3 relative z-10">
                  <li className="flex items-start gap-2 text-sm"><span className="text-blue-200 font-bold">✓</span> <span className="leading-snug">Mainkan media edukasi (Drag & Drop, Flip Card)</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-blue-200 font-bold">✓</span> <span className="leading-snug">Lakukan eksperimen virtual tanpa takut salah</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-blue-200 font-bold">✓</span> <span className="leading-snug">Kumpulkan XP & Koin dari Kuis Interaktif</span></li>
                </ul>
              </div>
            </ScrollReveal>

            {/* Guru Card */}
            <ScrollReveal delay={200}>
              <div className="bg-gradient-to-br from-violet-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute -right-4 -top-4 text-8xl opacity-10">👩‍🏫</div>
                <h3 className="font-bold text-xl mb-1">Untuk Guru</h3>
                <p className="text-violet-100 text-xs mb-4">Manajemen kelas di ujung jari.</p>
                <ul className="space-y-3 relative z-10">
                  <li className="flex items-start gap-2 text-sm"><span className="text-violet-200 font-bold">✓</span> <span className="leading-snug">Unggah materi (PDF/Video) dengan sangat mudah</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-violet-200 font-bold">✓</span> <span className="leading-snug">Pantau progres belajar & hasil kuis siswa otomatis</span></li>
                  <li className="flex items-start gap-2 text-sm"><span className="text-violet-200 font-bold">✓</span> <span className="leading-snug">Kelola instruksi Proyek P5 agar lebih terstruktur</span></li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* Section 3: Sneak Peek Materi */}
          <ScrollReveal delay={100}>
            <div className="flex justify-center items-center gap-2 mb-6">
              <h2 className="font-display text-2xl text-gray-800 leading-tight text-center">Intip Materi IPAS Yuk!</h2>
              <span className="text-2xl animate-bounce">👀</span>
            </div>
            {/* Seamless Marquee Container */}
            <div className="relative overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex gap-3 w-max animate-marquee">
                {[
                  { title: 'Tumbuhan', emoji: '🌿', color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: '🧪', color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: '⚡', color: 'bg-violet-100 text-violet-700' },
                  { title: 'Energi', emoji: '💡', color: 'bg-amber-100 text-amber-700' },
                  // Duplicate items to create seamless loop
                  { title: 'Tumbuhan', emoji: '🌿', color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: '🧪', color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: '⚡', color: 'bg-violet-100 text-violet-700' },
                  { title: 'Energi', emoji: '💡', color: 'bg-amber-100 text-amber-700' },
                ].map((b, i) => (
                  <div key={i} className="shrink-0 w-32 bg-white border border-gray-100 rounded-2xl p-4 shadow-sm flex flex-col items-center text-center">
                    <div className={`w-12 h-12 rounded-full ${b.color} flex items-center justify-center text-2xl mb-2`}>{b.emoji}</div>
                    <span className="font-bold text-gray-700 text-xs">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Testimonial / Target */}
          <ScrollReveal delay={200}>
            <div className="bg-emerald-50 rounded-3xl p-6 relative overflow-hidden mt-2 border border-emerald-100">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200/50 rounded-bl-full -z-0" />
              <div className="relative z-10">
                <span className="text-3xl mb-2 block">💡</span>
                <p className="text-emerald-800 text-sm font-medium leading-relaxed italic">
                  "Pembelajaran yang bermakna adalah ketika siswa bisa melihat, menyentuh, dan berinteraksi langsung dengan ilmu yang mereka pelajari."
                </p>
              </div>
            </div>
          </ScrollReveal>
          
          {/* Footer KKN / Copyright */}
          <ScrollReveal delay={300}>
            <div className="pt-8 pb-4 border-t border-gray-100 flex flex-col items-center justify-center text-center mt-6">
              <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-4">Didukung Oleh</p>
              <div className="flex gap-6 items-center justify-center mb-5">
                {/* 
                  NANTI GANTI BAGIAN INI DENGAN LOGO KEMENDIKBUD 
                  Contoh: <img src="link_logo_kemendikbud.png" alt="Kemendikbud" className="h-12 object-contain" />
                */}
                <div className="w-14 h-14 bg-gray-50 rounded-full flex flex-col items-center justify-center border-2 border-gray-200 border-dashed">
                  <span className="text-[10px] font-bold text-gray-400">Logo</span>
                  <span className="text-[8px] text-gray-400 leading-none">Kemdikbud</span>
                </div>
                
                {/* 
                  NANTI GANTI BAGIAN INI DENGAN LOGO UNESA
                  Contoh: <img src="link_logo_unesa.png" alt="UNESA" className="h-12 object-contain" />
                */}
                <div className="w-14 h-14 bg-gray-50 rounded-full flex flex-col items-center justify-center border-2 border-gray-200 border-dashed">
                  <span className="text-[10px] font-bold text-gray-400">Logo</span>
                  <span className="text-[8px] text-gray-400 leading-none">UNESA</span>
                </div>
              </div>
              <p className="text-gray-600 text-xs font-bold mb-1">Hak Cipta © 2026</p>
              <p className="text-gray-400 text-[10px] leading-relaxed max-w-[250px] mx-auto">
                Aplikasi ini dikembangkan sebagai bagian dari <br />
                <span className="font-semibold text-gray-500">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
              </p>
            </div>
          </ScrollReveal>
          
          <div className="h-24" /> {/* spacer for sticky button */}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white/80 to-transparent">
        <button 
          onClick={() => navigate('roleSelect')}
          className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold text-base shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-transform"
        >
          Masuk ke Aplikasi <span className="text-xl">🚀</span>
        </button>
      </div>
    </div>
  );

  // ── 0a. SPLASH ────────────────────────────────────────────────────────────
  if (screen === 'splash') return (
    <div className="h-screen flex flex-col items-center justify-center overflow-hidden relative"
      style={{ background: 'linear-gradient(135deg, #064e3b 0%, #065f46 25%, #0f766e 60%, #0e7490 100%)' }}>

      {/* Animated mesh rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-80 h-80 rounded-full border border-white/8 absolute animate-spin-slow" />
        <div className="w-[420px] h-[420px] rounded-full border border-white/5 absolute animate-spin-reverse" />
        <div className="w-[560px] h-[560px] rounded-full border border-white/4 absolute animate-spin-slow" style={{ animationDuration: '25s' }} />
      </div>

      {/* Ripple pulses */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-48 h-48 rounded-full bg-emerald-400/10 absolute animate-ripple" />
        <div className="w-48 h-48 rounded-full bg-teal-400/8 absolute animate-ripple" style={{ animationDelay: '0.6s' }} />
        <div className="w-48 h-48 rounded-full bg-cyan-400/6 absolute animate-ripple" style={{ animationDelay: '1.2s' }} />
      </div>

      {/* Shooting stars */}
      {[
        { top: '15%', left: '5%', delay: '0s', dur: '3s' },
        { top: '30%', left: '75%', delay: '1.1s', dur: '3.4s' },
        { top: '65%', left: '10%', delay: '0.5s', dur: '2.8s' },
        { top: '80%', left: '60%', delay: '1.8s', dur: '3.2s' },
      ].map((s, i) => (
        <div key={i} className="absolute w-8 h-0.5 rounded-full bg-gradient-to-r from-white to-transparent"
          style={{ top: s.top, left: s.left, animation: `shooting-star ${s.dur} ease-in-out infinite ${s.delay}` }} />
      ))}

      {/* Floating subject orbs */}
      {[
        { emoji: '🌿', top: '12%', left: '8%', size: 'w-14 h-14', dur: '3.2s', delay: '0s' },
        { emoji: '🧪', top: '18%', right: '10%', size: 'w-12 h-12', dur: '2.8s', delay: '0.4s' },
        { emoji: '⚡', top: '55%', left: '5%', size: 'w-11 h-11', dur: '3.8s', delay: '0.8s' },
        { emoji: '🔋', bottom: '20%', right: '8%', size: 'w-14 h-14', dur: '3.1s', delay: '0.2s' },
        { emoji: '🌍', bottom: '35%', left: '12%', size: 'w-12 h-12', dur: '4s', delay: '1s' },
        { emoji: '🛒', top: '42%', right: '6%', size: 'w-10 h-10', dur: '2.6s', delay: '0.6s' },
      ].map((o, i) => (
        <div key={i} className={`absolute ${o.size} bg-white/10 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-md border border-white/15`}
          style={{ top: o.top, left: (o as any).left, right: (o as any).right, bottom: (o as any).bottom, animation: `floatX ${o.dur} ease-in-out infinite ${o.delay}` }}>
          {o.emoji}
        </div>
      ))}

      {/* Center hero */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Main icon with glow */}
        <div className="relative mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <div className="w-32 h-32 rounded-[2.5rem] flex items-center justify-center text-7xl shadow-2xl animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.08) 100%)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.3)' }}>
            🔬
          </div>
          {/* Star sparks */}
          {['top-0 -right-2', '-top-2 left-1', 'bottom-1 -left-3', '-bottom-1 right-0'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} text-yellow-300 text-lg`}
              style={{ animation: `float ${1.8 + i * 0.3}s ease-in-out infinite ${i * 0.25}s` }}>✦</div>
          ))}
        </div>

        {/* App name — animated letters */}
        <div className="text-center" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
          <h1 className="font-display text-white leading-none mb-1" style={{ fontSize: '4rem', letterSpacing: '0.08em', textShadow: '0 4px 30px rgba(0,0,0,0.3)' }}>
            IPAS
          </h1>
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-white/40" />
            <p className="text-emerald-200 font-black text-sm tracking-[0.3em] uppercase">Kelas 4</p>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-white/40" />
          </div>
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-1.5 border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <p className="text-white/80 text-xs font-bold tracking-wider">Kurikulum Merdeka 2024</p>
          </div>
        </div>
      </div>

      {/* Bottom wave loader */}
      <div className="absolute bottom-14 flex items-end gap-1" style={{ animation: 'slideUp 0.5s ease-out 0.8s both' }}>
        {[0.3, 0.6, 1, 0.8, 0.5, 0.9, 0.4].map((h, i) => (
          <div key={i} className="w-1.5 rounded-full bg-emerald-300/70"
            style={{ height: `${h * 24}px`, animation: `wave-bar 1.1s ease-in-out infinite ${i * 0.1}s` }} />
        ))}
        <p className="text-white/50 text-xs ml-3 mb-1 font-medium">Memuat...</p>
      </div>
    </div>
  );

  // ── 1. ROLE SELECT ─────────────────────────────────────────────────────────
  if (screen === 'roleSelect') return (
    <div className="h-screen bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-5 backdrop-blur-sm" style={{ animation: 'float 3s ease-in-out infinite' }}>🔬</div>
        <h1 className="text-4xl font-display text-white mb-1">IPAS Kelas 4</h1>
        <p className="text-emerald-100 font-medium">Platform Belajar Kurikulum Merdeka</p>
      </div>
      <div className="w-full space-y-4">
        <button onClick={() => { navigate('loginGuru'); }}
          className="w-full bg-white rounded-3xl p-5 flex items-center gap-4 shadow-2xl active:scale-95 transition-transform">
          <div className="w-16 h-16 bg-sky-100 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">👩‍🏫</div>
          <div className="flex-1 text-left">
            <p className="font-display text-gray-800 text-xl">Masuk sebagai Guru</p>
            <p className="text-gray-500 text-sm">Upload materi & buat media interaktif</p>
          </div>
          <span className="text-sky-500 text-xl">→</span>
        </button>
        <button onClick={() => { setScreens(['studentHome']); setActiveTab('home'); }}
          className="w-full bg-white/20 backdrop-blur-sm rounded-3xl p-5 flex items-center gap-4 border border-white/30 active:scale-95 transition-transform">
          <div className="w-16 h-16 bg-emerald-400/30 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">🧑‍🎓</div>
          <div className="flex-1 text-left">
            <p className="font-display text-white text-xl">Masuk sebagai Siswa</p>
            <p className="text-emerald-100 text-sm">Belajar & eksplorasi materi IPAS</p>
          </div>
          <span className="text-white text-xl">→</span>
        </button>
      </div>
      <div className="mt-8 text-center opacity-80">
        <p className="text-white text-xs font-bold mb-1">Hak Cipta © 2026</p>
        <p className="text-emerald-100 text-[10px] leading-relaxed max-w-[250px] mx-auto">
          Aplikasi ini dikembangkan sebagai bagian dari <br />
          <span className="font-semibold text-white">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
        </p>
      </div>
    </div>
  );

  // ── 1a. LOGIN GURU ─────────────────────────────────────────────────────────
  if (screen === 'loginGuru') {
    const handleLogin = () => {
      if (!loginUser || !loginPass) {
        setLoginError('Username dan password harus diisi.');
        return;
      }
      if (parseInt(captchaInput) !== captcha.n1 + captcha.n2) {
        setLoginError('Hitungan CAPTCHA salah. Coba lagi!');
        setCaptcha({
          n1: Math.floor(Math.random() * 10) + 1,
          n2: Math.floor(Math.random() * 10) + 1
        });
        setCaptchaInput('');
        return;
      }
      navigate('teacherDash');
    };

    return (
      <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs font-semibold tracking-wider">Akses Khusus</p>
              <p className="text-white font-display text-xl">Login Guru 👩‍🏫</p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
               <span className="text-5xl">🔐</span>
            </div>

            <h2 className="font-display text-2xl text-gray-800 mb-6 text-center mt-10">Masuk Dashboard</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2 border border-red-100">
                <span className="text-lg">⚠️</span> {loginError}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Username / NIP</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">👤</span>
                  <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-gray-700" placeholder="Masukkan username..." />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Password</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400">🔑</span>
                  <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-gray-700" placeholder="••••••••" />
                </div>
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
                    className="flex-1 bg-white border-2 border-indigo-100 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-black text-indigo-700 text-center" placeholder="?" />
                </div>
              </div>
            </div>

            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              Masuk Sekarang <span>→</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. TEACHER DASHBOARD ───────────────────────────────────────────────────
  if (screen === 'teacherDash') return (
    <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-7 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">👩‍🏫</div>
            <div>
              <p className="text-sky-200 text-xs font-semibold">Selamat datang,</p>
              <p className="text-white font-display text-xl">Bu Sari 👋</p>
            </div>
          </div>
          <button onClick={() => setScreens(['roleSelect'])} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm">Keluar</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Materi', value: '12', icon: '📁' },
            { label: 'Interaktif', value: '8', icon: '🎮' },
            { label: 'Siswa Aktif', value: '28', icon: '👥' },
          ].map((s, i) => (
            <div key={i} className="bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
              <span className="text-2xl block mb-1">{s.icon}</span>
              <p className="text-white font-black text-xl">{s.value}</p>
              <p className="text-sky-100 text-xs">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Quick Actions */}
        <div>
          <p className="font-display text-gray-700 mb-3">Aksi Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '📤', label: 'Upload Materi', sub: 'PDF, Video, Gambar', color: 'from-sky-500 to-blue-600', action: () => { setUploadStep(0); setUploadChapter(''); setUploadType(''); setUploadTitle(''); setUploadDone(false); navigate('uploadMateri'); } },
              { icon: '✨', label: 'Buat Interaktif', sub: 'Kuis, Cocokkan, Simulasi', color: 'from-violet-500 to-purple-600', action: () => { setSelectedTemplate(''); navigate('buatInteraktif'); } },
              { icon: '📊', label: 'Progress Siswa', sub: 'Lihat analitik kelas', color: 'from-emerald-500 to-teal-600', action: () => navigate('progressSiswa') },
              { icon: '📋', label: 'Kelola Bab', sub: 'Atur urutan materi', color: 'from-amber-500 to-orange-500', action: () => navigate('kelolaBab') },
            ].map((a, i) => (
              <button key={i} onClick={a.action}
                className={`bg-gradient-to-br ${a.color} rounded-3xl p-4 text-left active:scale-95 transition-transform`}>
                <span className="text-3xl block mb-3">{a.icon}</span>
                <p className="text-white font-bold text-sm">{a.label}</p>
                <p className="text-white/70 text-xs">{a.sub}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Recent uploads */}
        <div>
          <p className="font-display text-gray-700 mb-3">File Terunggah Terbaru</p>
          <div className="space-y-2">
            {UPLOADED_FILES.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{f.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm truncate">{f.name}</p>
                  <p className="text-gray-400 text-xs">{f.bab} · {f.size}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${f.status === 'Aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{f.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chapter completion */}
        <div>
          <p className="font-display text-gray-700 mb-3">Progres Kelas per Bab</p>
          <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
            {BAB_LIST.slice(0, 4).map((b, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span>{b.emoji}</span>
                    <span className="text-gray-700 text-sm font-semibold truncate max-w-[160px]">Bab {b.id}</span>
                  </div>
                  <span className="text-gray-500 text-xs font-bold">{b.progress}%</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full bg-gradient-to-r ${b.gradient}`} style={{ width: `${b.progress}%` }} />
                </div>
              </div>
            ))}
            <p className="text-gray-400 text-xs text-center">Bab 5–8 belum dimulai</p>
          </div>
        </div>
        <div className="h-2" />
      </div>
      <TeacherBottomNav />
    </div>
  );

  // ── X. PENGATURAN GURU ───────────────────────────────────────────────────
  if (screen === 'pengaturanGuru') return (
    <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <p className="text-white font-display text-xl">Pengaturan ⚙️</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Profil Sekolah */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center text-3xl">👩‍🏫</div>
            <div>
              <p className="font-display text-gray-800 text-lg">Bu Sari</p>
              <p className="text-sky-600 text-sm font-bold">Guru IPAS Kelas 4</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Asal Sekolah</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🏫</span>
                <p className="text-gray-700 font-medium">SDN 01 Nusantara Raya</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">NIP / ID Pegawai</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400">🆔</span>
                <p className="text-gray-700 font-medium">19880312 201001 2 004</p>
              </div>
            </div>
          </div>
        </div>

        {/* Ubah Password */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="font-display text-gray-800 mb-4">Keamanan Akun</p>
          <div className="space-y-3">
            <div>
              <label className="text-gray-500 text-xs font-bold block mb-1">Password Saat Ini</label>
              <input type="password" placeholder="••••••••" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-gray-500 text-xs font-bold block mb-1">Password Baru</label>
              <input type="password" placeholder="Minimal 8 karakter" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sky-500" />
            </div>
            <button onClick={() => alert('Password berhasil diubah!')} className="w-full bg-sky-100 text-sky-700 font-bold py-3 rounded-xl mt-2 active:scale-95 transition-transform text-sm">Simpan Password Baru</button>
          </div>
        </div>

        <button onClick={() => setScreens(['roleSelect'])} className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-4 rounded-2xl active:scale-95 transition-transform shadow-sm">
          Keluar Akun (Logout)
        </button>
        <div className="h-4" />
      </div>
      <TeacherBottomNav />
    </div>
  );

  // ── 3. UPLOAD MATERI ───────────────────────────────────────────────────────
  if (screen === 'uploadMateri') {
    const FILE_TYPES = [
      { id: 'pdf', icon: '📄', label: 'PDF / Dokumen', ext: '.pdf, .doc' },
      { id: 'video', icon: '🎬', label: 'Video', ext: '.mp4, .mov' },
      { id: 'image', icon: '🖼️', label: 'Gambar / Foto', ext: '.jpg, .png' },
      { id: 'ppt', icon: '📊', label: 'Presentasi', ext: '.pptx, .key' },
    ];
    return (
      <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <BackBtn onBack={goBack} light />
            <p className="text-white font-display text-xl">Upload Materi</p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {['Pilih Bab', 'Tipe File', 'Upload', 'Konfigurasi'].map((s, i) => (
              <div key={i} className="flex items-center gap-1 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i <= uploadStep ? 'bg-white text-sky-700' : 'bg-white/25 text-white/50'}`}>
                  {i < uploadStep ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-medium hidden sm:block ${i <= uploadStep ? 'text-white' : 'text-sky-200/60'}`}>{s}</span>
                {i < 3 && <div className="flex-1 h-0.5 bg-white/20 mx-1" />}
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {/* Step 0: Choose chapter */}
          {uploadStep === 0 && (
            <div>
              <p className="font-display text-gray-700 text-base mb-3">Materi untuk bab apa?</p>
              <div className="space-y-2">
                {BAB_LIST.map(b => (
                  <button key={b.id} onClick={() => setUploadChapter(`Bab ${b.id}`)}
                    className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all active:scale-95 border-2 ${uploadChapter === `Bab ${b.id}` ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300' : 'bg-white border-transparent shadow-sm'}`}>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-xl flex-shrink-0`}>{b.emoji}</div>
                    <div className="flex-1 text-left">
                      <p className="font-bold text-gray-800 text-sm">Bab {b.id}</p>
                      <p className="text-gray-400 text-xs truncate">{b.judul}</p>
                    </div>
                    {uploadChapter === `Bab ${b.id}` && <span className="text-sky-500 font-black">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Choose file type */}
          {uploadStep === 1 && (
            <div>
              <p className="font-display text-gray-700 text-base mb-3">Pilih jenis file yang akan diupload</p>
              <div className="grid grid-cols-2 gap-3">
                {FILE_TYPES.map(ft => (
                  <button key={ft.id} onClick={() => setUploadType(ft.id)}
                    className={`p-5 rounded-3xl flex flex-col items-center text-center border-2 transition-all active:scale-95 ${uploadType === ft.id ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300' : 'bg-white border-transparent shadow-sm'}`}>
                    <span className="text-4xl mb-2">{ft.icon}</span>
                    <p className="font-bold text-gray-800 text-sm">{ft.label}</p>
                    <p className="text-gray-400 text-xs mt-1">{ft.ext}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Upload zone */}
          {uploadStep === 2 && (
            <div>
              <p className="font-display text-gray-700 text-base mb-3">Upload file {uploadType === 'pdf' ? 'PDF/Dokumen' : uploadType === 'video' ? 'Video' : uploadType === 'image' ? 'Gambar' : 'Presentasi'}</p>

              {!uploadDone ? (
                <div>
                  <button onClick={simulateUpload}
                    className="w-full border-2 border-dashed border-sky-300 rounded-3xl p-8 flex flex-col items-center bg-sky-50 hover:bg-sky-100 transition-colors active:scale-95">
                    <span className="text-5xl mb-3">
                      {uploadType === 'pdf' ? '📄' : uploadType === 'video' ? '🎬' : uploadType === 'image' ? '🖼️' : '📊'}
                    </span>
                    <p className="font-bold text-sky-700 text-base mb-1">Ketuk untuk pilih file</p>
                    <p className="text-sky-500 text-sm">atau seret file ke sini</p>
                    <p className="text-gray-400 text-xs mt-2">Maks 100 MB</p>
                  </button>

                  {uploadProgress > 0 && uploadProgress < 100 && (
                    <div className="mt-4 bg-white rounded-2xl p-4 shadow-sm">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">⏳</span>
                        <div className="flex-1">
                          <p className="font-bold text-gray-700 text-sm">Mengupload...</p>
                          <p className="text-gray-400 text-xs">Materi_IPAS_{uploadType}.{uploadType === 'pdf' ? 'pdf' : uploadType === 'video' ? 'mp4' : 'png'}</p>
                        </div>
                        <span className="text-sky-600 font-black">{uploadProgress}%</span>
                      </div>
                      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 flex flex-col items-center text-center">
                  <span className="text-5xl mb-3 animate-pop block">✅</span>
                  <p className="font-display text-emerald-700 text-xl mb-1">Upload Berhasil!</p>
                  <p className="text-emerald-600 text-sm">File telah berhasil diunggah ke server.</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Configure */}
          {uploadStep === 3 && (
            <div className="space-y-4">
              <p className="font-display text-gray-700 text-base">Konfigurasi Materi</p>
              <div>
                <label className="font-bold text-gray-600 text-sm block mb-1">Judul Materi *</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Contoh: Rangkuman Bab 1 — Tumbuhan"
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-200 focus:border-sky-400 outline-none text-gray-700 font-medium text-sm" />
              </div>
              <div>
                <label className="font-bold text-gray-600 text-sm block mb-1">Deskripsi</label>
                <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
                  rows={3} placeholder="Jelaskan isi materi ini untuk siswa..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-200 focus:border-sky-400 outline-none text-gray-700 font-medium text-sm resize-none" />
              </div>
              <div>
                <label className="font-bold text-gray-600 text-sm block mb-2">Tujuan Pembelajaran (ATP)</label>
                <div className="space-y-2">
                  {['Siswa dapat menyebutkan bagian tumbuhan', 'Siswa dapat menjelaskan fungsi setiap bagian', 'Siswa dapat mendeskripsikan proses fotosintesis'].map((tp, i) => (
                    <label key={i} className="flex items-center gap-3 bg-white p-3 rounded-xl border border-gray-200 cursor-pointer">
                      <input type="checkbox" defaultChecked={i < 2} className="w-4 h-4 accent-sky-600" />
                      <span className="text-gray-600 text-sm">{tp}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="bg-sky-50 rounded-2xl p-3 flex items-center gap-3">
                <span className="text-xl">🔔</span>
                <div>
                  <p className="font-bold text-sky-700 text-sm">Notifikasi Siswa</p>
                  <p className="text-sky-600 text-xs">28 siswa akan mendapat notifikasi setelah dipublikasikan</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom action */}
        <div className="px-5 pb-8 pt-3 flex-shrink-0 space-y-2">
          {uploadStep < 3 ? (
            <button
              onClick={() => {
                if (uploadStep === 0 && !uploadChapter) return;
                if (uploadStep === 1 && !uploadType) return;
                if (uploadStep === 2 && !uploadDone) return;
                setUploadStep(s => s + 1);
              }}
              className={`w-full py-4 rounded-2xl font-display text-base transition-all ${
                (uploadStep === 0 && uploadChapter) || (uploadStep === 1 && uploadType) || (uploadStep === 2 && uploadDone)
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-200 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              Lanjut →
            </button>
          ) : (
            <button onClick={() => setScreens(['teacherDash'])}
              disabled={!uploadTitle}
              className={`w-full py-4 rounded-2xl font-display text-base transition-all ${uploadTitle ? 'bg-emerald-600 text-white shadow-lg active:scale-95' : 'bg-gray-200 text-gray-400'}`}>
              Publikasikan ke Siswa 🚀
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── 4. BUAT INTERAKTIF ─────────────────────────────────────────────────────
  if (screen === 'buatInteraktif') return (
    <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <div>
            <p className="text-violet-200 text-xs">Guru</p>
            <p className="text-white font-display text-xl">Buat Media Interaktif ✨</p>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4">
        {!selectedTemplate ? (
          <>
            <p className="font-display text-gray-700 mb-3">Pilih template media interaktif</p>
            <div className="grid grid-cols-2 gap-3">
              {MEDIA_TEMPLATES.map(t => (
                <button key={t.id} onClick={() => setSelectedTemplate(t.id)}
                  className={`${t.color} rounded-3xl p-4 flex flex-col items-center text-center active:scale-95 transition-transform border-2 ${t.border}`}>
                  <span className="text-4xl mb-2">{t.icon}</span>
                  <p className={`font-bold ${t.text} text-sm mb-1`}>{t.name}</p>
                  <p className="text-gray-500 text-xs leading-tight">{t.desc}</p>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <button onClick={() => setSelectedTemplate('')} className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-600">←</button>
              <p className="font-display text-gray-700">
                {MEDIA_TEMPLATES.find(t => t.id === selectedTemplate)?.icon}{' '}
                {MEDIA_TEMPLATES.find(t => t.id === selectedTemplate)?.name}
              </p>
            </div>

            <div>
              <label className="font-bold text-gray-600 text-sm block mb-1">Judul Aktivitas</label>
              <input placeholder="Contoh: Cocokkan Bagian Tumbuhan dengan Fungsinya"
                className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-200 focus:border-violet-400 outline-none text-gray-700 text-sm font-medium" />
            </div>

            <div>
              <label className="font-bold text-gray-600 text-sm block mb-1">Pilih Bab</label>
              <select className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-200 focus:border-violet-400 outline-none text-gray-700 text-sm font-medium">
                {BAB_LIST.map(b => <option key={b.id}>Bab {b.id} — {b.judul}</option>)}
              </select>
            </div>

            {selectedTemplate === 'matching' && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-gray-600 text-sm">Pasangan Konsep</label>
                  <button onClick={() => setPairRows(r => [...r, { kiri: '', kanan: '' }])}
                    className="text-violet-600 text-sm font-bold bg-violet-100 px-3 py-1 rounded-xl">+ Tambah</button>
                </div>
                <div className="space-y-2">
                  {pairRows.map((pair, i) => (
                    <div key={i} className="flex gap-2">
                      <input value={pair.kiri} onChange={e => setPairRows(r => r.map((p, j) => j === i ? { ...p, kiri: e.target.value } : p))}
                        placeholder={`Konsep ${i + 1}`}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white border-2 border-gray-200 outline-none text-gray-700 text-sm" />
                      <span className="flex items-center text-gray-400">↔</span>
                      <input value={pair.kanan} onChange={e => setPairRows(r => r.map((p, j) => j === i ? { ...p, kanan: e.target.value } : p))}
                        placeholder={`Pasangannya`}
                        className="flex-1 px-3 py-2.5 rounded-xl bg-white border-2 border-gray-200 outline-none text-gray-700 text-sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedTemplate === 'quiz' && (
              <div className="bg-amber-50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-3">
                  <p className="font-bold text-amber-700 text-sm">Builder Soal Kuis (Pilgan)</p>
                </div>
                
                {/* Toggle Mode */}
                <div className="flex bg-amber-200/50 rounded-xl p-1 mb-4">
                  <button 
                    onClick={() => setQuizUploadMode('manual')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${quizUploadMode === 'manual' ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-600/70 hover:text-amber-700'}`}>
                    Manual Input
                  </button>
                  <button 
                    onClick={() => setQuizUploadMode('upload')}
                    className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1 ${quizUploadMode === 'upload' ? 'bg-white text-amber-700 shadow-sm' : 'text-amber-600/70 hover:text-amber-700'}`}>
                    <span>⚡</span> AI Auto-Proses (TXT/Word)
                  </button>
                </div>

                {quizUploadMode === 'manual' ? (
                  <div className="space-y-3">
                    <input placeholder="Tulis pertanyaan di sini..." className="w-full px-3 py-3 rounded-xl bg-white border border-amber-200 outline-none text-gray-700 text-sm" />
                    {['A', 'B', 'C', 'D'].map(opt => (
                      <div key={opt} className="flex items-center gap-2">
                        <span className="w-7 h-7 bg-amber-200 rounded-lg flex items-center justify-center text-amber-700 text-sm font-black flex-shrink-0">{opt}</span>
                        <input placeholder={`Pilihan ${opt}`} className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-200 outline-none text-gray-700 text-sm" />
                        <button className="text-gray-400 hover:text-emerald-500 text-sm">☆</button>
                      </div>
                    ))}
                    <p className="text-amber-500 text-xs">☆ = tandai jawaban benar</p>
                    <button className="w-full mt-2 border-2 border-dashed border-amber-300 text-amber-600 font-bold py-2 rounded-xl text-sm">+ Tambah Soal Lain</button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {!uploadSuccess ? (
                      <div className="border-2 border-dashed border-amber-400 bg-white/50 rounded-2xl p-6 text-center">
                        {isProcessingUpload ? (
                          <div className="flex flex-col items-center">
                            <span className="text-4xl animate-bounce mb-3">🤖</span>
                            <p className="text-amber-800 font-bold text-sm">Sistem AI Sedang Memproses...</p>
                            <p className="text-amber-600 text-xs mt-1">Mengekstrak pertanyaan & pilihan ganda dari file</p>
                            <div className="w-full h-1.5 bg-amber-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full w-1/2 animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-4xl mb-3 block opacity-80">📄</span>
                            <p className="font-bold text-gray-700 text-sm mb-1">Upload File Soal</p>
                            <p className="text-gray-500 text-xs px-2 mb-4 leading-relaxed">
                              Punya soal di Word (.docx) atau Notepad (.txt)? Upload di sini dan AI kami akan otomatis memisahkannya menjadi kuis interaktif.
                            </p>
                            <label className="bg-amber-500 text-white font-bold py-2.5 px-6 rounded-xl text-sm shadow-md active:scale-95 transition-transform inline-block cursor-pointer cursor-pointer">
                              Pilih File (.txt / .docx)
                              <input type="file" className="hidden" accept=".txt,.doc,.docx" onChange={() => {
                                setIsProcessingUpload(true);
                                setTimeout(() => {
                                  setIsProcessingUpload(false);
                                  setUploadSuccess(true);
                                }, 2500);
                              }} />
                            </label>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl">✅</div>
                          <div>
                            <p className="font-bold text-emerald-800 text-sm">Proses Selesai!</p>
                            <p className="text-emerald-600 text-xs">Berhasil mengekstrak 5 soal pilihan ganda.</p>
                          </div>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-emerald-100 max-h-32 overflow-y-auto mb-3 text-xs text-gray-600 space-y-2">
                          <p><strong>1.</strong> Apa fungsi akar pada tumbuhan? (A)</p>
                          <p><strong>2.</strong> Gas yang dibutuhkan untuk fotosintesis adalah... (B)</p>
                          <p><strong>3.</strong> Perubahan uap air menjadi air disebut... (C)</p>
                          <p className="text-center text-gray-400 italic">...2 soal lainnya</p>
                        </div>
                        <button onClick={() => setUploadSuccess(false)} className="w-full bg-emerald-600 text-white py-2 rounded-xl font-bold text-sm active:scale-95 transition-transform">Edit Hasil Generate</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {(selectedTemplate === 'simulasi' || selectedTemplate === 'observasi' || selectedTemplate === 'video' || selectedTemplate === 'flipcard') && (
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <span className="text-4xl block mb-2">{MEDIA_TEMPLATES.find(t => t.id === selectedTemplate)?.icon}</span>
                <p className="font-bold text-gray-600 text-sm">Template {MEDIA_TEMPLATES.find(t => t.id === selectedTemplate)?.name}</p>
                <p className="text-gray-400 text-xs mt-1">Isi konten menggunakan form di atas, lalu pratinjau hasilnya sebelum dipublikasikan.</p>
              </div>
            )}

            <div className="flex gap-3">
              <button className="flex-1 py-4 rounded-2xl font-bold text-violet-600 bg-violet-100 text-sm">Pratinjau</button>
              <button onClick={() => setScreens(['teacherDash'])}
                className="flex-1 py-4 rounded-2xl font-display text-white bg-violet-600 text-sm shadow-lg active:scale-95">
                Publikasikan 🚀
              </button>
            </div>
            <div className="h-2" />
          </div>
        )}
      </div>
      <TeacherBottomNav />
    </div>
  );

  // ── 5. PROGRESS SISWA ──────────────────────────────────────────────────────
  if (screen === 'progressSiswa') {
    const siswa = [
      { name: 'Andi', avatar: '👦', bab1: 90, bab2: 60, bab3: 0, xp: 380, aktif: '1j lalu' },
      { name: 'Dina', avatar: '👧', bab1: 100, bab2: 80, bab3: 40, xp: 520, aktif: '30m lalu' },
      { name: 'Bagas', avatar: '🧒', bab1: 70, bab2: 0, bab3: 0, xp: 210, aktif: '2h lalu' },
      { name: 'Siti', avatar: '🧑', bab1: 100, bab2: 100, bab3: 70, xp: 680, aktif: '5m lalu' },
    ];
    return (
      <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <BackBtn onBack={goBack} light />
            <p className="text-white font-display text-xl">Progress Siswa 📊</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rata-rata', value: '72%', icon: '📈' },
              { label: 'Aktif Hari Ini', value: '24', icon: '⚡' },
              { label: 'Kuis Selesai', value: '86', icon: '✅' },
            ].map((s, i) => (
              <div key={i} className="bg-white/20 rounded-2xl p-3 text-center">
                <p className="text-lg mb-0.5">{s.icon}</p>
                <p className="text-white font-black text-lg">{s.value}</p>
                <p className="text-emerald-100 text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Class heatmap */}
          <div className="bg-white rounded-3xl p-4 shadow-sm">
            <p className="font-display text-gray-700 mb-3">Penyelesaian per Bab</p>
            <div className="space-y-3">
              {BAB_LIST.slice(0, 4).map(b => (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{b.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 text-xs font-semibold">Bab {b.id}</span>
                      <span className="text-gray-500 text-xs">{b.progress}% kelas selesai</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${b.gradient}`} style={{ width: `${b.progress}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Student list */}
          <div>
            <p className="font-display text-gray-700 mb-3">Daftar Siswa</p>
            <div className="space-y-2">
              {siswa.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">{s.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-gray-400 text-xs">Aktif {s.aktif} · {s.xp} XP</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-600 font-black text-sm">{Math.round((s.bab1 + s.bab2 + s.bab3) / 3)}%</p>
                      <p className="text-gray-400 text-xs">rata-rata</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {[s.bab1, s.bab2, s.bab3].map((v, j) => (
                      <div key={j} className="flex-1">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${v > 0 ? 'bg-emerald-400' : 'bg-gray-200'}`} style={{ width: `${v}%` }} />
                        </div>
                        <p className="text-gray-400 text-[9px] text-center mt-0.5">Bab {j + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Weak areas */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="font-display text-amber-700 mb-2">⚠️ Materi yang Perlu Perhatian</p>
            <div className="space-y-2">
              {['Bab 2 — Wujud Zat (42% selesai)', 'Bab 3 — Gaya (0% selesai)', 'Kuis Fotosintesis (rata-rata 58%)'].map((w, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                  <span className="text-amber-700 text-sm">{w}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="h-2" />
        </div>
        <TeacherBottomNav />
      </div>
    );
  }

  // ── 6. KELOLA BAB ──────────────────────────────────────────────────────────
  if (screen === 'kelolaBab') return (
    <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <p className="text-white font-display text-xl">Kelola Bab 📋</p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {BAB_LIST.map(b => (
          <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
            <span className="text-gray-300 text-xl cursor-grab">⋮⋮</span>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-xl flex-shrink-0`}>{b.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm">Bab {b.id}</p>
              <p className="text-gray-400 text-xs truncate">{b.judul}</p>
              <p className="text-gray-400 text-xs">{b.materi.length + b.interaktif.length} media · {b.progress}%</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className={`text-xs px-2 py-1 rounded-full font-bold ${b.progress > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {b.progress > 0 ? 'Aktif' : 'Belum dimulai'}
              </span>
              <button className="text-xs text-sky-600 font-bold">Edit</button>
            </div>
          </div>
        ))}
        <div className="h-2" />
      </div>
      <TeacherBottomNav />
    </div>
  );

  // ── 7. STUDENT HOME ────────────────────────────────────────────────────────
  if (screen === 'studentHome') return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-8 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">🧑‍🎓</div>
            <div>
              <p className="text-emerald-100 text-xs font-semibold">Halo,</p>
              <p className="text-white font-display text-xl">Andi! 👋</p>
            </div>
          </div>
          <button onClick={() => setScreens(['roleSelect'])} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm active:scale-95 transition-transform">Keluar</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Lanjutkan belajar */}
        <div>
          <p className="font-display text-gray-700 mb-2.5">Lanjutkan Belajar 📖</p>
          <button onClick={() => { setCurrentBabIdx(0); navigate('detailBab'); }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-4 text-left shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl">🌿</div>
              <div className="flex-1">
                <p className="text-emerald-100 text-xs font-semibold">Bab 1</p>
                <p className="text-white font-display text-base">Tumbuhan, Sumber Kehidupan</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white text-sm">▶</div>
            </div>
            <div className="flex items-center gap-2">
              <ProgressBar pct={50} gradient="from-white to-white/80" h="h-2" />
              <span className="text-white text-xs font-bold flex-shrink-0">50%</span>
            </div>
          </button>
        </div>

        {/* Media baru dari guru */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <p className="font-display text-gray-700">Media Baru dari Bu Sari 🆕</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <button onClick={() => { setArenaPhase('intro'); navigate('arena'); }}
              className="relative rounded-2xl p-3 flex flex-col items-center text-center flex-shrink-0 w-28 overflow-hidden active:scale-95 transition-transform"
              style={{ background: 'radial-gradient(130% 130% at 0% 0%, #0f766e, #0a2540)', boxShadow: '0 6px 18px rgba(6,95,70,0.35)' }}>
              <div className="absolute inset-0 arena-grid opacity-50 pointer-events-none" />
              <span className="relative text-3xl mb-2">⚡</span>
              <p className="relative font-display text-white text-xs leading-tight">Sains Sprint</p>
              <p className="relative text-lime-300 text-[10px] mt-1 font-black tracking-wide">MAIN!</p>
            </button>
            {[
              { icon: '🧩', title: 'Cocokkan Bagian Tumbuhan', bab: 'Bab 1', action: () => { resetDrag(); navigate('dragDrop'); } },
              { icon: '🃏', title: 'Kartu Wujud Zat', bab: 'Bab 2', action: () => { setFlipped(new Set()); navigate('flipCards'); } },
            ].map((m, i) => (
              <button key={i} onClick={m.action}
                className="bg-white rounded-2xl p-3 flex flex-col items-center text-center shadow-sm flex-shrink-0 w-28 active:scale-95 transition-transform">
                <span className="text-3xl mb-2">{m.icon}</span>
                <p className="font-bold text-gray-700 text-xs leading-tight">{m.title}</p>
                <p className="text-emerald-600 text-xs mt-1 font-semibold">{m.bab}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick bab overview */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <p className="font-display text-gray-700">Semua Bab IPAS</p>
            <button onClick={() => handleTabPress('bab')} className="text-emerald-600 text-sm font-bold">Semua bab →</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {BAB_LIST.slice(0, 4).map((b, i) => (
              <button key={b.id} onClick={() => { setCurrentBabIdx(i); navigate('detailBab'); }}
                className="bg-white rounded-3xl p-4 shadow-sm text-left active:scale-95 transition-transform">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-2xl mb-3`}>{b.emoji}</div>
                <p className="text-gray-400 text-xs font-semibold">Bab {b.id}</p>
                <p className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">{b.judul}</p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${b.progress}%` }} />
                </div>
                <p className="text-gray-400 text-xs mt-1">{b.progress}%</p>
              </button>
            ))}
          </div>
        </div>
        <div className="h-2" />
      </div>
      <StudentBottomNav />
    </div>
  );

  // ── 8. DAFTAR BAB ──────────────────────────────────────────────────────────
  if (screen === 'daftarBab') return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
        <p className="text-emerald-100 text-xs font-semibold mb-1">IPAS Kelas 4 · Kurikulum Merdeka</p>
        <p className="text-white font-display text-2xl">8 Bab Pembelajaran 🌿</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {BAB_LIST.map((b, i) => {
          const locked = i > 1;
          return (
            <button key={b.id} onClick={() => { if (!locked) { setCurrentBabIdx(i); navigate('detailBab'); } }}
              className={`w-full rounded-3xl overflow-hidden shadow-sm active:scale-95 transition-all ${locked ? 'opacity-50' : ''}`}>
              <div className={`bg-gradient-to-r ${b.gradient} p-4`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">{locked ? '🔒' : b.emoji}</div>
                  <div className="flex-1 text-left">
                    <p className="text-white/70 text-xs font-semibold">Bab {b.id}</p>
                    <p className="text-white font-display text-base leading-tight">{b.judul}</p>
                    <p className="text-white/60 text-xs mt-0.5">{b.topics.length} topik · {b.materi.length + b.interaktif.length} media</p>
                  </div>
                  {!locked && <span className="text-white text-lg">→</span>}
                </div>
              </div>
              {!locked && (
                <div className="bg-white px-4 py-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${b.progress}%` }} />
                  </div>
                  <span className="text-gray-500 text-xs font-bold">{b.progress}%</span>
                </div>
              )}
            </button>
          );
        })}
        <div className="h-2" />
      </div>
      <StudentBottomNav />
    </div>
  );

  // ── 9. DETAIL BAB ──────────────────────────────────────────────────────────
  if (screen === 'detailBab') return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className={`bg-gradient-to-br ${bab.gradient} px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0`}>
        <div className="flex items-center gap-3 mb-3">
          <BackBtn onBack={goBack} light />
          <div>
            <p className="text-white/70 text-xs">IPAS Kelas 4 · Bab {bab.id}</p>
            <p className="text-white font-display text-lg leading-tight">{bab.judul}</p>
          </div>
        </div>
        <ProgressBar pct={bab.progress} gradient="from-yellow-400 to-orange-400" h="h-3" />
        <div className="flex justify-between mt-1">
          <span className="text-white/70 text-xs">{bab.done} dari {bab.total} topik selesai</span>
          <span className="text-white font-bold text-xs">{bab.progress}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Capaian Pembelajaran */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border-l-4 border-emerald-400">
          <p className="font-bold text-emerald-700 text-xs mb-1">📋 CAPAIAN PEMBELAJARAN</p>
          <p className="text-gray-600 text-sm leading-relaxed">{bab.cp}</p>
        </div>

        {/* Topik dalam bab */}
        <div>
          <p className="font-display text-gray-700 mb-3">Topik dalam Bab Ini</p>
          <div className="space-y-2">
            {bab.topics.map((t, i) => (
              <div key={i} className={`flex items-center gap-3 p-3 rounded-2xl ${i < bab.done ? 'bg-emerald-50' : i === bab.done ? 'bg-white border-2 border-emerald-400 shadow-sm' : 'bg-gray-50 opacity-60'}`}>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${i < bab.done ? 'bg-emerald-200 text-emerald-700' : i === bab.done ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {i < bab.done ? '✓' : i + 1}
                </div>
                <span className={`text-sm font-semibold ${i === bab.done ? 'text-emerald-800' : 'text-gray-600'}`}>{t}</span>
                {i === bab.done && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-auto" />}
              </div>
            ))}
          </div>
        </div>

        {/* Materi dari Guru */}
        {bab.materi.length > 0 && (
          <div>
            <p className="font-display text-gray-700 mb-3">Materi dari Guru 📁</p>
            <div className="space-y-2">
              {bab.materi.map((m, i) => (
                <button key={i} onClick={() => navigate(m.type === 'pdf' ? 'bacaMateri' : 'bacaMateri')}
                  className="w-full bg-white rounded-2xl p-3.5 flex items-center gap-3 shadow-sm active:scale-95 transition-transform">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-gray-800 text-sm">{m.title}</p>
                    <p className="text-gray-400 text-xs">Bu Sari · {m.tanggal}</p>
                  </div>
                  <span className="text-emerald-500">→</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Media Interaktif */}
        {bab.interaktif.length > 0 && (
          <div>
            <p className="font-display text-gray-700 mb-3">Media Interaktif 🎮</p>
            <div className="space-y-2">
              {bab.interaktif.map((m, i) => (
                <button key={i} onClick={() => { if (m.screen === 'dragDrop') resetDrag(); if (m.screen === 'flipCards') setFlipped(new Set()); navigate(m.screen); }}
                  className="w-full bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-3.5 flex items-center gap-3 active:scale-95 transition-transform">
                  <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-xl flex-shrink-0">{m.icon}</div>
                  <div className="flex-1 text-left">
                    <p className="font-bold text-emerald-800 text-sm">{m.title}</p>
                    <p className="text-emerald-500 text-xs">Interaktif · Kuis + XP</p>
                  </div>
                  <span className="text-emerald-500 font-bold">▶</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Kuis & Proyek */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => { resetQuiz(); navigate('quiz'); }}
            className="bg-white rounded-2xl p-4 flex flex-col items-center text-center shadow-sm active:scale-95 transition-transform">
            <span className="text-3xl mb-2">📝</span>
            <p className="font-bold text-gray-700 text-sm">Kuis Bab {bab.id}</p>
            <p className="text-gray-400 text-xs">5 soal · +50 XP</p>
          </button>
          <button onClick={() => navigate('proyekP5')}
            className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl p-4 flex flex-col items-center text-center active:scale-95 transition-transform">
            <span className="text-3xl mb-2">🌱</span>
            <p className="font-bold text-white text-sm">Proyek P5</p>
            <p className="text-amber-100 text-xs">Pelajar Pancasila</p>
          </button>
        </div>
        <div className="h-2" />
      </div>
    </div>
  );

  // ── 10. BACA MATERI (PDF Viewer) ───────────────────────────────────────────
  if (screen === 'bacaMateri') return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 flex-shrink-0 shadow-sm">
        <BackBtn onBack={goBack} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">Rangkuman Bab 1 — Tumbuhan</p>
          <p className="text-gray-400 text-xs">Bu Sari · PDF · Halaman 1 dari 5</p>
        </div>
        <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-lg">🔖</button>
      </div>

      {/* PDF-like document */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto">
          {/* Header */}
          <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-5 text-center`}>
            <span className="text-4xl block mb-2">🌿</span>
            <p className="text-white font-display text-lg">Tumbuhan, Sumber Kehidupan di Bumi</p>
            <p className="text-emerald-100 text-sm">IPAS Kelas 4 · Bab 1 · Kurikulum Merdeka</p>
          </div>

          <p className="font-bold text-emerald-700 text-sm mb-1 uppercase tracking-wide">📌 Tujuan Pembelajaran</p>
          <ul className="text-gray-600 text-sm mb-4 space-y-1">
            {['Menyebutkan bagian-bagian tumbuhan', 'Menjelaskan fungsi setiap bagian', 'Mendeskripsikan proses fotosintesis'].map((t, i) => (
              <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{t}</li>
            ))}
          </ul>

          <div className="w-full h-px bg-gray-100 my-4" />

          <p className="font-bold text-gray-800 text-base mb-2">A. Bagian-bagian Tumbuhan</p>
          <p className="text-gray-600 text-sm leading-relaxed mb-3">Tumbuhan memiliki beberapa bagian utama yang masing-masing memiliki fungsi berbeda-beda dalam menunjang kehidupan tumbuhan tersebut.</p>

          <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-2">
            {[['🌱 Akar', 'Menyerap air dan mineral dari tanah; menopang tubuh tumbuhan'], ['🌿 Batang', 'Menopang tubuh tumbuhan; mengangkut air dan nutrisi ke daun'], ['🍃 Daun', 'Tempat berlangsungnya fotosintesis; membantu proses transpirasi'], ['🌸 Bunga', 'Alat perkembangbiakan tumbuhan; menarik serangga penyerbuk']].map(([part, func], i) => (
              <div key={i} className="bg-white rounded-lg p-2.5">
                <p className="font-bold text-gray-700 text-sm">{part}</p>
                <p className="text-gray-500 text-xs mt-0.5">{func}</p>
              </div>
            ))}
          </div>

          <p className="font-bold text-gray-800 text-base mb-2">B. Proses Fotosintesis</p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-4">
            <p className="text-center text-sm font-bold text-yellow-700 mb-2">Persamaan Fotosintesis</p>
            <div className="bg-white rounded-lg p-3 text-center">
              <p className="text-gray-700 text-sm font-medium">CO₂ + H₂O + Cahaya Matahari</p>
              <p className="text-2xl my-1">↓</p>
              <p className="text-emerald-700 text-sm font-bold">Glukosa (C₆H₁₂O₆) + O₂</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 text-center">
            <p className="text-gray-400 text-xs">Halaman 1 dari 5</p>
            <button className="mt-2 text-emerald-600 font-bold text-sm">Halaman berikutnya →</button>
          </div>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );

  // ── 12. MEDIA HUB ──────────────────────────────────────────────────────────
  if (screen === 'mediaHub') return (
    <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <p className="text-emerald-100 text-xs font-semibold mb-1">Pusat Aktivitas</p>
        <p className="text-white font-display text-2xl">Media Interaktif 🎮</p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {/* Featured game — SAINS SPRINT */}
        <button onClick={() => { setArenaPhase('intro'); navigate('arena'); }}
          className="relative w-full rounded-3xl p-5 overflow-hidden text-left active:scale-95 transition-transform"
          style={{ background: 'radial-gradient(120% 120% at 100% 0%, #0f766e 0%, #0a2540 60%, #060d1f 100%)', boxShadow: '0 10px 30px rgba(6,95,70,0.4)' }}>
          <div className="absolute inset-0 arena-grid opacity-50 pointer-events-none" />
          <div className="absolute -right-6 -top-6 w-32 h-32 rounded-full bg-lime-400/20 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 animate-pulse-glow"
              style={{ background: 'linear-gradient(135deg, rgba(163,230,53,0.35), rgba(6,182,212,0.2))', border: '1px solid rgba(163,230,53,0.4)' }}>⚡</div>
            <div className="flex-1">
              <span className="text-lime-300 text-[9px] font-black tracking-[0.25em] uppercase">Mode Kilat · Baru</span>
              <p className="font-display text-white text-xl leading-tight">Sains Sprint</p>
              <p className="text-cyan-100/70 text-xs">Adu cepat Benar/Salah · combo &amp; skor</p>
            </div>
            <span className="text-lime-300 text-2xl">▶</span>
          </div>
        </button>

        {[
          { icon: '🧩', title: 'Cocokkan Bagian Tumbuhan', sub: 'Bab 1 · Drag & drop pasangan', color: 'from-green-500 to-emerald-600', action: () => { resetDrag(); navigate('dragDrop'); } },
          { icon: '🃏', title: 'Kartu Konsep Wujud Zat', sub: 'Bab 2 · Balik kartu & pelajari', color: 'from-blue-500 to-cyan-600', action: () => { setFlipped(new Set()); navigate('flipCards'); } },
          { icon: '🔭', title: 'Percobaan Virtual Magnet', sub: 'Bab 3 · Eksperimen step-by-step', color: 'from-violet-500 to-purple-600', action: () => { setExpStep(0); navigate('virtualEksperimen'); } },
          { icon: '🌊', title: 'Simulasi Siklus Air', sub: 'Bab 1 · Animasi & penjelasan', color: 'from-sky-500 to-blue-600', action: () => { setSimStep(0); navigate('simulasiAir'); } },
          { icon: '📝', title: 'Kuis IPAS Campuran', sub: 'Bab 1–4 · 5 soal · +50 XP', color: 'from-amber-500 to-orange-500', action: () => { resetQuiz(); navigate('quiz'); } },
        ].map((m, i) => (
          <button key={i} onClick={m.action}
            className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-sm active:scale-95 transition-transform">
            <div className={`w-14 h-14 bg-gradient-to-br ${m.color} rounded-2xl flex items-center justify-center text-3xl flex-shrink-0`}>{m.icon}</div>
            <div className="flex-1 text-left">
              <p className="font-bold text-gray-800 text-sm">{m.title}</p>
              <p className="text-gray-400 text-xs">{m.sub}</p>
            </div>
            <span className="text-gray-300">→</span>
          </button>
        ))}
        <div className="h-2" />
      </div>
      <StudentBottomNav />
    </div>
  );

  // ── 13. DRAG-DROP — Bagian Tumbuhan ────────────────────────────────────────
  if (screen === 'dragDrop') {
    const allMatched = Object.keys(matched).length === PLANT_LEFT.length;
    return (
      <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-emerald-100 text-xs">Media Interaktif · Bab 1</p>
              <p className="text-white font-display text-lg">Cocokkan Bagian Tumbuhan 🧩</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl p-3 mb-5">
            <span className="text-2xl">🦉</span>
            <p className="text-emerald-700 text-sm font-medium">Ketuk bagian tumbuhan di kiri, lalu ketuk fungsinya di kanan!</p>
          </div>

          {allMatched ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="text-8xl mb-4 animate-pop block">🎉</span>
              <p className="font-display text-gray-800 text-2xl mb-2">Sempurna!</p>
              <p className="text-gray-500 mb-6">Semua pasangan terjawab dengan benar!</p>
              <div className="flex gap-3 mb-6">
                <div className="bg-emerald-100 rounded-2xl px-5 py-3 text-center"><p className="text-emerald-700 font-black text-xl">+40</p><p className="text-emerald-500 text-xs">XP</p></div>
                <div className="bg-yellow-100 rounded-2xl px-5 py-3 text-center"><p className="text-yellow-600 font-black text-xl">+15</p><p className="text-yellow-500 text-xs">🪙</p></div>
              </div>
              <button onClick={() => { resetDrag(); setScreens(['detailBab']); }}
                className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold">Kembali ke Bab →</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <p className="text-gray-500 text-xs font-bold text-center uppercase tracking-wide">Bagian Tumbuhan</p>
                {PLANT_LEFT.map((part, i) => {
                  const isMatched = matched[i] !== undefined;
                  const isSelected = selLeft === i;
                  const isWrong = wrongPair?.[0] === i;
                  return (
                    <button key={i} onClick={() => !isMatched && handleMatchLeft(i)}
                      className={`w-full py-4 rounded-2xl font-bold text-sm transition-all active:scale-95 leading-tight ${isMatched ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' : isSelected ? 'bg-emerald-600 text-white scale-105 shadow-lg' : isWrong ? 'bg-red-100 text-red-500' : 'bg-white text-gray-700 shadow-sm'}`}>
                      {part}
                    </button>
                  );
                })}
              </div>
              <div className="space-y-2">
                <p className="text-gray-500 text-xs font-bold text-center uppercase tracking-wide">Fungsinya</p>
                {PLANT_RIGHT.map((func, i) => {
                  const isMatched = Object.values(matched).includes(i);
                  const isWrong = wrongPair?.[1] === i;
                  return (
                    <button key={i} onClick={() => !isMatched && handleMatchRight(i)}
                      className={`w-full py-3 px-2 rounded-2xl font-semibold text-xs transition-all active:scale-95 leading-tight ${isMatched ? 'bg-emerald-100 text-emerald-700 border-2 border-emerald-300' : isWrong ? 'bg-red-100 text-red-500' : selLeft !== null ? 'bg-teal-50 text-teal-700 hover:bg-teal-100 shadow-sm' : 'bg-white text-gray-600 shadow-sm'}`}>
                      {func}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 14. FLIP CARDS — Wujud Zat ────────────────────────────────────────────
  if (screen === 'flipCards') return (
    <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <div>
            <p className="text-blue-100 text-xs">Media Interaktif · Bab 2</p>
            <p className="text-white font-display text-lg">Kartu Konsep Wujud Zat 🃏</p>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-2">{flipped.size}/{FLIP_CARDS.length} kartu dipelajari</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-3 mb-4">
          <span className="text-xl">👆</span>
          <p className="text-blue-700 text-sm font-medium">Ketuk kartu untuk membaliknya dan lihat penjelasannya!</p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {FLIP_CARDS.map((card, i) => {
            const isFlipped = flipped.has(i);
            return (
              <div key={i} style={{ perspective: '800px' }} className="cursor-pointer"
                onClick={() => setFlipped(prev => { const n = new Set(prev); isFlipped ? n.delete(i) : n.add(i); return n; })}>
                <div style={{ transformStyle: 'preserve-3d', transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0)', transition: 'transform 0.5s ease' }}
                  className="relative w-full" >
                  {/* Front */}
                  <div style={{ backfaceVisibility: 'hidden' }}
                    className={`bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-4 flex flex-col items-center justify-center text-center min-h-[120px]`}>
                    <span className="text-3xl mb-2">🔵</span>
                    <p className="text-white font-display text-lg">{card.front}</p>
                    <p className="text-blue-100 text-xs mt-1">Ketuk untuk lihat</p>
                  </div>
                  {/* Back */}
                  <div style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                    className="absolute inset-0 bg-white border-2 border-blue-300 rounded-2xl p-3 flex flex-col justify-center text-center min-h-[120px]">
                    <p className="font-bold text-blue-700 text-sm mb-1">{card.front}</p>
                    <p className="text-gray-600 text-xs leading-snug">{card.back}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {flipped.size === FLIP_CARDS.length && (
          <div className="mt-4 bg-blue-50 rounded-2xl p-4 text-center">
            <p className="text-4xl mb-2">🎉</p>
            <p className="font-display text-blue-700 text-lg">Semua Kartu Dipelajari!</p>
            <p className="text-blue-500 text-sm mt-1 mb-3">+30 XP diperoleh</p>
            <button onClick={() => setFlipped(new Set())} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm">
              Ulangi dari Awal
            </button>
          </div>
        )}
        <div className="h-4" />
      </div>
    </div>
  );

  // ── 15. VIRTUAL EKSPERIMEN — Magnet ───────────────────────────────────────
  if (screen === 'virtualEksperimen') {
    const step = EXP_STEPS[expStep];
    return (
      <div className="h-screen bg-[#F5F3FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-violet-100 text-xs">Percobaan Virtual · Bab 3</p>
              <p className="text-white font-display text-lg">Sifat Magnet 🔭</p>
            </div>
          </div>
          <div className="flex gap-1">
            {EXP_STEPS.map((_, i) => (
              <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i <= expStep ? 'bg-white' : 'bg-white/25'}`} />
            ))}
          </div>
          <p className="text-violet-100 text-xs mt-1">Langkah {expStep + 1} dari {EXP_STEPS.length}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5">
          <div className="bg-white rounded-3xl p-6 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-14 h-14 bg-violet-100 rounded-2xl flex items-center justify-center text-4xl">{step.icon}</div>
              <div>
                <p className="text-violet-500 text-xs font-bold">LANGKAH {step.step}</p>
                <p className="font-display text-gray-800 text-lg">{step.title}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">{step.body}</p>
            <div className="bg-violet-50 rounded-xl p-3 flex items-start gap-2">
              <span className="text-base flex-shrink-0">{step.tip.split(' ')[0]}</span>
              <p className="text-violet-600 text-xs leading-snug">{step.tip.substring(step.tip.indexOf(' ') + 1)}</p>
            </div>
          </div>

          {expStep === 3 && (
            <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
              <p className="font-bold text-gray-700 mb-3 text-sm">Tabel Hasil Percobaan</p>
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <div className="grid grid-cols-3 bg-gray-50 px-3 py-2">
                  <span className="text-xs font-bold text-gray-500">Benda</span>
                  <span className="text-xs font-bold text-gray-500">Bahan</span>
                  <span className="text-xs font-bold text-gray-500 text-center">Tertarik?</span>
                </div>
                {[['Klip kertas', 'Besi', true], ['Koin', 'Tembaga', false], ['Pensil', 'Kayu', false], ['Penggaris', 'Plastik', false], ['Paku', 'Besi', true]].map(([b, m, t], i) => (
                  <div key={i} className={`grid grid-cols-3 px-3 py-2 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <span className="text-xs text-gray-700">{b as string}</span>
                    <span className="text-xs text-gray-500">{m as string}</span>
                    <span className={`text-sm text-center font-bold ${t ? 'text-emerald-600' : 'text-red-500'}`}>{t ? '✓' : '✗'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {expStep === EXP_STEPS.length - 1 && (
            <div className="bg-violet-50 rounded-2xl p-4 border border-violet-200 mb-4">
              <p className="font-bold text-violet-700 mb-2 text-sm">📊 Kesimpulanku:</p>
              <textarea rows={3} placeholder="Tulis kesimpulanmu dari percobaan ini..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-violet-200 text-gray-700 text-sm outline-none resize-none" />
            </div>
          )}
        </div>

        <div className="px-5 pb-8 pt-2 flex gap-3 flex-shrink-0">
          {expStep > 0 && (
            <button onClick={() => setExpStep(e => e - 1)} className="flex-1 py-4 rounded-2xl font-bold text-violet-600 bg-violet-100">← Kembali</button>
          )}
          <button onClick={() => expStep < EXP_STEPS.length - 1 ? setExpStep(e => e + 1) : goBack()}
            className="flex-1 py-4 rounded-2xl font-display text-white bg-violet-600 shadow-lg active:scale-95 transition-transform">
            {expStep < EXP_STEPS.length - 1 ? 'Langkah Selanjutnya →' : 'Selesai! 🎉'}
          </button>
        </div>
      </div>
    );
  }

  // ── 16. SIMULASI SIKLUS AIR ────────────────────────────────────────────────
  if (screen === 'simulasiAir') {
    const step = SIM_STEPS[simStep];
    const icons = ['☀️', '☁️', '🌧️', '🏞️'];
    const positions = [
      { top: '15%', left: '50%', transform: 'translateX(-50%)' },
      { top: '35%', left: '50%', transform: 'translateX(-50%)' },
      { top: '55%', left: '60%', transform: 'translateX(-50%)' },
      { top: '70%', left: '30%', transform: 'translateX(-50%)' },
    ];
    return (
      <div className="h-screen bg-[#F0F9FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 to-blue-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs">Simulasi Virtual · Bab 1</p>
              <p className="text-white font-display text-lg">Siklus Air 🌊</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Diagram */}
          <div className="bg-gradient-to-b from-sky-100 to-blue-50 rounded-3xl p-4 mb-4 relative" style={{ minHeight: 220 }}>
            {/* Ocean */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-blue-400/30 rounded-b-3xl flex items-center justify-center">
              <span className="text-2xl">🌊</span>
              <span className="text-blue-700 text-xs font-bold ml-1">Laut / Danau</span>
            </div>
            {/* Sun */}
            <div className="absolute top-4 right-4"><span className="text-4xl" style={{ animation: simStep === 0 ? 'float 2s ease-in-out infinite' : '' }}>☀️</span></div>
            {/* Cloud */}
            <div className="absolute top-10 left-4"><span className="text-4xl" style={{ animation: simStep === 1 ? 'float 2s ease-in-out infinite' : '' }}>☁️</span></div>
            <div className="absolute top-8 left-16"><span className="text-3xl opacity-70" style={{ animation: simStep === 1 ? 'float 2.5s ease-in-out infinite' : '' }}>🌤️</span></div>
            {/* Rain */}
            {simStep >= 2 && <div className="absolute top-20 left-8 text-2xl" style={{ animation: 'float 1s ease-in-out infinite' }}>🌧️</div>}
            {/* Mountain/River */}
            <div className="absolute bottom-14 right-8 text-3xl">⛰️</div>
            {/* Arrows */}
            {simStep >= 0 && <div className="absolute top-16 right-14 text-blue-500 font-black text-xs rotate-[-30deg]">↑ Evaporasi</div>}
            {simStep >= 1 && <div className="absolute top-16 left-20 text-blue-500 font-black text-xs">Kondensasi ↓</div>}
            {simStep >= 2 && <div className="absolute bottom-16 left-6 text-blue-600 font-black text-xs">↓ Hujan</div>}
            {simStep >= 3 && <div className="absolute bottom-14 right-20 text-teal-600 font-black text-xs rotate-[15deg]">→ Aliran</div>}
          </div>

          {/* Step description */}
          <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-3xl ${['bg-amber-100', 'bg-blue-100', 'bg-sky-100', 'bg-emerald-100'][simStep]}`}>
                {icons[simStep]}
              </div>
              <div>
                <p className={`font-display text-lg ${step.color}`}>{step.label}</p>
                <p className="text-gray-400 text-xs">Langkah {simStep + 1} dari {SIM_STEPS.length}</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm leading-relaxed">{step.desc}</p>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mb-5">
            {SIM_STEPS.map((s, i) => (
              <button key={i} onClick={() => setSimStep(i)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${i === simStep ? 'bg-sky-600 text-white' : i < simStep ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'}`}>
                {icons[i]} {s.label}
              </button>
            ))}
          </div>

          {simStep === SIM_STEPS.length - 1 && (
            <div className="bg-sky-50 rounded-2xl p-4 border border-sky-200">
              <p className="font-bold text-sky-700 mb-2 text-sm">✅ Siklus Lengkap!</p>
              <p className="text-sky-600 text-sm">Air di bumi berputar terus-menerus: laut → uap → awan → hujan → sungai → laut lagi. Itulah mengapa air di bumi tidak pernah habis!</p>
            </div>
          )}
        </div>

        <div className="px-5 pb-8 pt-2 flex gap-3 flex-shrink-0">
          <button onClick={() => setSimStep(s => Math.max(0, s - 1))} disabled={simStep === 0}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm ${simStep > 0 ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'}`}>← Sebelumnya</button>
          <button onClick={() => simStep < SIM_STEPS.length - 1 ? setSimStep(s => s + 1) : goBack()}
            className="flex-1 py-4 rounded-2xl font-display text-white bg-sky-600 shadow-lg active:scale-95 transition-transform text-sm">
            {simStep < SIM_STEPS.length - 1 ? 'Selanjutnya →' : 'Selesai! 🎉'}
          </button>
        </div>
      </div>
    );
  }

  // ── 17. KUIS IPAS ──────────────────────────────────────────────────────────
  if (screen === 'quiz') {
    const q = QUIZ_IPAS[quizQ];
    const isCorrect = quizAns === q.correct;
    return (
      <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <BackBtn onBack={goBack} light />
            <div className="flex-1">
              <p className="text-emerald-100 text-xs mb-1.5">Kuis IPAS Kelas 4</p>
              <div className="flex gap-1">
                {QUIZ_IPAS.map((_, i) => (
                  <div key={i} className={`flex-1 h-1.5 rounded-full ${i < quizQ ? 'bg-yellow-400' : i === quizQ ? 'bg-white' : 'bg-white/25'}`} />
                ))}
              </div>
            </div>
            <span className="text-white font-bold text-sm flex-shrink-0">{quizQ + 1}/{QUIZ_IPAS.length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-xl px-3 py-1 inline-flex items-center gap-1">
              <span className="text-yellow-300 text-sm">⭐</span>
              <span className="text-white text-xs font-bold">+10 XP per jawaban benar</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col">
          <div className="bg-white rounded-3xl p-5 shadow-sm mb-4 flex-shrink-0">
            <div className="text-3xl mb-3">{q.img}</div>
            <p className="text-xs font-bold text-emerald-500 mb-1.5">SOAL {quizQ + 1}</p>
            <p className="text-gray-800 font-black text-base leading-snug">{q.q}</p>
          </div>

          <div className="space-y-2.5 flex-1">
            {q.opts.map((opt, i) => {
              let cls = 'bg-white text-gray-700 border-2 border-transparent shadow-sm';
              if (quizFeed) {
                if (i === q.correct) cls = 'bg-emerald-500 text-white border-2 border-emerald-500';
                else if (i === quizAns) cls = 'bg-red-400 text-white border-2 border-red-400';
                else cls = 'bg-gray-100 text-gray-400 border-2 border-transparent';
              } else if (quizAns === i) cls = 'bg-emerald-100 text-emerald-700 border-2 border-emerald-400';
              return (
                <button key={i} onClick={() => !quizFeed && handleQuizAns(i)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl font-bold text-base transition-all active:scale-95 ${cls}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0 ${quizFeed && i === q.correct ? 'bg-white/30 text-white' : 'bg-gray-100 text-gray-600'}`}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>

          {quizFeed && (
            <div className={`mt-4 p-4 rounded-2xl flex-shrink-0 ${isCorrect ? 'bg-emerald-50 border border-emerald-200' : 'bg-orange-50 border border-orange-200'}`}>
              <div className="flex items-start gap-3 mb-3">
                <span className="text-2xl">{isCorrect ? '🎉' : '💡'}</span>
                <p className={`font-black ${isCorrect ? 'text-emerald-700' : 'text-orange-700'}`}>
                  {isCorrect ? 'Hebat! Jawabanmu benar!' : 'Belum tepat, tapi tidak apa-apa! Yuk coba ingat lagi.'}
                </p>
              </div>
              <button onClick={nextQ} className={`w-full py-3 rounded-xl font-bold text-white ${isCorrect ? 'bg-emerald-500' : 'bg-orange-500'}`}>
                {quizQ < QUIZ_IPAS.length - 1 ? 'Soal Berikutnya →' : 'Lihat Hasil →'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── 18. HASIL KUIS ─────────────────────────────────────────────────────────
  if (screen === 'hasilKuis') {
    const score = Math.round(quizCorrect / QUIZ_IPAS.length * 100);
    const stars = score >= 80 ? 3 : score >= 60 ? 2 : 1;
    const xp = quizCorrect * 10;
    return (
      <div className="h-screen bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 pt-12 pb-14 rounded-b-[3rem] text-center flex-shrink-0">
          <p className="text-emerald-100 font-semibold mb-3">Kuis Selesai!</p>
          <div className="flex justify-center gap-1 mb-4">
            {[0, 1, 2].map(i => <span key={i} className={`text-5xl ${i < stars ? 'text-yellow-400 animate-pop' : 'text-white/20'}`} style={{ animationDelay: `${i * 0.15}s` }}>⭐</span>)}
          </div>
          <p className="text-7xl font-display text-white mb-1">{score}%</p>
          <p className="text-emerald-100">{quizCorrect} dari {QUIZ_IPAS.length} jawaban benar</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 -mt-8 space-y-3">
          <div className="bg-white rounded-3xl p-5 shadow-xl">
            <p className="font-display text-gray-700 mb-4">Reward Kamu! 🎁</p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                <p className="text-2xl mb-1">⭐</p>
                <p className="text-emerald-700 font-black text-lg">+{xp}</p>
                <p className="text-emerald-400 text-xs">XP</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-3 text-center">
                <p className="text-2xl mb-1">🪙</p>
                <p className="text-yellow-600 font-black text-lg">+{quizCorrect * 5}</p>
                <p className="text-yellow-400 text-xs">Koin</p>
              </div>
              <div className={`${stars === 3 ? 'bg-orange-50' : 'bg-gray-50'} rounded-2xl p-3 text-center`}>
                <p className="text-2xl mb-1">{stars === 3 ? '🏆' : '🔒'}</p>
                <p className={`font-black text-xs ${stars === 3 ? 'text-orange-600' : 'text-gray-400'}`}>{stars === 3 ? 'Badge!' : 'Score 80%'}</p>
                <p className={`text-xs ${stars === 3 ? 'text-orange-400' : 'text-gray-300'}`}>{stars === 3 ? 'Ilmuwan Cilik' : 'Untuk badge'}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-2xl">🦉</span>
            <p className="text-emerald-700 text-sm font-medium">
              {score >= 80 ? 'Luar biasa! Kamu sudah memahami materi IPAS dengan sangat baik! 🌟' : score >= 60 ? 'Bagus! Kamu hampir hafal semuanya. Yuk review materi yang belum tepat! 📖' : 'Jangan menyerah! Coba baca lagi materinya, kamu pasti bisa! 💪'}
            </p>
          </div>

          <button onClick={() => { resetQuiz(); navigate('quiz'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Coba Lagi 🔄
          </button>
          <button onClick={() => setScreens(['studentHome'])} className="w-full bg-white text-emerald-600 py-4 rounded-2xl font-bold border-2 border-emerald-200">
            Kembali ke Beranda
          </button>
          <div className="h-2" />
        </div>
      </div>
    );
  }

  // ── 19. PROYEK P5 ──────────────────────────────────────────────────────────
  if (screen === 'proyekP5') {
    const phases = [
      { phase: 1, label: 'Perencanaan', icon: '📋', color: 'bg-amber-500', done: true },
      { phase: 2, label: 'Riset & Observasi', icon: '🔍', color: 'bg-blue-500', done: true },
      { phase: 3, label: 'Kreasi & Karya', icon: '🎨', color: 'bg-violet-500', done: p5Phase >= 3 },
      { phase: 4, label: 'Presentasi', icon: '🗣️', color: 'bg-emerald-500', done: false },
    ];
    const tasks = [
      { task: 'Amati lingkungan sekitar sekolah', done: true },
      { task: 'Catat jenis tanaman di sekolah (min. 5)', done: true },
      { task: 'Foto bagian-bagian tanaman yang ditemukan', done: p5Phase >= 3 },
      { task: 'Buat poster/mind map tentang tumbuhan', done: false },
      { task: 'Presentasikan hasil kepada teman sekelas', done: false },
    ];
    return (
      <div className="h-screen bg-[#FFFBEB] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-amber-100 text-xs">Proyek Penguatan Profil Pelajar Pancasila</p>
              <p className="text-white font-display text-lg">Menjaga Lingkungan 🌱</p>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            {['Beriman & Bertakwa', 'Bernalar Kritis', 'Kreatif'].map(d => (
              <span key={d} className="bg-white/20 text-white text-xs px-2 py-1 rounded-full font-bold">{d}</span>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Phase tracker */}
          <div>
            <p className="font-display text-gray-700 mb-3">Fase Proyek</p>
            <div className="flex gap-2">
              {phases.map((ph, i) => (
                <div key={i} className={`flex-1 rounded-2xl p-3 text-center transition-all ${ph.done ? ph.color : 'bg-gray-100'}`}>
                  <span className="text-xl block mb-1">{ph.done ? ph.icon : '🔒'}</span>
                  <p className={`text-xs font-bold leading-tight ${ph.done ? 'text-white' : 'text-gray-400'}`}>{ph.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Task checklist */}
          <div>
            <p className="font-display text-gray-700 mb-3">Daftar Tugas ({tasks.filter(t => t.done).length}/{tasks.length})</p>
            <div className="space-y-2">
              {tasks.map((t, i) => (
                <div key={i} className={`flex items-center gap-3 p-4 rounded-2xl ${t.done ? 'bg-emerald-50 border border-emerald-200' : 'bg-white shadow-sm'}`}>
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${t.done ? 'bg-emerald-500' : 'bg-gray-200'}`}>
                    <span className={`text-sm font-black ${t.done ? 'text-white' : 'text-gray-400'}`}>{t.done ? '✓' : i + 1}</span>
                  </div>
                  <span className={`text-sm font-semibold ${t.done ? 'text-emerald-700 line-through' : 'text-gray-700'}`}>{t.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress */}
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="flex justify-between mb-2">
              <p className="font-bold text-gray-700 text-sm">Progress Proyek</p>
              <p className="font-black text-amber-600">{Math.round(tasks.filter(t => t.done).length / tasks.length * 100)}%</p>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full transition-all" style={{ width: `${tasks.filter(t => t.done).length / tasks.length * 100}%` }} />
            </div>
          </div>

          <button onClick={() => setP5Phase(p => Math.min(4, p + 1))} className="w-full bg-amber-500 text-white py-4 rounded-2xl font-display text-base active:scale-95 transition-transform">
            Lanjutkan Fase Proyek →
          </button>
          <div className="h-2" />
        </div>
      </div>
    );
  }


  // ── 20. SAINS SPRINT — Arena Adu Cepat ─────────────────────────────────────
  if (screen === 'arena') {
    const ARENA_BG = 'radial-gradient(120% 80% at 50% 0%, #0f3d3a 0%, #0a2540 55%, #060d1f 100%)';
    const st = ARENA_STATEMENTS[arenaQ];

    // Ambient arena chrome shared by every phase (plain helper — not a nested
    // component, so the countdown re-render doesn't remount the subtree)
    const chrome = (children: React.ReactNode) => (
      <div className={`h-screen relative flex flex-col overflow-hidden ${arenaShake ? 'animate-shake' : ''}`} style={{ background: ARENA_BG }}>
        <div className="absolute inset-0 arena-grid opacity-60 pointer-events-none" />
        <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" style={{ animation: 'pulse-glow 4s ease-in-out infinite' }} />
        <div className="absolute -bottom-28 -right-16 w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" style={{ animation: 'pulse-glow 5s ease-in-out infinite 1s' }} />
        {children}
      </div>
    );

    // ---- INTRO ----
    if (arenaPhase === 'intro') return chrome(
      <>
        <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8">
          <BackBtn onBack={goBack} light />
          <div className="flex-1 flex flex-col items-center justify-center text-center">
            <div className="relative mb-8" style={{ animation: 'float 3s ease-in-out infinite' }}>
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-44 h-44 rounded-full border border-emerald-400/30 animate-spin-slow" />
                <div className="w-56 h-56 rounded-full border border-cyan-400/20 absolute animate-spin-reverse" />
              </div>
              <div className="w-28 h-28 rounded-[2rem] flex items-center justify-center text-6xl animate-pulse-glow"
                style={{ background: 'linear-gradient(135deg, rgba(52,211,153,0.3), rgba(6,182,212,0.15))', border: '1px solid rgba(163,230,53,0.4)' }}>
                ⚡
              </div>
            </div>
            <p className="text-lime-300 text-xs font-black tracking-[0.35em] uppercase mb-2">Mode Kilat · Lintas Bab</p>
            <h1 className="font-display text-white text-5xl leading-none mb-3" style={{ textShadow: '0 0 30px rgba(52,211,153,0.5)' }}>
              SAINS<span className="text-lime-300"> SPRINT</span>
            </h1>
            <p className="text-cyan-100/70 text-sm max-w-[280px] leading-relaxed mb-8">
              Benar atau salah? Jawab pernyataan IPAS secepat mungkin — makin cepat &amp; makin panjang combo, makin besar skormu!
            </p>
            <div className="w-full max-w-[300px] space-y-2.5 mb-2">
              {[
                { i: '⏱️', t: 'Cepat = Poin Besar', d: 'Sisa waktu jadi Speed Bonus' },
                { i: '🔗', t: 'Jaga Combo', d: 'Jawaban benar beruntun melipatkan skor' },
                { i: '❤️', t: '3 Nyawa', d: 'Salah atau kehabisan waktu = nyawa berkurang' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 backdrop-blur-sm text-left">
                  <span className="text-2xl">{r.i}</span>
                  <div>
                    <p className="text-white font-bold text-sm">{r.t}</p>
                    <p className="text-cyan-100/50 text-xs">{r.d}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <button onClick={startArena}
            className="relative w-full py-4 rounded-2xl font-display text-lg text-emerald-950 active:scale-95 transition-transform"
            style={{ background: 'linear-gradient(135deg, #a3e635, #34d399)', boxShadow: '0 0 30px rgba(163,230,53,0.5)' }}>
            Mulai Sprint! ⚡
          </button>
        </div>
      </>
    );

    // ---- OVER ----
    if (arenaPhase === 'over') {
      const total = ARENA_STATEMENTS.length;
      const acc = Math.round((arenaHits / total) * 100);
      const rank = arenaScore >= 3000 ? { t: 'Ilmuwan Kilat', e: '🏆', c: '#fde047' }
        : arenaScore >= 1500 ? { t: 'Peneliti Cepat', e: '🥈', c: '#67e8f9' }
        : { t: 'Penjelajah Muda', e: '🌱', c: '#86efac' };
      return chrome(
        <>
          <div className="relative z-10 flex-1 flex flex-col px-6 pt-10 pb-8 items-center justify-center text-center">
            <span className="text-7xl mb-3 animate-pop block" style={{ filter: `drop-shadow(0 0 20px ${rank.c})` }}>{rank.e}</span>
            <p className="text-xs font-black tracking-[0.3em] uppercase mb-1" style={{ color: rank.c }}>{rank.t}</p>
            <p className="text-cyan-100/60 text-sm mb-5">Sprint selesai — kerja bagus!</p>

            <div className="relative mb-6">
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">Skor Akhir</p>
              <p className="font-display text-white text-6xl leading-none" style={{ textShadow: '0 0 30px rgba(52,211,153,0.5)' }}>
                {arenaScore.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-[320px] mb-6">
              {[
                { l: 'Akurasi', v: `${acc}%`, e: '🎯' },
                { l: 'Jawaban Benar', v: `${arenaHits}/${total}`, e: '✅' },
                { l: 'Combo Terbaik', v: `${arenaBest}×`, e: '💫' },
              ].map((s, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                  <span className="text-xl block mb-1">{s.e}</span>
                  <p className="text-white font-black text-lg">{s.v}</p>
                  <p className="text-cyan-100/50 text-[10px] font-semibold">{s.l}</p>
                </div>
              ))}
            </div>

            <div className="w-full max-w-[320px] space-y-2.5">
              <button onClick={startArena}
                className="w-full py-4 rounded-2xl font-display text-lg text-emerald-950 active:scale-95 transition-transform"
                style={{ background: 'linear-gradient(135deg, #a3e635, #34d399)', boxShadow: '0 0 24px rgba(163,230,53,0.45)' }}>
                Main Lagi 🔄
              </button>
              <button onClick={() => setScreens(['mediaHub'])}
                className="w-full py-4 rounded-2xl font-bold text-cyan-100 bg-white/5 border border-white/15 active:scale-95 transition-transform">
                Kembali ke Aktivitas
              </button>
            </div>
          </div>
        </>
      );
    }

    // ---- PLAY ----
    const pick = arenaLocked?.pick;
    const tileClass = (val: boolean) => {
      if (!arenaLocked) return val
        ? 'text-emerald-200 border-emerald-400/50 bg-emerald-500/10 active:bg-emerald-500/25'
        : 'text-rose-200 border-rose-400/50 bg-rose-500/10 active:bg-rose-500/25';
      const isCorrectTile = val === st.benar;
      if (isCorrectTile) return 'text-white border-emerald-300 bg-emerald-500/40 shadow-[0_0_30px_rgba(52,211,153,0.6)]';
      if (pick === val) return 'text-white border-rose-300 bg-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.5)]';
      return 'text-white/25 border-white/10 bg-white/5';
    };

    return chrome(
      <>
        <div className="relative z-10 flex flex-col h-full px-4 pt-9 pb-6">
          {/* HUD */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 bg-cyan-500/15 border border-cyan-400/40 rounded-lg px-3 py-1 backdrop-blur-sm">
                <span className="text-cyan-200 text-[10px] font-black tracking-wide">SPEED BONUS</span>
                <span className="text-white font-display text-sm tabular-nums">{Math.round(arenaTimer)}</span>
              </div>
              <div className="flex items-center gap-2 bg-lime-500/15 border border-lime-400/40 rounded-lg px-3 py-1 backdrop-blur-sm">
                <span className="text-lime-200 text-[10px] font-black tracking-wide">COMBO</span>
                <span className={`text-white font-display text-sm tabular-nums ${arenaCombo > 0 ? 'animate-pop' : ''}`} key={arenaCombo}>{arenaCombo}×</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center gap-1.5 bg-yellow-400/15 border border-yellow-300/50 rounded-lg px-3 py-1 backdrop-blur-sm">
                <span className="text-yellow-200 text-[10px] font-black">SCORE</span>
                <span className="text-yellow-100 font-display text-base tabular-nums" key={arenaScore}>{arenaScore.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <span key={i} className={`text-lg transition-all ${i < arenaLives ? '' : 'grayscale opacity-30'}`}>❤️</span>
                ))}
              </div>
            </div>
          </div>

          {/* Progress pips */}
          <div className="flex gap-1 mb-4">
            {ARENA_STATEMENTS.map((_, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i < arenaQ ? 'bg-lime-400' : i === arenaQ ? 'bg-white' : 'bg-white/15'}`} />
            ))}
          </div>

          {/* Center: reactor core + statement */}
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Energy core countdown */}
            <div className="relative mb-6 flex items-center justify-center" style={{ width: 132, height: 132 }}>
              <div className="absolute w-32 h-32 rounded-full border border-emerald-400/25 animate-spin-slow" />
              <div className="absolute w-[116px] h-[116px] rounded-full border border-cyan-400/20 animate-spin-reverse" />
              <svg width="132" height="132" viewBox="0 0 132 132" className="absolute -rotate-90">
                <circle cx="66" cy="66" r="56" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
                <circle cx="66" cy="66" r="56" fill="none"
                  stroke={arenaTimer > 40 ? '#a3e635' : arenaTimer > 20 ? '#fbbf24' : '#fb7185'} strokeWidth="6" strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 56} strokeDashoffset={2 * Math.PI * 56 * (1 - arenaTimer / 100)}
                  style={{ transition: 'stroke-dashoffset 0.1s linear, stroke 0.3s' }} />
              </svg>
              <div className="w-20 h-20 rounded-full flex flex-col items-center justify-center"
                style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.25), rgba(6,13,31,0.6))', border: '1px solid rgba(163,230,53,0.3)' }}>
                <span className="text-3xl leading-none">{st.emoji}</span>
              </div>
            </div>

            {/* Bab tag */}
            <span className="text-lime-300/80 text-[10px] font-black tracking-[0.25em] uppercase mb-3">Bab · {st.bab}</span>

            {/* Statement panel */}
            <div className="w-full bg-white/[0.06] border border-white/12 rounded-3xl px-5 py-6 backdrop-blur-md text-center min-h-[120px] flex items-center justify-center"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}>
              <p className="text-white font-bold text-lg leading-snug">{st.s}</p>
            </div>

            {/* Feedback flash */}
            <div className="h-8 flex items-center justify-center mt-3">
              {arenaLocked && (
                <p className={`font-display text-base ${arenaLocked.correct ? 'text-lime-300' : 'text-rose-300'} animate-pop`}>
                  {arenaLocked.correct ? `Tepat! +${arenaLocked.gained}` : 'Aduh, salah! 💥'}
                </p>
              )}
            </div>
          </div>

          {/* Answer tiles */}
          <div className="grid grid-cols-2 gap-3">
            {([true, false] as const).map(val => (
              <button key={String(val)} disabled={!!arenaLocked} onClick={() => answerArena(val)}
                className={`py-6 rounded-3xl border-2 font-display text-2xl backdrop-blur-sm transition-all active:scale-95 ${tileClass(val)}`}>
                <span className="block text-3xl mb-1">{val ? '✓' : '✕'}</span>
                {val ? 'BENAR' : 'SALAH'}
              </button>
            ))}
          </div>
        </div>
      </>
    );
  }

  return null;
}
