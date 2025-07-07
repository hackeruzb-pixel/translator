const fromText = document.getElementById("fromText");
const toText = document.getElementById("toText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const exchangeIcon = document.querySelector(".exchange-icon");
const translateBtn = document.getElementById("translateBtn");
const icons = document.querySelectorAll(".tools i");
const loadingText = document.getElementById("loadingText");

function loadLanguages() {
  for (const code in countries) {
    const option1 = document.createElement("option");
    option1.value = code;
    option1.textContent = countries[code];
    fromLang.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = code;
    option2.textContent = countries[code];
    toLang.appendChild(option2);
  }

  fromLang.value = "en-GB"; // default from language
  toLang.value = "uz-UZ";   // default to language
}
loadLanguages();

exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = fromLang.value;
  fromText.value = toText.value;
  fromLang.value = toLang.value;
  toText.value = tempText;
  toLang.value = tempLang;
});

translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  if (!text) return;

  let translateFrom = fromLang.value;
  let translateTo = toLang.value;

  doTranslate(text, translateFrom, translateTo);
});

function doTranslate(text, from, to) {
  const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;
  loadingText.style.display = "block";

  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      const translated = data.responseData.translatedText;
      toText.value = translated;
      saveToHistory(text, translated);
    })
    .catch(() => {
      toText.value = "Tarjimada xatolik yuz berdi.";
    })
    .finally(() => {
      loadingText.style.display = "none";
    });
}

function saveToHistory(original, translated) {
  const history = JSON.parse(localStorage.getItem("translateHistory")) || [];
  history.unshift({ original, translated });
  if (history.length > 100) history.pop();
  localStorage.setItem("translateHistory", JSON.stringify(history));
}

icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    const isFrom = target.id === "from";
    const value = isFrom ? fromText.value : toText.value;
    const lang = isFrom ? fromLang.value : toLang.value;

    if (target.classList.contains("fa-copy")) {
      navigator.clipboard.writeText(value);
    } else if (target.classList.contains("fa-volume-up")) {
      if (!value.trim()) return;
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  });
});
