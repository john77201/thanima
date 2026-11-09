import React, { useState } from 'react';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  Tag,
  Star,
  Image as ImageIcon,
  Truck,
  CreditCard,
  MessageSquare,
  Settings as SettingsIcon,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Search,
  Download,
  Upload,
  RefreshCw,
  LogOut,
  AlertCircle,
  ExternalLink,
  Printer,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { Order, OrderStatus, Product, ProductVariant, Coupon, Review, Banner } from '../../types';
import { formatINR } from '../../utils/pricing';

interface AdminPortalProps {
  onExitAdmin: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onExitAdmin }) => {
  const {
    products,
    categories,
    orders,
    reviews,
    banners,
    contactMessages,
    newsletterSubscribers,
    updateOrderStatus,
    addProduct,
    updateProduct,
    deleteProduct,
    approveReview,
    rejectReview,
    deleteReview,
    currentUser,
    logout,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'coupons'
    | 'reviews'
    | 'banners'
    | 'messages'
    | 'settings'
  >('dashboard');

  // Order filters
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrderForEdit, setSelectedOrderForEdit] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('Confirmed');
  const [statusNote, setStatusNote] = useState('');
  const [courierName, setCourierName] = useState('');
  const [trackingId, setTrackingId] = useState('');

  // Product CRUD Modal state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodMalName, setProdMalName] = useState('');
  const [prodCat, setProdCat] = useState<string>('snacks');
  const [prodSubcat, setProdSubcat] = useState('');
  const [prodPrice, setProdPrice] = useState(150);
  const [prodMrp, setProdMrp] = useState(180);
  const [prodWeight, setProdWeight] = useState('250g');
  const [prodStock, setProdStock] = useState(50);
  const [prodShortDesc, setProdShortDesc] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodIngredients, setProdIngredients] = useState('Rice Flour, Coconut Oil, Salt');
  const [prodShelfLife, setProdShelfLife] = useState('60 days');
  const [prodStorage, setProdStorage] = useState('Airtight container');
  const [prodIsVeg, setProdIsVeg] = useState(true);
  const [prodFeatured, setProdFeatured] = useState(false);
  const [prodBestSeller, setProdBestSeller] = useState(false);

  // Search & filters in admin
  const [prodSearch, setProdSearch] = useState('');

  // Calculations for dashboard KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid' || o.orderStatus === 'Delivered')
    .reduce((sum, o) => sum + o.total, 0);

  const pendingOrdersCount = orders.filter(
    (o) => o.orderStatus === 'Pending' || o.orderStatus === 'Confirmed'
  ).length;

  const lowStockProductsCount = products.filter((p) =>
    p.variants.some((v) => v.stock <= 10)
  ).length;

  // Handle open product edit
  const handleOpenEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    setProdName(p.name);
    setProdMalName(p.malayalamName);
    setProdCat(p.categoryIds[0] || 'snacks');
    setProdSubcat(p.subcategory || '');
    setProdPrice(p.variants[0]?.price || 150);
    setProdMrp(p.variants[0]?.mrp || 180);
    setProdWeight(p.variants[0]?.weight || '250g');
    setProdStock(p.variants[0]?.stock || 50);
    setProdShortDesc(p.shortDescription);
    setProdDesc(p.description);
    setProdIngredients(p.ingredients.join(', '));
    setProdShelfLife(p.shelfLife);
    setProdStorage(p.storageInstructions);
    setProdIsVeg(p.isVeg);
    setProdFeatured(!!p.isFeatured);
    setProdBestSeller(!!p.isBestSeller);
    setIsProductModalOpen(true);
  };

  const handleOpenNewProduct = () => {
    setEditingProductId(null);
    setProdName('');
    setProdMalName('');
    setProdCat('snacks');
    setProdSubcat('Fried Snacks');
    setProdPrice(160);
    setProdMrp(190);
    setProdWeight('250g');
    setProdStock(50);
    setProdShortDesc('Authentic homemade delicacy prepared with pure ingredients.');
    setProdDesc('Traditional recipe crafted in village kitchens using cold-pressed coconut oil and natural spices.');
    setProdIngredients('Rice Flour, Pure Coconut Oil, Rock Salt, Turmeric');
    setProdShelfLife('45 days');
    setProdStorage('Airtight glass or ceramic jar');
    setProdIsVeg(true);
    setProdFeatured(false);
    setProdBestSeller(false);
    setIsProductModalOpen(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = prodName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const newVariants: ProductVariant[] = [
      {
        id: `v-${Date.now()}-1`,
        weight: prodWeight,
        price: Number(prodPrice),
        mrp: Number(prodMrp),
        stock: Number(prodStock),
        sku: `THN-${slug.substring(0, 4).toUpperCase()}-${prodWeight}`,
      },
    ];

    if (editingProductId) {
      const existing = products.find((p) => p.id === editingProductId);
      if (existing) {
        updateProduct({
          ...existing,
          name: prodName,
          malayalamName: prodMalName,
          categoryIds: [prodCat as any],
          subcategory: prodSubcat,
          shortDescription: prodShortDesc,
          description: prodDesc,
          ingredients: prodIngredients.split(',').map((s) => s.trim()),
          shelfLife: prodShelfLife,
          storageInstructions: prodStorage,
          isVeg: prodIsVeg,
          isFeatured: prodFeatured,
          isBestSeller: prodBestSeller,
          variants: newVariants,
        });
      }
    } else {
      addProduct({
        id: `p-${Date.now()}`,
        name: prodName,
        malayalamName: prodMalName,
        slug,
        categoryIds: [prodCat as any],
        subcategory: prodSubcat,
        shortDescription: prodShortDesc,
        description: prodDesc,
        ingredients: prodIngredients.split(',').map((s) => s.trim()),
        shelfLife: prodShelfLife,
        storageInstructions: prodStorage,
        isVeg: prodIsVeg,
        isFeatured: prodFeatured,
        isBestSeller: prodBestSeller,
        isNewArrival: true,
        rating: 5.0,
        reviewCount: 1,
        images: ['banana_chips'],
        tags: ['New Batch', 'Homemade'],
        salesCount: 0,
        variants: newVariants,
      });
    }

    setIsProductModalOpen(false);
  };

  const handleUpdateOrderStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderForEdit) return;
    updateOrderStatus(
      selectedOrderForEdit.id,
      newStatus,
      statusNote || `Status updated to ${newStatus} by admin.`,
      courierName,
      trackingId
    );
    setSelectedOrderForEdit(null);
  };

  const exportOrdersCSV = () => {
    const headers = ['Order ID,Customer,Phone,Total,Payment Method,Payment Status,Order Status,Date\n'];
    const rows = orders.map((o) =>
      `"${o.id}","${o.customerName}","${o.customerPhone}","${o.total}","${o.paymentMethod}","${o.paymentStatus}","${o.orderStatus}","${o.createdAt}"\n`
    );
    const blob = new Blob([...headers, ...rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `thanima-orders-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#F9F7F1] text-slate-800 flex flex-col">
      {/* Admin Top Navigation Bar */}
      <header className="bg-[#14381F] text-white px-6 py-3.5 flex items-center justify-between border-b-2 border-[#F2A900] sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="font-malayalam font-bold text-xl text-[#F2A900]">തനിമ</span>
          <div className="border-l border-white/20 pl-3">
            <span className="font-bold text-xs uppercase tracking-wider text-white">
              Admin Portal
            </span>
            <span className="hidden sm:inline-block text-[10px] bg-[#F2A900] text-[#1F4D2B] font-bold px-1.5 py-0.2 rounded-xs ml-2">
              Super Admin
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <span className="hidden sm:inline text-white/70">
            Logged in as <strong>admin@thanima.in</strong>
          </span>
          <button
            onClick={onExitAdmin}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-white font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Exit to Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* Main Admin Wrapper: Sidebar + Viewport */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Admin Sidebar */}
        <aside className="w-full md:w-60 bg-white border-r border-[#EFE8D8] p-4 space-y-1 shrink-0">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard Overview</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'products'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-colors ${
              activeTab === 'orders'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <ShoppingBag className="w-4 h-4" />
              <span>Orders ({orders.length})</span>
            </div>
            {pendingOrdersCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[#B5502C] text-white text-[10px] font-bold flex items-center justify-center">
                {pendingOrdersCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'reviews'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <Star className="w-4 h-4" />
            <span>Reviews ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('banners')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'banners'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Hero Banners ({banners.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('messages')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'messages'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Messages & Leads</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2.5 transition-colors ${
              activeTab === 'settings'
                ? 'bg-[#1F4D2B] text-white shadow-2xs'
                : 'text-slate-700 hover:bg-[#F4F1EA]'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>Store Settings</span>
          </button>
        </aside>

        {/* Admin Content Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto space-y-6">
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Store Dashboard Overview</h2>
                <p className="text-xs text-slate-500">Live analytics, order volume, and sales metrics.</p>
              </div>

              {/* KPI Stat Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-5 bg-white border border-[#EFE8D8] rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Revenue
                  </span>
                  <div className="text-2xl font-extrabold text-[#1F4D2B] tabular-nums">
                    {formatINR(totalRevenue)}
                  </div>
                  <span className="text-[10px] text-emerald-600 font-medium">↑ +18.4% this week</span>
                </div>

                <div className="p-5 bg-white border border-[#EFE8D8] rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Total Orders
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {orders.length}
                  </div>
                  <span className="text-[10px] text-slate-500">{pendingOrdersCount} pending dispatch</span>
                </div>

                <div className="p-5 bg-white border border-[#EFE8D8] rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Products Listed
                  </span>
                  <div className="text-2xl font-extrabold text-slate-900 tabular-nums">
                    {products.length}
                  </div>
                  <span className="text-[10px] text-slate-500">Across all 8 categories</span>
                </div>

                <div className="p-5 bg-white border border-[#EFE8D8] rounded-2xl shadow-2xs space-y-1">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Low Stock Alerts
                  </span>
                  <div className="text-2xl font-extrabold text-[#B5502C] tabular-nums">
                    {lowStockProductsCount}
                  </div>
                  <span className="text-[10px] text-[#B5502C] font-medium">Reorder batch required</span>
                </div>
              </div>

              {/* Visual Analytics Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Last 30 Days Bar visual */}
                <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-sm text-slate-800">Sales Trend (Last 7 Days)</h3>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      Weekly Revenue: ₹14,280
                    </span>
                  </div>
                  <div className="h-44 flex items-end gap-3 pt-6 pb-2">
                    {[
                      { day: 'Mon', val: 1800, h: '45%' },
                      { day: 'Tue', val: 2400, h: '60%' },
                      { day: 'Wed', val: 1950, h: '50%' },
                      { day: 'Thu', val: 3200, h: '80%' },
                      { day: 'Fri', val: 2900, h: '72%' },
                      { day: 'Sat', val: 4100, h: '100%' },
                      { day: 'Sun', val: 3600, h: '90%' },
                    ].map((item) => (
                      <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <span className="text-[9px] text-slate-400 tabular-nums">₹{item.val}</span>
                        <div
                          className="w-full bg-[#1F4D2B] rounded-t-lg transition-all duration-500 hover:bg-[#F2A900]"
                          style={{ height: item.h }}
                        />
                        <span className="text-[10px] font-medium text-slate-600">{item.day}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Orders by Category Breakdown */}
                <div className="p-6 bg-white border border-[#EFE8D8] rounded-3xl shadow-xs space-y-4">
                  <h3 className="font-bold text-sm text-slate-800">Top Selling Categories</h3>
                  <div className="space-y-3 pt-2 text-xs">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-700">Traditional Snacks (Upperi & Chips)</span>
                        <span className="font-bold text-slate-900 tabular-nums">38% (₹8,490)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#1F4D2B] h-full rounded-full" style={{ width: '38%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-700">Homemade Pickles (Kannimanga & Prawn)</span>
                        <span className="font-bold text-slate-900 tabular-nums">26% (₹5,820)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#B5502C] h-full rounded-full" style={{ width: '26%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-700">Breakfast Essentials (Puttu & Batters)</span>
                        <span className="font-bold text-slate-900 tabular-nums">20% (₹4,480)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#F2A900] h-full rounded-full" style={{ width: '20%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-slate-700">Traditional Sweets (Kozhikodan Halwa)</span>
                        <span className="font-bold text-slate-900 tabular-nums">16% (₹3,580)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-[#4A2C17] h-full rounded-full" style={{ width: '16%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Orders table preview */}
              <div className="bg-white border border-[#EFE8D8] rounded-3xl p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-sm text-slate-800">Recent Customer Orders</h3>
                  <button
                    onClick={() => setActiveTab('orders')}
                    className="text-xs font-semibold text-[#1F4D2B] hover:underline"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5">Order ID</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Payment</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.slice(0, 5).map((o) => (
                        <tr key={o.id} className="hover:bg-slate-50">
                          <td className="py-2.5 font-mono font-bold text-slate-800">{o.id}</td>
                          <td>
                            <p className="font-medium text-slate-800">{o.customerName}</p>
                            <span className="text-[10px] text-slate-400">{o.customerPhone}</span>
                          </td>
                          <td className="font-bold text-[#1F4D2B] tabular-nums">
                            {formatINR(o.total)}
                          </td>
                          <td>
                            <span className="uppercase text-[10px] font-semibold text-slate-600">
                              {o.paymentMethod} ({o.paymentStatus})
                            </span>
                          </td>
                          <td>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                              {o.orderStatus}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => {
                                setSelectedOrderForEdit(o);
                                setNewStatus(o.orderStatus);
                                setCourierName(o.courierName || 'DTDC Express');
                                setTrackingId(o.trackingId || '');
                              }}
                              className="text-xs text-[#1F4D2B] font-semibold hover:underline"
                            >
                              Update Status
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Product Inventory Management</h2>
                  <p className="text-xs text-slate-500">
                    Add new delicacies, update variant pricing, and monitor stock levels.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleOpenNewProduct}
                    className="px-4 py-2 bg-[#1F4D2B] text-white text-xs font-bold rounded-xl hover:bg-[#14381F] flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Delicacy</span>
                  </button>
                </div>
              </div>

              {/* Search & filter input */}
              <div className="flex gap-3">
                <div className="relative flex-1 max-w-md">
                  <input
                    type="text"
                    value={prodSearch}
                    onChange={(e) => setProdSearch(e.target.value)}
                    placeholder="Search product inventory by name or Malayalam text..."
                    className="w-full text-xs pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-xl"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white border border-[#EFE8D8] rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFFDF7] border-b border-[#EFE8D8] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-3">Product</th>
                      <th>Category</th>
                      <th>Pack Size & Price</th>
                      <th>Stock Status</th>
                      <th>Flags</th>
                      <th className="text-right p-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products
                      .filter((p) =>
                        prodSearch
                          ? p.name.toLowerCase().includes(prodSearch.toLowerCase()) ||
                            p.malayalamName.includes(prodSearch)
                          : true
                      )
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-slate-50">
                          <td className="p-3">
                            <p className="font-semibold text-slate-800">{p.name}</p>
                            <span className="font-malayalam text-[10px] text-[#1F4D2B]">
                              {p.malayalamName}
                            </span>
                          </td>
                          <td>
                            <span className="capitalize text-[11px] text-slate-600">
                              {p.categoryIds[0]}
                            </span>
                          </td>
                          <td>
                            <span className="font-bold text-[#1F4D2B] tabular-nums">
                              {formatINR(p.variants[0]?.price || 0)}
                            </span>
                            <span className="text-[10px] text-slate-400 ml-1">
                              ({p.variants[0]?.weight})
                            </span>
                          </td>
                          <td>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                                p.variants[0]?.stock <= 10
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              {p.variants[0]?.stock} units
                            </span>
                          </td>
                          <td>
                            <div className="flex gap-1">
                              {p.isFeatured && (
                                <span className="bg-amber-100 text-amber-800 text-[9px] px-1 rounded-sm">
                                  Featured
                                </span>
                              )}
                              {p.isBestSeller && (
                                <span className="bg-emerald-100 text-emerald-800 text-[9px] px-1 rounded-sm">
                                  Best Seller
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="text-right p-3 space-x-2">
                            <button
                              onClick={() => handleOpenEditProduct(p)}
                              className="text-[#1F4D2B] hover:underline font-semibold"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Delete ${p.name}?`)) deleteProduct(p.id);
                              }}
                              className="text-red-600 hover:underline font-semibold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Customer Orders & Dispatch</h2>
                  <p className="text-xs text-slate-500">
                    Update fulfillment stages, enter courier tracking waybills, and print packing slips.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={exportOrdersCSV}
                    className="px-3.5 py-2 bg-white border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-1.5 shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-white border border-[#EFE8D8] rounded-3xl overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FFFDF7] border-b border-[#EFE8D8] text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-3">Order Number</th>
                      <th>Customer</th>
                      <th>Items Count</th>
                      <th>Total</th>
                      <th>Payment Status</th>
                      <th>Order Status</th>
                      <th>Tracking ID</th>
                      <th className="text-right p-3">Manage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {orders.map((o) => (
                      <tr key={o.id} className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-slate-800">{o.id}</td>
                        <td>
                          <p className="font-semibold text-slate-800">{o.customerName}</p>
                          <span className="text-[10px] text-slate-400">{o.shippingAddress.city}</span>
                        </td>
                        <td>{o.items.reduce((s, i) => s + i.quantity, 0)} items</td>
                        <td className="font-bold text-[#1F4D2B] tabular-nums">
                          {formatINR(o.total)}
                        </td>
                        <td>
                          <span className="uppercase text-[10px] font-bold text-slate-700">
                            {o.paymentStatus}
                          </span>
                        </td>
                        <td>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="font-mono text-slate-500 text-[11px]">
                          {o.trackingId || 'Unassigned'}
                        </td>
                        <td className="text-right p-3">
                          <button
                            onClick={() => {
                              setSelectedOrderForEdit(o);
                              setNewStatus(o.orderStatus);
                              setCourierName(o.courierName || 'DTDC Express');
                              setTrackingId(o.trackingId || '');
                            }}
                            className="px-3 py-1 bg-[#1F4D2B] text-white text-[11px] font-semibold rounded-lg hover:bg-[#14381F]"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: REVIEWS MODERATION */}
          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Customer Reviews Moderation</h2>
                <p className="text-xs text-slate-500">
                  Approve, reject, or remove customer feedback before it renders publicly.
                </p>
              </div>

              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 bg-white border border-[#EFE8D8] rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-slate-800">{rev.userName}</span>
                        <div className="flex text-[#F2A900]">
                          {Array.from({ length: rev.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-current" />
                          ))}
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.2 rounded-xs uppercase ${
                            rev.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1">{rev.comment}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => approveReview(rev.id)}
                          className="px-2.5 py-1 bg-emerald-600 text-white text-xs font-semibold rounded-lg hover:bg-emerald-700"
                        >
                          Approve
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => rejectReview(rev.id)}
                          className="px-2.5 py-1 bg-amber-600 text-white text-xs font-semibold rounded-lg hover:bg-amber-700"
                        >
                          Reject
                        </button>
                      )}
                      <button
                        onClick={() => deleteReview(rev.id)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 text-xs font-semibold rounded-lg"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: HERO BANNERS */}
          {activeTab === 'banners' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Homepage Banners & Hero Campaigns</h2>
                <p className="text-xs text-slate-500">Manage festival promotions and hero carousel banners.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div
                    key={b.id}
                    className="p-5 bg-white border border-[#EFE8D8] rounded-2xl space-y-2 shadow-2xs"
                  >
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm">
                      {b.badge}
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{b.title}</h4>
                    <p className="font-malayalam text-xs text-[#1F4D2B] font-semibold">
                      {b.malayalamTitle}
                    </p>
                    <p className="text-xs text-slate-500">{b.subtitle}</p>
                    <div className="pt-2 flex justify-between text-[11px] text-slate-400">
                      <span>CTA: {b.buttonText}</span>
                      <span>Target: {b.link}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: MESSAGES & LEADS */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Inbound Messages & Newsletter Subscribers</h2>
                <p className="text-xs text-slate-500">Contact submissions and customer inquiries.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Contact Form Messages ({contactMessages.length})
                  </h3>
                  {contactMessages.length > 0 ? (
                    contactMessages.map((msg) => (
                      <div key={msg.id} className="p-4 bg-white border border-[#EFE8D8] rounded-2xl text-xs space-y-1">
                        <div className="flex justify-between font-bold text-slate-800">
                          <span>{msg.name} ({msg.email})</span>
                          <span className="text-[10px] text-slate-400">{new Date(msg.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="font-semibold text-[#1F4D2B]">{msg.subject}</p>
                        <p className="text-slate-600 mt-1">{msg.message}</p>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 bg-white rounded-2xl text-xs text-slate-400">
                      No customer inquiries submitted yet.
                    </p>
                  )}
                </div>

                <div className="bg-white border border-[#EFE8D8] rounded-2xl p-4 space-y-3">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">
                    Newsletter Subscribers ({newsletterSubscribers.length})
                  </h3>
                  <div className="divide-y divide-slate-100 text-xs">
                    {newsletterSubscribers.map((email, idx) => (
                      <div key={idx} className="py-2 text-slate-700 font-mono text-[11px]">
                        {email}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <div className="max-w-xl bg-white border border-[#EFE8D8] rounded-3xl p-6 shadow-xs space-y-4">
              <h2 className="text-base font-bold text-slate-900">Store Configurations</h2>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Store Name</label>
                  <input
                    type="text"
                    defaultValue="Thanima - Kerala Homely Foods"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Currency Symbol</label>
                  <input
                    type="text"
                    defaultValue="₹ (INR)"
                    disabled
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Free Delivery Threshold</label>
                  <input
                    type="number"
                    defaultValue={499}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Cash on Delivery Handling Fee</label>
                  <input
                    type="number"
                    defaultValue={30}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => alert('Settings saved successfully!')}
                  className="px-5 py-2 bg-[#1F4D2B] text-white font-bold rounded-lg"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal: Order Status Update */}
      {selectedOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 border border-slate-200 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900">
                Update Order #{selectedOrderForEdit.id}
              </h3>
              <button onClick={() => setSelectedOrderForEdit(null)}>
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleUpdateOrderStatus} className="space-y-3 text-xs">
              <div>
                <label className="block font-medium text-slate-700 mb-1">Advance Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Courier Partner</label>
                <input
                  type="text"
                  value={courierName}
                  onChange={(e) => setCourierName(e.target.value)}
                  placeholder="e.g. DTDC / Kerala Post Speed"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Tracking Waybill Number</label>
                <input
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. DTDC-KL-982401"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Internal Note / Dispatch Note</label>
                <input
                  type="text"
                  value={statusNote}
                  onChange={(e) => setStatusNote(e.target.value)}
                  placeholder="e.g. Dispatched from Kakkanad central kitchen"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrderForEdit(null)}
                  className="px-3 py-1.5 bg-slate-100 rounded-lg text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#1F4D2B] text-white font-bold rounded-lg"
                >
                  Save & Notify Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Product Add / Edit */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="w-full max-w-xl bg-white rounded-3xl p-6 border border-slate-200 shadow-2xl my-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-sm text-slate-900">
                {editingProductId ? 'Edit Product' : 'Add New Homemade Food'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Product Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={prodName}
                    onChange={(e) => setProdName(e.target.value)}
                    placeholder="e.g. Sharkara Varatti"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Malayalam Name *</label>
                  <input
                    type="text"
                    required
                    value={prodMalName}
                    onChange={(e) => setProdMalName(e.target.value)}
                    placeholder="ശർക്കര വരട്ടി"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg font-malayalam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Category *</label>
                  <select
                    value={prodCat}
                    onChange={(e) => setProdCat(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Subcategory</label>
                  <input
                    type="text"
                    value={prodSubcat}
                    onChange={(e) => setProdSubcat(e.target.value)}
                    placeholder="e.g. Crisps & Upperi"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Weight</label>
                  <input
                    type="text"
                    value={prodWeight}
                    onChange={(e) => setProdWeight(e.target.value)}
                    placeholder="250g"
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Sale Price (₹)</label>
                  <input
                    type="number"
                    value={prodPrice}
                    onChange={(e) => setProdPrice(Number(e.target.value))}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">MRP (₹)</label>
                  <input
                    type="number"
                    value={prodMrp}
                    onChange={(e) => setProdMrp(Number(e.target.value))}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-medium text-slate-700 mb-1">Stock</label>
                  <input
                    type="number"
                    value={prodStock}
                    onChange={(e) => setProdStock(Number(e.target.value))}
                    className="w-full px-2 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={prodShortDesc}
                  onChange={(e) => setProdShortDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Full Description</label>
                <textarea
                  rows={2}
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-700 mb-1">Ingredients (comma-separated)</label>
                <input
                  type="text"
                  value={prodIngredients}
                  onChange={(e) => setProdIngredients(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodIsVeg}
                    onChange={(e) => setProdIsVeg(e.target.checked)}
                  />
                  <span>100% Vegetarian</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodFeatured}
                    onChange={(e) => setProdFeatured(e.target.checked)}
                  />
                  <span>Featured on Home</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={prodBestSeller}
                    onChange={(e) => setProdBestSeller(e.target.checked)}
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 rounded-xl text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#1F4D2B] text-white font-bold rounded-xl"
                >
                  Save Delicacy
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
