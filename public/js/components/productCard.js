/* ===== Product Card Component ===== */
const EMOJI_MAP = {
  'Fruits': '🍎', 'Vegetables': '🥦', 'Dairy': '🧀',
  'Bakery': '🍞', 'Beverages': '☕', 'Snacks': '🍫',
};

const PRODUCT_EMOJI = {
  'p001': '🍌', 'p002': '🍓', 'p003': '🍎', 'p004': '🥑', 'p005': '🥭',
  'p006': '🥬', 'p007': '🍅', 'p008': '🥦', 'p009': '🫑', 'p010': '🥕',
  'p011': '🥛', 'p012': '🫙', 'p013': '🧀', 'p014': '🥚', 'p015': '🧈',
  'p016': '🍞', 'p017': '🥐', 'p018': '🧁', 'p019': '🫓', 'p020': '🧇',
  'p021': '🍊', 'p022': '☕', 'p023': '🍵', 'p024': '💧', 'p025': '🥛',
  'p026': '🥜', 'p027': '🍫', 'p028': '🥣', 'p029': '🍟', 'p030': '🥜',
};

function getProductEmoji(product) {
  return PRODUCT_EMOJI[product.id] || EMOJI_MAP[product.category] || '🛒';
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let html = '';
  for (let i = 0; i < full; i++) html += '<span class="star">★</span>';
  if (half) html += '<span class="star">★</span>';
  return html + `<span class="rating-num">${rating}</span>`;
}

function renderProductCard(product) {
  const emoji = getProductEmoji(product);
  
  const visual = product.modelUrl 
    ? `<model-viewer src="${product.modelUrl}" auto-rotate camera-controls shadow-intensity="1" style="width: 100%; height: 100%; min-height: 140px; background-color: transparent;"></model-viewer>`
    : emoji;

  return `
    <div class="product-card" data-id="${product.id}" id="product-${product.id}" style="position: relative;">
      <button class="wishlist-btn" onclick="toggleWishlist(event, '${product.id}')" style="position: absolute; top: 12px; right: 12px; background: rgba(0,0,0,0.5); border: none; border-radius: 50%; width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 5; font-size: 1.1rem; backdrop-filter: blur(4px); transition: transform 0.2s;">${JSON.parse(localStorage.getItem('guru_wishlist') || '[]').includes(product.id) ? '❤️' : '🤍'}</button>
      <div class="product-card-img" style="${product.modelUrl ? 'padding: 0; display: block;' : ''}">${visual}</div>
      <div class="product-card-body">
        <span class="product-card-cat">${product.category}</span>
        <h3 class="product-card-name">${product.name}</h3>
        <p class="product-card-desc">${product.description}</p>
        <div class="product-card-footer">
          <span class="product-card-price">₹${product.price} <small>/ ${product.unit}</small></span>
          <div class="product-card-rating">${renderStars(product.rating)}</div>
        </div>
        <button class="add-btn" data-product-id="${product.id}" id="add-${product.id}">
          Add to Cart
        </button>
      </div>
    </div>
  `;
}


window.toggleWishlist = function(e, id) {
  e.stopPropagation();
  let wishlist = JSON.parse(localStorage.getItem('guru_wishlist') || '[]');
  const index = wishlist.indexOf(id);
  const btn = e.currentTarget;
  if (index > -1) {
    wishlist.splice(index, 1);
    btn.innerHTML = '🤍';
    Toast.show('Removed from Wishlist');
  } else {
    wishlist.push(id);
    btn.innerHTML = '❤️';
    Toast.show('Added to Wishlist!');
  }
  localStorage.setItem('guru_wishlist', JSON.stringify(wishlist));
};
