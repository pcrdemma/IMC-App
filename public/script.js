// ========== IMC CALCULATOR - SCRIPT PRINCIPAL ==========

// Configuration API
const API_BASE = window.location.origin + '/api';

// ========== EVENT LISTENERS ==========

document.addEventListener('DOMContentLoaded', function() {
  console.log('✅ Application chargée');
  chargerHistoriqueLocal();

  // Event listener sur le formulaire
  const form = document.getElementById('imc-form');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await calculerIMC();
  });
});

// ========== CALCULER L'IMC ==========

async function calculerIMC() {
  const poids = parseFloat(document.getElementById('poids').value);
  const taille = parseFloat(document.getElementById('taille').value);

  // Validation
  if (!poids || !taille || poids <= 0 || taille <= 0) {
    afficherErreur('❌ Veuillez entrer des valeurs valides');
    return;
  }

  if (poids > 300 || taille > 250) {
    afficherErreur('❌ Les valeurs semblent incorrectes');
    return;
  }

  try {
    // Appel à l'API
    const response = await fetch(`${API_BASE}/calculer-imc`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ poids, taille })
    });

    if (!response.ok) {
      throw new Error('Erreur serveur');
    }

    const data = await response.json();

    if (data.succes) {
      const imc = data.donnees.imc;
      const categorie = data.donnees.categorie;
      const couleur = data.donnees.couleur;
      const date = data.donnees.date;

      // Affiche le résultat
      afficherResultat(imc, categorie, couleur);
      
      // Sauvegarde dans localStorage
      sauvegarderHistoriqueLocal({
        poids,
        taille,
        imc,
        categorie,
        couleur,
        date
      });

      viderFormulaireEnDouceur();
      chargerHistoriqueLocal();
      afficherSucces('✅ IMC calculé avec succès !');
    } else {
      afficherErreur('❌ ' + (data.erreur || 'Erreur lors du calcul'));
    }

  } catch (error) {
    console.error('Erreur réseau:', error);
    afficherErreur('❌ Erreur de connexion au serveur. Vérifiez que le serveur est lancé.');
  }
}

// ========== SAUVEGARDER DANS LOCALSTORAGE ==========

function sauvegarderHistoriqueLocal(calcul) {
  let historique = JSON.parse(localStorage.getItem('imc_historique')) || [];
  
  const nouveauCalcul = {
    id: Date.now(),
    ...calcul
  };
  
  historique.unshift(nouveauCalcul); // Ajouter au début
  historique = historique.slice(0, 50); // Garder max 50 calculs
  
  localStorage.setItem('imc_historique', JSON.stringify(historique));
}

// ========== CHARGER DEPUIS LOCALSTORAGE ==========

function chargerHistoriqueLocal() {
  const historique = JSON.parse(localStorage.getItem('imc_historique')) || [];
  
  if (historique.length > 0) {
    afficherHistorique(historique);
    document.getElementById('empty-message').style.display = 'none';
  } else {
    afficherHistoriqueVide();
  }
}

// ========== AFFICHER LE RÉSULTAT ==========

function afficherResultat(imc, categorie, couleur) {
  const resultBox = document.getElementById('result-box');
  const resultNumber = document.getElementById('result-number');
  const statusPill = document.getElementById('status-pill');
  const statusDesc = document.getElementById('status-desc');

  resultNumber.textContent = imc;
  statusPill.textContent = categorie;
  statusPill.className = `status-pill status-${couleur}`;

  // Messages descriptifs
  const messages = {
    'Maigreur': 'Vous êtes en dessous du poids normal. Une consultation médicale est recommandée.',
    'Normal': '✅ Vous avez un poids sain. Continuez ainsi !',
    'Surpoids': '⚠️ Vous êtes en surpoids. Une activité physique régulière est recommandée.',
    'Obésité modérée': '⚠️ Consultez un médecin ou un nutritionniste pour un suivi personnalisé.',
    'Obésité sévère': '🚨 Consultez rapidement un médecin ou un nutritionniste.'
  };

  statusDesc.textContent = messages[categorie] || 'Consultez un professionnel de santé.';

  // Animer l'aiguille du gauge
  animer_aiguille(imc);

  // Afficher la boîte de résultat
  resultBox.classList.remove('hidden');
  resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ========== ANIMER L'AIGUILLE DU GAUGE ==========

function animer_aiguille(imc) {
  const needle = document.getElementById('gauge-needle');

  // Limiter l'IMC pour l'animation (max 50)
  const imcAffiche = Math.min(imc, 50);

  // Calculer l'angle (-90 à +90 degrés)
  const angle = -90 + (imcAffiche / 50) * 180;

  // Animer
  needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;
}

// ========== AFFICHER L'HISTORIQUE DANS LA TABLE ==========

function afficherHistorique(donnees) {
  const tbody = document.querySelector('#historique-table tbody');
  tbody.innerHTML = '';

  donnees.forEach((calcul, index) => {
    const row = tbody.insertRow(index);

    // Formater la date
    const dateStr = calcul.date || new Date().toLocaleString('fr-FR');

    // Mapper couleur → classe badge
    const colorMap = {
      'blue': 'badge-blue',
      'green': 'badge-green',
      'yellow': 'badge-yellow',
      'orange': 'badge-orange',
      'red': 'badge-red'
    };

    const badgeClass = colorMap[calcul.couleur] || 'badge-blue';

    row.innerHTML = `
      <td><strong>${calcul.poids}</strong></td>
      <td><strong>${calcul.taille}</strong></td>
      <td><strong style="color: #2563EB; font-size: 16px;">${calcul.imc}</strong></td>
      <td><span class="badge ${badgeClass}">${calcul.categorie}</span></td>
      <td style="color: #94A3B8; font-size: 12px;">${dateStr}</td>
      <td>
        <button onclick="supprimerCalcul(${calcul.id})" title="Supprimer" style="color: #e74c3c; background: none; border: none; cursor: pointer; font-size: 18px; padding: 5px;">
          🗑️
        </button>
      </td>
    `;
  });
}

// ========== AFFICHER MESSAGE VIDE ==========

function afficherHistoriqueVide() {
  const tbody = document.querySelector('#historique-table tbody');
  tbody.innerHTML = '';
  document.getElementById('empty-message').style.display = 'block';
}

// ========== SUPPRIMER UN CALCUL ==========

function supprimerCalcul(id) {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce calcul ?')) {
    return;
  }

  let historique = JSON.parse(localStorage.getItem('imc_historique')) || [];
  historique = historique.filter(calcul => calcul.id !== id);
  
  localStorage.setItem('imc_historique', JSON.stringify(historique));
  chargerHistoriqueLocal();
  afficherSucces('✅ Calcul supprimé avec succès');
}

// ========== VIDER LE FORMULAIRE ==========

function viderFormulaireEnDouceur() {
  const poids = document.getElementById('poids');
  const taille = document.getElementById('taille');

  setTimeout(() => {
    poids.value = '';
    taille.value = '';
    poids.focus();
  }, 1000);
}

// ========== MESSAGES D'ERREUR/SUCCÈS ==========

function afficherErreur(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #fee;
    border-left: 4px solid #ff0000;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
    font-size: 14px;
    color: #c00;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 4000);
}

function afficherSucces(message) {
  const notification = document.createElement('div');
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background-color: #efe;
    border-left: 4px solid #45e05f;
    padding: 16px;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 1000;
    max-width: 400px;
    animation: slideIn 0.3s ease;
    font-size: 14px;
    color: #060;
  `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOut 0.3s ease';
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

console.log('✅ Script IMC Calculator chargé avec succès');