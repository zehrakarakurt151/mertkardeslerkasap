(function () {
  'use strict';

  /* Always start page loads from the top */
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual';
  }
  window.scrollTo(0, 0);
  window.addEventListener('pageshow', function () {
    window.setTimeout(function () {
      window.scrollTo(0, 0);
    }, 0);
  });

  /* Opening logo animation */
  const siteIntro = document.getElementById('site-intro');
  if (siteIntro) {
    const introReduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const introDuration = introReduceMotion ? 450 : 5000;

    window.setTimeout(function () {
      siteIntro.classList.add('is-leaving');
      document.body.classList.remove('intro-active');

      window.setTimeout(function () {
        siteIntro.remove();
      }, introReduceMotion ? 50 : 800);
    }, introDuration);
  }

  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const yearEl = document.getElementById('year');
  const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  const sections = document.querySelectorAll('main section[id]');

  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  /* Sticky header state */
  function updateHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 24);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Mobile menu */
  function setMenuOpen(open) {
    if (!mobileMenu || !menuToggle) return;
    mobileMenu.hidden = !open;
    mobileMenu.classList.toggle('hidden', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  }

  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
      setMenuOpen(!isOpen);
    });

    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setMenuOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setMenuOpen(false);
    });
  }

  /* Active nav highlighting */
  function updateActiveNav() {
    const scrollPos = window.scrollY + 120;
    let current = '';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollPos) {
        current = section.getAttribute('id') || '';
      }
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      const href = link.getAttribute('href') || '';
      link.classList.toggle('is-active', href === '#' + current);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* Smooth scroll offset for sticky header */
  navLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || !href.startsWith('#')) return;
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;

      window.scrollTo({ top: top, behavior: 'smooth' });
      history.pushState(null, '', href);
    });
  });

  /* Hero background slideshow — text stays fixed */
  const slides = document.querySelectorAll('.hero-slide');
  const dotsWrap = document.querySelector('.hero-dots');
  const prevBtn = document.querySelector('.hero-arrow--prev');
  const nextBtn = document.querySelector('.hero-arrow--next');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let slideIndex = 0;
  let slideTimer = null;

  function goToSlide(index) {
    if (!slides.length) return;
    slideIndex = (index + slides.length) % slides.length;

    slides.forEach(function (slide, i) {
      slide.classList.toggle('is-active', i === slideIndex);
    });

    if (dotsWrap) {
      dotsWrap.querySelectorAll('.hero-dot').forEach(function (dot, i) {
        const active = i === slideIndex;
        dot.classList.toggle('is-active', active);
        dot.setAttribute('aria-selected', String(active));
      });
    }
  }

  function nextSlide() {
    goToSlide(slideIndex + 1);
  }

  function prevSlide() {
    goToSlide(slideIndex - 1);
  }

  function startSlideshow() {
    if (reduceMotion || slides.length < 2) return;
    stopSlideshow();
    slideTimer = window.setInterval(nextSlide, 4000);
  }

  function stopSlideshow() {
    if (slideTimer) {
      window.clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function onManualNav(fn) {
    fn();
    startSlideshow();
  }

  if (slides.length) {
    if (dotsWrap) {
      slides.forEach(function (_, i) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-label', 'Slayt ' + (i + 1));
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.addEventListener('click', function () {
          onManualNav(function () {
            goToSlide(i);
          });
        });
        dotsWrap.appendChild(btn);
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        onManualNav(prevSlide);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        onManualNav(nextSlide);
      });
    }

    startSlideshow();

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stopSlideshow();
      else startSlideshow();
    });
  }

  /* Product catalog — expand + 3D flip cards */
  const catalog = {
    dana: {
      title: 'Dana',
      items: [
        {
          name: 'Dana Karkas',
          info: 'Ustalarımız tarafından özenle hazırlanan bütün dana karkas.',
          img: 'resim/danakarkas.png',
          prep: 'Kesime göre',
          cook: 'Seçilen parçaya göre',
          tip: 'İhtiyacınıza uygun parçalama ve porsiyonlama için ustamıza danışın.',
        },
        {
          name: 'Dana Kıyma',
          info: 'Yağ oranı dengeli, köfte ve yemeklik.',
          img: 'resim/danakıyma.png',
          prep: '10 dk',
          cook: 'Orta ateş, 8–12 dk',
          tip: 'Köfte için az yağlı kıyma tercih edin; yoğururken bastırmayın.',
        },
        {
          name: 'Dana Kuşbaşı',
          info: 'Güveç, yahni ve sote için uygun.',
          img: 'resim/danakuşbaşı.png',
          prep: '15 dk',
          cook: 'Kısık ateş, 45–60 dk',
          tip: 'Önce mühürleyin, sonra soğanla kısık ateşte yumuşayana dek pişirin.',
        },
        {
          name: 'Dana Bonfile',
          info: 'Yumuşak doku, özel günler için.',
          img: 'resim/danabonfile.png',
          prep: '5 dk',
          cook: 'Yüksek ateş, 3–4 dk / yüz',
          tip: 'Oda sıcaklığında dinlendirin; pişirdikten sonra 5 dk dinlendirin.',
        },
        {
          name: 'Antrikot',
          info: 'Mermer damarlı, ızgara için ideal.',
          img: 'resim/danaantrikot.png',
          prep: '5 dk',
          cook: 'Izgara 200–220°C, 4–6 dk / yüz',
          tip: 'Kalın tuz ve karabiber yeter; fazla sos lezzeti bastırır.',
        },
        {
          name: 'Kontrfile',
          info: 'Steak ve dilim biftek için.',
          img: 'resim/danakontrfile.png',
          prep: '8 dk',
          cook: 'Orta-yüksek ateş, 5 dk / yüz',
          tip: 'Dilimlemeden önce 5–7 dk dinlendirin; suyu içinde kalsın.',
        },
        {
          name: 'Ribs',
          info: 'Haşlama ve fırın yemekleri için.',
          img: 'resim/danakaburga.png',
          prep: '20 dk',
          cook: 'Fırın 160°C, 2–2,5 saat',
          tip: 'Düşük ısıda uzun pişirin; yumuşak ve sulu olur.',
        },
        {
          name: 'Dana Dallas',
          info: 'Izgara ve özel steak servisi için seçilmiş dallas.',
          img: 'resim/danadallas.png',
          prep: '5 dk',
          cook: 'Izgara 200–220°C, 4–6 dk / yüz',
          tip: 'Oda sıcaklığında dinlendirin; yüksek ateşte mühürleyip orta bırakın.',
        },
        {
          name: 'Dana T Bone',
          info: 'Kemikli, lezzetli ve ızgara için ideal T bone.',
          img: 'resim/danatbone.png',
          prep: '5 dk',
          cook: 'Izgara 210–230°C, 4–6 dk / yüz',
          tip: 'Her iki yüzü eşit mühürleyin; pişirdikten sonra 5 dk dinlendirin.',
        },
      ],
    },
    kuzu: {
      title: 'Kuzu',
      items: [
        {
          name: 'Kuzu Karkas',
          info: 'Günlük ve özenli kesimle hazırlanan bütün kuzu karkas.',
          img: 'resim/kuzukarkasfoto.png',
          prep: 'Kesime göre',
          cook: 'Seçilen parçaya göre',
          tip: 'Fırın, ızgara veya yemeklik kullanımınıza göre özel parçalama isteyin.',
        },
        {
          name: 'Kuyruk Yağı',
          info: 'Yemek ve kebaplara lezzet veren doğal kuzu kuyruk yağı.',
          img: 'resim/kuyrukyağı.png',
          prep: '5 dk',
          cook: 'Kullanıma göre, 5–10 dk',
          tip: 'Kebap harcına küçük küpler hâlinde ve ölçülü ekleyerek dengeli bir lezzet elde edin.',
        },
        {
          name: 'Kuzu Pirzola',
          info: 'Izgara için seçilmiş premium pirzola.',
          img: 'resim/kuzupirzola.png',
          prep: '5 dk',
          cook: 'Izgara, 3–4 dk / yüz',
          tip: 'İnce tutun; fazla pişirmeyin, pembe kalması lezzetini korur.',
        },
        {
          name: 'Kuzu But',
          info: 'Fırın ve haşlama için kemikli but.',
          img: 'resim/kuzubut.png',
          prep: '25 dk',
          cook: 'Fırın 170°C, 1,5–2 saat',
          tip: 'Sarımsak ve biberiye ile marine edip yağlı kâğıtta pişirin.',
        },
        {
          name: 'Kuzu Kuşbaşı',
          info: 'Güveç ve sote için uygun.',
          img: 'resim/kuzukuşbaşı.png',
          prep: '15 dk',
          cook: 'Kısık ateş, 50–70 dk',
          tip: 'Önce mühürleyin; soğan ve baharatla yavaş pişirin.',
        },
        {
          name: 'Kuzu Kıyma',
          info: 'Köfte ve yemeklik kuzu kıyma.',
          img: 'resim/kuzukıyma.png',
          prep: '10 dk',
          cook: 'Orta ateş, 10–15 dk',
          tip: 'Kuzu kıymada baharatı dengeli tutun; fazla yağ eklemeyin.',
        },
        {
          name: 'Kuzu Kaburga',
          info: 'Haşlama ve fırın yemekleri için kemikli kaburga.',
          img: 'resim/kuzukaburga.png',
          prep: '20 dk',
          cook: 'Fırın 160°C, 2–2,5 saat',
          tip: 'Düşük ısıda uzun pişirin; yumuşak ve sulu olur.',
        },
        {
          name: 'Kuzu Külbastı',
          info: 'Izgara için özel dilimlenmiş kuzu külbastı.',
          img: 'resim/kuzukülbastı.png',
          prep: '10 dk',
          cook: 'Izgara orta ateş, 3–4 dk / yüz',
          tip: 'İnce tutun; fazla pişirmeden pembe bırakın.',
        },
        {
          name: 'Kuzu Lokum',
          info: 'Yumuşak dokulu, ızgara ve sote için seçilmiş lokum.',
          img: 'resim/kuzulokum.png',
          prep: '5 dk',
          cook: 'Yüksek ateş, 2–3 dk / yüz',
          tip: 'Kısa sürede mühürleyin; fazla çevirmeyin.',
        },
        {
          name: 'Kuzu Kol',
          info: 'Fırın ve haşlama için kemikli kuzu kol.',
          img: 'resim/kuzukol.png',
          prep: '25 dk',
          cook: 'Fırın 170°C, 1,5–2 saat',
          tip: 'Sarımsak ve baharatla marine edip yağlı kâğıtta pişirin.',
        },
        {
          name: 'Kuzu Gerdan',
          info: 'Güveç ve uzun pişirme için lezzetli gerdan.',
          img: 'resim/kuzugerdan.png',
          prep: '20 dk',
          cook: 'Kısık ateş, 2–2,5 saat',
          tip: 'Soğanla birlikte yavaş pişirin; eti kemikten ayrılana dek tutun.',
        },
      ],
    },
    spesiyel: {
      title: 'Spesiyel Ürünler',
      items: [
        {
          name: 'Adana',
          info: 'Mangal için özel harman Adana kebap kıyması.',
          img: 'resim/adana.png',
          prep: '15 dk',
          cook: 'Mangal orta ateş, 8–12 dk',
          tip: 'Şişe sıkı basmayın; eşit pişmesi için çevirerek pişirin.',
        },
        {
          name: 'Urfa',
          info: 'Acısız, dengeli baharatlı geleneksel Urfa kebap harcı.',
          img: 'resim/urfa.png',
          prep: '15 dk',
          cook: 'Mangal orta ateş, 8–12 dk',
          tip: 'Şişe eşit kalınlıkta yayın; köz ateşinde sık çevirerek sulu kalmasını sağlayın.',
        },
        {
          name: 'Ciğer Şiş',
          info: 'Mangal ve ızgara için özel doğranmış ciğer şiş.',
          img: 'resim/ciğerşiş.png',
          prep: '15 dk',
          cook: 'Yüksek ateş, 3–5 dk',
          tip: 'İnce dilimleyin; fazla pişirmeden soğanla servis edin.',
        },
        {
          name: 'Et Şiş',
          info: 'Izgara için marine edilmiş özel et şiş.',
          img: 'resim/etşiş.png',
          prep: '20 dk',
          cook: 'Izgara orta ateş, 8–12 dk',
          tip: 'Şişe eşit aralıklarla dizin; çevirerek dengeli pişirin.',
        },
        {
          name: 'Dana Pirzola',
          info: 'Izgara ve tavada özel seçilmiş dana pirzola.',
          img: 'resim/danapirzola.png',
          prep: '5 dk',
          cook: 'Izgara 200–220°C, 4–6 dk / yüz',
          tip: 'Oda sıcaklığında dinlendirin; tuz ve karabiberle sade tutun.',
        },
      ],
    },
    tavuk: {
      title: 'Tavuk',
      items: [
        {
          name: 'Bütün Tavuk',
          info: 'Fırın ve haşlama için bütün tavuk.',
          img: 'resim/bütüntavuk.png',
          prep: '20 dk',
          cook: 'Fırın 180°C, 70–90 dk',
          tip: 'İçi 75°C olana kadar pişirin; son 15 dk yüksek ateşle kızartın.',
        },
        {
          name: 'Tavuk Göğsü',
          info: 'Kemiksiz, ızgara ve diyet yemekleri için.',
          img: 'resim/tavukgöğsü.png',
          prep: '10 dk',
          cook: 'Orta ateş, 6–8 dk / yüz',
          tip: 'İnce dilimleyin; kurumasın diye kısa pişirin.',
        },
        {
          name: 'Tavuk Baget',
          info: 'Fırın ve haşlama için baget.',
          img: 'resim/tavukbaget.png',
          prep: '10 dk',
          cook: 'Fırın 190°C, 35–45 dk',
          tip: 'Baharatı cilde iyice yedirin; kızarana dek pişirin.',
        },
        {
          name: 'Tavuk Kanat',
          info: 'Izgara ve fritöz için kanat.',
          img: 'resim/tavukkanat.png',
          prep: '15 dk',
          cook: 'Fırın / ızgara 200°C, 25–35 dk',
          tip: 'Marine sonrası oda sıcaklığında 10 dk bekletin.',
        },
        {
          name: 'Tavuk But',
          info: 'Kemikli but, zengin lezzet.',
          img: 'resim/tavukbut.png',
          prep: '10 dk',
          cook: 'Fırın 185°C, 40–50 dk',
          tip: 'Derili pişirin; deri çıtır, içi sulu kalır.',
        },
      ],
    },
    sakatat: {
      title: 'Sakatat',
      items: [
        {
          name: 'Dana Ciğer',
          info: 'Izgara ve sote için taze dana ciğeri.',
          img: 'resim/danaciğer.png',
          prep: '10 dk',
          cook: 'Yüksek ateş, 2–3 dk / yüz',
          tip: 'İnce dilimleyin; fazla pişirmeyin, yumuşak kalsın.',
        },
        {
          name: 'Kuzu Ciğer',
          info: 'Arnavut ciğeri ve ızgara için kuzu ciğeri.',
          img: 'resim/kuzuciğer.png',
          prep: '15 dk',
          cook: 'Yüksek ateş, 3–4 dk',
          tip: 'Unlayıp hızla kızartın; soğanla servis edin.',
        },
        {
          name: 'Kelle',
          info: 'Çorba ve geleneksel fırın tarifleri için temizlenmiş kuzu kelle.',
          img: 'resim/kelle.png',
          prep: '30 dk',
          cook: 'Kısık ateş, 2–3 saat',
          tip: 'İyice temizleyip uzun süre kısık ateşte pişirin; suyunu çorba için değerlendirin.',
        },
        {
          name: 'Yürek',
          info: 'Haşlama ve ızgara için taze yürek.',
          img: 'resim/yürek.png',
          prep: '20 dk',
          cook: 'Kısık ateş, 40–50 dk',
          tip: 'Önce haşlayıp sonra ızgarada mühürleyin.',
        },
        {
          name: 'Kuzu Yürek',
          info: 'Haşlama, ızgara ve sote için taze kuzu yüreği.',
          img: 'resim/kuzuyürek.png',
          prep: '20 dk',
          cook: 'Kısık ateş, 40–50 dk',
          tip: 'İyice temizleyip önce haşlayın; sonra ızgarada mühürleyin.',
        },
        {
          name: 'Böbrek',
          info: 'Geleneksel yemekler için taze böbrek.',
          img: 'resim/böbrek.png',
          prep: '25 dk',
          cook: 'Orta ateş, 15–20 dk',
          tip: 'Süte yatırıp kokuyu alın; sonra soteleyin.',
        },
        {
          name: 'Dil',
          info: 'Haşlama ve soğuk mezeler için dil.',
          img: 'resim/dil.png',
          prep: '15 dk',
          cook: 'Kısık ateş, 1,5–2 saat',
          tip: 'Haşladıktan sonra derisini soyup dilimleyin.',
        },
        {
          name: 'İşkembe',
          info: 'Çorba ve geleneksel tarifler için işkembe.',
          img: 'resim/işkembe.png',
          prep: '30 dk',
          cook: 'Kısık ateş, 2–3 saat',
          tip: 'İyice temizleyin; limon ve sarımsakla dengeleyin.',
        },
      ],
    },
    kofte: {
      title: 'Köfte',
      items: [
        {
          name: 'Ev Yapımı Köfte',
          info: 'Geleneksel tarif, ızgara ve fırın için hazır.',
          img: 'resim/evyapımıköfte.png',
          prep: '20 dk',
          cook: 'Izgara / tava, 4–5 dk / yüz',
          tip: 'Yoğurduktan sonra 30 dk dinlendirin; daha lezzetli olur.',
        },
        {
          name: 'Hamburger Köftesi',
          info: 'Sulu ve dengeli yağ oranıyla hamburger için özel hazırlanır.',
          img: 'resim/hamburgerköftesi.png',
          prep: '5 dk',
          cook: 'Izgara / tava, 3–4 dk / yüz',
          tip: 'Köfteyi bastırmadan yüksek ateşte mühürleyin; servis öncesi kısa süre dinlendirin.',
        },
      ],
    },
    sarkuteri: {
      title: 'Şarküteri',
      items: [
        {
          name: 'Sucuk',
          info: 'Ev usulü, acılı / acısız seçenekler.',
          img: 'resim/sucuk.png',
          prep: '5 dk',
          cook: 'Orta ateş, 3–4 dk / yüz',
          tip: 'Yağsız tavada pişirin; fazla kızartmadan alın.',
        },
      ],
    },
  };

  const productBlocks = document.querySelectorAll('.product-block');
  const productLightbox = document.getElementById('product-lightbox');
  const productLightboxImage = document.getElementById('product-lightbox-image');
  const productLightboxTitle = document.getElementById('product-lightbox-title');
  const productLightboxClose = productLightbox
    ? productLightbox.querySelector('.product-lightbox__close')
    : null;
  let lastLightboxTrigger = null;

  function openProductLightbox(imageSrc, productName, trigger) {
    if (!productLightbox || !productLightboxImage || !productLightboxTitle) return;
    lastLightboxTrigger = trigger;
    productLightboxImage.src = imageSrc;
    productLightboxImage.alt = productName + ' büyük ürün görseli';
    productLightboxTitle.textContent = productName;
    productLightbox.showModal();
    document.body.classList.add('lightbox-open');
    if (productLightboxClose) productLightboxClose.focus();
  }

  function closeProductLightbox() {
    if (!productLightbox || !productLightbox.open) return;
    productLightbox.close();
  }

  if (productLightbox) {
    if (productLightboxClose) {
      productLightboxClose.addEventListener('click', closeProductLightbox);
    }

    productLightbox.addEventListener('click', function (e) {
      if (e.target === productLightbox) closeProductLightbox();
    });

    productLightbox.addEventListener('close', function () {
      document.body.classList.remove('lightbox-open');
      if (productLightboxImage) productLightboxImage.src = '';
      if (lastLightboxTrigger) lastLightboxTrigger.focus();
      lastLightboxTrigger = null;
    });
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function buildFlipCard(item, itemIndex) {
    return (
      '<div class="flip-card" data-product-index="' +
      itemIndex +
      '">' +
      '<div class="flip-card__inner">' +
      '<div class="flip-card__face flip-card__face--front">' +
      '<button type="button" class="flip-card__image-button" data-image="' +
      escapeHtml(item.img) +
      '" data-product-name="' +
      escapeHtml(item.name) +
      '" aria-label="' +
      escapeHtml(item.name) +
      ' görselini büyüt">' +
      '<span class="flip-card__img" style="background-image:url(\'' +
      item.img +
      '\')"></span>' +
      '<span class="flip-card__zoom-icon" aria-hidden="true">' +
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">' +
      '<circle cx="10.5" cy="10.5" r="5.5"></circle>' +
      '<path stroke-linecap="round" d="m15 15 4.5 4.5M10.5 8v5M8 10.5h5"></path>' +
      '</svg></span>' +
      '</button>' +
      '<span class="flip-card__content">' +
      '<span class="flip-card__name">' +
      escapeHtml(item.name) +
      '</span>' +
      '<span class="flip-card__info">' +
      escapeHtml(item.info) +
      '</span>' +
      '<button type="button" class="flip-card__hint flip-card__recipe-trigger" aria-label="' +
      escapeHtml(item.name) +
      ' tarifini göster">Tarifi gör</button>' +
      '</span>' +
      '</div>' +
      '<div class="flip-card__face flip-card__face--back" aria-hidden="true">' +
      '<p class="flip-card__back-title">' +
      escapeHtml(item.name) +
      '</p>' +
      '<ul class="flip-card__recipe">' +
      '<li><span>Hazırlık</span><strong>' +
      escapeHtml(item.prep) +
      '</strong></li>' +
      '<li><span>Pişirme</span><strong>' +
      escapeHtml(item.cook) +
      '</strong></li>' +
      '</ul>' +
      '<p class="flip-card__tip"><span>Ustanın tavsiyesi</span>' +
      escapeHtml(item.tip) +
      '</p>' +
      '<button type="button" class="flip-card__close">Kapat / Geri</button>' +
      '</div>' +
      '</div>' +
      '</div>'
    );
  }

  function closeAllPanels(exceptBlock) {
    productBlocks.forEach(function (block) {
      if (exceptBlock && block === exceptBlock) return;
      const btn = block.querySelector('.product-card');
      const panel = block.querySelector('.product-subpanel');
      if (!btn || !panel) return;
      btn.setAttribute('aria-expanded', 'false');
      block.classList.remove('is-open');
      panel.classList.remove('is-open');
      panel.querySelectorAll('.flip-card.is-flipped').forEach(function (card) {
        card.classList.remove('is-flipped');
      });
      window.setTimeout(function () {
        if (!block.classList.contains('is-open')) panel.hidden = true;
      }, 380);
    });
  }

  function openPanel(block, forceOpen) {
    const categoryId = block.getAttribute('data-category');
    const data = catalog[categoryId];
    const btn = block.querySelector('.product-card');
    const panel = block.querySelector('.product-subpanel');
    if (!data || !btn || !panel) return;

    closeAllPanels(block);

    const isOpen = block.classList.contains('is-open');
    if (isOpen && !forceOpen) {
      closeAllPanels();

      function keepCategoryInView() {
        const headerHeight = header ? header.offsetHeight : 0;
        const top =
          block.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
        window.scrollTo({ top: top, behavior: 'auto' });
      }

      window.requestAnimationFrame(keepCategoryInView);
      window.setTimeout(keepCategoryInView, 420);
      return;
    }
    if (isOpen && forceOpen) return;

    panel.innerHTML =
      '<div class="product-subpanel__inner">' +
      '<p class="product-subpanel__label">' +
      escapeHtml(data.title) +
      ' ürünleri</p>' +
      '<div class="product-subgrid">' +
      data.items.map(buildFlipCard).join('') +
      '</div></div>';

    panel.hidden = false;
    btn.setAttribute('aria-expanded', 'true');

    window.requestAnimationFrame(function () {
      block.classList.add('is-open');
      panel.classList.add('is-open');

      if (!forceOpen) {
        window.setTimeout(function () {
          const headerHeight = header ? header.offsetHeight : 0;
          const top =
            panel.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
          window.scrollTo({
            top: top,
            behavior: reduceMotion ? 'auto' : 'smooth',
          });
        }, 120);
      }
    });

    panel.querySelectorAll('.flip-card').forEach(function (card) {
      const recipeTrigger = card.querySelector('.flip-card__recipe-trigger');
      const imageButton = card.querySelector('.flip-card__image-button');
      const back = card.querySelector('.flip-card__face--back');
      const closeBtn = card.querySelector('.flip-card__close');

      if (recipeTrigger) {
        recipeTrigger.addEventListener('click', function (e) {
          e.stopPropagation();
          panel.querySelectorAll('.flip-card.is-flipped').forEach(function (other) {
            if (other !== card) other.classList.remove('is-flipped');
          });
          card.classList.add('is-flipped');
          if (back) back.setAttribute('aria-hidden', 'false');
        });
      }

      if (imageButton) {
        imageButton.addEventListener('click', function (e) {
          e.stopPropagation();
          openProductLightbox(
            imageButton.getAttribute('data-image') || '',
            imageButton.getAttribute('data-product-name') || 'Ürün',
            imageButton
          );
        });
      }

      if (closeBtn) {
        closeBtn.addEventListener('click', function (e) {
          e.stopPropagation();
          card.classList.remove('is-flipped');
          if (back) back.setAttribute('aria-hidden', 'true');
        });
      }
    });
  }

  productBlocks.forEach(function (block) {
    const btn = block.querySelector('.product-card');
    if (!btn) return;
    btn.addEventListener('click', function () {
      openPanel(block);
    });
  });

  /* Product search */
  const searchToggle = document.getElementById('search-toggle');
  const searchForm = document.getElementById('product-search');
  const searchInput = document.getElementById('product-search-input');
  const searchResults = document.getElementById('product-search-results');
  let currentSearchMatches = [];

  function normalizeSearchText(value) {
    return String(value)
      .toLocaleLowerCase('tr-TR')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  function getSearchMatches(query) {
    const normalizedQuery = normalizeSearchText(query.trim());
    if (!normalizedQuery) return [];

    const matches = [];
    Object.keys(catalog).forEach(function (categoryId) {
      const category = catalog[categoryId];
      category.items.forEach(function (item, itemIndex) {
        const searchable = normalizeSearchText(
          item.name + ' ' + item.info + ' ' + category.title
        );
        if (searchable.includes(normalizedQuery)) {
          matches.push({
            categoryId: categoryId,
            categoryTitle: category.title,
            itemIndex: itemIndex,
            item: item,
          });
        }
      });
    });
    return matches;
  }

  function closeSearchResults() {
    if (!searchResults || !searchInput) return;
    searchResults.hidden = true;
    searchInput.setAttribute('aria-expanded', 'false');
  }

  function setHeaderSearchOpen(open) {
    if (!searchForm || !searchToggle) return;
    searchForm.hidden = !open;
    searchToggle.setAttribute('aria-expanded', String(open));
    searchToggle.setAttribute('aria-label', open ? 'Ürün aramasını kapat' : 'Ürün aramasını aç');
    if (!open) {
      closeSearchResults();
      searchInput.value = '';
    } else {
      window.requestAnimationFrame(function () {
        searchInput.focus();
      });
    }
  }

  function renderSearchResults() {
    if (!searchInput || !searchResults) return;
    const query = searchInput.value.trim();
    currentSearchMatches = getSearchMatches(query);

    if (!query) {
      searchResults.innerHTML = '';
      closeSearchResults();
      return;
    }

    if (!currentSearchMatches.length) {
      searchResults.innerHTML =
        '<p class="product-search__empty">“' +
        escapeHtml(query) +
        '” için ürün bulunamadı.</p>';
    } else {
      searchResults.innerHTML = currentSearchMatches
        .slice(0, 8)
        .map(function (match, resultIndex) {
          return (
            '<button type="button" class="product-search__result" role="option" data-result-index="' +
            resultIndex +
            '">' +
            '<span>' +
            escapeHtml(match.item.name) +
            '</span><small>' +
            escapeHtml(match.categoryTitle) +
            '</small></button>'
          );
        })
        .join('');
    }

    searchResults.hidden = false;
    searchInput.setAttribute('aria-expanded', 'true');
  }

  function goToSearchMatch(match) {
    if (!match) return;
    const block = document.querySelector(
      '.product-block[data-category="' + match.categoryId + '"]'
    );
    if (!block) return;

    openPanel(block, true);
    closeSearchResults();
    setHeaderSearchOpen(false);

    window.setTimeout(function () {
      const card = block.querySelector(
        '.flip-card[data-product-index="' + match.itemIndex + '"]'
      );
      if (!card) return;

      document.querySelectorAll('.flip-card.is-search-match').forEach(function (item) {
        item.classList.remove('is-search-match');
      });
      card.classList.add('is-search-match');

      const headerHeight = header ? header.offsetHeight : 0;
      const top = card.getBoundingClientRect().top + window.scrollY - headerHeight - 24;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });

      window.setTimeout(function () {
        card.classList.remove('is-search-match');
      }, 3000);
    }, 100);
  }

  if (searchInput && searchResults && searchForm) {
    if (searchToggle) {
      searchToggle.addEventListener('click', function () {
        setHeaderSearchOpen(searchForm.hidden);
      });
    }

    searchInput.addEventListener('input', renderSearchResults);
    searchInput.addEventListener('focus', function () {
      if (searchInput.value.trim()) renderSearchResults();
    });

    searchForm.addEventListener('submit', function (e) {
      e.preventDefault();
      currentSearchMatches = getSearchMatches(searchInput.value);
      if (currentSearchMatches.length) goToSearchMatch(currentSearchMatches[0]);
      else renderSearchResults();
    });

    searchResults.addEventListener('click', function (e) {
      const result = e.target.closest('.product-search__result');
      if (!result) return;
      const resultIndex = Number(result.getAttribute('data-result-index'));
      goToSearchMatch(currentSearchMatches[resultIndex]);
    });

    document.addEventListener('click', function (e) {
      if (!searchForm.contains(e.target) && (!searchToggle || !searchToggle.contains(e.target))) {
        setHeaderSearchOpen(false);
      }
    });

    searchInput.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        setHeaderSearchOpen(false);
        if (searchToggle) searchToggle.focus();
      }
      if (e.key === 'ArrowDown' && !searchResults.hidden) {
        const firstResult = searchResults.querySelector('.product-search__result');
        if (firstResult) {
          e.preventDefault();
          firstResult.focus();
        }
      }
    });

    searchResults.addEventListener('keydown', function (e) {
      const results = Array.from(
        searchResults.querySelectorAll('.product-search__result')
      );
      const currentIndex = results.indexOf(document.activeElement);
      if (e.key === 'ArrowDown' && currentIndex < results.length - 1) {
        e.preventDefault();
        results[currentIndex + 1].focus();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) results[currentIndex - 1].focus();
        else searchInput.focus();
      } else if (e.key === 'Escape') {
        setHeaderSearchOpen(false);
        if (searchToggle) searchToggle.focus();
      }
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (productLightbox && productLightbox.open) return;
    const flipped = document.querySelector('.flip-card.is-flipped');
    if (flipped) {
      flipped.classList.remove('is-flipped');
      return;
    }
    closeAllPanels();
  });

  /* Scroll reveal */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }
})();
