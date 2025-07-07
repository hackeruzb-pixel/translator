
const fromText = document.getElementById("fromText");
const toText = document.getElementById("toText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const exchangeIcon = document.querySelector(".exchange-icon");
const translateBtn = document.getElementById("translateBtn");
const icons = document.querySelectorAll(".tools i");
const loadingText = document.getElementById("loadingText");
const imageInput = document.getElementById("imageInput");
const extractBtn = document.getElementById("extractBtn");

function decodeHTMLEntities(text) {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
}

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
  fromLang.value = "en-GB";
  toLang.value = "uz-UZ";
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
  doTranslate(text, fromLang.value, toLang.value);
});

function doTranslate(text, from, to) {
  loadingText.style.display = "block";
  const sentences = text.split(/\n+/).filter(s => s.trim());

  Promise.all(
    sentences.map(sentence => {
      const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(sentence)}&langpair=${from}|${to}`;
      return fetch(apiUrl)
        .then(res => res.json())
        .then(data => {
          if (data.responseStatus === 429 || data.matches[0]?.segment === "LIMIT EXCEEDED") {
            throw new Error("Limit tugadi");
          }
          return decodeHTMLEntities(data.responseData.translatedText);
        })
        .catch(err => {
          if (err.message === "Limit tugadi") {
            const now = new Date();
            now.setHours(now.getHours() + 1);
            const time = now.toLocaleTimeString("uz-UZ");
            toText.value = `⚠️ Tarjima limiti tugadi.\n🔄 Yana ${time} da urinib ko‘ring.`;
          } else {
            toText.value = "❌ Tarjimada xatolik yuz berdi.";
          }
        });
    })
  )
    .then(results => {
      const finalText = results.filter(Boolean).join("\n\n");
      if (!toText.value.startsWith("⚠️")) {
        toText.value = finalText;
        saveToHistory(text, finalText);
      }
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

extractBtn.addEventListener("click", () => {
  const file = imageInput.files[0];
  if (!file) {
    alert("Iltimos, rasm tanlang.");
    return;
  }

  loadingText.style.display = "block";

  Tesseract.recognize(
    file,
    'eng+rus+uzb', 
    {
      logger: m => console.log(m)
    }
  )
    .then(({ data: { text } }) => {
      const cleanText = text.trim();
      fromText.value = cleanText;
      if (cleanText) {
        doTranslate(cleanText, fromLang.value, toLang.value);
      }
    })
    .catch(err => {
      console.error("OCR xato:", err);
      alert("Rasmdan matn o‘qib bo‘lmadi.");
    })
    .finally(() => {
      loadingText.style.display = "none";
    });
});
