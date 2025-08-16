import { Storage } from "../utils/localStorageHelper.js";

export class User {
  constructor(name, email, password,phone) {
    if (new.target === User) {
      throw new Error("Cannot instantiate abstract class 'User' directly.");
    }

    this.id = crypto.randomUUID();
    this.name = name;
    this.email = email;
    this.password = password;
    this.phone = phone || null;
    this.createdAt = new Date();
    this.updatedAt = new Date();
    this.isConfirmed = false;
    this.role = "user";
    this.confirmCode=null;
  }

  // Common methods for all users
  updateName(email, password, newName) {
    if (this.email === email && this.password == password) {
      this.name = newName;
      User.updateCurrentUser(this)
      return { success: true, message: "Updated Name Successfuly..!" }
    } else {
      return { success: false, message: "Updating Name Faild..!" }
    }
  }

  updateEmail(email, password, newEmail) {
    if (this.email === email && this.password === password) {
      this.email = newEmail;
      User.updateCurrentUser(this);
      return { success: true, message: "Updated Email Successfuly..!" }
    } else {
      return { success: false, message: "Updating Email Faild..!" }
    }
  }

  updatePassword(email, password, newPassword) {
    if (this.email === email && this.password == password) {
      this.password = newPassword;
      User.updateCurrentUser(this);
      return { success: true, message: "Updated Password Successfuly..!" }
    } else {
      return { success: false, message: "Updating Password Faild..!" }
    }
  }

  // Space to Add Forget Password;
  /*
  
  
  
  
  
  */
  static updateCurrentUser(updated_version) {
    const users = Storage.get("users");

    users.forEach((u, i) => {
      if (u.id === updated_version.id) {
        users[i] = updated_version;
      }
    });

    Storage.set("users", users);
    Storage.set("loggedInUser",updated_version)
  }

static updateInDB(updated_version) {
    const users = Storage.get("users");

    users.forEach((u, i) => {
      if (u.id === updated_version.id) {
        users[i] = updated_version;
      }
    });

    Storage.set("users", users);
  }


  getRole() {
    return this.constructor.name.toLowerCase();
  }
}



// async function encrypt(text, key) {
//   const encoder = new TextEncoder();
//   const iv = crypto.getRandomValues(new Uint8Array(12));
//   const encoded = encoder.encode(text);
//   const encrypted = await crypto.subtle.encrypt(
//     { name: "AES-GCM", iv },
//     key,
//     encoded
//   );
//   return { encrypted, iv };
// }

//const encryptionKey = "Kajwelo"