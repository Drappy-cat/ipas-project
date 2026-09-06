import { Check, Zap, Leaf, Puzzle, GalleryVertical, School, FileText, Microscope, Telescope, ClipboardList, BarChart2, PartyPopper, User, Lightbulb, Gamepad2, Sparkles, GraduationCap, Waves, TestTube, Star, Bug, Sun, Upload, Rocket, CheckCircle, ShoppingCart, FileEdit, Eye, AlertTriangle, RefreshCw, Search, Lock, Handshake, Map, Box, Smile, Target, Wind, Film, Image, Library, MessageCircle, Home, TrendingUp, Settings, Battery, Globe, Copyright, Hand, Users, BookOpen, HelpCircle, ChevronRight, PlayCircle, Pin, Bird, Coins, Cloud, CloudRain, Trophy, Heart, Hourglass, Ear, Wrench, Scissors, Flame, Egg, TreePine, Plug, Magnet, Cat, Sunrise, Store, Droplet, ToyBrick, DollarSign, Brain, Mail, Key, Folder, Hash, PenTool, Paperclip, Bell, MoveHorizontal, Bot, BadgePlus, Bookmark, Flower, Pointer, Circle, Mountain, CloudSun, Gift, Dumbbell, Palette, Timer, Link, Medal, Gem, Trash2, Plus } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from './firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, onAuthStateChanged, signOut, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { collection, addDoc, getDocs, query, where, serverTimestamp, doc, setDoc, getDoc, deleteDoc, deleteField, onSnapshot } from 'firebase/firestore';
// ─── Types ─────────────────────────────────────────────────────────────────
type Screen =
  | 'homepage' | 'splash' | 'onboarding'
  | 'roleSelect' | 'loginGuru' | 'loginSiswa' | 'forgotPassword'
  | 'teacherDash' | 'uploadMateri' | 'buatInteraktif' | 'progressSiswa' | 'kelolaBab' | 'pengaturanGuru'
  | 'studentHome' | 'daftarBab' | 'subBab' | 'detailBab' | 'studentPengaturan'
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

// ─── Initial Mock Materials for Teachers & Students ────────────────────────
const INITIAL_MATERIALS = [
  {
    id: 'mat-default-1',
    chapter: 'Bab 1',
    subChapter: 'Topik A: Misteri Tubuhku',
    subChapterIdx: 0,
    title: 'Materi Bab 1 Sub-bab 1 — Misteri Tubuhku',
    desc: 'Materi pembelajaran untuk Topik A mengenai Misteri Tubuhku.',
    content: `<div class="p-5 bg-amber-50 rounded-2xl mb-4 border border-amber-200">
      <h3 class="font-bold text-amber-900 text-base mb-2">✨ Topik A: Misteri Tubuhku</h3>
      <p class="text-amber-800 text-sm mb-3">Pancaindra adalah lima bagian tubuh yang membantu kita mengenali dunia di sekitar, yaitu mata, telinga, hidung, lidah, dan kulit. Setiap indra menangkap rangsangan dari luar (cahaya, suara, bau, rasa, atau sentuhan), lalu mengirimkan pesan ke otak. Otak kemudian memberi tahu kita apa yang sedang terjadi.</p>
      <p class="text-amber-800 text-sm mb-3">Pancaindra dan Fungsinya</p>
      <p class="text-amber-800 text-sm mb-3">Indra</p>
      <p class="text-amber-800 text-sm mb-3">Letak</p>
      <p class="text-amber-800 text-sm mb-3">Fungsi Utama</p>
      <p class="text-amber-800 text-sm mb-3">Mata</p>
      <p class="text-amber-800 text-sm mb-3">Depan kepala, sepasang</p>
      <p class="text-amber-800 text-sm mb-3">Melihat warna, bentuk, dan gerakan benda</p>
      <p class="text-amber-800 text-sm mb-3">Telinga</p>
      <p class="text-amber-800 text-sm mb-3">Samping kanan-kiri kepala, sepasang</p>
      <p class="text-amber-800 text-sm mb-3">Mendengar suara di sekitar</p>
      <p class="text-amber-800 text-sm mb-3">Hidung</p>
      <p class="text-amber-800 text-sm mb-3">Tengah wajah, dua lubang</p>
      <p class="text-amber-800 text-sm mb-3">Mencium bau harum maupun tidak harum</p>
      <p class="text-amber-800 text-sm mb-3">Lidah</p>
      <p class="text-amber-800 text-sm mb-3">Di dalam mulut</p>
      <p class="text-amber-800 text-sm mb-3">Mengecap rasa manis, asin, asam, pahit, umami</p>
      <p class="text-amber-800 text-sm mb-3">Kulit</p>
      <p class="text-amber-800 text-sm mb-3">Menutupi seluruh tubuh</p>
      <p class="text-amber-800 text-sm mb-3">Merasakan panas, dingin, halus, kasar, dan sakit</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 10 }
  },
  {
    id: 'mat-default-1-sub2',
    chapter: 'Bab 1',
    subChapter: 'Topik B: Tubuhku Unik, Tubuhku Berharga',
    subChapterIdx: 1,
    title: 'Materi Bab 1 Sub-bab 2 — Tubuhku Unik, Tubuhku Berharga',
    desc: 'Materi pembelajaran untuk Topik B mengenai Tubuhku Unik, Tubuhku Berharga.',
    content: `<div class="p-5 bg-amber-50 rounded-2xl mb-4 border border-amber-200">
      <h3 class="font-bold text-amber-900 text-base mb-2">✨ Topik B: Tubuhku Unik, Tubuhku Berharga</h3>
      <p class="text-amber-800 text-sm mb-3">Setiap indra memiliki bentuk khas yang mendukung fungsinya. Mata berbentuk bulat dan bening di depan sehingga dapat melihat ke banyak arah serta memfokuskan cahaya ke retina. Telinga berbentuk lebar dan berlekuk-lekuk untuk menangkap dan membedakan arah datangnya suara. Hidung memiliki dua lubang menghadap ke bawah agar udara keluar-masuk lancar dan air/debu tidak mudah masuk. Lidah kasar dan penuh tonjolan kecil (papila) untuk mengecap rasa dan menahan makanan agar tidak licin. Kulit luas dan sensitif menutupi seluruh tubuh agar dapat merasakan sentuhan di mana saja.</p>
      <p class="text-amber-800 text-sm mb-3">Setiap indra juga memiliki pelindung tambahan: mata dilindungi kelopak dan bulu mata; telinga dilindungi rambut halus dan serumen (kotoran telinga); hidung dilindungi rambut hidung dan lendir; lidah dilindungi air liur (saliva); kulit dilindungi rambut halus.</p>
      <p class="text-amber-800 text-sm mb-3">Untuk menjaga kesehatan pancaindra: membaca di tempat terang dan mengistirahatkan mata dari layar; menghindari suara terlalu keras dan membersihkan telinga dengan lembut; menghindari asap/bau menyengat serta rajin mencuci hidung saat pilek; menghindari makanan terlalu panas dan rajin menyikat lidah; serta menghindari benda panas dan rajin membersihkan kulit.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 9 }
  },
  {
    id: 'mat-default-2',
    chapter: 'Bab 2',
    subChapter: 'Topik A: Cerita dari Masa Lalu',
    subChapterIdx: 0,
    title: 'Materi Bab 2 Sub-bab 1 — Cerita dari Masa Lalu',
    desc: 'Materi pembelajaran untuk Topik A mengenai Cerita dari Masa Lalu.',
    content: `<div class="p-5 bg-emerald-50 rounded-2xl mb-4 border border-emerald-200">
      <h3 class="font-bold text-emerald-900 text-base mb-2">✨ Topik A: Cerita dari Masa Lalu</h3>
      <p class="text-emerald-800 text-sm mb-3">Setiap keluarga memiliki cerita asal-usul, suku, bahasa, dan tradisi masing-masing yang diwariskan dari kakek, nenek, dan leluhur. Menelusuri sejarah keluarga dapat dilakukan dengan mewawancarai anggota keluarga, mengamati foto lama, dan mencatat tradisi yang masih dijaga.</p>
      <p class="text-emerald-800 text-sm mb-3">Nama suatu daerah sering memiliki cerita asal-usul, misalnya berasal dari nama tumbuhan, hewan, tokoh, atau peristiwa tertentu. Contohnya nama Bandung yang berasal dari kata 'bandungan' (bendungan), dan nama Gandaria di Jakarta yang berasal dari banyaknya pohon gandaria di daerah tersebut pada masa lalu.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 8 }
  },
  {
    id: 'mat-default-2-sub2',
    chapter: 'Bab 2',
    subChapter: 'Topik B: Cerita dari Masa ke Masa',
    subChapterIdx: 1,
    title: 'Materi Bab 2 Sub-bab 2 — Cerita dari Masa ke Masa',
    desc: 'Materi pembelajaran untuk Topik B mengenai Cerita dari Masa ke Masa.',
    content: `<div class="p-5 bg-emerald-50 rounded-2xl mb-4 border border-emerald-200">
      <h3 class="font-bold text-emerald-900 text-base mb-2">✨ Topik B: Cerita dari Masa ke Masa</h3>
      <p class="text-emerald-800 text-sm mb-3">Perubahan sosial budaya adalah perubahan kebiasaan hidup masyarakat yang terjadi seiring berjalannya waktu, misalnya pada alat transportasi (dari kereta tenaga hewan menjadi mobil/motor), pakaian, rumah, alat komunikasi (dari surat menjadi telepon pintar), dan permainan anak (dari permainan tradisional menjadi permainan daring).</p>
      <p class="text-emerald-800 text-sm mb-3">Salah satu penyebab utama perubahan sosial adalah perkembangan Ilmu Pengetahuan dan Teknologi (IPTEK). Perubahan sosial dapat berdampak positif, misalnya memudahkan dan mempercepat pekerjaan, namun beberapa masyarakat tetap mempertahankan kebiasaan lama karena memiliki nilai atau manfaat tertentu, misalnya nelayan yang tetap menggunakan jala agar ekosistem laut terjaga.</p>
      <p class="text-emerald-800 text-sm mb-3">Situs budaya (misalnya monumen atau museum bersejarah) adalah tempat yang menyimpan jejak sejarah dan perlu dijaga kelestariannya oleh masyarakat.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 7 }
  },
  {
    id: 'mat-default-3',
    chapter: 'Bab 3',
    subChapter: 'Topik A: Perjalananku',
    subChapterIdx: 0,
    title: 'Materi Bab 3 Sub-bab 1 — Perjalananku',
    desc: 'Materi pembelajaran untuk Topik A mengenai Perjalananku.',
    content: `<div class="p-5 bg-lime-50 rounded-2xl mb-4 border border-lime-200">
      <h3 class="font-bold text-lime-900 text-base mb-2">✨ Topik A: Perjalananku</h3>
      <p class="text-lime-800 text-sm mb-3">Manusia mengalami siklus hidup melalui beberapa fase, yaitu: bayi (0–2 tahun) dengan ciri tubuh kecil dan kulit lembut; kanak-kanak (2–12 tahun) dengan ciri gigi susu tumbuh lalu mulai tanggal, mulai belajar berbicara dan berjalan; remaja (13–17 tahun) dengan ciri otot dan tulang menguat serta mengalami pubertas, dewasa muda (19–40 tahun) dengan kekuatan fisik optimal dan masa produktif, dewasa (41–65 tahun) dengan ciri rambut mulai memutih dan kulit mulai keriput, serta lanjut usia (65 tahun ke atas) dengan ciri kekuatan fisik dan tulang melemah.</p>
      <p class="text-lime-800 text-sm mb-3">Setiap fase memiliki ciri fisik dan aktivitas yang berbeda-beda sesuai kebutuhan dan kemampuan usianya.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 6 }
  },
  {
    id: 'mat-default-3-sub2',
    chapter: 'Bab 3',
    subChapter: 'Topik B: Aku Peduli, Aku Pahlawan',
    subChapterIdx: 1,
    title: 'Materi Bab 3 Sub-bab 2 — Aku Peduli, Aku Pahlawan',
    desc: 'Materi pembelajaran untuk Topik B mengenai Aku Peduli, Aku Pahlawan.',
    content: `<div class="p-5 bg-lime-50 rounded-2xl mb-4 border border-lime-200">
      <h3 class="font-bold text-lime-900 text-base mb-2">✨ Topik B: Aku Peduli, Aku Pahlawan</h3>
      <p class="text-lime-800 text-sm mb-3">Setiap anggota keluarga memiliki peran dan tanggung jawab masing-masing di rumah, misalnya ayah memperbaiki keran air, ibu memasak, kakak mencuci piring, dan adik merapikan mainan. Berbagi peran membuat rumah menjadi tempat yang nyaman dan menciptakan kerukunan keluarga.</p>
      <p class="text-lime-800 text-sm mb-3">Norma adalah aturan baik yang harus kita lakukan agar terciptanya lingkungan yang harmonis, sedangkan nilai adalah kebaikan yang ada dalam diri kita, seperti tanggung jawab dan kepedulian. Semakin bertambah usia seseorang, semakin besar pula peran dan tanggung jawabnya di dalam keluarga.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 5 }
  },
  {
    id: 'mat-default-4',
    chapter: 'Bab 4',
    subChapter: 'Topik A: Rahasia Kehidupan Hewan',
    subChapterIdx: 0,
    title: 'Materi Bab 4 Sub-bab 1 — Rahasia Kehidupan Hewan',
    desc: 'Materi pembelajaran untuk Topik A mengenai Rahasia Kehidupan Hewan.',
    content: `<div class="p-5 bg-yellow-50 rounded-2xl mb-4 border border-yellow-200">
      <h3 class="font-bold text-yellow-900 text-base mb-2">✨ Topik A: Rahasia Kehidupan Hewan</h3>
      <p class="text-yellow-800 text-sm mb-3">Siklus hidup adalah tahapan pertumbuhan makhluk hidup dari lahir hingga dewasa, digambarkan seperti lingkaran karena terjadi berulang. Beberapa hewan (sapi, ayam, kucing) lahir/menetas dengan bentuk sudah mirip induknya, hanya lebih kecil. Hewan lain (serangga, katak, salamander) mengalami perubahan bentuk yang besar sebelum dewasa, yang disebut metamorfosis.</p>
      <p class="text-yellow-800 text-sm mb-3">Metamorfosis sempurna: bentuk tubuh, penampilan, dan cara hidup berubah banyak, melalui tahap pupa/kepompong. Contoh: kupu-kupu (telur – larva/ulat – pupa – kupu-kupu dewasa) dan katak (telur – berudu – berudu berkaki – katak muda – katak dewasa).</p>
      <p class="text-yellow-800 text-sm mb-3">Metamorfosis tidak sempurna: bentuk tubuh berubah tetapi penampilan dan cara hidup hampir sama, tidak ada tahap pupa. Contoh: kecoak dan jangkrik (telur – nimfa – dewasa).</p>
      <p class="text-yellow-800 text-sm mb-3">Upaya pelestarian hewan dapat dilakukan dengan menjaga habitatnya, tidak memburu secara sembarangan, dan menyediakan sumber makanan, misalnya menanam bunga untuk kupu-kupu.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 4 }
  },
  {
    id: 'mat-default-4-sub2',
    chapter: 'Bab 4',
    subChapter: 'Topik B: Rahasia Tumbuhan Tumbuh',
    subChapterIdx: 1,
    title: 'Materi Bab 4 Sub-bab 2 — Rahasia Tumbuhan Tumbuh',
    desc: 'Materi pembelajaran untuk Topik B mengenai Rahasia Tumbuhan Tumbuh.',
    content: `<div class="p-5 bg-yellow-50 rounded-2xl mb-4 border border-yellow-200">
      <h3 class="font-bold text-yellow-900 text-base mb-2">✨ Topik B: Rahasia Tumbuhan Tumbuh</h3>
      <p class="text-yellow-800 text-sm mb-3">Tumbuhan juga memiliki siklus hidup, dimulai dari biji, tumbuh menjadi kecambah, tunas muda, tanaman dewasa, berbunga, berbuah, hingga menghasilkan biji baru. Contoh: siklus hidup tomat dan pepaya (biji – kecambah – tunas – tumbuhan dewasa – bunga – buah – biji).</p>
      <p class="text-yellow-800 text-sm mb-3">Pertumbuhan tumbuhan dipengaruhi oleh cuaca. Cuaca cerah dan hujan teratur membantu tumbuhan tumbuh subur (fotosintesis dan penyerapan air). Sebaliknya, cuaca terlalu panas/kering, hujan terlalu deras, atau angin kencang dapat merusak tumbuhan. Manusia mengatasinya dengan menyiram tanaman, menanam di rumah kaca, menggunakan irigasi, dan memilih waktu tanam yang tepat.</p>
      <p class="text-yellow-800 text-sm mb-3">Upaya pelestarian tumbuhan dilakukan dengan menanam kembali, tidak menebang sembarangan, dan merawat tanaman dari hama.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 3 }
  },
  {
    id: 'mat-default-5',
    chapter: 'Bab 5',
    subChapter: 'Topik A: Ayo, Berkenalan dengan Uang!',
    subChapterIdx: 0,
    title: 'Materi Bab 5 Sub-bab 1 — Ayo, Berkenalan dengan Uang!',
    desc: 'Materi pembelajaran untuk Topik A mengenai Ayo, Berkenalan dengan Uang!.',
    content: `<div class="p-5 bg-cyan-50 rounded-2xl mb-4 border border-cyan-200">
      <h3 class="font-bold text-cyan-900 text-base mb-2">✨ Topik A: Ayo, Berkenalan dengan Uang!</h3>
      <p class="text-cyan-800 text-sm mb-3">Sebelum ada uang, manusia memenuhi kebutuhan dengan cara barter, yaitu saling menukar barang atau jasa (misalnya beras ditukar ikan). Barter memiliki banyak kesulitan: sulit menentukan nilai barang, harus sama-sama membutuhkan, sulit dibagi, berat dibawa, dan cepat rusak.</p>
      <p class="text-cyan-800 text-sm mb-3">Karena kesulitan itu, manusia mulai menggunakan barang berharga (garam, kulit kerang), lalu logam mulia (emas, perak) sebagai uang logam pertama kali oleh bangsa Lydia sekitar tahun 580 SM. Uang kertas kemudian muncul di Tiongkok pada masa Dinasti Song sekitar abad ke-10 Masehi karena uang logam terlalu berat.</p>
      <p class="text-cyan-800 text-sm mb-3">Fungsi utama uang adalah sebagai alat tukar yang memudahkan dan mengadilkan kegiatan jual beli. Uang asli dapat dikenali dengan cara 3D: Dilihat, Diraba, dan Diterawang.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 2 }
  },
  {
    id: 'mat-default-5-sub2',
    chapter: 'Bab 5',
    subChapter: 'Topik B: Hidup Hemat, Hidup Bijak',
    subChapterIdx: 1,
    title: 'Materi Bab 5 Sub-bab 2 — Hidup Hemat, Hidup Bijak',
    desc: 'Materi pembelajaran untuk Topik B mengenai Hidup Hemat, Hidup Bijak.',
    content: `<div class="p-5 bg-cyan-50 rounded-2xl mb-4 border border-cyan-200">
      <h3 class="font-bold text-cyan-900 text-base mb-2">✨ Topik B: Hidup Hemat, Hidup Bijak</h3>
      <p class="text-cyan-800 text-sm mb-3">Berdasarkan tingkat kepentingannya, kebutuhan manusia dibedakan menjadi tiga: kebutuhan primer (pokok/wajib) seperti pangan, sandang, papan; kebutuhan sekunder (pelengkap) seperti sepatu atau gawai; dan kebutuhan tersier (mewah) seperti kendaraan atau jam tangan mewah.</p>
      <p class="text-cyan-800 text-sm mb-3">Kebutuhan adalah hal yang wajib dipenuhi agar dapat hidup dan belajar dengan baik, sedangkan keinginan adalah hal yang menyenangkan jika dimiliki tetapi bukan hal yang wajib ada.</p>
      <p class="text-cyan-800 text-sm mb-3">Nilai guna barang terdiri atas empat jenis: nilai guna tempat (barang lebih bermanfaat di tempat yang tepat, misalnya jaket di pegunungan), nilai guna bentuk (barang lebih bermanfaat setelah diubah bentuknya, misalnya kayu menjadi kursi), nilai guna waktu (barang lebih bermanfaat pada waktu tertentu, misalnya jas hujan saat musim hujan), dan nilai guna dasar (manfaat yang melekat pada bahan mentahnya, misalnya minyak bumi sebagai bahan bakar).</p>
      <p class="text-cyan-800 text-sm mb-3">Untuk hidup hemat dan bijak, kita perlu membuat skala prioritas, yaitu memilih dan mendahulukan barang yang lebih penting (mendesak dan dibutuhkan) sebelum membeli barang yang hanya diinginkan.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 1 }
  },
  {
    id: 'mat-default-6',
    chapter: 'Bab 6',
    subChapter: 'Topik A: Energi di Sekitar Kita',
    subChapterIdx: 0,
    title: 'Materi Bab 6 Sub-bab 1 — Energi di Sekitar Kita',
    desc: 'Materi pembelajaran untuk Topik A mengenai Energi di Sekitar Kita.',
    content: `<div class="p-5 bg-purple-50 rounded-2xl mb-4 border border-purple-200">
      <h3 class="font-bold text-purple-900 text-base mb-2">✨ Topik A: Energi di Sekitar Kita</h3>
      <p class="text-purple-800 text-sm mb-3">Energi adalah kekuatan yang membuat benda dapat bergerak, berbunyi, menyala, atau berubah. Terdapat enam bentuk energi utama.</p>
      <p class="text-purple-800 text-sm mb-3">Enam Bentuk Energi</p>
      <p class="text-purple-800 text-sm mb-3">Bentuk Energi</p>
      <p class="text-purple-800 text-sm mb-3">Ciri-Ciri</p>
      <p class="text-purple-800 text-sm mb-3">Contoh</p>
      <p class="text-purple-800 text-sm mb-3">Energi gerak (kinetik)</p>
      <p class="text-purple-800 text-sm mb-3">Ada saat benda bergerak/berpindah tempat; makin cepat gerak, makin besar energinya</p>
      <p class="text-purple-800 text-sm mb-3">Bola menggelinding, kipas angin</p>
      <p class="text-purple-800 text-sm mb-3">Energi cahaya</p>
      <p class="text-purple-800 text-sm mb-3">Dipancarkan oleh sumber cahaya, membuat kita bisa melihat</p>
      <p class="text-purple-800 text-sm mb-3">Matahari, senter</p>
      <p class="text-purple-800 text-sm mb-3">Energi panas</p>
      <p class="text-purple-800 text-sm mb-3">Membuat suhu benda naik, dapat dirasakan kulit</p>
      <p class="text-purple-800 text-sm mb-3">Api unggun, penanak nasi</p>
      <p class="text-purple-800 text-sm mb-3">Energi bunyi</p>
      <p class="text-purple-800 text-sm mb-3">Dihasilkan saat benda bergetar, merambat lewat udara</p>
      <p class="text-purple-800 text-sm mb-3">Drum, suara orang berbicara</p>
      <p class="text-purple-800 text-sm mb-3">Energi listrik</p>
      <p class="text-purple-800 text-sm mb-3">Mengalir lewat kabel untuk menyalakan alat/mesin</p>
      <p class="text-purple-800 text-sm mb-3">Lampu, televisi</p>
      <p class="text-purple-800 text-sm mb-3">Energi kimia</p>
      <p class="text-purple-800 text-sm mb-3">Tersimpan dalam makanan, baterai, atau bahan bakar</p>
      <p class="text-purple-800 text-sm mb-3">Nasi, baterai</p>
      <p class="text-purple-800 text-sm mb-3">Selain enam bentuk di atas, ada juga energi elastis (pada benda yang diregangkan/ditekan, misalnya karet ketapel), energi gravitasi (dimiliki benda di tempat tinggi, misalnya air bendungan), dan energi nuklir (tersimpan dalam inti atom, misalnya pada Matahari dan PLTN).</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * 0 }
  },
  {
    id: 'mat-default-6-sub2',
    chapter: 'Bab 6',
    subChapter: 'Topik B: Dari Mana Energi Datang?',
    subChapterIdx: 1,
    title: 'Materi Bab 6 Sub-bab 2 — Dari Mana Energi Datang?',
    desc: 'Materi pembelajaran untuk Topik B mengenai Dari Mana Energi Datang?.',
    content: `<div class="p-5 bg-purple-50 rounded-2xl mb-4 border border-purple-200">
      <h3 class="font-bold text-purple-900 text-base mb-2">✨ Topik B: Dari Mana Energi Datang?</h3>
      <ul class="text-purple-800 text-sm mb-3 list-disc pl-5">
        <li>Benda yang menyimpan energi disebut sumber energi. Sumber energi di sekitar kita antara lain: (1) Matahari merupakan sumber energi terbesar di Bumi, menghasilkan panas dan cahaya, dapat diubah menjadi listrik lewat panel surya (energi listrik tenaga surya)</li>
        <li>(2) Makanan dan minuman diubah tubuh menjadi energi untuk beraktivitas</li>
        <li>(3) Bahan bakar (kayu, minyak, gas elpiji, bensin, batu bara) mengandung energi kimia yang berubah menjadi panas saat dibakar</li>
        <li>(4) Angin merupakan udara yang bergerak, menghasilkan energi gerak dan dapat diubah menjadi listrik lewat kincir angin (PLTB)</li>
        <li>(5) Air memiliki energi gerak saat mengalir/jatuh, dimanfaatkan pada Pembangkit Listrik Tenaga Air (PLTA)</li>
        <li>(6) Baterai menyimpan energi kimia yang diubah menjadi energi listrik</li>
        <li>(7) Panas bumi merupakan panas yang berasal dari dalam Bumi, dimanfaatkan pada Pembangkit Listrik Tenaga Panas Bumi (PLTP).</li>
      </ul>
      <p class="text-purple-800 text-sm mb-3">Listrik juga dapat ditemukan secara alami, misalnya pada petir dan pada hewan tertentu seperti belut listrik dan ikan pari torpedo.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * -1 }
  },
  {
    id: 'mat-default-7',
    chapter: 'Bab 7',
    subChapter: 'Topik A: Aku Tidak Akan Tersesat',
    subChapterIdx: 0,
    title: 'Materi Bab 7 Sub-bab 1 — Aku Tidak Akan Tersesat',
    desc: 'Materi pembelajaran untuk Topik A mengenai Aku Tidak Akan Tersesat.',
    content: `<div class="p-5 bg-rose-50 rounded-2xl mb-4 border border-rose-200">
      <h3 class="font-bold text-rose-900 text-base mb-2">✨ Topik A: Aku Tidak Akan Tersesat</h3>
      <p class="text-rose-800 text-sm mb-3">Arah mata angin adalah petunjuk untuk mengetahui letak suatu tempat atau benda. Terdapat delapan arah mata angin: Utara, Timur Laut, Timur, Tenggara, Selatan, Barat Daya, Barat, dan Barat Laut.</p>
      <p class="text-rose-800 text-sm mb-3">Matahari terbit di arah timur dan terbenam di arah barat, sehingga dapat digunakan sebagai penentu arah. Manfaat mengetahui arah mata angin antara lain: mengetahui letak suatu tempat, tidak tersesat saat berpetualang, membantu membaca denah atau peta, mengenali posisi kita, dan mengenali arah matahari terbit-terbenam.</p>
      <p class="text-rose-800 text-sm mb-3">Alat yang membantu menentukan arah mata angin antara lain kompas, posisi matahari, peta, dan GPS (Global Positioning System). Kompas bekerja karena Bumi seperti magnet raksasa; jarum kompas selalu menunjuk ke arah utara.</p>
      <p class="text-rose-800 text-sm mb-3">Denah adalah gambar sederhana tentang suatu ruangan, tempat, atau jalan yang biasanya dilengkapi dengan delapan arah mata angin, misalnya denah rumah atau denah perjalanan dari rumah ke sekolah.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * -2 }
  },
  {
    id: 'mat-default-7-sub2',
    chapter: 'Bab 7',
    subChapter: 'Topik B: Penjelajahanku',
    subChapterIdx: 1,
    title: 'Materi Bab 7 Sub-bab 2 — Penjelajahanku',
    desc: 'Materi pembelajaran untuk Topik B mengenai Penjelajahanku.',
    content: `<div class="p-5 bg-rose-50 rounded-2xl mb-4 border border-rose-200">
      <h3 class="font-bold text-rose-900 text-base mb-2">✨ Topik B: Penjelajahanku</h3>
      <p class="text-rose-800 text-sm mb-3">Tempat di alam terbagi menjadi dua jenis. Kenampakan alam (bentang alam) adalah tempat yang terbentuk secara alami, misalnya sungai, gunung, dan gumuk pasir. Kenampakan buatan adalah tempat yang dibuat oleh manusia, misalnya sekolah, kantor pos, dan rumah.</p>
      <p class="text-rose-800 text-sm mb-3">Arah mata angin membantu kita menggambarkan denah perjalanan, misalnya dari rumah ke sekolah, dengan menunjukkan tempat-tempat (kenampakan alam maupun buatan) yang dilalui beserta arahnya.</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * -3 }
  },
  {
    id: 'mat-default-8',
    chapter: 'Bab 8',
    subChapter: 'Topik A: Tiga Sahabat dengan Kekuatan Berbeda',
    subChapterIdx: 0,
    title: 'Materi Bab 8 Sub-bab 1 — Tiga Sahabat dengan Kekuatan Berbeda',
    desc: 'Materi pembelajaran untuk Topik A mengenai Tiga Sahabat dengan Kekuatan Berbeda.',
    content: `<div class="p-5 bg-teal-50 rounded-2xl mb-4 border border-teal-200">
      <h3 class="font-bold text-teal-900 text-base mb-2">✨ Topik A: Tiga Sahabat dengan Kekuatan Berbeda</h3>
      <p class="text-teal-800 text-sm mb-3">Zat adalah segala sesuatu yang dapat dipegang, dituang, atau dihirup, termasuk udara di sekitar kita. Zat memiliki tiga wujud, yaitu padat, cair, dan gas, yang dibedakan berdasarkan susunan dan pergerakan partikel di dalamnya.</p>
      <p class="text-teal-800 text-sm mb-3">Ciri-Ciri Tiga Wujud Zat</p>
      <p class="text-teal-800 text-sm mb-3">Wujud Zat</p>
      <p class="text-teal-800 text-sm mb-3">Susunan Partikel</p>
      <p class="text-teal-800 text-sm mb-3">Sifat</p>
      <p class="text-teal-800 text-sm mb-3">Padat</p>
      <p class="text-teal-800 text-sm mb-3">Rapat dan diam, tersusun rapi</p>
      <p class="text-teal-800 text-sm mb-3">Bentuk dan volume tetap</p>
      <p class="text-teal-800 text-sm mb-3">Cair</p>
      <p class="text-teal-800 text-sm mb-3">Lebih longgar, dapat bergerak pelan</p>
      <p class="text-teal-800 text-sm mb-3">Bentuk mengikuti wadah, volume tetap</p>
      <p class="text-teal-800 text-sm mb-3">Gas</p>
      <p class="text-teal-800 text-sm mb-3">Bebas bergerak dan menyebar ke segala arah</p>
      <p class="text-teal-800 text-sm mb-3">Bentuk dan volume dapat berubah, dapat menekan wadah tertutup</p>
      <p class="text-teal-800 text-sm mb-3">Terdapat pula zat non-Newtonian, yaitu zat unik yang tidak sepenuhnya padat atau cair dan dapat berubah kekentalannya tergantung gaya yang diberikan, misalnya pasta gigi, saus tomat, slime, dan oobleck (campuran tepung maizena dan air).</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * -4 }
  },
  {
    id: 'mat-default-8-sub2',
    chapter: 'Bab 8',
    subChapter: 'Topik B: Saat Wujud Zat Berubah',
    subChapterIdx: 1,
    title: 'Materi Bab 8 Sub-bab 2 — Saat Wujud Zat Berubah',
    desc: 'Materi pembelajaran untuk Topik B mengenai Saat Wujud Zat Berubah.',
    content: `<div class="p-5 bg-teal-50 rounded-2xl mb-4 border border-teal-200">
      <h3 class="font-bold text-teal-900 text-base mb-2">✨ Topik B: Saat Wujud Zat Berubah</h3>
      <p class="text-teal-800 text-sm mb-3">Wujud zat dapat berubah karena pengaruh suhu (panas atau dingin) dan tekanan. Saat dipanaskan, partikel bergerak lebih cepat dan saling menjauh; saat didinginkan, partikel bergerak lebih lambat dan saling mendekat.</p>
      <p class="text-teal-800 text-sm mb-3">Jenis-Jenis Perubahan Wujud Zat</p>
      <p class="text-teal-800 text-sm mb-3">Perubahan</p>
      <p class="text-teal-800 text-sm mb-3">Dari – Menjadi</p>
      <p class="text-teal-800 text-sm mb-3">Penyebab</p>
      <p class="text-teal-800 text-sm mb-3">Contoh</p>
      <p class="text-teal-800 text-sm mb-3">Mencair</p>
      <p class="text-teal-800 text-sm mb-3">Padat → Cair</p>
      <p class="text-teal-800 text-sm mb-3">Suhu panas</p>
      <p class="text-teal-800 text-sm mb-3">Es batu meleleh</p>
      <p class="text-teal-800 text-sm mb-3">Membeku</p>
      <p class="text-teal-800 text-sm mb-3">Cair → Padat</p>
      <p class="text-teal-800 text-sm mb-3">Suhu dingin</p>
      <p class="text-teal-800 text-sm mb-3">Air menjadi es batu</p>
      <p class="text-teal-800 text-sm mb-3">Menguap</p>
      <p class="text-teal-800 text-sm mb-3">Cair → Gas</p>
      <p class="text-teal-800 text-sm mb-3">Suhu panas/tekanan rendah</p>
      <p class="text-teal-800 text-sm mb-3">Air mendidih menjadi uap</p>
      <p class="text-teal-800 text-sm mb-3">Mengembun</p>
      <p class="text-teal-800 text-sm mb-3">Gas → Cair</p>
      <p class="text-teal-800 text-sm mb-3">Suhu dingin</p>
      <p class="text-teal-800 text-sm mb-3">Titik air pada kaca dingin</p>
      <p class="text-teal-800 text-sm mb-3">Menyublim</p>
      <p class="text-teal-800 text-sm mb-3">Padat → Gas</p>
      <p class="text-teal-800 text-sm mb-3">Suhu panas</p>
      <p class="text-teal-800 text-sm mb-3">Kapur barus mengecil dan hilang</p>
      <p class="text-teal-800 text-sm mb-3">Mengkristal</p>
      <p class="text-teal-800 text-sm mb-3">Gas → Padat</p>
      <p class="text-teal-800 text-sm mb-3">Suhu dingin</p>
      <p class="text-teal-800 text-sm mb-3">Uap membentuk salju/embun beku</p>
      <p class="text-teal-800 text-sm mb-3">Tekanan tinggi dapat mempercepat perubahan padat menjadi cair (misalnya bola salju mencair karena ditekan tangan). Tekanan rendah dapat mempercepat perubahan cair menjadi gas (misalnya air lebih cepat mendidih di puncak gunung).</p>
    </div>`,
    createdAt: { seconds: Math.floor(Date.now() / 1000) - 86400 * -5 }
  }
];

// ─── Kurikulum Merdeka · IPAS Kelas 3 ──────────────────────────────────────
const BAB_LIST = [
  {
    id: 1, emoji: <Smile className="w-6 h-6 text-white" />,
    judul: 'Keajaiban Tubuhku',
    gradient: 'from-amber-500 to-orange-600',
    cp: 'Peserta didik mengenal bagian tubuh manusia beserta fungsinya.',
    topics: ['Misteri Tubuhku', 'Tubuhku Unik, Tubuhku Berharga'],
    materi: [
      { type: 'pdf', icon: <FileText className="w-5 h-5 text-gray-500" />, title: 'Rangkuman Bab 1 — Tubuhku', uploader: 'Guru', tanggal: '2 hari lalu' },
    ],
    interaktif: [
      { type: 'matching', icon: <Puzzle className="w-8 h-8 text-amber-500" />, title: 'Cocokkan Bagian Tubuh & Fungsinya', screen: 'dragDrop' as Screen },
    ],
  },
  {
    id: 2, emoji: <Hourglass className="w-6 h-6 text-white" />,
    judul: 'Dahulu, Kini, dan Nanti',
    gradient: 'from-green-500 to-emerald-600',
    cp: 'Peserta didik menceritakan perubahan yang terjadi pada diri dan sekitarnya dari waktu ke waktu.',
    topics: ['Cerita dari Masa Lalu', 'Cerita dari Masa ke Masa'],
    materi: [],
    interaktif: [],
  },
  {
    id: 3, emoji: <Handshake className="w-6 h-6 text-white" />,
    judul: 'Peduli dan Berbagi',
    gradient: 'from-lime-600 to-green-700',
    cp: 'Peserta didik memahami pentingnya bersikap peduli dan berbagi dengan sesama.',
    topics: ['Perjalananku', 'Aku Peduli, Aku Pahlawan'],
    materi: [],
    interaktif: [],
  },
  {
    id: 4, emoji: <Bug className="w-6 h-6 text-white" />,
    judul: 'Siklus Hidup yang Menakjubkan',
    gradient: 'from-yellow-400 to-amber-500',
    cp: 'Peserta didik mengamati dan mendeskripsikan siklus hidup makhluk hidup.',
    topics: ['Rahasia Kehidupan Hewan', 'Rahasia Tumbuhan Tumbuh'],
    materi: [],
    interaktif: [
      { type: 'simulasi', icon: <Microscope className="w-8 h-8 text-yellow-500" />, title: 'Simulasi Metamorfosis', screen: 'simulasiAir' as Screen },
    ],
  },
  {
    id: 5, emoji: '🛒',
    judul: 'Bijak Berbelanja Kebutuhan',
    gradient: 'from-blue-500 to-cyan-600',
    cp: 'Peserta didik mengenal nilai mata uang dan prioritas kebutuhan sehari-hari.',
    topics: ['Ayo, Berkenalan dengan Uang!', 'Hidup Hemat, Hidup Bijak'],
    materi: [],
    interaktif: [],
  },
  {
    id: 6, emoji: '⚡',
    judul: 'Energi, sang Pemberi Kekuatan',
    gradient: 'from-violet-500 to-purple-600',
    cp: 'Peserta didik mengenal bentuk energi dan memanfaatkannya.',
    topics: ['Energi di Sekitar Kita', 'Dari Mana Energi Datang?'],
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
    topics: ['Aku Tidak Akan Tersesat', 'Penjelajahanku'],
    materi: [],
    interaktif: [],
  },
  {
    id: 8, emoji: '🧊',
    judul: 'Rahasia Tiga Wujud Zat',
    gradient: 'from-teal-500 to-cyan-600',
    cp: 'Peserta didik mengidentifikasi benda padat, cair, dan gas beserta perubahannya.',
    topics: ['Tiga Sahabat dengan Kekuatan Berbeda', 'Saat Wujud Zat Berubah'],
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
  const [authMode, setAuthMode] = useState<'login'|'register'>('login');
  const screen = screens[screens.length - 1];
  const navigate = (s: Screen) => setScreens(p => [...p, s]);
  const goBack = () => setScreens(p => (p.length > 1 ? p.slice(0, -1) : p));

  // Role & Teacher Permission State (ensuring students cannot modify videos or materials)
  const [userRole, setUserRole] = useState<'guru' | 'siswa' | null>(() => {
    return (localStorage.getItem('ipas_user_role') as 'guru' | 'siswa') || null;
  });
  const isTeacher = userRole === 'guru' || ['teacherDash', 'uploadMateri', 'buatInteraktif', 'progressSiswa', 'kelolaBab', 'pengaturanGuru'].includes(screen);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (e) {}
    setUserRole(null);
    localStorage.removeItem('ipas_user_role');
    setScreens(['roleSelect']);
  };

  const getBabProgress = (babId: number, hasInteractive: boolean) => {
    const completed = userProfile.completedModules?.[babId] || [];
    if (!Array.isArray(completed) || completed.length === 0) return 0;
    let count = 0;
    if (completed.includes('materi')) count++;
    if (hasInteractive && completed.includes('interaktif')) count++;
    if (completed.includes('kuis')) count++;
    if (completed.includes('proyek')) count++;
    const total = hasInteractive ? 4 : 3;
    return Math.round((count / total) * 100);
  };

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
  const [currentSubBabIdx, setCurrentSubBabIdx] = useState(0); // 0 = Topik A, 1 = Topik B

  // Upload flow (multi-step wizard)
  const [uploadStep, setUploadStep] = useState(0);
  const [uploadChapter, setUploadChapter] = useState('');
  const [uploadSubChapter, setUploadSubChapter] = useState('');
  const [uploadSubChapterIdx, setUploadSubChapterIdx] = useState<number>(0); // 0 = Sub-bab 1 / Topik A, 1 = Sub-bab 2 / Topik B
  const [uploadType, setUploadType] = useState('text'); // 'text' | 'file' | 'video'
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadDesc, setUploadDesc] = useState('');
  const [uploadContent, setUploadContent] = useState(''); // Text, file HTML, or video embed
  const [uploadVideoUrl, setUploadVideoUrl] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadDone, setUploadDone] = useState(false);
  const [isUploadingDB, setIsUploadingDB] = useState(false);

  // Helper to retrieve deleted default material IDs & Titles
  const getDeletedMatIds = (): string[] => {
    try {
      const saved = localStorage.getItem('ipas_deleted_mat_ids');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const getDeletedMatTitles = (): string[] => {
    try {
      const saved = localStorage.getItem('ipas_deleted_mat_titles');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  const getDeletedVideoKeys = (): string[] => {
    try {
      const saved = localStorage.getItem('ipas_deleted_video_keys');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  };

  // Merge external/stored materials with standard INITIAL_MATERIALS curriculum
  const mergeWithDefaults = (materialsList: any[] = [], explicitDeletedIds?: string[], explicitDeletedTitles?: string[]) => {
    const deletedIds = explicitDeletedIds ?? getDeletedMatIds();
    const deletedTitles = explicitDeletedTitles ?? getDeletedMatTitles();

    // Default materials from INITIAL_MATERIALS that haven't been deleted
    const activeDefaults = INITIAL_MATERIALS.filter(
      m => !deletedIds.includes(m.id) && !deletedTitles.includes(m.title)
    );

    // Any custom teacher-uploaded materials
    const customMats = (materialsList || []).filter(m => {
      if (!m) return false;
      if (m.id && deletedIds.includes(m.id)) return false;
      if (m.title && deletedTitles.includes(m.title)) return false;
      if (m.id && m.id.startsWith('mat-default-')) return false; // Already represented in activeDefaults
      return true;
    });

    // Deduplicate by chapter + subChapterIdx + title so duplicate/ghost entries never show up
    const seen = new Set<string>();
    const result: any[] = [];
    for (const m of [...activeDefaults, ...customMats]) {
      const key = `${m.chapter || ''}__${m.subChapterIdx ?? ''}__${m.title || ''}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(m);
      }
    }
    return result;
  };

  // Firestore Data State & Material Management
  const [dbMaterials, setDbMaterials] = useState<any[]>(() => {
    try {
      const saved = localStorage.getItem('ipas_materials');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const merged = mergeWithDefaults(parsed);
          localStorage.setItem('ipas_materials', JSON.stringify(merged));
          return merged;
        }
      }
    } catch (e) {}
    const initial = mergeWithDefaults([]);
    localStorage.setItem('ipas_materials', JSON.stringify(initial));
    return initial;
  });

  const [isSyncingMaterials, setIsSyncingMaterials] = useState(false);

  // Sync materials with database/cache while keeping deletions intact & syncing to cloud!
  const handleSyncMaterials = async () => {
    setIsSyncingMaterials(true);
    try {
      // 1. Fetch cloud deletions first
      let curDeletedIds = getDeletedMatIds();
      let curDeletedTitles = getDeletedMatTitles();
      let curDeletedVideoKeys = getDeletedVideoKeys();

      try {
        const snapDeleted = await getDoc(doc(db, 'settings', 'deleted_materials'));
        if (snapDeleted.exists()) {
          const dData = snapDeleted.data();
          const cloudIds = Array.isArray(dData.deletedIds) ? dData.deletedIds : [];
          const cloudTitles = Array.isArray(dData.deletedTitles) ? dData.deletedTitles : [];
          const cloudVideoKeys = Array.isArray(dData.deletedVideoKeys) ? dData.deletedVideoKeys : [];

          curDeletedIds = Array.from(new Set([...curDeletedIds, ...cloudIds]));
          curDeletedTitles = Array.from(new Set([...curDeletedTitles, ...cloudTitles]));
          curDeletedVideoKeys = Array.from(new Set([...curDeletedVideoKeys, ...cloudVideoKeys]));

          localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(curDeletedIds));
          localStorage.setItem('ipas_deleted_mat_titles', JSON.stringify(curDeletedTitles));
          localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(curDeletedVideoKeys));
        }
      } catch (err) {
        console.warn("Could not fetch cloud deleted_materials:", err);
      }

      // 2. Persist merged deletions to Firestore cloud so all students stay synced
      try {
        await setDoc(doc(db, 'settings', 'deleted_materials'), {
          deletedIds: curDeletedIds,
          deletedTitles: curDeletedTitles,
          deletedVideoKeys: curDeletedVideoKeys,
          updatedAt: serverTimestamp()
        }, { merge: true });
      } catch (err) {
        console.warn("Could not push deleted_materials to Firestore:", err);
      }

      const snapMaterials = await getDocs(query(collection(db, 'materials')));
      const fsMats = snapMaterials.docs.map(d => ({ id: d.id, ...d.data() }));

      // Clean up Firestore documents that were marked as deleted
      for (const d of snapMaterials.docs) {
        const dData = d.data();
        if (curDeletedIds.includes(d.id) || (dData.title && curDeletedTitles.includes(dData.title))) {
          deleteDoc(doc(db, 'materials', d.id)).catch(() => {});
        }
      }

      // Merge preserving deletions (deleted materials stay deleted!)
      const merged = mergeWithDefaults(fsMats, curDeletedIds, curDeletedTitles);
      setDbMaterials(merged);
      localStorage.setItem('ipas_materials', JSON.stringify(merged));

      // Sync sub-bab videos preserving deletions
      const snapVideos = await getDoc(doc(db, 'settings', 'subbab_videos'));
      if (snapVideos.exists()) {
        const vData = snapVideos.data();
        setSubBabVideos(prev => {
          const m = { ...prev, ...vData };
          curDeletedVideoKeys.forEach(k => delete m[k]);
          localStorage.setItem('ipas_subbab_videos', JSON.stringify(m));
          return m;
        });
      }

      showToast('Materi berhasil disinkronkan!');
    } catch (e) {
      console.warn("Sync fallback:", e);
      setDbMaterials(prev => {
        const merged = mergeWithDefaults(prev);
        localStorage.setItem('ipas_materials', JSON.stringify(merged));
        return merged;
      });
      showToast('Materi berhasil disinkronkan (tersimpan lokal).');
    } finally {
      setIsSyncingMaterials(false);
    }
  };

  // Explicit function to restore factory default curriculum if the user ever intentionally wants to reset
  const handleRestoreDefaultCurriculum = async () => {
    if (!window.confirm('Apakah Anda yakin ingin memulihkan semua materi standar bawaan kurikulum? Materi yang pernah dihapus akan dimunculkan kembali.')) {
      return;
    }
    try {
      localStorage.removeItem('ipas_deleted_mat_ids');
      localStorage.removeItem('ipas_deleted_mat_titles');
      localStorage.removeItem('ipas_deleted_video_keys');

      // Also reset in Firestore
      try {
        await setDoc(doc(db, 'settings', 'deleted_materials'), {
          deletedIds: [],
          deletedTitles: [],
          deletedVideoKeys: [],
          updatedAt: serverTimestamp()
        });
      } catch (err) {
        console.warn("Reset cloud deleted_materials error:", err);
      }

      const saved = localStorage.getItem('ipas_materials');
      const parsed = saved ? JSON.parse(saved) : [];
      const customMats = Array.isArray(parsed) ? parsed.filter(m => m.id && !m.id.startsWith('mat-default-')) : [];
      const restored = mergeWithDefaults([...INITIAL_MATERIALS, ...customMats], [], []);
      setDbMaterials(restored);
      localStorage.setItem('ipas_materials', JSON.stringify(restored));
      showToast('Semua materi kurikulum standar telah dipulihkan!');
    } catch (e) {
      showToast('Gagal memulihkan materi standar.');
    }
  };
  const [dbUsers, setDbUsers] = useState<any[]>([]);
  const [localBabs, setLocalBabs] = useState([...BAB_LIST]);
  const [activeMaterial, setActiveMaterial] = useState<any>(null);
  const [viewingFile, setViewingFile] = useState<boolean>(false);

  // Material Deletion & Teacher Filters
  const [deleteModalMat, setDeleteModalMat] = useState<any | null>(null);
  const [isDeletingMat, setIsDeletingMat] = useState(false);
  const [teacherMatFilter, setTeacherMatFilter] = useState('all');
  const [expandedBabTeacher, setExpandedBabTeacher] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Sub-bab Dedicated Video Integration (directly tied to each Sub-bab)
  const DEFAULT_SUBBAB_VIDEOS: Record<string, string> = {
    '1_0': 'https://www.youtube.com/watch?v=GypCnbSAlx8', // Bab 1 Sub-bab 1 (Misteri Tubuhku)
  };

  const [subBabVideos, setSubBabVideos] = useState<Record<string, string>>(() => {
    const delKeys = getDeletedVideoKeys();
    try {
      const saved = localStorage.getItem('ipas_subbab_videos');
      if (saved) {
        const parsed = JSON.parse(saved);
        delKeys.forEach(k => delete parsed[k]);
        return parsed;
      }
    } catch (e) {}
    const initial = { ...DEFAULT_SUBBAB_VIDEOS };
    delKeys.forEach(k => delete initial[k]);
    return initial;
  });

  const [videoModalData, setVideoModalData] = useState<{ babId: number; subBabIdx: number; topicTitle: string; currentUrl: string } | null>(null);
  const [videoInputUrl, setVideoInputUrl] = useState('');

  const extractYoutubeId = (input: string) => {
    if (!input || typeof input !== 'string') return '';
    let str = input.trim();
    // If full iframe tag was pasted, extract src
    const srcMatch = str.match(/src=["']([^"']+)["']/i);
    if (srcMatch) str = srcMatch[1];
    
    // Clean outer quotes or braces if any
    str = str.replace(/^[<"']+|[>"']+$/g, '').trim();

    // If raw 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;

    const patterns = [
      /[?&]v=([a-zA-Z0-9_-]{11})/,
      /youtu\.be\/([a-zA-Z0-9_-]{11})/,
      /youtube\.com\/(?:embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/,
      /youtube-nocookie\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];

    for (const p of patterns) {
      const m = str.match(p);
      if (m && m[1]) return m[1];
    }
    return '';
  };

  const extractYoutubeEmbedUrl = (url: string) => {
    const id = extractYoutubeId(url);
    // Use standard youtube.com/embed with rel=0 & modestbranding=1
    return id ? `https://www.youtube.com/embed/${id}?rel=0&modestbranding=1` : '';
  };

  const getSubBabVideo = (babId: number, subBabIdx: number) => {
    return subBabVideos[`${babId}_${subBabIdx}`] || '';
  };

  const saveSubBabVideo = async (babId: number, subBabIdx: number, url: string) => {
    if (!isTeacher && userRole === 'siswa') {
      showToast('Akses ditolak: Hanya Guru yang dapat mengubah video.');
      return;
    }
    const key = `${babId}_${subBabIdx}`;
    const trimmed = url.trim();
    const updated = { ...subBabVideos };
    if (!trimmed) {
      delete updated[key];
      const delKeys = getDeletedVideoKeys();
      if (!delKeys.includes(key)) {
        delKeys.push(key);
        localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(delKeys));
      }
    } else {
      updated[key] = trimmed;
      const delKeys = getDeletedVideoKeys().filter(k => k !== key);
      localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(delKeys));
    }
    setSubBabVideos(updated);
    try {
      localStorage.setItem('ipas_subbab_videos', JSON.stringify(updated));
    } catch (e) {}

    try {
      await setDoc(doc(db, 'settings', 'subbab_videos'), updated, { merge: true });
    } catch (e) {
      console.warn("Firestore save subbab_videos fallback:", e);
    }

    // Synchronize directly with materials so teacher and students can see and manage it in materials list
    const babObj = BAB_LIST.find(b => b.id === babId);
    const currentSubTopic = babObj?.topics[subBabIdx] || (subBabIdx === 0 ? 'Topik A' : 'Topik B');
    const vidMatId = `vid_${babId}_${subBabIdx}`;

    if (trimmed) {
      const vidMatObj = {
        id: vidMatId,
        chapter: `Bab ${babId}`,
        subChapter: `Topik ${String.fromCharCode(65 + subBabIdx)}: ${currentSubTopic}`,
        subChapterIdx: subBabIdx,
        title: `Video Pembelajaran — ${currentSubTopic}`,
        desc: `Video pembelajaran YouTube untuk Bab ${babId} Sub-bab ${subBabIdx + 1}`,
        content: trimmed,
        createdAt: { seconds: Math.floor(Date.now() / 1000) }
      };

      // Unmark from deleted materials
      const delIds = getDeletedMatIds().filter(id => id !== vidMatId);
      localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(delIds));
      const delTitles = getDeletedMatTitles().filter(t => t !== vidMatObj.title);
      localStorage.setItem('ipas_deleted_mat_titles', JSON.stringify(delTitles));

      setDbMaterials(prev => {
        const idx = prev.findIndex(m => m.id === vidMatId || (m.chapter === `Bab ${babId}` && m.subChapterIdx === subBabIdx && m.content && m.content.includes('youtube')));
        let next;
        if (idx >= 0) {
          next = [...prev];
          next[idx] = { ...next[idx], ...vidMatObj };
        } else {
          next = [vidMatObj, ...prev];
        }
        localStorage.setItem('ipas_materials', JSON.stringify(next));
        return next;
      });

      try {
        await setDoc(doc(db, 'materials', vidMatId), {
          ...vidMatObj,
          createdAt: serverTimestamp()
        }, { merge: true });
      } catch (e) {}
    } else {
      // Mark as deleted material
      const delIds = getDeletedMatIds();
      if (!delIds.includes(vidMatId)) {
        delIds.push(vidMatId);
        localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(delIds));
      }

      // Remove from materials
      setDbMaterials(prev => {
        const next = prev.filter(m => m.id !== vidMatId && !(m.chapter === `Bab ${babId}` && m.subChapterIdx === subBabIdx && m.content && m.content.includes('youtube')));
        localStorage.setItem('ipas_materials', JSON.stringify(next));
        return next;
      });
      try {
        await deleteDoc(doc(db, 'materials', vidMatId));
      } catch (e) {}
    }

    // Synchronize deleted_materials settings in Firestore so students immediately reflect changes
    try {
      await setDoc(doc(db, 'settings', 'deleted_materials'), {
        deletedIds: getDeletedMatIds(),
        deletedTitles: getDeletedMatTitles(),
        deletedVideoKeys: getDeletedVideoKeys(),
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (e) {}

    showToast(trimmed ? `Video untuk Sub-bab ${subBabIdx + 1} berhasil disimpan!` : `Video Sub-bab ${subBabIdx + 1} dihapus.`);
    setVideoModalData(null);
  };

  const openVideoEditModal = (babId: number, subBabIdx: number, topicTitle: string) => {
    if (!isTeacher && userRole === 'siswa') {
      showToast('Akses ditolak: Hanya Guru yang dapat mengubah video pembelajaran.');
      return;
    }
    const current = getSubBabVideo(babId, subBabIdx);
    setVideoInputUrl(current);
    setVideoModalData({ babId, subBabIdx, topicTitle, currentUrl: current });
  };

  const renderVideoModal = () => {
    if (!videoModalData || !isTeacher) return null;
    const previewId = extractYoutubeId(videoInputUrl.trim());
    const previewEmbed = previewId ? `https://www.youtube.com/embed/${previewId}?rel=0` : '';
    const previewWatchUrl = previewId ? `https://www.youtube.com/watch?v=${previewId}` : '';

    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in zoom-in-95">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                <Film className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-gray-800 text-base leading-tight truncate">
                  Video Pembelajaran: Sub-bab {videoModalData.subBabIdx + 1}
                </h3>
                <p className="text-gray-400 text-xs truncate">
                  Bab {videoModalData.babId} · {videoModalData.topicTitle}
                </p>
              </div>
            </div>
            <button
              onClick={() => setVideoModalData(null)}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center text-sm font-bold flex-shrink-0"
            >
              ✕
            </button>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-700 block mb-1.5">
              Tautan / URL Video YouTube:
            </label>
            <input
              type="url"
              value={videoInputUrl}
              onChange={e => setVideoInputUrl(e.target.value)}
              placeholder="Contoh: https://www.youtube.com/watch?v=..."
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-red-500 outline-none text-sm text-gray-700 font-medium"
            />
            <p className="text-[11px] text-gray-400 mt-1.5 leading-relaxed">
              💡 <strong>Langsung Terhubung:</strong> Video ini akan otomatis menyatu dan diputar langsung pada materi Sub-bab {videoModalData.subBabIdx + 1} tanpa perlu membuat dokumen terpisah.
            </p>
          </div>

          {previewEmbed && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  ✓ Pratinjau Video YouTube:
                </p>
                {previewWatchUrl && (
                  <a
                    href={previewWatchUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                  >
                    <PlayCircle className="w-3.5 h-3.5" /> Buka di YouTube ↗
                  </a>
                )}
              </div>
              <div className="w-full aspect-video rounded-2xl overflow-hidden bg-black shadow-inner border border-gray-100">
                <iframe
                  width="100%"
                  height="100%"
                  src={previewEmbed}
                  title="Pratinjau Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>
              <p className="text-[11px] text-gray-400">
                Jika video bertuliskan "Tidak Tersedia", gunakan tombol "Buka di YouTube ↗" untuk memastikannya.
              </p>
            </div>
          )}

          <div className="flex items-center justify-between pt-2 gap-2">
            {videoModalData.currentUrl ? (
              <button
                type="button"
                onClick={() => saveSubBabVideo(videoModalData.babId, videoModalData.subBabIdx, '')}
                className="px-4 py-2.5 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs border border-rose-200 active:scale-95 transition-all"
              >
                Hapus Video
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setVideoModalData(null)}
                className="px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-100 font-bold text-xs active:scale-95 transition-all"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => saveSubBabVideo(videoModalData.babId, videoModalData.subBabIdx, videoInputUrl)}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
              >
                <Film className="w-3.5 h-3.5" /> Simpan ke Sub-bab 🚀
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const handleDeleteMaterialClick = (mat: any) => {
    if (!isTeacher) {
      showToast('Akses ditolak: Hanya Guru yang dapat menghapus materi.');
      return;
    }
    setDeleteModalMat(mat);
  };

  const confirmDeleteMaterial = async () => {
    if (!isTeacher) {
      showToast('Akses ditolak: Hanya Guru yang dapat menghapus materi.');
      return;
    }
    if (!deleteModalMat) return;

    const targetMat = { ...deleteModalMat };
    const targetId = targetMat.id;
    const targetTitle = targetMat.title;
    const targetChapter = targetMat.chapter;

    // 1. Optimistically update local state & localStorage immediately
    setDbMaterials(prev => {
      const updated = prev.filter(m => {
        if (targetId && m.id === targetId) return false;
        if (targetTitle && m.title === targetTitle && (!targetChapter || m.chapter === targetChapter)) return false;
        return true;
      });
      localStorage.setItem('ipas_materials', JSON.stringify(updated));
      return updated;
    });

    // 2. Persist deleted IDs and deleted Titles
    let updatedDeletedIds = getDeletedMatIds();
    if (targetId) {
      if (!updatedDeletedIds.includes(targetId)) {
        updatedDeletedIds = [...updatedDeletedIds, targetId];
        localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(updatedDeletedIds));
      }
    }
    let updatedDeletedTitles = getDeletedMatTitles();
    if (targetTitle) {
      if (!updatedDeletedTitles.includes(targetTitle)) {
        updatedDeletedTitles = [...updatedDeletedTitles, targetTitle];
        localStorage.setItem('ipas_deleted_mat_titles', JSON.stringify(updatedDeletedTitles));
      }
    }

    // 3. If it is a video material, also purge from subBabVideos and video settings
    let updatedDelVidKeys = getDeletedVideoKeys();
    if (targetId && targetId.startsWith('vid_')) {
      const parts = targetId.split('_');
      if (parts.length >= 3) {
        const vidKey = `${parts[1]}_${parts[2]}`;
        setSubBabVideos(prev => {
          const next = { ...prev };
          delete next[vidKey];
          localStorage.setItem('ipas_subbab_videos', JSON.stringify(next));
          return next;
        });
        if (!updatedDelVidKeys.includes(vidKey)) {
          updatedDelVidKeys = [...updatedDelVidKeys, vidKey];
          localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(updatedDelVidKeys));
        }
        try {
          setDoc(doc(db, 'settings', 'subbab_videos'), { [vidKey]: deleteField() }, { merge: true }).catch(() => {});
        } catch (e) {}
      }
    }

    // 4. Close modal and show notification
    setIsDeletingMat(false);
    setDeleteModalMat(null);
    showToast(`Materi berhasil dihapus!`);

    // 5. Persist deleted list to Firestore settings so student devices receive it in real-time!
    try {
      await setDoc(doc(db, 'settings', 'deleted_materials'), {
        deletedIds: updatedDeletedIds,
        deletedTitles: updatedDeletedTitles,
        deletedVideoKeys: updatedDelVidKeys,
        updatedAt: serverTimestamp()
      }, { merge: true });
    } catch (err) {
      console.warn("Firestore save deleted_materials error:", err);
    }

    // 6. Delete from Firestore materials collection in the background
    if (targetId && !targetId.startsWith('mat-default-') && !targetId.startsWith('mat_local_')) {
      try {
        await deleteDoc(doc(db, 'materials', targetId));
      } catch (err) {
        console.warn("Firestore deleteDoc background sync:", err);
      }
    }
    if (targetTitle) {
      try {
        const titleQuery = query(collection(db, 'materials'), where('title', '==', targetTitle));
        const titleSnaps = await getDocs(titleQuery);
        for (const d of titleSnaps.docs) {
          deleteDoc(doc(db, 'materials', d.id)).catch(() => {});
        }
      } catch (err) {
        console.warn("Firestore delete by title background sync:", err);
      }
    }
  };

  const renderDeleteModal = () => {
    if (!deleteModalMat || !isTeacher) return null;
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gray-100 text-center animate-in zoom-in-95">
          <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-7 h-7" />
          </div>
          <h3 className="font-display text-gray-800 text-lg mb-1">Hapus Materi?</h3>
          <p className="text-gray-500 text-xs mb-4 leading-relaxed">
            Apakah Ibu/Bapak Guru yakin ingin menghapus materi <strong className="text-gray-700 font-semibold">"{deleteModalMat.title}"</strong> ({deleteModalMat.chapter})? Materi ini akan hilang dari aplikasi siswa.
          </p>
          <div className="flex gap-2.5">
            <button
              type="button"
              onClick={() => setDeleteModalMat(null)}
              disabled={isDeletingMat}
              className="flex-1 py-3 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition-all active:scale-95"
            >
              Batal
            </button>
            <button
              type="button"
              onClick={confirmDeleteMaterial}
              disabled={isDeletingMat}
              className="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-200 transition-all active:scale-95"
            >
              {isDeletingMat ? 'Menghapus...' : (
                <>
                  <Trash2 className="w-3.5 h-3.5" /> Ya, Hapus
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderToast = () => {
    if (!toastMessage) return null;
    return (
      <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-gray-900/95 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-3 text-xs font-semibold">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
        <span>{toastMessage}</span>
      </div>
    );
  };

  // State ukuran font siswa, tersimpan di localStorage agar persisten
  const [studentFontSize, setStudentFontSize] = useState<number>(() => {
    const saved = localStorage.getItem('studentFontSize');
    return saved ? parseInt(saved) : 18;
  });
  
  // State accordion sub-bab di daftarBab / studentHome
  const [expandedBab, setExpandedBab] = useState<number | null>(null);

  // Zoom otomatis: skala semua elemen siswa proporsional tanpa konflik dengan Tailwind
  const studentZoom = studentFontSize / 16; // 16=1.0, 18=1.125, 20=1.25, 22=1.375, 24=1.5

  const handleSetFontSize = (size: number) => {
    setStudentFontSize(size);
    localStorage.setItem('studentFontSize', String(size));
  };
  
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
            const resolvedRole: 'guru' | 'siswa' = data.role === 'guru' ? 'guru' : 'siswa';
            setUserRole(resolvedRole);
            localStorage.setItem('ipas_user_role', resolvedRole);
            setUserProfile({ xp: data.xp || 0, coins: data.coins || 0, completedModules: data.completedModules || {} });
            
            // Sync displayName to Firestore if missing or updated
            if (user.displayName && data.displayName !== user.displayName) {
              await setDoc(docRef, { displayName: user.displayName }, { merge: true });
            }
            
            // Auto-login redirect
            setScreens(p => {
              const curr = p[p.length - 1];
              if (curr === 'splash' || curr === 'homepage' || curr === 'roleSelect' || curr === 'loginGuru' || curr === 'loginSiswa') {
                return resolvedRole === 'guru' ? ['teacherDash'] : ['studentHome'];
              }
              return p;
            });
          } else {
            // New user without profile, default to siswa unless set
            const defaultProfile = { xp: 0, coins: 0, completedModules: {}, displayName: user.displayName || 'Pengguna Baru' };
            await setDoc(docRef, defaultProfile);
            setUserProfile(defaultProfile);
          }
        } catch (e) { console.error("Error fetching user profile", e); }
      } else {
        setUserRole(null);
        localStorage.removeItem('ipas_user_role');
        setUserProfile({ xp: 0, coins: 0, completedModules: {} });
      }
    });
    return () => unsubscribe();
  }, []);

  // Ensure teacher screens have teacher role
  useEffect(() => {
    const teacherOnlyScreens: Screen[] = ['teacherDash', 'uploadMateri', 'buatInteraktif', 'progressSiswa', 'kelolaBab', 'pengaturanGuru'];
    if (teacherOnlyScreens.includes(screen) && userRole !== 'guru') {
      setUserRole('guru');
      localStorage.setItem('ipas_user_role', 'guru');
    }
  }, [screen]);

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

  // Real-time synchronization for deleted materials, materials collection, and sub-bab videos
  useEffect(() => {
    // 1. Sync deleted materials settings so students immediately reflect teacher deletions
    const unsubDeleted = onSnapshot(doc(db, 'settings', 'deleted_materials'), (snap) => {
      if (snap.exists()) {
        const dData = snap.data();
        const cloudIds: string[] = Array.isArray(dData.deletedIds) ? dData.deletedIds : [];
        const cloudTitles: string[] = Array.isArray(dData.deletedTitles) ? dData.deletedTitles : [];
        const cloudVideoKeys: string[] = Array.isArray(dData.deletedVideoKeys) ? dData.deletedVideoKeys : [];

        const localIds = getDeletedMatIds();
        const localTitles = getDeletedMatTitles();
        const localVideoKeys = getDeletedVideoKeys();

        const combinedIds = Array.from(new Set([...localIds, ...cloudIds]));
        const combinedTitles = Array.from(new Set([...localTitles, ...cloudTitles]));
        const combinedVideoKeys = Array.from(new Set([...localVideoKeys, ...cloudVideoKeys]));

        localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(combinedIds));
        localStorage.setItem('ipas_deleted_mat_titles', JSON.stringify(combinedTitles));
        localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(combinedVideoKeys));

        setDbMaterials(prev => {
          const merged = mergeWithDefaults(prev, combinedIds, combinedTitles);
          localStorage.setItem('ipas_materials', JSON.stringify(merged));
          return merged;
        });

        setSubBabVideos(prev => {
          const next = { ...prev };
          combinedVideoKeys.forEach(k => delete next[k]);
          localStorage.setItem('ipas_subbab_videos', JSON.stringify(next));
          return next;
        });
      } else {
        // If settings/deleted_materials doesn't exist yet, but local device has deletions (e.g. from teacher)
        const localIds = getDeletedMatIds();
        const localTitles = getDeletedMatTitles();
        const localVideoKeys = getDeletedVideoKeys();
        if (localIds.length > 0 || localTitles.length > 0 || localVideoKeys.length > 0) {
          setDoc(doc(db, 'settings', 'deleted_materials'), {
            deletedIds: localIds,
            deletedTitles: localTitles,
            deletedVideoKeys: localVideoKeys,
            updatedAt: serverTimestamp()
          }, { merge: true }).catch(() => {});
        }
      }
    }, (err) => {
      console.warn("onSnapshot deleted_materials fallback:", err);
    });

    // 2. Real-time sync for materials collection
    const unsubMaterials = onSnapshot(collection(db, 'materials'), (snap) => {
      const fsMats = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      const curDeletedIds = getDeletedMatIds();
      const curDeletedTitles = getDeletedMatTitles();
      const merged = mergeWithDefaults(fsMats, curDeletedIds, curDeletedTitles);
      setDbMaterials(merged);
      localStorage.setItem('ipas_materials', JSON.stringify(merged));
    }, (err) => {
      console.warn("onSnapshot materials fallback:", err);
    });

    // 3. Real-time sync for subbab_videos
    const unsubVideos = onSnapshot(doc(db, 'settings', 'subbab_videos'), (snap) => {
      if (snap.exists()) {
        const vData = snap.data();
        const delVidKeys = getDeletedVideoKeys();
        setSubBabVideos(prev => {
          const next = { ...prev, ...vData };
          delVidKeys.forEach(k => delete next[k]);
          localStorage.setItem('ipas_subbab_videos', JSON.stringify(next));
          return next;
        });
      }
    }, (err) => {
      console.warn("onSnapshot subbab_videos fallback:", err);
    });

    return () => {
      unsubDeleted();
      unsubMaterials();
      unsubVideos();
    };
  }, []);

  // Fetch Firestore Data when screen changes to avoid manual refresh
  useEffect(() => {
    if (['detailBab', 'teacherDash', 'studentHome', 'daftarBab', 'subBab', 'progressSiswa', 'kelolaBab', 'bacaMateri', 'mediaHub', 'studentPengaturan'].includes(screen)) {
      const fetchDb = async () => {
        try {
          // Fetch deleted materials list first
          const snapDeleted = await getDoc(doc(db, 'settings', 'deleted_materials'));
          let curDeletedIds = getDeletedMatIds();
          let curDeletedTitles = getDeletedMatTitles();
          let curDeletedVideoKeys = getDeletedVideoKeys();

          if (snapDeleted.exists()) {
            const dData = snapDeleted.data();
            const cloudIds = Array.isArray(dData.deletedIds) ? dData.deletedIds : [];
            const cloudTitles = Array.isArray(dData.deletedTitles) ? dData.deletedTitles : [];
            const cloudVideoKeys = Array.isArray(dData.deletedVideoKeys) ? dData.deletedVideoKeys : [];

            curDeletedIds = Array.from(new Set([...curDeletedIds, ...cloudIds]));
            curDeletedTitles = Array.from(new Set([...curDeletedTitles, ...cloudTitles]));
            curDeletedVideoKeys = Array.from(new Set([...curDeletedVideoKeys, ...cloudVideoKeys]));

            localStorage.setItem('ipas_deleted_mat_ids', JSON.stringify(curDeletedIds));
            localStorage.setItem('ipas_deleted_mat_titles', JSON.stringify(curDeletedTitles));
            localStorage.setItem('ipas_deleted_video_keys', JSON.stringify(curDeletedVideoKeys));
          } else if (curDeletedIds.length > 0 || curDeletedTitles.length > 0 || curDeletedVideoKeys.length > 0) {
            setDoc(doc(db, 'settings', 'deleted_materials'), {
              deletedIds: curDeletedIds,
              deletedTitles: curDeletedTitles,
              deletedVideoKeys: curDeletedVideoKeys,
              updatedAt: serverTimestamp()
            }, { merge: true }).catch(() => {});
          }

          const snapMaterials = await getDocs(query(collection(db, 'materials')));
          const fsMats = snapMaterials.docs.map(d => ({ id: d.id, ...d.data() }));
          const merged = mergeWithDefaults(fsMats, curDeletedIds, curDeletedTitles);
          setDbMaterials(merged);
          localStorage.setItem('ipas_materials', JSON.stringify(merged));
          
          if (['teacherDash', 'progressSiswa', 'kelolaBab'].includes(screen)) {
            const snapUsers = await getDocs(query(collection(db, 'users')));
            setDbUsers(snapUsers.docs.map(d => ({ id: d.id, ...d.data() })));
          }

          const snapVideos = await getDoc(doc(db, 'settings', 'subbab_videos'));
          if (snapVideos.exists()) {
            const vData = snapVideos.data();
            setSubBabVideos(prev => {
              const mergedVid = { ...prev, ...vData };
              curDeletedVideoKeys.forEach(k => delete mergedVid[k]);
              localStorage.setItem('ipas_subbab_videos', JSON.stringify(mergedVid));
              return mergedVid;
            });
          }
        } catch (e) {
          console.error(e);
          // Fallback safely so standard curriculum materials remain visible even offline
          setDbMaterials(prev => {
            const merged = mergeWithDefaults(prev);
            localStorage.setItem('ipas_materials', JSON.stringify(merged));
            return merged;
          });
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
    const map: Record<string, Screen> = { home: 'studentHome', bab: 'daftarBab', aktivitas: 'mediaHub', proyek: 'proyekP5', pengaturan: 'studentPengaturan' };
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
        { id: 'pengaturan', icon: <Settings className="w-5 h-5" />, label: 'Pengaturan' },
      ].map(t => {
        const active = activeTab === t.id;
        return (
          <button key={t.id} onClick={() => handleTabPress(t.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all ${active ? 'bg-emerald-100' : ''}`}>
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
  // ── 0. HOMEPAGE / PENGANTAR ───────────────────────────────────────────────
  if (screen === 'homepage') return (
    <div className="h-full bg-white flex flex-col overflow-hidden relative">
      <div className="flex-1 overflow-y-auto">
        {/* Hero Section */}
        <div className="relative w-full min-h-[520px] sm:min-h-[560px] md:min-h-[600px] lg:min-h-[640px] landscape:min-h-[480px] md:landscape:min-h-[580px] rounded-b-[3rem] sm:rounded-b-[3.5rem] md:rounded-b-[4.5rem] shadow-xl overflow-hidden flex flex-col justify-center transition-colors duration-700"
          style={{
            background: onboardSlide === 0 ? 'linear-gradient(160deg, #064e3b 0%, #065f46 40%, #0d9488 100%)' :
                        onboardSlide === 1 ? 'linear-gradient(160deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)' :
                        onboardSlide === 2 ? 'linear-gradient(160deg, #0c4a6e 0%, #075985 45%, #0891b2 100%)' :
                        'linear-gradient(160deg, #431407 0%, #9a3412 40%, #ea580c 80%, #f59e0b 100%)'
          }}>
          
          {/* Slide 1: Welcome */}
          <div className={`absolute inset-0 flex flex-col md:flex-row landscape:flex-row items-center justify-center md:justify-between landscape:justify-between px-6 sm:px-12 md:px-16 lg:px-24 max-w-6xl mx-auto w-full h-full transition-opacity duration-500 gap-6 md:gap-12 pb-12 sm:pb-14 md:pb-8 ${onboardSlide === 0 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* Text Content */}
            <div className="order-2 md:order-1 landscape:order-1 text-center md:text-left landscape:text-left flex-1 max-w-xl flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/15 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 inline-block mb-3 sm:mb-4 border border-white/20 shadow-xs">
                <span className="text-emerald-200 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase">KURIKULUM MERDEKA 2024</span>
              </div>
              <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-2.5 sm:mb-4">
                Jelajah Ilmu Alam<br/>& Sosial
              </h2>
              <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 landscape:mx-0">
                Platform belajar digital yang dirancang khusus untuk siswa Kelas 3 SD — belajar sains dan sosial jadi petualangan seru!
              </p>
              <div className="hidden sm:flex flex-wrap gap-2 justify-center md:justify-start landscape:justify-start">
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" /> 8 Bab Pembelajaran
                </span>
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Gamepad2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" /> Media Interaktif
                </span>
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Leaf className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-lime-300" /> Proyek P5
                </span>
              </div>
            </div>

            {/* Visual Graphic */}
            <div className="order-1 md:order-2 landscape:order-2 flex-1 relative flex items-center justify-center w-full min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
              <div className="absolute w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 rounded-full opacity-20 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #34d399 0%, transparent 70%)', animation: 'pulse-glow 3s ease-in-out infinite' }} />
              
              {/* Arc Elements */}
              {[
                { e: <Leaf className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Tumbuhan', a: -70, r: 110 },
                { e: <TestTube className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Wujud Zat', a: -20, r: 125 },
                { e: <Zap className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Gaya', a: 30, r: 120 },
                { e: <Battery className="w-5 h-5 sm:w-6 sm:h-6" />, label: 'Energi', a: 75, r: 108 },
              ].map((c, i) => (
                <div key={i} className="absolute flex flex-col items-center gap-1 pointer-events-none"
                  style={{
                    left: `calc(50% + ${Math.cos((c.a * Math.PI)/180) * c.r}px)`,
                    top: `calc(50% + ${Math.sin((c.a * Math.PI)/180) * c.r}px)`,
                    transform: 'translate(-50%, -50%)',
                    animation: `floatX ${3.2 + i * 0.4}s ease-in-out infinite ${i * 0.3}s`,
                  }}>
                  <div className="w-11 h-11 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-white/15 backdrop-blur-md rounded-2xl flex items-center justify-center text-xl sm:text-2xl border border-white/25 shadow-lg">{c.e}</div>
                  <span className="text-white/80 text-[9px] sm:text-xs font-bold whitespace-nowrap">{c.label}</span>
                </div>
              ))}

              <div className="relative z-10 flex flex-col items-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-5xl sm:text-6xl mb-2 sm:mb-3 animate-pulse-glow shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.35)' }}>
                   <Globe className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 text-white" /> 
                </div>
                <div className="flex">
                  {'IPAS'.split('').map((ch, i) => (
                    <span key={i} className="font-display text-white inline-block text-3xl sm:text-4xl md:text-5xl" style={{ animation: `bounce-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${0.1 + i * 0.08}s both` }}>{ch}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Slide 2: Guru */}
          <div className={`absolute inset-0 flex flex-col md:flex-row landscape:flex-row items-center justify-center md:justify-between landscape:justify-between px-6 sm:px-12 md:px-16 lg:px-24 max-w-6xl mx-auto w-full h-full transition-opacity duration-500 gap-6 md:gap-12 pb-12 sm:pb-14 md:pb-8 ${onboardSlide === 1 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* Text Content */}
            <div className="order-2 md:order-1 landscape:order-1 text-center md:text-left landscape:text-left flex-1 max-w-xl flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/15 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 inline-block mb-3 sm:mb-4 border border-white/20 shadow-xs">
                <span className="text-violet-200 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase">UNTUK GURU</span>
              </div>
              <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-2.5 sm:mb-4">
                Manajemen Kelas<br/>Lebih Mudah
              </h2>
              <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 landscape:mx-0">
                Upload PDF, video pembelajaran YouTube, dan rangkuman materi. Buat kuis & media interaktif serta pantau progres seluruh kelas secara real-time.
              </p>
              <div className="hidden sm:flex flex-wrap gap-2 justify-center md:justify-start landscape:justify-start">
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Upload className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-300" /> Upload Materi Lengkap
                </span>
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <BarChart2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-300" /> Pantau Analitik Siswa
                </span>
              </div>
            </div>

            {/* Visual Graphic */}
            <div className="order-1 md:order-2 landscape:order-2 flex-1 relative flex items-center justify-center w-full min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
              <div className="absolute w-56 sm:w-72 md:w-88 h-56 sm:h-72 md:h-88 rounded-full opacity-15 pointer-events-none"
                style={{ background: 'radial-gradient(circle, #a78bfa 0%, transparent 70%)' }} />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-36 md:h-36 rounded-3xl md:rounded-[2.5rem] flex items-center justify-center mb-2 sm:mb-4 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.3)', animation: 'float 3s ease-in-out infinite' }}>
                   <School className="w-10 h-10 sm:w-14 sm:h-14 md:w-18 md:h-18 text-white" />
                </div>

                {[
                  { icon: <Upload className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Upload Materi', color: 'from-sky-500 to-blue-600', pos: '-top-4 -left-24 sm:-left-28 md:-left-36', delay: '0s' },
                  { icon: <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Buat Interaktif', color: 'from-violet-500 to-purple-600', pos: 'top-0 -right-24 sm:-right-28 md:-right-36', delay: '0.2s' },
                  { icon: <BarChart2 className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Pantau Siswa', color: 'from-emerald-500 to-teal-600', pos: 'bottom-0 -left-20 sm:-left-24 md:-left-32', delay: '0.4s' },
                  { icon: <Puzzle className="w-4 h-4 sm:w-5 sm:h-5" />, text: 'Kuis & Game', color: 'from-amber-500 to-orange-500', pos: 'bottom-2 -right-20 sm:-right-24 md:-right-32', delay: '0.6s' },
                ].map((f, i) => (
                  <div key={i} className={`absolute ${f.pos} bg-gradient-to-r ${f.color} rounded-2xl px-2.5 sm:px-3.5 py-1.5 sm:py-2.5 flex items-center gap-2 shadow-xl border border-white/20`}
                    style={{ animation: `floatX ${3 + i * 0.3}s ease-in-out infinite ${f.delay}` }}>
                    <span className="text-white">{f.icon}</span>
                    <span className="text-white text-[10px] sm:text-xs md:text-sm font-black whitespace-nowrap">{f.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide 3: Siswa */}
          <div className={`absolute inset-0 flex flex-col md:flex-row landscape:flex-row items-center justify-center md:justify-between landscape:justify-between px-6 sm:px-12 md:px-16 lg:px-24 max-w-6xl mx-auto w-full h-full transition-opacity duration-500 gap-6 md:gap-12 pb-12 sm:pb-14 md:pb-8 ${onboardSlide === 2 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* Text Content */}
            <div className="order-2 md:order-1 landscape:order-1 text-center md:text-left landscape:text-left flex-1 max-w-xl flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/15 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 inline-block mb-3 sm:mb-4 border border-white/20 shadow-xs">
                <span className="text-sky-200 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase">UNTUK SISWA</span>
              </div>
              <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-2.5 sm:mb-4">
                Belajar Sambil<br/>Bermain!
              </h2>
              <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 landscape:mx-0">
                Video pembelajaran animasi, kuis interaktif, percobaan virtual, dan simulasi sains seru — belajar jadi tidak membosankan.
              </p>
              <div className="hidden sm:flex flex-wrap gap-2 justify-center md:justify-start landscape:justify-start">
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300" /> Kumpulkan XP & Koin
                </span>
                <span className="bg-white/15 backdrop-blur-md px-3 sm:px-4 py-1.5 rounded-xl text-white text-xs sm:text-sm font-bold border border-white/20 flex items-center gap-1.5 shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-300" /> Eksperimen Virtual
                </span>
              </div>
            </div>

            {/* Visual Graphic */}
            <div className="order-1 md:order-2 landscape:order-2 flex-1 relative flex items-center justify-center w-full min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
              <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-5 z-10 w-full max-w-xs sm:max-w-sm md:max-w-md">
                {[
                  { icon: <Puzzle className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />, title: 'Drag & Drop', sub: 'Cocokkan bagian', color: 'from-green-500 to-emerald-600', delay: '0s' },
                  { icon: <GalleryVertical className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />, title: 'Kartu Konsep', sub: 'Balik & pelajari', color: 'from-blue-500 to-cyan-500', delay: '0.15s' },
                  { icon: <Telescope className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />, title: 'Eksperimen', sub: 'Coba virtual', color: 'from-violet-500 to-purple-600', delay: '0.3s' },
                  { icon: <Waves className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />, title: 'Simulasi Air', sub: 'Animasi interaktif', color: 'from-sky-500 to-blue-600', delay: '0.45s' },
                ].map((a, i) => (
                  <div key={i} className={`bg-gradient-to-br ${a.color} rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 shadow-xl border border-white/20`} style={{ animation: `stagger-in 0.5s ease-out ${a.delay} both` }}>
                    <span className="block mb-2">{a.icon}</span>
                    <p className="text-white font-black text-xs sm:text-sm md:text-base leading-tight">{a.title}</p>
                    <p className="text-white/80 text-[10px] sm:text-xs mt-1">{a.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Slide 4: Final */}
          <div className={`absolute inset-0 flex flex-col md:flex-row landscape:flex-row items-center justify-center md:justify-between landscape:justify-between px-6 sm:px-12 md:px-16 lg:px-24 max-w-6xl mx-auto w-full h-full transition-opacity duration-500 gap-6 md:gap-12 pb-12 sm:pb-14 md:pb-8 ${onboardSlide === 3 ? 'opacity-100 z-10 pointer-events-auto' : 'opacity-0 z-0 pointer-events-none'}`}>
            
            {/* Text Content */}
            <div className="order-2 md:order-1 landscape:order-1 text-center md:text-left landscape:text-left flex-1 max-w-xl flex-shrink-0" style={{ animation: 'slideUp 0.6s ease-out 0.3s both' }}>
              <div className="bg-white/15 backdrop-blur-md rounded-full px-3.5 sm:px-4 py-1.5 inline-block mb-3 sm:mb-4 border border-white/20 shadow-xs">
                <span className="text-amber-200 text-[10px] sm:text-xs md:text-sm font-black tracking-widest uppercase">SIAP BEREKSPLORASI</span>
              </div>
              <h2 className="font-display text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-2.5 sm:mb-4">
                Ayo Mulai<br/>Sekarang!
              </h2>
              <p className="text-white/80 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-medium mb-4 sm:mb-6 max-w-lg mx-auto md:mx-0 landscape:mx-0">
                Siap untuk mengeksplorasi keajaiban ilmu alam & sosial bersama teman dan gurumu?
              </p>
              <div className="hidden sm:inline-block">
                <button 
                  onClick={() => navigate('roleSelect')}
                  className="bg-white hover:bg-amber-50 text-gray-900 font-bold px-6 py-3.5 rounded-2xl text-sm sm:text-base md:text-lg shadow-xl active:scale-95 transition-all flex items-center gap-2.5"
                >
                  Pilih Peran & Masuk <Rocket className="w-5 h-5 text-amber-600" />
                </button>
              </div>
            </div>

            {/* Visual Graphic */}
            <div className="order-1 md:order-2 landscape:order-2 flex-1 relative flex items-center justify-center w-full min-h-[200px] sm:min-h-[260px] md:min-h-[320px]">
              {[<Leaf className="w-5 h-5 text-white/50" />, <Star className="w-5 h-5 text-yellow-300" />, <Microscope className="w-5 h-5 text-white/50" />, '✦', <TestTube className="w-5 h-5 text-white/50" />, '✦', <Zap className="w-5 h-5 text-amber-300" />, <Star className="w-5 h-5 text-yellow-300" />].map((p, i) => (
                <div key={i} className="absolute text-xl select-none"
                  style={{ left: `${12 + i * 10}%`, top: `${15 + (i % 3) * 25}%`, animation: `floatX ${2.5 + i * 0.4}s ease-in-out infinite ${i * 0.2}s`, opacity: 0.6 }}>{p}</div>
              ))}

              <div className="relative z-10 text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center text-5xl sm:text-6xl mx-auto mb-3 sm:mb-5 shadow-2xl"
                  style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(20px)', border: '2px solid rgba(255,255,255,0.4)', animation: 'float 3s ease-in-out infinite' }}>
                   <Rocket className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-white" /> 
                </div>
                
                <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 max-w-[280px] sm:max-w-xs md:max-w-md mx-auto">
                  {[1,2,3,4,5,6,7,8].map(id => (
                    <div key={id} className="bg-white/15 backdrop-blur-sm rounded-full px-2.5 sm:px-3 py-1 border border-white/25 shadow-xs"
                      style={{ animation: `bounce-in 0.4s ease-out ${(id - 1) * 0.05}s both` }}>
                      <span className="text-white text-[10px] sm:text-xs md:text-sm font-bold">Bab {id}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 sm:bottom-5 md:bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {[0, 1, 2, 3].map(i => (
              <button key={i} onClick={() => setOnboardSlide(i)}
                className="rounded-full transition-all duration-400 cursor-pointer"
                style={{ width: i === onboardSlide ? 28 : 8, height: 8, background: i === onboardSlide ? 'white' : 'rgba(255,255,255,0.4)' }} />
            ))}
          </div>
        </div>

        {/* Sections Below Hero */}
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-16 py-10 sm:py-14 md:py-20 space-y-12 sm:space-y-16 md:space-y-24">
          {/* Section 1: Pengantar Kurikulum */}
          <ScrollReveal delay={100}>
            <div className="inline-block bg-teal-50 text-teal-700 px-4 py-1.5 rounded-full text-xs sm:text-sm md:text-base font-bold mb-3 sm:mb-4">
              Pendekatan Baru
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-3 sm:mb-5">
              Sesuai Kurikulum Merdeka
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed mb-6 sm:mb-8 max-w-3xl">
              Aplikasi ini dirancang khusus mengikuti Capaian Pembelajaran (CP) terbaru. Kami mengubah cara belajar dari sekadar menghafal menjadi bereksplorasi secara aktif.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 md:gap-8">
              <div className="bg-emerald-50 rounded-3xl p-6 sm:p-8 md:p-10 border border-emerald-100 flex items-start gap-4 sm:gap-5 shadow-xs">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                  <Brain className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="font-bold text-emerald-900 text-base sm:text-xl md:text-2xl mb-1.5">Berpikir Kritis</p>
                  <p className="text-emerald-700 text-xs sm:text-sm md:text-base leading-relaxed">Melalui simulasi sains & eksperimen virtual yang seru dan menantang.</p>
                </div>
              </div>
              <div className="bg-orange-50 rounded-3xl p-6 sm:p-8 md:p-10 border border-orange-100 flex items-start gap-4 sm:gap-5 shadow-xs">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-orange-100 text-orange-700 flex items-center justify-center flex-shrink-0">
                  <Leaf className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <p className="font-bold text-orange-900 text-base sm:text-xl md:text-2xl mb-1.5">Proyek P5</p>
                  <p className="text-orange-700 text-xs sm:text-sm md:text-base leading-relaxed">Misi nyata pelestarian lingkungan dan gaya hidup berkelanjutan.</p>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Section 2: Fitur Spesifik */}
          <div>
            <ScrollReveal delay={0}>
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 mb-6 sm:mb-10 text-center">
                Apa Saja Keunggulannya?
              </h2>
            </ScrollReveal>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {/* Siswa Card */}
              <ScrollReveal delay={100}>
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                    <User className="w-32 h-32 md:w-44 md:h-44 text-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-white mb-3">Untuk Siswa</span>
                    <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Petualangan Belajar Seru</h3>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base mb-6">Membuka rasa ingin tahu anak dengan cara yang menyenangkan.</p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-blue-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Mainkan media edukasi interaktif (Drag & Drop, Balik Kartu Konsep)</span></li>
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-blue-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Lakukan eksperimen virtual & simulasi siklus air tanpa takut salah</span></li>
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-blue-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Kumpulkan XP, Bintang, & Koin prestasi dari Kuis Interaktif</span></li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>

              {/* Guru Card */}
              <ScrollReveal delay={200}>
                <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-8 md:p-10 text-white shadow-xl relative overflow-hidden h-full flex flex-col justify-between">
                  <div className="absolute -right-4 -top-4 opacity-10 pointer-events-none">
                    <School className="w-32 h-32 md:w-44 md:h-44 text-white" />
                  </div>
                  <div className="relative z-10">
                    <span className="inline-block bg-white/20 backdrop-blur-md px-3.5 py-1 rounded-full text-xs sm:text-sm font-bold text-white mb-3">Untuk Guru</span>
                    <h3 className="font-bold text-2xl sm:text-3xl md:text-4xl mb-2">Manajemen Kelas Modern</h3>
                    <p className="text-violet-100 text-xs sm:text-sm md:text-base mb-6">Kemudahan mengelola modul ajar di era digital.</p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-violet-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Unggah materi (PDF, Video YouTube, Rangkuman) langsung per sub-bab</span></li>
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-violet-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Pantau progres belajar & nilai kuis seluruh siswa secara real-time</span></li>
                      <li className="flex items-start gap-3 text-sm sm:text-base md:text-lg"><span className="text-violet-200 font-black text-lg sm:text-xl">✓</span> <span className="leading-snug">Kelola urutan bab & panduan Proyek P5 agar lebih terstruktur</span></li>
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>

          {/* Section 3: Sneak Peek Materi */}
          <ScrollReveal delay={100}>
            <div className="flex justify-center items-center gap-3 mb-6 sm:mb-8">
              <h2 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-gray-800 leading-tight text-center">
                Intip Materi IPAS Yuk!
              </h2>
              <Eye className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-emerald-600 animate-bounce inline-block" />
            </div>
            {/* Seamless Marquee Container */}
            <div className="relative overflow-hidden w-full py-2" style={{ maskImage: 'linear-gradient(to right, transparent, black 10%, black 90%, transparent)' }}>
              <div className="flex gap-4 sm:gap-6 w-max animate-marquee">
                {[
                  { title: 'Bagian Tubuh', emoji: <Smile className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-amber-100 text-amber-700' },
                  { title: 'Siklus Hidup', emoji: <Bug className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: <TestTube className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: <Zap className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-violet-100 text-violet-700' },
                  { title: 'Bentuk Energi', emoji: <Lightbulb className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-yellow-100 text-yellow-700' },
                  { title: 'Kenal Uang', emoji: <Coins className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-cyan-100 text-cyan-700' },
                  { title: 'Denah & Peta', emoji: <Map className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-rose-100 text-rose-700' },
                  // Duplicate items to create seamless loop
                  { title: 'Bagian Tubuh', emoji: <Smile className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-amber-100 text-amber-700' },
                  { title: 'Siklus Hidup', emoji: <Bug className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-green-100 text-green-700' },
                  { title: 'Wujud Zat', emoji: <TestTube className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-blue-100 text-blue-700' },
                  { title: 'Gaya & Gerak', emoji: <Zap className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-violet-100 text-violet-700' },
                  { title: 'Bentuk Energi', emoji: <Lightbulb className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-yellow-100 text-yellow-700' },
                  { title: 'Kenal Uang', emoji: <Coins className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-cyan-100 text-cyan-700' },
                  { title: 'Denah & Peta', emoji: <Map className="w-7 h-7 md:w-9 md:h-9" />, color: 'bg-rose-100 text-rose-700' },
                ].map((b, i) => (
                  <div key={i} className="shrink-0 w-36 sm:w-44 md:w-56 bg-white border border-gray-100 rounded-3xl p-4 sm:p-6 md:p-8 shadow-sm flex flex-col items-center text-center transition-all hover:scale-105 hover:shadow-md">
                    <div className={`w-14 h-14 sm:w-18 sm:h-18 md:w-22 md:h-22 rounded-2xl md:rounded-3xl ${b.color} flex items-center justify-center text-2xl sm:text-3xl md:text-4xl mb-3 shadow-xs`}>{b.emoji}</div>
                    <span className="font-bold text-gray-800 text-xs sm:text-sm md:text-base">{b.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Testimonial / Target */}
          <ScrollReveal delay={200}>
            <div className="bg-emerald-50 rounded-3xl md:rounded-[2.5rem] p-6 sm:p-10 md:p-14 relative overflow-hidden border border-emerald-100 text-center shadow-xs">
              <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 bg-emerald-200/40 rounded-bl-full -z-0" />
              <div className="relative z-10 max-w-4xl mx-auto">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="w-6 h-6 sm:w-8 sm:h-8" />
                </div>
                <p className="text-emerald-950 text-base sm:text-xl md:text-2xl lg:text-3xl font-medium leading-relaxed italic">
                  "Pembelajaran yang bermakna adalah ketika siswa bisa melihat, menyentuh, dan berinteraksi langsung dengan ilmu yang mereka pelajari."
                </p>
              </div>
            </div>
          </ScrollReveal>
          
          {/* Footer KKN / Copyright */}
          <ScrollReveal delay={300}>
            <div className="relative mt-8 sm:mt-12 mb-6 p-6 sm:p-10 md:p-14 rounded-[2rem] md:rounded-[2.5rem] bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-100/50 shadow-xl shadow-indigo-100/40 overflow-hidden text-center group/footer">
              {/* Background animated glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-300/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 group-hover/footer:scale-150 transition-transform duration-1000"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-sky-300/30 rounded-full blur-3xl translate-y-1/4 -translate-x-1/4 animate-pulse"></div>
              <div className="absolute top-1/2 left-1/2 w-48 h-48 bg-emerald-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '1.5s' }}></div>
              
              <p className="text-indigo-500 text-xs sm:text-sm font-black uppercase tracking-[0.25em] mb-6 sm:mb-8 relative z-10 drop-shadow-sm">Didukung Oleh</p>
              
              <div className="flex gap-4 sm:gap-8 md:gap-12 items-center justify-center mb-8 relative z-10">
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white shadow-sm shadow-indigo-100 p-2.5 sm:p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <img src="/logo-kemendikbud.png" alt="Kemendikbud" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
                
                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white shadow-sm shadow-indigo-100 p-2.5 sm:p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <img src="/logo-unesa.png" alt="UNESA" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>

                <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-28 md:h-28 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl md:rounded-3xl border border-white shadow-sm shadow-indigo-100 p-2.5 sm:p-3 md:p-4 transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group">
                  <img src="/logo-kkn.png" alt="KKN Gubugklakah" className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </div>
              </div>
              
              <div className="w-16 sm:w-24 h-1 rounded-full bg-gradient-to-r from-transparent via-indigo-200 to-transparent mx-auto mb-6 relative z-10"></div>
              
              <p className="text-indigo-900 text-xs sm:text-sm md:text-base font-bold mb-2 relative z-10 flex items-center justify-center gap-1.5">
                Hak Cipta <Copyright className="w-4 h-4 text-indigo-400" /> 2026
              </p>
              <p className="text-indigo-700/80 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg mx-auto relative z-10">
                Aplikasi ini dikembangkan sebagai bagian dari <br />
                <span className="font-bold text-indigo-900">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
              </p>
            </div>
          </ScrollReveal>
          
          <div className="h-28 sm:h-32" /> {/* spacer for sticky button */}
        </div>
      </div>

      {/* Sticky Bottom CTA */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-white via-white/95 to-transparent flex justify-center z-30">
        <button 
          onClick={() => navigate('roleSelect')}
          className="w-full max-w-md sm:max-w-xl bg-gray-900 hover:bg-black text-white py-4 sm:py-5 px-8 rounded-2xl sm:rounded-3xl font-bold text-base sm:text-lg md:text-xl shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all"
        >
          Masuk ke Aplikasi <Rocket className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-400" />
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
    <div className="h-full bg-gradient-to-br from-emerald-600 via-teal-700 to-cyan-800 flex flex-col items-center justify-center px-6 py-8 overflow-y-auto">
      <div className="text-center mb-8 sm:mb-12">
        <div className="w-24 h-24 sm:w-32 sm:h-32 bg-white/20 rounded-[2rem] sm:rounded-[2.5rem] flex items-center justify-center text-5xl sm:text-6xl mx-auto mb-4 sm:mb-6 backdrop-blur-sm shadow-xl" style={{ animation: 'float 3s ease-in-out infinite' }}>
          <Microscope className="w-10 h-10 sm:w-14 sm:h-14 text-white" />
        </div>
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-display text-white mb-2 leading-tight">IPAS Kelas 3</h1>
        <p className="text-emerald-100 font-medium text-sm sm:text-lg md:text-xl">Platform Belajar Kurikulum Merdeka</p>
      </div>
      <div className="w-full max-w-md sm:max-w-2xl md:max-w-3xl grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        <button onClick={() => { navigate('loginGuru'); }}
          className="w-full bg-white rounded-3xl p-6 sm:p-8 flex items-center sm:flex-col sm:text-center gap-4 sm:gap-5 shadow-2xl active:scale-95 transition-all hover:scale-[1.02] cursor-pointer">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-sky-100 text-sky-600 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xs">
            <School className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="flex-1 text-left sm:text-center">
            <p className="font-display text-gray-800 text-xl sm:text-2xl">Masuk sebagai Guru</p>
            <p className="text-gray-500 text-sm sm:text-base mt-1">Upload materi & buat media interaktif</p>
          </div>
        </button>
        <button onClick={() => { navigate('loginSiswa'); }}
          className="w-full bg-white/20 backdrop-blur-sm rounded-3xl p-6 sm:p-8 flex items-center sm:flex-col sm:text-center gap-4 sm:gap-5 border border-white/30 active:scale-95 transition-all hover:scale-[1.02] hover:bg-white/25 cursor-pointer shadow-2xl">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-emerald-100 text-emerald-600 rounded-2xl sm:rounded-3xl flex items-center justify-center flex-shrink-0 shadow-xs">
            <GraduationCap className="w-8 h-8 sm:w-10 sm:h-10" />
          </div>
          <div className="flex-1 text-left sm:text-center">
            <p className="font-display text-white text-xl sm:text-2xl">Masuk sebagai Siswa</p>
            <p className="text-emerald-100 text-sm sm:text-base mt-1">Belajar & eksplorasi materi IPAS</p>
          </div>
        </button>
      </div>
      <div className="mt-8 sm:mt-12 text-center opacity-80">
        <p className="text-white text-xs sm:text-sm font-bold mb-1 flex items-center justify-center gap-1">Hak Cipta <Copyright className="w-4 h-4 text-emerald-100" /> 2026</p>
        <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed max-w-sm mx-auto">
          Aplikasi ini dikembangkan sebagai bagian dari <br />
          <span className="font-semibold text-white">Program Kerja KKN Universitas Negeri Surabaya (UNESA)</span>
        </p>
      </div>
    </div>
  );

  // ── 1a. LOGIN GURU ──────────────────────────────────────────────────────────
  if (screen === 'loginGuru') {
    const handleGoogleLogin = async () => {
      try {
        setLoginError('');
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        
        const docRef = doc(db, 'users', res.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'siswa') {
          await signOut(auth);
          setLoginError('Akun ini terdaftar sebagai Siswa. Silakan login melalui portal Siswa.');
          return;
        }
        await setDoc(docRef, { role: 'guru' }, { merge: true });
        setUserRole('guru');
        localStorage.setItem('ipas_user_role', 'guru');
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
          const res = await createUserWithEmailAndPassword(auth, loginUser, loginPass);
          await updateProfile(res.user, { displayName: 'Guru' });
          await setDoc(doc(db, 'users', res.user.uid), { role: 'guru', xp: 0, coins: 0, completedModules: {} }, { merge: true });
          setUserRole('guru');
          localStorage.setItem('ipas_user_role', 'guru');
          setScreens(['teacherDash']);
        } else {
          const res = await signInWithEmailAndPassword(auth, loginUser, loginPass);
          const docRef = doc(db, 'users', res.user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists() && docSnap.data().role === 'siswa') {
            await signOut(auth);
            setLoginError('Akun ini terdaftar sebagai Siswa. Silakan login melalui portal Siswa.');
            return;
          }
          await setDoc(docRef, { role: 'guru' }, { merge: true });
          setUserRole('guru');
          localStorage.setItem('ipas_user_role', 'guru');
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
        <div className="bg-gradient-to-br from-sky-600 to-indigo-700 px-5 pt-6 pb-4 rounded-b-[2rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-sky-100 text-xs font-semibold tracking-wider">Akses Khusus</p>
              <p className="text-white font-display text-xl flex items-center gap-2">{authMode === 'login' ? 'Login' : 'Daftar'} Guru <School className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-100 relative my-auto max-w-md md:max-w-lg mx-auto w-full">
            
            <h2 className="font-display text-2xl text-gray-800 mb-4 text-center mt-2">{authMode === 'login' ? 'Masuk Dashboard' : 'Buat Akun Guru'}</h2>
            
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
              Masuk Sekarang
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 1x. LUPA PASSWORD ───────────────────────────────────────────────────────
  if (screen === 'forgotPassword') {
    const handleContactIT = () => {
      window.open('https://wa.me/6281234567890?text=Halo%20Tim%20IT,%20saya%20lupa%20password%20akun%20Guru%20IPAS%20saya.', '_blank');
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
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-gray-100 relative text-center">
            <div className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h2 className="font-display text-xl text-gray-800 mb-2">Butuh Bantuan?</h2>
            <p className="text-gray-600 text-sm mb-8 leading-relaxed">
              Untuk menjaga keamanan akun Anda, proses atur ulang password hanya dapat dilakukan secara manual oleh <b>Tim IT (Admin)</b>.
              <br /><br />
              Silakan hubungi dukungan Tim IT kami melalui WhatsApp untuk mendapatkan akses kembali.
            </p>

            <button onClick={handleContactIT} className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white py-4 rounded-xl font-bold shadow-lg shadow-green-200 active:scale-95 transition-all flex items-center justify-center gap-2 text-base">
              <MessageCircle className="w-5 h-5" /> Hubungi Dukungan Tim IT
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── 1b. LOGIN SISWA ─────────────────────────────────────────────────────────
  if (screen === 'loginSiswa') {
    const handleGoogleLoginSiswa = async () => {
      try {
        setLoginError('');
        const provider = new GoogleAuthProvider();
        const res = await signInWithPopup(auth, provider);
        
        const docRef = doc(db, 'users', res.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().role === 'guru') {
          await signOut(auth);
          setLoginError('Akun ini terdaftar sebagai Guru. Silakan login melalui portal Guru.');
          return;
        }
        await setDoc(docRef, { role: 'siswa', displayName: res.user.displayName || 'Siswa' }, { merge: true });
        setUserRole('siswa');
        localStorage.setItem('ipas_user_role', 'siswa');
        setScreens(['studentHome']);
        setActiveTab('home');
      } catch (error: any) {
        setLoginError('Google Login gagal: ' + error.message);
      }
    };

    const handleLoginSiswa = async () => {
      if (!loginUser || !loginPass) {
        setLoginError('Nama Panggilan dan Nomor Absen harus diisi.');
        return;
      }
      
      setLoginError('');
      
      const cleanName = loginUser.trim().toLowerCase().replace(/\s+/g, '');
      const absen = loginPass.trim();
      const email = `${cleanName}.${absen}@siswa.sekolah.com`;
      const password = `Siswa_${absen}_!IPAS26`;
      
      try {
        await setPersistence(auth, browserLocalPersistence);
        if (authMode === 'register') {
          if (loginUser.toLowerCase().includes('guru')) {
            setLoginError('Nama tidak boleh mengandung kata "guru".');
            return;
          }
          const res = await createUserWithEmailAndPassword(auth, email, password);
          const name = loginUser.trim();
          await updateProfile(res.user, { displayName: name });
          await setDoc(doc(db, 'users', res.user.uid), { role: 'siswa', xp: 0, coins: 0, completedModules: {}, displayName: name }, { merge: true });
          setUserRole('siswa');
          localStorage.setItem('ipas_user_role', 'siswa');
          setScreens(['studentHome']);
          setActiveTab('home');
        } else {
          try {
            const res = await signInWithEmailAndPassword(auth, email, password);
            const docRef = doc(db, 'users', res.user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists() && docSnap.data().role === 'guru') {
              await signOut(auth);
              setLoginError('Akun ini terdaftar sebagai Guru. Silakan login melalui portal Guru.');
              return;
            }
            await setDoc(docRef, { role: 'siswa', displayName: res.user.displayName || loginUser.trim() }, { merge: true });
            setUserRole('siswa');
            localStorage.setItem('ipas_user_role', 'siswa');
            setScreens(['studentHome']);
            setActiveTab('home');
          } catch (loginErr: any) {
            // Auto-register jika akun belum ada (ditandai dengan invalid credential pada first try)
            if (loginErr.code === 'auth/invalid-credential') {
              try {
                const res = await createUserWithEmailAndPassword(auth, email, password);
                const name = loginUser.trim();
                await updateProfile(res.user, { displayName: name });
                await setDoc(doc(db, 'users', res.user.uid), { role: 'siswa', xp: 0, coins: 0, completedModules: {}, displayName: name }, { merge: true });
                setUserRole('siswa');
                localStorage.setItem('ipas_user_role', 'siswa');
                setScreens(['studentHome']);
                setActiveTab('home');
              } catch (regErr: any) {
                setLoginError('Gagal membuat profil siswa baru: ' + regErr.message);
              }
            } else {
              setLoginError('Terjadi kesalahan: ' + loginErr.message);
            }
          }
        }
      } catch (error: any) {
        setLoginError('Terjadi kesalahan: ' + error.message);
      }
    };

    return (
      <div className="h-full bg-emerald-50 flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 px-5 pt-6 pb-4 rounded-b-[2rem] flex-shrink-0 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <BackBtn onBack={goBack} light />
            <div>
              <p className="text-emerald-100 text-xs font-semibold tracking-wider">Akses Belajar</p>
              <p className="text-white font-display text-xl flex items-center gap-2">Login Siswa <GraduationCap className="w-6 h-6" /></p>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-center">
          <div className="bg-white rounded-[2rem] p-6 sm:p-8 shadow-xl border border-gray-100 relative my-auto max-w-md md:max-w-lg mx-auto w-full">
            <h2 className="font-display text-2xl text-gray-800 mb-4 text-center mt-2">Mulai Belajar</h2>
            
            {loginError && (
              <div className="bg-red-50 text-red-600 text-xs font-bold p-3 rounded-xl mb-5 text-center flex items-center justify-center gap-2 border border-red-100">
                <span className="text-lg"><AlertTriangle className="w-5 h-5"/></span> {loginError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Nama Panggilan</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <User className="w-5 h-5" /> </span>
                  <input type="text" value={loginUser} onChange={e => setLoginUser(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="Misal: budi" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 mb-2 block uppercase">Nomor Absen</label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-400"> <Hash className="w-5 h-5" /> </span>
                  <input type="number" value={loginPass} onChange={e => setLoginPass(e.target.value)} 
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all" placeholder="Misal: 12" />
                </div>
              </div>
            </div>

            <button onClick={handleLoginSiswa} className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-4 rounded-xl font-bold mt-6 shadow-lg shadow-emerald-200 active:scale-95 transition-transform flex items-center justify-center gap-2 text-base">
              Masuk Sekarang
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
          <button onClick={handleLogout} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm">Keluar</button>
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
              { icon: <Upload className="w-5 h-5" />, label: 'Upload Materi', sub: 'PDF, Video, Gambar', color: 'from-sky-500 to-blue-600', action: () => { setUploadStep(0); setUploadChapter(''); setUploadSubChapter(''); setUploadSubChapterIdx(0); setUploadType(''); setUploadTitle(''); setUploadDone(false); navigate('uploadMateri'); } },
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

        {/* Kelola Materi Pembelajaran */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-display text-gray-800 text-base">Kelola Materi Pembelajaran</p>
              <p className="text-gray-400 text-xs">Total {dbMaterials.length} materi aktif untuk siswa</p>
            </div>
            <div className="flex items-center gap-2">
              <button 
                type="button"
                onClick={handleSyncMaterials}
                disabled={isSyncingMaterials}
                title="Sinkronkan data materi aktif dengan server"
                className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 shadow-xs active:scale-95 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMaterials ? 'animate-spin' : ''}`} /> 
                {isSyncingMaterials ? 'Menyinkronkan...' : 'Sinkron Materi'}
              </button>
              <button 
                type="button"
                onClick={() => { setUploadStep(0); setUploadChapter(''); setUploadSubChapter(''); setUploadSubChapterIdx(0); setUploadType('text'); setUploadTitle(''); setUploadDone(false); navigate('uploadMateri'); }}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 shadow-sm active:scale-95 transition-all"
              >
                <Plus className="w-4 h-4" /> Tambah Materi
              </button>
            </div>
          </div>

          {/* Chapter Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-3 scrollbar-none">
            <button
              onClick={() => setTeacherMatFilter('all')}
              className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${teacherMatFilter === 'all' ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
            >
              Semua ({dbMaterials.length})
            </button>
            {BAB_LIST.map(b => {
              const count = dbMaterials.filter(m => m.chapter === `Bab ${b.id}`).length;
              return (
                <button
                  key={b.id}
                  onClick={() => setTeacherMatFilter(`Bab ${b.id}`)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${teacherMatFilter === `Bab ${b.id}` ? 'bg-sky-600 text-white shadow-sm' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  Bab {b.id} {count > 0 ? `(${count})` : ''}
                </button>
              );
            })}
          </div>

          {/* Material Items List */}
          <div className="space-y-2.5">
            {(() => {
              const displayed = teacherMatFilter === 'all' 
                ? dbMaterials 
                : dbMaterials.filter(m => m.chapter === teacherMatFilter);
              
              if (displayed.length === 0) {
                return (
                  <div className="bg-gray-50 rounded-2xl p-6 text-center border border-dashed border-gray-200">
                    <FileText className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                    <p className="text-gray-600 font-bold text-sm">Tidak ada materi ditemukan</p>
                    <p className="text-gray-400 text-xs mt-1 mb-3">
                      {teacherMatFilter === 'all' 
                        ? 'Belum ada materi pembelajaran yang diunggah.' 
                        : `Belum ada materi untuk ${teacherMatFilter}.`}
                    </p>
                    <button
                      onClick={() => {
                        const ch = teacherMatFilter === 'all' ? '' : teacherMatFilter;
                        setUploadStep(0);
                        setUploadChapter(ch);
                        const b = BAB_LIST.find(x => `Bab ${x.id}` === ch);
                        setUploadSubChapter(b ? `Topik A: ${b.topics[0]}` : '');
                        setUploadSubChapterIdx(0);
                        setUploadType('text');
                        setUploadTitle('');
                        setUploadDone(false);
                        navigate('uploadMateri');
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Materi {teacherMatFilter !== 'all' ? teacherMatFilter : ''}
                    </button>
                  </div>
                );
              }

              return displayed.map((f, i) => {
                const isSub2 = f.subChapterIdx === 1 || (f.subChapter && (f.subChapter.includes('Topik B') || f.subChapter.includes('Sub-bab 2')));
                return (
                  <div key={f.id || i} className="bg-gray-50 hover:bg-sky-50/50 rounded-2xl p-3.5 flex items-center gap-3 border border-gray-100 hover:border-sky-200 transition-all">
                    <div className="w-10 h-10 bg-white shadow-xs rounded-xl flex items-center justify-center text-sky-600 flex-shrink-0 border border-gray-100">
                      {f.content && f.content.includes('youtube') ? <Film className="w-5 h-5 text-red-500" /> : <FileText className="w-5 h-5 text-sky-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800 border border-sky-200">
                          {f.chapter}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isSub2
                            ? 'bg-amber-100 text-amber-800 border-amber-200'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {isSub2 ? 'Sub-bab 2 (Topik B)' : 'Sub-bab 1 (Topik A)'}
                        </span>
                        {f.subChapter && (
                          <span className="text-[10px] text-gray-500 font-medium truncate max-w-[140px]" title={f.subChapter}>
                            {f.subChapter.includes(':') ? f.subChapter.split(':')[1].trim() : f.subChapter}
                          </span>
                        )}
                        {f.createdAt && (
                          <span className="text-[10px] text-gray-400 ml-auto">
                            {new Date((f.createdAt.seconds || Date.now() / 1000) * 1000).toLocaleDateString('id-ID')}
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-gray-800 text-sm truncate">{f.title}</p>
                      <p className="text-gray-400 text-xs truncate">{f.desc || 'Materi pembelajaran untuk siswa'}</p>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button
                        onClick={() => {
                          const bId = parseInt(f.chapter?.replace(/\D/g, '')) || 1;
                          setCurrentBabIdx(bId - 1);
                          const sIdx = f.subChapterIdx !== undefined ? Number(f.subChapterIdx) : (f.subChapter?.includes('Topik B') ? 1 : 0);
                          setCurrentSubBabIdx(sIdx);
                          setActiveMaterial({
                            ...f,
                            chapter: `Bab ${bId}`,
                            subChapterIdx: sIdx
                          });
                          navigate('bacaMateri');
                        }}
                        title="Lihat Materi"
                        className="p-2 text-gray-400 hover:text-sky-600 hover:bg-white rounded-xl transition-all border border-transparent hover:border-gray-200 shadow-xs"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteMaterialClick(f);
                        }}
                        title="Hapus Materi"
                        className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all border border-transparent hover:border-rose-100"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              });
            })()}
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
      {renderDeleteModal()}
      {renderToast()}
    </div>
    );
  }

  // ── X. PENGATURAN GURU ───────────────────────────────────────────────────
  if (screen === 'pengaturanGuru') {
    const totalMateri = dbMaterials.length;
    const totalSiswa = dbUsers.length > 0 ? dbUsers.length - 1 : 0;
    
    return (
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
              <p className="font-display text-gray-800 text-lg">{auth.currentUser?.displayName || 'Guru'}</p>
              <p className="text-sky-600 text-sm font-bold">Guru IPAS Kelas 3</p>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-3">
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600"> <BookOpen className="w-4 h-4" /> </div>
                <p className="text-gray-600 text-sm font-bold">Modul Dibuat</p>
              </div>
              <p className="text-indigo-600 font-display text-xl">{totalMateri}</p>
            </div>
            <div className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center text-sky-600"> <Users className="w-4 h-4" /> </div>
                <p className="text-gray-600 text-sm font-bold">Siswa Aktif</p>
              </div>
              <p className="text-sky-600 font-display text-xl">{totalSiswa}</p>
            </div>
          </div>
        </div>

        {/* === PENGATUR UKURAN FONT SISWA === */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="font-display text-gray-800 mb-1 flex items-center gap-2"><Eye className="w-5 h-5 text-violet-500" /> Ukuran Teks Siswa</p>
          <p className="text-xs text-gray-400 mb-5">Sesuaikan ukuran huruf di semua halaman siswa agar nyaman dibaca anak-anak.</p>
          
          {/* Slider */}
          <div className="relative mb-4">
            <input
              type="range"
              min={16}
              max={24}
              step={1}
              value={studentFontSize}
              onChange={e => handleSetFontSize(Number(e.target.value))}
              className="w-full h-2 rounded-full accent-violet-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 font-bold mt-1">
              <span>Kecil (16px)</span>
              <span>Sedang (20px)</span>
              <span>Besar (24px)</span>
            </div>
          </div>

          {/* Tombol preset */}
          <div className="flex gap-2 mb-4">
            {[{ label: 'Kecil', size: 16 }, { label: 'Sedang', size: 18 }, { label: 'Besar', size: 20 }, { label: 'Ekstra Besar', size: 22 }].map(preset => (
              <button key={preset.size} onClick={() => handleSetFontSize(preset.size)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  studentFontSize === preset.size
                    ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200 hover:border-violet-300 hover:text-violet-600'
                }`}>
                {preset.label}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
            <p className="text-violet-400 text-[10px] font-bold uppercase mb-2 tracking-wider">Pratinjau Teks Siswa</p>
            <p style={{ fontSize: studentFontSize + 'px' }} className="text-gray-700 font-bold leading-snug">Halo, selamat belajar IPAS! 🌱</p>
            <p style={{ fontSize: (studentFontSize - 2) + 'px' }} className="text-gray-500 mt-1">Ukuran font saat ini: {studentFontSize}px</p>
          </div>
        </div>

        {/* Bantuan & Panduan */}
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <p className="font-display text-gray-800 mb-4 flex items-center gap-2"><HelpCircle className="w-5 h-5 text-sky-500" /> Pusat Panduan</p>
          <div className="space-y-3">
            <button onClick={() => alert('Membuka PDF Panduan Penggunaan...')} className="w-full bg-gray-50 hover:bg-sky-50 border border-gray-100 hover:border-sky-200 text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-gray-400 group-hover:text-sky-500 transition-colors" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-sky-700">Buku Panduan Guru</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-sky-500" />
            </button>
            <button onClick={() => alert('Membuka kontak tim support...')} className="w-full bg-gray-50 hover:bg-indigo-50 border border-gray-100 hover:border-indigo-200 text-left px-4 py-3 rounded-xl flex items-center justify-between group transition-colors">
              <div className="flex items-center gap-3">
                <MessageCircle className="w-5 h-5 text-gray-400 group-hover:text-indigo-500 transition-colors" />
                <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-700">Hubungi Tim Bantuan</span>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-indigo-500" />
            </button>
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
  }

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
            <BackBtn onBack={uploadStep > 0 ? () => setUploadStep(s => s - 1) : goBack} light />
            <p className="text-white font-display text-xl">Upload Materi</p>
          </div>
          {/* Step indicator */}
          <div className="flex items-center gap-2">
            {['Pilih Bab & Sub-bab', 'Tipe File', 'Upload', 'Konfigurasi'].map((s, i) => (
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
          {/* Step 0: Choose chapter & sub-chapter */}
          {uploadStep === 0 && (
            <div className="space-y-4">
              <div>
                <p className="font-display text-gray-700 text-base mb-1">1. Pilih Bab Pembelajaran</p>
                <p className="text-gray-400 text-xs mb-3">Pilih bab yang ingin ditambahkan materinya:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {BAB_LIST.map(b => {
                    const isSelected = uploadChapter === `Bab ${b.id}`;
                    return (
                      <button key={b.id} 
                        onClick={() => {
                          setUploadChapter(`Bab ${b.id}`);
                          setUploadSubChapter(uploadSubChapterIdx === 1 ? `Topik B: ${b.topics[1]}` : `Topik A: ${b.topics[0]}`);
                        }}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl transition-all active:scale-95 border-2 text-left ${isSelected ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-300 shadow-sm' : 'bg-white border-transparent shadow-xs hover:border-sky-200'}`}>
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-xl flex-shrink-0`}>{b.emoji}</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-800 text-sm">Bab {b.id}</p>
                          <p className="text-gray-400 text-xs truncate">{b.judul}</p>
                        </div>
                        {isSelected && <span className="text-sky-500 font-black text-sm">✓</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-chapter Selection */}
              {uploadChapter && (() => {
                const selectedBabObj = BAB_LIST.find(b => `Bab ${b.id}` === uploadChapter);
                if (!selectedBabObj) return null;

                return (
                  <div className="pt-3 border-t border-gray-100 animate-in fade-in">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-display text-gray-800 text-base">2. Pilih Sub-bab / Topik Materi</p>
                      <span className="text-xs font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                        {uploadChapter}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs mb-3">Tentukan materi ini akan dimasukkan ke Sub-bab 1 atau Sub-bab 2:</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Sub-bab 1 / Topik A */}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadSubChapterIdx(0);
                          setUploadSubChapter(`Topik A: ${selectedBabObj.topics[0]}`);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                          uploadSubChapterIdx === 0
                            ? 'bg-emerald-50/80 border-emerald-500 ring-2 ring-emerald-300 shadow-sm'
                            : 'bg-white border-gray-100 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800">
                            Sub-bab 1 (Topik A)
                          </span>
                          {uploadSubChapterIdx === 0 && <span className="text-emerald-600 font-black text-xs">✓ Dipilih</span>}
                        </div>
                        <p className="font-bold text-gray-800 text-sm leading-snug">{selectedBabObj.topics[0]}</p>
                        <p className="text-gray-400 text-[11px] mt-1">Materi bagian awal bab</p>
                      </button>

                      {/* Sub-bab 2 / Topik B */}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadSubChapterIdx(1);
                          setUploadSubChapter(`Topik B: ${selectedBabObj.topics[1]}`);
                        }}
                        className={`p-4 rounded-2xl border-2 text-left transition-all active:scale-95 ${
                          uploadSubChapterIdx === 1
                            ? 'bg-amber-50/80 border-amber-500 ring-2 ring-amber-300 shadow-sm'
                            : 'bg-white border-gray-100 hover:border-amber-200'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-lg bg-amber-100 text-amber-800">
                            Sub-bab 2 (Topik B)
                          </span>
                          {uploadSubChapterIdx === 1 && <span className="text-amber-600 font-black text-xs">✓ Dipilih</span>}
                        </div>
                        <p className="font-bold text-gray-800 text-sm leading-snug">{selectedBabObj.topics[1]}</p>
                        <p className="text-gray-400 text-[11px] mt-1">Materi bagian kedua bab</p>
                      </button>
                    </div>
                  </div>
                );
              })()}
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
                    <p className="text-gray-400 text-xs mt-1">Ketik langsung dengan editor teks berwarna & format rapi.</p>
                  </div>
                </button>
                <button onClick={() => { setUploadType('file'); setUploadStep(2); }}
                  className={`p-5 rounded-3xl flex items-center text-left border-2 transition-all active:scale-95 bg-white border-transparent shadow-sm hover:border-sky-300`}>
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center mr-4 flex-shrink-0"><Upload className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Upload File (TXT, PDF, Gambar, Word)</p>
                    <p className="text-gray-400 text-xs mt-1">Unggah file materi dari laptop / perangkat Anda.</p>
                  </div>
                </button>
                <button onClick={() => { setUploadType('video'); setUploadStep(2); }}
                  className={`p-5 rounded-3xl flex items-center text-left border-2 transition-all active:scale-95 bg-white border-transparent shadow-sm hover:border-sky-300`}>
                  <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center mr-4 flex-shrink-0"><Film className="w-6 h-6" /></div>
                  <div>
                    <p className="font-bold text-gray-800 text-base">Video Pembelajaran (YouTube)</p>
                    <p className="text-gray-400 text-xs mt-1">Tautkan video YouTube yang dapat langsung ditonton siswa di aplikasi.</p>
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
                        setUploadContent(`<div class="p-4 bg-gray-50 rounded-xl whitespace-pre-wrap font-sans text-sm">${txt}</div>`);
                        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                        setUploadDone(true);
                      };
                      reader.readAsText(file);
                    } else if (file.type.includes('image')) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        const imgUrl = e.target?.result as string;
                        setUploadContent(`<div class="text-center"><img src="${imgUrl}" class="max-w-full rounded-2xl shadow-md mx-auto mb-3" /><p class="text-xs text-gray-500 font-medium">Gambar Materi: ${file.name}</p></div>`);
                        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                        setUploadDone(true);
                      };
                      reader.readAsDataURL(file);
                    } else {
                      // Fallback preview for PDF, DOCX, etc.
                      setTimeout(() => {
                        setUploadContent(`<div class="p-6 bg-sky-50 rounded-2xl border-2 border-sky-200 text-center">
                          <div class="w-16 h-16 bg-sky-500 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                            <span class="text-2xl font-bold">PDF</span>
                          </div>
                          <h4 class="font-bold text-gray-800 text-base mb-1">${file.name}</h4>
                          <p class="text-xs text-gray-500 mb-4">Ukuran: ${(file.size / 1024).toFixed(1)} KB • Tipe: ${file.type || 'Dokumen'}</p>
                          <button class="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all active:scale-95 inline-flex items-center gap-1.5">
                            Lihat File Dokumen
                          </button>
                        </div>`);
                        setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
                        setUploadDone(true);
                        showToast('File dokumen berhasil diproses!');
                      }, 400);
                    }
                  }} />
                </label>
              ) : (
                <div className="bg-white p-5 rounded-2xl border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">✓ File Berhasil Dipilih</p>
                    <button onClick={() => { setUploadDone(false); setUploadContent(''); }} className="text-xs text-rose-500 font-bold hover:underline">Ganti File</button>
                  </div>
                  <div dangerouslySetInnerHTML={{ __html: uploadContent }} />
                </div>
              )}
            </div>
          )}

          {uploadStep === 2 && uploadType === 'video' && (() => {
            const targetBabId = parseInt(uploadChapter.replace('Bab ', '')) || 1;
            const targetBabObj = BAB_LIST.find(b => b.id === targetBabId);
            const currentSubTopic = targetBabObj?.topics[uploadSubChapterIdx] || (uploadSubChapterIdx === 0 ? 'Topik A' : 'Topik B');
            const existingVideo = getSubBabVideo(targetBabId, uploadSubChapterIdx);
            const effectiveUrl = uploadVideoUrl.trim() || existingVideo;
            const currentInputId = extractYoutubeId(effectiveUrl);
            const currentEmbed = currentInputId ? `https://www.youtube.com/embed/${currentInputId}?rel=0` : '';
            const currentWatchUrl = currentInputId ? `https://www.youtube.com/watch?v=${currentInputId}` : '';

            return (
              <div className="space-y-4">
                {/* Target badge */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-md flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-md">
                      Integrasi Langsung ke Sub-bab
                    </span>
                    <h3 className="font-display text-lg text-white mt-1">Bab {targetBabId} - Sub-bab {uploadSubChapterIdx + 1}</h3>
                    <p className="text-xs text-rose-100">{currentSubTopic}</p>
                  </div>
                  <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-2xl flex-shrink-0">
                    <Film className="w-6 h-6 text-white" />
                  </div>
                </div>

                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-xs text-emerald-900 leading-relaxed flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-emerald-950 mb-0.5">Langsung Terintegrasi di Sub-bab</p>
                    <p>Guru tidak perlu lagi mengisi field formulir atau membuat dokumen baru. Video YouTube ini langsung disematkan ke Sub-bab {uploadSubChapterIdx + 1} dan otomatis diputar di layar baca materi siswa.</p>
                  </div>
                </div>

                {/* Input box */}
                <div className="bg-white p-5 rounded-2xl border border-gray-200 space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-bold text-gray-700">Link Video YouTube</label>
                    {existingVideo && (
                      <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                        ✓ Video Tersimpan
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      value={uploadVideoUrl}
                      onChange={e => setUploadVideoUrl(e.target.value)}
                      placeholder={existingVideo || "https://www.youtube.com/watch?v=..."}
                      className="flex-1 px-4 py-3 rounded-xl border border-gray-300 text-sm focus:border-rose-500 outline-none"
                    />
                    {uploadVideoUrl && (
                      <button
                        type="button"
                        onClick={() => setUploadVideoUrl('')}
                        className="px-3 py-2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                  <p className="text-[11px] text-gray-400">Dukung format: youtube.com/watch?v=..., youtu.be/..., shorts/..., embed/...</p>

                  {/* Live Preview if embed exists */}
                  {currentEmbed && (
                    <div className="pt-2 space-y-2">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-gray-700">Pratinjau Video:</p>
                        {currentWatchUrl && (
                          <a
                            href={currentWatchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline flex items-center gap-1"
                          >
                            <PlayCircle className="w-3.5 h-3.5" /> Buka di YouTube ↗
                          </a>
                        )}
                      </div>
                      <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-sm bg-black border border-gray-200">
                        <iframe
                          src={currentEmbed}
                          title="Preview Video"
                          className="w-full h-full"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                      <p className="text-[11px] text-gray-400">
                        Jika video bertuliskan "Tidak Tersedia", gunakan tombol "Buka di YouTube ↗" untuk memastikannya.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
                    <button
                      type="button"
                      onClick={() => {
                        const urlToSave = uploadVideoUrl.trim() || existingVideo;
                        if (!urlToSave) {
                          showToast('Masukkan link YouTube terlebih dahulu.');
                          return;
                        }
                        const videoId = extractYoutubeId(urlToSave);
                        if (!videoId) {
                          showToast('Format link YouTube tidak valid. Harap masukkan link YouTube yang benar.');
                          return;
                        }
                        saveSubBabVideo(targetBabId, uploadSubChapterIdx, urlToSave);
                        showToast(`Video berhasil disematkan langsung ke Bab ${targetBabId} Sub-bab ${uploadSubChapterIdx + 1}!`);
                        setUploadVideoUrl('');
                        setScreens(['teacherDash']);
                      }}
                      className="flex-1 py-3.5 px-4 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Simpan Langsung ke Sub-bab {uploadSubChapterIdx + 1}
                    </button>

                    {existingVideo && (
                      <button
                        type="button"
                        onClick={() => {
                          saveSubBabVideo(targetBabId, uploadSubChapterIdx, '');
                          setUploadVideoUrl('');
                          showToast(`Video Sub-bab ${uploadSubChapterIdx + 1} berhasil dihapus.`);
                        }}
                        className="py-3.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-xl text-xs font-bold border border-rose-200 active:scale-95 transition-all"
                      >
                        Hapus Video
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Step 3: Configure */}
          {uploadStep === 3 && (
            <div className="space-y-4">
              <p className="font-display text-gray-700 text-base">Konfigurasi Materi</p>
              
              {/* Destination badge */}
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase text-sky-600 tracking-wider">Tujuan Publikasi Materi:</p>
                  <p className="font-bold text-sky-900 text-sm">
                    {uploadChapter || 'Bab 1'} · Sub-bab {uploadSubChapterIdx + 1} ({uploadSubChapterIdx === 1 ? 'Topik B' : 'Topik A'})
                  </p>
                  <p className="text-xs text-sky-700 mt-0.5">
                    {uploadSubChapter || (uploadSubChapterIdx === 1 ? 'Topik B' : 'Topik A')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setUploadStep(0)}
                  className="text-xs text-sky-700 font-bold bg-white px-3 py-1.5 rounded-xl border border-sky-200 hover:bg-sky-100 active:scale-95 transition-all"
                >
                  Ubah
                </button>
              </div>

              <div>
                <label className="font-bold text-gray-600 text-sm block mb-1">Judul Materi *</label>
                <input value={uploadTitle} onChange={e => setUploadTitle(e.target.value)}
                  placeholder={`Contoh: Materi ${uploadChapter} Sub-bab ${uploadSubChapterIdx + 1} — ...`}
                  className="w-full px-4 py-3.5 rounded-2xl bg-white border-2 border-gray-200 focus:border-sky-400 outline-none text-gray-700 font-medium text-sm" />
              </div>
              <div>
                <label className="font-bold text-gray-600 text-sm block mb-1">Deskripsi Ringkas</label>
                <textarea value={uploadDesc} onChange={e => setUploadDesc(e.target.value)}
                  rows={3} placeholder="Jelaskan ringkasan materi ini untuk siswa..."
                  className="w-full px-4 py-3 rounded-2xl bg-white border-2 border-gray-200 focus:border-sky-400 outline-none text-gray-700 font-medium text-sm resize-none" />
              </div>
              <div>
                <label className="font-bold text-gray-600 text-sm block mb-2">Tujuan Pembelajaran (ATP)</label>
                <div className="space-y-2">
                  {['Siswa dapat memahami konsep materi dengan baik', 'Siswa dapat menjelaskan fungsi dan manfaatnya', 'Siswa dapat menerapkannya dalam kehidupan sehari-hari'].map((tp, i) => (
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
                  <p className="text-sky-600 text-xs">Siswa yang membuka Sub-bab {uploadSubChapterIdx + 1} akan langsung dapat mempelajari materi ini</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom action */}
        <div className="px-5 pb-8 pt-3 flex-shrink-0 space-y-2">
          {uploadStep < 3 && uploadStep !== 1 && !(uploadStep === 2 && uploadType === 'video') ? (
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
                if (!uploadTitle.trim() || !uploadContent) return;
                setIsUploadingDB(true);
                const newId = 'mat_' + Date.now();
                const resolvedSub = uploadSubChapter || (uploadSubChapterIdx === 1 ? 'Topik B' : 'Topik A');
                const newMat = {
                  id: newId,
                  chapter: uploadChapter || 'Bab 1',
                  subChapter: resolvedSub,
                  subChapterIdx: uploadSubChapterIdx,
                  title: uploadTitle.trim(),
                  desc: uploadDesc.trim() || 'Materi pembelajaran dari guru',
                  content: uploadContent,
                  createdAt: { seconds: Math.floor(Date.now() / 1000) }
                };

                try {
                  const docRef = await addDoc(collection(db, 'materials'), {
                    chapter: newMat.chapter,
                    subChapter: newMat.subChapter,
                    subChapterIdx: newMat.subChapterIdx,
                    title: newMat.title,
                    desc: newMat.desc,
                    content: newMat.content,
                    createdAt: serverTimestamp()
                  });
                  newMat.id = docRef.id;
                } catch (e) {
                  console.warn("Gagal menyimpan ke Firestore (tersimpan lokal):", e);
                }

                setDbMaterials(prev => {
                  const updated = [newMat, ...prev];
                  localStorage.setItem('ipas_materials', JSON.stringify(updated));
                  return updated;
                });

                setUploadStep(0);
                setUploadChapter('');
                setUploadSubChapter('');
                setUploadSubChapterIdx(0);
                setUploadTitle('');
                setUploadDesc('');
                setUploadContent('');
                setUploadVideoUrl('');
                setUploadDone(false);
                setIsUploadingDB(false);
                showToast(`Materi ${newMat.chapter} Sub-bab ${newMat.subChapterIdx + 1} berhasil ditambahkan!`);
                setScreens(['teacherDash']);
              }}
              disabled={!uploadTitle.trim() || !uploadContent || isUploadingDB}
              className={`w-full py-4 rounded-2xl font-display text-base transition-all ${uploadTitle.trim() && uploadContent && !isUploadingDB ? 'bg-emerald-600 text-white shadow-lg active:scale-95' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
              {isUploadingDB ? 'Menyimpan...' : 'Publikasikan ke Siswa 🚀'}
            </button>
          ) : null}
        </div>
        {renderToast()}
        {renderVideoModal()}
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
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BackBtn onBack={goBack} light />
            <p className="text-white font-display text-xl">Kelola Bab  <ClipboardList className="w-5 h-5" /> </p>
          </div>
          <button
            type="button"
            onClick={handleSyncMaterials}
            disabled={isSyncingMaterials}
            title="Sinkronkan data materi aktif dengan server"
            className="text-xs bg-white/20 hover:bg-white/30 text-white font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingMaterials ? 'animate-spin' : ''}`} /> 
            {isSyncingMaterials ? 'Menyinkronkan...' : 'Sinkron Materi'}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-2">
        {localBabs.map((b, idx) => {
          const classProgress = getBabClassProgress(b.id, b.interaktif.length > 0);
          const babMaterials = dbMaterials.filter(m => m.chapter === `Bab ${b.id}`);
          const isBabExpanded = expandedBabTeacher === b.id;
          
          return (
          <div key={b.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 transition-all">
            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-1 text-gray-300">
                <button onClick={() => moveUp(idx)} disabled={idx === 0} className={`text-xl ${idx === 0 ? 'opacity-30' : 'hover:text-amber-500 active:scale-95'}`}>▲</button>
                <button onClick={() => moveDown(idx)} disabled={idx === localBabs.length - 1} className={`text-xl ${idx === localBabs.length - 1 ? 'opacity-30' : 'hover:text-amber-500 active:scale-95'}`}>▼</button>
              </div>
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-xl flex-shrink-0`}>{b.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 text-sm">Bab {b.id}</p>
                <p className="text-gray-400 text-xs truncate">{b.judul}</p>
                <p className="text-sky-600 text-[11px] font-semibold mt-0.5">{babMaterials.length} Materi Pembelajaran</p>
              </div>
              <div className="flex flex-col gap-1 items-end">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${classProgress > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                  {classProgress > 0 ? `Progres ${classProgress}%` : 'Belum dimulai'}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  <button onClick={() => handleEdit(idx)} className="text-xs text-amber-600 font-bold hover:text-amber-700 active:scale-95 bg-amber-50 px-2.5 py-1 rounded-lg">Edit Judul</button>
                  <button 
                    onClick={() => setExpandedBabTeacher(isBabExpanded ? null : b.id)} 
                    className="text-xs text-sky-600 font-bold hover:text-sky-700 active:scale-95 bg-sky-50 px-2.5 py-1 rounded-lg flex items-center gap-1"
                  >
                    Materi {isBabExpanded ? '▲' : '▼'}
                  </button>
                </div>
              </div>
            </div>

            {/* Expandable Materials List for this Bab */}
            {isBabExpanded && (
              <div className="mt-3 pt-3 border-t border-gray-100 animate-in fade-in space-y-3">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Materi Pembelajaran per Sub-bab:</p>
                </div>

                {/* Sub-bab 1 (Topik A) Section */}
                {(() => {
                  const sub1Mats = babMaterials.filter(m => 
                    m.subChapterIdx === 0 || 
                    (m.subChapter && (m.subChapter.includes('Topik A') || m.subChapter.includes('Sub-bab 1') || m.subChapter === b.topics[0])) ||
                    (!m.subChapter && m.subChapterIdx === undefined)
                  );
                  const sub1Video = getSubBabVideo(b.id, 0);

                  return (
                    <div className="bg-emerald-50/50 rounded-2xl p-3 border border-emerald-100/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                            Sub-bab 1 (Topik A)
                          </span>
                          <p className="text-xs font-bold text-gray-800 mt-1 truncate">{b.topics[0]}</p>
                        </div>
                        <button
                          onClick={() => {
                            setUploadChapter(`Bab ${b.id}`);
                            setUploadSubChapter(`Topik A: ${b.topics[0]}`);
                            setUploadSubChapterIdx(0);
                            setUploadStep(1);
                            setUploadType('text');
                            setUploadTitle('');
                            setUploadDone(false);
                            navigate('uploadMateri');
                          }}
                          className="text-[10px] font-bold text-emerald-800 bg-white hover:bg-emerald-100 border border-emerald-300 px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-xs flex-shrink-0"
                        >
                          <Plus className="w-3 h-3" /> Tambah Materi Teks/File
                        </button>
                      </div>

                      {/* Integrated Sub-bab Video Bar */}
                      <div className="bg-white rounded-xl p-2.5 border border-emerald-200/70 flex items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                            <Film className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-800">Video Sub-bab 1</span>
                              {sub1Video ? (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Tersedia</span>
                              ) : (
                                <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">Belum ada video</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 truncate max-w-[190px]">
                              {sub1Video || 'Video YouTube terintegrasi ke sub-bab ini'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {sub1Video && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentBabIdx(b.id - 1);
                                setCurrentSubBabIdx(0);
                                setActiveMaterial({
                                  id: `vid_${b.id}_0`,
                                  chapter: `Bab ${b.id}`,
                                  subChapter: `Topik A: ${b.topics[0]}`,
                                  subChapterIdx: 0,
                                  title: `Video Pembelajaran — ${b.topics[0]}`,
                                  content: sub1Video
                                });
                                navigate('bacaMateri');
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Tonton Video"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openVideoEditModal(b.id, 0, b.topics[0])}
                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 ${
                              sub1Video 
                                ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200' 
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                            }`}
                          >
                            <Film className="w-3 h-3" />
                            {sub1Video ? 'Ganti Video' : '+ Pasang Video'}
                          </button>
                        </div>
                      </div>

                      {sub1Mats.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {sub1Mats.map((m, mIdx) => (
                            <div key={m.id || mIdx} className="bg-white rounded-xl p-2.5 flex items-center justify-between gap-2 border border-emerald-100/60 shadow-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                {m.content && (m.content.includes('youtube') || m.content.includes('youtu.be')) ? <Film className="w-4 h-4 text-red-500 flex-shrink-0" /> : <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{m.title}</p>
                                  <p className="text-[10px] text-gray-400 truncate">{m.desc || 'Materi pembelajaran'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setCurrentBabIdx(b.id - 1);
                                    setCurrentSubBabIdx(0);
                                    setActiveMaterial({ ...m, chapter: `Bab ${b.id}`, subChapterIdx: 0 });
                                    navigate('bacaMateri');
                                  }}
                                  title="Lihat Materi"
                                  className="p-1.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMaterialClick(m);
                                  }}
                                  title="Hapus Materi"
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-[11px] italic py-1 text-center bg-white/60 rounded-xl border border-dashed border-emerald-200">Belum ada dokumen teks/file untuk Sub-bab 1.</p>
                      )}
                    </div>
                  );
                })()}

                {/* Sub-bab 2 (Topik B) Section */}
                {(() => {
                  const sub2Mats = babMaterials.filter(m => 
                    m.subChapterIdx === 1 || 
                    (m.subChapter && (m.subChapter.includes('Topik B') || m.subChapter.includes('Sub-bab 2') || m.subChapter === b.topics[1]))
                  );
                  const sub2Video = getSubBabVideo(b.id, 1);

                  return (
                    <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            Sub-bab 2 (Topik B)
                          </span>
                          <p className="text-xs font-bold text-gray-800 mt-1 truncate">{b.topics[1]}</p>
                        </div>
                        <button
                          onClick={() => {
                            setUploadChapter(`Bab ${b.id}`);
                            setUploadSubChapter(`Topik B: ${b.topics[1]}`);
                            setUploadSubChapterIdx(1);
                            setUploadStep(1);
                            setUploadType('text');
                            setUploadTitle('');
                            setUploadDone(false);
                            navigate('uploadMateri');
                          }}
                          className="text-[10px] font-bold text-amber-800 bg-white hover:bg-amber-100 border border-amber-300 px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-xs flex-shrink-0"
                        >
                          <Plus className="w-3 h-3" /> Tambah Materi Teks/File
                        </button>
                      </div>

                      {/* Integrated Sub-bab Video Bar */}
                      <div className="bg-white rounded-xl p-2.5 border border-amber-200/70 flex items-center justify-between gap-2 shadow-xs">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                            <Film className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs font-bold text-gray-800">Video Sub-bab 2</span>
                              {sub2Video ? (
                                <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded">Tersedia</span>
                              ) : (
                                <span className="text-[9px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">Belum ada video</span>
                              )}
                            </div>
                            <p className="text-[10px] text-gray-500 truncate max-w-[190px]">
                              {sub2Video || 'Pasang video YouTube langsung ke Sub-bab 2'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {sub2Video && (
                            <button
                              type="button"
                              onClick={() => {
                                setCurrentBabIdx(b.id - 1);
                                setCurrentSubBabIdx(1);
                                setActiveMaterial({
                                  id: `vid_${b.id}_1`,
                                  chapter: `Bab ${b.id}`,
                                  subChapter: `Topik B: ${b.topics[1]}`,
                                  subChapterIdx: 1,
                                  title: `Video Pembelajaran — ${b.topics[1]}`,
                                  content: sub2Video
                                });
                                navigate('bacaMateri');
                              }}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Tonton Video"
                            >
                              <PlayCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => openVideoEditModal(b.id, 1, b.topics[1])}
                            className={`text-[10px] font-bold px-2.5 py-1.5 rounded-lg active:scale-95 transition-all flex items-center gap-1 flex-shrink-0 ${
                              sub2Video 
                                ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200' 
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-xs'
                            }`}
                          >
                            <Film className="w-3 h-3" />
                            {sub2Video ? 'Ganti Video' : '+ Pasang Video'}
                          </button>
                        </div>
                      </div>

                      {sub2Mats.length > 0 ? (
                        <div className="space-y-1.5 pt-1">
                          {sub2Mats.map((m, mIdx) => (
                            <div key={m.id || mIdx} className="bg-white rounded-xl p-2.5 flex items-center justify-between gap-2 border border-amber-100/60 shadow-xs">
                              <div className="flex items-center gap-2 min-w-0">
                                {m.content && (m.content.includes('youtube') || m.content.includes('youtu.be')) ? <Film className="w-4 h-4 text-red-500 flex-shrink-0" /> : <FileText className="w-4 h-4 text-amber-600 flex-shrink-0" />}
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-gray-800 truncate">{m.title}</p>
                                  <p className="text-[10px] text-gray-400 truncate">{m.desc || 'Materi pembelajaran'}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  onClick={() => {
                                    setCurrentBabIdx(b.id - 1);
                                    setCurrentSubBabIdx(1);
                                    setActiveMaterial({ ...m, chapter: `Bab ${b.id}`, subChapterIdx: 1 });
                                    navigate('bacaMateri');
                                  }}
                                  title="Lihat Materi"
                                  className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteMaterialClick(m);
                                  }}
                                  title="Hapus Materi"
                                  className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-[11px] italic py-1 text-center bg-white/60 rounded-xl border border-dashed border-amber-200">Belum ada dokumen teks/file untuk Sub-bab 2.</p>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        )})}
        <div className="h-2" />
      </div>
      <TeacherBottomNav />
      {renderDeleteModal()}
      {renderVideoModal()}
      {renderToast()}
    </div>
    );
  }

  // ── 7. STUDENT HOME ────────────────────────────────────────────────────────
  if (screen === 'studentHome') {
    // Check if student has started learning any module
    const totalCompletedModules = Object.values(userProfile.completedModules || {}).reduce(
      (acc, mods) => acc + (Array.isArray(mods) ? mods.length : 0), 
      0
    );
    const hasStartedLearning = totalCompletedModules > 0;

    // Determine current active chapter for "Lanjutkan Belajar"
    let currentActiveBabIdx = 0;
    const inProgressIdx = BAB_LIST.findIndex(b => {
      const p = getBabProgress(b.id, b.interaktif.length > 0);
      return p > 0 && p < 100;
    });
    if (inProgressIdx !== -1) {
      currentActiveBabIdx = inProgressIdx;
    } else {
      const uncompletedIdx = BAB_LIST.findIndex(b => getBabProgress(b.id, b.interaktif.length > 0) < 100);
      if (uncompletedIdx !== -1) currentActiveBabIdx = uncompletedIdx;
    }
    const currentActiveBab = BAB_LIST[currentActiveBabIdx];
    const activeBabProg = getBabProgress(currentActiveBab.id, currentActiveBab.interaktif.length > 0);

    return (
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
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
            <div className="bg-white/20 rounded-xl px-2.5 py-1.5 flex items-center gap-1.5 backdrop-blur-sm">
              <span className="text-yellow-300 text-xs"> <Star className="w-4 h-4 fill-yellow-300" /> </span>
              <span className="text-white font-bold text-xs">{userProfile.xp} XP</span>
            </div>
            <button onClick={handleLogout} className="bg-white/20 rounded-xl px-3 py-1.5 text-white text-xs font-bold backdrop-blur-sm active:scale-95 transition-transform">Keluar</button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 max-w-5xl mx-auto w-full">
        {/* Mulai Belajar vs Lanjutkan Belajar */}
        {!hasStartedLearning ? (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-display text-gray-700 flex items-center gap-2">
                Mulai Petualangan Belajar <Sparkles className="w-5 h-5 text-amber-500" />
              </p>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Belum Ada Progres
              </span>
            </div>

            <div className="bg-white rounded-3xl p-5 shadow-xs border border-emerald-100 mb-3 bg-gradient-to-br from-white via-emerald-50/20 to-emerald-50/50">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl flex-shrink-0">
                  🌱
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-display text-gray-800 text-base">Selamat Datang di IPAS Kelas 3!</p>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">
                    Kamu belum memiliki aktivitas atau progres belajar. Yuk, mulai pelajari materi pertamamu dari <strong>Bab 1</strong>!
                  </p>
                </div>
              </div>
            </div>

            <button onClick={() => { setCurrentBabIdx(0); navigate('subBab'); }}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 rounded-3xl p-4 text-left shadow-lg shadow-emerald-200 active:scale-95 transition-transform group">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                  {BAB_LIST[0].emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-emerald-100 text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
                      Bab 1
                    </span>
                    <span className="text-emerald-200 text-xs">Belum Dimulai</span>
                  </div>
                  <p className="text-white font-display text-base leading-tight truncate">{BAB_LIST[0].judul}</p>
                </div>
                <div className="w-9 h-9 bg-white/20 group-hover:bg-white/30 rounded-xl flex items-center justify-center text-white text-sm backdrop-blur-sm transition-all flex-shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar pct={0} gradient="from-white to-white/80" h="h-2" />
                <span className="text-white text-xs font-bold flex-shrink-0">Mulai Bab 1 (0%) →</span>
              </div>
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <p className="font-display text-gray-700 flex items-center gap-2">
                Lanjutkan Belajar <BookOpen className="w-5 h-5 text-emerald-600" />
              </p>
              <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Bab {currentActiveBab.id} · {activeBabProg}%
              </span>
            </div>

            <button onClick={() => { setCurrentBabIdx(currentActiveBabIdx); navigate('subBab'); }}
              className={`w-full bg-gradient-to-r ${currentActiveBab.gradient} rounded-3xl p-4 text-left shadow-lg shadow-emerald-200 active:scale-95 transition-transform group`}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl backdrop-blur-sm">
                  {currentActiveBab.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 text-xs font-semibold">Bab {currentActiveBab.id}</p>
                  <p className="text-white font-display text-base leading-tight truncate">{currentActiveBab.judul}</p>
                </div>
                <div className="w-9 h-9 bg-white/20 group-hover:bg-white/30 rounded-xl flex items-center justify-center text-white text-sm backdrop-blur-sm transition-all flex-shrink-0">
                  <PlayCircle className="w-5 h-5" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ProgressBar pct={activeBabProg} gradient="from-white to-white/80" h="h-2" />
                <span className="text-white text-xs font-bold flex-shrink-0">{activeBabProg}% Selesai</span>
              </div>
            </button>
          </div>
        )}

        {/* Media baru dari guru */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <p className="font-display text-gray-700 flex items-center gap-2">
              Media Pembelajaran Interaktif <BadgePlus className="w-5 h-5 text-emerald-600" />
            </p>
            <span className="text-[10px] text-gray-400 font-semibold">Tersedia untuk Dimainkan</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-none">
            <button onClick={() => { setArenaPhase('intro'); navigate('arena'); }}
              className="relative rounded-2xl p-3 flex flex-col items-center text-center flex-shrink-0 w-28 overflow-hidden active:scale-95 transition-transform"
              style={{ background: 'radial-gradient(130% 130% at 0% 0%, #0f766e, #0a2540)', boxShadow: '0 6px 18px rgba(6,95,70,0.35)' }}>
              <div className="absolute inset-0 arena-grid opacity-50 pointer-events-none" />
              <div className="flex justify-center mb-2"><Zap className="w-7 h-7 text-white" /></div>
              <p className="relative font-display text-white text-xs leading-tight">Sains Sprint</p>
              <p className="relative text-lime-300 text-[10px] mt-1 font-black tracking-wide">MAIN!</p>
            </button>
            {BAB_LIST.flatMap(b => b.interaktif.map(m => ({ ...m, babStr: `Bab ${b.id}` }))).map((m, i) => (
              <button key={i} onClick={() => { if (m.screen === 'dragDrop') resetDrag(); navigate(m.screen); }}
                className="bg-white rounded-2xl p-3 flex flex-col items-center text-center shadow-sm flex-shrink-0 w-28 active:scale-95 transition-transform border border-gray-100">
                <div className="mb-2 flex justify-center items-center">{m.icon}</div>
                <p className="font-bold text-gray-700 text-xs leading-tight">{m.title}</p>
                <p className="text-emerald-600 text-[10px] mt-1 font-semibold">{m.babStr}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quick bab overview */}
        <div>
          <div className="flex justify-between items-center mb-2.5">
            <p className="font-display text-gray-700">Semua Bab IPAS</p>
            <button onClick={() => handleTabPress('bab')} className="text-emerald-600 text-sm font-bold hover:underline">Semua bab →</button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
            {BAB_LIST.map((b, i) => {
              const prog = getBabProgress(b.id, b.interaktif.length > 0);
              return (
                <button key={b.id} onClick={() => { setCurrentBabIdx(i); navigate('subBab'); }}
                  className="bg-white rounded-3xl p-4 shadow-sm text-left active:scale-95 transition-transform border border-gray-100 hover:border-emerald-200">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center text-2xl mb-3`}>{b.emoji}</div>
                  <p className="text-gray-400 text-xs font-semibold">Bab {b.id}</p>
                  <p className="font-bold text-gray-800 text-sm leading-tight mb-2 line-clamp-2">{b.judul}</p>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${prog}%` }} />
                  </div>
                  <p className={`text-xs mt-1.5 font-semibold ${prog > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {prog > 0 ? `${prog}% Selesai` : 'Belum dimulai'}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-2" />
      </div>
      <StudentBottomNav />
    </div>
    );
  }

  // ── SUB BAB ─────────────────────────────────────────────────────────────────
  if (screen === 'subBab') {
    const subTopics = bab.topics;
    // Sub-topic icons per chapter based on school subject
    const subIcons = ['📖', '🔬', '🌱', '⚗️', '🧩', '💡', '🗺️', '🧊'];
    const babIcon = subIcons[(bab.id - 1) % subIcons.length];
    
    return (
      <div className="h-full flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
        {/* Header */}
        <div className={`relative bg-gradient-to-br ${bab.gradient} px-5 pt-10 pb-8 rounded-b-[2.5rem] flex-shrink-0 shadow-lg overflow-hidden border-b border-white/20`}>
          {/* Header Texture */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-20"
            style={{
              backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)',
              backgroundSize: '16px 16px'
            }}
          />
          <div className="absolute -right-8 -top-10 w-44 h-44 rounded-full bg-white/20 blur-2xl pointer-events-none" />
          <div className="absolute right-12 -bottom-8 w-32 h-32 rounded-full border-2 border-white/20 pointer-events-none" />
          <div className="absolute right-8 -bottom-4 text-8xl font-black opacity-15 pointer-events-none select-none rotate-12 scale-110">
            {bab.emoji}
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-5">
              <button onClick={goBack} className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-colors active:scale-95 border border-white/30 shadow-xs">
                <span className="font-bold text-xl">←</span>
              </button>
              <div>
                <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-md mb-1 border border-white/15">Bab {bab.id}</span>
                <h1 className="text-white font-display text-xl leading-tight drop-shadow-md">{bab.judul}</h1>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/25 shadow-xs">
              <p className="text-white/90 text-xs leading-relaxed">{bab.cp}</p>
            </div>
          </div>
        </div>

        {/* Sub-bab cards */}
        <div className="flex-1 overflow-y-auto px-5 py-6 space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4 max-w-5xl mx-auto w-full">
          <div className="sm:col-span-2">
            <p className="text-gray-500 text-xs font-bold uppercase tracking-widest sm:mb-2">Pilih Topik yang Ingin Dipelajari:</p>
          </div>
          
          {subTopics.map((topic, idx) => (
            <button key={idx} onClick={() => { setCurrentSubBabIdx(idx); navigate('detailBab'); }}
              className="w-full text-left bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden active:scale-95 transition-all hover:shadow-md group">
              
              {/* Top color strip */}
              <div className={`h-1.5 bg-gradient-to-r ${bab.gradient}`} />
              
              <div className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${bab.gradient} flex items-center justify-center text-3xl flex-shrink-0 shadow-sm`}>
                    {babIcon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-display px-2 py-0.5 rounded-full bg-gradient-to-r ${bab.gradient} text-white font-bold`}>
                        Topik {String.fromCharCode(65 + idx)}
                      </span>
                    </div>
                    <p className="font-display text-gray-800 text-lg leading-tight">{topic}</p>
                    <p className="text-gray-400 text-xs mt-1">Materi · Kuis · Aktivitas</p>
                  </div>
                  <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${bab.gradient} flex items-center justify-center text-white shadow-sm flex-shrink-0 group-hover:scale-110 transition-transform`}>
                    <span className="font-bold text-sm">→</span>
                  </div>
                </div>
              </div>
            </button>
          ))}

          <div className="sm:col-span-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-start gap-3 mt-2 sm:mt-0">
            <span className="text-2xl flex-shrink-0">💡</span>
            <div>
              <p className="text-emerald-700 font-bold text-sm">Kerjakan urutan yang benar!</p>
              <p className="text-emerald-600 text-xs mt-0.5">Pelajari Topik A terlebih dahulu, lalu lanjut ke Topik B untuk pemahaman yang maksimal.</p>
            </div>
          </div>
          <div className="h-4" />
        </div>
        <StudentBottomNav />
      </div>
    );
  }

  // ── 8. DAFTAR BAB ──────────────────────────────────────────────────────────
  if (screen === 'daftarBab') return (
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
      <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0 relative overflow-hidden shadow-lg border-b border-emerald-500/30">
        {/* Header Texture */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 1.5px, transparent 1.5px)',
            backgroundSize: '16px 16px'
          }}
        />
        <div className="absolute -right-8 -top-10 w-40 h-40 rounded-full bg-white/15 blur-2xl pointer-events-none" />
        <div className="absolute right-6 -bottom-6 w-28 h-28 rounded-full border-2 border-white/15 pointer-events-none" />

        <div className="relative z-10">
          <p className="text-emerald-100 text-xs font-semibold mb-1 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-200" /> IPAS Kelas 3 · Kurikulum Merdeka
          </p>
          <p className="text-white font-display text-2xl flex items-center gap-2">
            8 Bab Pembelajaran <Leaf className="w-6 h-6 text-emerald-300 inline-block" />
          </p>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 sm:space-y-4 max-w-3xl mx-auto w-full">
        {BAB_LIST.map((b, i) => {
          const actualProgress = getBabProgress(b.id, b.interaktif.length > 0);
          const isExpanded = expandedBab === b.id;
          
          return (
            <div key={b.id} className={`w-full rounded-3xl overflow-hidden shadow-md shadow-slate-200/60 border border-slate-100 transition-all ${isExpanded ? 'ring-2 ring-emerald-400 shadow-lg' : 'hover:shadow-lg'}`}>
              <button onClick={() => setExpandedBab(isExpanded ? null : b.id)} className="w-full text-left active:scale-95 transition-transform">
                <div className={`bg-gradient-to-r ${b.gradient} p-4.5 sm:p-5 relative overflow-hidden shadow-[inset_0_1px_1px_rgba(255,255,255,0.35)]`}>
                  {/* Texture Layer 1: Tactile Micro Dot-Grid pattern */}
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-20"
                    style={{
                      backgroundImage: 'radial-gradient(circle, rgba(255, 255, 255, 0.9) 1.5px, transparent 1.5px)',
                      backgroundSize: '16px 16px'
                    }}
                  />

                  {/* Texture Layer 2: Diagonal Soft Glass Sheen */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-transparent to-black/15 pointer-events-none" />

                  {/* Texture Layer 3: Ambient Glowing Light Orbs & Concentric Rings */}
                  <div className="absolute -right-6 -top-10 w-36 h-36 rounded-full bg-white/20 blur-2xl pointer-events-none" />
                  <div className="absolute right-12 -bottom-10 w-32 h-32 rounded-full border-2 border-white/20 pointer-events-none" />
                  <div className="absolute right-20 -bottom-6 w-20 h-20 rounded-full border border-white/15 pointer-events-none" />

                  {/* Texture Layer 4: Thematic Watermark Accent */}
                  <div className="absolute right-12 -bottom-3 text-7xl font-black opacity-15 pointer-events-none select-none filter blur-[0.4px] transform rotate-12 scale-110">
                    {b.emoji}
                  </div>

                  {/* Foreground Content */}
                  <div className="relative z-10 flex items-center gap-4">
                    <div className="w-14 h-14 bg-white/30 rounded-2xl flex items-center justify-center text-3xl backdrop-blur-md shadow-md border border-white/40 flex-shrink-0 ring-4 ring-white/10">
                      {b.emoji}
                    </div>
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-white bg-black/25 px-2.5 py-0.5 rounded-full backdrop-blur-md border border-white/15 shadow-xs">
                          Bab {b.id}
                        </span>
                      </div>
                      <p className="text-white font-display text-base sm:text-lg font-bold leading-tight drop-shadow-md truncate">{b.judul}</p>
                      <div className="mt-2 flex items-center">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 font-bold text-xs shadow-md border border-white/60">
                          <span>{b.topics.length} Topik</span>
                          <span className="text-slate-300 font-black">·</span>
                          <span>{dbMaterials.filter(m => m.chapter === `Bab ${b.id}`).length + b.interaktif.length} Media</span>
                        </span>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-2xl bg-white/25 hover:bg-white/35 backdrop-blur-md flex items-center justify-center flex-shrink-0 border border-white/30 shadow-xs transition-all active:scale-90">
                      <span className="text-white text-lg font-black transition-transform duration-300 leading-none" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                    </div>
                  </div>
                </div>
              </button>
              
              <div className="bg-white">
                <div className={`overflow-hidden transition-all duration-300 ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-4 bg-emerald-50/50 border-b border-gray-100">
                    <p className="text-[10px] font-bold text-emerald-800 mb-3 uppercase tracking-widest flex items-center gap-1">
                      <BookOpen className="w-3 h-3" /> Topik Pembelajaran:
                    </p>
                    <ul className="space-y-3 mb-4">
                      {b.topics.map((t, idx) => (
                        <li key={idx} className="flex items-start gap-2.5">
                          <span className="text-emerald-500 font-display text-sm w-4 mt-0.5">{String.fromCharCode(65 + idx)}.</span>
                          <span className="text-gray-700 text-sm font-semibold leading-snug">{t}</span>
                        </li>
                      ))}
                    </ul>
                    <button onClick={() => { setCurrentBabIdx(i); navigate('subBab'); }} 
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-transform shadow-sm shadow-emerald-200 text-sm">
                      Masuk ke Bab Ini <span>→</span>
                    </button>
                  </div>
                </div>
                
                <div className="px-4 py-2.5 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full bg-gradient-to-r ${b.gradient} rounded-full`} style={{ width: `${actualProgress}%` }} />
                  </div>
                  <span className={`text-[10px] font-bold ${actualProgress > 0 ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {actualProgress > 0 ? `${actualProgress}% Selesai` : 'Belum dimulai (0%)'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <div className="h-4" />
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
    <div className="h-full bg-slate-50 flex flex-col overflow-hidden font-sans" style={{ zoom: studentZoom }}>
      <div className={`relative bg-gradient-to-r ${bab.gradient} px-5 pt-10 pb-4 shadow-md flex-shrink-0`}>
        <div className="flex items-center gap-3">
          <button onClick={goBack} className="w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-2xl flex items-center justify-center text-white transition-colors active:scale-95 flex-shrink-0">
            <span className="font-bold text-lg">←</span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <p className="text-white/80 text-[10px] font-bold tracking-widest uppercase">Bab {bab.id}</p>
              <span className="text-white/40 text-[10px]">•</span>
              <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs">
                Topik {String.fromCharCode(65 + currentSubBabIdx)} (Sub-bab {currentSubBabIdx + 1})
              </span>
            </div>
            <h2 className="text-white font-display text-lg leading-tight truncate">{bab.topics[currentSubBabIdx] || bab.judul}</h2>
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

      <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6 relative max-w-3xl mx-auto w-full">
        <div className="absolute left-9 top-8 bottom-12 w-0.5 bg-slate-200 z-0 rounded-full" />

        {/* Node 1: Materi Belajar */}
        {(() => {
          const currentTopic = bab.topics[currentSubBabIdx];
          const chapterMats = dbMaterials.filter(x => {
            if (x.chapter !== `Bab ${bab.id}`) return false;
            if (x.subChapterIdx !== undefined && x.subChapterIdx !== null) {
              if (x.subChapterIdx === -1) return true;
              return x.subChapterIdx === currentSubBabIdx;
            }
            if (x.subChapter) {
              if (x.subChapter.toLowerCase().includes('semua') || x.subChapter.toLowerCase().includes('umum')) return true;
              const isTopicB = x.subChapter.includes('Topik B') || x.subChapter.includes('Sub-bab 2') || (currentTopic && x.subChapter.includes(bab.topics[1]));
              if (currentSubBabIdx === 1) return isTopicB;
              const isTopicA = x.subChapter.includes('Topik A') || x.subChapter.includes('Sub-bab 1') || (currentTopic && x.subChapter.includes(bab.topics[0]));
              return isTopicA || (!isTopicB);
            }
            return currentSubBabIdx === 0;
          });

          return (
            <div className="relative z-10 flex gap-4">
              <div className={`w-8 h-8 rounded-full ${materiDone ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'} flex items-center justify-center font-bold shadow-md flex-shrink-0 mt-1 border-4 border-slate-50`}>
                {materiDone ? '✓' : '1'}
              </div>
              <div className={`flex-1 bg-white rounded-2xl p-4 shadow-sm border ${materiDone ? 'border-emerald-200' : 'border-slate-100'} hover:shadow-md transition-all`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${currentSubBabIdx === 1 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    Sub-bab {currentSubBabIdx + 1} ({String.fromCharCode(65 + currentSubBabIdx)})
                  </span>
                  <h3 className="font-bold text-slate-800 text-base">{currentTopic}</h3>
                </div>
                <p className="text-slate-500 text-xs mb-3">Tujuan, rangkuman konsep, dan materi inti.</p>
                {/* Direct Video Player in Detail Bab */}
                {(() => {
                  const subVidUrl = getSubBabVideo(bab.id, currentSubBabIdx);
                  const vidId = extractYoutubeId(subVidUrl);
                  const embedUrl = vidId ? `https://www.youtube.com/embed/${vidId}?rel=0&modestbranding=1` : '';
                  const watchUrl = vidId ? `https://www.youtube.com/watch?v=${vidId}` : subVidUrl;

                  if (subVidUrl && embedUrl) {
                    return (
                      <div className="mb-4 bg-white rounded-2xl border border-red-200 overflow-hidden shadow-xs">
                        <div className="bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2.5 flex items-center justify-between text-white">
                          <div className="flex items-center gap-2 min-w-0">
                            <Film className="w-4 h-4 flex-shrink-0" />
                            <span className="text-xs font-bold truncate">Video Pembelajaran: Sub-bab {currentSubBabIdx + 1}</span>
                          </div>
                          {isTeacher && (
                            <button
                              type="button"
                              onClick={() => openVideoEditModal(bab.id, currentSubBabIdx, currentTopic)}
                              className="text-[10px] font-bold bg-white/20 hover:bg-white/30 px-2 py-0.5 rounded-md transition-all flex items-center gap-1"
                            >
                              <Film className="w-3 h-3" /> Ubah Video
                            </button>
                          )}
                        </div>
                        <div className="p-3 space-y-2.5">
                          <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-inner border border-gray-100">
                            <iframe
                              width="100%"
                              height="100%"
                              src={embedUrl}
                              title={`Video Pembelajaran Sub-bab ${currentSubBabIdx + 1}`}
                              frameBorder="0"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                              allowFullScreen
                              referrerPolicy="strict-origin-when-cross-origin"
                            />
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-red-50/80 border border-red-200/80 rounded-xl">
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-gray-800">
                                Video menampilkan <em>"Tidak Tersedia"</em>?
                              </p>
                              <p className="text-[11px] text-gray-500">
                                Pembuat video membatasi pemutaran di aplikasi. Tonton langsung di YouTube:
                              </p>
                            </div>
                            <a
                              href={watchUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center justify-center gap-1.5 flex-shrink-0"
                            >
                              <PlayCircle className="w-3.5 h-3.5" /> Buka di YouTube ↗
                            </a>
                          </div>
                        </div>
                      </div>
                    );
                  } else if (isTeacher) {
                    return (
                      <div className="mb-4 p-3 bg-red-50/70 border border-dashed border-red-200 rounded-2xl flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-8 h-8 rounded-xl bg-red-100 text-red-600 flex items-center justify-center flex-shrink-0">
                            <Film className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-gray-800">Belum Ada Video untuk Sub-bab {currentSubBabIdx + 1}</p>
                            <p className="text-[10px] text-gray-400 truncate">Guru dapat menyematkan link YouTube langsung ke sub-bab ini</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => openVideoEditModal(bab.id, currentSubBabIdx, currentTopic)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all flex items-center gap-1 flex-shrink-0"
                        >
                          <Plus className="w-3.5 h-3.5" /> Pasang Video
                        </button>
                      </div>
                    );
                  }
                  return null;
                })()}

                {chapterMats.length === 0 ? (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-center space-y-2">
                    <p className="text-xs text-gray-500 font-medium">Materi khusus Sub-bab {currentSubBabIdx + 1} belum diunggah oleh guru.</p>
                    <button
                      onClick={() => {
                        setActiveMaterial({
                          title: `${currentTopic} (Sub-bab ${currentSubBabIdx + 1})`,
                          chapter: `Bab ${bab.id}`,
                          subChapter: `Topik ${String.fromCharCode(65 + currentSubBabIdx)}: ${currentTopic}`,
                          subChapterIdx: currentSubBabIdx,
                          content: `<div class="p-5 bg-sky-50 rounded-2xl border border-sky-200">
                            <h3 class="font-bold text-sky-900 text-base mb-2">📖 Topik ${String.fromCharCode(65 + currentSubBabIdx)}: ${currentTopic}</h3>
                            <p class="text-sky-800 text-sm mb-2">Materi untuk sub-bab ini sedang disiapkan oleh guru.</p>
                            <p class="text-gray-600 text-xs">Silakan pelajari materi pendukung lainnya atau tonton video pembelajaran yang tersedia.</p>
                          </div>`
                        });
                        navigate('bacaMateri');
                      }}
                      className="text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3.5 py-1.5 rounded-lg transition-all active:scale-95 inline-block"
                    >
                      Buka Rangkuman Sub-bab →
                    </button>
                  </div>
                ) : chapterMats.length === 1 ? (
                  <button
                    onClick={() => {
                      setActiveMaterial({
                        ...chapterMats[0],
                        chapter: `Bab ${bab.id}`,
                        subChapterIdx: currentSubBabIdx,
                        subChapter: `Topik ${String.fromCharCode(65 + currentSubBabIdx)}: ${currentTopic}`
                      });
                      navigate('bacaMateri');
                    }}
                    className={`${materiDone ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'} px-4 py-2.5 rounded-xl text-xs font-bold w-full text-left flex justify-between items-center active:scale-95 transition-transform`}
                  >
                    <div className="flex items-center gap-2 truncate pr-2">
                      {chapterMats[0].content && (chapterMats[0].content.includes('youtube') || chapterMats[0].content.includes('youtu.be')) ? <Film className="w-4 h-4 text-red-500 flex-shrink-0" /> : <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                      <span className="truncate">{chapterMats[0].title}</span>
                    </div>
                    <span className="flex-shrink-0">{materiDone ? 'Baca Ulang' : 'Mulai Membaca'} →</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Tersedia {chapterMats.length} Dokumen / Video:</p>
                    {chapterMats.map((m, mIdx) => (
                      <button
                        key={m.id || mIdx}
                        onClick={() => {
                          setActiveMaterial({
                            ...m,
                            chapter: `Bab ${bab.id}`,
                            subChapterIdx: currentSubBabIdx,
                            subChapter: `Topik ${String.fromCharCode(65 + currentSubBabIdx)}: ${currentTopic}`
                          });
                          navigate('bacaMateri');
                        }}
                        className="w-full text-left p-2.5 rounded-xl bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 flex items-center justify-between transition-all group active:scale-95"
                      >
                        <div className="min-w-0 pr-2 flex items-center gap-2">
                          {m.content && (m.content.includes('youtube') || m.content.includes('youtu.be')) ? <Film className="w-4 h-4 text-red-500 flex-shrink-0" /> : <FileText className="w-4 h-4 text-emerald-600 flex-shrink-0" />}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-xs truncate group-hover:text-emerald-700">{m.title}</p>
                            <p className="text-[10px] text-slate-400 truncate">{m.desc || 'Materi Belajar'}</p>
                          </div>
                        </div>
                        <span className="text-emerald-600 text-xs font-bold flex-shrink-0 group-hover:translate-x-0.5 transition-transform">Baca →</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })()}

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
      {renderVideoModal()}
      {renderToast()}
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
          <p className="text-gray-400 text-xs truncate">
            {activeMaterial?.chapter || `Bab ${bab.id}`}
            {activeMaterial?.subChapter ? ` · ${activeMaterial.subChapter}` : ` · Topik ${String.fromCharCode(65 + currentSubBabIdx)}`}
          </p>
        </div>
        <button className="w-9 h-9 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 text-lg"> <Bookmark className="w-5 h-5" /> </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 max-w-3xl mx-auto w-full">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Header */}
          <div className={`bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl p-4 mb-5 text-center`}>
            <span className="text-4xl block mb-2"> <Leaf className="w-5 h-5" /> </span>
            <p className="text-white font-display text-lg">{activeMaterial?.title || 'Materi Pembelajaran'}</p>
            <p className="text-emerald-100 text-sm">
              IPAS Kelas 3 · {activeMaterial?.chapter || `Bab ${bab.id}`}
              {activeMaterial?.subChapter ? ` · ${activeMaterial.subChapter}` : ` · Topik ${String.fromCharCode(65 + currentSubBabIdx)}: ${bab.topics[currentSubBabIdx]}`}
            </p>
          </div>

          {/* === VIDEO PEMBELAJARAN (UTAMA DI ATAS) === */}
          {(() => {
            const effectiveBabId = activeMaterial?.chapter 
              ? (parseInt(activeMaterial.chapter.replace(/\D/g, '')) || bab.id) 
              : bab.id;

            const effectiveBabObj = BAB_LIST.find(b => b.id === effectiveBabId) || bab;

            const effectiveSubBabIdx = activeMaterial?.subChapterIdx !== undefined 
              ? Number(activeMaterial.subChapterIdx) 
              : (activeMaterial?.subChapter?.includes('Topik B') || activeMaterial?.subChapter?.includes('Sub-bab 2') ? 1 : currentSubBabIdx);

            const currentSubTopicTitle = effectiveBabObj.topics[effectiveSubBabIdx] || `Sub-bab ${effectiveSubBabIdx + 1}`;

            let rawVid = getSubBabVideo(effectiveBabId, effectiveSubBabIdx);
            if (!rawVid && activeMaterial?.content && (activeMaterial.content.includes('youtube') || activeMaterial.content.includes('youtu.be'))) {
              rawVid = activeMaterial.content;
            }

            const youtubeId = extractYoutubeId(rawVid);
            const embedVid = youtubeId ? `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1` : '';
            const watchUrl = youtubeId ? `https://www.youtube.com/watch?v=${youtubeId}` : (rawVid || '');

            if (!embedVid && !isTeacher) return null;

            return (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2.5">
                  <p className="font-bold text-gray-800 text-base flex items-center gap-2">
                    <Film className="w-5 h-5 text-red-500" /> Video Pembelajaran: Sub-bab {effectiveSubBabIdx + 1}
                  </p>
                  {isTeacher && (
                    <button
                      type="button"
                      onClick={() => openVideoEditModal(effectiveBabId, effectiveSubBabIdx, currentSubTopicTitle)}
                      className="text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 px-2.5 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all"
                    >
                      <Film className="w-3.5 h-3.5 text-red-500" />
                      {youtubeId ? 'Ganti Video Sub-bab' : '+ Pasang Video Sub-bab'}
                    </button>
                  )}
                </div>

                {embedVid ? (
                  <div className="space-y-2.5">
                    <div className="w-full rounded-2xl overflow-hidden shadow-md aspect-video bg-black border border-gray-200">
                      <iframe 
                        width="100%" 
                        height="100%" 
                        src={embedVid} 
                        title={`Video Pembelajaran ${currentSubTopicTitle}`} 
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                        allowFullScreen
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-red-50/80 border border-red-200 rounded-2xl">
                      <div className="flex items-center gap-2 min-w-0">
                        <PlayCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                        <p className="text-xs text-gray-700">
                          Video tidak bisa diputar atau muncul tulisan <em>"Tidak Tersedia"</em>?
                        </p>
                      </div>
                      <a
                        href={watchUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-xs active:scale-95 transition-all inline-flex items-center justify-center gap-1.5 flex-shrink-0"
                      >
                        <Film className="w-3.5 h-3.5" /> Tonton di YouTube ↗
                      </a>
                    </div>
                  </div>
                ) : isTeacher ? (
                  <div 
                    className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 mb-6 text-center group cursor-pointer hover:border-red-300 transition-colors"
                    onClick={() => openVideoEditModal(effectiveBabId, effectiveSubBabIdx, currentSubTopicTitle)}
                  >
                    <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform">
                      <Film className="w-6 h-6" />
                    </div>
                    <p className="text-gray-700 font-bold text-sm">Belum Ada Video untuk Sub-bab {effectiveSubBabIdx + 1}</p>
                    <p className="text-gray-400 text-xs mt-1">
                      Guru dapat langsung memasang tautan video YouTube ke sub-bab ini tanpa membuat materi baru.
                    </p>
                    <button
                      type="button"
                      className="mt-3 text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 active:scale-95 transition-all"
                    >
                      <Film className="w-3.5 h-3.5" /> Pasang Video YouTube Sekarang
                    </button>
                  </div>
                ) : (
                  <div className="bg-sky-50/70 border border-sky-100 rounded-2xl p-4 mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center flex-shrink-0">
                      <Film className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-sky-900">Video Pembelajaran</p>
                      <p className="text-[11px] text-sky-600 mt-0.5">Belum ada video pembelajaran yang disematkan untuk sub-bab ini.</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* Materi Tertulis / Dokumen */}
          <div className="w-full h-px bg-gray-100 my-5" />

          {activeMaterial?.content ? (
            extractYoutubeId(activeMaterial.content) && !activeMaterial.content.includes('<') ? (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-4 text-center mb-6">
                <p className="text-sky-900 font-bold text-sm mb-1">🎬 Video Pembelajaran Siap Diputar</p>
                <p className="text-sky-700 text-xs">Silakan tonton video di atas untuk memahami isi materi sub-bab ini secara menyeluruh.</p>
              </div>
            ) : activeMaterial.content.includes('<') && activeMaterial.content.includes('>') ? (
              <div 
                 onClick={(e) => {
                   const target = e.target as HTMLElement;
                   if (target.tagName === 'BUTTON' && target.innerText.includes('File')) {
                     setViewingFile(true);
                   }
                 }}
                 className="text-gray-700 text-base leading-relaxed mb-8 [&>ul]:list-disc [&>ul]:pl-5 [&>ol]:list-decimal [&>ol]:pl-5 [&>p]:mb-3 [&_img]:rounded-xl [&_img]:shadow-sm [&_img]:max-w-full"
                 dangerouslySetInnerHTML={{ __html: activeMaterial.content.replace(/max-w-sm mx-auto/g, 'w-full') }} 
              />
            ) : (
              renderSmartMateri(activeMaterial.content)
            )
          ) : (
            <>
              <p className="font-bold text-emerald-700 text-sm mb-1 uppercase tracking-wide"> <Pin className="w-5 h-5" />  Tujuan Pembelajaran</p>
              <ul className="text-gray-600 text-sm mb-4 space-y-1">
                {['Menyebutkan bagian-bagian penting dari sub-bab ini', 'Menjelaskan fungsi setiap konsep dalam kehidupan nyata', 'Mendeskripsikan contoh dan penerapannya'].map((t, i) => (
                  <li key={i} className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span>{t}</li>
                ))}
              </ul>

              <div className="w-full h-px bg-gray-100 my-4" />

              <p className="font-bold text-gray-800 text-base mb-2">Penjelasan Konsep Materi</p>
              <p className="text-gray-600 text-sm leading-relaxed mb-3">
                Pelajari materi ini dengan saksama bersama teman dan guru. Catat hal-hal penting di buku catatanmu untuk mempermudah saat mengerjakan kuis dan kegiatan interaktif.
              </p>
            </>
          )}

          <div className="w-full h-px bg-gray-100 my-5" />

          <p className="font-bold text-gray-800 text-base mb-3 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-500" /> Ringkasan Materi</p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 mb-6 text-gray-700 text-sm leading-relaxed">
            <p className="font-bold text-blue-800 mb-2">Ingat Poin Penting Ini:</p>
            <ul className="list-disc pl-5 space-y-1 text-blue-900/80">
              <li>Materi pada <b>{bab.judul}</b> ini sangat penting untuk kehidupan kita sehari-hari.</li>
              <li>Perhatikan dengan seksama bagian video yang menjelaskan proses atau langkah-langkah di alam.</li>
              <li>Pastikan kamu sudah memahami materi sebelum menekan tombol selesai dan lanjut ke kuis!</li>
            </ul>
          </div>

          <button onClick={() => { addXP(20); markCompleted(BAB_LIST[currentBabIdx].id, 'materi'); goBack(); }} className="w-full mt-4 bg-emerald-600 text-white py-4 rounded-xl font-bold shadow-md hover:bg-emerald-700 active:scale-95 transition-all">
            Selesai Membaca & Lanjut →
          </button>
        </div>
        <div className="h-4" />
      </div>

      {/* MODAL DOCUMENT VIEWER */}
      {viewingFile && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col p-4 sm:p-8 animate-fade-in">
          <div className="flex justify-between items-center bg-gray-900 rounded-t-2xl p-4 sm:p-5 text-white shadow-xl max-w-5xl mx-auto w-full">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-500 rounded-xl flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm sm:text-base">{activeMaterial?.title || 'Dokumen Materi'}.pdf</p>
                <p className="text-gray-400 text-xs">Page 1 of 12 • 100% Zoom</p>
              </div>
            </div>
            <button onClick={() => setViewingFile(false)} className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center transition-colors active:scale-95">
              ✕
            </button>
          </div>
          <div className="flex-1 bg-gray-200 rounded-b-2xl overflow-y-auto max-w-5xl mx-auto w-full shadow-2xl relative">
            {/* Fake PDF Content */}
            <div className="bg-white min-h-[800px] m-4 sm:m-8 rounded shadow p-8 sm:p-12 text-gray-800 font-serif leading-relaxed">
              <h1 className="text-3xl font-bold mb-6 text-center">{activeMaterial?.title || 'Materi Belajar IPAS'}</h1>
              <div className="h-0.5 bg-gray-800 w-full mb-8" />
              <p className="mb-4">Pendahuluan materi ini disiapkan oleh guru untuk memperdalam pemahaman siswa tentang <b>{bab.judul}</b>. Siswa diharapkan membaca dengan teliti bagian demi bagian.</p>
              <h2 className="text-xl font-bold mt-8 mb-4">I. Konsep Dasar</h2>
              <p className="mb-4 text-justify">Pada pembahasan awal, kita akan mengeksplorasi fenomena-fenomena alam yang berkaitan dengan keseharian kita. Mengamati sekeliling adalah kunci untuk memahami cara alam semesta bekerja.</p>
              <div className="bg-gray-100 p-6 rounded my-6 border-l-4 border-emerald-500">
                <p className="italic text-gray-600">"Sains tidak hanya dipelajari di dalam kelas, melainkan ada di setiap hela napas dan langkah kaki kita di alam terbuka."</p>
              </div>
              <h2 className="text-xl font-bold mt-8 mb-4">II. Aktivitas Lapangan</h2>
              <p className="mb-4 text-justify">Setelah memahami konsep teori, lakukan eksperimen sederhana. Catat setiap perubahan atau hasil yang kamu temukan di dalam tabel pengamatan.</p>
              <div className="flex gap-4 mt-8">
                <div className="flex-1 h-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400">[Gambar Ilustrasi 1]</div>
                <div className="flex-1 h-32 bg-gray-200 rounded border border-gray-300 flex items-center justify-center text-gray-400">[Gambar Ilustrasi 2]</div>
              </div>
            </div>
          </div>
        </div>
      )}
      {renderVideoModal()}
      {renderToast()}
    </div>
  );

  // ── 12. MEDIA HUB ──────────────────────────────────────────────────────────
  if (screen === 'mediaHub') return (
    <div className="h-full bg-[#F0FDF4] flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
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
              <button onClick={() => { resetDrag(); goBack(); }}
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
  // ── STUDENT PENGATURAN ─────────────────────────────────────────────────────
  if (screen === 'studentPengaturan') {
    return (
      <div className="h-full bg-emerald-50 flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 px-5 pt-10 pb-6 rounded-b-[2.5rem] flex-shrink-0">
          <p className="text-white font-display text-xl flex items-center gap-2"><Settings className="w-5 h-5" /> Pengaturan</p>
          <p className="text-emerald-200 text-xs mt-1">Sesuaikan tampilan belajarmu</p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-6">
          {/* Profil Siswa */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <GraduationCap className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <p className="font-display text-gray-800 text-lg">{auth.currentUser?.displayName || 'Siswa'}</p>
                <p className="text-emerald-600 text-sm font-bold">Siswa IPAS</p>
              </div>
            </div>
          </div>

          {/* Ukuran Teks */}
          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="font-display text-gray-800 mb-1 flex items-center gap-2"><Eye className="w-5 h-5 text-violet-500" /> Ukuran Huruf</p>
            <p className="text-xs text-gray-400 mb-5">Besarkan atau kecilkan huruf sesuai keinginanmu!</p>

            {/* Slider */}
            <div className="mb-4">
              <input
                type="range"
                min={16}
                max={24}
                step={1}
                value={studentFontSize}
                onChange={e => handleSetFontSize(Number(e.target.value))}
                className="w-full h-3 rounded-full accent-violet-500 cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 font-bold mt-2">
                <span>Kecil</span>
                <span>Sedang</span>
                <span>Besar</span>
              </div>
            </div>

            {/* Tombol preset */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[{ label: '🔤 Kecil', size: 16 }, { label: '🔡 Normal', size: 18 }, { label: '🔠 Besar', size: 20 }, { label: '🅰 Ekstra Besar', size: 22 }].map(preset => (
                <button key={preset.size} onClick={() => handleSetFontSize(preset.size)}
                  className={`py-3 rounded-2xl font-bold border-2 transition-all active:scale-95 ${
                    studentFontSize === preset.size
                      ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-200'
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Preview */}
            <div className="bg-violet-50 rounded-2xl p-4 border border-violet-100">
              <p style={{ fontSize: studentFontSize + 'px' }} className="text-gray-700 font-bold leading-snug">Halo, selamat belajar IPAS! 🌱</p>
              <p style={{ fontSize: (studentFontSize - 4) + 'px' }} className="text-gray-400 mt-1">Ukuran sekarang: {studentFontSize}px</p>
            </div>
          </div>

          {/* Logout */}
          <button onClick={handleLogout}
            className="w-full bg-red-50 text-red-600 border border-red-200 font-bold py-4 rounded-2xl active:scale-95 transition-transform shadow-sm flex items-center justify-center gap-2">
            Keluar Akun
          </button>
          <div className="h-4" />
        </div>
        <StudentBottomNav />
      </div>
    );
  }

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
      <div className="h-full bg-[#FFFBEB] flex flex-col overflow-hidden" style={{ zoom: studentZoom }}>
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
