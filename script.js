
console.log("NEUE RECYCLING-VERSION GELADEN");

// ===================================
// VERPACKUNGEN UND RECYCLING-INFOS
// ===================================

const wasteItems = [
  {
    name: "Lebensmittelglas mit Metalldeckel",
    type: "glass",
    image: "assets/glasmitmetall.png",
    info: "Glas und Metall sind getrennt gut verwertbar. Mehrwegverpackungen sollten zurückgegeben werden."
  },
  {
    name: "Aluminium Lebensmittelschale",
    type: "plastic",
    image: "assets/aluschale.png",
    info: "Metallverpackungen gehören in die Gelbe Tonne und lassen sich bei guter Sortierung recyceln."
  },
  {
    name: "Obstschale aus dünnem Holz",
    type: "plastic",
    image: "assets/obstschale.png",
    info: "Holz ist zwar ein Naturmaterial, gehört als Verkaufsverpackung aber nicht automatisch in die Papiertonne."
  },
  {
    name: "Eierkarton",
    type: "paper",
    image: "assets/eier.png",
    info: "Diese Verpackung besteht aus geformten Papierfasern. Eine saubere Eierverpackung gehört in die Papiertonne."
  },
  {
    name: "Essensverpackung aus Zuckerrohrfasern",
    type: "plastic",
    image: "assets/bagassebox.png",
    info: "Eine pflanzliche Herkunft garantiert noch keine Recyclingfähigkeit. Beschichtete Verbundverpackungen gehören häufig in die Gelbe Tonne."
  },
  {
    name: "Beschichteter To-Go Kaffeebecher",
    type: "plastic",
    image: "assets/kaffeebecher.png",
    info: "Durch die innere Kunststoffbeschichtung handelt es sich um eine Verbundverpackung."
  },
  {
    name: "Verpackung aus PLA-Biokunststoff",
    type: "plastic",
    image: "assets/plaschale.png",
    info: "Auch biologisch abbaubare Kunststoffverpackungen gehören nicht in die Bioabfallsammlung."
  },
  {
    name: "Saftkarton",
    type: "plastic",
    image: "assets/saftbox.png",
    info: "Verbundmaterialien schützen vor Feuchtigkeit, Sauerstoff und Licht, benötigen beim Recycling jedoch spezielle Trennverfahren."
  },
  {
    name: "Mehltüte aus unbeschichtetem Papier",
    type: "paper",
    image: "assets/mehltüte.png",
    info: "Unbeschichtetes Papier kann im Altpapier recycelt werden."
  },
  {
    name: "Joghurtbecher",
    type: "plastic",
    image: "assets/joghurt.png",
    info: "Eine abnehmbare Pappbanderole gehört ins Altpapier. Kunststoffbecher und abgetrennter Aludeckel gehören in die Gelbe Tonne."
  }
];

// ===================================
// HTML-ELEMENTE
// ===================================

const itemElement = document.getElementById("waste-item");
const imageElement = document.getElementById("item-image");
const nameElement = document.getElementById("item-name");
const scoreElement = document.getElementById("score");
const feedbackElement = document.getElementById("feedback");
const startButton = document.getElementById("start-btn");
const bins = document.querySelectorAll(".bin");

// ===================================
// SPIELVARIABLEN
// ===================================

let currentIndex = 0;
let score = 0;
let gameActive = false;
let waitingForNext = false;

let nextItemTimeout = null;
let activePointerId = null;
let startX = 0;
let startY = 0;

// ===================================
// SPIEL STARTEN
// ===================================

function startGame() {

  // Offene Verzögerung zurücksetzen
  clearTimeout(nextItemTimeout);

  // Spielvariablen zurücksetzen
  currentIndex = 0;
  score = 0;
  gameActive = true;
  waitingForNext = false;

  // Anzeige zurücksetzen
  scoreElement.textContent = score;
  feedbackElement.textContent = "";
  startButton.textContent = "Neu starten";

  // Verpackungsbild wieder anzeigen
  imageElement.style.display = "block";

  // Drag & Drop zurücksetzen
  resetDrag();

  // Erste Verpackung anzeigen
  showItem();
}

// ===================================
// AKTUELLE VERPACKUNG ANZEIGEN
// ===================================

function showItem() {

  if (!gameActive) return;

  // Prüfen, ob alle Verpackungen sortiert wurden
  if (currentIndex >= wasteItems.length) {
    endGame();
    return;
  }

  const item = wasteItems[currentIndex];

  // Neues Verpackungsbild laden
  imageElement.src = item.image;
  imageElement.alt = item.name;
  imageElement.style.display = "block";

  // Verpackungsname anzeigen
  nameElement.textContent = item.name;

  // Alte Informationen entfernen
  feedbackElement.textContent = "";

  // Nächste Antwort erlauben
  waitingForNext = false;
}

// ===================================
// ANTWORT ÜBERPRÜFEN
// ===================================

function checkAnswer(selectedType) {

  if (!gameActive || waitingForNext) return;

  waitingForNext = true;

  const currentItem = wasteItems[currentIndex];

  // Richtige oder falsche Antwort
  if (selectedType === currentItem.type) {

    score++;
    scoreElement.textContent = score;

    feedbackElement.textContent =
      "✅ Richtig sortiert!";

  } else {

    feedbackElement.textContent =
      "❌ Leider falsch!";

  }

  // Recyclinginformation anzeigen
  feedbackElement.textContent +=
    " " + (currentItem.info || "");

  // Nach 5 Sekunden nächste Verpackung
  nextItemTimeout = setTimeout(() => {

    if (!gameActive) return;

    currentIndex++;

    showItem();

  }, 5000);
}

// ===================================
// SPIEL BEENDEN
// ===================================

function endGame() {

  gameActive = false;
  waitingForNext = true;

  // Offene Verzögerung stoppen
  clearTimeout(nextItemTimeout);

  // Verpackungsbild ausblenden
  imageElement.style.display = "none";

  // Ergebnis anzeigen
  nameElement.textContent = "Spiel beendet!";

  feedbackElement.textContent =
    `Dein Ergebnis: ${score} von ${wasteItems.length} Punkten`;

  // Neustart ermöglichen
  startButton.textContent = "Erneut spielen";

  resetDrag();
}

// ===================================
// DRAG & DROP ZURÜCKSETZEN
// ===================================

function resetDrag() {
  activePointerId = null;
  itemElement.style.transform = "";
  itemElement.style.pointerEvents = "";
  itemElement.style.cursor = "grab";
  itemElement.classList.remove("dragging");
}

// ===================================
// VERPACKUNG ANKLICKEN
// ===================================

itemElement.addEventListener("pointerdown", (event) => {
  if (!gameActive || waitingForNext) return;

  activePointerId = event.pointerId;
  startX = event.clientX;
  startY = event.clientY;

  itemElement.setPointerCapture(event.pointerId);
  itemElement.style.cursor = "grabbing";
  itemElement.classList.add("dragging");

  event.preventDefault();
});

// ===================================
// VERPACKUNG BEWEGEN
// ===================================

itemElement.addEventListener("pointermove", (event) => {

  if (event.pointerId !== activePointerId) return;

  const moveX = event.clientX - startX;
  const moveY = event.clientY - startY;

  itemElement.style.transform =
    `translate(${moveX}px, ${moveY}px)`;
});

// ===================================
// VERPACKUNG LOSLASSEN
// ===================================

itemElement.addEventListener("pointerup", (event) => {

  if (event.pointerId !== activePointerId) return;

  // Verpackung bei Trefferprüfung ignorieren
  itemElement.style.pointerEvents = "none";

  // Element unter dem Mauszeiger ermitteln
  const target = document.elementFromPoint(
    event.clientX,
    event.clientY
  );

  // Passende Mülltonne suchen
  const bin = target?.closest(".bin");

  // Verpackung zurücksetzen
  resetDrag();

  // Antwort prüfen
  if (bin) {
    checkAnswer(bin.dataset.type);
  }
});

// ===================================
// ABBRUCH DER ZIEHBEWEGUNG
// ===================================

itemElement.addEventListener("pointercancel", resetDrag);

// ===================================
// START-BUTTON
// ===================================

startButton.addEventListener("click", startGame);

// ===================================
// MÜLLTONNEN ANKLICKEN
// ===================================

bins.forEach((bin) => {

  bin.addEventListener("click", () => {

    checkAnswer(bin.dataset.type);

  });

});
