export class ShoppingCart {
    constructor() {
        this.items = [];
        this.total = 0;
        this.cartClickHandler = this.cartClickHandler.bind(this);
    }

    static getInstance() {
        if (!ShoppingCart.instance) {
            ShoppingCart.instance = new ShoppingCart();
        }
        return ShoppingCart.instance;
    }

    setTotal() {
        // sum price * quantity for each item
        this.total = this.items.reduce((total, item) => total + (item.product.price * (item.quantity || 1)), 0);
    }

    addItem(product) {
        if (!product || !product.id) return;
        const existing = this.items.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity = (existing.quantity || 1) + 1;
        } else {
            this.items.push({ product, quantity: 1 });
        }
        this.setTotal();
        this.render();
    }

    changeItemQuantity(index, delta) {
        const item = this.items[index];
        if (!item) return;
        item.quantity = (item.quantity || 1) + delta;
        if (item.quantity <= 0) {
            this.items.splice(index, 1);
        }
        this.setTotal();
        this.render();
    }

    removeItem(index) {
        if (index < 0 || index >= this.items.length) return;
        this.items.splice(index, 1);
        this.setTotal();
        this.render();
    }

    clearCart() {
        this.items = [];
        this.total = 0;
        this.render();
    }

    cartClickHandler(event) {
        const action = event.target?.dataset?.action;
        if (!action) return;
        const ItemEl = event.target.closest('li[data-index]');
        if (!ItemEl) return;
        const index = Number(ItemEl.dataset.index);
        if (Number.isNaN(index)) return;
        
        if (action === 'decrement') this.changeItemQuantity(index, -1);
        else if (action === 'increment') this.changeItemQuantity(index, +1);
        else if (action === 'remove') this.removeItem(index);
    }

    render() {
        const cartElement = document.getElementById('cart');
        if (!cartElement) return;
        cartElement.innerHTML = `
            <div class="cartItems">
                <ul class="cartItemsList">
                    ${this.items.map((item, idx) => {
                        const qty = item.quantity || 1;
                        const lineTotal = (item.product.price * qty).toFixed(2);
                        return `
                        <li data-index="${idx}">
                            ${qty}x ${item.product.title} - $${lineTotal}
                            <img src="assets/svg/minus.svg" alt="Minus Icon" class="itemAction cartIcon" data-action="decrement"/>
                            <img src="assets/svg/plus.svg" alt="Plus Icon" class="itemAction cartIcon" data-action="increment"/>
                            <img src="assets/svg/trash.svg" alt="Remove Icon" class="itemAction cartIcon" data-action="remove"/>
                        </li>`;
                    }).join('')}
                </ul>
            </div>
            <div class="order">
                <p>Total: $${this.total.toFixed(2)}</p>
                <button id='clearCart'>Clear</button>
                <button id='order'>Order</button>
            </div>
        `;

        // attach handlers to the new buttons (elements are recreated each render)
        cartElement.querySelector('#clearCart')?.addEventListener('click', () => this.clearCart());
        cartElement.querySelector('#order')?.addEventListener('click', () => {
            console.log('Order placed', { items: this.items, total: this.total });
        });

        if (!this.cartListenersAttached) {
            cartElement.addEventListener('click', this.cartClickHandler);
            this.cartListenersAttached = true;
        }
    }
}