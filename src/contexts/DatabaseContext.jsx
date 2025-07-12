```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

const DatabaseContext = createContext();

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};

export const DatabaseProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [riskRegisters, setRiskRegisters] = useState([]);
  const [projects, setProjects] = useState([]);

  // Initialize database with default super admin
  useEffect(() => {
    const initializeDatabase = () => {
      const existingData = localStorage.getItem('trusecure_db');
      if (existingData) {
        const data = JSON.parse(existingData);
        setUsers(data.users || []);
        setCompanies(data.companies || []);
        setAssessments(data.assessments || []);
        setRiskRegisters(data.riskRegisters || []);
        setProjects(data.projects || []);
      } else {
        // Create default super admin
        const defaultAdmin = {
          id: uuidv4(),
          email: 'admin@trusecure.com',
          password: 'admin123', // Simple password for demo
          role: 'super-admin',
          firstName: 'System',
          lastName: 'Administrator',
          isActive: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        };
        setUsers([defaultAdmin]);
        saveToStorage({
          users: [defaultAdmin],
          companies: [],
          assessments: [],
          riskRegisters: [],
          projects: []
        });
      }
    };
    initializeDatabase();
  }, []);

  const saveToStorage = (data) => {
    localStorage.setItem('trusecure_db', JSON.stringify(data));
  };

  const saveDatabase = () => {
    const data = {
      users,
      companies,
      assessments,
      riskRegisters,
      projects
    };
    saveToStorage(data);
  };

  // User operations
  const createUser = async (userData) => {
    // Verify required fields
    if (!userData.email || !userData.password || !userData.role) {
      throw new Error('Missing required fields');
    }

    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: uuidv4(),
      ...userData,
      isActive: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    saveToStorage({
      users: updatedUsers,
      companies,
      assessments,
      riskRegisters,
      projects
    });

    // Return user without password
    const { password, ...userWithoutPassword } = newUser;
    return userWithoutPassword;
  };

  const updateUser = (userId, updates) => {
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    setUsers(updatedUsers);
    saveToStorage({
      users: updatedUsers,
      companies,
      assessments,
      riskRegisters,
      projects
    });
  };

  const deleteUser = (userId) => {
    const updatedUsers = users.filter(user => user.id !== userId);
    setUsers(updatedUsers);
    saveToStorage({
      users: updatedUsers,
      companies,
      assessments,
      riskRegisters,
      projects
    });
  };

  const findUserByEmail = (email) => {
    return users.find(user => user.email === email);
  };

  const findUserById = (id) => {
    return users.find(user => user.id === id);
  };

  // Company operations
  const createCompany = (companyData) => {
    const newCompany = {
      id: uuidv4(),
      ...companyData,
      createdAt: new Date().toISOString()
    };

    const updatedCompanies = [...companies, newCompany];
    setCompanies(updatedCompanies);
    saveToStorage({
      users,
      companies: updatedCompanies,
      assessments,
      riskRegisters,
      projects
    });
    return newCompany;
  };

  const updateCompany = (companyId, updates) => {
    const updatedCompanies = companies.map(company => 
      company.id === companyId ? { ...company, ...updates } : company
    );
    setCompanies(updatedCompanies);
    saveToStorage({
      users,
      companies: updatedCompanies,
      assessments,
      riskRegisters,
      projects
    });
  };

  // Get users by role and reseller
  const getUsersByRole = (role, resellerId = null) => {
    return users.filter(user => {
      if (role && user.role !== role) return false;
      if (resellerId && user.resellerId !== resellerId) return false;
      return true;
    });
  };

  const getCompaniesByReseller = (resellerId) => {
    return companies.filter(company => company.resellerId === resellerId);
  };

  // Debug function to view current database state
  const getDatabaseState = () => {
    return {
      users: users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      companies,
      assessments,
      riskRegisters,
      projects
    };
  };

  const value = {
    // Users
    users,
    createUser,
    updateUser,
    deleteUser,
    findUserByEmail,
    findUserById,
    getUsersByRole,

    // Companies
    companies,
    createCompany,
    updateCompany,
    getCompaniesByReseller,

    // Debug
    getDatabaseState,

    // Other entities
    assessments,
    riskRegisters,
    projects,

    // Database operations
    saveDatabase
  };

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  );
};
```