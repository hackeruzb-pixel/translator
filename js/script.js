// const fromText = document.querySelector(".from-text");
// const toText = document.querySelector(".to-text");
// const selectTag = document.querySelectorAll("select");
// const exchangeIcon = document.querySelector(".exchange");
// const translateBtn = document.querySelector("button");
// const icons = document.querySelectorAll(".row i");

// selectTag.forEach((tag, id) => {
//   for (const country_code in countries) {
//     let selected;
//     if (id == 0 && country_code == "en-GB") {
//       selected = "selected";
//     } else if (id == 1 && country_code == "uz-UZ") {
//       selected = "selected";
//     }
//     let option = ` <option value="${country_code}" ${selected}>${countries[country_code]}</option>`;
//     tag.insertAdjacentHTML("beforeend", option);
//   }
// });

// exchangeIcon.addEventListener("click", () => {
//   let tempText = fromText.value;
//   tempLang = selectTag[0].value;
//   fromText.value = toText.value;
//   selectTag[0].value = selectTag[1].value;
//   toText.value = tempText;
//   selectTag[1].value = tempLang;
// });

// translateBtn.addEventListener("click", () => {
//   let text = fromText.value,
//     translateFrom = selectTag[0].value,
//     translateTo = selectTag[1].value;
//   let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
//   fetch(apiUrl)
//     .then((res) => res.json())
//     .then((data) => {
//       toText.value = data.responseData.translatedText;
//     });
// });

// icons.forEach((icon) => {
//   icon.addEventListener("click", ({ target }) => {
//    if (target.classList.contains("fa-copy")) {
//       if (target.id === "from") {
//        navigator.clipboard.writeText(fromText.value)
//       } else if (target.id === "to") {
//          navigator.clipboard.writeText(toText.value)
//       }
//     } else if (target.classList.contains("fa-volume-up")) {
//         let utterance;
//       if (target.id === "from") {
//        utterance = new SpeechSynthesisUtterance(fromText.value)
//        utterance.lang = selectTag[0].value;
//       } else if (target.id === "to") {
//        utterance = new SpeechSynthesisUtterance(toText.value)
//        utterance.lang = selectTag[1].value
//       }
//       speechSynthesis.speak(utterance)
//     }
//   });
// });

const fromText = document.getElementById("fromText");
const toText = document.getElementById("toText");
const fromLang = document.getElementById("fromLang");
const toLang = document.getElementById("toLang");
const exchangeIcon = document.querySelector(".exchange-icon");
const translateBtn = document.getElementById("translateBtn");
const icons = document.querySelectorAll(".tools i");

// Tilni almashtirish
exchangeIcon.addEventListener("click", () => {
  let tempText = fromText.value;
  let tempLang = fromLang.value;
  fromText.value = toText.value;
  fromLang.value = toLang.value;
  toText.value = tempText;
  toLang.value = tempLang;
});

// Tarjima qilish
translateBtn.addEventListener("click", () => {
  let text = fromText.value.trim();
  if (!text) return;
  let translateFrom = fromLang.value;
  let translateTo = toLang.value;
  let apiUrl = `https://api.mymemory.translated.net/get?q=${text}&langpair=${translateFrom}|${translateTo}`;
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      toText.value = data.responseData.translatedText;
    });
});

// Copy va Ovoz
icons.forEach((icon) => {
  icon.addEventListener("click", ({ target }) => {
    if (target.classList.contains("fa-copy")) {
      const value = target.id === "from" ? fromText.value : toText.value;
      navigator.clipboard.writeText(value);
    } else if (target.classList.contains("fa-volume-up")) {
      const value = target.id === "from" ? fromText.value : toText.value;
      const lang = target.id === "from" ? fromLang.value : toLang.value;
      if (!value.trim()) return;
      const utterance = new SpeechSynthesisUtterance(value);
      utterance.lang = lang;
      speechSynthesis.speak(utterance);
    }
  });
});
