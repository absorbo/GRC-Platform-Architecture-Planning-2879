```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { authenticator } from 'otplib';
import CryptoJS from 'crypto-js';

const SecurityContext = createContext();

export const useSecurity = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurity must be used within SecurityProvider');
  }
  return context;
};

// Custom roles with granular permissions
const CUSTOM_ROLES = {
  assessor: {
    name: 'Assessor',
    permissions: ['view_assessment', 'edit_assessment', 'view_risks']
  },
  risk_manager: {
    name: 'Risk Manager',
    permissions: ['view_risks', 'edit_risks', 'view_assessment']
  },
  project_manager: {
    name: 'Project Manager',
    permissions: ['view_projects', 'edit_projects', 'view_risks']
  },
  auditor: {
    name: 'Auditor',
    permissions: ['view_assessment', 'view_risks', 'view_projects', 'view_audit_logs']
  }
};

export const SecurityProvider = ({ children }) => {
  const [mfaEnabled, setMfaEnabled] = useState({});
  const [auditLogs, setAuditLogs] = useState([]);
  const [customRoles, setCustomRoles] = useState({});

  // Load security data from local storage
  useEffect(() => {
    const loadSecurityData = () => {
      const storedData = localStorage.getItem('security_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        setMfaEnabled(data.mfaEnabled || {});
        setAuditLogs(data.auditLogs || []);
        setCustomRoles(data.customRoles || {});
      }
    };
    loadSecurityData();
  }, []);

  // Save security data to local storage
  const saveSecurityData = () => {
    const data = {
      mfaEnabled,
      auditLogs,
      customRoles
    };
    localStorage.setItem('security_data', JSON.stringify(data));
  };

  // MFA Management
  const setupMFA = (userId) => {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(userId, 'TruSecure', secret);
    
    setMfaEnabled(prev => ({
      ...prev,
      [userId]: {
        secret,
        enabled: false,
        pending: true
      }
    }));
    
    saveSecurityData();
    return { secret, otpauthUrl };
  };

  const verifyMFA = (userId, token) => {
    const userMFA = mfaEnabled[userId];
    if (!userMFA || !userMFA.secret) return false;

    const isValid = authenticator.verify({
      token,
      secret: userMFA.secret
    });

    if (isValid) {
      setMfaEnabled(prev => ({
        ...prev,
        [userId]: {
          ...prev[userId],
          enabled: true,
          pending: false
        }
      }));
      saveSecurityData();
    }

    return isValid;
  };

  // Custom Role Management
  const createCustomRole = (organizationId, roleName, permissions) => {
    const roleId = `${organizationId}_${roleName.toLowerCase()}`;
    setCustomRoles(prev => ({
      ...prev,
      [roleId]: {
        name: roleName,
        permissions,
        organizationId,
        createdAt: new Date().toISOString()
      }
    }));
    saveSecurityData();
    return roleId;
  };

  const assignCustomRole = (userId, roleId) => {
    setCustomRoles(prev => ({
      ...prev,
      [roleId]: {
        ...prev[roleId],
        assignedUsers: [...(prev[roleId].assignedUsers || []), userId]
      }
    }));
    saveSecurityData();
  };

  // Audit Logging
  const logAuditEvent = (event) => {
    const auditEvent = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      ...event
    };

    setAuditLogs(prev => [auditEvent, ...prev]);
    saveSecurityData();
    return auditEvent;
  };

  // Data Encryption
  const encryptData = (data) => {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
    return CryptoJS.AES.encrypt(JSON.stringify(data), encryptionKey).toString();
  };

  const decryptData = (encryptedData) => {
    const encryptionKey = process.env.ENCRYPTION_KEY || 'default-key';
    const bytes = CryptoJS.AES.decrypt(encryptedData, encryptionKey);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  };

  // Permission checking
  const hasPermission = (userId, permission) => {
    const userRoles = Object.entries(customRoles)
      .filter(([_, role]) => role.assignedUsers?.includes(userId))
      .map(([roleId]) => roleId);

    return userRoles.some(roleId => 
      customRoles[roleId].permissions.includes(permission)
    );
  };

  const value = {
    // MFA
    setupMFA,
    verifyMFA,
    isMFAEnabled: (userId) => mfaEnabled[userId]?.enabled || false,

    // Custom Roles
    CUSTOM_ROLES,
    createCustomRole,
    assignCustomRole,
    hasPermission,

    // Audit
    logAuditEvent,
    getAuditLogs: () => auditLogs,

    // Encryption
    encryptData,
    decryptData
  };

  return (
    <SecurityContext.Provider value={value}>
      {children}
    </SecurityContext.Provider>
  );
};
```