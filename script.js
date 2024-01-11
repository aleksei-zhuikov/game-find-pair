// Выбираем все карточки
const cards = document.querySelectorAll('.memory-card');

// Выбираем кнопку начать игру, таймер и контейнер игры
const btnStartGame = document.getElementById('btn-start-game');
const btnPlayAgain = document.getElementById('btn-play-again');
const timerEl = document.getElementById('timer');
let cardsArraySuccess = [];

let timerId = null;

// переменные для карточек
let openStatus = false,
  success = false;
let firstCard = null,
  secondCard = null;
let lockBoard = true;

updateNumbers();

// открываем карты
function openCard() {

  if (firstCard !== null && secondCard !== null) {
    if (firstCard.innerHTML !== secondCard.innerHTML) {
      firstCard.classList.remove('open');
      secondCard.classList.remove('open');
      firstCard = null;
      secondCard = null;
    }
  }

  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add('open');

  if (openStatus == false) {
    openStatus = true;
    firstCard = this;
    return;
  }

  secondCard = this;

  checkMatchCards();
}


// Проверка карт на совпадение
function checkMatchCards() {
  if (firstCard.innerHTML === secondCard.innerHTML) {

    //добавляем совпавшие карты в массив
    cardsArraySuccess.push(firstCard, secondCard);

    setTimeout(() => {
      firstCard.classList.add('success');
      secondCard.classList.add('success');
      firstCard.classList.add('memory-card_no-border');
      secondCard.classList.add('memory-card_no-border');

      let timeGame = 60;
      let winTime = timeGame - timerEl.innerHTML;

      if (document.querySelectorAll('.memory-card').length == cardsArraySuccess.length) {
        alert(`Поздравляем, Вы нашли ВСЕ совпадения за: ${winTime} секунд.\n У Вас осталось времени: ${timerEl.innerHTML} секунд`)
        clearInterval(timerId);
        btnStartGame.removeEventListener('click', onStartGameButtonClick);
        btnPlayAgain.classList.add('button-play-again_block');
      }

      // console.log('длина карт success добавлено в массив >>>', cardsArraySuccess.length);
      // console.log('длина карт success найдено всего >>>', document.querySelectorAll('.memory-card.open.success').length);

      firstCard = null;
      secondCard = null;
    }, 500);

    disabledCards();
    return;
  }

  resetBoard();

}

//вешаем слушателя на кнопку - начать игру -
btnStartGame.addEventListener('click', onStartGameButtonClick);

function onStartGameButtonClick() {

  lockBoard = false;

  btnStartGame.innerHTML = 'игра началась';
  btnStartGame.classList.add('_btn-start_active');
  btnStartGame.classList.add('_btn-start_hover');


  // Таймер обратного отсчета
  function timer() {

    btnStartGame.disabled = true;
    timerEl.innerHTML--;

    if (timerEl.innerHTML == 0) {

      alert('Увы, время закончилось.\n Вы можете попробовать снова.\n Просто нажмите на кнопку \'Сыграть еще раз\'')

      btnStartGame.classList.remove('_btn-start_active');
      btnStartGame.classList.remove('_btn-start_hover');
      btnStartGame.style.display = 'none';
      btnPlayAgain.classList.add('button-play-again_block');

      lockBoard = true;
      clearInterval(timerId);
    }

  }
  timerId = setInterval(timer, 1000);
}


// удаляем слушателя с карт при совпадении
function disabledCards() {
  firstCard.removeEventListener('click', openCard);
  secondCard.removeEventListener('click', openCard);

  resetBoard();
}

function resetBoard() {
  [openStatus, lockBoard] = [false, false];
}

// // Перемешивание карт
// (function shuffle() {
//   cards.forEach(card => {
//     let randomPosition = Math.floor(Math.random() * 18);
//     card.style.order = randomPosition;
//   })
// })();

// проходим по карточкам и добавляем каждой событие и класс переворота
cards.forEach(card => card.addEventListener('click', openCard));



// Вешаем слушателя на кнопку - сыграть еще раз -
btnPlayAgain.addEventListener('click', function () {
  btnStartGame.disabled = false;
  btnStartGame.style.display = 'block';
  btnStartGame.innerHTML = 'начать игру';
  timerEl.innerHTML = 60;

  btnPlayAgain.classList.remove('button-play-again_block');

  refreshBoard();
});

function refreshBoard() {
  //обновляем числа с задержкой чтобы при обновлении доски их не запомнили
  setTimeout(() => {
    updateNumbers();
  }, 250)

  // удаляем у карточек классы и убираем бордюр
  for (let i = 0; i < cards.length; i++) {
    cards[i].classList.remove('open');
    cards[i].classList.remove('success');
    cards[i].classList.remove('memory-card_no-border');
  }

  // у кнопки начать игру удаляем классы
  btnStartGame.classList.remove('_btn-start_active');
  btnStartGame.classList.remove('_btn-start_hover');

  //вешаем слушателя на кнопку начать игру
  btnStartGame.addEventListener('click', onStartGameButtonClick);

  //обнуляем массив с парными картами
  cardsArraySuccess = [];

  // блокируем игровое поле
  lockBoard = true;
  openStatus = false;

  //вешаем слушателя на каждую карточку
  cards.forEach(card => card.addEventListener('click', openCard));

}

// функция обновления числа в карточках
function updateNumbers() {

  //функция поиска случайного int в диапазоне
  function randomInteger(min, max) {
    let rand = min - 0.5 + Math.random() * (max - min + 1);
    return Math.round(rand);
  }

  // находим элемент карточки в котором число
  let numCardsEl = document.querySelectorAll('.memory-card__front_item');

  let newNumber = null;
  let arrNum_Cards = [];

  for (let i = 0; i < numCardsEl.length; i++) {

    while (true) {
      newNumber = randomInteger(1, 8);
      if (arrNum_Cards.indexOf(newNumber) == -1) {
        arrNum_Cards.push(newNumber);
        break;
      }
      else if (arrNum_Cards.indexOf(newNumber) == arrNum_Cards.lastIndexOf(newNumber)) {
        arrNum_Cards.push(newNumber);
        break;
      }

    }
    numCardsEl[i].innerHTML = newNumber.toString();

  }

};
