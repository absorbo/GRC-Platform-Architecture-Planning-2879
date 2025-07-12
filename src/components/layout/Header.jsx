import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import SafeIcon from '../../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiLogOut, FiUser, FiShield } = FiIcons;

const Header = ({ title }) => {
  const { user, logout } = useAuth();

  const getRoleDisplay = (role) => {
    switch (role) {
      case 'super-admin': return 'Super Administrator';
      case 'reseller': return 'Reseller';
      case 'customer': return 'Customer';
      default: return role;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'super-admin': return 'text-red-600 bg-red-50';
      case 'reseller': return 'text-blue-600 bg-blue-50';
      case 'customer': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <motion.header 
      className="bg-white shadow-sm border-b border-gray-200"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <img 
              src="https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1752343774030-TruSecure_new_logo_cropped.png" 
              alt="TruSecure"
              className="h-8 w-auto"
            />
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <div className="flex items-center justify-end space-x-1">
                  <SafeIcon icon={FiShield} className="w-3 h-3 text-gray-400" />
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${getRoleColor(user?.role)}`}>
                    {getRoleDisplay(user?.role)}
                  </span>
                </div>
              </div>
              
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <SafeIcon icon={FiUser} className="w-4 h-4 text-blue-600" />
              </div>
            </div>

            <button
              onClick={logout}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
            >
              <SafeIcon icon={FiLogOut} className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;