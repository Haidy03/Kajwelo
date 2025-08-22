// importing local storage helper to use its methods
// get(key) , set(key,value) ,remove(key) , clear() ,has(key)

import { Storage } from "../utils/localStorageHelper.js";
import { Seller } from "../models/Seller.js";

// Filtering class to retrive product
export class retrive {
  // i want to return all products as an array;
  // users:[user,...] => user => seller || customer || admin => i need to get all sellers
  // sellers :[seller] => seller => products:[product,....]
  // users => sellers => products => push each product to your array => return array

  static allProducts() {
    const users = Storage.get("users");
    const sellers = users.filter((user) => user instanceof Seller);
    const allProducts = [];

    sellers.forEach((seller) => {
      seller.products.forEach((product) => {
        allProducts.push(product);
      });
    });

    if (allProducts.length == 0)
      return { success: false, message: "No Products Found", products: [] };

    return {
      success: true,
      message: "Retrived All Products Successfully",
      products: allProducts,
    };
  }

  static allValidProducts() {
    const users = Storage.get("users");
    const sellers = users.filter((user) => user instanceof Seller);
    let allProducts = [];

    sellers.forEach((seller) => {
      seller.products.forEach((product) => {
        allProducts.push(product);
      });
    });

    allProducts = allProducts.filter((product) => product.isVerified !== false); //&& (product.visibility !== false))
    //console.log(allProducts)
    if (allProducts.length == 0)
      return { success: false, message: "No Products Found", products: [] };

    return {
      success: true,
      message: "Retrived All Products Successfully",
      products: allProducts,
    };
  }

  // Returns only products that are verified and visible to customers
  static allVerifiedAndVisibleProducts() {
    const users = Storage.get("users");
    const sellers = users.filter((user) => user instanceof Seller);
    let allProducts = [];

    sellers.forEach((seller) => {
      (seller.products || []).forEach((product) => {
        allProducts.push(product);
      });
    });

    // Keep product when isVerified is not explicitly false AND visibility is not explicitly false
    allProducts = allProducts.filter(
      (product) => product?.isVerified !== false && product?.visibility !== false
    );

    if (allProducts.length === 0)
      return { success: false, message: "No Products Found", products: [] };

    return {
      success: true,
      message: "Retrieved verified and visible products successfully",
      products: allProducts,
    };
  }

  // false => customer || seller  show verified only --- true => admin show all
  static allProductsByCategory(cat, access = false) {
    const users = Storage.get("users");
    const sellers = users.filter((user) => user instanceof Seller);
    const allProducts = [];
    let result = {};
    sellers.forEach((seller) => {
      seller.products.forEach((product) => {
        if (!access) {
          if (
            product.category.toLowerCase() === cat.toLowerCase() &&
            product.isVerified
          )
            allProducts.push(product);
          if (allProducts.length == 0)
            result = {
              success: false,
              message: "No Verifed Products Found",
              products: null,
            };
          result = {
            success: true,
            message: "Retrived All Verified Products Successfully",
            products: allProducts,
          };
        } else {
          if (product.category.toLowerCase() === cat.toLowerCase())
            allProducts.push(product);
          if (allProducts.length == 0)
            result = {
              success: false,
              message: "No Products Found",
              products: null,
            };
          result = {
            success: true,
            message: "Retrived All Products Successfully",
            products: allProducts,
          };
        }
      });
    });

    return result;
  }

  static allProductsBySubcategory(sub) {
    const users = Storage.get("users");
    const sellers = users.filter((user) => user instanceof Seller);
    const allProducts = [];

    sellers.forEach((seller) => {
      seller.products.forEach((product) => {
        if (product.subcategory.toLowerCase() === sub.toLowerCase())
          allProducts.push(product);
      });
    });
    if (allProducts.length == 0)
      return { success: false, message: "No Products Found", products: null };

    return {
      success: true,
      message: "Retrived All Products Successfully",
      products: allProducts,
    };
  }

  static allProductsByCategoryAndSubcategory(cat, sub) {
    const allProducts = [];
    const result = this.allProductsByCategory(cat);
    if (result.success) {
      const categoryProducts = result.products;
      categoryProducts.forEach((product) => {
        if (product.subcategory.toLowerCase() === sub.toLowerCase())
          allProducts.push(product);
      });
      if (allProducts.length == 0)
        return {
          success: false,
          message: "No Products Found By This Subcategory",
          products: null,
        };

      return {
        success: true,
        message: "Retrived All Products Successfully",
        products: allProducts,
      };
    } else {
      return {
        success: false,
        message: "No Products Found By This Category",
        products: null,
      };
    }
  }

  static allPendingProduct(sellerId = null) {
    const allProducts = [];
    if (!sellerId) {
      // all products with isVerifed = false

      const result = this.allProducts();
      if (result.success) {
        result.products.forEach((product) => {
          if (!product.isVerified) allProducts.push(product);
        });
        if (allProducts.length == 0)
          return {
            success: false,
            message: "No Pending Products Found",
            products: null,
          };
        return {
          success: true,
          message: " Retrived Successfully",
          products: allProducts,
        };
      }
    } else {
      const result = this.allProducts();
      if (result.success) {
        result.products.forEach((product) => {
          if (!product.isVerified && product.sellerId === sellerId)
            allProducts.push(product);
        });
        if (allProducts.length == 0)
          return {
            success: false,
            message: "No Pending Products Found",
            products: null,
          };
        return {
          success: true,
          message: " Retrived Successfully",
          products: allProducts,
        };
      }
    }
  }

  static getTotalCustomer(sellerId) {
    const users = Storage.get("users", []);
    const targeted = users.find((user) => user.id === sellerId);
    let customersCount = 0;
    let customersIds = [];
    if (targeted instanceof Seller) {
      targeted.orders.forEach((order) => {
        if (!customersIds.includes(order.customerId))
          customersIds.push(order.customerId);
      });
    }

    customersCount = customersIds.length;
    return customersCount;
  }

  static allProductsByBrand(brand) {
    const users = Storage.get("users"); // Retrieve users array from local storage
    if (!users || users.length === 0) {
      return { success: false, message: "No users found", products: null };
    }

    // Find the seller with the matching brand name
    const seller = users.find(
      (user) =>
        user.role === "seller" &&
        user.brandName?.toLowerCase() === brand.toLowerCase()
    );

    if (!seller) {
      return {
        success: false,
        message: "No seller found with this brand",
        products: null,
      };
    }

    // Collect products from the found seller
    if (!seller.products || seller.products.length === 0) {
      return {
        success: false,
        message: "This seller has no products",
        products: [],
      };
    }

    return {
      success: true,
      message: `Retrieved all products for brand: ${brand}`,
      products: seller.products,
    };
  }
}
