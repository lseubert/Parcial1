const getData = async () => {
  const fetchRequest = await fetch(
    "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json"
  );
  const data = await fetchRequest.json();
  return data;
};

//console.log(getData());

const fillCards = async (index) => {
  const container = document.querySelector(".card-container");
  const data = await getData();

  const array = data[index];
  console.log(array);

  const header = document.querySelector(".selection-header");
  header.innerText = array.name;

  container.innerHTML = "";

  array.products.forEach((ele) => {
    console.log(ele);
    container.insertAdjacentHTML(
      "beforeend",
      `<div class="card">
    <img
      src=${ele.image}
      alt=${ele.name}
      class="card-image"
    />
    <h2 class="card-header">${ele.name}</h2>
    <p class="card-text">
      ${ele.description}
    </p>
    
    <span class="card-price">$${ele.price}</span>
    <button id="card-button" class="card-button">Add to cart</button>
    </div>`
    );
  });
};

const headerList = document.querySelector(".header-list");

fillCards(0);

headerList.addEventListener("click", (e) => {
  e.preventDefault();

  if (e.target.nodeName === "A") {
    fillCards(e.target.dataset.index - 1);
  }
});

let count = 0;

document.addEventListener("click", function (e) {
  if (e.target && e.target.id == "card-button") {
    count++;
    const headerCount = document.querySelector(".header-count");
    headerCount.innerText = `${count} items`;
  }
});
