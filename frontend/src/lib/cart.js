const CART_KEY = "krishi_cart";

export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) || "[]");
  } catch {
    return [];
  }
}

export function setCart(items) {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
}

export function addToCart(cropId, quantity = 1) {
  const cart = getCart();
  const idx = cart.findIndex((x) => x.cropId === cropId);

  if (idx >= 0) cart[idx].quantity += quantity;
  else cart.push({ cropId, quantity });

  setCart(cart);
  return cart;
}

export function clearCart() {
  localStorage.removeItem(CART_KEY);
}
