// Array users= [new Customer{},new Seller{},...];
// localStorage.setItem("users",users);

// const currentUser= localStorage.getItem("loggedInUser"); user 

// if(currentUser instanceof  Customer ){
//  //render Home page
// }else if(currentUser instanceof Seller){
//  // render Seller Dashboard
// }else{
//  // render Admin Dashboard
// }


// Base User Class


// Customer Class - for buyers/clients


//---------------------------------------------------------------------------
// Admin Class - for system administrators


// Example usage and factory pattern for easy instantiation
// class UserFactory {
//   static createUser(role, userData, options = {}) {
//     const { id, name, email, password } = userData;
    
//     switch (role.toLowerCase()) {
//       case 'customer':
//         return new Customer(id, name, email, password, options);
//       case 'seller':
//         return new Seller(id, name, email, password, options);
//       case 'admin':
//         return new Admin(id, name, email, password, options);
//       default:
//         return new User(id, name, email, password);
//     }
//   }
// }

// Export classes for use in other modules
// In Node.js environment:
// module.exports = { User, Customer, Seller, Admin, UserFactory };

// In ES6 modules:
// export { User, Customer, Seller, Admin, UserFactory };

// Example usage:
/*
// Creating users
const customer = new Customer(1, 'John Doe', 'john@email.com', 'password123', {
  address: '123 Main St',
  phone: '555-0123'
});

const seller = new Seller(2, 'Jane Smith', 'jane@business.com', 'password456', {
  businessName: 'Jane\'s Store',
  categories: ['electronics', 'accessories']
});

const admin = new Admin(3, 'Admin User', 'admin@system.com', 'adminpass', {
  adminLevel: 2,
  department: 'operations'
});

// Using factory
const newCustomer = UserFactory.createUser('customer', {
  id: 4,
  name: 'Bob Johnson',
  email: 'bob@email.com',
  password: 'password789'
}, { loyaltyPoints: 100 });

// Role checking
console.log(customer.getRole()); // 'customer'
console.log(seller.getPermissions()); // ['manage_products', 'view_orders', ...]
console.log(admin.hasPermission('manage_users')); // true/false
*/