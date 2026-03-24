import { Product } from "./product.js";
import { ProductItem } from "./productItem.js";

export class ProductList {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentCategory = 'All';
    }
    
    async fetchProducts() {
        try {
            const response = await fetch('https://fakestoreapi.com/products');
            const data = await response.json();
            this.products = data;
            // extract unique categories and sort
            this.categories = Array.from(new Set(data.map(p => p.category))).sort();
            this.render();
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    }

    renderFilter(parent) {
        if (!parent) return;
        const existing = parent.querySelector('#categoryFilterWrapper');
        if (existing) existing.remove();

        const wrapper = document.createElement('div');
        wrapper.id = 'categoryFilterWrapper';
        wrapper.className = 'category-filter';

        // helper to create a button
        const createBtn = (cat) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'category-btn';
            btn.dataset.category = cat;
            btn.textContent = cat;
            if ((this.currentCategory || 'All') === cat) {
                btn.classList.add('active');
            }
            btn.addEventListener('click', () => {
                this.currentCategory = cat;
                // update active state on buttons
                wrapper.querySelectorAll('.category-btn').forEach(b => b.classList.toggle('active', b.dataset.category === cat));
                this.render();
            });
            return btn;
        };

        // All button first
        wrapper.appendChild(createBtn('All'));

        // one button per category
        this.categories.forEach(cat => {
            wrapper.appendChild(createBtn(cat));
        });

        const productListEl = parent.querySelector('.product-list');
        if (productListEl) {
            parent.insertBefore(wrapper, productListEl);
        } else {
            parent.appendChild(wrapper);
        }
    }
    
    render() {
        const productListElement = document.querySelector('.product-list');
        if (!productListElement) {
            console.error('.product-list element not found in the DOM');
            return;
        }

        const parent = productListElement.parentElement || document.body;
        this.renderFilter(parent);

        productListElement.innerHTML = '';

        const filtered = this.products.filter(p => {
            if (!this.currentCategory || this.currentCategory === 'All') return true;
            return p.category === this.currentCategory;
        });

        filtered.forEach((productData) => {
            const product = new Product(
                productData.id,
                productData.title,
                productData.price,
                productData.description,
                productData.image
            );
            const productItem = new ProductItem(product);
            productListElement.appendChild(productItem.render());
        });
    }    
}