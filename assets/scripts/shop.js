import { ProductList } from "./productList.js";
import { ShoppingCart } from "./shoppingCart.js";

export class Shop {
    constructor(productList, shoppingCart) {
    this.productList = productList;
    this.shoppingCart = shoppingCart;
    }

    render() {
    this.productList.render();
    this.shoppingCart.render();
    }
}