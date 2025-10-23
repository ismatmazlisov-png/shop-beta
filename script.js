
const products = [
  {id:'p_laptop', title:'Ноутбук', price:300000, img:'images/laptop.png'},
  {id:'p_backpack', title:'Рюкзак', price:25000, img:'images/backpack.png'},
  {id:'p_headphones', title:'Наушники', price:4900, img:'images/headphones.png'},
  {id:'p_pen', title:'Ручка', price:200, img:'images/pen.png'},
  {id:'p_markers', title:'Набор маркеров', price:1500, img:'images/markers.png'},
  {id:'p_notebooks', title:'Тетради (3 шт)', price:500, img:'images/notebooks.png'},
  {id:'p_calculator', title:'Калькулятор', price:2000, img:'images/calculator.png'},
  {id:'p_paper', title:'Бумага (пачка)', price:300, img:'images/paper.png'},
  {id:'p_mug', title:'Кружка CU', price:1200, img:'images/mug.png'},
  {id:'p_sticker', title:'Набор стикеров', price:300, img:'images/sticker.png'},
  {id:'p_cap', title:'Кепка университета', price:2500, img:'images/cap.png'},
  {id:'p_usb', title:'USB-накопитель 32GB', price:3500, img:'images/usb.png'},
  {id:'p_shirt_1', title:'Футболка “Caspian University”', price:5000, img:'images/shirt_model.png'},
  {id:'p_sweat_1', title:'Свитшот “CU Since 1992”', price:8500, img:'images/sweatshirt.png'},
  {id:'p_shirt_2', title:'Футболка “CU Black Edition”', price:6000, img:'images/shirt_hanger.png'},
  {id:'p_charger', title:'Зарядное', price:2200, img:'images/charger.png'},
  {id:'p_mouse', title:'Мышь', price:1800, img:'images/mouse.png'},
  {id:'p_powerbank', title:'Powerbank', price:4200, img:'images/powerbank.png'},
  {id:'p_folder', title:'Папка', price:400, img:'images/folder.png'},
  {id:'p_wallet', title:'Блокнот', price:600, img:'images/notebooks.png'}
];

const productsContainer = document.getElementById('products');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartCountEl = document.getElementById('cartCount');
const cartItemsEl = document.getElementById('cartItems');
const cartTotalEl = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkout');

let cart = JSON.parse(localStorage.getItem('cu_cart') || '[]');

function formatPrice(n){ return n.toLocaleString('ru-RU') + ' ₸'; }

function renderProducts(list){
  productsContainer.innerHTML='';
  list.forEach(p=>{
    const card = document.createElement('div');
    card.className='product-card';
    card.innerHTML = `
      <img src="${p.img}" alt="${p.title}" />
      <h3>${p.title}</h3>
      <div class="price">${formatPrice(p.price)}</div>
      <button class="add" data-id="${p.id}">Добавить в корзину</button>
    `;
    productsContainer.appendChild(card);
  });
}

function openCart(){ cartSidebar.classList.add('open'); renderCart(); }
function closeCartFn(){ cartSidebar.classList.remove('open'); }

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFn);

function updateCount(){ cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0); }

function saveCart(){ localStorage.setItem('cu_cart', JSON.stringify(cart)); updateCount(); renderCart(); }

function addToCart(id){
  const prod = products.find(p=>p.id===id);
  if(!prod) return;
  const found = cart.find(c=>c.id===id);
  if(found){ found.qty += 1; } else { cart.push({id:prod.id,title:prod.title,price:prod.price,img:prod.img,qty:1}); }
  saveCart();
  cartBtn.classList.add('pulse');
  setTimeout(()=>cartBtn.classList.remove('pulse'),400);
}

document.addEventListener('click', e=>{
  if(e.target.matches('.add')){
    addToCart(e.target.dataset.id);
  }
  if(e.target.matches('.remove')){
    const id = e.target.dataset.id;
    cart = cart.filter(i=>i.id!==id);
    saveCart();
  }
});

function renderCart(){
  cartItemsEl.innerHTML='';
  if(cart.length===0){ cartItemsEl.innerHTML='<p style="color:#666;padding:12px">Корзина пуста</p>'; cartTotalEl.textContent='0 ₸'; return; }
  let total=0;
  cart.forEach(item=>{
    total += item.price * item.qty;
    const div = document.createElement('div');
    div.className='cart-item';
    div.innerHTML = `
      <img src="${item.img}" alt="${item.title}" />
      <div class="meta">
        <h4>${item.title}</h4>
        <p>${item.qty} × ${formatPrice(item.price)}</p>
      </div>
      <div>
        <button class="remove" data-id="${item.id}">Удалить</button>
      </div>
    `;
    cartItemsEl.appendChild(div);
  });
  cartTotalEl.textContent = formatPrice(total);
  updateCount();
}

checkoutBtn.addEventListener('click', ()=>{
  if(cart.length===0){ alert('Ваша корзина пуста'); return; }
  alert('Спасибо! Заказ зарегистрирован (демо). Сумма: ' + cartTotalEl.textContent);
  cart = []; saveCart(); closeCartFn();
});

// search filter
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', ()=>{
  const q = searchInput.value.toLowerCase();
  const filtered = products.filter(p=> p.title.toLowerCase().includes(q));
  renderProducts(filtered);
});

// init render
renderProducts(products);
renderCart();
updateCount();
