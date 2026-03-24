import { ShoppingCart } from "./shoppingCart.js";
import { Shop } from "./shop.js";
import { ProductList } from "./productList.js";

export class App {
    static init() {
        const productList = new ProductList();
        // use the singleton cart everywhere
        const shoppingCart = ShoppingCart.getInstance();
        const shop = new Shop(productList, shoppingCart);
        productList.fetchProducts();
        shop.render();
    }
    
    static addProductToCart(product) {
        const shoppingCart = ShoppingCart.getInstance();
        shoppingCart.addItem(product);
    }
}

App.init();