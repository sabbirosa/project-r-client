import { useAuth } from "../contexts/AuthContext";
import {
    canAccessAdmin,
    canDonateBlood,
    canManageContent,
    canManageUsers,
    canRequestBlood,
    canViewAnalytics,
    getUserPermissions,
    isActiveUser
} from "../utils/authUtils";

/**
 * Custom hook for authentication and authorization checks
 * Provides easy access to user permissions and role-based access control
 */
export const useAuthGuard = () => {
  const { user, isAuthenticated, loading } = useAuth();

  // Get user permissions
  const permissions = getUserPermissions(user);

  // Basic authentication checks
  const isLoggedIn = isAuthenticated && !!user;
  const isActive = isActiveUser(user);

  // Role-based checks
  const isAdmin = permissions.isAdmin;
  const isVolunteer = permissions.isVolunteer;
  const isDonor = permissions.isDonor;

  // Permission-based checks
  const canAccessAdminPanel = canAccessAdmin(user);
  const canManageUserAccounts = canManageUsers(user);
  const canManageContentPages = canManageContent(user);
  const canViewAnalyticsData = canViewAnalytics(user);
  const canDonateBloodToOthers = canDonateBlood(user);
  const canRequestBloodDonation = canRequestBlood(user);

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    if (!user) return false;
    return roles.some(role => permissions[`is${role.charAt(0).toUpperCase() + role.slice(1)}`]);
  };

  // Check if user has all of the specified roles
  const hasAllRoles = (roles) => {
    if (!user) return false;
    return roles.every(role => permissions[`is${role.charAt(0).toUpperCase() + role.slice(1)}`]);
  };

  // Check if user can access a specific feature
  const canAccess = (feature) => {
    const featurePermissions = {
      admin: canAccessAdminPanel,
      users: canManageUserAccounts,
      content: canManageContentPages,
      analytics: canViewAnalyticsData,
      donate: canDonateBloodToOthers,
      request: canRequestBloodDonation,
    };

    return featurePermissions[feature] || false;
  };

  // Check if user can perform a specific action
  const canPerform = (action, resource = null) => {
    const actionPermissions = {
      create: {
        donation: canRequestBloodDonation,
        blog: canManageContentPages,
        user: canManageUserAccounts,
      },
      read: {
        analytics: canViewAnalyticsData,
        users: canManageUserAccounts,
        donations: canAccessAdminPanel,
      },
      update: {
        profile: isLoggedIn,
        donation: (donation) => {
          if (!isLoggedIn) return false;
          if (canAccessAdminPanel) return true;
          return donation?.requesterId === user?._id;
        },
        blog: canManageContentPages,
        user: canManageUserAccounts,
      },
      delete: {
        donation: (donation) => {
          if (!isLoggedIn) return false;
          if (canAccessAdminPanel) return true;
          return donation?.requesterId === user?._id;
        },
        blog: canManageContentPages,
        user: canManageUserAccounts,
      },
    };

    const actionMap = actionPermissions[action];
    if (!actionMap) return false;

    if (resource) {
      const permission = actionMap[resource];
      return typeof permission === 'function' ? permission(resource) : permission;
    }

    return Object.values(actionMap).some(Boolean);
  };

  // Get user's accessible features
  const getAccessibleFeatures = () => {
    const features = [];

    if (canAccessAdminPanel) features.push('admin');
    if (canManageUserAccounts) features.push('users');
    if (canManageContentPages) features.push('content');
    if (canViewAnalyticsData) features.push('analytics');
    if (canDonateBloodToOthers) features.push('donate');
    if (canRequestBloodDonation) features.push('request');

    return features;
  };

  // Check if user needs to complete profile
  const needsProfileCompletion = () => {
    if (!user) return false;
    
    const requiredFields = ['name', 'bloodGroup', 'district', 'upazila'];
    return requiredFields.some(field => !user[field]);
  };

  // Get user's role display name
  const getRoleDisplayName = () => {
    if (!user?.role) return 'Guest';
    
    const roleNames = {
      admin: 'Administrator',
      volunteer: 'Volunteer',
      donor: 'Blood Donor',
    };
    
    return roleNames[user.role] || user.role;
  };

  // Check if user can be promoted to a specific role
  const canBePromotedTo = (role) => {
    if (!user) return false;
    
    const promotionRules = {
      volunteer: ['donor'],
      admin: ['donor', 'volunteer'],
    };
    
    return promotionRules[role]?.includes(user.role) || false;
  };

  return {
    // User state
    user,
    isAuthenticated: isLoggedIn,
    loading,
    isActive,

    // Role checks
    isAdmin,
    isVolunteer,
    isDonor,
    hasAnyRole,
    hasAllRoles,

    // Permission checks
    canAccess,
    canPerform,
    canAccessAdminPanel,
    canManageUserAccounts,
    canManageContentPages,
    canViewAnalyticsData,
    canDonateBloodToOthers,
    canRequestBloodDonation,

    // Utility functions
    getAccessibleFeatures,
    needsProfileCompletion,
    getRoleDisplayName,
    canBePromotedTo,
    permissions,
  };
}; 