// Le contenu vit dans le dossier content/ : ce fichier n'a normalement pas besoin d'être modifié.
const $ = s => document.querySelector(s);
const esc = s => String(s).replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
let SITE, ARTICLES, CV;

async function init() {
  try {
    const get = u => fetch(u).then(r => { if (!r.ok) throw new Error(u + ' introuvable'); return r.json(); });
    [SITE, ARTICLES, CV] = await Promise.all([get('content/site.json'), get('content/articles.json'), get('content/cv.json')]);
  } catch (e) {
    $('main').innerHTML = '<p class="note">Impossible de charger le contenu : ' + esc(e.message) +
      '. Vérifie le JSON (virgules, guillemets) ; en local, lance un petit serveur (voir le README).</p>';
    return;
  }
  $('#nom').textContent = SITE.nom;
  $('#titre').textContent = SITE.nom + ' — ' + SITE.sous_titre;
  $('#lead').textContent = SITE.presentation;
  $('#contact-texte').innerHTML = SITE.contact;
  $('#pied').textContent = '© ' + new Date().getFullYear() + ' ' + SITE.nom;
  $('#axes-liste').innerHTML = SITE.axes.map(a => '<div><h3>' + esc(a.titre) + '</h3><p>' + esc(a.texte) + '</p></div>').join('');
  renderList(); renderCV();
  window.addEventListener('hashchange', showView);
  showView();
}

function renderList() {
  const themes = [...new Set(ARTICLES.map(a => a.theme))];
  $('#filtres').innerHTML = ['Tous', ...themes].map((t, i) =>
    '<button type="button" data-f="' + (i ? esc(t) : 'all') + '" aria-pressed="' + (i === 0) + '">' + esc(t) + '</button>').join('');
  $('#liste').innerHTML = ARTICLES.map(a =>
    '<li data-t="' + esc(a.theme) + '"><h3><a href="' + (a.lien && !window.PREVIEW_PAGES ? esc(a.lien) : '#' + esc(a.id)) + '">' + esc(a.titre) + '</a></h3><p class="meta">' +
    esc(a.theme) + ' · ' + esc(a.date) + '</p><p>' + esc(a.resume) + '</p></li>').join('');
  document.querySelectorAll('.filters button').forEach(b => b.addEventListener('click', () => {
    document.querySelectorAll('.filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    document.querySelectorAll('.texts li').forEach(li => li.hidden = !(b.dataset.f === 'all' || li.dataset.t === b.dataset.f));
  }));
}

function renderCV() {
  $('#cv-content').innerHTML = '<h2>Curriculum vitae</h2>' + CV.sections.map(s =>
    '<h3>' + esc(s.titre) + '</h3><dl>' + s.lignes.map(l =>
      '<div class="row' + (l.date ? '' : ' nd') + '">' + (l.date ? '<dt>' + esc(l.date) + '</dt>' : '') + '<dd><strong>' + esc(l.titre) + '</strong>' +
      (l.detail ? '<span>' + esc(l.detail) + '</span>' : '') + '</dd></div>').join('') + '</dl>').join('');
}

async function renderArticle(a) {
  const list = ARTICLES.filter(x => !x.lien), i = list.indexOf(a), prev = list[i - 1], next = list[i + 1], el = $('#article');
  if (a.lien) { // aperçu uniquement : page externe affichée dans un cadre
    el.innerHTML = '<a class="back" href="#accueil">← Tous les textes</a><iframe title="' + esc(a.titre) + '" style="width:100%;height:1500px;border:0;margin-top:1rem"></iframe>';
    el.querySelector('iframe').srcdoc = window.PREVIEW_PAGES[a.lien]; window.scrollTo(0, 0); return;
  }
  let corps;
  try {
    const md = await fetch('content/articles/' + a.fichier).then(r => { if (!r.ok) throw 0; return r.text(); });
    corps = marked.parse(md);
  } catch (e) { corps = '<p>Fichier introuvable : content/articles/' + esc(a.fichier) + '</p>'; }
  el.innerHTML = '<a class="back" href="#accueil">← Tous les textes</a><h1>' + esc(a.titre) + '</h1><p class="meta">' +
    esc(a.theme) + ' · ' + esc(a.date) + '</p><p class="resume">' + esc(a.resume) + '</p><div class="corps">' + corps + '</div>' +
    '<div class="pager"><span>' + (prev ? '<a href="#' + prev.id + '">← Texte précédent</a>' : '') + '</span><span>' +
    (next ? '<a href="#' + next.id + '">Texte suivant →</a>' : '') + '</span></div>';
  document.title = a.titre + ' — ' + SITE.nom;
  window.scrollTo(0, 0);
}

function showView() {
  const h = location.hash.slice(1), art = ARTICLES.find(a => a.id === h && (!a.lien || window.PREVIEW_PAGES));
  const v = h === 'cv' ? 'cv' : (art ? 'art' : 'home');
  document.querySelectorAll('.v-home').forEach(e => e.hidden = v !== 'home');
  document.querySelectorAll('.v-cv').forEach(e => e.hidden = v !== 'cv');
  document.querySelectorAll('.v-art').forEach(e => e.hidden = v !== 'art');
  $('#t-cv').setAttribute('aria-current', v === 'cv' ? 'page' : 'false');
  $('#t-home').setAttribute('aria-current', v === 'home' ? 'page' : 'false');
  if (v === 'art') renderArticle(art);
  else { document.title = v === 'cv' ? 'CV — ' + SITE.nom : SITE.nom + ' — ' + SITE.sous_titre; window.scrollTo(0, 0); }
}
init();
