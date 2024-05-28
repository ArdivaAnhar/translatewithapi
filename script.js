const selectInputLang = document.getElementById("selectInputLang"),
  selectOutputLang = document.getElementById("selectOutputLang"),
  inputText = document.getElementById("inputText"),
  inputChar = document.getElementById("inputChar"),
  outputText = document.getElementById("outputText"),
  clear = document.getElementById("clear");

const APIUrl = "https://translate-plus.p.rapidapi.com/",
  APIKey = "eda6449c8fmsh92f117f34787b72p175096jsn137607aa9fe4",
  APIHost = "translate-plus.p.rapidapi.com",
  headers = {
    "content-type": "application/json",
    "X-RapidAPI-Key": APIKey,
    "X-RapidAPI-Host": APIHost,
  };

getAllLanguageList();
function getAllLanguageList() {
  const option = {
    method: "GET",
    headers: headers,
  };

  try {
    fetch(APIUrl, option)
      .then((response) => response.json())
      .then((data) => {
        Object.entries(data.supported_languages).forEach(([key, value]) => {
          let option1 = document.createElement("option");
          option1.value = value;
          option1.text = key;
          selectInputLang.append(option1);

          if (value != "auto") {
            let option2 = document.createElement("option");
            option2.value = value;
            option2.text = key;
            selectOutputLang.append(option2);
          }
        });
      });
  } catch (error) {
    console.log(error);
  }
}

inputText.addEventListener("keyup", (e) => {
  if (e.target.value.length > 5000) {
    inputText.value = inputText.value.slice(0, 5000);
  }
  inputChar.innerText = e.target.value.length;
});

clear.addEventListener("click", function () {
  inputText.value = "";
  inputChar.innerText = "0";
  outputText.value = "";
});

inputText.addEventListener("blur", (e) => {
  if (e.target.value.length > 0 && e.target.value != "") {
    const option = {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        text: e.target.value,
      }),
    };

    try {
      fetch(APIUrl + "language_detect", option)
        .then((response) => response.json())
        .then((data) => {
          selectInputLang.value = data.language_detection.language;
        });
    } catch (error) {
      console.log(error);
    }
  }
});

function translateText() {
  const option = {
    method: "POST",
    headers: headers,
    body: JSON.stringify({
      text: inputText.value,
      source: selectInputLang.value,
      target: selectOutputLang.value,
    }),
  };

  try {
    fetch(APIUrl + "translate", option)
      .then((response) => response.json())
      .then((data) => {
        outputText.value = data.translations.translation;
      });
  } catch (error) {
    console.log(error);
  }
}

function swapLanguage(element) {
  let currentText = inputText.value;
  let swapText = outputText.value;

  let currentLang = selectInputLang.value;
  let swapLang = selectOutputLang.value;

  inputText.value = swapText;
  outputText.value = currentText;

  selectInputLang.value = swapLang;
  selectOutputLang.value = currentLang;

  element.classList.toggle("rotateIcon");
}

function copyLanguage(Id) {
  let copyText = Id.value;
  navigator.clipboard.writeText(copyText);
}
