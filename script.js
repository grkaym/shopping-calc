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
const quantityInput = document.querySelector('#quantity');
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
let items = [];

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

  items.forEach((itemData, index) => {
    const { price, quantity } = itemData;
    const subtotal = price * quantity;

    const item = document.createElement('li');
    item.className = 'item';

    const label = document.createElement('span');
    label.className = 'item__price';
    label.textContent = `${index + 1}. ${yenFormatter.format(price)} × ${quantity} = ${yenFormatter.format(subtotal)}`;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'item__delete';
    deleteButton.type = 'button';
    deleteButton.textContent = '削除';
    deleteButton.setAttribute(
      'aria-label',
      `${yenFormatter.format(price)}の商品${quantity}個を削除`,
    );
    deleteButton.addEventListener('click', () => {
      items.splice(index, 1);
      render();
    });

    item.append(label, deleteButton);
    itemList.append(item);
  });

  const total = items.reduce(
    (sum, itemData) => sum + itemData.price * itemData.quantity,
    0,
  );
  const totalCount = items.reduce(
    (sum, itemData) => sum + itemData.quantity,
    0,
  );
  const remaining = budget - total;

  budgetPrice.textContent = yenFormatter.format(budget);
  totalPrice.textContent = yenFormatter.format(total);
  remainingPrice.textContent = yenFormatter.format(remaining);
  remainingPrice.classList.toggle('is-over-budget', remaining < 0);
  itemCount.textContent = `${totalCount}点`;

  const hasItems = items.length > 0;
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
  items = [];
  budgetError.textContent = '';
  render();
  showView('shopping');
});

priceForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const price = Number(priceInput.value);
  const quantity = Number(quantityInput.value);

  if (!Number.isFinite(price) || price < 0 || !Number.isInteger(price)) {
    errorMessage.textContent = '値段は0円以上の整数を入力してください。';
    priceInput.focus();
    return;
  }

  if (!Number.isFinite(quantity) || quantity < 1 || !Number.isInteger(quantity)) {
    errorMessage.textContent = '個数は1個以上の整数を入力してください。';
    quantityInput.focus();
    return;
  }

  items.push({ price, quantity });
  errorMessage.textContent = '';
  priceForm.reset();
  render();
  priceInput.focus();
});

clearButton.addEventListener('click', () => {
  items = [];
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

quantityInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});

render();
showView('start');
