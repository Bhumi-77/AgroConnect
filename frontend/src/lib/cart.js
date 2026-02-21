const KEY = "cart";

export function getCart() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items || []));
}

export function addToCart(crop, quantity = 1) {
  const cart = getCart();

  const cropId = crop?.id || crop?.cropId;
  if (!cropId) return cart;

  const qty = Math.max(1, Number(quantity || 1));

  const existingIndex = cart.findIndex((x) => (x.cropId || x.id) === cropId);

  const item = {
    cropId,
    id: cropId, // support both shapes
    title: crop?.titleEn || crop?.titleNp || crop?.title || "Item",
    unitPrice: Number(crop?.price || 0),
    price: Number(crop?.price || 0),
    quantity: qty,
  };

  if (existingIndex >= 0) {
    cart[existingIndex].quantity = Number(cart[existingIndex].quantity || 0) + qty;
  } else {
    cart.push(item);
  }

  setCart(cart);
  return cart;
}

export function removeFromCart(cropId) {
  const cart = getCart().filter((x) => (x.cropId || x.id) !== cropId);
  setCart(cart);
  return cart;
}

export function clearCart() {
  setCart([]);
}