import { User } from "./User.js";
export class Admin extends User {
  constructor(id, name, email, password, options = {}) {
    super(id, name, email, password);
    
    // Admin-specific fields
    this.adminLevel = options.adminLevel || 1; // 1: basic, 2: advanced, 3: super
    this.department = options.department || 'general';
    this.lastLogin = options.lastLogin || null;
    this.actionHistory = options.actionHistory || [];
    this.managedUsers = options.managedUsers || [];
    this.permissions = options.permissions || this.getDefaultPermissions();
  }

  // Admin-specific methods
  logAction(action, target = null, details = null) {
    this.actionHistory.push({
      action,
      target,
      details,
      timestamp: new Date(),
      adminId: this.id
    });
    this.updatedAt = new Date();
  }

  manageUser(userId, action, data = null) {
    this.logAction(`user_${action}`, userId, data);
    if (!this.managedUsers.includes(userId)) {
      this.managedUsers.push(userId);
    }
    return this;
  }

  updatePermissions(newPermissions) {
    this.permissions = newPermissions;
    this.logAction('permissions_updated', this.id, newPermissions);
    this.updatedAt = new Date();
  }

  recordLogin() {
    this.lastLogin = new Date();
    this.logAction('login');
  }

  getDefaultPermissions() {
    const basePermissions = [
      'view_dashboard',
      'view_users',
      'view_reports',
      'manage_content'
    ];

    const levelPermissions = {
      1: [], // basic admin
      2: ['manage_users', 'manage_sellers', 'view_analytics'], // advanced admin
      3: ['manage_admins', 'system_config', 'full_access'] // super admin
    };

    return [...basePermissions, ...(levelPermissions[this.adminLevel] || [])];
  }

  getPermissions() {
    return this.permissions;
  }

  hasPermission(permission) {
    return this.permissions.includes(permission) || this.permissions.includes('full_access');
  }

  roleSpecificValidation() {
    if (this.adminLevel < 1 || this.adminLevel > 3) {
      throw new Error('Admin level must be between 1 and 3');
    }
    return true;
  }
}