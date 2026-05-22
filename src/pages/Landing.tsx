import React, { useEffect } from 'react';
import { useStore } from '../store/useStore';
import type { TabType } from '../store/useStore';
import mascotHero from '../assets/mascot_hero.png';
import mascotSeminar from '../assets/mascot_seminar.png';
import mascotWorkshop from '../assets/mascot_workshop.png';
import mascotTalkshow from '../assets/mascot_talkshow.png';
import ipmLogo from '../assets/ipm_logo.png';




export const Landing: React.FC = () => {
  const {
    events,
    speakers,
    fetchEvents,
    fetchCategories,
    fetchSpeakers,
    fetchPengurus,
    pengurus,
    setView,
    landingTab,
    setLandingTab
  } = useStore();

  useEffect(() => {
    fetchEvents();
    fetchCategories();
    fetchSpeakers();
    fetchPengurus();
  }, [fetchEvents, fetchCategories, fetchSpeakers, fetchPengurus]);

  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'beranda', label: 'Beranda',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    },
    {
      id: 'competition', label: 'Competition',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
    },
    {
      id: 'seminar', label: 'Seminar',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    },
    {
      id: 'workshop', label: 'Workshop',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
    },
    {
      id: 'talkshow', label: 'Talkshow',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
    },
  ];

  const scrollToJadwal = () => {
    if (landingTab !== 'beranda') {
      setLandingTab('beranda');
      setTimeout(() => {
        const el = document.getElementById('jadwal-section');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById('jadwal-section');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="landing-page">

      {/* ═══ NAVBAR ═══ */}
      <header className="landing-navbar">
        <div className="landing-navbar-inner">
          <div className="landing-logo" style={{ cursor: 'pointer' }} onClick={() => setLandingTab('beranda')}>
            <img src={ipmLogo} alt="IPM Logo" className="landing-logo-img" />
            <span className="landing-logo-text">Membangun Karakter Pelajar<br/>Berkemajuan</span>
          </div>

          <nav className="landing-nav">
            {navItems.map((item) => (
              <button
                key={item.id}
                className={`landing-nav-link${landingTab === item.id ? ' active' : ''}`}
                onClick={() => setLandingTab(item.id)}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
            <button className="landing-login-btn" onClick={() => setView('login')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
              Login
            </button>
          </nav>
        </div>
      </header>

      {/* ═══ CONTENT AREA ═══ */}
      <div className="landing-content" key={landingTab}>

        {/* ── BERANDA ── */}
        {landingTab === 'beranda' && (
          <div>
            {/* Hero Section */}
            <section className="landing-hero">
              <div className="landing-hero-inner">
                <div className="landing-hero-text">
                  <h1 className="landing-hero-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', lineHeight: 1.2 }}>
                    <span style={{ display: 'block', whiteSpace: 'nowrap' }}>Pimpinan Ranting</span>
                    <span style={{ color: '#6b1839', display: 'block', whiteSpace: 'nowrap' }}>Ikatan Pelajar Muhammadiyah</span>
                  </h1>
                  <p className="landing-hero-desc" style={{ marginBottom: 12, textAlign: 'justify' }}>
                    Ikatan Pelajar Muhammadiyah merupakan organisasi otonom Muhammadiyah yang bergerak dalam bidang kaderisasi pelajar, dakwah Islam, pendidikan, serta pengembangan sosial kemasyarakatan. PR IPM Desa Pesantunan hadir sebagai sarana pembinaan generasi muda yang berorientasi pada pembentukan karakter Islami, penguatan intelektualitas, serta pengembangan kapasitas kepemimpinan yang progresif dan berkemajuan.
                  </p>
                  <p className="landing-hero-desc" style={{ textAlign: 'justify' }}>
                    Melalui pelaksanaan program kerja yang edukatif, religius, dan partisipatif, PR IPM Desa Pesantunan berkomitmen menciptakan lingkungan pembelajaran yang mampu mendorong lahirnya pelajar berakhlakul karimah, memiliki wawasan keilmuan yang luas, adaptif terhadap perkembangan teknologi dan sosial, serta memiliki kepedulian tinggi terhadap nilai-nilai kemanusiaan dan pemberdayaan masyarakat. Dengan semangat dakwah dan kolaborasi, organisasi ini diharapkan mampu menjadi motor penggerak terciptanya generasi pelajar Muhammadiyah yang unggul, berintegritas, dan berkontribusi aktif dalam pembangunan peradaban bangsa.
                  </p>
                  <p style={{ fontSize: 'clamp(0.9rem, 2vw, 1.05rem)', color: '#6b1839', marginTop: 16, marginBottom: 24, fontWeight: 700 }}>
                    Desa Pesantunan • Kecamatan Wanasari • Kabupaten Brebes • Jawa Tengah
                  </p>
                  <div className="landing-hero-buttons">
                    <button className="btn-info" onClick={() => setLandingTab('competition')}>
                      TENTANG KAMI
                    </button>
                    <button className="btn-contact" onClick={() => setView('login')}>
                      LAYANAN INFORMASI
                    </button>
                  </div>
                </div>
                <div className="landing-hero-mascot">
                  <img src={mascotHero} alt="IPM Mascot" />
                </div>
              </div>
            </section>

            {/* Pembicara / Narasumber dari Dashboard */}
            {speakers.length > 0 && (
              <section style={{ padding: '60px 40px', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Pembicara & Narasumber</h2>
                <p style={{ textAlign: 'center', color: '#8a8aaa', marginBottom: 40, fontSize: '0.95rem' }}>Para narasumber yang mengisi kegiatan IPM Pesantunan</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 20, maxWidth: 900, margin: '0 auto' }}>
                  {speakers.map((sp) => (
                    <div key={sp.id} style={{ background: '#f8f4f6', borderRadius: 14, padding: '0 24px 24px', border: '1px solid rgba(107,24,57,0.08)', textAlign: 'center', marginTop: 85 }}>
                      {sp.photoUrl ? (
                        <img src={sp.photoUrl} alt={sp.name} style={{ width: 170, height: 170, borderRadius: '50%', objectFit: 'cover', border: '4px solid #6b1839', margin: '-85px auto 16px', display: 'block' }} />
                      ) : (
                        <div style={{ width: 170, height: 170, borderRadius: '50%', background: 'linear-gradient(135deg, #6b1839, #8b2050)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '-85px auto 16px', color: '#fff', fontWeight: 700, fontSize: '2.6rem', border: '4px solid #6b1839' }}>
                          {sp.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1a1a2e', margin: '0 0 4px' }}>{sp.name}</h3>
                      <p style={{ fontSize: '0.82rem', color: '#6b1839', margin: '0 0 8px', fontWeight: 500 }}>{sp.email}</p>
                      <p style={{ fontSize: '0.85rem', color: '#5a5a7a', lineHeight: 1.5, margin: 0 }}>{sp.biodata.length > 100 ? sp.biodata.substring(0, 100) + '...' : sp.biodata}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Jadwal Event / Seminar dari Dashboard */}
            <section id="jadwal-section" style={{ padding: '60px 40px', background: '#fafafa' }}>
              <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Jadwal Kegiatan & Seminar</h2>
              <p style={{ textAlign: 'center', color: '#8a8aaa', marginBottom: 40, fontSize: '0.95rem' }}>Daftar kegiatan yang akan diselenggarakan oleh PR IPM Desa Pesantunan</p>

              <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {events.length > 0 ? (
                  events.map((evt) => (
                    <div key={evt.id} style={{ background: '#fff', borderRadius: 14, padding: '24px 28px', border: '1px solid rgba(107,24,57,0.08)', display: 'flex', gap: 24, alignItems: 'flex-start', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      {/* Date Badge */}
                      <div style={{ minWidth: 70, textAlign: 'center', background: 'linear-gradient(135deg, #6b1839, #8b2050)', borderRadius: 12, padding: '12px 8px', color: '#fff', flexShrink: 0 }}>
                        <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>Jadwal</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, lineHeight: 1.2, marginTop: 4 }}>{evt.date ? evt.date.split(' ').slice(0, 2).join(' ') : '—'}</div>
                      </div>
                      {/* Content */}
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#1a1a2e', margin: 0 }}>{evt.title}</h3>
                          <span style={{ background: 'rgba(107,24,57,0.1)', color: '#6b1839', fontSize: '0.72rem', fontWeight: 600, padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase' }}>{evt.category?.name || 'Umum'}</span>
                        </div>
                        <p style={{ color: '#5a5a7a', fontSize: '0.9rem', margin: '0 0 10px', lineHeight: 1.6 }}>{evt.description}</p>
                        <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', fontSize: '0.85rem', color: '#8a8aaa' }}>
                          <span>📍 {evt.location}</span>
                          <span>🗓️ {evt.date}</span>
                          <span>👤 {evt.pembicara?.name || '-'}</span>
                          <span>💺 {evt.maxParticipants} Kursi</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 14, border: '1px solid rgba(107,24,57,0.08)' }}>
                    <p style={{ color: '#8a8aaa', fontSize: '1rem', margin: 0 }}>Belum ada jadwal kegiatan yang ditambahkan.</p>
                  </div>
                )}
              </div>
            </section>


            {/* Visi & Misi */}
            <section style={{ padding: '60px 40px', background: '#fff' }}>
              <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Visi & Misi</h2>
              <p style={{ textAlign: 'center', color: '#8a8aaa', marginBottom: 40, fontSize: '0.95rem' }}>Arah dan tujuan organisasi kami dalam membangun pelajar berkemajuan</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30, maxWidth: 900, margin: '0 auto' }}>
                <div style={{ background: 'linear-gradient(135deg, #6b1839, #8b2050)', borderRadius: 16, padding: 32, color: '#fff' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: 12 }}>🎯 Visi</h3>
                  <p style={{ fontSize: '0.95rem', lineHeight: 1.7, opacity: 0.95 }}>
                    Terbentuknya pelajar muslim yang berilmu, berakhlak mulia, 
                    dan terampil dalam rangka menegakkan dan menjunjung tinggi 
                    nilai-nilai ajaran Islam sehingga terwujud masyarakat Islam 
                    yang sebenar-benarnya.
                  </p>
                </div>
                <div style={{ background: '#f8f4f6', borderRadius: 16, padding: 32, border: '2px solid rgba(107,24,57,0.1)' }}>
                  <h3 style={{ fontSize: '1.3rem', marginBottom: 12, color: '#6b1839' }}>📋 Misi</h3>
                  <ul style={{ fontSize: '0.9rem', lineHeight: 1.8, color: '#444', paddingLeft: 18, margin: 0 }}>
                    <li>Menguatkan aqidah dan ibadah pelajar</li>
                    <li>Meningkatkan prestasi akademik dan non-akademik</li>
                    <li>Mengembangkan kepemimpinan dan organisasi</li>
                    <li>Mempererat ukhuwah islamiyah antar pelajar</li>
                    <li>Mengkader pelajar yang siap berdakwah</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Program Unggulan */}
            <section style={{ padding: '60px 40px', background: '#fafafa' }}>
              <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Program Unggulan</h2>
              <p style={{ textAlign: 'center', color: '#8a8aaa', marginBottom: 40, fontSize: '0.95rem' }}>Kegiatan rutin dan unggulan PR IPM Desa Pesantunan</p>

              <div className="landing-cards-grid">
                <div className="landing-event-card">
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>📖</div>
                  <h3 className="landing-card-title">Kajian Rutin</h3>
                  <p className="landing-card-desc">
                    Kajian keislaman rutin setiap pekan membahas aqidah, fiqih, 
                    akhlak, dan sirah untuk mempertebal keimanan dan pengetahuan agama pelajar.
                  </p>
                </div>

                <div className="landing-event-card">
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🏆</div>
                  <h3 className="landing-card-title">Lomba & Kompetisi</h3>
                  <p className="landing-card-desc">
                    Mengadakan dan mengikuti berbagai perlombaan akademik maupun non-akademik 
                    seperti Cerdas Cermat, Pidato, MTQ, dan Olympiade.
                  </p>
                </div>

                <div className="landing-event-card">
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🤝</div>
                  <h3 className="landing-card-title">Bakti Sosial</h3>
                  <p className="landing-card-desc">
                    Kegiatan sosial kemasyarakatan seperti bersih desa, santunan anak yatim, 
                    dan penggalangan dana untuk membantu sesama.
                  </p>
                </div>

                <div className="landing-event-card">
                  <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎓</div>
                  <h3 className="landing-card-title">Pelatihan Kader</h3>
                  <p className="landing-card-desc">
                    Program pengkaderan pelajar melalui Darul Arqam, LKTM, dan pelatihan 
                    kepemimpinan untuk mencetak kader militan Muhammadiyah.
                  </p>
                </div>
              </div>
            </section>



            {/* Struktur Organisasi */}
            {pengurus.length > 0 && (
              <section style={{ padding: '60px 40px', background: '#fff' }}>
                <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 8 }}>Jajaran Pengurus PR IPM Desa Pesantunan</h2>
                <p style={{ textAlign: 'center', color: '#8a8aaa', marginBottom: 40, fontSize: '0.95rem' }}>Periode Kepengurusan Saat Ini</p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, maxWidth: 700, margin: '0 auto' }}>
                  {pengurus.map((item) => (
                    <div key={item.id} style={{ textAlign: 'center', padding: 20, borderRadius: 12, background: '#f8f4f6', border: '1px solid rgba(107,24,57,0.08)' }}>
                      {item.photoUrl ? (
                        <img 
                          src={item.photoUrl} 
                          alt={item.nama} 
                          style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 10px', display: 'block', border: '2px solid #6b1839' }} 
                        />
                      ) : (
                        <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #6b1839, #8b2050)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#fff', fontWeight: 600, fontSize: '1rem' }}>
                          {item.nama.split(' ').map(n => n[0]).join('').substring(0,2)}
                        </div>
                      )}
                      <div style={{ fontWeight: 600, color: '#1a1a2e', fontSize: '0.95rem' }}>{item.nama}</div>
                      <div style={{ color: '#6b1839', fontSize: '0.8rem', fontWeight: 500, marginTop: 4 }}>{item.jabatan}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}





            {/* Media Partner ORTOM Muhammadiyah */}
            <section style={{ padding: '60px 40px', background: '#f5f5f5' }}>
              <h2 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#1a1a2e', marginBottom: 4 }}>
                Media Partner <span style={{ color: '#6b1839' }}>ORTOM Muhammadiyah</span>
              </h2>
              <div style={{ width: 50, height: 3, background: '#6b1839', margin: '8px auto 40px', borderRadius: 2 }} />

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, justifyContent: 'center', maxWidth: 950, margin: '0 auto' }}>
                {[
                  { nama: 'Muhammadiyah', logo: '/user_logos/muhammadiyah.jpg' },
                  { nama: 'Aisyiyah', logo: '/user_logos/aisyiyah.jpg' },
                  { nama: 'Pemuda Muhammadiyah', logo: '/user_logos/pemuda.png' },
                  { nama: 'Nasyiatul Aisyiyah', logo: '/user_logos/nasyiatul.jpg' },
                  { nama: 'IPM', logo: '/user_logos/ipm.png' },
                  { nama: 'IMM', logo: '/user_logos/imm.png' },
                  { nama: 'Tapak Suci', logo: '/user_logos/tapak_suci.png' },
                  { nama: 'Kokam', logo: '/user_logos/kokam.png' },
                  { nama: 'Lazismu', logo: '/user_logos/lazismu.png' },
                ].map((item, i) => (
                  <div key={i} style={{ 
                    background: '#fff', borderRadius: 14, padding: '18px 12px', 
                    width: 110, textAlign: 'center',
                    border: '1px solid rgba(0,0,0,0.06)', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    cursor: 'default'
                  }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 6px 20px rgba(107,24,57,0.12)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'; }}
                  >
                    <div style={{
                      width: 56, height: 56, borderRadius: '50%',
                      margin: '0 auto 10px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: '#fff',
                      border: '2px solid rgba(0,0,0,0.03)',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.08)'
                    }}>
                      <img src={item.logo} alt={item.nama} style={{ 
                        width: '75%', height: '75%', 
                        objectFit: 'contain'
                      }} />
                    </div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3 }}>{item.nama}</div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* ── COMPETITION / TENTANG ── */}
        {landingTab === 'competition' && (
          <section className="landing-about" style={{ marginTop: 0 }}>
            <div className="landing-about-inner">
              <h2 className="landing-section-title">Tentang Membangun Karakter Pelajar Berkemajuan</h2>
              <p className="landing-about-desc">
                Membangun Karakter Pelajar Berkemajuan merupakan sebuah kegiatan edukatif dan inspiratif yang diselenggarakan oleh Pimpinan Ranting Ikatan Pelajar Muhammadiyah (PR IPM) Desa Pesantunan sebagai bentuk kontribusi nyata dalam menciptakan generasi pelajar yang unggul, berintegritas, serta mampu menghadapi tantangan perkembangan zaman. Kegiatan ini hadir sebagai wadah pengembangan diri bagi pelajar untuk meningkatkan kualitas intelektual, spiritual, sosial, dan kepemimpinan dalam kehidupan sehari-hari.
              </p>
              <p className="landing-about-desc" style={{ marginTop: '16px' }}>
                Di era digital yang terus berkembang pesat, pelajar dituntut untuk tidak hanya memiliki kemampuan akademik yang baik, tetapi juga karakter yang kuat, pola pikir kritis, kreativitas tinggi, serta kemampuan beradaptasi terhadap perubahan teknologi dan lingkungan sosial. Oleh karena itu, kegiatan ini mengangkat semangat pelajar berkemajuan yang mampu memadukan ilmu pengetahuan, teknologi, dan nilai-nilai keislaman dalam membentuk pribadi yang cerdas, disiplin, bertanggung jawab, dan bermanfaat bagi masyarakat.
              </p>
              <p className="landing-about-desc" style={{ marginTop: '16px' }}>
                Melalui rangkaian seminar, workshop, talkshow inspiratif, serta kegiatan pengembangan kompetensi lainnya, peserta akan memperoleh wawasan mengenai pentingnya kepemimpinan, literasi digital, etika bermedia sosial, inovasi teknologi, serta penguatan karakter Islami dalam kehidupan pelajar modern. Selain menjadi sarana pembelajaran, kegiatan ini juga diharapkan mampu menjadi ruang kolaborasi dan silaturahmi antar pelajar untuk saling bertukar ide, pengalaman, dan semangat dalam berkarya.
              </p>
              <p className="landing-about-desc" style={{ marginTop: '16px' }}>
                Dengan mengusung nilai Islam Berkemajuan, kegiatan ini menanamkan semangat bahwa pelajar Muhammadiyah harus mampu menjadi generasi yang tidak hanya aktif dalam bidang akademik, tetapi juga memiliki kepedulian sosial, semangat dakwah, jiwa kepemimpinan, serta kemampuan untuk menciptakan perubahan positif di lingkungan sekitar. Pelajar diharapkan dapat menjadi agen perubahan yang mampu membawa inovasi, menjaga moralitas, serta berkontribusi dalam membangun masyarakat yang lebih baik di masa depan.
              </p>
              <p className="landing-about-desc" style={{ marginTop: '16px' }}>
                Melalui kegiatan Membangun Karakter Pelajar Berkemajuan, PR IPM Desa Pesantunan berkomitmen untuk terus mendukung lahirnya generasi muda yang adaptif terhadap perkembangan teknologi, memiliki akhlak mulia, berpikiran terbuka, serta siap menjadi pelopor, pelangsung, dan penyempurna perjuangan dakwah Muhammadiyah di era modern.
              </p>

              <div className="landing-cards-grid">
                <div className="landing-event-card">
                  <h3 className="landing-card-title">Islamic Digital Innovation Seminar</h3>
                  <p className="landing-card-desc">
                    Seminar mengangkat tema “Membangun Pelajar Berkemajuan melalui Kolaborasi Teknologi Digital dan Nilai-Nilai Islami.” untuk memberikan wawasan pemanfaatan teknologi digital dan AI berlandaskan nilai keislaman.
                  </p>
                  <button className="btn-card-info" onClick={() => setLandingTab('seminar')}>
                    INFO SELENGKAPNYA
                  </button>
                </div>

                <div className="landing-event-card">
                  <h3 className="landing-card-title">Islamic Digital Talkshow</h3>
                  <p className="landing-card-desc">
                    Islamic Digital Talkshow merupakan forum inspiratif berskala nasional yang mengangkat tema pengembangan teknologi digital dan Artificial Intelligence (AI) dari sudut pandang pelajar muslim berkemajuan.
                  </p>
                  <button className="btn-card-info" onClick={() => setLandingTab('talkshow')}>
                    INFO SELENGKAPNYA
                  </button>
                </div>

                <div className="landing-event-card">
                  <h3 className="landing-card-title">IT Competition</h3>
                  <p className="landing-card-desc">
                    Kompetisi "From Creation to Innovation" mengajak 
                    generasi muda untuk mengembangkan inovasi dan 
                    kreativitas guna membentuk kelompok yang memiliki 
                    potensi luar biasa, yang mampu mewujudkan masa 
                    depan yang berkelanjutan.
                  </p>
                  <button className="btn-card-info" onClick={scrollToJadwal}>
                    INFO SELENGKAPNYA
                  </button>
                </div>

                <div className="landing-event-card">
                  <h3 className="landing-card-title">Workshop Inovasi Digital IPM</h3>
                  <p className="landing-card-desc">
                    Workshop "Inovasi Digital IPM" hadir sebagai wadah pengembangan kreativitas, kepemimpinan, dan literasi teknologi bagi pelajar Muhammadiyah di era digital.
                  </p>
                  <button className="btn-card-info" onClick={() => setLandingTab('workshop')}>
                    INFO SELENGKAPNYA
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── SEMINAR ── */}
        {landingTab === 'seminar' && (
          <section className="landing-detail-section">
            <div className="landing-detail-inner">
              <div className="landing-detail-text">
                <h2 className="landing-detail-title">Islamic Digital Innovation Seminar</h2>
                <p className="landing-detail-desc">
                  Islamic Digital Innovation Seminar mengangkat tema “Membangun Pelajar Berkemajuan melalui Kolaborasi Teknologi Digital dan Nilai-Nilai Islami.” Seminar ini bertujuan untuk memberikan wawasan kepada pelajar mengenai pentingnya pemanfaatan teknologi digital, kecerdasan buatan (AI), dan inovasi modern secara bijak, kreatif, dan berlandaskan nilai keislaman. Melalui kegiatan ini, peserta diajak memahami bagaimana teknologi dapat menjadi sarana untuk meningkatkan kualitas pendidikan, kreativitas, kepemimpinan, serta dakwah pelajar di era digital, sehingga tercipta generasi muda Islami yang adaptif, inovatif, dan berkemajuan.
                </p>
                <button className="btn-info" onClick={scrollToJadwal}>
                  INFO SELENGKAPNYA
                </button>
              </div>
              <div className="landing-detail-mascot">
                <img src={mascotSeminar} alt="Seminar Mascot" />
              </div>
            </div>
          </section>
        )}

        {/* ── WORKSHOP ── */}
        {landingTab === 'workshop' && (
          <section className="landing-detail-section">
            <div className="landing-detail-inner">
              <div className="landing-detail-text">
                <h2 className="landing-detail-title">Workshop Inovasi Digital IPM</h2>
                <p className="landing-detail-desc">
                  Workshop “Inovasi Digital IPM” hadir sebagai wadah pengembangan kreativitas, kepemimpinan, dan literasi teknologi bagi pelajar Muhammadiyah di era digital. Kegiatan ini bertujuan membekali peserta dengan wawasan serta keterampilan digital untuk menciptakan inovasi yang bermanfaat, inspiratif, dan berdampak positif bagi lingkungan sekolah, organisasi, maupun masyarakat. Melalui workshop ini, pelajar diharapkan mampu menjadi generasi berkemajuan yang adaptif, kreatif, dan siap menghadapi tantangan teknologi masa depan.
                </p>
                <button className="btn-info" onClick={scrollToJadwal}>
                  INFO SELENGKAPNYA
                </button>
              </div>
              <div className="landing-detail-mascot">
                <img src={mascotWorkshop} alt="Workshop Mascot" />
              </div>
            </div>
          </section>
        )}

        {/* ── TALKSHOW ── */}
        {landingTab === 'talkshow' && (
          <section className="landing-detail-section landing-detail-pink">
            <div className="landing-detail-inner">
              <div className="landing-detail-mascot">
                <img src={mascotTalkshow} alt="Talkshow Mascot" />
              </div>
              <div className="landing-detail-text">
                <h2 className="landing-detail-title">Islamic Digital Talkshow</h2>
                <p className="landing-detail-desc">
                  Islamic Digital Talkshow merupakan forum inspiratif berskala nasional yang mengangkat tema pengembangan teknologi digital dan Artificial Intelligence (AI) dari sudut pandang pelajar muslim berkemajuan. Kegiatan ini dirancang untuk membahas bagaimana teknologi dapat dimanfaatkan secara bijak, kreatif, dan beretika sesuai dengan nilai-nilai Islam dan kemanusiaan. Melalui talkshow ini, peserta akan diajak memahami bahwa teknologi bukan hanya alat modernisasi, tetapi juga sarana dakwah, pendidikan, inovasi, dan pengembangan potensi generasi muda. Bersama para narasumber inspiratif, acara ini akan mengupas peran pelajar dalam menghadapi era digital, membangun kreativitas, meningkatkan literasi teknologi, serta menciptakan kolaborasi positif antara manusia dan AI demi masa depan yang lebih cerdas, humanis, dan berkemajuan. Islamic Digital Talkshow hadir sebagai wadah untuk meningkatkan wawasan, memperluas relasi, dan menginspirasi generasi pelajar agar siap menjadi pemimpin masa depan yang islami, adaptif, dan inovatif di tengah perkembangan teknologi global.
                </p>
                <button className="btn-info" onClick={scrollToJadwal}>
                  INFO SELENGKAPNYA
                </button>
              </div>
            </div>
          </section>
        )}

      </div>

      {/* ═══ FOOTER ═══ */}
      <footer className="landing-footer">
        <div className="landing-footer-inner landing-footer-grid">
          {/* Column 1: Logo & Branding */}
          <div className="landing-footer-col">
            <div className="landing-footer-logo">
              <img src={ipmLogo} alt="IPM Logo" style={{ height: 50 }} />
              <span className="landing-logo-text" style={{ color: '#1a1a2e' }}>Membangun Karakter Pelajar<br/>Berkemajuan</span>
            </div>
            <p className="landing-footer-brand-desc">
              IPM FEST 2026 — Festival Pelajar Islami dan Berkemajuan. Diselenggarakan oleh PR IPM Desa Pesantunan.
            </p>
          </div>

          {/* Column 2: Menu Navigasi */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">MENU NAVIGASI</h4>
            <ul className="landing-footer-links">
              <li>
                <button onClick={() => setLandingTab('beranda')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => setLandingTab('seminar')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                  Seminar
                </button>
              </li>
              <li>
                <button onClick={() => setLandingTab('competition')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                  Competition
                </button>
              </li>
              <li>
                <button onClick={() => setLandingTab('workshop')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                  Workshop
                </button>
              </li>
              <li>
                <button onClick={() => setLandingTab('talkshow')}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  Talkshow
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Ikuti Kami */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">IKUTI KAMI</h4>
            <ul className="landing-footer-links">
              <li>
                <a href="https://www.instagram.com/pripm_pesantunan?igsh=MWVsdTA2bnFjc2xhYw" target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                  Instagram
                </a>
              </li>
              <li>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z"/><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"/></svg>
                  Youtube
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Alamat & Maps */}
          <div className="landing-footer-col">
            <h4 className="landing-footer-heading">ALAMAT</h4>
            <p className="landing-footer-address">
              MI Muhammadiyah Pesantunan<br/>
              Jl. Imam Bonjol No. 12, RT.05 RW.06<br/>
              Desa Pesantunan, Kec. Wanasari<br/>
              Kab. Brebes, Jawa Tengah
            </p>
            <div className="landing-footer-map">
              <iframe
                title="Lokasi MI Muhammadiyah Pesantunan"
                src="https://maps.google.com/maps?q=MI%20Muhammadiyah%20Pesantunan,%20Wanasari,%20Brebes&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="140"
                style={{ border: 0, borderRadius: 8 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="landing-footer-bottom">
          <p className="landing-footer-text">
            © 2026 Pimpinan Ranting Ikatan Pelajar Muhammadiyah Desa Pesantunan. Organisasi Pelajar Islam Berkemajuan.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
