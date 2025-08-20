// importing local storage helper to use its methods
// get(key) , set(key,value) ,remove(key) , clear() ,has(key)

import { Storage } from "../utils/localStorageHelper.js"
import { Seller } from "../models/Seller.js";



// Filtering class to retrive product 
export class retrive {
    // i want to return all products as an array;
    // users:[user,...] => user => seller || customer || admin => i need to get all sellers
    // sellers :[seller] => seller => products:[product,....]
    // users => sellers => products => push each product to your array => return array

    static allProducts() {
        const users = Storage.get("users");
        const sellers = users.filter(user => user instanceof Seller)
        const allProducts = [];

        sellers.forEach(seller => {
            seller.products.forEach(product => {
                allProducts.push(product);
            })
        })

        if (allProducts.length == 0) return { success: false, message: "No Products Found", products: [] }

        return { success: true, message: "Retrived All Products Successfully", products: allProducts }
    }

    static allValidProducts() {
        const users = Storage.get("users");
        const sellers = users.filter(user => user instanceof Seller)
        let allProducts = [];

        sellers.forEach(seller => {
            seller.products.forEach(product => {
                allProducts.push(product);
            })
        })

        allProducts = allProducts.filter(product => (product.isVerified !== false) ) //&& (product.visibility !== false))
        //console.log(allProducts)
        if (allProducts.length == 0) return { success: false, message: "No Products Found", products: [] }

        return { success: true, message: "Retrived All Products Successfully", products: allProducts }
    }

    // false => customer || seller  show verified only --- true => admin show all
    static allProductsByCategory(cat, access = false) {
        const users = Storage.get("users");
        const sellers = users.filter(user => user instanceof Seller)
        const allProducts = [];
        let result = {}
        sellers.forEach(seller => {
            seller.products.forEach(product => {
                if (!access) {
                    if (product.category.toLowerCase() === cat.toLowerCase() && product.isVerified) allProducts.push(product)
                    if (allProducts.length == 0) result = { success: false, message: "No Verifed Products Found", products: null }
                    result = { success: true, message: "Retrived All Verified Products Successfully", products: allProducts }
                } else {
                    if (product.category.toLowerCase() === cat.toLowerCase()) allProducts.push(product)
                    if (allProducts.length == 0) result = { success: false, message: "No Products Found", products: null }
                    result = { success: true, message: "Retrived All Products Successfully", products: allProducts }
                }
            })
        })

        return result
    }

    static allProductsBySubcategory(sub) {
        const users = Storage.get("users");
        const sellers = users.filter(user => user instanceof Seller)
        const allProducts = [];

        sellers.forEach(seller => {
            seller.products.forEach(product => {
                if (product.subcategory.toLowerCase() === sub.toLowerCase()) allProducts.push(product)
            })
        })
        if (allProducts.length == 0) return { success: false, message: "No Products Found", products: null }

        return { success: true, message: "Retrived All Products Successfully", products: allProducts }
    }

    static allProductsByCategoryAndSubcategory(cat, sub) {
        const allProducts = [];
        const result = this.allProductsByCategory(cat);
        if (result.success) {
            const categoryProducts = result.products;
            categoryProducts.forEach(product => {
                if (product.subcategory.toLowerCase() === sub.toLowerCase()) allProducts.push(product)
            })
            if (allProducts.length == 0) return { success: false, message: "No Products Found By This Subcategory", products: null }

            return { success: true, message: "Retrived All Products Successfully", products: allProducts }
        } else {
            return { success: false, message: "No Products Found By This Category", products: null }
        }
    }

    static allPendingProduct(sellerId = null) {
        const allProducts = [];
        if (!sellerId) {
            // all products with isVerifed = false

            const result = this.allProducts();
            if (result.success) {
                result.products.forEach(product => {
                    if (!product.isVerified) allProducts.push(product)
                })
                if (allProducts.length == 0) return { success: false, message: "No Pending Products Found", products: null }
                return { success: true, message: " Retrived Successfully", products: allProducts }
            }
        } else {
            const result = this.allProducts();
            if (result.success) {
                result.products.forEach(product => {
                    if ((!product.isVerified) && product.sellerId === sellerId) allProducts.push(product)
                })
                if (allProducts.length == 0) return { success: false, message: "No Pending Products Found", products: null }
                return { success: true, message: " Retrived Successfully", products: allProducts }
            }
        }
    }

    static getTotalCustomer(sellerId) {

        const users = Storage.get("users", []);
        const targeted = users.find(user => user.id === sellerId);
        let customersCount = 0;
        let customersIds = [];
        if (targeted instanceof Seller) {
            targeted.orders.forEach(order => {
                if (!customersIds.includes(order.customerId))
                    customersIds.push(order.customerId)
            })
        }

        customersCount = customersIds.length;
        return customersCount;
    }


}


