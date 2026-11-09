import React, { useState } from 'react';
import {
  User,
  MapPin,
  Plus,
  Trash2,
  Edit2,
  Shield,
  Bell,
  Check,
  AlertCircle,
  Home,
  Briefcase,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Address } from '../../types';

interface MyAccountViewProps {
  onNavigateOrders: () => void;
}

export const MyAccountView: React.FC<MyAccountViewProps> = ({ onNavigateOrders }) => {
  const { currentUser, addAddress, updateAddress, deleteAddress, setDefaultAddress } = useStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'security'>('profile');
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Address modal/form state
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addrName, setAddrName] = useState(currentUser?.name || '');
  const [addrPhone, setAddrPhone] = useState(currentUser?.phone || '');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('Kochi');
  const [addrDistrict, setAddrDistrict] = useState('Ernakulam');
  const [addrState, setAddrState] = useState('Kerala');
  const [addrPincode, setAddrPincode] = useState('682024');
  const [addrType, setAddrType] = useState<'Home' | 'Work' | 'Other'>('Home');

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-16 px-4 text-center">
        <h2 className="text-xl font-bold text-[#4A2C17]">Please sign in to view your account</h2>
        <p className="text-xs text-slate-500 mt-2">Manage your addresses, orders, and preferences.</p>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleOpenNewAddress = () => {
    setEditingAddressId(null);
    setAddrName(currentUser.name);
    setAddrPhone(currentUser.phone);
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('Kochi');
    setAddrDistrict('Ernakulam');
    setAddrState('Kerala');
    setAddrPincode('682024');
    setAddrType('Home');
    setIsEditingAddress(true);
  };

  const handleOpenEditAddress = (addr: Address) => {
    setEditingAddressId(addr.id);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrDistrict(addr.district);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrType(addr.type);
    setIsEditingAddress(true);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAddressId) {
      updateAddress({
        id: editingAddressId,
        fullName: addrName,
        phone: addrPhone,
        addressLine1: addrLine1,
        addressLine2: addrLine2,
        city: addrCity,
        district: addrDistrict,
        state: addrState,
        pincode: addrPincode,
        type: addrType,
      });
    } else {
      addAddress({
        fullName: addrName,
        phone: addrPhone,
        addressLine1: addrLine1,
        addressLine2: addrLine2,
        city: addrCity,
        district: addrDistrict,
        state: addrState,
        pincode: addrPincode,
        type: addrType,
      });
    }
    setIsEditingAddress(false);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Left Sidebar Menu */}
        <div className="w-full md:w-64 bg-white border border-[#EFE8D8] rounded-3xl p-4 shadow-xs space-y-2 shrink-0">
          <div className="p-3 bg-[#FFF8E7] rounded-2xl flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-[#1F4D2B] text-[#F2A900] font-bold text-lg flex items-center justify-center">
              {currentUser.name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <h3 className="font-bold text-xs text-[#4A2C17] truncate">{currentUser.name}</h3>
              <p className="text-[11px] text-[#8C7A6B] truncate">{currentUser.email}</p>
            </div>
          </div>

          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'profile'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-[#4A2C17] hover:bg-[#F4F1EA]'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Details</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'addresses'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-[#4A2C17] hover:bg-[#F4F1EA]'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses ({currentUser.addresses.length})</span>
          </button>

          <button
            onClick={onNavigateOrders}
            className="w-full p-2.5 rounded-xl text-left text-xs font-semibold text-[#4A2C17] hover:bg-[#F4F1EA] flex items-center gap-2.5 transition-colors"
          >
            <span>📦</span>
            <span>My Orders & Invoices</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'security'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-[#4A2C17] hover:bg-[#F4F1EA]'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Security & Passwords</span>
          </button>
        </div>

        {/* Right Content */}
        <div className="flex-1 bg-white border border-[#EFE8D8] rounded-3xl p-6 sm:p-8 shadow-xs w-full">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-bold text-[#4A2C17]">Personal Information</h3>
                <p className="text-xs text-[#8C7A6B]">
                  Update your contact details for delivery alerts.
                </p>
              </div>

              {savedSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl flex items-center gap-2 border border-emerald-200">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={currentUser.email}
                    className="w-full text-xs px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-500 cursor-not-allowed"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Account email cannot be modified.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full text-xs px-3.5 py-2.5 border border-slate-300 rounded-xl"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] shadow-xs cursor-pointer"
                >
                  Save Changes
                </button>
              </form>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#4A2C17]">Saved Delivery Addresses</h3>
                  <p className="text-xs text-[#8C7A6B]">
                    Manage your shipping destinations across Kerala and India.
                  </p>
                </div>
                <button
                  onClick={handleOpenNewAddress}
                  className="px-3 py-1.5 bg-[#FFF8E7] hover:bg-[#FCECC7] border border-[#F2A900]/40 text-[#1F4D2B] font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              {/* Form if editing or adding */}
              {isEditingAddress && (
                <form
                  onSubmit={handleSaveAddress}
                  className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3"
                >
                  <h4 className="font-bold text-xs text-slate-800">
                    {editingAddressId ? 'Edit Address' : 'Add New Delivery Address'}
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Recipient Name</label>
                      <input
                        type="text"
                        required
                        value={addrName}
                        onChange={(e) => setAddrName(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
                      <input
                        type="tel"
                        required
                        value={addrPhone}
                        onChange={(e) => setAddrPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addrLine1}
                      onChange={(e) => setAddrLine1(e.target.value)}
                      placeholder="House / Apartment, Street"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                    />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={addrCity}
                        onChange={(e) => setAddrCity(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">District</label>
                      <input
                        type="text"
                        required
                        value={addrDistrict}
                        onChange={(e) => setAddrDistrict(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={addrState}
                        onChange={(e) => setAddrState(e.target.value)}
                        className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={addrPincode}
                        onChange={(e) => setAddrPincode(e.target.value.replace(/\D/g, ''))}
                        className="w-full text-xs px-3 py-2 bg-white font-mono border border-slate-300 rounded-lg"
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 justify-end pt-2">
                    <button
                      type="button"
                      onClick={() => setIsEditingAddress(false)}
                      className="px-3 py-1.5 bg-slate-200 text-slate-700 text-xs rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-[#1F4D2B] text-white text-xs font-bold rounded-lg"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              )}

              {/* List of saved addresses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {currentUser.addresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-4 border border-[#EFE8D8] rounded-2xl bg-white shadow-2xs space-y-2 relative"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold text-xs text-[#4A2C17]">
                        {addr.type === 'Home' ? (
                          <Home className="w-3.5 h-3.5 text-[#1F4D2B]" />
                        ) : (
                          <Briefcase className="w-3.5 h-3.5 text-[#1F4D2B]" />
                        )}
                        <span>{addr.fullName}</span>
                      </div>
                      {addr.isDefault ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      ) : (
                        <button
                          onClick={() => setDefaultAddress(addr.id)}
                          className="text-[10px] text-[#1F4D2B] hover:underline font-semibold"
                        >
                          Set as Default
                        </button>
                      )}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {addr.addressLine1}
                      {addr.addressLine2 ? `, ${addr.addressLine2}` : ''}
                      <br />
                      {addr.city}, {addr.district}, {addr.state} - {addr.pincode}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">Phone: {addr.phone}</p>

                    <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100 text-xs">
                      <button
                        onClick={() => handleOpenEditAddress(addr)}
                        className="text-[#1F4D2B] hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-red-600 hover:underline flex items-center gap-1 font-semibold"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-lg">
              <div>
                <h3 className="text-base font-bold text-[#4A2C17]">Security & Passwords</h3>
                <p className="text-xs text-[#8C7A6B]">Keep your Thanima account safe.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <h4 className="font-bold text-xs text-slate-800">Change Password</h4>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    Current Password
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="At least 8 characters"
                    className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Password updated successfully!')}
                  className="px-4 py-2 bg-[#1F4D2B] text-white text-xs font-bold rounded-lg"
                >
                  Update Password
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
