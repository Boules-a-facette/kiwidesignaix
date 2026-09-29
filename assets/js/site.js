(function () {
  'use strict';

  // Adresse de destination du formulaire (mailto:). Seule occurrence dans le site.
  var CONTACT_EMAIL = 'mallorym@hotmail.fr';

  var root = document.documentElement;

  /* ---------- Menu burger ---------- */
  var toggle = document.querySelector('.menu-toggle');
  var panel = document.getElementById('menu-panel');
  var overlay = document.querySelector('.menu-overlay');

  function setMenu(open) {
    root.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (!open) { toggle.focus({ preventScroll: true }); }
  }

  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      setMenu(!root.classList.contains('menu-open'));
    });
    if (overlay) { overlay.addEventListener('click', function () { setMenu(false); }); }
    panel.addEventListener('click', function (e) {
      // clic sur un lien, ou dans le vide du panneau : on referme
      if (e.target.closest('a') || e.target === panel || e.target.tagName === 'UL') { setMenu(false); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('menu-open')) { setMenu(false); }
    });
  }

  /* ---------- Retour en haut ---------- */
  var toTop = document.querySelector('.to-top');
  if (toTop) {
    var onScroll = function () {
      toTop.classList.toggle('is-visible', window.pageYOffset > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Visionneuse de la galerie ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.gallery a'));
  if (links.length) {
    var box = document.createElement('div');
    box.className = 'lightbox';
    box.hidden = true;
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Visionneuse d’images');
    box.innerHTML =
      '<button type="button" class="lb-close" aria-label="Fermer">&times;</button>' +
      '<button type="button" class="lb-prev" aria-label="Image précédente">&#8249;</button>' +
      '<img alt="">' +
      '<button type="button" class="lb-next" aria-label="Image suivante">&#8250;</button>';
    document.body.appendChild(box);

    var big = box.querySelector('img');
    var current = 0;
    var opener = null;
    var focusables = [
      box.querySelector('.lb-close'),
      box.querySelector('.lb-prev'),
      box.querySelector('.lb-next')
    ];

    var show = function (i) {
      current = (i + links.length) % links.length;
      big.src = links[current].getAttribute('href');
      big.alt = links[current].getAttribute('title') || '';
    };
    var open = function (i) {
      opener = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden'; // pas de defilement de la page derriere
      focusables[0].focus();
    };
    var close = function () {
      box.hidden = true;
      big.removeAttribute('src');
      document.body.style.overflow = '';
      if (opener) { opener.focus({ preventScroll: true }); }
    };

    links.forEach(function (a, i) {
      a.addEventListener('click', function (e) {
        // Ctrl/Cmd + clic : on laisse le navigateur ouvrir l'image dans un onglet
        if (e.ctrlKey || e.metaKey || e.shiftKey) { return; }
        e.preventDefault();
        open(i);
      });
    });
    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) { close(); } });
    document.addEventListener('keydown', function (e) {
      if (box.hidden) { return; }
      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowLeft') { show(current - 1); }
      else if (e.key === 'ArrowRight') { show(current + 1); }
      else if (e.key === 'Tab') {
        // le focus reste dans la visionneuse tant qu'elle est ouverte
        var i = focusables.indexOf(document.activeElement);
        var nextIndex = e.shiftKey ? i - 1 : i + 1;
        if (i === -1) { nextIndex = 0; }
        e.preventDefault();
        focusables[(nextIndex + focusables.length) % focusables.length].focus();
      }
    });
  }

  /* ---------- Formulaire de contact (mailto:) ---------- */
  var form = document.getElementById('contact-form');
  if (form) {
    var status = form.querySelector('.form-status');
    var rules = [
      { id: 'f-nom', required: 'Merci de renseigner votre nom.' },
      { id: 'f-email', email: 'Merci de saisir une adresse e-mail valide.' },
      { id: 'f-projet', required: 'Merci de préciser le type de projet.' },
      { id: 'f-message', required: 'Merci de saisir votre message.' }
    ];

    var setError = function (field, message) {
      var out = document.getElementById(field.id.replace('f-', 'err-'));
      out.textContent = message || '';
      if (message) { field.setAttribute('aria-invalid', 'true'); }
      else { field.removeAttribute('aria-invalid'); }
    };

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      var firstBad = null;

      rules.forEach(function (rule) {
        var field = document.getElementById(rule.id);
        var value = field.value.trim();
        var message = '';
        if (rule.required && !value) { message = rule.required; }
        else if (rule.email && value && value.indexOf('@') < 1) { message = rule.email; }
        setError(field, message);
        if (message && !firstBad) { firstBad = field; }
      });

      if (firstBad) { firstBad.focus(); return; }

      var nom = form.elements.nom.value.trim();
      var bodyParts = [
        'Nom : ' + nom,
        'E-mail : ' + form.elements.email.value.trim(),
        'Type de projet : ' + form.elements.projet.value.trim(),
        '',
        form.elements.message.value.trim()
      ];
      // Le champ piege remplit vaut robot : on affiche le meme message, sans ouvrir le
      // logiciel de messagerie, pour ne pas piéger un visiteur dont le navigateur l'a rempli.
      var piege = form.elements.hp_kiwi && form.elements.hp_kiwi.value;
      status.textContent = 'Votre logiciel de messagerie va s’ouvrir avec votre message.';
      if (piege) { return; }

      window.location.href = 'mailto:' + CONTACT_EMAIL +
        '?subject=' + encodeURIComponent('Site Kiwi - message de ' + nom) +
        '&body=' + encodeURIComponent(bodyParts.join('\r\n'));
    });
  }
})();
