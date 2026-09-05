const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
code = code.replace(
`      <TeacherBottomNav />
    </div>
  );

  // ── 3. UPLOAD MATERI ───────────────────────────────────────────────────────`,
`      <TeacherBottomNav />
    </div>
    );
  }

  // ── 3. UPLOAD MATERI ───────────────────────────────────────────────────────`
);
fs.writeFileSync('src/App.tsx', code);
