const startView = document.querySelector('#start-view');
const shoppingView = document.querySelector('#shopping-view');
const budgetForm = document.querySelector('#budget-form');
const budgetInput = document.querySelector('#budget');
const budgetError = document.querySelector('#budget-error');
const budgetPrice = document.querySelector('#budget-price');
const remainingPrice = document.querySelector('#remaining-price');
const restartButton = document.querySelector('#restart-button');

const priceForm = document.querySelector('#price-form');
const priceInput = document.querySelector('#price');
const errorMessage = document.querySelector('#error-message');
const itemList = document.querySelector('#item-list');
const emptyMessage = document.querySelector('#empty-message');
const totalPrice = document.querySelector('#total-price');
const itemCount = document.querySelector('#item-count');
const clearButton = document.querySelector('#clear-button');

const yenFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'JPY',
  maximumFractionDigits: 0,
});

let budget = 0;
let prices = [];

function showView(viewName) {
  const isStartView = viewName === 'start';
  startView.hidden = !isStartView;
  shoppingView.hidden = isStartView;

  if (isStartView) {
    budgetInput.focus();
  } else {
    priceInput.focus();
  }
}

function render() {
  itemList.replaceChildren();

  prices.forEach((price, index) => {
    const item = document.createElement('li');
    item.className = 'item';

    const label = document.createElement('span');
    label.className = 'item__price';
    label.textContent = `${index + 1}. ${yenFormatter.format(price)}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'item__delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.setAttribute('aria-label', `${yenFormatter.format(price)}の商品を削除`);
    deleteButton.addEventListener('click', () => {
      prices.splice(index, 1);
      render();
    });

    item.append(label, deleteButton);
    itemList.append(item);
  });

  const total = prices.reduce((sum, price) => sum + price, 0);
  const remaining = budget - total;

  budgetPrice.textContent = yenFormatter.format(budget);
  totalPrice.textContent = yenFormatter.format(total);
  remainingPrice.textContent = yenFormatter.format(remaining);
  remainingPrice.classList.toggle('is-over-budget', remaining < 0);
  itemCount.textContent = `${prices.length}点`;

  const hasItems = prices.length > 0;
  emptyMessage.hidden = hasItems;
  clearButton.hidden = !hasItems;
}

budgetForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = Number(budgetInput.value);

  if (!Number.isFinite(value) || value <= 0 || !Number.isInteger(value)) {
    budgetError.textContent = '1円以上の整数を入力してください。';
    budgetInput.focus();
    return;
  }

  budget = value;
  prices = [];
  budgetError.textContent = '';
  render();
  showView('shopping');
});

priceForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const value = Number(priceInput.value);

  if (!Number.isFinite(value) || value < 0 || !Number.isInteger(value)) {
    errorMessage.textContent = '0円以上の整数を入力してください。';
    priceInput.focus();
    return;
  }

  prices.push(value);
  errorMessage.textContent = '';
  priceForm.reset();
  render();
  priceInput.focus();
});

clearButton.addEventListener('click', () => {
  prices = [];
  render();
  priceInput.focus();
});

restartButton.addEventListener('click', () => {
  budgetInput.value = budget || '';
  budgetError.textContent = '';
  showView('start');
});

budgetInput.addEventListener('input', () => {
  budgetError.textContent = '';
});

priceInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});

render();
showView('start');
