document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("imc-form");
  const resultBox = document.getElementById("result-box");
  const resultNumber = document.getElementById("result-number");
  const statusPill = document.getElementById("status-pill");
  const statusDesc = document.getElementById("status-desc");
  const needle = document.getElementById("gauge-needle");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const poids = parseFloat(document.getElementById("poids").value);
    const tailleCm = parseFloat(document.getElementById("taille").value);

    if (!poids || !tailleCm || poids <= 0 || tailleCm <= 0) {
      alert("Merci de renseigner un poids et une taille valides.");
      return;
    }

    const taille = tailleCm / 100;
    const imc = poids / (taille * taille);

    afficherResultat(imc);
  });

  function afficherResultat(imc) {
    resultNumber.textContent = imc.toFixed(1);

    let categorie = "";
    let description = "";
    let classe = "";
    let imcClamped = Math.min(Math.max(imc, 10), 45);

    if (imc < 18.5) {
      categorie = "Maigreur";
      description = "Votre IMC est en dessous de la moyenne. Pensez à consulter un professionnel de santé si besoin.";
      classe = "is-maigreur";
    } else if (imc < 25) {
      categorie = "Normal";
      description = "Félicitations, votre IMC se situe dans une fourchette considérée comme normale.";
      classe = "is-normal";
    } else if (imc < 30) {
      categorie = "Surpoids";
      description = "Votre IMC indique un surpoids. Une activité physique régulière peut être bénéfique.";
      classe = "is-surpoids";
    } else if (imc < 40) {
      categorie = "Obésité modérée";
      description = "Votre IMC est élevé. Il est recommandé de consulter un professionnel de santé.";
      classe = "is-obesite-mod";
    } else {
      categorie = "Obésité sévère";
      description = "Votre IMC est très élevé. Une consultation médicale est fortement recommandée.";
      classe = "is-obesite-severe";
    }

    statusPill.textContent = categorie;
    statusPill.className = "status-pill " + classe;
    statusDesc.textContent = description;

    const angle = mapRange(imcClamped, 10, 45, -90, 90);
    needle.style.transform = `translateX(-50%) rotate(${angle}deg)`;

    resultBox.classList.remove("hidden");
    resultBox.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }

  function mapRange(value, inMin, inMax, outMin, outMax) {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }
});