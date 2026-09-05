import { Zap, Leaf, Puzzle, GalleryVertical, School, FileText, Microscope, Telescope, ClipboardList, BarChart2, PartyPopper, User, Lightbulb, Gamepad2, Sparkles, GraduationCap, Waves, TestTube, Star, Bug, Sun, Upload, Rocket, CheckCircle, ShoppingCart, FileEdit, Eye, AlertTriangle, RefreshCw, Search, Lock, Handshake, Map, Box, Smile, Target, Wind, Film, Image, Library, MessageCircle, Home, TrendingUp, Settings, Battery, Globe, Copyright, Hand, Users, BookOpen, PlayCircle, Pin, Bird, Coins, Cloud, CloudRain, Trophy, Heart, Hourglass, Ear, Wrench, Scissors, Flame, Egg, TreePine, Plug, Magnet, Cat, Sunrise, Store, Droplet, ToyBrick, DollarSign, Brain, Mail, Key, Folder, Hash, PenTool, Paperclip, Bell, MoveHorizontal, Bot, BadgePlus, Bookmark, Flower, Pointer, Circle, Mountain, CloudSun, Gift, Dumbbell, Palette, Timer, Link, Medal, Gem } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc, getDoc } from 'firebase/firestore';
// ─── Types ─────────────────────────────────────────────────────────────────
type Screen =
  | 'homepage' | 'splash' | 'onboarding'
  | 'roleSelect' | 'loginGuru' | 'loginSiswa' | 'forgotPassword'
  | 'teacherDash' | 'uploadMateri' | 'buatInteraktif' | 'progressSiswa' | 'kelolaBab' | 'pengaturanGuru'
  | 'studentHome' | 'daftarBab' | 'detailBab'
  | 'bacaMateri' | 'mediaHub'
  | 'dragDrop' | 'flipCards' | 'virtualEksperimen' | 'simulasiAir'
| 'quiz' | 'hasilKuis' | 'proyekP5' | 'arena';

const SimpleRichTextEditor = ({ value, onChange }: { value: string, onChange: (val: string) => void }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (command: string, val: string | undefined = undefined) => {
    document.execCommand(command, false, val);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="border border-sky-300 rounded-2xl overflow-hidden bg-white flex flex-col shadow-sm mt-2 transition-all focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-100">
      <div className="bg-sky-50/50 border-b border-sky-100 p-2 flex flex-wrap gap-1.5 items-center">
        <button type="button" onClick={() => exec('bold')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 font-black text-gray-700">B</button>
        <button type="button" onClick={() => exec('italic')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 italic font-serif text-gray-700">I</button>
        <button type="button" onClick={() => exec('underline')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 underline text-gray-700">U</button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec('insertUnorderedList')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-xl leading-none text-gray-700">•</button>
        <button type="button" onClick={() => exec('insertOrderedList')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-xs font-bold leading-none text-gray-700">1.</button>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <select onChange={(e) => exec('fontName', e.target.value)} className="p-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white cursor-pointer outline-none shadow-sm">
          <option value="Inter, sans-serif">Font Normal</option>
          <option value="Comic Sans MS, cursive">Comic</option>
          <option value="Georgia, serif">Georgia</option>
        </select>
        <select onChange={(e) => exec('fontSize', e.target.value)} className="p-1.5 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 bg-white cursor-pointer outline-none shadow-sm">
          <option value="3">Ukuran Sedang</option>
          <option value="5">Besar</option>
          <option value="7">Sangat Besar</option>
        </select>
        <div className="w-px h-5 bg-gray-300 mx-1" />
        <button type="button" onClick={() => exec('justifyLeft')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-xs text-gray-700">⫷</button>
        <button type="button" onClick={() => exec('justifyCenter')} className="w-8 h-8 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 text-xs text-gray-700">≣</button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        className="flex-1 p-5 outline-none overflow-y-auto text-gray-700 text-sm [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2"
        style={{ minHeight: '300px' }}
        onInput={(e) => onChange(e.currentTarget.innerHTML)}
        onBlur={(e) => onChange(e.currentTarget.innerHTML)}
        placeholder="Ketik materi yang menarik di sini..."
      />
    </div>
  );
};

// ─── Kurikulum Merdeka · IPAS Kelas 3 ──────────────────────────────────────
const BAB_LIST = [
  {
    id: 1, emoji: '🧑',
    judul: 'Keajaiban Tubuhku',
    gradient: 'from-amber-500 to-orange-600',
    cp: 'Peserta didik mengenal bagian tubuh manusia beserta fungsinya.',
    topics: ['Bagian Tubuh Kita', 'Fungsi Anggota Tubuh', 'Merawat Tubuh'],
    materi: [
      { type: 'pdf', icon: '📄', title: 'Rangkuman Bab 1 — Tubuhku', uploader: 'Bu Sari', tanggal: '2 hari lalu' },
    ],
    interaktif: [
      { type: 'matching', icon: '🧩', title: 'Cocokkan Bagian Tubuh & Fungsinya', screen: 'dragDrop' as Screen },
    ],
  },
  {
    id: 2, emoji: '⏳',
    judul: 'Dahulu, Kini, dan Nanti',
    gradient: 'from-green-500 to-emerald-600',
    cp: 'Peserta didik menceritakan perubahan yang terjadi pada diri dan sekitarnya dari waktu ke waktu.',
    topics: ['Arah Mata Angin', 'Denah Tempat'],
    materi: [],
    interaktif: [],
  },
  {
    id: 3, emoji: '🤝',
    judul: 'Peduli dan Berbagi',
    gradient: 'from-lime-600 to-green-700',
    cp: 'Peserta didik memahami pentingnya bersikap peduli dan berbagi dengan sesama.',
    topics: ['Gotong Royong', 'Saling Menghargai'],
    materi: [],
    interaktif: [],
  },
  {
    id: 4, emoji: '🦋',
    judul: 'Siklus Hidup yang Menakjubkan',
    gradient: 'from-yellow-400 to-amber-500',
    cp: 'Peserta didik mengamati dan mendeskripsikan siklus hidup makhluk hidup.',
    topics: ['Siklus Hidup Tumbuhan', 'Siklus Hidup Hewan'],
    materi: [],
    interaktif: [
      { type: 'simulasi', icon: '🔬', title: 'Simulasi Metamorfosis', screen: 'simulasiAir' as Screen },
    ],
  },
  {
    id: 5, emoji: '🛒',
    judul: 'Bijak Berbelanja Kebutuhan',
    gradient: 'from-blue-500 to-cyan-600',
    cp: 'Peserta didik mengenal nilai mata uang dan prioritas kebutuhan sehari-hari.',
    topics: ['Kenampakan Alam', 'Ciri Khas Daerah'],
    materi: [],
    interaktif: [],
  },
  {
    id: 6, emoji: '⚡',
    judul: 'Energi, sang Pemberi Kekuatan!',
    gradient: 'from-violet-500 to-purple-600',
    cp: 'Peserta didik mengenal bentuk energi dan memanfaatkannya.',
    topics: ['Sumber Energi', 'Bentuk Energi', 'Manfaat Energi'],
    materi: [],
    interaktif: [
      { type: 'eksperimen', icon: '🔭', title: 'Percobaan Virtual: Sumber Energi', screen: 'virtualEksperimen' as Screen },
    ],
  },
  {
    id: 7, emoji: '🗺️',
    judul: 'Jejak Penjelajah',
    gradient: 'from-rose-500 to-pink-600',
    cp: 'Peserta didik memahami arah mata angin dan denah sederhana.',
    topics: ['Gaya Magnet', 'Gaya Gesek', 'Gaya Gravitasi'],
    materi: [],
    interaktif: [],
  },
  {
    id: 8, emoji: '🧊',
    judul: 'Rahasia Tiga Wujud Zat',
    gradient: 'from-teal-500 to-cyan-600',
    cp: 'Peserta didik mengidentifikasi benda padat, cair, dan gas beserta perubahannya.',
    topics: ['Wujud Benda', 'Perubahan Wujud'],
    materi: [],
    interaktif: [
      { type: 'flipcard', icon: '🃏', title: 'Kartu Konsep Wujud Zat', screen: 'flipCards' as Screen },
    ],
  },
];

const MEDIA_TEMPLATES = [
  { id: 'matching', icon: '🧩', name: 'Pasang-Pasangkan', desc: 'Siswa mencocokkan konsep dengan definisi / fungsinya', color: 'bg-emerald-100', text: 'text-emerald-700', border: 'border-emerald-200' },
  { id: 'flipcard', icon: '🃏', name: 'Kartu Konsep', desc: 'Kartu balik dua sisi untuk menghafal istilah & penjelasan', color: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-200' },
  { id: 'quiz', icon: '📝', name: 'Kuis Interaktif', desc: 'Buat soal pilihan ganda dengan feedback otomatis dan XP', color: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-200' },
  { id: 'simulasi', icon: '🔬', name: 'Simulasi Virtual', desc: 'Animasi proses sains step-by-step yang interaktif', color: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-200' },
  { id: 'observasi', icon: '🔭', name: 'Lembar Observasi', desc: 'Panduan pengamatan digital terpandu untuk siswa', color: 'bg-rose-100', text: 'text-rose-700', border: 'border-rose-200' },
];

// Drag-drop data — Bab 1: Keajaiban Tubuhku
const PLANT_LEFT = ['👁️ Mata', '👂 Telinga', '👃 Hidung', '👄 Mulut'];
const PLANT_RIGHT = [
  'Untuk mencicipi makanan dan berbicara',
  'Untuk mendengarkan suara sekitar',
  'Untuk melihat keindahan dunia',
  'Untuk bernapas dan mencium bau',
];
// CORRECT_MATCH[leftIdx] = rightIdx
const CORRECT_MATCH: Record<number, number> = { 0: 2, 1: 1, 2: 3, 3: 0 };

// Flip cards — Bab 8: Wujud Zat
const FLIP_CARDS = [
  { front: 'Padat', back: 'Bentuk dan ukurannya tetap. Contoh: Kayu, Batu.' },
  { front: 'Cair', back: 'Bentuk mengikuti wadahnya, ukuran tetap. Contoh: Air, Minyak.' },
  { front: 'Gas', back: 'Bentuk dan ukuran berubah memenuhi ruang. Contoh: Udara.' },
  { front: 'Mencair', back: 'Perubahan padat menjadi cair.' },
  { front: 'Membeku', back: 'Perubahan cair menjadi padat.' },
  { front: 'Menguap', back: 'Perubahan cair menjadi gas.' },
];

// Virtual experiment — Bab 6: Energi
const EXP_STEPS = [
  { step: 1, icon: <Wrench className="w-5 h-5" />, title: 'Siapkan Alat & Bahan', body: 'Siapkan: lilin, korek api, kertas lipat, gunting, dan benang secukupnya.', tip: '• ️ Mintalah bantuan guru saat menyalakan api.' },
  { step: 2, icon: '• ️', title: 'Buat Spiral Kertas', body: 'Gunting kertas lipat melingkar hingga membentuk spiral. Ikat ujungnya dengan benang.', tip: '• Pastikan potongan kertas tidak terlalu tebal.' },
  { step: 3, icon: '• ️', title: 'Nyalakan Lilin', body: 'Nyalakan lilin. Tempatkan kertas spiral di atas api (jangan sampai menyentuh api!).', tip: '• Amati apa yang terjadi pada kertas.' },
  { step: 4, icon: <RefreshCw className="w-5 h-5" />, title: 'Catat Hasil', body: 'Kertas spiral berputar-putar dengan sendirinya ketika berada di atas nyala api lilin.', tip: '• Kenapa kertasnya bisa bergerak berputar?' },
  { step: 5, icon: <Target className="w-5 h-5" />, title: 'Simpulkan!', body: 'Energi panas dari lilin membuat udara bergerak (kinetik), sehingga kertas ikut berputar. Terjadi perubahan energi!', tip: '• Kamu sudah menjadi ilmuwan cilik! Luar biasa!' },
];

// Simulasi Metamorfosis (Bab 4)
const SIM_STEPS = [
  { label: 'Telur', icon: <Egg className="w-5 h-5" />, color: 'text-gray-500', desc: 'Kupu-kupu betina bertelur di daun. Telur ini kecil dan menempel kuat.' },
  { label: 'Ulat', icon: <Bug className="w-5 h-5" />, color: 'text-green-600', desc: 'Telur menetas menjadi ulat. Ulat rakus dan terus memakan daun untuk tumbuh.' },
  { label: 'Kepompong', icon: <TreePine className="w-5 h-5" />, color: 'text-amber-700', desc: 'Ulat membungkus dirinya menjadi kepompong. Di dalam sini, tubuhnya berubah bentuk.' },
  { label: 'Kupu-Kupu', icon: <Bug className="w-5 h-5" />, color: 'text-blue-500', desc: 'Kupu-kupu keluar dari kepompong dengan sayap indah, siap terbang mencari nektar.' },
];

// IPAS Kuis (lintas bab)
const QUIZ_IPAS = [
  { q: 'Bagian tubuh yang berfungsi untuk melihat adalah...', opts: ['Hidung', 'Telinga', 'Mata', 'Kulit'], correct: 2, img: <Eye className="w-5 h-5" /> },
  { q: 'Perubahan ulat menjadi kupu-kupu disebut...', opts: ['Mencair', 'Metamorfosis', 'Menetas', 'Tumbuh'], correct: 1, img: <Bug className="w-5 h-5" /> },
  { q: 'Energi yang dihasilkan oleh setrika adalah energi...', opts: ['Panas', 'Cahaya', 'Bunyi', 'Gerak'], correct: 0, img: <Plug className="w-5 h-5" /> },
  { q: 'Es batu yang dibiarkan di tempat terbuka akan...', opts: ['Membeku', 'Menguap', 'Mengkristal', 'Mencair'], correct: 3, img: <Box className="w-5 h-5" /> },
  { q: 'Membeli barang yang benar-benar kita perlukan disebut belanja...', opts: ['Keinginan', 'Kebutuhan', 'Mewah', 'Boros'], correct: 1, img: <ShoppingCart className="w-5 h-5" /> },
  { q: 'Bagian tumbuhan yang bertugas menyerap air dari dalam tanah adalah...', opts: ['Daun', 'Akar', 'Batang', 'Bunga'], correct: 1, img: <Leaf className="w-5 h-5" /> },
  { q: 'Proses tumbuhan membuat makanannya sendiri dengan bantuan cahaya matahari disebut...', opts: ['Respirasi', 'Transpirasi', 'Fotosintesis', 'Metabolisme'], correct: 2, img: <Sun className="w-5 h-5" /> },
  { q: 'Benda yang dapat ditarik oleh magnet adalah...', opts: ['Kayu', 'Kertas', 'Besi', 'Plastik'], correct: 2, img: <Magnet className="w-5 h-5" /> },
  { q: 'Contoh hewan karnivora (pemakan daging) adalah...', opts: ['Sapi', 'Harimau', 'Kambing', 'Kelinci'], correct: 1, img: <Cat className="w-5 h-5" /> },
  { q: 'Perubahan wujud dari cair menjadi gas saat air mendidih disebut...', opts: ['Menguap', 'Mencair', 'Membeku', 'Menyublim'], correct: 0, img: '• ️' },
  { q: 'Matahari terbit dari sebelah...', opts: ['Timur', 'Barat', 'Utara', 'Selatan'], correct: 0, img: <Sunrise className="w-5 h-5" /> },
  { q: 'Fungsi utama daun pada tumbuhan adalah...', opts: ['Menyerap air', 'Tempat fotosintesis', 'Menyokong batang', 'Menarik serangga'], correct: 1, img: <Leaf className="w-5 h-5" /> },
  { q: 'Benda langit yang bersinar sendiri dan menjadi pusat tata surya adalah...', opts: ['Bulan', 'Bintang', 'Matahari', 'Meteor'], correct: 2, img: <Sun className="w-5 h-5" /> },
  { q: 'Tempat bertemunya penjual dan pembeli untuk melakukan jual beli disebut...', opts: ['Sekolah', 'Pasar', 'Rumah Sakit', 'Taman'], correct: 1, img: <Store className="w-5 h-5" /> },
  { q: 'Semboyan negara kita "Bhinneka Tunggal Ika" memiliki arti...', opts: ['Bersatu kita teguh', 'Berbeda-beda tetapi tetap satu jua', 'Satu Nusa Satu Bangsa', 'Merdeka atau Mati'], correct: 1, img: '🇮🇩' }
];

// SAINS SPRINT — arena adu-cepat pernyataan Benar/Salah (lintas bab IPAS)
const ARENA_STATEMENTS = [
  { s: 'Hidung berfungsi untuk mencium bau.', benar: true, bab: 'Tubuh', emoji: <Smile className="w-5 h-5" /> },
  { s: 'Air termasuk benda padat.', benar: false, bab: 'Wujud Zat', emoji: <Droplet className="w-5 h-5" /> },
  { s: 'Kepompong adalah salah satu fase dalam daur hidup kupu-kupu.', benar: true, bab: 'Siklus Hidup', emoji: <Bug className="w-5 h-5" /> },
  { s: 'Kipas angin menghasilkan energi panas.', benar: false, bab: 'Energi', emoji: <Wind className="w-5 h-5" /> },
  { s: 'Mainan adalah contoh kebutuhan utama.', benar: false, bab: 'Kebutuhan', emoji: <ToyBrick className="w-5 h-5" /> },
  { s: 'Tolong menolong termasuk perbuatan terpuji.', benar: true, bab: 'Berbagi', emoji: <Handshake className="w-5 h-5" /> },
  { s: 'Matahari merupakan sumber energi.', benar: true, bab: 'Energi', emoji: <Sun className="w-5 h-5" /> },
  { s: 'Benda gas tidak memiliki bentuk.', benar: true, bab: 'Wujud Zat', emoji: <Wind className="w-5 h-5" /> },
  { s: 'Uang digunakan sebagai alat tukar.', benar: true, bab: 'Belanja', emoji: <DollarSign className="w-5 h-5" /> },
  { s: 'Denah membantu kita mencari lokasi.', benar: true, bab: 'Penjelajah', emoji: '• ️' },
];

const UPLOADED_FILES = [
  { icon: <FileText className="w-5 h-5" />, name: 'Rangkuman_Bab1_Tubuhku.pdf', size: '1.2 MB', bab: 'Bab 1', status: 'Aktif' },
  { icon: <Film className="w-5 h-5" />, name: 'Video_Siklus_Kupu_Kupu.mp4', size: '45 MB', bab: 'Bab 4', status: 'Aktif' },
  { icon: '• ️', name: 'Infografis_Wujud_Zat.png', size: '800 KB', bab: 'Bab 8', status: 'Draf' },
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
  const [uploadType, setUploadType] = useState('text'); // default to text for prototype
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadContent, setUploadContent] = useState(''); // New state for pasted text
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [isUploadingDB, setIsUploadingDB] = useState(false);

  // Firestore Data State
  const [dbMaterials, setDbMaterials] = useState<any[]>([]);
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  
  // User Profile State
  const [userProfile, setUserProfile] = useState<{ xp: number; coins: number; completedModules: Record<number, string[]> }>({ xp: 0, coins: 0, completedModules: {} });

  // Handle Authentication and load profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserProfile({ xp: data.xp || 0, coins: data.coins || 0, completedModules: data.completedModules || {} });
          } else {
            const defaultProfile = { xp: 0, coins: 0, completedModules: {} };
            await setDoc(docRef, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (e) { console.error("Error fetching user profile", e); }
      } else {
        setUserProfile({ xp: 0, coins: 0 });
      }
    });
    return () => unsubscribe();
  }, []);

  const addXP = async (amount: number) => {
    const user = auth.currentUser;
    if (!user) return;
    const newXP = userProfile.xp + amount;
    setUserProfile(prev => ({ ...prev, xp: newXP }));
    try {
      await setDoc(doc(db, 'users', user.uid), { xp: newXP }, { merge: true });
    } catch (e) { console.error("Error saving XP", e); }
  };

  const markCompleted = async (babId: number, moduleName: string) => {
    const user = auth.currentUser;
    if (!user) return;
    
    if (userProfile.completedModules[babId]?.includes(moduleName)) return;

    setUserProfile(prev => {
      const prevMods = prev.completedModules[babId] || [];
      if (prevMods.includes(moduleName)) return prev;

      const newMods = [...prevMods, moduleName];
      const newCompletedModules = { ...prev.completedModules, [babId]: newMods };
      
      setDoc(doc(db, 'users', user.uid), { completedModules: newCompletedModules }, { merge: true })
        .catch(e => console.error("Error saving completed modules", e));
        
      return { ...prev, completedModules: newCompletedModules };
    });
  };

  // Fetch Firestore Data when screen changes to avoid manual refresh
  useEffect(() => {
    if (['detailBab', 'teacherDash', 'studentHome', 'progressSiswa', 'kelolaBab'].includes(screen)) {
      const fetchDb = async () => {
        try {
          const snapMaterials = await getDocs(query(collection(db, 'materials')));
          setDbMaterials(snapMaterials.docs.map(d => ({ id: d.id, ...d.data() })));
          
          if (['teacherDash', 'progressSiswa', 'kelolaBab'].includes(screen)) {
            const snapUsers = await getDocs(query(collection(db, 'users')));
            setDbUsers(snapUsers.docs.map(d => ({ id: d.id, ...d.data() })));
          }
        } catch (e) {
          console.error(e);
        }
      };
      fetchDb();
    }
  }, [screen]);

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
      icon: <Microscope className="w-5 h-5" />,
      iconBg: 'bg-white/20',
      tag: 'IPAS Kelas 3 · Kurikulum Merdeka',
      title: 'Belajar IPAS\nJadi Seru!',
      body: 'Platform belajar digital yang dirancang khusus untuk siswa Kelas 3 SD — sesuai Kurikulum Merdeka 2024.',
      detail: ['• 8 Bab Pembelajaran', ' <Gamepad2 className="w-5 h-5" />  Media Interaktif', '• Proyek P5'],
    },
    {
      bg: 'from-violet-600 via-purple-600 to-indigo-700',
      icon: <Sparkles className="w-5 h-5" />,
      iconBg: 'bg-white/20',
      tag: 'Untuk Guru',
      title: 'Guru Lebih\nMudah Mengajar',
      body: 'Upload materi PDF, video, dan gambar. Buat kuis, kartu konsep, simulasi virtual, dan media interaktif langsung dari aplikasi.',
      detail: ['• Upload PDF & Video', '• Buat Media Interaktif', ' <BarChart2 className="w-5 h-5" />  Pantau Progress Siswa'],
    },
    {
      bg: 'from-green-600 via-emerald-600 to-teal-700',
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: 'bg-white/20',
      tag: 'Untuk Siswa',
      title: 'Eksplorasi,\nCoba & Pahami!',
      body: 'Pelajari materi lewat video interaktif, percobaan virtual, simulasi, dan kartu konsep yang menyenangkan.',
      detail: ['• Percobaan Virtual', '• Kartu Konsep Flip', '• Simulasi Siklus Air'],
    },
    {
      bg: 'from-amber-500 via-orange-500 to-rose-600',
      icon: <Leaf className="w-5 h-5" />,
      iconBg: 'bg-white/20',
      tag: 'Proyek Nyata',
      title: 'Belajar dengan\nProyek P5',
      body: 'Kuatkan Profil Pelajar Pancasila melalui proyek nyata — dari perencanaan, riset, kreasi, hingga presentasi!',
      detail: ['• Fase Proyek Terstruktur', '• Observasi Lapangan', '• ️ Presentasi Karya'],
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
    else {
      addXP(quizCorrect * 10);
      markCompleted(BAB_LIST[currentBabIdx].id, 'kuis');
      navigate('hasilKuis');
    }
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
        { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Beranda' },
        { id: 'bab', icon: <Library className="w-5 h-5" />, label: 'Bab' },
        { id: 'aktivitas', icon: <Gamepad2 className="w-5 h-5" />, label: 'Aktivitas' },
        { id: 'proyek', icon: <Leaf className="w-5 h-5" />, label: 'Proyek P5' },
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
    <div className="bg-white border-t border-gray-100 px-2 py-2 flex justify-around items-center flex-shrink-0">
      {[
        { id: 'home', icon: <Home className="w-5 h-5" />, label: 'Home' },
        { id: 'statistik', icon: <TrendingUp className="w-5 h-5" />, label: 'Statistik' },
        { id: 'pengaturan', icon: <Settings className="w-5 h-5" />, label: 'Pengaturan' },
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
            className={`flex flex-col items-center gap-1 px-8 py-2 rounded-2xl transition-all ${isActive ? 'bg-sky-50' : ''}`}>
            <span className={`${isActive ? 'text-sky-600' : 'text-gray-400'}`}>{t.icon}</span>
            <span className={`text-[10px] font-bold ${isActive ? 'text-sky-600' : 'text-gray-400'}`}>{t.label}</span>
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
    <div className="h-full bg-white flex flex-col overflow-hidden relative">
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
                { e: <Leaf className="w-5 h-5" />, label: 'Tumbuhan', a: -70, r: 110 },
                { e: <TestTube className="w-5 h-5" />, label: 'Wujud Zat', a: -20, r: 125 },
                { e: <Zap className="w-5 h-5" />, label: 'Gaya', a: 30, r: 120 },
                { e: <Battery className="w-5 h-5" />, label: 'Energi', a: 75, r: 108 },
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
                   <Globe className="w-5 h-5" /> 
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
                Jelajah Ilmu Alam<br/>& Sosial
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
                <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                   <School className="w-10 h-10 text-white" />
                </div>

                {[
                  { icon: <Upload className="w-5 h-5" />, text: 'Upload Materi', color: 'from-sky-500 to-blue-600', pos: '-top-4 -left-28', delay: '0s' },
                  { icon: <Sparkles className="w-5 h-5" />, text: 'Buat Interaktif', color: 'from-violet-500 to-purple-600', pos: 'top-0 -right-28', delay: '0.2s' },
                  { icon: <BarChart2 className="w-5 h-5" />, text: 'Pantau Siswa', color: 'from-emerald-500 to-teal-600', pos: 'bottom-0 -left-24', delay: '0.4s' },
                  { icon: <Puzzle className="w-5 h-5" />, text: 'Kuis & Game', color: 'from-amber-500 to-orange-500', pos: 'bottom-4 -right-24', delay: '0.6s' },
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
                Manajemen Kelas<br/>Lebih Mudah
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
                  { icon: <Puzzle className="w-5 h-5" />, title: 'Drag & Drop', sub: 'Cocokkan bagian', color: 'from-green-500 to-emerald-600', delay: '0s' },
                  { icon: '🃏', title: 'Kartu Konsep', sub: 'Balik & pelajari', color: 'from-blue-500 to-cyan-500', delay: '0.15s' },
                  { icon: <Telescope className="w-5 h-5" />, title: 'Eksperimen', sub: 'Coba virtual', color: 'from-violet-500 to-purple-600', delay: '0.3s' },
                  { icon: <Waves className="w-5 h-5" />, title: 'Simulasi Air', sub: 'Animasi interaktif', color: 'from-sky-500 to-blue-600', delay: '0.45s' },
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
                Belajar Sambil<br/>Bermain!
              </h2>
              <p className="text-white/70 text-xs leading-relaxed px-4">
                Video interaktif, percobaan virtual, simulasi — belajar tidak lagi membosankan.
              </p>
            </div>
          </div>

          {/* Slide 4: Final */}
          <div className={`absolute inset-0 flex flex-col transition-opacity duration-500 ${onboardSlide === 3 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            <div className="flex-1 relative flex flex-col items-center justify-center pt-8">
              {[<Leaf className="w-5 h-5" />, <Star className="w-5 h-5" />, <Microscope className="w-5 h-5" />, '✦', <TestTube className="w-5 h-5" />, '✦', <Zap className="w-5 h-5" />, <Star className="w-5 h-5" />].map((p, i) => (
                <div key={i} className="absolute text-xl select-none"
                  style={{ left: `${15 + i * 10}%`, top: `${20 + (i % 3) * 20}%`, animation: `floatX ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`, opacity: 0.6 }}>{p}</div>
              ))}

              <div className="relative z-10 text-center mt-6">
                <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto mb-4 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.4)', animation: 'float 3s ease-in-out infinite' }}>
                   <Rocket className="w-5 h-5" /> 
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
                Ayo Mulai<br/>Sekarang!
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
                <div className="flex justify-center mb-2"><Brain className="w-6 h-6" /></div>
                <p className="font-bold text-emerald-800 text-sm mb-1">Berpikir Kritis</p>
                <p className="text-emerald-600 text-xs">Melalui simulasi & eksperimen virtual.</p>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
                <div className="flex justify-center mb-2"><Leaf className="w-6 h-6" /></div>
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
                <div className="absolute -right-4 -top-4 opacity-10"><User className="w-24 h-24 text-teal-800" /></div>
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
                <div className="absolute -right-4 -top-4 opacity-10"><School className="w-24 h-24 text-blue-800" /></div>
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
              <Eye className="w-6 h-6 animate-bounce inline-block" />
            </div>
            {/* Seamless Marquee Container */}
            <div className="relative overflow-hidden w-full" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex gap-3 w-max animate-marquee">
                {[
                  { title: 'Tumbuhan', emoji: <Leaf className="w-5 h-5" />, color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: <TestTube className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: <Zap className="w-5 h-5" />, color: 'bg-violet-100 text-violet-700' },
                  { title: 'Energi', emoji: <Lightbulb className="w-5 h-5" />, color: 'bg-amber-100 text-amber-700' },
                  // Duplicate items to create seamless loop
                  { title: 'Tumbuhan', emoji: <Leaf className="w-5 h-5" />, color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: <TestTube className="w-5 h-5" />, color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: <Zap className="w-5 h-5" />, color: 'bg-violet-100 text-violet-700' },
                  { title: 'Energi', emoji: <Lightbulb className="w-5 h-5" />, color: 'bg-amber-100 text-amber-700' },
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
                <div className="flex justify-center mb-2"><Lightbulb className="w-7 h-7" /></div>
                <p className="text-emerald-800 text-sm font-medium leading-relaxed italic">
                  "Pembelajaran yang bermakna adalah ketika siswa bisa melihat, menyentuh, dan berinteraksi langsung dengan ilmu yang mereka pelajari."
                </p>
              </div>
            </div>
          </ScrollReveal>
          
          {/* Footer KKN / Copyright */}
          {/* Footer KKN / Copyright */}
          <ScrollReveal delay={300}>
            <div className="relative mt-12 mb-6 p-6 sm:p-8 rounded-[2rem] bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-100/50 shadow-xl shadow-indigo-100/40 overflow-hidden text-center group/footer">
              {/* Background animated glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-300/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover/footer:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-sky-300/40 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-emerald-200/40 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.25em] mb-6 relative z-10 drop-shadow-sm">Didukung Oleh</p>
              
              <div className="flex gap-4 sm:gap-6 items-center justify-center mb-6 relative z-10">
                <div className="w-16 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm shadow-indigo-100 p-2.5 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 hover:border-indigo-200 hover:bg-white group">
                  <img src="/logo-kemendikbud.png" alt="Kemendikbud" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                
                <div className="w-16 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm shadow-indigo-100 p-2.5 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 hover:border-indigo-200 hover:bg-white group">
                  <img src="/logo-unesa.png" alt="UNESA" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>

                <div className="w-16 h-16 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl border border-white shadow-sm shadow-indigo-100 p-2.5 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg hover:shadow-indigo-200 hover:border-indigo-200 hover:bg-white group">
                  <img src="/logo-kkn.png" alt="KKN Gubugklakah" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
              </div>
              
              <div className="w-12 h-1 rounded-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent mx-auto mb-6 relative z-10"></div>
              
              <p className="text-indigo-900 text-xs font-bold mb-2 relative z-10 flex items-center justify-center gap-1">Hak Cipta <Copyright className="w-3.5 h-3.5 text-indigo-400" /> 2026</p>
              <p className="text-indigo-600/70 text-[10px] leading-relaxed max-w-[280px] mx-auto relative z-10">
                Aplikasi ini dikembangkan sebagai bagian dari <br />
                <span className="font-bold text-indigo-800">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
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
          Masuk ke Aplikasi <span className="text-xl"> <Rocket className="w-5 h-5" /> </span>
        </button>
      </div>
    </div>
  );

  // ── 0a. SPLASH ────────────────────────────────────────────────────────────
  if (screen === 'splash') return (
    <div className="h-full flex flex-col items-center justify-center overflow-hidden relative"
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
        { emoji: <Leaf className="w-5 h-5" />, top: '12%', left: '8%', size: 'w-14 h-14', dur: '3.2s', delay: '0s' },
        { emoji: <TestTube className="w-5 h-5" />, top: '18%', right: '10%', size: 'w-12 h-12', dur: '2.8s', delay: '0.4s' },
        { emoji: <Zap className="w-5 h-5" />, top: '55%', left: '5%', size: 'w-11 h-11', dur: '3.8s', delay: '0.8s' },
        { emoji: <Battery className="w-5 h-5" />, bottom: '20%', right: '8%', size: 'w-14 h-14', dur: '3.1s', delay: '0.2s' },
        { emoji: <Globe className="w-5 h-5" />, bottom: '35%', left: '12%', size: 'w-12 h-12', dur: '4s', delay: '1s' },
        { emoji: <ShoppingCart className="w-5 h-5" />, top: '42%', right: '6%', size: 'w-10 h-10', dur: '2.6s', delay: '0.6s' },
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
             <Microscope className="w-5 h-5" /> 
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
            <p className="text-emerald-200 font-black text-sm tracking-[0.3em] uppercase">Kelas 3</p>
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
    <div className="h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex flex-col items-center justify-center px-6 overflow-hidden">
      <div className="text-center mb-10">
        <div className="w-24 h-24 bg-white/20 rounded-[2rem] flex items-center justify-center text-5xl mx-auto mb-5 backdrop-blur-sm" style={{ animation: 'float 3s ease-in-out infinite' }}> <Microscope className="w-5 h-5" /> </div>
        <h1 className="text-4xl font-display text-white mb-1">IPAS Kelas 3</h1>
        <p className="text-emerald-100 font-medium">Platform Belajar Kurikulum Merdeka</p>
      </div>
      <div className="w-full space-y-4">
        <button onClick={() => { navigate('loginGuru'); }}
          className="w-full bg-white rounded-3xl p-5 flex items-center gap-4 shadow-2xl active:scale-95 transition-transform">
          <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center flex-shrink-0"><School className="w-8 h-8" /></div>
          <div className="flex-1 text-left">
            <p className="font-display text-gray-800 text-xl">Masuk sebagai Guru</p>
            <p className="text-gray-500 text-sm">Upload materi & buat media interaktif</p>
          </div>
        </button>
        <button onClick={() => { navigate('loginSiswa'); }}
          className="w-full bg-white/20 backdrop-blur-sm rounded-3xl p-5 flex items-center gap-4 border border-white/30 active:scale-95 transition-transform">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0"><GraduationCap className="w-8 h-8" /></div>
          <div className="flex-1 text-left">
            <p className="font-display text-white text-xl">Masuk sebagai Siswa</p>
            <p className="text-emerald-100 text-sm">Belajar & eksplorasi materi IPAS</p>
          </div>
        </button>
      </div>
      <div className="mt-8 text-center opacity-80">
        <p className="text-white text-xs font-bold mb-1 flex items-center justify-center gap-1">Hak Cipta <Copyright className="w-4 h-4 text-emerald-100" /> 2026</p>
        <p className="text-emerald-100 text-[10px] leading-relaxed max-w-[250px] mx-auto">
          Aplikasi ini dikembangkan sebagai bagian dari <br />
          <span className="font-semibold text-white">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
        </p>
      </div>
    </div>
  );

  // ── 1a. LOGIN GURU ─────────────────────────────────────────────────────────
  if (screen === 'loginGuru') {
    const handleLogin = async () => {
      if (!loginUser || !loginPass) {
        setLoginError('Email dan password harus diisi.');
        return;
      }
      if (parseInt(captchaInput) !== captcha.n1 + captcha.n2) {
        setLoginError('Hitungan CAPTCHA salah. Coba lagi!');
        setCaptcha({ n1: Math.floor(Math.random() * 10) + 1, n2: Math.floor(Math.random() * 10) + 1 });
        setCaptchaInput('');
        return;
      }

      const email = loginUser.includes('@') ? loginUser : loginUser.split(' ').join('').toLowerCase() + '@guru.sekolah.com';
      try {
        await signInWithEmailAndPassword(auth, email, loginPass);
        navigate('teacherDash');
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, loginPass);
            await updateProfile(auth.currentUser!, { displayName: loginUser.split('@')[0] });
            navigate('teacherDash');
          } catch (err2: any) {
            if (err2.code === 'auth/email-already-in-use') {
              setLoginError('Password salah! Jika lupa password, silakan hubungi tim dukungan IT.');
            } else {
              setLoginError('Gagal masuk/daftar: ' + err2.message);
            }
          }
        } else if (error.code === 'auth/invalid-email') {
          setLoginError('Format email tidak valid. Gunakan format nama@sekolah.com');
        } else {
          setLoginError('Error: ' + error.message);
        }
      }
    };

    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs font-semibold tracking-wider">Akses Khusus</p>
              <p className="text-white font-display text-xl flex items-center gap-2">Login Guru <School className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            
            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-50">
               <span className="text-5xl"> <Lock className="w-5 h-5" /> </span>
            </div>

            <h2 className="font-display text-2xl text-gray-800 mb-6 text-center mt-10">Masuk Dashboard</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2 border border-red-100">
                <span className="text-lg"> <AlertTriangle className="w-5 h-5" /> ️</span> {loginError}
              </div>
            )}

            <div className="space-y-5">
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
                <div className="text-right mt-2">
                  <button type="button" onClick={() => navigate('forgotPassword')} className="text-sm font-bold text-sky-600 hover:text-sky-700">Lupa password?</button>
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
                    className="w-24 bg-white border-2 border-indigo-100 rounded-xl px-4 py-3 text-base outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-black text-indigo-700 text-center" placeholder="?" />
                  <button type="button" onClick={() => setCaptcha({ n1: Math.floor(Math.random() * 10) + 1, n2: Math.floor(Math.random() * 10) + 1 })}
                    className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-400 rounded-xl hover:bg-sky-50 hover:text-sky-600 active:scale-95 transition-all">
                    <RefreshCw className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <button onClick={handleLogin} className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 1x. LUPA PASSWORD ───────────────────────────────────────────────────────
  if (screen === 'forgotPassword') {
    const handleReset = async () => {
      if (!loginUser) {
        setLoginError('Masukkan email Anda terlebih dahulu.');
        return;
      }
      try {
        await sendPasswordResetEmail(auth, loginUser);
        setLoginError('Tautan reset password telah dikirim ke email Anda! Silakan cek kotak masuk atau folder spam.');
      } catch (error: any) {
        setLoginError('Gagal mengirim tautan: ' + error.message);
      }
    };

    return (
      <div className="h-full bg-gray-50 flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-200 text-xs font-semibold tracking-wider">Pemulihan Akun</p>
              <p className="text-white font-display text-xl">Lupa Password <Lock className="w-5 h-5" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            <p className="text-gray-600 text-sm mb-6 text-center">
              Masukkan email akun Anda. Kami akan mengirimkan tautan untuk mengatur ulang password Anda.
            </p>
            
            {loginError && (
              <div className={`p-4 rounded-xl text-sm font-bold mb-6 text-center ${loginError.includes('Tautan reset') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                {loginError}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase tracking-wide">Email</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <Mail className="w-5 h-5" /> </span>
                  <input type="email" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition-all font-medium text-gray-700" placeholder="Masukkan email Anda..." />
                </div>
              </div>
            </div>

            <button onClick={handleReset} className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              Kirim Tautan Reset
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 1b. LOGIN SISWA ─────────────────────────────────────────────────────────
  if (screen === 'loginSiswa') {
    const handleLoginSiswa = async () => {
      if (!loginUser || !loginPass) {
        setLoginError('Email dan password harus diisi.');
        return;
      }
      const email = loginUser.includes('@') ? loginUser : loginUser.split(' ').join('').toLowerCase() + '@siswa.sekolah.com';
      try {
        await signInWithEmailAndPassword(auth, email, loginPass);
        setScreens(['studentHome']);
        setActiveTab('home');
      } catch (error: any) {
        if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
          try {
            await createUserWithEmailAndPassword(auth, email, loginPass);
            await updateProfile(auth.currentUser!, { displayName: loginUser.split('@')[0] });
            setScreens(['studentHome']);
            setActiveTab('home');
          } catch (err2: any) {
            if (err2.code === 'auth/email-already-in-use') {
              setLoginError('Password salah! Jika kamu lupa password, minta tolong Guru untuk membantu mengatur ulang.');
            } else {
              setLoginError('Gagal masuk/daftar: ' + err2.message);
            }
          }
        } else if (error.code === 'auth/invalid-email') {
          setLoginError('Format email tidak valid. Gunakan format nama@sekolah.com');
        } else {
          setLoginError('Error: ' + error.message);
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
              <p className="text-white font-display text-xl flex items-center gap-2">Login Siswa <GraduationCap className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative">
            <h2 className="font-display text-2xl text-gray-800 mb-6 text-center mt-2">Mulai Belajar</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center">
                {loginError}
              </div>
            )}

            <div className="space-y-5">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Email Siswa</label>
                <input type="email" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="siswa@sekolah.com" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Password (Min 6)</label>
                <input type="password" value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" placeholder="••••••••" />
              </div>
            </div>

            <button onClick={handleLoginSiswa} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold mt-8 shadow-lg shadow-emerald-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              Masuk / Daftar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 2. TEACHER DASHBOARD ───────────────────────────────────────────────────
  if (screen === 'teacherDash') {
    const totalMateri = dbMaterials.length;
    const totalInteraktif = BAB_LIST.reduce((acc, bab) => acc + bab.interaktif.length, 0);
    const totalSiswa = dbUsers.length > 0 ? dbUsers.length - 1 : 0; // Exclude teacher if present

    const getClassProgress = (babId: number, hasInteraktif: boolean) => {
      if (totalSiswa <= 0) return 0;
      const totalNodes = hasInteraktif ? 4 : 3;
      let totalProgress = 0;
      let countSiswa = 0;
      
      dbUsers.forEach(u => {
        // Simple logic to skip teacher accounts
        if (u.id === auth.currentUser?.uid) return;
        countSiswa++;
        
        const completed = u.completedModules?.[babId] || [];
        let count = 0;
        if (completed.includes('materi')) count++;
        if (completed.includes('interaktif')) count++;
        if (completed.includes('kuis')) count++;
        if (completed.includes('proyek')) count++;
        totalProgress += (count / totalNodes) * 100;
      });
      
      return countSiswa > 0 ? Math.round(totalProgress / countSiswa) : 0;
    };

    return (
    <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-7 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"><School className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-sky-200 text-xs font-semibold">Selamat datang,</p>
              <p className="text-white font-display text-xl">{auth.currentUser?.displayName || 'Guru'}  <Hand className="w-5 h-5" /> </p>
            </div>
          </div>
          <button onClick={() => { signOut(auth); setScreens(['roleSelect']); }} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm">Keluar</button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Materi', value: totalMateri, icon: <Folder className="w-5 h-5" /> },
            { label: 'Interaktif', value: totalInteraktif, icon: <Gamepad2 className="w-5 h-5" /> },
            { label: 'Siswa Aktif', value: totalSiswa, icon: <Users className="w-5 h-5" /> },
          ].map((s, i) => (
            <div key={i} className="bg-white/20 rounded-2xl p-3 text-center backdrop-blur-sm">
              <div className="flex justify-center mb-1 text-white/80">{s.icon}</div>
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
              { icon: <Upload className="w-5 h-5" />, label: 'Upload Materi', sub: 'PDF, Video, Gambar', color: 'from-sky-500 to-blue-600', action: () => { setUploadStep(0); setUploadChapter(''); setUploadType(''); setUploadTitle(''); setUploadDone(false); navigate('uploadMateri'); } },
              { icon: <Sparkles className="w-5 h-5" />, label: 'Buat Interaktif', sub: 'Kuis, Cocokkan, Simulasi', color: 'from-violet-500 to-purple-600', action: () => { setSelectedTemplate(''); navigate('buatInteraktif'); } },
              { icon: <BarChart2 className="w-5 h-5" />, label: 'Progress Siswa', sub: 'Lihat analitik kelas', color: 'from-emerald-500 to-teal-600', action: () => navigate('progressSiswa') },
              { icon: <ClipboardList className="w-5 h-5" />, label: 'Kelola Bab', sub: 'Atur urutan materi', color: 'from-amber-500 to-orange-500', action: () => navigate('kelolaBab') },
            ].map((a, i) => (
              <button key={i} onClick={a.action}
                className={`bg-gradient-to-br ${a.color} rounded-3xl p-4 text-left active:scale-95 transition-transform`}>
                <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center text-white mb-3">{a.icon}</div>
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
            {dbMaterials.length > 0 ? dbMaterials.slice(-3).reverse().map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 bg-sky-100 rounded-xl flex items-center justify-center text-sky-600 flex-shrink-0"><FileText className="w-5 h-5" /></div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-700 text-sm truncate">{f.title}</p>
                  <p className="text-gray-400 text-xs">{f.chapter} · {f.createdAt ? new Date(f.createdAt.seconds * 1000).toLocaleDateString() : 'Baru saja'}</p>
                </div>
                <span className="text-xs font-bold px-2 py-1 rounded-full bg-emerald-100 text-emerald-700">Aktif</span>
              </div>
            )) : (
              <div className="bg-white rounded-2xl p-5 text-center text-gray-400 text-sm shadow-sm border border-gray-100">
                Belum ada materi yang diunggah.
              </div>
            )}
          </div>
        </div>

        {/* Chapter completion */}
        <div>
          <p className="font-display text-gray-700 mb-3">Progres Kelas per Bab</p>
          <div className="bg-white rounded-3xl p-4 shadow-sm space-y-3">
            {BAB_LIST.slice(0, 4).map((b, i) => {
              const p = getClassProgress(b.id, b.interaktif.length > 0);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span>{b.emoji}</span>
                      <span className="text-gray-700 text-sm font-semibold truncate max-w-[160px]">Bab {b.id}</span>
                    </div>
                    <span className="text-gray-500 text-xs font-bold">{p}%</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full bg-gradient-to-r ${b.gradient}`} style={{ width: `${p}%` }} />
                  </div>
                </div>
              );
            })}
            <p className="text-gray-400 text-xs text-center mt-2">Bab 5–8 belum dimulai</p>
          </div>
        </div>
        <div className="h-2" />
      </div>
      <TeacherBottomNav />
    </div>
    );
  }

  // ── X. PENGATURAN GURU ───────────────────────────────────────────────────
  if (screen === 'pengaturanGuru') return (
    <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <p className="text-white font-display text-xl">Pengaturan  <Settings className="w-5 h-5" /> ️</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
        {/* Profil Sekolah */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center"><School className="w-8 h-8 text-sky-600" /></div>
            <div>
              <p className="font-display text-gray-800 text-lg">Bu Sari</p>
              <p className="text-sky-600 text-sm font-bold">Guru IPAS Kelas 3</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">Asal Sekolah</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400"> <School className="w-5 h-5" /> </span>
                <p className="text-gray-700 font-medium">SDN 01 Nusantara Raya</p>
              </div>
            </div>
            <div>
              <p className="text-gray-400 text-xs font-bold uppercase mb-1">NIP / ID Pegawai</p>
              <div className="flex items-center gap-2">
                <span className="text-gray-400"> <Hash className="w-5 h-5" /> </span>
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
      { id: 'pdf', icon: <FileText className="w-5 h-5" />, label: 'PDF / Dokumen', ext: '.pdf, .doc' },
      { id: 'video', icon: <Film className="w-5 h-5" />, label: 'Video', ext: '.mp4, .mov' },
      { id: 'image', icon: '• ️', label: 'Gambar / Foto', ext: '.jpg, .png' },
      { id: 'ppt', icon: <BarChart2 className="w-5 h-5" />, label: 'Presentasi', ext: '.pptx, .key' },
    ];
    return (
      <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
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
              <p className="font-display text-gray-700 text-base mb-3">Pilih metode pembuatan materi</p>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => { setUploadType('text'); setUploadStep(2); }}
                  className={`p-5 rounded-3xl flex items-center text-left border-2 transition-all active:scale-95 bg-white border-transparent shadow-sm hover:border-sky-300`}>
                  <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mr-4 flex-shrink-0"><PenTool className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Ketik Manual (Word-like)</p>
                    <p className="text-gray-400 text-xs mt-1">Ketik langsung dengan editor teks berwarna.</p>
                  </div>
                </button>
                <button onClick={() => { setUploadType('file'); setUploadStep(2); }}
                  className={`p-5 rounded-3xl flex items-center text-left border-2 transition-all active:scale-95 bg-white border-transparent shadow-sm hover:border-sky-300`}>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 flex-shrink-0"><Upload className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Upload File (TXT, PDF, Gambar)</p>
                    <p className="text-gray-400 text-xs mt-1">Unggah file materi dari perangkat Anda.</p>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Content zone */}
          {uploadStep === 2 && uploadType === 'text' && (
            <div>
              <p className="font-display text-gray-700 text-base mb-1">Ketik & Format Materi</p>
              <p className="text-gray-400 text-xs mb-3">Kamu bisa menggunakan opsi bold, italic, dan mengatur font seperti di Word.</p>
              <SimpleRichTextEditor 
                value={uploadContent} 
                onChange={val => { setUploadContent(val); setUploadDone(val.replace(/<[^>]*>?/gm, '').trim().length > 10); }}
              />
            </div>
          )}

          {uploadStep === 2 && uploadType === 'file' && (
            <div>
              <p className="font-display text-gray-700 text-base mb-3">Upload File Materi</p>
              {!uploadDone ? (
                <label className="w-full flex flex-col items-center justify-center px-5 py-10 rounded-[2rem] bg-white border-2 border-dashed border-sky-300 hover:border-sky-500 cursor-pointer shadow-sm transition-all group">
                  <span className="text-5xl mb-4 group-hover:scale-110 transition-transform"> <FileText className="w-5 h-5" /> </span>
                  <p className="font-bold text-gray-700 text-sm mb-1">Klik untuk memilih file</p>
                  <p className="text-gray-400 text-xs text-center">Mendukung file TXT, Gambar, PDF, Word</p>
                  <input type="file" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    if (file.type.includes('text') || file.name.endsWith('.txt')) {
                      const reader = new FileReader();
                      reader.onload = (e) => { 
                        const txt = e.target?.result as string;
                        setUploadContent(txt.replace(/\n/g, '<br/>')); 
                        setUploadType('text'); // Beralih ke editor teks!
                        setUploadDone(true);
                      };
                      reader.readAsText(file);
                    } else {
                      const html = `<div class="p-4 bg-sky-50 rounded-xl text-center border-2 border-dashed border-sky-300 my-4 max-w-sm mx-auto shadow-sm">
                        <span class="text-4xl block mb-2"> <Paperclip className="w-5 h-5" /> </span>
                        <p class="font-bold text-sky-800 text-sm">File Materi Terlampir</p>
                        <p class="text-xs text-sky-600 mt-1">${file.name} (${(file.size/1024).toFixed(1)} KB)</p>
                        <button class="mt-3 px-4 py-2.5 bg-sky-600 text-white rounded-lg text-xs font-bold w-full shadow-md active:scale-95 transition-transform">Buka File Terlampir</button>
                      </div>`;
                      setUploadContent(html);
                      setUploadDone(true);
                    }
                  }} />
                </label>
              ) : (
                <div className="mt-4 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-4 shadow-sm">
                  <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 shadow-sm">✓</div>
                  <div>
                    <p className="font-bold text-emerald-800 text-base mb-0.5">File berhasil disiapkan!</p>
                    <p className="text-emerald-600 text-xs">Silakan lanjutkan ke konfigurasi materi.</p>
                  </div>
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
                <span className="text-xl"> <Bell className="w-5 h-5" /> </span>
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
          {uploadStep < 3 && uploadStep !== 1 ? (
            <button
              onClick={() => {
                if (uploadStep === 0 && !uploadChapter) return;
                if (uploadStep === 2 && !uploadDone) return;
                setUploadStep(s => s + 1);
              }}
              className={`w-full py-4 rounded-2xl font-display text-base transition-all ${
                (uploadStep === 0 && uploadChapter) || (uploadStep === 2 && uploadDone)
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-200 active:scale-95'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}>
              Lanjut →
            </button>
          ) : uploadStep === 3 ? (
            <button onClick={async () => {
                if (!uploadTitle || !uploadContent) return;
                setIsUploadingDB(true);
                try {
                  await addDoc(collection(db, 'materials'), {
                    chapter: uploadChapter, // e.g. "Bab 1"
                    title: uploadTitle,
                    desc: uploadDesc,
                    content: uploadContent,
                    createdAt: serverTimestamp()
                  });
                  setUploadStep(0);
                  setUploadChapter('');
                  setUploadTitle('');
                  setUploadDesc('');
                  setUploadContent('');
                  setUploadDone(false);
                  setScreens(['teacherDash']);
                } catch (e) {
                  console.error("Gagal menyimpan ke Firestore", e);
                  alert("Gagal menyimpan materi!");
                }
                setIsUploadingDB(false);
              }}
              disabled={!uploadTitle || isUploadingDB}
              className={`w-full py-4 rounded-2xl font-display text-base transition-all ${uploadTitle && !isUploadingDB ? 'bg-emerald-600 text-white shadow-lg active:scale-95' : 'bg-gray-200 text-gray-400'}`}>
              {isUploadingDB ? 'Menyimpan...' : 'Publikasikan ke Siswa  <Rocket className="w-5 h-5" /> '}
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  // ── 4. BUAT INTERAKTIF ─────────────────────────────────────────────────────
  if (screen === 'buatInteraktif') return (
    <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <div>
            <p className="text-violet-200 text-xs">Guru</p>
            <p className="text-white font-display text-xl">Buat Media Interaktif  <Sparkles className="w-5 h-5" /> </p>
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
                      <span className="flex items-center text-gray-400"> <MoveHorizontal className="w-5 h-5" /> </span>
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
                    <span> <Zap className="w-5 h-5" /> </span> AI Auto-Proses (TXT/Word)
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
                            <span className="text-4xl animate-bounce mb-3"> <Bot className="w-5 h-5" /> </span>
                            <p className="text-amber-800 font-bold text-sm">Sistem AI Sedang Memproses...</p>
                            <p className="text-amber-600 text-xs mt-1">Mengekstrak pertanyaan & pilihan ganda dari file</p>
                            <div className="w-full h-1.5 bg-amber-100 rounded-full mt-4 overflow-hidden">
                              <div className="h-full bg-amber-500 rounded-full w-1/2 animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <>
                            <span className="text-4xl mb-3 block opacity-80"> <FileText className="w-5 h-5" /> </span>
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
                          <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xl"> <CheckCircle className="w-5 h-5" /> </div>
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
                Publikasikan  <Rocket className="w-5 h-5" /> 
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
    const students = dbUsers.filter(u => u.id !== auth.currentUser?.uid);
    
    const getStudentProgress = (u: any, babId: number, hasInteraktif: boolean) => {
      const completed = u.completedModules?.[babId] || [];
      let count = 0;
      if (completed.includes('materi')) count++;
      if (completed.includes('interaktif')) count++;
      if (completed.includes('kuis')) count++;
      if (completed.includes('proyek')) count++;
      return Math.round((count / (hasInteraktif ? 4 : 3)) * 100);
    };

    let totalKuis = 0;
    const mappedStudents = students.map(s => {
      const babProgs = BAB_LIST.slice(0, 3).map(b => getStudentProgress(s, b.id, b.interaktif.length > 0));
      Object.values(s.completedModules || {}).forEach((arr: any) => {
        if (arr.includes('kuis')) totalKuis++;
      });
      const avg = Math.round(babProgs.reduce((a, v) => a + v, 0) / 3);
      return { id: s.id, name: s.displayName || `Siswa ${s.id.slice(0,4)}`, avatar: <BookOpen className="w-5 h-5" />, babProgs, avg, xp: s.xp || 0 };
    });

    const classRataRata = students.length > 0 ? Math.round(mappedStudents.reduce((a, s) => a + s.avg, 0) / students.length) : 0;
    
    const getBabClassProgress = (babId: number, hasInteraktif: boolean) => {
      if (students.length === 0) return 0;
      let sum = 0;
      students.forEach(s => { sum += getStudentProgress(s, babId, hasInteraktif); });
      return Math.round(sum / students.length);
    };

    let weakestBab = 'Belum ada data';
    let lowestP = 101;
    if (students.length > 0) {
      BAB_LIST.slice(0, 4).forEach(b => {
        const p = getBabClassProgress(b.id, b.interaktif.length > 0);
        if (p < lowestP) { lowestP = p; weakestBab = `Bab ${b.id} — ${b.topics[0]} (${p}% rata-rata)`; }
      });
    }

    return (
      <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <BackBtn onBack={goBack} light />
            <p className="text-white font-display text-xl">Progress Siswa  <BarChart2 className="w-5 h-5" /> </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Rata-rata', value: `${classRataRata}%`, icon: <TrendingUp className="w-5 h-5" /> },
              { label: 'Total Siswa', value: students.length, icon: <Users className="w-5 h-5" /> },
              { label: 'Kuis Selesai', value: totalKuis, icon: <CheckCircle className="w-5 h-5" /> },
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
              {BAB_LIST.slice(0, 4).map(b => {
                const p = getBabClassProgress(b.id, b.interaktif.length > 0);
                return (
                <div key={b.id} className="flex items-center gap-3">
                  <span className="text-lg w-7 text-center">{b.emoji}</span>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 text-xs font-semibold">Bab {b.id}</span>
                      <span className="text-gray-500 text-xs">{p}% kelas selesai</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-gradient-to-r ${b.gradient}`} style={{ width: `${p}%` }} />
                    </div>
                  </div>
                </div>
              )})}
            </div>
          </div>

          {/* Student list */}
          <div>
            <p className="font-display text-gray-700 mb-3">Daftar Siswa</p>
            <div className="space-y-2">
              {mappedStudents.length > 0 ? mappedStudents.map((s, i) => (
                <div key={i} className="bg-white rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-2xl">{s.avatar}</div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{s.name}</p>
                      <p className="text-gray-400 text-xs">Aktif · {s.xp} XP</p>
                    </div>
                    <div className="text-right">
                      <p className="text-emerald-600 font-black text-sm">{s.avg}%</p>
                      <p className="text-gray-400 text-xs">rata-rata</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {s.babProgs.map((v, j) => (
                      <div key={j} className="flex-1">
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden relative group">
                          <div className={`h-full rounded-full ${v > 0 ? 'bg-emerald-400' : 'bg-gray-200'}`} style={{ width: `${v}%` }} />
                        </div>
                        <p className="text-gray-400 text-[9px] text-center mt-0.5">B{j + 1}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="text-center p-4 text-gray-400 text-sm">Belum ada siswa terdaftar.</div>
              )}
            </div>
          </div>

          {/* Weak areas */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
            <p className="font-display text-amber-700 mb-2"> <AlertTriangle className="w-5 h-5" /> ️ Materi yang Perlu Perhatian</p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-amber-700 text-sm font-bold">{weakestBab}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-amber-700 text-sm">Beberapa siswa belum mengerjakan kuis.</span>
              </div>
            </div>
          </div>
          <div className="h-2" />
        </div>
        <TeacherBottomNav />
      </div>
    );
  }

  // ── 6. KELOLA BAB ──────────────────────────────────────────────────────────
  if (screen === 'kelolaBab') {
    const students = dbUsers.filter(u => u.id !== auth.currentUser?.uid);
    const getStudentProgress = (u: any, babId: number, hasInteraktif: boolean) => {
      const completed = u.completedModules?.[babId] || [];
      let count = 0;
      if (completed.includes('materi')) count++;
      if (completed.includes('interaktif')) count++;
      if (completed.includes('kuis')) count++;
      if (completed.includes('proyek')) count++;
      return Math.round((count / (hasInteraktif ? 4 : 3)) * 100);
    };

    const getBabClassProgress = (babId: number, hasInteraktif: boolean) => {
      if (students.length === 0) return 0;
      let sum = 0;
      students.forEach(s => { sum += getStudentProgress(s, babId, hasInteraktif); });
      return Math.round(sum / students.length);
    };

    const [localBabs, setLocalBabs] = useState([...BAB_LIST]);

    const moveUp = (idx: number) => {
      if (idx === 0) return;
      const newBabs = [...localBabs];
      const temp = newBabs[idx];
      newBabs[idx] = newBabs[idx-1];
      newBabs[idx-1] = temp;
      BAB_LIST.length = 0;
      BAB_LIST.push(...newBabs);
      setLocalBabs(newBabs);
    };

    const moveDown = (idx: number) => {
      if (idx === localBabs.length - 1) return;
      const newBabs = [...localBabs];
      const temp = newBabs[idx];
      newBabs[idx] = newBabs[idx+1];
      newBabs[idx+1] = temp;
      BAB_LIST.length = 0;
      BAB_LIST.push(...newBabs);
      setLocalBabs(newBabs);
    };

    const handleEdit = (idx: number) => {
      const newJudul = prompt("Ubah Judul Bab:", localBabs[idx].judul);
      if (newJudul && newJudul.trim() !== '') {
        const newBabs = [...localBabs];
        newBabs[idx].judul = newJudul;
        BAB_LIST.length = 0;
        BAB_LIST.push(...newBabs);
        setLocalBabs(newBabs);
      }
    };

    return (
    <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <p className="text-white font-display text-xl">Kelola Bab  <ClipboardList className="w-5 h-5" /> </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {localBabs.map((b, idx) => {
          const classProgress = getBabClassProgress(b.id, b.interaktif.length > 0);
          const materialsCount = dbMaterials.filter(m => m.chapter === `Bab ${b.id}`).length;
          
          return (
          <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm flex items-center gap-3 border border-gray-100">
            <div className="flex flex-col gap-1 text-gray-300">
              <button onClick={() => moveUp(idx)} disabled={idx === 0} className={`text-xl ${idx === 0 ? 'opacity-30' : 'hover:text-amber-500 active:scale-95'}`}>▲</button>
              <button onClick={() => moveDown(idx)} disabled={idx === localBabs.length - 1} className={`text-xl ${idx === localBabs.length - 1 ? 'opacity-30' : 'hover:text-amber-500 active:scale-95'}`}>▼</button>
            </div>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-xl flex-shrink-0`}>{b.emoji}</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-800 text-sm">Bab {b.id}</p>
              <p className="text-gray-400 text-xs truncate">{b.judul}</p>
              <p className="text-gray-400 text-[10px] mt-0.5">{materialsCount} Materi · {b.interaktif.length > 0 ? '1' : '0'} Interaktif</p>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${classProgress > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {classProgress > 0 ? `Progres ${classProgress}%` : 'Belum dimulai'}
              </span>
              <button onClick={() => handleEdit(idx)} className="text-xs text-sky-600 font-bold hover:text-sky-700 active:scale-95 bg-sky-50 px-2.5 py-1.5 rounded-lg mt-1">Edit Judul</button>
            </div>
          </div>
        )})}
        <div className="h-2" />
      </div>
      <TeacherBottomNav />
    </div>
    );
  }

  // ── 7. STUDENT HOME ────────────────────────────────────────────────────────
  if (screen === 'studentHome') return (
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-8 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"><GraduationCap className="w-6 h-6 text-white" /></div>
            <div>
              <p className="text-emerald-100 text-xs font-semibold">Halo,</p>
              <p className="text-white font-display text-xl">{auth.currentUser?.displayName || 'Siswa'}!  <Hand className="w-5 h-5" /> </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-white/20 rounded-xl px-2 py-1.5 flex items-center gap-1 backdrop-blur-sm">
              <span className="text-yellow-300 text-xs"> <Star className="w-5 h-5" /> </span>
              <span className="text-white font-bold text-xs">{userProfile.xp} XP</span>
            </div>
            <button onClick={() => { signOut(auth); setScreens(['roleSelect']); }} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm active:scale-95 transition-transform">Keluar</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Lanjutkan belajar */}
        <div>
          <p className="font-display text-gray-700 mb-2.5">Lanjutkan Belajar  <BookOpen className="w-5 h-5" /> </p>
          <button onClick={() => { setCurrentBabIdx(0); navigate('detailBab'); }}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-4 text-left shadow-lg shadow-emerald-200 active:scale-95 transition-transform">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center"><Leaf className="w-6 h-6" /></div>
              <div className="flex-1">
                <p className="text-emerald-100 text-xs font-semibold">Bab 1</p>
                <p className="text-white font-display text-base">Tumbuhan, Sumber Kehidupan</p>
              </div>
              <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center text-white text-sm"> <PlayCircle className="w-5 h-5" /> </div>
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
            <p className="font-display text-gray-700">Media Baru dari Bu Sari  <BadgePlus className="w-5 h-5" /> </p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            <button onClick={() => { setArenaPhase('intro'); navigate('arena'); }}
              className="relative rounded-2xl p-3 flex flex-col items-center text-center flex-shrink-0 w-28 overflow-hidden active:scale-95 transition-transform"
              style={{ background: 'radial-gradient(130% 130% at 0% 0%, #0f766e, #0a2540)', boxShadow: '0 6px 18px rgba(6,95,70,0.35)' }}>
              <div className="absolute inset-0 arena-grid opacity-50 pointer-events-none" />
              <div className="flex justify-center mb-2"><Zap className="w-7 h-7" /></div>
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
                  <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${getBabProgress(b.id, b.interaktif.length > 0)}%` }} />
                </div>
                <p className="text-gray-400 text-xs mt-1">{getBabProgress(b.id, b.interaktif.length > 0)}%</p>
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
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
        <p className="text-emerald-100 text-xs font-semibold mb-1">IPAS Kelas 3 · Kurikulum Merdeka</p>
        <p className="text-white font-display text-2xl">8 Bab Pembelajaran  <Leaf className="w-5 h-5" /> </p>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
        {BAB_LIST.map((b, i) => {
          const locked = i > 1;
          const actualProgress = getBabProgress(b.id, b.interaktif.length > 0);
          return (
            <button key={b.id} onClick={() => { if (!locked) { setCurrentBabIdx(i); navigate('detailBab'); } }}
              className={`w-full rounded-3xl overflow-hidden shadow-sm active:scale-95 transition-all ${locked ? 'opacity-50' : ''}`}>
              <div className={`bg-gradient-to-r ${b.gradient} p-4`}>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-sm">{locked ? <Lock className="w-5 h-5" /> : b.emoji}</div>
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
                    <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${actualProgress}%` }} />
                  </div>
                  <span className="text-gray-500 text-xs font-bold">{actualProgress}%</span>
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
  if (screen === 'detailBab') {
    const actualProgress = getBabProgress(bab.id, bab.interaktif.length > 0);
    const completed = userProfile.completedModules[bab.id] || [];
    const materiDone = completed.includes('materi');
    const interaktifDone = completed.includes('interaktif');
    const kuisDone = completed.includes('kuis');
    const proyekDone = completed.includes('proyek');

    return (
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden font-sans">
      <div className={`relative bg-gradient-to-r ${bab.gradient} px-5 pt-10 pb-4 shadow-md flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-colors active:scale-95 flex-shrink-0">
            <span className="font-bold text-lg">←</span>
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase mb-0.5">Bab {bab.id}</p>
            <h2 className="text-white font-display text-lg leading-tight truncate">{bab.judul}</h2>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl flex items-center justify-center shadow-sm flex-shrink-0">
            {bab.emoji}
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-black/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-1000" style={{ width: `${actualProgress}%` }} />
          </div>
          <span className="text-white font-bold text-xs">{actualProgress}%</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 relative">
        <div className="absolute left-9 top-8 bottom-12 w-0.5 bg-slate-200 z-0 rounded-full" />

        <div className="relative z-10 flex gap-4">
          <div className={`w-8 h-8 rounded-full ${materiDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-1 border-4 border-slate-50`}>
            {materiDone ? '✓' : '1'}
          </div>
          <div className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border ${materiDone ? 'border-emerald-200' : 'border-slate-100'} hover:shadow-md transition-all active:scale-95`}
               onClick={() => {
                 const m = dbMaterials.find(x => x.chapter === `Bab ${bab.id}`) || { title: bab.materi[0]?.title || 'Materi Belajar', content: 'Materi belum diunggah oleh guru.' };
                 setActiveMaterial(m);
                 navigate('bacaMateri');
               }}>
             <h3 className="font-bold text-slate-800 text-base mb-1">Pelajari Materi Bab</h3>
             <p className="text-slate-500 text-xs mb-3">Tujuan, ringkasan, dan konsep inti.</p>
             <button className={`${materiDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'} px-4 py-2.5 rounded-xl text-xs font-bold w-full text-left flex justify-between items-center`}>
               {materiDone ? 'Baca Ulang' : 'Mulai Membaca'} <span>→</span>
             </button>
          </div>
        </div>

        {bab.interaktif.length > 0 && (
          <div className="relative z-10 flex gap-4">
            <div className={`w-8 h-8 rounded-full ${interaktifDone ? 'bg-amber-400 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-1 border-4 border-slate-50`}>
              {interaktifDone ? '✓' : '2'}
            </div>
            <div className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border ${interaktifDone ? 'border-amber-200' : 'border-slate-100'} hover:shadow-md transition-all active:scale-95`}
                 onClick={() => {
                   const m = bab.interaktif[0];
                   if (m.screen === 'dragDrop') resetDrag();
                   if (m.screen === 'flipCards') setFlipped(new Set());
                   navigate(m.screen);
                 }}>
               <h3 className="font-bold text-slate-800 text-base mb-1">Misi Interaktif  <Sparkles className="w-5 h-5" /> </h3>
               <p className="text-slate-500 text-xs mb-3">{bab.interaktif[0].title}</p>
               <button className={`${interaktifDone ? 'bg-amber-50 text-amber-700' : 'bg-slate-50 text-slate-600'} px-4 py-2.5 rounded-xl text-xs font-bold w-full text-left flex justify-between items-center`}>
                 {interaktifDone ? 'Mainkan Ulang' : 'Mainkan Sekarang'} <span>→</span>
               </button>
            </div>
          </div>
        )}

        {/* Node 3: Latihan Soal */}
        <div className="relative z-10 flex gap-4">
          <div className={`w-8 h-8 rounded-full ${kuisDone ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-1 border-4 border-slate-50`}>
            {kuisDone ? '✓' : (bab.interaktif.length > 0 ? '3' : '2')}
          </div>
          <div className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border ${kuisDone ? 'border-sky-200' : 'border-slate-100'} hover:shadow-md transition-all active:scale-95`}
               onClick={() => { resetQuiz(); navigate('quiz'); }}>
             <h3 className="font-bold text-slate-800 text-base mb-1">Kerjakan Latihan Soal</h3>
             <p className="text-slate-500 text-xs mb-3">Soal Pilihan Ganda untuk menguji pemahamanmu.</p>
             <button className={`${kuisDone ? 'bg-sky-50 text-sky-700' : 'bg-slate-50 text-slate-600'} px-4 py-2.5 rounded-xl text-xs font-bold w-full text-left flex justify-between items-center`}>
               {kuisDone ? 'Coba Lagi' : 'Mulai Kuis'} <span> <FileEdit className="w-5 h-5" /> </span>
             </button>
          </div>
        </div>

        {/* Node 4: Skor & Pembahasan (Proyek) */}
        <div className="relative z-10 flex gap-4">
          <div className={`w-8 h-8 rounded-full ${proyekDone ? 'bg-orange-400 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-1 border-4 border-slate-50`}>
            {proyekDone ? '✓' : (bab.interaktif.length > 0 ? '4' : '3')}
          </div>
          <div className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border ${proyekDone ? 'border-orange-200' : 'border-slate-100'} hover:shadow-md transition-all active:scale-95`}
               onClick={() => { markCompleted(bab.id, 'proyek'); navigate('proyekP5'); }}>
             <h3 className="font-bold text-slate-800 text-base mb-1">Aksi Nyata (Proyek)</h3>
             <p className="text-slate-500 text-xs mb-3">Terapkan ilmumu di dunia nyata!</p>
             <button className={`${proyekDone ? 'bg-orange-50 text-orange-700' : 'bg-slate-50 text-slate-600'} px-4 py-2.5 rounded-xl text-xs font-bold w-full text-left flex justify-between items-center`}>
               {proyekDone ? 'Lihat Proyek Lagi' : 'Lihat Proyek'} <span> <Leaf className="w-5 h-5" /> </span>
             </button>
          </div>
        </div>

        <div className="h-6" />
      </div>
    </div>
    );
  }

  // ── 10. BACA MATERI (PDF Viewer) ───────────────────────────────────────────
  // --- SMART TEXT PARSER ---
  const renderSmartMateri = (content: string) => {
    const blocks = content.split('\\n\\n').filter(b => b.trim());
    return (
      <div className="space-y-5 mb-6">
        {blocks.map((block, idx) => {
          const lines = block.split('\\n').map(l => l.trim()).filter(Boolean);
          if (lines.length === 0) return null;
          const firstLine = lines[0].toLowerCase();

          if (firstLine.includes('tujuan') || firstLine.includes('kesimpulan') || firstLine.includes('penting') || firstLine.includes('ringkasan')) {
            return (
              <div key={idx} className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex gap-3 shadow-sm">
                <span className="text-emerald-500 text-lg flex-shrink-0"> <Pin className="w-5 h-5" /> </span>
                <div>
                  {lines.map((l, i) => (
                    <p key={i} className={`text-emerald-800 ${i === 0 ? 'font-bold mb-1 uppercase tracking-wide text-xs' : 'text-xs leading-relaxed'}`}>{l.replace(/^[-*]\\s*/, '')}</p>
                  ))}
                </div>
              </div>
            );
          }

          if (lines.length > 1 && lines.every(l => l.startsWith('-') || l.startsWith('*') || /^\\d+\\./.test(l))) {
            return (
              <div key={idx} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm space-y-2">
                {lines.map((l, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 font-bold">✓</span>
                    <p className="text-gray-600 text-sm leading-relaxed">{l.replace(/^[-*]\\s*/, '').replace(/^\\d+\\.\\s*/, '')}</p>
                  </div>
                ))}
              </div>
            );
          }

          if (lines.length === 1 && block.length < 60 && !['.', '?', '!'].includes(block.slice(-1))) {
            return (
              <h3 key={idx} className="font-bold text-gray-800 text-base mt-4 border-b border-gray-100 pb-2">
                {block}
              </h3>
            );
          }

          return (
            <div key={idx} className="text-gray-700 text-sm leading-relaxed bg-white/50 rounded-xl p-3 border border-gray-50 shadow-sm">
              {lines.map((l, i) => <p key={i} className="mb-2 last:mb-0">{l}</p>)}
            </div>
          );
        })}
      </div>
    );
  };

  if (screen === 'bacaMateri') return (
    <div className="h-full bg-gray-100 flex flex-col overflow-hidden">
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-b border-gray-200 flex-shrink-0 shadow-sm">
        <BackBtn onBack={goBack} />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm truncate">{activeMaterial?.title || 'Materi Belajar'}</p>
          <p className="text-gray-400 text-xs">Materi Guru · Dokumen Teks</p>
        </div>
        <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-lg"> <Bookmark className="w-5 h-5" /> </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm mx-auto">
          {/* Header */}
          <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-5 text-center`}>
            <span className="text-4xl block mb-2"> <Leaf className="w-5 h-5" /> </span>
            <p className="text-white font-display text-lg">{activeMaterial?.title || 'Tumbuhan, Sumber Kehidupan di Bumi'}</p>
            <p className="text-emerald-100 text-sm">{activeMaterial?.chapter ? `IPAS Kelas 3 · ${activeMaterial.chapter}` : 'IPAS Kelas 3 · Bab 1'}</p>
          </div>

          {activeMaterial?.content ? (
            activeMaterial.content.includes('<') && activeMaterial.content.includes('>') ? (
              <div 
                 className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 text-gray-700 text-sm leading-relaxed mb-6 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-2"
                 dangerouslySetInnerHTML={{ __html: activeMaterial.content }} 
              />
            ) : (
              renderSmartMateri(activeMaterial.content)
            )
          ) : (
            <>
              <p className="font-bold text-emerald-700 text-sm mb-1 uppercase tracking-wide"> <Pin className="w-5 h-5" />  Tujuan Pembelajaran</p>
              <ul className="text-gray-600 text-sm mb-4 space-y-1">
                {['Menyebutkan bagian-bagian tumbuhan', 'Menjelaskan fungsi setiap bagian', 'Mendeskripsikan proses fotosintesis'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{t}</li>
                ))}
              </ul>

              <div className="w-full h-px bg-gray-100 my-4" />

              <p className="font-bold text-gray-800 text-base mb-2">A. Bagian-bagian Tumbuhan</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">Tumbuhan memiliki beberapa bagian utama yang masing-masing memiliki fungsi berbeda-beda dalam menunjang kehidupan tumbuhan tersebut.</p>

              <div className="bg-emerald-50 rounded-xl p-4 mb-4 space-y-2">
                {[['• Akar', 'Menyerap air dan mineral dari tanah; menopang tubuh tumbuhan'], ['• Batang', 'Menopang tubuh tumbuhan; mengangkut air dan nutrisi ke daun'], ['• Daun', 'Tempat berlangsungnya fotosintesis; membantu proses transpirasi'], ['• Bunga', 'Alat perkembangbiakan tumbuhan; menarik serangga penyerbuk']].map(([part, func], i) => (
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
            </>
          )}

          <button onClick={() => { addXP(20); markCompleted(BAB_LIST[currentBabIdx].id, 'materi'); goBack(); }} className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all">
            Selesai Membaca & Lanjut →
          </button>
        </div>
        <div className="h-4" />
      </div>
    </div>
  );

  // ── 12. MEDIA HUB ──────────────────────────────────────────────────────────
  if (screen === 'mediaHub') return (
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
        <p className="text-emerald-100 text-xs font-semibold mb-1">Pusat Aktivitas</p>
        <p className="text-white font-display text-2xl">Media Interaktif  <Gamepad2 className="w-5 h-5" /> </p>
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
              style={{ background: 'linear-gradient(135deg, rgba(163,230,53,0.35), rgba(6,182,212,0.2))', border: '1px solid rgba(163,230,53,0.4)' }}> <Zap className="w-5 h-5" /> </div>
            <div className="flex-1">
              <span className="text-lime-300 text-[9px] font-black tracking-[0.25em] uppercase">Mode Kilat · Baru</span>
              <p className="font-display text-white text-xl leading-tight">Sains Sprint</p>
              <p className="text-cyan-100/70 text-xs">Adu cepat Benar/Salah · combo &amp; skor</p>
            </div>
            <PlayCircle className="w-6 h-6 text-lime-300" />
          </div>
        </button>

        {[
          { icon: '🧩', title: 'Cocokkan Bagian Tumbuhan', sub: 'Bab 1 · Drag & drop pasangan', color: 'from-green-500 to-emerald-600', action: () => { resetDrag(); navigate('dragDrop'); } },
          { icon: '🃏', title: 'Kartu Konsep Wujud Zat', sub: 'Bab 2 · Balik kartu & pelajari', color: 'from-blue-500 to-cyan-600', action: () => { setFlipped(new Set()); navigate('flipCards'); } },
          { icon: '🔭', title: 'Percobaan Virtual Magnet', sub: 'Bab 3 · Eksperimen step-by-step', color: 'from-violet-500 to-purple-600', action: () => { setExpStep(0); navigate('virtualEksperimen'); } },
          { icon: <Waves className="w-5 h-5" />, title: 'Simulasi Siklus Air', sub: 'Bab 1 · Animasi & penjelasan', color: 'from-sky-500 to-blue-600', action: () => { setSimStep(0); navigate('simulasiAir'); } },
          { icon: <FileEdit className="w-5 h-5" />, title: 'Kuis IPAS Campuran', sub: 'Bab 1–4 · 5 soal · +50 XP', color: 'from-amber-500 to-orange-500', action: () => { resetQuiz(); navigate('quiz'); } },
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
      <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-1">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-emerald-100 text-xs">Media Interaktif · Bab 1</p>
              <p className="text-white font-display text-lg">Cocokkan Bagian Tumbuhan  <Puzzle className="w-5 h-5" /> </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          <div className="flex items-center gap-3 bg-emerald-50 rounded-2xl p-3 mb-5">
            <Bird className="w-6 h-6" />
            <p className="text-emerald-700 text-sm font-medium">Ketuk bagian tumbuhan di kiri, lalu ketuk fungsinya di kanan!</p>
          </div>

          {allMatched ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="text-8xl mb-4 animate-pop block"> <PartyPopper className="w-5 h-5" /> </span>
              <p className="font-display text-gray-800 text-2xl mb-2">Sempurna!</p>
              <p className="text-gray-500 mb-6">Semua pasangan terjawab dengan benar!</p>
              <div className="flex gap-3 mb-6">
                <div className="bg-emerald-100 rounded-2xl px-5 py-3 text-center"><p className="text-emerald-700 font-black text-xl">+40</p><p className="text-emerald-500 text-xs">XP</p></div>
                <div className="bg-yellow-100 rounded-2xl px-5 py-3 text-center"><p className="text-yellow-600 font-black text-xl">+15</p><p className="text-yellow-500 text-xs"> <Coins className="w-5 h-5" /> </p></div>
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
    <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
      <div className="bg-gradient-to-br from-blue-500 to-cyan-600 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
        <div className="flex items-center gap-3">
          <BackBtn onBack={goBack} light />
          <div>
            <p className="text-blue-100 text-xs">Media Interaktif · Bab 2</p>
            <p className="text-white font-display text-lg">Kartu Konsep Wujud Zat  <GalleryVertical className="w-5 h-5" /> </p>
          </div>
        </div>
        <p className="text-blue-100 text-sm mt-2">{flipped.size}/{FLIP_CARDS.length} kartu dipelajari</p>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        <div className="flex items-center gap-3 bg-blue-50 rounded-2xl p-3 mb-4">
          <span className="text-xl"> <Pointer className="w-5 h-5" /> </span>
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
                    <div className="flex justify-center mb-2"><Circle className="w-7 h-7" /></div>
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
            <p className="text-4xl mb-2"> <PartyPopper className="w-5 h-5" /> </p>
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
      <div className="h-full bg-[#F5F3FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-violet-100 text-xs">Percobaan Virtual · Bab 3</p>
              <p className="text-white font-display text-lg">Sifat Magnet  <Telescope className="w-5 h-5" /> </p>
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
              <p className="font-bold text-violet-700 mb-2 text-sm"> <BarChart2 className="w-5 h-5" />  Kesimpulanku:</p>
              <textarea rows={3} placeholder="Tulis kesimpulanmu dari percobaan ini..."
                className="w-full px-3 py-2 rounded-xl bg-white border border-violet-200 text-gray-700 text-sm outline-none resize-none" />
            </div>
          )}
        </div>

        <div className="px-5 pb-8 pt-2 flex gap-3 flex-shrink-0">
          {expStep > 0 && (
            <button onClick={() => setExpStep(e => e - 1)} className="flex-1 py-4 rounded-2xl font-bold text-violet-600 bg-violet-100">← Kembali</button>
          )}
          <button onClick={() => expStep < EXP_STEPS.length - 1 ? setExpStep(e => e + 1) : (() => { addXP(30); markCompleted(BAB_LIST[currentBabIdx].id, 'interaktif'); goBack(); })()}
            className="flex-1 py-4 rounded-2xl font-display text-white bg-violet-600 shadow-lg active:scale-95 transition-transform">
            {expStep < EXP_STEPS.length - 1 ? 'Langkah Selanjutnya →' : 'Selesai!  <PartyPopper className="w-5 h-5" /> '}
          </button>
        </div>
      </div>
    );
  }

  // ── 16. SIMULASI SIKLUS AIR ────────────────────────────────────────────────
  if (screen === 'simulasiAir') {
    const step = SIM_STEPS[simStep];
    const icons = [<Sun className="w-5 h-5" />, <Cloud className="w-5 h-5" />, '• ️', '• ️'];
    const positions = [
      { top: '15%', left: '50%', transform: 'translateX(-50%)' },
      { top: '35%', left: '50%', transform: 'translateX(-50%)' },
      { top: '55%', left: '60%', transform: 'translateX(-50%)' },
      { top: '70%', left: '30%', transform: 'translateX(-50%)' },
    ];
    return (
      <div className="h-full bg-[#F0F9FF] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-sky-500 to-blue-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs">Simulasi Virtual · Bab 1</p>
              <p className="text-white font-display text-lg">Siklus Air  <Waves className="w-5 h-5" /> </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {/* Diagram */}
          <div className="bg-gradient-to-b from-sky-100 to-blue-50 rounded-3xl p-4 mb-4 relative" style={{ minHeight: 220 }}>
            {/* Ocean */}
            <div className="absolute bottom-0 left-0 right-0 h-14 bg-blue-400/30 rounded-b-3xl flex items-center justify-center">
              <Waves className="w-6 h-6" />
              <span className="text-blue-700 text-xs font-bold ml-1">Laut / Danau</span>
            </div>
            {/* Sun */}
            <div className="absolute top-4 right-4"><span className="text-4xl" style={{ animation: simStep === 0 ? 'float 2s ease-in-out infinite' : '' }}> <Sun className="w-5 h-5" /> ️</span></div>
            {/* Cloud */}
            <div className="absolute top-10 left-4"><span className="text-4xl" style={{ animation: simStep === 1 ? 'float 2s ease-in-out infinite' : '' }}> <Cloud className="w-5 h-5" /> ️</span></div>
            <div className="absolute top-8 left-16"><span className="text-3xl opacity-70" style={{ animation: simStep === 1 ? 'float 2.5s ease-in-out infinite' : '' }}> <CloudSun className="w-5 h-5" /> ️</span></div>
            {/* Rain */}
            {simStep >= 2 && <div className="absolute top-20 left-8 text-2xl" style={{ animation: 'float 1s ease-in-out infinite' }}> <CloudRain className="w-5 h-5" /> ️</div>}
            {/* Mountain/River */}
            <div className="absolute bottom-14 right-8 text-3xl"> <Mountain className="w-5 h-5" /> ️</div>
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
              <p className="font-bold text-sky-700 mb-2 text-sm"> <CheckCircle className="w-5 h-5" />  Siklus Lengkap!</p>
              <p className="text-sky-600 text-sm">Air di bumi berputar terus-menerus: laut → uap → awan → hujan → sungai → laut lagi. Itulah mengapa air di bumi tidak pernah habis!</p>
            </div>
          )}
        </div>

        <div className="px-5 pb-8 pt-2 flex gap-3 flex-shrink-0">
          <button onClick={() => setSimStep(s => Math.max(0, s - 1))} disabled={simStep === 0}
            className={`flex-1 py-4 rounded-2xl font-bold text-sm ${simStep > 0 ? 'bg-sky-100 text-sky-600' : 'bg-gray-100 text-gray-400'}`}>← Sebelumnya</button>
          <button onClick={() => simStep < SIM_STEPS.length - 1 ? setSimStep(s => s + 1) : goBack()}
            className="flex-1 py-4 rounded-2xl font-display text-white bg-sky-600 shadow-lg active:scale-95 transition-transform text-sm">
            {simStep < SIM_STEPS.length - 1 ? 'Selanjutnya →' : 'Selesai!  <PartyPopper className="w-5 h-5" /> '}
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
      <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-5 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-4">
            <BackBtn onBack={goBack} light />
            <div className="flex-1">
              <p className="text-emerald-100 text-xs mb-1.5">Kuis IPAS Kelas 3</p>
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
              <span className="text-yellow-300 text-sm"> <Star className="w-5 h-5" /> </span>
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
                <span className="text-2xl">{isCorrect ? <PartyPopper className="w-5 h-5" /> : <Lightbulb className="w-5 h-5" />}</span>
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
      <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-6 pt-12 pb-14 rounded-b-[3rem] text-center flex-shrink-0">
          <p className="text-emerald-100 font-semibold mb-3">Kuis Selesai!</p>
          <div className="flex justify-center gap-1 mb-4">
            {[0, 1, 2].map(i => <span key={i} className={`text-5xl ${i < stars ? 'text-yellow-400 animate-pop' : 'text-white/20'}`} style={{ animationDelay: `${i * 0.15}s` }}> <Star className="w-5 h-5" /> </span>)}
          </div>
          <p className="text-7xl font-display text-white mb-1">{score}%</p>
          <p className="text-emerald-100">{quizCorrect} dari {QUIZ_IPAS.length} jawaban benar</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 -mt-8 space-y-3">
          <div className="bg-white rounded-3xl p-5 shadow-xl">
            <p className="font-display text-gray-700 mb-4">Reward Kamu!  <Gift className="w-5 h-5" /> </p>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-2xl p-3 text-center">
                <p className="text-2xl mb-1"> <Star className="w-5 h-5" /> </p>
                <p className="text-emerald-700 font-black text-lg">+{xp}</p>
                <p className="text-emerald-400 text-xs">XP</p>
              </div>
              <div className="bg-yellow-50 rounded-2xl p-3 text-center">
                <p className="text-2xl mb-1"> <Coins className="w-5 h-5" /> </p>
                <p className="text-yellow-600 font-black text-lg">+{quizCorrect * 5}</p>
                <p className="text-yellow-400 text-xs">Koin</p>
              </div>
              <div className={`${stars === 3 ? 'bg-orange-50' : 'bg-gray-50'} rounded-2xl p-3 text-center`}>
                <p className="text-2xl mb-1">{stars === 3 ? <Trophy className="w-5 h-5" /> : <Lock className="w-5 h-5" />}</p>
                <p className={`font-black text-xs ${stars === 3 ? 'text-orange-600' : 'text-gray-400'}`}>{stars === 3 ? 'Badge!' : 'Score 80%'}</p>
                <p className={`text-xs ${stars === 3 ? 'text-orange-400' : 'text-gray-300'}`}>{stars === 3 ? 'Ilmuwan Cilik' : 'Untuk badge'}</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 rounded-2xl p-4 flex items-start gap-3">
            <Bird className="w-6 h-6" />
            <p className="text-emerald-700 text-sm font-medium">
              {score >= 80 ? 'Luar biasa! Kamu sudah memahami materi IPAS dengan sangat baik!  <Star className="w-5 h-5" /> ' : score >= 60 ? 'Bagus! Kamu hampir hafal semuanya. Yuk review materi yang belum tepat!  <BookOpen className="w-5 h-5" /> ' : 'Jangan menyerah! Coba baca lagi materinya, kamu pasti bisa!  <Dumbbell className="w-5 h-5" /> '}
            </p>
          </div>

          <button onClick={() => { resetQuiz(); navigate('quiz'); }} className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg active:scale-95 transition-transform">
            Coba Lagi  <RefreshCw className="w-5 h-5" /> 
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
      { phase: 1, label: 'Perencanaan', icon: <ClipboardList className="w-5 h-5" />, color: 'bg-amber-500', done: true },
      { phase: 2, label: 'Riset & Observasi', icon: <Search className="w-5 h-5" />, color: 'bg-blue-500', done: true },
      { phase: 3, label: 'Kreasi & Karya', icon: <Palette className="w-5 h-5" />, color: 'bg-violet-500', done: p5Phase >= 3 },
      { phase: 4, label: 'Presentasi', icon: '• ️', color: 'bg-emerald-500', done: false },
    ];
    const tasks = [
      { task: 'Amati lingkungan sekitar sekolah', done: true },
      { task: 'Catat jenis tanaman di sekolah (min. 5)', done: true },
      { task: 'Foto bagian-bagian tanaman yang ditemukan', done: p5Phase >= 3 },
      { task: 'Buat poster/mind map tentang tumbuhan', done: false },
      { task: 'Presentasikan hasil kepada teman sekelas', done: false },
    ];
    return (
      <div className="h-full bg-[#FFFBEB] flex flex-col overflow-hidden">
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-amber-100 text-xs">Proyek Penguatan Profil Pelajar Pancasila</p>
              <p className="text-white font-display text-lg">Menjaga Lingkungan  <Leaf className="w-5 h-5" /> </p>
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
                  <span className="text-xl block mb-1">{ph.done ? ph.icon : <Lock className="w-5 h-5" />}</span>
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
      <div className={`h-full relative flex flex-col overflow-hidden ${arenaShake ? 'animate-shake' : ''}`} style={{ background: ARENA_BG }}>
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
                 <Zap className="w-5 h-5" /> 
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
                { i: '• ️', t: 'Cepat = Poin Besar', d: 'Sisa waktu jadi Speed Bonus' },
                { i: <Link className="w-5 h-5" />, t: 'Jaga Combo', d: 'Jawaban benar beruntun melipatkan skor' },
                { i: '• ️', t: '3 Nyawa', d: 'Salah atau kehabisan waktu = nyawa berkurang' },
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
            Mulai Sprint!  <Zap className="w-5 h-5" /> 
          </button>
        </div>
      </>
    );

    // ---- OVER ----
    if (arenaPhase === 'over') {
      const total = ARENA_STATEMENTS.length;
      const acc = Math.round((arenaHits / total) * 100);
      const rank = arenaScore >= 3000 ? { t: 'Ilmuwan Kilat', e: <Trophy className="w-5 h-5" />, c: '#fde047' }
        : arenaScore >= 1500 ? { t: 'Peneliti Cepat', e: <Medal className="w-5 h-5" />, c: '#67e8f9' }
        : { t: 'Penjelajah Muda', e: <Leaf className="w-5 h-5" />, c: '#86efac' };
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
                { l: 'Akurasi', v: `${acc}%`, e: <Target className="w-5 h-5" /> },
                { l: 'Jawaban Benar', v: `${arenaHits}/${total}`, e: <CheckCircle className="w-5 h-5" /> },
                { l: 'Combo Terbaik', v: `${arenaBest}×`, e: <Sparkles className="w-5 h-5" /> },
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
                Main Lagi  <RefreshCw className="w-5 h-5" /> 
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
                  <span key={i} className={`text-lg transition-all ${i < arenaLives ? '' : 'grayscale opacity-30'}`}> <Heart className="w-5 h-5" /> ️</span>
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
                  {arenaLocked.correct ? `Tepat! +${arenaLocked.gained}` : 'Aduh, salah!  <Zap className="w-5 h-5" /> '}
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
