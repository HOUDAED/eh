'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   ELEGANCE HOUSE — Application Front-End
   Architecture : ce fichier lit data/content.json et construit le DOM.
   Pour connecter un back-office : remplacer l'URL du fetch par l'endpoint API.
   Chaque élément éditable porte un attribut data-eh-item / data-eh-id.
══════════════════════════════════════════════════════════════════════════ */

// ── SVG Patterns (fallback visuel jusqu'à l'ajout de vraies photos) ──────────

const PATTERNS = {

  tissus: {

    // Tissus Femmes — bandes douces blush & bordeaux
    femme: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-femme" x="0" y="0" width="40" height="12" patternUnits="userSpaceOnUse">
          <rect width="40" height="12" fill="#8B2240"/>
          <rect x="0" y="0" width="40" height="3" fill="#F2D4D0" opacity="0.55"/>
          <rect x="0" y="4" width="40" height="1" fill="#C9A84C" opacity="0.5"/>
          <rect x="0" y="6" width="40" height="3" fill="#E8B8B0" opacity="0.45"/>
          <rect x="0" y="10" width="40" height="1" fill="#C9A84C" opacity="0.3"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-femme)"/>
    </svg>`,

    // Tissus Homme — géométrie sobre bordeaux profond
    homme: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-homme" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#3D0D18"/>
          <rect x="0" y="0" width="32" height="8" fill="#5A0F1E" opacity="0.9"/>
          <rect x="0" y="8" width="32" height="8" fill="#6B1A2B" opacity="0.7"/>
          <line x1="0" y1="16" x2="32" y2="16" stroke="#C9A84C" stroke-width="0.8" opacity="0.35"/>
          <line x1="16" y1="0" x2="16" y2="32" stroke="#C9A84C" stroke-width="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-homme)"/>
    </svg>`,

    // Tissus Mixtes — damier bicolore
    mixte: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-mixte" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#6B1A2B"/>
          <rect x="0" y="0" width="12" height="12" fill="#8B2240" opacity="0.8"/>
          <rect x="12" y="12" width="12" height="12" fill="#8B2240" opacity="0.8"/>
          <line x1="0" y1="12" x2="24" y2="12" stroke="#C9A84C" stroke-width="0.5" opacity="0.25"/>
          <line x1="12" y1="0" x2="12" y2="24" stroke="#C9A84C" stroke-width="0.5" opacity="0.25"/>
          <line x1="0" y1="0" x2="24" y2="24" stroke="#F2D4D0" stroke-width="0.3" opacity="0.12"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-mixte)"/>
    </svg>`,

    // Pagnes Tissés — Asooké heritage weave
    pagne: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-pagne" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#6B1A2B"/>
          <rect x="0" y="0" width="8" height="8" fill="#8B2240" opacity="0.7"/>
          <rect x="16" y="0" width="8" height="8" fill="#8B2240" opacity="0.7"/>
          <rect x="8" y="8" width="8" height="8" fill="#4A0E1A" opacity="0.8"/>
          <rect x="0" y="16" width="8" height="8" fill="#8B2240" opacity="0.5"/>
          <rect x="16" y="16" width="8" height="8" fill="#8B2240" opacity="0.5"/>
          <line x1="0" y1="8"  x2="24" y2="8"  stroke="#C9A84C" stroke-width="0.5" opacity="0.35"/>
          <line x1="0" y1="16" x2="24" y2="16" stroke="#C9A84C" stroke-width="0.5" opacity="0.25"/>
          <line x1="8" y1="0"  x2="8"  y2="24" stroke="#C9A84C" stroke-width="0.5" opacity="0.25"/>
          <line x1="16" y1="0" x2="16" y2="24" stroke="#C9A84C" stroke-width="0.5" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-pagne)"/>
    </svg>`,

    // Dentelle — résille fine crème & bordeaux
    dentelle: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-dentelle" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#FAE9E6"/>
          <line x1="0" y1="0" x2="20" y2="20" stroke="#6B1A2B" stroke-width="0.4" opacity="0.2"/>
          <line x1="20" y1="0" x2="0" y2="20" stroke="#6B1A2B" stroke-width="0.4" opacity="0.2"/>
          <circle cx="10" cy="10" r="2.5" fill="none" stroke="#C9A84C" stroke-width="0.5" opacity="0.4"/>
          <circle cx="0"  cy="0"  r="1.5" fill="#6B1A2B" opacity="0.18"/>
          <circle cx="20" cy="20" r="1.5" fill="#6B1A2B" opacity="0.18"/>
          <circle cx="20" cy="0"  r="1.5" fill="#6B1A2B" opacity="0.18"/>
          <circle cx="0"  cy="20" r="1.5" fill="#6B1A2B" opacity="0.18"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-dentelle)"/>
    </svg>`,

    // Brocarde — motif diamant doré en relief
    brocarde: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-brocarde" x="0" y="0" width="28" height="28" patternUnits="userSpaceOnUse">
          <rect width="28" height="28" fill="#6B1A2B"/>
          <polygon points="14,2 26,14 14,26 2,14" fill="#C9A84C" opacity="0.28"/>
          <polygon points="14,6 22,14 14,22 6,14"  fill="#C9A84C" opacity="0.15"/>
          <line x1="0" y1="14" x2="28" y2="14" stroke="#C9A84C" stroke-width="0.4" opacity="0.2"/>
          <line x1="14" y1="0" x2="14" y2="28" stroke="#C9A84C" stroke-width="0.4" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-brocarde)"/>
      <rect width="400" height="460" fill="#8B2240" opacity="0.15"/>
    </svg>`,

    // Tissu 360 — lignes diagonales satinées
    t360: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-t360" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#3D0D18"/>
          <line x1="0" y1="0" x2="16" y2="16" stroke="#C9A84C" stroke-width="1.2" opacity="0.25"/>
          <line x1="0" y1="8" x2="8"  y2="16" stroke="#C9A84C" stroke-width="0.6" opacity="0.15"/>
          <line x1="8" y1="0" x2="16" y2="8"  stroke="#C9A84C" stroke-width="0.6" opacity="0.15"/>
          <rect x="0" y="0" width="16" height="2" fill="#FAF5EE" opacity="0.04"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-t360)"/>
      <rect width="400" height="460" fill="#6B1A2B" opacity="0.2"/>
    </svg>`,

    // Wax — imprimé bloc coloré africain
    wax: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-wax" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <rect width="40" height="40" fill="#6B1A2B"/>
          <rect x="0" y="0" width="20" height="20" fill="#8B2240" opacity="0.7"/>
          <rect x="20" y="20" width="20" height="20" fill="#8B2240" opacity="0.7"/>
          <rect x="10" y="5" width="20" height="8" fill="#C9A84C" opacity="0.3"/>
          <circle cx="20" cy="20" r="4" fill="none" stroke="#C9A84C" stroke-width="0.8" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-wax)"/>
    </svg>`,

    // Sequin — paillettes dorées sur fond sombre
    sequin: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-sequin" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#3D0D18"/>
          <polygon points="10,2 12,8 18,8 13,12 15,18 10,14 5,18 7,12 2,8 8,8" fill="#C9A84C" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-sequin)"/>
      <rect width="400" height="460" fill="#6B1A2B" opacity="0.3"/>
    </svg>`,

    // 3D — relief géométrique tridimensionnel
    t3d: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-t3d" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <rect width="30" height="30" fill="#3D0D18"/>
          <polygon points="0,0 15,0 15,15" fill="#6B1A2B" opacity="0.9"/>
          <polygon points="15,0 30,0 30,15" fill="#8B2240" opacity="0.7"/>
          <polygon points="0,15 15,15 0,30" fill="#5A0F1E" opacity="0.8"/>
          <polygon points="15,15 30,15 30,30 15,30" fill="#4A0E1A" opacity="0.9"/>
          <line x1="0" y1="0" x2="30" y2="30" stroke="#C9A84C" stroke-width="0.5" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-t3d)"/>
    </svg>`,

    // Velours — diagonales douces sur fond profond
    velours: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-velours" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <rect width="16" height="16" fill="#5A0F1E"/>
          <line x1="0" y1="0" x2="16" y2="16" stroke="#8B2240" stroke-width="2" opacity="0.6"/>
          <line x1="0" y1="8" x2="8"  y2="16" stroke="#8B2240" stroke-width="2" opacity="0.4"/>
          <line x1="8" y1="0" x2="16" y2="8"  stroke="#8B2240" stroke-width="2" opacity="0.4"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-velours)"/>
      <rect width="400" height="460" fill="#3D0D18" opacity="0.2"/>
    </svg>`,

    // Lace — résille guipure sur fond crème
    lace: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-lace" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
          <rect width="24" height="24" fill="#FAE9E6"/>
          <circle cx="12" cy="12" r="5" fill="none" stroke="#6B1A2B" stroke-width="0.5" opacity="0.3"/>
          <circle cx="12" cy="12" r="2" fill="#C9A84C" opacity="0.25"/>
          <line x1="0" y1="12" x2="24" y2="12" stroke="#6B1A2B" stroke-width="0.4" opacity="0.15"/>
          <line x1="12" y1="0" x2="12" y2="24" stroke="#6B1A2B" stroke-width="0.4" opacity="0.15"/>
          <circle cx="0"  cy="0"  r="1.5" fill="#6B1A2B" opacity="0.2"/>
          <circle cx="24" cy="0"  r="1.5" fill="#6B1A2B" opacity="0.2"/>
          <circle cx="0"  cy="24" r="1.5" fill="#6B1A2B" opacity="0.2"/>
          <circle cx="24" cy="24" r="1.5" fill="#6B1A2B" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-lace)"/>
    </svg>`,

    // Blanc — satin nacré avec reflets subtils
    blanc: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-blanc" x="0" y="0" width="32" height="8" patternUnits="userSpaceOnUse">
          <rect width="32" height="8" fill="#FAF5EE"/>
          <rect x="0" y="0" width="32" height="2" fill="#F3EBD8" opacity="0.6"/>
          <rect x="0" y="3" width="32" height="1" fill="#E8C97A" opacity="0.12"/>
          <rect x="0" y="5" width="32" height="2" fill="#F3EBD8" opacity="0.5"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-blanc)"/>
    </svg>`,

    // Foulard Gélé — tissage Asooke headwrap
    gele: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-gele" x="0" y="0" width="20" height="10" patternUnits="userSpaceOnUse">
          <rect width="20" height="10" fill="#6B1A2B"/>
          <rect x="0" y="0" width="20" height="3" fill="#8B2240" opacity="0.8"/>
          <rect x="0" y="4" width="20" height="1" fill="#C9A84C" opacity="0.7"/>
          <rect x="0" y="6" width="20" height="3" fill="#5A0F1E" opacity="0.7"/>
          <line x1="5"  y1="0" x2="5"  y2="10" stroke="#C9A84C" stroke-width="0.4" opacity="0.25"/>
          <line x1="10" y1="0" x2="10" y2="10" stroke="#C9A84C" stroke-width="0.4" opacity="0.25"/>
          <line x1="15" y1="0" x2="15" y2="10" stroke="#C9A84C" stroke-width="0.4" opacity="0.25"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-gele)"/>
    </svg>`,

    // Foulard Simple — tissu fluide uni
    simple: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-foulard-simple" x="0" y="0" width="40" height="4" patternUnits="userSpaceOnUse">
          <rect width="40" height="4" fill="#8B2240"/>
          <rect x="0" y="0" width="40" height="1" fill="#FAE9E6" opacity="0.1"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-foulard-simple)"/>
    </svg>`,

    // Foulard Broché — broderies dorées
    broche: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-broche" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse">
          <rect width="32" height="32" fill="#6B1A2B"/>
          <polygon points="16,4 20,12 28,12 22,18 24,26 16,22 8,26 10,18 4,12 12,12" fill="#C9A84C" opacity="0.3"/>
          <line x1="0" y1="16" x2="32" y2="16" stroke="#C9A84C" stroke-width="0.4" opacity="0.15"/>
          <line x1="16" y1="0" x2="16" y2="32" stroke="#C9A84C" stroke-width="0.4" opacity="0.15"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-broche)"/>
    </svg>`,

    // Shantoum — aspect nacré texturé
    shantoum: `<svg width="100%" height="100%" viewBox="0 0 400 460" preserveAspectRatio="xMidYMid slice">
      <defs>
        <pattern id="pat-shantoum" x="0" y="0" width="8" height="4" patternUnits="userSpaceOnUse">
          <rect width="8" height="4" fill="#FAE9E6"/>
          <rect x="0" y="0" width="4" height="2" fill="#E8B8B0" opacity="0.5"/>
          <rect x="4" y="2" width="4" height="2" fill="#E8B8B0" opacity="0.5"/>
          <line x1="0" y1="2" x2="8" y2="2" stroke="#C9A84C" stroke-width="0.3" opacity="0.2"/>
        </pattern>
      </defs>
      <rect width="400" height="460" fill="url(#pat-shantoum)"/>
    </svg>`
  }
};

// ── Utilitaires ──────────────────────────────────────────────────────────────

function esc(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function bg(item, patterns) {
  if (item.image) {
    return `<img src="${esc(item.image)}" alt="${esc(item.name || '')}" class="cover-img">`;
  }
  return patterns[item.id] || '';
}

// ── Moteur de rendu ──────────────────────────────────────────────────────────

const EH = {
  data: null,

  async init() {
    try {
      const res  = await fetch('./data/content.json');
      if (!res.ok) throw new Error(res.status);
      this.data = await res.json();
    } catch (e) {
      console.error('[EH] Impossible de charger content.json :', e);
      return;
    }
    this.applyContact();
    this.renderNav();
    this.renderCerStrip();
    this.renderPagnes();
    this.renderTissus();
    this.renderFoulards();

    this.renderAccessoires();
    this.renderBienetre();
    this.renderMariages();
    this.renderTemoignages();
    this.injectSchemaOrg();
    this.renderRDV();
    this.initHoursPopup();
    this.initMobileNav();
    this.initFooterHover();
    this.initExportButton();
    this.initScrollAnimations();
  },

  // ── Informations de contact (injectées partout via data-eh="*") ────────────

  applyContact() {
    const s = this.data.site;

    // Numéro de téléphone → ouvre WhatsApp directement
    document.querySelectorAll('[data-eh="phone-href"]').forEach(el => {
      el.href   = `https://wa.me/${s.whatsapp_intl}`;
      el.target = '_blank';
      el.rel    = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-eh="phone-text"]').forEach(el => {
      el.textContent = s.phone;
    });
    document.querySelectorAll('[data-eh="location"]').forEach(el => {
      el.textContent = s.location;
    });

    // Carte Google Maps
    const mapIframe = document.getElementById('map-iframe');
    if (mapIframe && s.maps_embed) mapIframe.src = s.maps_embed;

    document.querySelectorAll('[data-eh="maps-url"]').forEach(el => {
      el.href   = s.maps_url || '#';
      el.target = '_blank';
      el.rel    = 'noopener noreferrer';
    });

    // Lien adresse → ouvre Google Maps
    document.querySelectorAll('a[data-eh="location"]').forEach(el => {
      el.href   = s.maps_url || '#';
      el.target = '_blank';
      el.rel    = 'noopener noreferrer';
    });
    document.querySelectorAll('[data-eh="hours"]').forEach(el => {
      el.textContent = s.hours;
    });
    document.querySelectorAll('[data-eh="email-href"]').forEach(el => {
      el.href     = `mailto:${s.email}`;
      el.textContent = s.email;
    });
    document.querySelectorAll('[data-eh="tagline"]').forEach(el => {
      el.textContent = s.tagline;
    });
    document.querySelectorAll('[data-eh="year"]').forEach(el => {
      el.textContent = s.year;
    });
    // Liens sociaux — toujours en nouvel onglet
    const socials = { instagram: s.instagram, facebook: s.facebook, tiktok: s.tiktok, whatsapp: s.whatsapp };
    Object.entries(socials).forEach(([key, url]) => {
      document.querySelectorAll(`[data-eh="${key}"]`).forEach(el => {
        el.href   = url;
        el.target = '_blank';
        el.rel    = 'noopener noreferrer';
      });
    });
  },

  // ── Navigation dropdown (construite depuis data.nav) ─────────────────────

  renderNav() {
    const list = document.getElementById('nav-links');
    if (!list || !this.data.nav) return;

    // Vider sauf l'éventuel bouton CTA mobile déjà présent
    list.innerHTML = '';

    list.innerHTML = this.data.nav.map(item => {
      const hasSub = item.children && item.children.length > 0;
      const sub = hasSub ? `
        <ul class="nav-dropdown">
          ${item.children.map(c => `
            <li>
              <a href="${c.anchor}" class="nav-dropdown-link">${esc(c.label)}</a>
            </li>
          `).join('')}
        </ul>` : '';
      return `
        <li class="nav-item${hasSub ? ' nav-item--has-sub' : ''}">
          <a href="${item.anchor}" class="nav-item-link"
             ${hasSub ? 'aria-haspopup="true" aria-expanded="false"' : ''}>
            ${esc(item.label)}${hasSub ? '<span class="nav-arrow" aria-hidden="true">▾</span>' : ''}
          </a>
          ${sub}
        </li>`;
    }).join('') + `<li class="nav-links-cta-mobile"><button class="nav-cta" onclick="EH.openRDV()">Prendre RDV</button></li>`;

    // Mobile : accordion toggle (clic sur le label parent)
    list.querySelectorAll('.nav-item--has-sub > .nav-item-link').forEach(link => {
      link.addEventListener('click', e => {
        if (window.innerWidth > 768) return; // desktop gère par CSS :hover
        e.preventDefault();
        const li = link.closest('.nav-item--has-sub');
        const isOpen = li.classList.contains('is-open');
        // Ferme tous les autres
        list.querySelectorAll('.nav-item--has-sub').forEach(el => el.classList.remove('is-open'));
        if (!isOpen) li.classList.add('is-open');
        link.setAttribute('aria-expanded', String(!isOpen));
      });
    });

    // Les liens feuilles ferment le menu hamburger
    list.querySelectorAll('.nav-dropdown-link, a:not([aria-haspopup])').forEach(a => {
      a.addEventListener('click', () => {
        const btn = document.getElementById('nav-hamburger');
        list.classList.remove('is-open');
        list.querySelectorAll('.nav-item--has-sub').forEach(el => el.classList.remove('is-open'));
        if (btn) { btn.classList.remove('is-open'); btn.setAttribute('aria-expanded','false'); }
        document.body.style.overflow = '';
      });
    });
  },

  // ── Bandeau cérémonies ────────────────────────────────────────────────────

  renderCerStrip() {
    const el = document.getElementById('cer-strip');
    if (!el) return;
    el.innerHTML = this.data.cerStrip
      .map(item => `<div class="cer-strip-item">✦ ${esc(item)}</div>`)
      .join('<div class="cer-strip-dot"></div>');
  },

  // ── Template carte tissu (partagé par toutes les sections produit) ─────────

  _cardHTML(item, idPrefix, patterns) {
    const patKey = item.id.replace('-', '');
    const svgBg  = item.image
      ? `<img src="${esc(item.image)}" alt="${esc(item.name)}" class="cover-img">`
      : (patterns[item.id] || patterns[patKey] || `<rect width="400" height="460" fill="${item.overlayStart || '#3D0D18'}"/>`);
    return `
      <div class="tissu-card" id="${idPrefix}-${item.id}" data-eh-item="${idPrefix}" data-eh-id="${item.id}">
        <div class="tissu-bg">${svgBg}</div>
        <div class="tissu-overlay" style="background:linear-gradient(to top,${item.overlayStart||'rgba(61,13,24,0.85)'} 0%,${item.overlayMid||'rgba(61,13,24,0.2)'} 60%,transparent 100%);"></div>
        <div class="tissu-content">
          <div class="tissu-num" style="color:#C9A84C;">${esc(item.num||'')}</div>
          ${item.flag ? `<div class="tissu-country"><span class="tissu-flag">${item.flag}</span> ${esc(item.country||'')}</div>` : `<div class="tissu-badge-label">${esc(item.badge||'')}</div>`}
          <div class="tissu-name" style="color:#FAF5EE;">${esc(item.name)}</div>
          <div class="tissu-div" style="background:var(--dore);"></div>
          <p class="tissu-desc" style="color:rgba(242,212,208,0.8);">${esc(item.description||'')}</p>
          <p class="tissu-role" style="color:var(--dore2);">${esc(item.exemples||item.role||'')}</p>
        </div>
      </div>`;
  },

  // ── Pagnes tissés (Asooke, Kanvo, Kente) ─────────────────────────────────

  renderPagnes() {
    const grid = document.getElementById('grid-pagnes');
    if (!grid || !this.data.pagnes) return;
    grid.innerHTML = this.data.pagnes.map(p => this._cardHTML(p, 'pagne', PATTERNS.tissus)).join('');
  },

  // ── Nos tissus (9 catégories) ─────────────────────────────────────────────

  renderTissus() {
    const grid = document.getElementById('grid-tissus');
    if (!grid || !this.data.tissus) return;
    grid.innerHTML = this.data.tissus.map(t => this._cardHTML(t, 'tissu', PATTERNS.tissus)).join('');
  },

  // ── Foulards ──────────────────────────────────────────────────────────────

  renderFoulards() {
    const grid = document.getElementById('grid-foulards');
    if (!grid || !this.data.foulards) return;
    grid.innerHTML = this.data.foulards.map(f => this._cardHTML(f, 'foulard', PATTERNS.tissus)).join('');
  },

  // ── Accessoires (7 catégories) ───────────────────────────────────────────

  renderAccessoires() {
    const grid = document.getElementById('grid-accessoires');
    if (!grid || !this.data.accessoires) return;
    grid.innerHTML = this.data.accessoires
      .map(a => this._cardHTML(a, 'acc', PATTERNS.tissus)).join('');
  },

  // ── Bien-être ─────────────────────────────────────────────────────────────

  renderBienetre() {
    const grid = document.getElementById('grid-bienetre');
    if (!grid || !this.data.bienetre) return;
    grid.innerHTML = this.data.bienetre
      .map(b => this._cardHTML(b, 'bienetre', PATTERNS.tissus)).join('');
  },

  // ── Mariage & Dot ─────────────────────────────────────────────────────────

  renderMariages() {
    const grid = document.getElementById('mariages-grid');
    if (!grid) return;
    grid.innerHTML = this.data.mariages.map(m => `
      <div class="m-card" id="mariage-${m.id}" data-eh-item="mariage" data-eh-id="${m.id}">
        <div class="m-num">${esc(m.num)}</div>
        <div class="m-title">${esc(m.title)}</div>
        <div class="m-sub">${esc(m.sub)}</div>
        <div class="m-div"></div>
        <p class="m-desc">${esc(m.description)}</p>
        <div class="m-tissus">
          ${m.tissus.map(t => `<span class="m-tissu-badge">${esc(t)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  },

  // ── Témoignages ───────────────────────────────────────────────────────────

  renderTemoignages() {
    const grid = document.getElementById('temo-grid');
    if (!grid) return;
    grid.innerHTML = this.data.temoignages.map(t => `
      <div class="temo-card" data-eh-item="temoignage">
        <p class="temo-text">"${esc(t.text)}"</p>
        <div class="temo-author">${esc(t.author)}</div>
        <div class="temo-event">${esc(t.event)}</div>
      </div>
    `).join('');
  },

  // ── Hover footer → highlight de l'élément ciblé ───────────────────────────

  initFooterHover() {
    const CARD_SELECTOR = '.tissu-card,.tissus-extra-card,.m-card,.acc-card,.acc-bottom-card';

    document.querySelectorAll('.f-links a[href^="#"]').forEach(link => {
      link.addEventListener('mouseenter', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        const card = target.closest(CARD_SELECTOR) || target;
        card.classList.add('eh-highlight');
      });
      link.addEventListener('mouseleave', () => {
        const target = document.querySelector(link.getAttribute('href'));
        if (!target) return;
        const card = target.closest(CARD_SELECTOR) || target;
        card.classList.remove('eh-highlight');
      });
    });
  },

  // ── Popup horaires d'ouverture ────────────────────────────────────────────

  initHoursPopup() {
    const btn   = document.getElementById('f-hours-btn');
    const popup = document.getElementById('f-hours-popup');
    const list  = document.getElementById('f-hours-list');
    if (!btn || !popup || !list) return;

    const schedule = this.data.site.schedule || [];

    // Index du jour actuel → position dans le tableau (Lun=0 … Dim=6)
    const DAY_MAP = [6, 0, 1, 2, 3, 4, 5]; // getDay() Sunday=0 → index 6
    const todayIdx = DAY_MAP[new Date().getDay()];

    // Remplir la liste des horaires depuis le JSON (1 ligne par jour)
    list.innerHTML = schedule.map((row, i) => `
      <li class="${i === todayIdx ? 'f-hours-today' : ''}">
        <span class="f-hours-day">
          ${i === todayIdx ? '▸ ' : ''}${esc(row.day)}
        </span>
        <span class="f-hours-time ${row.open ? 'f-hours-time--open' : 'f-hours-time--closed'}">
          ${esc(row.hours)}
        </span>
      </li>
    `).join('');

    const open  = () => {
      popup.hidden = false;
      btn.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      popup.hidden = true;
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', e => {
      e.stopPropagation();
      popup.hidden ? open() : close();
    });

    // Ferme si on clique ailleurs
    document.addEventListener('click', e => {
      if (!popup.hidden && !popup.contains(e.target) && e.target !== btn) close();
    });

    // Ferme sur Échap
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && !popup.hidden) close();
    });
  },

  // ── Menu hamburger mobile ─────────────────────────────────────────────────

  initMobileNav() {
    const btn   = document.getElementById('nav-hamburger');
    const links = document.getElementById('nav-links');
    if (!btn || !links) return;

    const open  = () => {
      links.classList.add('is-open');
      btn.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    };

    const close = () => {
      links.classList.remove('is-open');
      btn.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };

    btn.addEventListener('click', () => {
      links.classList.contains('is-open') ? close() : open();
    });

    // Ferme le menu au clic sur un lien feuille (pas les parents avec dropdown)
    links.querySelectorAll('a:not([aria-haspopup])').forEach(a => a.addEventListener('click', close));

    // Ferme si on appuie sur Échap
    document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

    // Ferme si on redimensionne vers desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) close();
    });
  },

  // ── Schema.org JSON-LD (référencement local Google) ──────────────────────

  injectSchemaOrg() {
    const s   = this.data.site;
    const seo = this.data.seo || {};

    const schema = {
      '@context': 'https://schema.org',
      '@type': 'ClothingStore',
      'name': s.name,
      'description': seo.description || '',
      'url': seo.url || '',
      'telephone': '+229' + s.phone.replace(/^0/, ''),
      'email': s.email,
      'image': seo.og_image || '',
      'priceRange': '$$$$',
      'currenciesAccepted': 'XOF',
      'paymentAccepted': 'Espèces, Mobile Money',
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': 'Abomey-Calavi',
        'addressLocality': 'Abomey-Calavi',
        'addressRegion': 'Littoral',
        'addressCountry': 'BJ'
      },
      'geo': {
        '@type': 'GeoCoordinates',
        'latitude': parseFloat(seo.geo_latitude  || '6.4473'),
        'longitude': parseFloat(seo.geo_longitude || '2.3554')
      },
      'openingHoursSpecification': [
        {
          '@type': 'OpeningHoursSpecification',
          'dayOfWeek': ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
          'opens': '08:00',
          'closes': '19:00'
        }
      ],
      'hasOfferCatalog': {
        '@type': 'OfferCatalog',
        'name': 'Tissus & Accessoires Africains',
        'itemListElement': this.data.tissus.map((t, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'item': {
            '@type': 'Product',
            'name': t.name,
            'description': t.description
          }
        }))
      },
      'sameAs': [
        s.instagram !== '#' ? s.instagram : null,
        s.facebook  !== '#' ? s.facebook  : null,
        s.tiktok    !== '#' ? s.tiktok    : null
      ].filter(Boolean)
    };

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = JSON.stringify(schema);
    document.head.appendChild(script);
  },

  // ── RDV : ouverture / fermeture du modal ─────────────────────────────────

  openRDV() {
    // Ferme le menu mobile s'il est ouvert
    const navLinks = document.getElementById('nav-links');
    const navBtn   = document.getElementById('nav-hamburger');
    if (navLinks) navLinks.classList.remove('is-open');
    if (navBtn)   { navBtn.classList.remove('is-open'); navBtn.setAttribute('aria-expanded','false'); }

    const overlay = document.getElementById('rdv-overlay');
    if (!overlay) return;
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Réinitialiser le modal si déjà utilisé
    const form    = document.getElementById('rdv-form');
    const success = document.getElementById('rdv-success');
    const btn     = document.getElementById('rdv-submit-btn');
    if (form)    { form.style.display = '';  form.reset(); }
    if (success) { success.style.display = 'none'; }
    if (btn)     { btn.disabled = false; btn.textContent = 'Confirmer ma demande de RDV ✦'; }
  },

  closeRDV() {
    const overlay = document.getElementById('rdv-overlay');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  },

  // ── RDV : injection des options depuis content.json ───────────────────────

  renderRDV() {
    const rdv = this.data.rdv;
    if (!rdv) return;

    const objetSel = document.getElementById('rdv-objet');
    if (objetSel) {
      rdv.visitTypes.forEach(t => {
        const opt = document.createElement('option');
        opt.value       = t.value;
        opt.textContent = t.label;
        objetSel.appendChild(opt);
      });
    }

    const heureSel = document.getElementById('rdv-heure');
    if (heureSel) {
      rdv.timeSlots.forEach(s => {
        const opt = document.createElement('option');
        opt.value       = s.value;
        opt.textContent = s.label;
        heureSel.appendChild(opt);
      });
    }

    // Date min = aujourd'hui
    const dateInput = document.getElementById('rdv-date');
    if (dateInput) {
      dateInput.min = new Date().toISOString().split('T')[0];
    }

    // Fermeture : bouton ✕ + clic overlay (hors modal)
    document.getElementById('rdv-close')
      ?.addEventListener('click', () => this.closeRDV());

    document.getElementById('rdv-overlay')
      ?.addEventListener('click', e => {
        if (e.target === e.currentTarget) this.closeRDV();
      });

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') this.closeRDV();
    });
  },

  // ── Animations au scroll (IntersectionObserver) ──────────────────────────

  initScrollAnimations() {
    // Respect de prefers-reduced-motion (accessibilité)
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // anime une seule fois
        }
      });
    }, {
      threshold: 0.10,   // déclenche à 10% de visibilité
      rootMargin: '0px 0px -40px 0px' // légère avance avant le bord bas
    });

    // Éléments animés individuellement
    const SINGLES = [
      '.sec-head',
      '.intro-left-content', '.intro-right-top', '.intro-right-bottom',
      '.dot-item',
      '.dot-visual-content',
      '.proc-step',
      '.banner-content',
      '.nl-header',
      '.social-header',
      '.f-brand-desc',
      '.contact-bar > div'
    ].join(',');

    // Éléments en grille (stagger automatique par position dans le parent)
    const GRIDS = [
      '.tissu-card',
      '.tissus-extra-card',

      '.m-card',
      '.temo-card',
      '.acc-card',
      '.acc-bottom-card',
      '.social-card',
      '.dot-cell'
    ].join(',');

    // Appliquer et observer les singletons
    document.querySelectorAll(SINGLES).forEach(el => {
      el.classList.add('anim-up');
      observer.observe(el);
    });

    // Appliquer avec délai de stagger sur les grilles
    document.querySelectorAll(GRIDS).forEach(el => {
      el.classList.add('anim-up');

      // Calcule la position de l'élément parmi ses frères du même type
      const siblings = Array.from(el.parentElement.children)
        .filter(c => c.classList.contains(el.classList[0]));
      const idx = siblings.indexOf(el);
      if (idx > 0 && idx <= 7) el.dataset.delay = String(idx);

      observer.observe(el);
    });
  },

  // ── Bouton export CSV (si clients déjà enregistrés) ───────────────────────

  initExportButton() {
    const btn = document.getElementById('nl-export');
    if (btn && clientsEH.length > 0) btn.style.display = 'block';
  }
};

// ── Formulaire client ────────────────────────────────────────────────────────

var clientsEH = JSON.parse(localStorage.getItem('ehClients') || '[]');

// Libellés lisibles pour le résumé WhatsApp / email
var CEREMONIE_LABELS = {
  'dot':            'Cérémonie de dot',
  'mariage':        'Mariage traditionnel',
  'mariage-civil':  'Mariage civil',
  'grand-evenement':'Grand événement / Fête',
  'autre':          'Autre occasion'
};
var INTERET_LABELS = {
  'pagnes':      'Pagnes tissés (Asooké, Kanvô, Kenté)',
  'tissus':      'Tissus (dentelle, brocarde)',
  'accessoires': 'Accessoires (bijoux, chaussures, corail)',
  'eventails':   'Éventails mariées',
  'geles':       'Gélés & Foulards',
  'tout':        'Tenue complète (tout chercher)'
};
var MOIS_FR = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];

function formatDate(raw) {
  if (!raw) return 'Non précisée';
  var parts = raw.split('-');
  return MOIS_FR[parseInt(parts[1], 10) - 1] + ' ' + parts[0];
}

function buildResume(client) {
  // Résumé structuré partagé entre WhatsApp et email
  return {
    coordonnees: [
      'Prénom : ' + client.prenom + (client.nom ? ' ' + client.nom : ''),
      'WhatsApp : ' + client.whatsapp,
      client.email ? 'Email : ' + client.email : null
    ].filter(Boolean),

    evenement: [
      'Type : '  + (CEREMONIE_LABELS[client.ceremonie] || client.ceremonie || 'Non précisé'),
      'Date : '  + formatDate(client.date_ceremonie),
      'Lieu : '  + (client.ville || 'Non précisé')
    ],

    interet: INTERET_LABELS[client.interet] || client.interet || 'Non précisé',
    date_inscription: client.date_inscription
  };
}

async function nlSubmit() {
  var prenom    = document.getElementById('nl-prenom').value.trim();
  var nom       = document.getElementById('nl-nom').value.trim();
  var whatsapp  = document.getElementById('nl-whatsapp').value.trim();
  var email     = document.getElementById('nl-email').value.trim();
  var ceremonie = document.getElementById('nl-ceremonie').value;
  var date      = document.getElementById('nl-date').value;
  var ville     = document.getElementById('nl-ville').value.trim();
  var interet   = document.getElementById('nl-interet').value;

  if (!prenom || !whatsapp) {
    alert('Veuillez renseigner au minimum votre prénom et votre numéro WhatsApp.');
    return;
  }

  // Désactiver le bouton pour éviter le double-envoi
  var btn = document.querySelector('.nl-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

  var client = {
    date_inscription: new Date().toLocaleDateString('fr-FR'),
    prenom, nom, whatsapp, email,
    ceremonie, date_ceremonie: date, ville, interet
  };

  // 1 — Sauvegarde locale (CSV export toujours disponible)
  clientsEH.push(client);
  localStorage.setItem('ehClients', JSON.stringify(clientsEH));

  var resume = buildResume(client);

  // 2 — Email via Formspree (non-bloquant)
  var formspreeId = (EH.data && EH.data.site && EH.data.site.formspree_id) || '';
  if (formspreeId && formspreeId !== 'VOTRE_ID_FORMSPREE') {
    fetch('https://formspree.io/f/' + formspreeId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: '✨ Nouvelle cliente — ' + prenom + (nom ? ' ' + nom : ''),
        // Coordonnées
        prenom:   prenom,
        nom:      nom      || '—',
        whatsapp: whatsapp,
        email:    email    || '—',
        // Événement
        ceremonie: CEREMONIE_LABELS[ceremonie] || ceremonie || '—',
        date:      formatDate(date),
        ville:     ville   || '—',
        // Intérêt
        interet:   INTERET_LABELS[interet] || interet || '—',
        // Meta
        inscrite_le: client.date_inscription
      })
    }).catch(function(e) {
      console.warn('[EH] Email Formspree non envoyé :', e);
    });
  }

  // 3 — WhatsApp : message formaté envoyé directement à la gérante
  var waNumber = (EH.data && EH.data.site && EH.data.site.whatsapp_intl) || '2290190008300';

  var waLines = [
    '🌹 *Nouvelle cliente — Elegance House Bénin*',
    '',
    '👤 *Coordonnées*'
  ].concat(resume.coordonnees).concat([
    '',
    '🎉 *Événement*'
  ]).concat(resume.evenement).concat([
    '',
    '💛 *Intérêt principal*',
    resume.interet,
    '',
    '_Inscrite le ' + resume.date_inscription + ' via elegancehouse.bj_'
  ]);

  window.open(
    'https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waLines.join('\n')),
    '_blank'
  );

  // 4 — Afficher confirmation
  document.getElementById('nl-form-wrap').style.display = 'none';
  document.getElementById('nl-prenom-confirm').textContent = prenom;
  document.getElementById('nl-success').style.display = 'block';
  document.getElementById('nl-export').style.display  = 'block';
}

function nlExport() {
  if (!clientsEH.length) { alert('Aucun client enregistré.'); return; }

  var headers = ['Date inscription','Prénom','Nom','WhatsApp','Email','Cérémonie','Date cérémonie','Ville','Intérêt'];
  var rows = clientsEH.map(c =>
    [c.date_inscription,c.prenom,c.nom,c.whatsapp,c.email,
     c.ceremonie,c.date_ceremonie,c.ville,c.interet]
      .map(v => '"' + (v || '').replace(/"/g, '""') + '"').join(',')
  );

  var blob = new Blob(['﻿' + headers.join(',') + '\n' + rows.join('\n')], { type: 'text/csv;charset=utf-8;' });
  var url  = URL.createObjectURL(blob);
  var a    = Object.assign(document.createElement('a'), { href: url, download: 'clients_elegance_house.csv' });
  a.click();
  URL.revokeObjectURL(url);
}

// ── RDV : soumission ────────────────────────────────────────────────────────

var JOURS_FR = ['Dim','Lun','Mar','Mer','Jeu','Ven','Sam'];

function formatDateRDV(raw) {
  if (!raw) return 'Non précisée';
  var d = new Date(raw + 'T00:00:00');
  return JOURS_FR[d.getDay()] + ' ' + d.getDate() + ' ' + MOIS_FR[d.getMonth()] + ' ' + d.getFullYear();
}

function rdvSubmit() {
  var prenom   = document.getElementById('rdv-prenom').value.trim();
  var whatsapp = document.getElementById('rdv-whatsapp').value.trim();
  var objet    = document.getElementById('rdv-objet');
  var date     = document.getElementById('rdv-date').value;
  var heure    = document.getElementById('rdv-heure');
  var message  = document.getElementById('rdv-message').value.trim();

  if (!prenom || !whatsapp) {
    alert('Veuillez renseigner votre prénom et votre numéro WhatsApp.');
    return;
  }
  if (!objet.value) {
    alert('Veuillez préciser l\'objet de votre visite.');
    return;
  }

  var btn = document.getElementById('rdv-submit-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Envoi en cours…'; }

  var objetLabel = objet.options[objet.selectedIndex]?.text || objet.value;
  var heureLabel = heure.value ? (heure.options[heure.selectedIndex]?.text || heure.value) : 'Non précisée';
  var dateLabel  = formatDateRDV(date);

  // ── WhatsApp à la gérante ──────────────────────────────────────────────────
  var waNumber = (EH.data && EH.data.site && EH.data.site.whatsapp_intl) || '2290190008300';

  var waLines = [
    '📅 *Demande de RDV — Elegance House Bénin*',
    '',
    '👤 *Cliente*',
    'Prénom : '   + prenom,
    'WhatsApp : ' + whatsapp,
    '',
    '📋 *Objet de la visite*',
    objetLabel,
    '',
    '🗓️ *Disponibilité souhaitée*',
    'Date : '  + dateLabel,
    'Heure : ' + heureLabel,
    message ? '' : null,
    message ? '💬 *Message*' : null,
    message ? '"' + message + '"' : null,
    '',
    '_Demande reçue le ' + new Date().toLocaleDateString('fr-FR') + ' via elegancehouse.bj_'
  ].filter(l => l !== null).join('\n');

  window.open('https://wa.me/' + waNumber + '?text=' + encodeURIComponent(waLines), '_blank');

  // ── Email Formspree (non-bloquant) ─────────────────────────────────────────
  var formspreeId = (EH.data && EH.data.site && EH.data.site.formspree_id) || '';
  if (formspreeId && formspreeId !== 'VOTRE_ID_FORMSPREE') {
    fetch('https://formspree.io/f/' + formspreeId, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        _subject: '📅 Demande de RDV — ' + prenom,
        prenom, whatsapp,
        objet:   objetLabel,
        date:    dateLabel,
        heure:   heureLabel,
        message: message || '—'
      })
    }).catch(e => console.warn('[EH] Email RDV non envoyé :', e));
  }

  // ── Afficher confirmation ──────────────────────────────────────────────────
  var recap = document.getElementById('rdv-recap');
  if (recap) {
    recap.textContent = objetLabel
      + (date ? ' · ' + dateLabel : '')
      + (heure.value ? ' · ' + heureLabel : '');
  }

  document.getElementById('rdv-form').style.display    = 'none';
  document.getElementById('rdv-success').style.display = 'flex';
}

// ── Démarrage ────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => EH.init());
