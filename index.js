const getData = async () => {
  const fetchRequest = await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"
  );
  const data = await fetchRequest.json();
  return data;
};

const container = document.querySelector(".container");

const jsonData = (async () => {
  return await getData();
})();

let globalIndex = 0;
let count = 0;
let order = [];

const fillCards = async (index) => {
  const data = await jsonData;

  const array = data[index];

  container.innerHTML = `<h1 class="selection-header">${array.name}</h1><div class="card-container"></div>`;

  const cardContainer = document.querySelector(".card-container");

  array.products.forEach((ele, index) => {
    cardContainer.insertAdjacentHTML(
      "beforeend",
      `<div class="card" data-index=${index}>
    <img
      src=${ele.image}
      alt=${ele.name}
      class="card-image"
    />
    <h2 class="card-header">${ele.name}</h2>
    <p class="card-text">
      ${ele.description}
    </p>
    
    <span class="card-price">$${ele.price.toFixed(2)}</span>
    <button id="card-button" class="card-button">Add to car</button>
    </div>`
    );
  });
};

const updateCount = (number) => {
  count += number;
  const headerCount = document.querySelector(".header-count");
  headerCount.innerText = `${count} items`;
};

const calculateTotalSum = () => {
  let sum = 0;
  order.forEach((ele) => {
    sum += ele.quantity * ele.unitPrice;
  });
  return Number(sum).toFixed(2);
};

const createOrderTable = (order) => {
  let tableString = "";
  order.forEach((ele) => {
    tableString += `<tr>${updateTableRow(ele)}</tr>`;
  });

  let markup = `<div>
    <table class="table">
    <thead>
      <tr class="table-header">
        <th scope="col">Item</th>
        <th scope="col">Qty.</th>
        <th scope="col">Description</th>
        <th scope="col">Unit Price</th>
        <th scope="col">Amount</th>
        <th scope="col">Modify</th>
      </tr>
    </thead>
    <tbody class="table-body">${tableString}</tbody>
  </table>
    <div class="table-footer">
      <span class="order-total">Total: ${calculateTotalSum()}</span>
      <div>
        <button class="btn-cancel">Cancel</button>
        <button class="btn-confirm">Confirm order</button>
      </div>
    </div>
</div>`;

  container.innerHTML = "";
  container.innerHTML = "<h1 class='selection-header'>Order Details</h1>";
  container.insertAdjacentHTML("beforeend", markup);
};

const updateTableRow = (ele) => {
  return `<th scope="row">${ele.item}</th><td>${ele.quantity}</td><td>${
    ele.description
  }</td><td>${ele.unitPrice}</td><td>${Number(
    ele.unitPrice * ele.quantity
  ).toFixed(
    2
  )}</td><td><button class="btn-plus">+</button><button class="btn-minus">-</button></td>`;
};

const modifyTable = (e, operation) => {
  const tableRow = e.target.closest("tr");
  const index = parseInt(tableRow.firstChild.innerText);

  let found = order.find((element) => element.item === index);

  if (operation === "add") {
    found.quantity++;
    updateCount(1);
  } else if (operation === "sub" && found.quantity > 0) {
    found.quantity--;
    updateCount(-1);
  }

  tableRow.innerHTML = "";
  tableRow.insertAdjacentHTML("beforeend", updateTableRow(found));
  const totalSum = document.querySelector(".order-total");
  totalSum.innerText = `Total: ${calculateTotalSum()}`;
};

const resetOrder = (type) => {
  order = [];
  if (type === "cancel") {
    showAlert("danger", "Your order was cancelled");
  } else if (type === "confirm") {
    showAlert(
      "success",
      `Your order of ${calculateTotalSum()} was successful and will shortly be processed`
    );
  }

  window.scrollTo(0, 0);
  fillCards(0);
  updateCount(-count);
};

const createPopup = () => {
  const markup = `<div id="myPopup" class="popup">
  <div class="popup-content">
    <span class="close">&times;</span>

    <h2 class="popup-content-header">Cancel the order</h2>

    <p class="popup-content-text">
      Are you sure about cancelling the order?
    </p>

    <div class="popup-button-group">
      <button class="btn-cancel-order">
        Yes, I want to cancel the order
      </button>
      <button class="btn-continue-order">
        No, I want to continue adding products
      </button>
    </div>
  </div>
</div>`;
  document.body.insertAdjacentHTML("afterbegin", markup);
};

const hideAlert = () => {
  const el = document.querySelector(".alert");
  if (el) {
    el.parentElement.removeChild(el);
  }
};

// type is 'success' or 'danger'
const showAlert = (type, msg) => {
  hideAlert();
  const markup = `<div class="alert alert-${type}">${msg}</div>`;
  document.body.insertAdjacentHTML("afterbegin", markup);
  window.setTimeout(hideAlert, 3000);
};

document.addEventListener("click", async function (e) {
  if (e.target && e.target.closest(".header-list")) {
    if (e.target.tagName === "BUTTON") {
      const index = e.target.dataset.index - 1;
      fillCards(index);
      globalIndex = index;
    }
  }

  if (e.target && e.target.closest(".header-cart")) {
    createOrderTable(order);
  }

  if (e.target && e.target.closest(".card-button")) {
    updateCount(1);
    const data = await jsonData;

    const index = e.target.closest(".card").dataset.index;
    const object = data[globalIndex].products[index];

    const item = {
      item: order.length + 1,
      quantity: 1,
      description: object.name,
      unitPrice: object.price,
    };

    let arrayIndex;
    const containsElement = order.some((ele, i) => {
      if (ele.description === object.name) {
        arrayIndex = i;
        return true;
      }
    });

    if (containsElement) {
      order[arrayIndex].quantity++;
    } else {
      order.push(item);
    }
  }

  if (e.target && e.target.closest(".btn-plus")) {
    modifyTable(e, "add");
  }
  if (e.target && e.target.closest(".btn-minus")) {
    modifyTable(e, "sub");
  }
  if (e.target && e.target.closest(".btn-confirm")) {
    // eslint-disable-next-line no-console
    console.log("Your order: ", order);
    resetOrder("confirm");
  }
  if (
    e.target &&
    (e.target.closest(".close") || e.target.closest(".btn-continue-order"))
  ) {
    const popup = document.getElementById("myPopup");
    popup.remove();
  }
  if (e.target && e.target.closest(".btn-cancel")) {
    createPopup();
  }
  if (e.target && e.target.className === "btn-cancel-order") {
    resetOrder("cancel");
    const popup = document.getElementById("myPopup");
    popup.remove();
  }
});

fillCards(globalIndex);
