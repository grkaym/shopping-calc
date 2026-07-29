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

let prices = [];

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
  totalPrice.textContent = yenFormatter.format(total);
  itemCount.textContent = `${prices.length}点`;

  const hasItems = prices.length > 0;
  emptyMessage.hidden = hasItems;
  clearButton.hidden = !hasItems;
}

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

priceInput.addEventListener('input', () => {
  errorMessage.textContent = '';
});

render();
