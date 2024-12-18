//**************************************************************************************************************//
//--формируем шапку--
//**************************************************************************************************************//

document.body.insertAdjacentHTML(
  "afterbegin",
  '<div class="wrapper"><div class="container"><header class="header"><h1 class="title">RSS Gem Puzzle</h1><h2 class="subtitle">choose frame size</h2><div class="buttons"></div><div class="menu"></div><h2 class="subtitle"><button class="sound-icon no-sound"></button>Frame size:<span class="size">4x4</span></h2></header><div class="field"></div></div><footer><a href="https://tlgg.ru/Irin_Tomsk">Autor</a></footer></div>'
);
let buttons = document.querySelector(".buttons"),
  menu = document.querySelector(".menu");
for (let i = 3; i < 9; i++) {
  {
    buttons.insertAdjacentHTML(
      "beforeend",
      `<button class="btn" value=\"${i}x${i}\">${i}x${i}</button>`
    );
  }
}
menu.insertAdjacentHTML(
  "beforeend",
  "<button class='menu__item item-save btn'>save</button>"
);
menu.insertAdjacentHTML(
  "beforeend",
  "<button class='menu__item item-last-save btn'>last save</button>"
);
menu.insertAdjacentHTML(
  "beforeend",
  "<button class='menu__item item-restart btn'></button>"
);
menu.insertAdjacentHTML(
  "beforeend",
  "<button class='menu__item item-win-list btn'>win list</button>"
);
menu.insertAdjacentHTML(
  "beforeend",
  "<div class='menu__item item-timer'><span class='minute'></span>:<span class='second'></span></div>"
);
menu.insertAdjacentHTML(
  "beforeend",
  "<div class='menu__item item-moves'>Moves: <span class='moves'></span></div>"
);
//**************************************************************************************************************//
//--переменные--
//**************************************************************************************************************//
let items,
  moves = 0,
  level = 4,
  itemsLength = 16,
  minute = 0,
  second = 0,
  time,
  winArr,
  sizeElem = document.querySelector(".size"),
  itemSaveElem = document.querySelector(".item-save"),
  itemLastSaveElem = document.querySelector(".item-last-save"),
  moveElem = document.querySelector(".moves"),
  itemWinListElem = document.querySelector(".item-win-list"),
  lastGame = {},
  audioObj,
  soundIconElem = document.querySelector(".sound-icon");
soundIconElem.addEventListener("click", () => {
  soundIconElem.classList.toggle("no-sound");
  if (audioObj) {
    audioObj = 0;
  } else {
    audioObj = new Audio((url = "./assets/urr-cute.mp3"));
  }
});

//**************************************************************************************************************//
//--переменные для таймера--
//**************************************************************************************************************//
let minuteElement = document.querySelector(".minute");
let secondElement = document.querySelector(".second");
let itemRestartBtn = document.querySelector(".item-restart");
//**************************************************************************************************************//
//--начальное значение winArr--
//**************************************************************************************************************//
if (
  JSON.parse(localStorage.getItem("winArr"))?.length &&
  JSON.parse(localStorage.getItem("winArr"))
)
  winArr = JSON.parse(localStorage.getItem("winArr"));
else winArr = [];
itemWinListElem.addEventListener("click", () => {
  alert(JSON.stringify(winArr));
});
//**************************************************************************************************************//
//--clearParam--
//**************************************************************************************************************//
function clearParam() {
  moves = 0;
  moveElem.innerText = "";
  minuteElement.innerText = "00";
  secondElement.innerText = "00";
  itemRestartBtn.innerText = "start";
  clearTimer();
}
clearParam();
//**************************************************************************************************************//
//--удалить таблицу--
//**************************************************************************************************************//
function deleteField() {
  let deleteFieldRow = document.querySelectorAll(".field__row");
  for (elem of deleteFieldRow) elem.remove();
}
//**************************************************************************************************************//
//-- извлечь параметры из кнопок (получить уровень игры)--
//**************************************************************************************************************//
buttons.addEventListener("click", (e) => {
  let target = e.target;
  if (target.value) {
    sizeElem.textContent = target.value;
    level = target.value[0];
    itemsLength = level * level;
    deleteField();
    buildField();
    clearParam();
  }
});
//**************************************************************************************************************//
//--перемешать массив--
//**************************************************************************************************************//
function shuffle() {
  items.sort(() => Math.random() - 0.5);
}

//**************************************************************************************************************//
//--сохранение игры--
//**************************************************************************************************************//
function saveGame() {
  lastGame.moves = moves;
  lastGame.minute = minute;
  lastGame.second = second;
  lastGame.items = items;
  lastGame.level = sizeElem.textContent;
  level = sizeElem.textContent[0];
}

itemSaveElem.addEventListener("click", () => {
  saveGame();

  localStorage.setItem("lastGame", JSON.stringify(lastGame));
});

//**************************************************************************************************************//
//--возврат к последей сохраненной игре--
//**************************************************************************************************************//
function backToLastGame() {
  lastGame = JSON.parse(localStorage.getItem("lastGame"));
  moves = lastGame.moves;
  moveElem.innerText = `${lastGame.moves}`;
  minuteElement.innerText = `${lastGame.minute}`;
  secondElement.innerText = `${lastGame.second}`;
  sizeElem.textContent = `${lastGame.level}`;
  clearTimer();
  second = +lastGame.second;
  minute = +lastGame.minute;
  level = sizeElem.textContent[0];
  itemsLength = level * level;
  deleteField();
  buildField();
  itemsLength = level * level;
  items = [];
  //-- заполнить массив--
  for (let i = 0; i < itemsLength; i++) {
    items[i] = lastGame.items[i];
  }
  colorFieldText();
}

itemLastSaveElem.addEventListener("click", () => {
  backToLastGame();
  moveCell();

  startTimer();
});

//**************************************************************************************************************//
//--функция старта таймера--
//**************************************************************************************************************//
function startTimer() {
  time = setInterval(timer, 1000);
}
//**************************************************************************************************************//
//--функция сброса  таймера--
//**************************************************************************************************************//
function clearTimer() {
  clearInterval(time);
  second = 0;
  minute = 0;
}
//**************************************************************************************************************//
//--функция  таймера--
//**************************************************************************************************************//
function timer() {
  second++;
  if (second <= 60) {
    if (second < 10) {
      second = "0" + second;
      secondElement.innerText = second;
    }
    if (second > 9) {
      second = second;
      secondElement.innerText = second;
    }
  } else {
    second = "00";
    secondElement.innerText = second;
    second = 0;
    minute++;
    if (minute <= 60) {
      if (minute < 10) {
        minute = "0" + minute;
        minuteElement.innerText = minute;
      }
      if (minute > 9) {
        minute = minute;
        minuteElement.innerText = minute;
      }
    }
  }
}
//**************************************************************************************************************//
//-- сформировать таблицу
//**************************************************************************************************************//
function buildField() {
  for (let i = 0; i < level; i++) {
    let fieldRow = "<div class='field__row' >";
    for (let j = 0; j < level; j++) {
      fieldRow += "<div class='field__item'></div>";
    }
    fieldRow += "</div>";
    document.querySelector(".field").insertAdjacentHTML("beforeend", fieldRow);
  }
}
buildField();
fillTable();

//colorFieldText();
//**************************************************************************************************************//
//-- заполнить массив  значениями--
//**************************************************************************************************************//

function fillTable() {
  items = [];
  //-- заполнить массив--
  for (let i = 0; i < itemsLength; i++) {
    items[i] = i;
  }
}
//**************************************************************************************************************//
//--закрасить значения полей--
//**************************************************************************************************************//

function colorFieldText() {
  let fieldItem = document.querySelectorAll(".field__item");
  for (let i = 0; i < itemsLength; i++) {
    fieldItem[i].innerText = items[i];
    if (items[i] == 0) {
      fieldItem[i].style.color = "#dde0e7";
      fieldItem[i].style.backgroundColor = "#dde0e7";
    } else {
      fieldItem[i].style.color = "#616161";
      fieldItem[i].style.backgroundColor = "#e2bbef";
    }
  }
}
//**************************************************************************************************************//
//--нажать на кнопку restart--
//**************************************************************************************************************//

itemRestartBtn.addEventListener("click", () => {
  fillTable();
  shuffle();

  colorFieldText();
  clearParam();
  startTimer();
  if (itemRestartBtn.innerText == "start") {
    itemRestartBtn.innerText = "restar";
  }
  moveCell();
});

//**************************************************************************************************************//
//--проверка на решаемость--
//**************************************************************************************************************//
function checkValidity(level, items) {
  let inversionCount = 0;
  let emptyPosition = 0;
  let sum = 0;
  function getEmptyPosition() {
    let e = 0;
    for (i = 0; i < items.length; i++) {
      if (items[i] == 0) {
        e = Math.floor(i / level) + 1;
      }
    }
    return e;
  }
  function getInversionCount() {
    let n = 0;
    let k = 0;
    for (i = 0; i < items.length; i++) {
      for (j = i + 1; j < items.length; j++) {
        if ((items[j] < items[i]) & (items[j] !== 0)) n++;
      }
      k += n;
      n = 0;
    }
    return k;
  }
  inversionCount = getInversionCount();
  if (level % 2) {
    sum = inversionCount;
  } else {
    sum = inversionCount + getEmptyPosition();
  }

  if (sum % 2) {
    {
      shuffle(items);
      checkValidity(level, items);
    }
  } else {
    return true;
  }
}

//--перемешать --
shuffle(items);
//--проверить на решаемость --
checkValidity(level, items);

//**************************************************************************************************************//
//--сделать ход--
//**************************************************************************************************************//
function moveCell() {
  items = [];
  let item = "";
  let fieldItem = document.querySelectorAll(".field__item");
  let field = document.querySelectorAll(".field");
  for (let i = 0; i < itemsLength; i++) {
    items[i] = fieldItem[i].textContent;
  }

  fieldItem.forEach(function (elem) {
    elem.addEventListener("click", function () {
      if (audioObj) audioObj.play();
      moves++;
      moveElem.innerText = moves;
      for (i = 0; i < itemsLength; i++) {
        if (items[i] == elem.textContent) {
          if (items[i - level] == 0) {
            items[i - level] = items[i];
            items[i] = 0;
            colorFieldText();
          } else if (items[i + +level] == 0) {
            items[i + +level] = items[i];
            items[i] = 0;
            colorFieldText();
          } else if (items[i - 1] == 0) {
            items[i - 1] = items[i];
            items[i] = 0;
            colorFieldText();
          } else if (items[i + 1] == 0) {
            items[i + 1] = items[i];
            items[i] = 0;
            colorFieldText();
          }
        }
      }
      checkWin(items, itemsLength);
    });
  });
}
//**************************************************************************************************************//
//--проверить на выигрышь, записать результат--
//**************************************************************************************************************//

function checkWin(items) {
  let counter = 0;
  for (let i = 0; i < itemsLength; i++) {
    if (items[i] == i + 1) counter++;
  }
  if (counter >= itemsLength - 1) {
    let winObj = {};
    winObj.time = minuteElement.innerText + ":" + secondElement.innerText;
    minuteElement.innerText = "00";
    secondElement.innerText = "00";
    clearTimer();
    winObj.moves = moveElem.innerText;
    moveElem.innerText = "";
    winObj.level = level;
    itemRestartBtn.innerText = "start";
    deleteField();
    buildField(level);

    alert(
      `Ура! Вы решили головоломку за ${winObj.time} и ${winObj.moves} ходов!`
    );
    winArr.push(winObj);
    localStorage.setItem("winArr", JSON.stringify(winArr));
  }
}
moveCell();
