import React, { useState, useMemo } from 'react';
import { useShop, formatPKR } from '../context/ShopContext';
import {
  Product,
  Coupon,
  OrderStatus,
  PaymentStatus,
  ClothingCategory,
  ClothingCollection,
  ClothingFabric,
  ClothingSize,
  CategoryItem,
  CollectionItem,
  HomepageBanner,
} from '../types';
import { ConfirmModal } from '../components/ConfirmModal';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Tag,
  BarChart3,
  Sliders,
  Settings,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Truck,
  DollarSign,
  Search,
  Filter,
  Eye,
  EyeOff,
  FileText,
  Printer,
  Sparkles,
  Image as ImageIcon,
  Video,
  Upload,
  ArrowUpDown,
  MoveUp,
  MoveDown,
  Star,
  Layers,
  ChevronLeft,
  ChevronRight,
  X,
  Check,
} from 'lucide-react';

export const AdminDashboardView: React.FC = () => {
  const {
    products,
    orders,
    coupons,
    reviews,
    settings,
    customers,
    categories,
    collections,
    banners,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductActive,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    addCollection,
    updateCollection,
    deleteCollection,
    toggleCollectionActive,
    addBanner,
    updateBanner,
    deleteBanner,
    toggleBannerActive,
    toggleCustomerActive,
    updateOrderStatus,
    updatePaymentStatus,
    saveCoupon,
    deleteCoupon,
    toggleCouponActive,
    updateReviewStatus,
    deleteReview,
    updateSettings,
    toggleAdminMode,
    navigateTo,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<string>('products');

  // Search & Filters for Products
  const [productSearch, setProductSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [productPage, setProductPage] = useState(1);
  const itemsPerPage = 8;

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewProductModal, setViewProductModal] = useState<Product | null>(null);

  // Category Modal
  const [catModalOpen, setCatModalOpen] = useState(false);
  const [editingCat, setEditingCat] = useState<CategoryItem | null>(null);
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');
  const [catImage, setCatImage] = useState('');
  const [catActive, setCatActive] = useState(true);

  // Collection Modal
  const [colModalOpen, setColModalOpen] = useState(false);
  const [editingCol, setEditingCol] = useState<CollectionItem | null>(null);
  const [colName, setColName] = useState('');
  const [colSlug, setColSlug] = useState('');
  const [colDesc, setColDesc] = useState('');
  const [colBanner, setColBanner] = useState('');
  const [colSeason, setColSeason] = useState('');
  const [colActive, setColActive] = useState(true);

  // Banner Modal
  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HomepageBanner | null>(null);
  const [banTitle, setBanTitle] = useState('');
  const [banSubtitle, setBanSubtitle] = useState('');
  const [banBtnText, setBanBtnText] = useState('EXPLORE COLLECTION');
  const [banLinkCat, setBanLinkCat] = useState('Festive Collection');
  const [banImg, setBanImg] = useState('');
  const [banActive, setBanActive] = useState(true);

  // Coupon Modal
  const [couponModalOpen, setCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [cCode, setCCode] = useState('');
  const [cType, setCType] = useState<'percentage' | 'fixed'>('percentage');
  const [cValue, setCValue] = useState(10);
  const [cMinOrder, setCMinOrder] = useState(5000);
  const [cMaxDiscount, setCMaxDiscount] = useState<number | undefined>(3000);
  const [cExpiry, setCExpiry] = useState('2026-12-31');

  // Confirmation Modal state for safe deletion
  const [confirmModalState, setConfirmModalState] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    itemName: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    itemName: '',
    onConfirm: () => {},
  });

  // Product Form states
  const [pName, setPName] = useState('');
  const [pSku, setPSku] = useState('');
  const [pCategory, setPCategory] = useState<ClothingCategory>('Ready to Wear');
  const [pCollection, setPCollection] = useState<ClothingCollection>('The Heritage Edit');
  const [pType, setPType] = useState<'Stitched' | 'Unstitched'>('Stitched');
  const [pFabric, setPFabric] = useState<ClothingFabric>('Lawn');
  const [pPieces, setPPieces] = useState<'1 Piece' | '2 Piece' | '3 Piece'>('3 Piece');
  const [pComponents, setPComponents] = useState('Embroidered Shirt, Trouser, Dupatta');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState(8500);
  const [pSalePrice, setPSalePrice] = useState<string>('');
  const [pStock, setPStock] = useState(20);
  const [pSizes, setPSizes] = useState<ClothingSize[]>(['S', 'M', 'L']);
  const [pColors, setPColors] = useState('Ivory, Emerald');
  const [imageList, setImageList] = useState<string[]>([]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [pVideo, setPVideo] = useState('');
  const [pFeatured, setPFeatured] = useState(false);
  const [pNewArrival, setPNewArrival] = useState(true);
  const [pBestseller, setPBestseller] = useState(false);
  const [pSale, setPSale] = useState(false);
  const [pActive, setPActive] = useState(true);

  // Settings State
  const [announcementText, setAnnouncementText] = useState(settings.announcementBarText);
  const [announcementActive, setAnnouncementActive] = useState(settings.announcementBarActive);
  const [freeShipThreshold, setFreeShipThreshold] = useState(settings.freeShippingThreshold);
  const [shippingFeeVal, setShippingFeeVal] = useState(settings.standardShippingFee);
  const [heroHeadingVal, setHeroHeadingVal] = useState(settings.heroHeading);
  const [heroTaglineVal, setHeroTaglineVal] = useState(settings.heroTagline);
  const [heroDescVal, setHeroDescVal] = useState(settings.heroDescription);
  const [heroImageVal, setHeroImageVal] = useState(settings.heroImage);

  // Orders and Reviews Filters
  const [orderFilter, setOrderFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');

  // Metrics
  const totalRevenue = orders.reduce((sum, o) => (o.orderStatus !== 'Cancelled' ? sum + o.grandTotal : sum), 0);
  const totalOrdersCount = orders.length;
  const pendingOrdersCount = orders.filter((o) => o.orderStatus === 'Order Placed' || o.orderStatus === 'Processing').length;
  const lowStockCount = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  // Open Product Modal for Add
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setPName('');
    setPSku(`ZRM-PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setPCategory('Ready to Wear');
    setPCollection('New Arrivals');
    setPType('Stitched');
    setPFabric('Lawn');
    setPPieces('3 Piece');
    setPComponents('Embroidered Shirt (3.1m), Plain Trouser (2.5m), Organza Dupatta (2.5m)');
    setPDesc('Heirloom Pakistani luxury garment tailored with intricate threadwork and pristine craftsmanship.');
    setPPrice(8950);
    setPSalePrice('');
    setPStock(24);
    setPSizes(['XS', 'S', 'M', 'L', 'XL']);
    setPColors('Ivory, Burgundy, Emerald');
    setImageList(['/src/assets/images/lawn_collection_1791436586308.jpg']);
    setNewImageUrl('');
    setPVideo('https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-an-elegant-dress-41126-large.mp4');
    setPFeatured(false);
    setPNewArrival(true);
    setPBestseller(false);
    setPSale(false);
    setPActive(true);
    setProductModalOpen(true);
  };

  // Open Product Modal for Edit
  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setPName(prod.name);
    setPSku(prod.sku);
    setPCategory(prod.category);
    setPCollection(prod.collection);
    setPType(prod.productType);
    setPFabric(prod.fabric);
    setPPieces(prod.pieces);
    setPComponents(prod.components.join(', '));
    setPDesc(prod.description);
    setPPrice(prod.price);
    setPSalePrice(prod.salePrice ? String(prod.salePrice) : '');
    setPStock(prod.stock);
    setPSizes(prod.sizes);
    setPColors(prod.colors.map((c) => c.name).join(', '));
    setImageList([...prod.images]);
    setNewImageUrl('');
    setPVideo(prod.videoUrl || '');
    setPFeatured(prod.isFeatured);
    setPNewArrival(prod.isNewArrival);
    setPBestseller(prod.isBestseller);
    setPSale(prod.isSale);
    setPActive(prod.isActive);
    setProductModalOpen(true);
  };

  // Delete Product Handler with confirmation popup
  const handleDeleteProductPrompt = (prod: Product) => {
    setConfirmModalState({
      isOpen: true,
      title: 'Remove Garment from Catalog',
      message: `Are you sure you want to remove "${prod.name}" (SKU: ${prod.sku})? This cloth will no longer appear on the customer storefront. Past order receipts will remain intact.`,
      itemName: `${prod.name} — ${formatPKR(prod.salePrice ?? prod.price)}`,
      onConfirm: () => {
        deleteProduct(prod.id);
        setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Image Upload simulation via File or URL
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImageList((prev) => [...prev, reader.result as string]);
          showToast('Image uploaded and added to gallery', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageList((prev) => [...prev, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImage = (index: number) => {
    if (imageList.length <= 1) {
      showToast('A garment must have at least one image', 'error');
      return;
    }
    setImageList((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakeMainImage = (index: number) => {
    if (index === 0) return;
    setImageList((prev) => {
      const copy = [...prev];
      const [selected] = copy.splice(index, 1);
      return [selected, ...copy];
    });
    showToast('Updated primary display image', 'info');
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();

    if (!pName.trim() || !pSku.trim() || pPrice <= 0) {
      showToast('Please fill in required fields (Name, SKU, Price)', 'error');
      return;
    }

    const colorArray = pColors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({
        name,
        hex:
          name.toLowerCase().includes('black') || name.toLowerCase().includes('onyx')
            ? '#1C1A1A'
            : name.toLowerCase().includes('emerald')
            ? '#1C3D2F'
            : name.toLowerCase().includes('maroon') || name.toLowerCase().includes('red')
            ? '#631821'
            : name.toLowerCase().includes('blue')
            ? '#2A4A68'
            : '#D6C09A',
      }));

    const compArray = pComponents
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const productPayload: Product = {
      id: editingProduct?.id || `zrm-prod-${Date.now()}`,
      sku: pSku.trim().toUpperCase(),
      name: pName.trim(),
      category: pCategory,
      collection: pCollection,
      productType: pType,
      fabric: pFabric,
      pieces: pPieces,
      components: compArray,
      description: pDesc,
      price: Number(pPrice),
      salePrice: pSalePrice ? Number(pSalePrice) : undefined,
      stock: Number(pStock),
      sizes: pSizes.length > 0 ? pSizes : ['Unstitched'],
      colors: colorArray.length > 0 ? colorArray : [{ name: 'Ivory', hex: '#FAF8F5' }],
      careInstructions: editingProduct?.careInstructions || ['Dry clean recommended', 'Steam iron'],
      deliveryInfo: 'Ships nationwide within 2-4 business days.',
      images: imageList.length > 0 ? imageList : ['/src/assets/images/zarmeen_hero_1791436571248.jpg'],
      videoUrl: pVideo.trim() || undefined,
      isFeatured: pFeatured,
      isNewArrival: pNewArrival,
      isBestseller: pBestseller,
      isSale: pSale || Boolean(pSalePrice && Number(pSalePrice) < Number(pPrice)),
      isActive: pActive,
      rating: editingProduct?.rating || 5.0,
      reviewCount: editingProduct?.reviewCount || 1,
      createdAt: editingProduct?.createdAt || new Date().toISOString(),
    };

    if (editingProduct) {
      updateProduct(productPayload);
    } else {
      addProduct(productPayload);
    }

    setProductModalOpen(false);
  };

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.sku.toLowerCase().includes(productSearch.toLowerCase()) ||
        p.fabric.toLowerCase().includes(productSearch.toLowerCase());

      const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;

      const matchesStatus =
        statusFilter === 'all'
          ? true
          : statusFilter === 'active'
          ? p.isActive
          : statusFilter === 'inactive'
          ? !p.isActive
          : statusFilter === 'low-stock'
          ? p.stock > 0 && p.stock <= 5
          : statusFilter === 'out-of-stock'
          ? p.stock <= 0
          : true;

      return matchesSearch && matchesCat && matchesStatus;
    });
  }, [products, productSearch, categoryFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = filteredProducts.slice(
    (productPage - 1) * itemsPerPage,
    productPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-[#F6F4EE] text-stone-900 flex flex-col md:flex-row">
      {/* 1. Admin Sidebar */}
      <aside className="w-full md:w-68 bg-[#181616] text-white flex flex-col justify-between shrink-0 border-r border-stone-800">
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-stone-800 flex items-center justify-between">
            <div>
              <span className="font-heading text-xl tracking-[0.2em] text-white block">ZARMEEN</span>
              <span className="text-[9px] tracking-[0.3em] text-[#D6B57E] uppercase font-bold">
                Atelier Control Suite
              </span>
            </div>
            <button
              onClick={toggleAdminMode}
              className="text-[11px] bg-[#8A1C24] hover:bg-[#A3232D] text-white px-3 py-1 font-semibold rounded-xs transition-colors cursor-pointer"
            >
              Storefront
            </button>
          </div>

          {/* Nav Items */}
          <nav className="p-4 space-y-1 text-xs">
            <button
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'products' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package size={16} />
                <span>Clothes &amp; Products</span>
              </div>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'categories' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Layers size={16} />
                <span>Categories</span>
              </div>
              <span className="text-[10px] text-stone-400">{categories.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('collections')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'collections' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Sparkles size={16} />
                <span>Collections</span>
              </div>
              <span className="text-[10px] text-stone-400">{collections.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingBag size={16} />
                <span>Orders &amp; Invoices</span>
              </div>
              <span className="bg-white/20 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">
                {orders.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('homepage')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'homepage' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <ImageIcon size={16} />
              <span>Homepage &amp; Banners</span>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'coupons' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Tag size={16} />
                <span>Coupons &amp; Discs</span>
              </div>
              <span className="text-[10px] text-stone-400">{coupons.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('reviews')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'reviews' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <MessageSquare size={16} />
                <span>Reviews</span>
              </div>
              <span className="text-[10px] text-stone-400">{reviews.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('customers')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'customers' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users size={16} />
                <span>Customers</span>
              </div>
              <span className="text-[10px] text-stone-400">{customers.length}</span>
            </button>

            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'overview' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <BarChart3 size={16} />
              <span>Sales Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xs transition-colors cursor-pointer ${
                activeTab === 'settings' ? 'bg-[#8A1C24] text-white font-semibold' : 'text-stone-300 hover:bg-stone-800'
              }`}
            >
              <Settings size={16} />
              <span>Store Settings</span>
            </button>
          </nav>
        </div>

        {/* Quick Help & Database Info */}
        <div className="p-4 border-t border-stone-800 text-[11px] text-stone-400 space-y-1">
          <p className="font-semibold text-[#D6B57E]">Direct Database Synchronization</p>
          <p>Any cloth added, edited, or removed updates the customer storefront immediately.</p>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-h-screen">
        {/* ================= SECTION: PRODUCTS / CLOTHES ================= */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            {/* Top Action Bar with prominent Add Cloth Option */}
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">
                  Catalog &amp; Inventory Hub
                </span>
                <h1 className="font-heading text-2xl md:text-3xl font-semibold text-stone-900 mt-0.5">
                  Pakistani Clothes Management
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Add new dresses, edit prices, manage fabrics, upload videos &amp; photos, or remove clothes from sale.
                </p>
              </div>

              {/* PROMINENT ADD CLOTH BUTTON */}
              <button
                onClick={handleOpenAddProduct}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-6 py-3 text-xs uppercase tracking-widest font-bold flex items-center gap-2.5 rounded-xs shadow-md transition-all transform hover:-translate-y-0.5 cursor-pointer shrink-0"
              >
                <Plus size={18} />
                <span>+ Add New Cloth / Dress</span>
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div className="bg-white p-4 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase font-semibold text-[10px]">Total Garments</span>
                <p className="text-xl font-bold font-mono text-stone-900 mt-1">{products.length} Designs</p>
              </div>
              <div className="bg-white p-4 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase font-semibold text-[10px]">Active in Store</span>
                <p className="text-xl font-bold font-mono text-emerald-800 mt-1">
                  {products.filter((p) => p.isActive).length} Public
                </p>
              </div>
              <div className="bg-white p-4 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase font-semibold text-[10px]">Low Stock (≤ 5)</span>
                <p className="text-xl font-bold font-mono text-amber-700 mt-1">{lowStockCount} Articles</p>
              </div>
              <div className="bg-white p-4 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase font-semibold text-[10px]">Sold Out</span>
                <p className="text-xl font-bold font-mono text-red-700 mt-1">{outOfStockCount} Articles</p>
              </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 border border-stone-200 rounded-xs flex flex-col md:flex-row gap-4 justify-between items-center text-xs">
              <div className="relative w-full md:w-80">
                <Search size={15} className="absolute left-3 top-2.5 text-stone-400" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setProductPage(1);
                  }}
                  placeholder="Search by cloth name, SKU, or fabric..."
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-stone-300 rounded-xs text-xs focus:outline-none focus:border-[#8A1C24]"
                />
              </div>

              <div className="flex flex-wrap gap-3 w-full md:w-auto">
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setProductPage(1);
                  }}
                  className="bg-[#FAF8F5] border border-stone-300 px-3 py-2 rounded-xs"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setProductPage(1);
                  }}
                  className="bg-[#FAF8F5] border border-stone-300 px-3 py-2 rounded-xs"
                >
                  <option value="all">All Visibility</option>
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Hidden (Draft)</option>
                  <option value="low-stock">Low Stock (≤ 5)</option>
                  <option value="out-of-stock">Sold Out</option>
                </select>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-stone-200 rounded-xs overflow-hidden shadow-2xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] text-stone-700 uppercase tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="p-3.5">Cloth Image</th>
                      <th className="p-3.5">Name &amp; SKU</th>
                      <th className="p-3.5">Category &amp; Fabric</th>
                      <th className="p-3.5">Price (PKR)</th>
                      <th className="p-3.5">Vault Stock</th>
                      <th className="p-3.5">Storefront Visibility</th>
                      <th className="p-3.5 text-right">Actions (View / Edit / Delete)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paginatedProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center text-stone-500">
                          No clothing items found matching your filters.
                        </td>
                      </tr>
                    ) : (
                      paginatedProducts.map((p) => {
                        const price = p.salePrice ?? p.price;
                        return (
                          <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                            <td className="p-3.5">
                              <img
                                src={p.images[0] || '/src/assets/images/zarmeen_hero_1791436571248.jpg'}
                                alt={p.name}
                                className="w-12 h-16 object-cover object-top rounded-xs border border-stone-200 bg-[#F4EFE6]"
                              />
                            </td>

                            <td className="p-3.5">
                              <span className="font-heading font-semibold text-stone-900 block text-xs">
                                {p.name}
                              </span>
                              <span className="text-[10px] text-stone-400 font-mono">SKU: {p.sku}</span>
                              <div className="flex gap-1 mt-1">
                                {p.isSale && (
                                  <span className="bg-[#8A1C24] text-white text-[9px] px-1.5 py-0.2 rounded-xs">
                                    SALE
                                  </span>
                                )}
                                {p.isNewArrival && (
                                  <span className="bg-stone-800 text-white text-[9px] px-1.5 py-0.2 rounded-xs">
                                    NEW
                                  </span>
                                )}
                              </div>
                            </td>

                            <td className="p-3.5">
                              <span className="font-medium text-stone-800 block">{p.category}</span>
                              <span className="text-[11px] text-stone-500">
                                {p.fabric} · {p.pieces}
                              </span>
                            </td>

                            <td className="p-3.5">
                              <span className="font-bold text-stone-900 font-mono">{formatPKR(price)}</span>
                              {p.salePrice && (
                                <span className="text-[10px] text-stone-400 line-through block font-mono">
                                  {formatPKR(p.price)}
                                </span>
                              )}
                            </td>

                            <td className="p-3.5">
                              <span
                                className={`font-mono font-bold ${
                                  p.stock <= 0
                                    ? 'text-red-700'
                                    : p.stock <= 5
                                    ? 'text-amber-700'
                                    : 'text-emerald-800'
                                }`}
                              >
                                {p.stock} Units
                              </span>
                            </td>

                            {/* Visibility status & Activate/Deactivate Toggle */}
                            <td className="p-3.5">
                              <button
                                onClick={() => toggleProductActive(p.id)}
                                className={`px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider rounded-xs flex items-center gap-1.5 cursor-pointer transition-colors ${
                                  p.isActive
                                    ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                                    : 'bg-stone-200 hover:bg-stone-300 text-stone-700 border border-stone-300'
                                }`}
                                title="Click to Toggle Website Visibility"
                              >
                                {p.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                                <span>{p.isActive ? 'Active (Live)' : 'Draft (Hidden)'}</span>
                              </button>
                            </td>

                            {/* Actions Column: View, Edit, Remove */}
                            <td className="p-3.5 text-right space-x-1">
                              <button
                                onClick={() => setViewProductModal(p)}
                                className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xs transition-colors"
                                title="View Complete Garment Details"
                              >
                                <Eye size={15} />
                              </button>

                              <button
                                onClick={() => handleOpenEditProduct(p)}
                                className="p-1.5 text-stone-600 hover:text-[#8A1C24] hover:bg-stone-100 rounded-xs transition-colors"
                                title="Edit Garment Specifications &amp; Pricing"
                              >
                                <Edit2 size={15} />
                              </button>

                              <button
                                onClick={() => handleDeleteProductPrompt(p)}
                                className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs transition-colors"
                                title="Remove / Delete Cloth From Catalog"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="p-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
                  <span>
                    Showing {paginatedProducts.length} of {filteredProducts.length} articles
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setProductPage((p) => Math.max(1, p - 1))}
                      disabled={productPage === 1}
                      className="p-1.5 border border-stone-300 rounded-xs disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronLeft size={14} />
                    </button>
                    <span className="font-semibold text-stone-800">
                      Page {productPage} of {totalPages}
                    </span>
                    <button
                      onClick={() => setProductPage((p) => Math.min(totalPages, p + 1))}
                      disabled={productPage === totalPages}
                      className="p-1.5 border border-stone-300 rounded-xs disabled:opacity-40 cursor-pointer"
                    >
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= SECTION: CATEGORIES ================= */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Taxonomy</span>
                <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                  Clothing Categories Management
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage Lawn, Khaddar, Luxury Pret, Formal Wear, Festive, and Modest lines.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCat(null);
                  setCatName('');
                  setCatSlug('');
                  setCatDesc('');
                  setCatImage('/src/assets/images/lawn_collection_1791436586308.jpg');
                  setCatActive(true);
                  setCatModalOpen(true);
                }}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2 rounded-xs shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const count = products.filter((p) => p.category === cat.name).length;
                return (
                  <div key={cat.id} className="bg-white border border-stone-200 p-5 rounded-xs space-y-3 shadow-2xs">
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100 rounded-xs relative">
                      <img src={cat.image} alt={cat.name} className="w-full h-full object-cover object-top" />
                      <button
                        onClick={() => toggleCategoryActive(cat.id)}
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                          cat.isActive ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {cat.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-heading text-base font-semibold text-stone-900">{cat.name}</h3>
                        <span className="text-xs text-[#8A1C24] font-bold">{count} Clothes</span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1 line-clamp-2">{cat.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => {
                          setEditingCat(cat);
                          setCatName(cat.name);
                          setCatSlug(cat.slug);
                          setCatDesc(cat.description);
                          setCatImage(cat.image);
                          setCatActive(cat.isActive);
                          setCatModalOpen(true);
                        }}
                        className="px-3 py-1 border border-stone-300 hover:border-stone-800 rounded-xs flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setConfirmModalState({
                            isOpen: true,
                            title: 'Delete Category',
                            message: `Are you sure you want to delete category "${cat.name}"? Products assigned to it will remain in database.`,
                            itemName: cat.name,
                            onConfirm: () => {
                              deleteCategory(cat.id);
                              setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-xs flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: COLLECTIONS ================= */}
        {activeTab === 'collections' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Couture Edits</span>
                <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                  Seasonal Collections Management
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage The Heritage Edit, Summer Lawn, Festive Edit, and Wedding Couture.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCol(null);
                  setColName('');
                  setColSlug('');
                  setColDesc('');
                  setColBanner('/src/assets/images/zarmeen_hero_1791436571248.jpg');
                  setColSeason('Spring/Summer 2026');
                  setColActive(true);
                  setColModalOpen(true);
                }}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2 rounded-xs shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Add Collection</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {collections.map((col) => {
                const count = products.filter((p) => p.collection === col.name).length;
                return (
                  <div key={col.id} className="bg-white border border-stone-200 p-5 rounded-xs space-y-3 shadow-2xs">
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100 rounded-xs relative">
                      <img src={col.bannerImage} alt={col.name} className="w-full h-full object-cover object-top" />
                      <button
                        onClick={() => toggleCollectionActive(col.id)}
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                          col.isActive ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {col.isActive ? 'Active' : 'Draft'}
                      </button>
                    </div>

                    <div>
                      <div className="flex justify-between items-baseline">
                        <h3 className="font-heading text-base font-semibold text-stone-900">{col.name}</h3>
                        <span className="text-xs text-[#8A1C24] font-bold">{count} Articles</span>
                      </div>
                      <span className="text-[11px] text-stone-400 block">{col.season}</span>
                      <p className="text-xs text-stone-500 mt-1">{col.description}</p>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => {
                          setEditingCol(col);
                          setColName(col.name);
                          setColSlug(col.slug);
                          setColDesc(col.description);
                          setColBanner(col.bannerImage);
                          setColSeason(col.season || '');
                          setColActive(col.isActive);
                          setColModalOpen(true);
                        }}
                        className="px-3 py-1 border border-stone-300 hover:border-stone-800 rounded-xs flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          setConfirmModalState({
                            isOpen: true,
                            title: 'Delete Collection',
                            message: `Are you sure you want to delete collection "${col.name}"?`,
                            itemName: col.name,
                            onConfirm: () => {
                              deleteCollection(col.id);
                              setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="px-3 py-1 bg-red-50 text-red-700 hover:bg-red-100 rounded-xs flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= SECTION: ORDERS ================= */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Fulfillment</span>
                <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                  Domestic Orders &amp; Logistics
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Manage order status, confirm payments, view customer addresses, and print invoices.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-semibold uppercase">Filter:</span>
                <select
                  value={orderFilter}
                  onChange={(e) => setOrderFilter(e.target.value)}
                  className="bg-[#FAF8F5] border border-stone-300 p-2 rounded-xs"
                >
                  <option value="all">All Orders</option>
                  <option value="Order Placed">Order Placed</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Packed">Packed</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              {orders
                .filter((o) => (orderFilter === 'all' ? true : o.orderStatus === orderFilter))
                .map((ord) => (
                  <div key={ord.id} className="bg-white border border-stone-200 p-6 rounded-xs shadow-2xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-stone-100 gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-stone-900">
                            #{ord.orderNumber}
                          </span>
                          <span className="text-stone-400 text-xs">
                            {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-stone-600 mt-1">
                          <strong>Recipient:</strong> {ord.customer.fullName} ({ord.customer.phone}) · {ord.customer.city}, {ord.customer.province}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* Order status dropdown */}
                        <select
                          value={ord.orderStatus}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="bg-[#FAF8F5] border border-stone-300 text-xs p-1.5 font-semibold text-[#8A1C24] rounded-xs cursor-pointer"
                        >
                          <option value="Order Placed">Order Placed</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                          <option value="Returned">Returned</option>
                        </select>

                        {/* Payment Status dropdown */}
                        <select
                          value={ord.paymentStatus}
                          onChange={(e) => updatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                          className={`text-xs p-1.5 font-semibold rounded-xs border cursor-pointer ${
                            ord.paymentStatus === 'Paid'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-amber-50 text-amber-800 border-amber-300'
                          }`}
                        >
                          <option value="Pending">Payment: Pending</option>
                          <option value="Paid">Payment: Paid</option>
                          <option value="Failed">Payment: Failed</option>
                          <option value="Refunded">Payment: Refunded</option>
                        </select>

                        <button
                          onClick={() => navigateTo('order-confirmation', { orderNumber: ord.orderNumber })}
                          className="p-1.5 text-stone-600 hover:text-[#8A1C24] border border-stone-300 rounded-xs"
                          title="Print Invoice"
                        >
                          <Printer size={15} />
                        </button>
                      </div>
                    </div>

                    {/* Order items preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center bg-[#FAF8F5] p-2 border border-stone-100 rounded-xs">
                          <img src={item.image} alt={item.name} className="w-10 h-12 object-cover object-top" />
                          <div>
                            <p className="font-semibold text-stone-900 line-clamp-1">{item.name}</p>
                            <p className="text-[10px] text-stone-500">
                              {item.size} · {item.color} · Qty: {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-xs text-stone-600">
                      <span>Method: <strong>{ord.paymentMethod}</strong></span>
                      <span className="font-bold text-sm text-[#8A1C24]">
                        Total: {formatPKR(ord.grandTotal)}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: HOMEPAGE & BANNERS ================= */}
        {activeTab === 'homepage' && (
          <div className="space-y-8">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs">
              <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Storefront Front</span>
              <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                Homepage &amp; Campaign Editor
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Customize the main editorial hero campaign, headings, taglines, and feature banners.
              </p>
            </div>

            {/* Hero Editor */}
            <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4 shadow-2xs max-w-3xl">
              <h3 className="font-heading text-base font-semibold text-stone-900 uppercase tracking-wider border-b border-stone-100 pb-2">
                Main Hero Editorial Campaign
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Brand Heading</label>
                  <input
                    type="text"
                    value={heroHeadingVal}
                    onChange={(e) => setHeroHeadingVal(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Brand Tagline</label>
                  <input
                    type="text"
                    value={heroTaglineVal}
                    onChange={(e) => setHeroTaglineVal(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Hero Description</label>
                  <textarea
                    rows={2}
                    value={heroDescVal}
                    onChange={(e) => setHeroDescVal(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-stone-700 font-semibold mb-1">Hero Image Asset URL</label>
                  <input
                    type="text"
                    value={heroImageVal}
                    onChange={(e) => setHeroImageVal(e.target.value)}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 focus:outline-none focus:border-[#8A1C24]"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  updateSettings({
                    heroHeading: heroHeadingVal,
                    heroTagline: heroTaglineVal,
                    heroDescription: heroDescVal,
                    heroImage: heroImageVal,
                  });
                }}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Save Hero Settings
              </button>
            </div>

            {/* Banners List */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-heading text-lg font-semibold text-stone-900">
                  Feature Campaign Banners ({banners.length})
                </h3>
                <button
                  onClick={() => {
                    setEditingBanner(null);
                    setBanTitle('');
                    setBanSubtitle('');
                    setBanBtnText('EXPLORE NOW');
                    setBanLinkCat('Ready to Wear');
                    setBanImg('/src/assets/images/pret_couture_1791436600244.jpg');
                    setBanActive(true);
                    setBannerModalOpen(true);
                  }}
                  className="bg-[#1C1A1A] hover:bg-[#8A1C24] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold rounded-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Plus size={14} />
                  <span>Add Banner</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((ban) => (
                  <div key={ban.id} className="bg-white border border-stone-200 p-4 rounded-xs space-y-3">
                    <div className="aspect-[16/9] overflow-hidden bg-stone-100 rounded-xs relative">
                      <img src={ban.image} alt={ban.title} className="w-full h-full object-cover" />
                      <button
                        onClick={() => toggleBannerActive(ban.id)}
                        className={`absolute top-2 right-2 px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                          ban.isActive ? 'bg-emerald-700 text-white' : 'bg-stone-800 text-stone-300'
                        }`}
                      >
                        {ban.isActive ? 'Active' : 'Disabled'}
                      </button>
                    </div>

                    <div>
                      <h4 className="font-heading text-sm font-semibold text-stone-900">{ban.title}</h4>
                      <p className="text-xs text-stone-500 mt-0.5">{ban.subtitle}</p>
                    </div>

                    <div className="flex justify-end gap-2 text-xs pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setEditingBanner(ban);
                          setBanTitle(ban.title);
                          setBanSubtitle(ban.subtitle);
                          setBanBtnText(ban.buttonText);
                          setBanLinkCat(ban.linkCategory);
                          setBanImg(ban.image);
                          setBanActive(ban.isActive);
                          setBannerModalOpen(true);
                        }}
                        className="px-3 py-1 border border-stone-300 rounded-xs text-stone-700 hover:border-stone-800"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          setConfirmModalState({
                            isOpen: true,
                            title: 'Delete Banner',
                            message: `Are you sure you want to remove banner "${ban.title}"?`,
                            itemName: ban.title,
                            onConfirm: () => {
                              deleteBanner(ban.id);
                              setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                            },
                          });
                        }}
                        className="px-3 py-1 bg-red-50 text-red-700 rounded-xs"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION: COUPONS ================= */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Marketing</span>
                <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                  Promotional Coupons &amp; Discount Vouchers
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Create percentage or flat PKR discounts with minimum order thresholds.
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCoupon(null);
                  setCCode('');
                  setCType('percentage');
                  setCValue(10);
                  setCMinOrder(5000);
                  setCMaxDiscount(3000);
                  setCExpiry('2026-12-31');
                  setCouponModalOpen(true);
                }}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-5 py-2.5 text-xs uppercase tracking-wider font-bold flex items-center gap-2 rounded-xs shadow-sm cursor-pointer"
              >
                <Plus size={16} />
                <span>+ Create Coupon</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-white border border-stone-200 p-5 rounded-xs space-y-3 shadow-2xs">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-base font-bold text-[#8A1C24] tracking-wider">
                      {c.code}
                    </span>
                    <button
                      onClick={() => toggleCouponActive(c.id)}
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>

                  <p className="text-sm font-semibold text-stone-900">
                    {c.type === 'percentage' ? `${c.discountValue}% OFF` : `PKR ${c.discountValue} FLAT OFF`}
                  </p>

                  <div className="text-xs text-stone-600 space-y-1">
                    <p>Min Order: {formatPKR(c.minOrderValue)}</p>
                    {c.maxDiscount && <p>Max Discount: {formatPKR(c.maxDiscount)}</p>}
                    <p>Redeemed: {c.usedCount} times</p>
                    <p className="text-[11px] text-stone-400">Expires: {c.expiryDate}</p>
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex justify-end gap-2 text-xs">
                    <button
                      onClick={() => {
                        setEditingCoupon(c);
                        setCCode(c.code);
                        setCType(c.type);
                        setCValue(c.discountValue);
                        setCMinOrder(c.minOrderValue);
                        setCMaxDiscount(c.maxDiscount);
                        setCExpiry(c.expiryDate);
                        setCouponModalOpen(true);
                      }}
                      className="px-3 py-1 border border-stone-300 rounded-xs text-stone-700"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => {
                        setConfirmModalState({
                          isOpen: true,
                          title: 'Delete Coupon',
                          message: `Are you sure you want to delete coupon code "${c.code}"? Customers will no longer be able to apply it.`,
                          itemName: c.code,
                          onConfirm: () => {
                            deleteCoupon(c.id);
                            setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                          },
                        });
                      }}
                      className="px-3 py-1 bg-red-50 text-red-700 rounded-xs"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: CUSTOMERS ================= */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs">
              <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Patron Base</span>
              <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                Registered Customer Accounts
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                View customer contact details, delivery addresses, and activate or suspend accounts.
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-xs overflow-hidden shadow-2xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF8F5] text-stone-700 uppercase tracking-wider border-b border-stone-200">
                  <tr>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">Email &amp; Mobile</th>
                    <th className="p-3.5">City &amp; Primary Address</th>
                    <th className="p-3.5">Member Since</th>
                    <th className="p-3.5">Account Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {customers.map((cust) => {
                    const primaryAddr = cust.addresses.find((a) => a.isDefault) || cust.addresses[0];
                    return (
                      <tr key={cust.id} className="hover:bg-stone-50">
                        <td className="p-3.5 font-semibold text-stone-900">{cust.fullName}</td>
                        <td className="p-3.5">
                          <p>{cust.email}</p>
                          <p className="text-stone-400 font-mono text-[11px]">{cust.phone}</p>
                        </td>
                        <td className="p-3.5 text-stone-600">
                          {primaryAddr ? `${primaryAddr.city}, ${primaryAddr.province}` : 'No address saved'}
                        </td>
                        <td className="p-3.5 text-stone-500">{cust.joinedDate}</td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded-xs ${
                              cust.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {cust.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => toggleCustomerActive(cust.id)}
                            className={`px-3 py-1 rounded-xs text-[11px] font-medium border ${
                              cust.isActive
                                ? 'border-amber-300 text-amber-800 hover:bg-amber-50'
                                : 'border-emerald-300 text-emerald-800 hover:bg-emerald-50'
                            }`}
                          >
                            {cust.isActive ? 'Suspend' : 'Activate'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ================= SECTION: REVIEWS ================= */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs flex justify-between items-center">
              <div>
                <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Feedback</span>
                <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                  Customer Review Moderation
                </h1>
                <p className="text-xs text-stone-500 mt-1">
                  Only approved reviews are published on the customer garment pages.
                </p>
              </div>

              <select
                value={reviewFilter}
                onChange={(e) => setReviewFilter(e.target.value)}
                className="bg-[#FAF8F5] border border-stone-300 p-2 text-xs rounded-xs"
              >
                <option value="all">All Reviews</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
              </select>
            </div>

            <div className="space-y-3">
              {reviews
                .filter((r) => (reviewFilter === 'all' ? true : r.status === reviewFilter))
                .map((rev) => (
                  <div key={rev.id} className="bg-white border border-stone-200 p-5 rounded-xs space-y-2 shadow-2xs">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold text-stone-900 text-xs">{rev.customerName}</span>
                        <span className="text-stone-400 text-xs ml-2">({rev.customerEmail})</span>
                        <p className="text-[11px] text-[#8A1C24] font-medium">{rev.productName}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-xs ${
                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {rev.status}
                        </span>
                        <button
                          onClick={() => {
                            setConfirmModalState({
                              isOpen: true,
                              title: 'Delete Customer Review',
                              message: `Are you sure you want to permanently delete this review by ${rev.customerName}?`,
                              itemName: `"${rev.title}"`,
                              onConfirm: () => {
                                deleteReview(rev.id);
                                setConfirmModalState((prev) => ({ ...prev, isOpen: false }));
                              },
                            });
                          }}
                          className="text-stone-400 hover:text-red-700"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-heading text-xs font-semibold text-stone-900">{rev.title}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed italic">"{rev.comment}"</p>

                    <div className="pt-2 border-t border-stone-100 flex gap-2">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'approved')}
                          className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1 text-xs rounded-xs"
                        >
                          Approve &amp; Publish
                        </button>
                      )}
                      {rev.status === 'approved' && (
                        <button
                          onClick={() => updateReviewStatus(rev.id, 'rejected')}
                          className="bg-stone-200 hover:bg-stone-300 text-stone-800 px-3 py-1 text-xs rounded-xs"
                        >
                          Unpublish
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ================= SECTION: SETTINGS ================= */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs">
              <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Preferences</span>
              <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                Shipping &amp; Brand Settings
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                Configure Pakistan nationwide shipping rates, COD policies, and announcement bar.
              </p>
            </div>

            <div className="bg-white border border-stone-200 p-6 rounded-xs space-y-4 max-w-2xl shadow-2xs text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Announcement Bar Announcement Text
                </label>
                <input
                  type="text"
                  value={announcementText}
                  onChange={(e) => setAnnouncementText(e.target.value)}
                  className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={announcementActive}
                  onChange={(e) => setAnnouncementActive(e.target.checked)}
                  className="accent-[#8A1C24]"
                />
                <span className="font-semibold text-stone-800">Display Announcement Bar at Top</span>
              </label>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Free Delivery Threshold (PKR)
                  </label>
                  <input
                    type="number"
                    value={freeShipThreshold}
                    onChange={(e) => setFreeShipThreshold(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">
                    Standard Courier Shipping Fee (PKR)
                  </label>
                  <input
                    type="number"
                    value={shippingFeeVal}
                    onChange={(e) => setShippingFeeVal(Number(e.target.value))}
                    className="w-full bg-[#FAF8F5] border border-stone-300 p-2.5 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  updateSettings({
                    announcementBarText: announcementText,
                    announcementBarActive: announcementActive,
                    freeShippingThreshold: Number(freeShipThreshold),
                    standardShippingFee: Number(shippingFeeVal),
                  });
                }}
                className="bg-[#8A1C24] hover:bg-[#A3232D] text-white px-6 py-2.5 uppercase tracking-wider font-semibold rounded-xs cursor-pointer mt-2"
              >
                Save Shipping Settings
              </button>
            </div>
          </div>
        )}

        {/* ================= SECTION: OVERVIEW ANALYTICS ================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="bg-white border border-stone-200 p-6 rounded-xs shadow-xs">
              <span className="text-[11px] uppercase tracking-widest text-[#8A1C24] font-bold">Financial Overview</span>
              <h1 className="font-heading text-2xl font-semibold text-stone-900 mt-0.5">
                Sales &amp; Revenue Analytics
              </h1>
              <p className="text-xs text-stone-500 mt-1">Real-time sales performance across Pakistan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white p-5 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase text-[10px] font-semibold">Gross Domestic Revenue</span>
                <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{formatPKR(totalRevenue)}</p>
              </div>
              <div className="bg-white p-5 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase text-[10px] font-semibold">Processed Orders</span>
                <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{totalOrdersCount} Shipments</p>
              </div>
              <div className="bg-white p-5 border border-stone-200 rounded-xs">
                <span className="text-stone-500 uppercase text-[10px] font-semibold">Active Catalog Size</span>
                <p className="text-2xl font-bold font-mono text-stone-900 mt-1">{products.length} Garments</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= PRODUCT ADD / EDIT MODAL ================= */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setProductModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl bg-[#FAF8F5] p-6 sm:p-8 rounded-xs shadow-2xl border border-stone-300 max-h-[92vh] overflow-y-auto z-10">
              <div className="flex justify-between items-center border-b border-stone-200 pb-4 mb-4">
                <div>
                  <h3 className="font-heading text-xl text-stone-900 uppercase tracking-wider font-semibold">
                    {editingProduct ? 'Edit Pakistani Garment' : '+ Add New Cloth / Dress'}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Configure garment details, price in PKR, fabric quality, and visual gallery.
                  </p>
                </div>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
                {/* Basic info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Product Title *</label>
                    <input
                      type="text"
                      required
                      value={pName}
                      onChange={(e) => setPName(e.target.value)}
                      placeholder="e.g. Zari Embroidered Lawn Suit"
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs focus:outline-none focus:border-[#8A1C24]"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">SKU *</label>
                    <input
                      type="text"
                      required
                      value={pSku}
                      onChange={(e) => setPSku(e.target.value)}
                      placeholder="ZRM-LAWN-2601"
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs font-mono uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Category *</label>
                    <select
                      value={pCategory}
                      onChange={(e) => setPCategory(e.target.value as ClothingCategory)}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Collection</label>
                    <select
                      value={pCollection}
                      onChange={(e) => setPCollection(e.target.value as ClothingCollection)}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                    >
                      {collections.map((col) => (
                        <option key={col.id} value={col.name}>
                          {col.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Fabric Quality *</label>
                    <select
                      value={pFabric}
                      onChange={(e) => setPFabric(e.target.value as ClothingFabric)}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                    >
                      <option value="Lawn">Lawn (Combed Pima)</option>
                      <option value="Raw Silk">Raw Silk</option>
                      <option value="Chiffon">Pure Crinkle Chiffon</option>
                      <option value="Organza">Organza</option>
                      <option value="Silk">Silk</option>
                      <option value="Linen">Slub Linen</option>
                      <option value="Cotton">Cotton</option>
                      <option value="Cambric">Cambric</option>
                      <option value="Velvet">Micro Velvet</option>
                      <option value="Khaddar">Khaddar</option>
                      <option value="Jacquard">Jacquard</option>
                      <option value="Net">Net</option>
                    </select>
                  </div>
                </div>

                {/* Stitched and Pieces */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Stitching State *</label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setPType('Stitched')}
                        className={`flex-1 py-2 rounded-xs border font-medium ${
                          pType === 'Stitched' ? 'bg-[#1C1A1A] text-white border-[#1C1A1A]' : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        Stitched
                      </button>
                      <button
                        type="button"
                        onClick={() => setPType('Unstitched')}
                        className={`flex-1 py-2 rounded-xs border font-medium ${
                          pType === 'Unstitched' ? 'bg-[#1C1A1A] text-white border-[#1C1A1A]' : 'bg-white text-stone-700 border-stone-300'
                        }`}
                      >
                        Unstitched
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Pieces *</label>
                    <select
                      value={pPieces}
                      onChange={(e) => setPPieces(e.target.value as any)}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                    >
                      <option value="1 Piece">1 Piece (Shirt / Kurta)</option>
                      <option value="2 Piece">2 Piece (Shirt + Trouser)</option>
                      <option value="3 Piece">3 Piece (Shirt + Trouser + Dupatta)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Available Vault Stock *</label>
                    <input
                      type="number"
                      required
                      min={0}
                      value={pStock}
                      onChange={(e) => setPStock(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs font-mono"
                    />
                  </div>
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Retail Price (PKR) *</label>
                    <input
                      type="number"
                      required
                      min={500}
                      value={pPrice}
                      onChange={(e) => setPPrice(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Sale Price (PKR) <span className="text-stone-400 font-normal">Optional</span>
                    </label>
                    <input
                      type="number"
                      value={pSalePrice}
                      onChange={(e) => setPSalePrice(e.target.value)}
                      placeholder="Leave empty if not discounted"
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs font-mono"
                    />
                  </div>
                </div>

                {/* Sizes and Colors */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Available Sizes</label>
                    <div className="flex flex-wrap gap-1.5">
                      {(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'Custom', 'Unstitched'] as ClothingSize[]).map((sz) => {
                        const isSelected = pSizes.includes(sz);
                        return (
                          <button
                            type="button"
                            key={sz}
                            onClick={() => {
                              if (isSelected) {
                                setPSizes((prev) => prev.filter((s) => s !== sz));
                              } else {
                                setPSizes((prev) => [...prev, sz]);
                              }
                            }}
                            className={`px-2.5 py-1 text-xs border rounded-xs font-semibold cursor-pointer ${
                              isSelected ? 'bg-[#8A1C24] text-white border-[#8A1C24]' : 'bg-white text-stone-700 border-stone-300'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Colorways (Comma Separated)</label>
                    <input
                      type="text"
                      value={pColors}
                      onChange={(e) => setPColors(e.target.value)}
                      placeholder="Ivory, Emerald, Blush, Onyx Black"
                      className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                    />
                  </div>
                </div>

                {/* Package Inclusions & Description */}
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Package Components &amp; Cut</label>
                  <input
                    type="text"
                    value={pComponents}
                    onChange={(e) => setPComponents(e.target.value)}
                    placeholder="Embroidered Pima Lawn Front (3.1m), Dyed Cambric Trouser (2.5m), Organza Dupatta (2.5m)"
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Description &amp; Handcraft Details</label>
                  <textarea
                    rows={3}
                    value={pDesc}
                    onChange={(e) => setPDesc(e.target.value)}
                    placeholder="Artisan notes on embroidery, zardozi work, kalis, stitching silhouette..."
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>

                {/* Visual Media Gallery Management */}
                <div className="border border-stone-300 bg-white p-4 rounded-xs space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-stone-900 font-bold uppercase tracking-wider text-xs">
                      Product Visual Gallery ({imageList.length} Photos)
                    </label>
                    <span className="text-[11px] text-stone-500">First image is the Main Storefront Display</span>
                  </div>

                  {/* Thumbnail management cards */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                    {imageList.map((img, idx) => (
                      <div key={idx} className="relative group border border-stone-200 rounded-xs overflow-hidden aspect-[3/4] bg-stone-100">
                        <img src={img} alt="preview" className="w-full h-full object-cover object-top" />
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-[#8A1C24] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-xs">
                            MAIN
                          </span>
                        )}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleMakeMainImage(idx)}
                              className="bg-white/90 text-stone-900 px-2 py-0.5 text-[10px] font-semibold rounded-xs hover:bg-white"
                            >
                              Make Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="bg-red-700 text-white p-1 rounded-full hover:bg-red-800"
                            title="Delete image"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* File Upload card */}
                    <label className="border-2 border-dashed border-stone-300 hover:border-[#8A1C24] rounded-xs flex flex-col items-center justify-center p-2 text-center cursor-pointer aspect-[3/4] text-stone-500 hover:text-[#8A1C24] transition-colors">
                      <Upload size={20} className="mb-1" />
                      <span className="text-[10px] font-semibold">Upload Photo</span>
                      <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                    </label>
                  </div>

                  {/* Add by image URL */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Or enter image URL (https://...)"
                      className="flex-1 bg-[#FAF8F5] border border-stone-300 p-2 text-xs rounded-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddImageUrl}
                      className="bg-stone-800 hover:bg-[#8A1C24] text-white px-3 py-2 text-xs font-semibold rounded-xs cursor-pointer"
                    >
                      Add URL
                    </button>
                  </div>
                </div>

                {/* Product Video URL */}
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Product Showcase Video URL</label>
                  <input
                    type="text"
                    value={pVideo}
                    onChange={(e) => setPVideo(e.target.value)}
                    placeholder="https://assets.mixkit.co/videos/preview/..."
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs font-mono"
                  />
                </div>

                {/* Badges Toggles */}
                <div className="flex flex-wrap gap-4 pt-3 border-t border-stone-200">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pFeatured}
                      onChange={(e) => setPFeatured(e.target.checked)}
                      className="accent-[#8A1C24]"
                    />
                    <span className="font-semibold text-stone-800">Featured</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pNewArrival}
                      onChange={(e) => setPNewArrival(e.target.checked)}
                      className="accent-[#8A1C24]"
                    />
                    <span className="font-semibold text-stone-800">New Arrival</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pBestseller}
                      onChange={(e) => setPBestseller(e.target.checked)}
                      className="accent-[#8A1C24]"
                    />
                    <span className="font-semibold text-stone-800">Bestseller</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pSale}
                      onChange={(e) => setPSale(e.target.checked)}
                      className="accent-[#8A1C24]"
                    />
                    <span className="font-semibold text-[#8A1C24]">Sale Badge</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pActive}
                      onChange={(e) => setPActive(e.target.checked)}
                      className="accent-[#8A1C24]"
                    />
                    <span className="font-semibold text-emerald-800">Published Active on Website</span>
                  </label>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xs font-medium hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#8A1C24] hover:bg-[#A3232D] text-white font-bold uppercase tracking-wider rounded-xs cursor-pointer shadow-sm"
                  >
                    {editingProduct ? 'Update Cloth Details' : 'Save Cloth to Database'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW PRODUCT DETAILS MODAL ================= */}
      {viewProductModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setViewProductModal(null)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-2xl bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-300 space-y-4 z-10 text-xs">
              <div className="flex justify-between items-start border-b border-stone-200 pb-3">
                <div>
                  <span className="text-[10px] tracking-widest uppercase font-bold text-[#8A1C24]">
                    {viewProductModal.category} · {viewProductModal.fabric}
                  </span>
                  <h3 className="font-heading text-lg font-semibold text-stone-900">{viewProductModal.name}</h3>
                  <span className="text-stone-400 font-mono">SKU: {viewProductModal.sku}</span>
                </div>
                <button onClick={() => setViewProductModal(null)} className="p-1 text-stone-400 hover:text-stone-700">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-4">
                <img
                  src={viewProductModal.images[0]}
                  alt={viewProductModal.name}
                  className="w-28 h-36 object-cover object-top rounded-xs border border-stone-200"
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-stone-900 font-mono">
                      {formatPKR(viewProductModal.salePrice ?? viewProductModal.price)}
                    </span>
                    {viewProductModal.salePrice && (
                      <span className="line-through text-stone-400 font-mono">
                        {formatPKR(viewProductModal.price)}
                      </span>
                    )}
                  </div>

                  <p className="text-stone-600 leading-relaxed">{viewProductModal.description}</p>
                  <p><strong>Stock Available:</strong> {viewProductModal.stock} units</p>
                  <p><strong>Pieces:</strong> {viewProductModal.pieces} ({viewProductModal.productType})</p>
                  <p><strong>Available Sizes:</strong> {viewProductModal.sizes.join(', ')}</p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  onClick={() => {
                    const prod = viewProductModal;
                    setViewProductModal(null);
                    handleOpenEditProduct(prod);
                  }}
                  className="px-4 py-2 bg-[#8A1C24] text-white font-semibold rounded-xs"
                >
                  Edit This Garment
                </button>
                <button
                  onClick={() => setViewProductModal(null)}
                  className="px-4 py-2 border border-stone-300 text-stone-700 rounded-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CATEGORY ADD / EDIT MODAL ================= */}
      {catModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCatModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-300 space-y-4 z-10 text-xs">
              <h3 className="font-heading text-lg font-semibold text-stone-900 uppercase">
                {editingCat ? 'Edit Category' : 'Add New Category'}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!catName) return;
                  const payload: CategoryItem = {
                    id: editingCat?.id || `cat-${Date.now()}`,
                    name: catName,
                    slug: catSlug || catName.toLowerCase().replace(/\s+/g, '-'),
                    description: catDesc,
                    image: catImage || '/src/assets/images/lawn_collection_1791436586308.jpg',
                    isActive: catActive,
                  };
                  if (editingCat) {
                    updateCategory(payload);
                  } else {
                    addCategory(payload);
                  }
                  setCatModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="e.g. Lawn, Khaddar, Silk Formal"
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={catDesc}
                    onChange={(e) => setCatDesc(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={catImage}
                    onChange={(e) => setCatImage(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={catActive}
                    onChange={(e) => setCatActive(e.target.checked)}
                    className="accent-[#8A1C24]"
                  />
                  <span>Active &amp; Visible</span>
                </label>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setCatModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8A1C24] text-white font-semibold uppercase tracking-wider rounded-xs"
                  >
                    Save Category
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= COLLECTION ADD / EDIT MODAL ================= */}
      {colModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setColModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-300 space-y-4 z-10 text-xs">
              <h3 className="font-heading text-lg font-semibold text-stone-900 uppercase">
                {editingCol ? 'Edit Collection' : 'Add New Collection'}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!colName) return;
                  const payload: CollectionItem = {
                    id: editingCol?.id || `col-${Date.now()}`,
                    name: colName,
                    slug: colSlug || colName.toLowerCase().replace(/\s+/g, '-'),
                    description: colDesc,
                    bannerImage: colBanner || '/src/assets/images/pret_couture_1791436600244.jpg',
                    season: colSeason,
                    isActive: colActive,
                  };
                  if (editingCol) {
                    updateCollection(payload);
                  } else {
                    addCollection(payload);
                  }
                  setColModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Collection Title *</label>
                  <input
                    type="text"
                    required
                    value={colName}
                    onChange={(e) => setColName(e.target.value)}
                    placeholder="e.g. Summer Lawn 2026"
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Season / Tag</label>
                  <input
                    type="text"
                    value={colSeason}
                    onChange={(e) => setColSeason(e.target.value)}
                    placeholder="e.g. Festive Couture"
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={colDesc}
                    onChange={(e) => setColDesc(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Banner Image URL</label>
                  <input
                    type="text"
                    value={colBanner}
                    onChange={(e) => setColBanner(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setColModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8A1C24] text-white font-semibold uppercase tracking-wider rounded-xs"
                  >
                    Save Collection
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= BANNER ADD / EDIT MODAL ================= */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setBannerModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-300 space-y-4 z-10 text-xs">
              <h3 className="font-heading text-lg font-semibold text-stone-900 uppercase">
                {editingBanner ? 'Edit Banner' : 'Add New Homepage Banner'}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!banTitle) return;
                  const payload: HomepageBanner = {
                    id: editingBanner?.id || `ban-${Date.now()}`,
                    title: banTitle,
                    subtitle: banSubtitle,
                    buttonText: banBtnText,
                    linkCategory: banLinkCat,
                    image: banImg || '/src/assets/images/modest_abaya_1791436612870.jpg',
                    isActive: banActive,
                    order: editingBanner?.order || banners.length + 1,
                  };
                  if (editingBanner) {
                    updateBanner(payload);
                  } else {
                    addBanner(payload);
                  }
                  setBannerModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Banner Title *</label>
                  <input
                    type="text"
                    required
                    value={banTitle}
                    onChange={(e) => setBanTitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={banSubtitle}
                    onChange={(e) => setBanSubtitle(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Image URL</label>
                  <input
                    type="text"
                    value={banImg}
                    onChange={(e) => setBanImg(e.target.value)}
                    className="w-full bg-white border border-stone-300 p-2.5 rounded-xs"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setBannerModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8A1C24] text-white font-semibold uppercase tracking-wider rounded-xs"
                  >
                    Save Banner
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= COUPON ADD / EDIT MODAL ================= */}
      {couponModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={() => setCouponModalOpen(false)} />
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-md bg-[#FAF8F5] p-6 rounded-xs shadow-2xl border border-stone-300 space-y-4 z-10 text-xs">
              <h3 className="font-heading text-lg text-stone-900 uppercase">
                {editingCoupon ? 'Edit Coupon' : 'Create Promotional Coupon'}
              </h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!cCode) return;
                  saveCoupon({
                    id: editingCoupon?.id || `cpn-${Date.now()}`,
                    code: cCode.toUpperCase().trim(),
                    type: cType,
                    discountValue: Number(cValue),
                    minOrderValue: Number(cMinOrder),
                    maxDiscount: cMaxDiscount ? Number(cMaxDiscount) : undefined,
                    expiryDate: cExpiry,
                    usageLimit: 500,
                    usedCount: editingCoupon?.usedCount || 0,
                    isActive: true,
                  });
                  setCouponModalOpen(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Coupon Code *</label>
                  <input
                    type="text"
                    required
                    value={cCode}
                    onChange={(e) => setCCode(e.target.value)}
                    placeholder="e.g. ZARMEEN15"
                    className="w-full bg-white border border-stone-300 p-2 font-mono uppercase"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Type *</label>
                    <select
                      value={cType}
                      onChange={(e) => setCType(e.target.value as any)}
                      className="w-full bg-white border border-stone-300 p-2"
                    >
                      <option value="percentage">Percentage (%)</option>
                      <option value="fixed">Fixed PKR Amount</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Discount Value *</label>
                    <input
                      type="number"
                      required
                      value={cValue}
                      onChange={(e) => setCValue(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 p-2 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Min Order (PKR)</label>
                    <input
                      type="number"
                      value={cMinOrder}
                      onChange={(e) => setCMinOrder(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 p-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={cExpiry}
                      onChange={(e) => setCExpiry(e.target.value)}
                      className="w-full bg-white border border-stone-300 p-2 font-mono"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => setCouponModalOpen(false)}
                    className="px-4 py-2 border border-stone-300 text-stone-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#8A1C24] text-white font-semibold uppercase tracking-wider rounded-xs"
                  >
                    Save Coupon
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ================= GLOBAL SAFE CONFIRMATION MODAL ================= */}
      <ConfirmModal
        isOpen={confirmModalState.isOpen}
        title={confirmModalState.title}
        message={confirmModalState.message}
        itemName={confirmModalState.itemName}
        confirmLabel="Yes, Remove"
        cancelLabel="Cancel"
        onConfirm={confirmModalState.onConfirm}
        onCancel={() => setConfirmModalState((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
