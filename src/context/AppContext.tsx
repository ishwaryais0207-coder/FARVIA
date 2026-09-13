import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  AgriculturalProduct, 
  BuyerRequirement, 
  Order, 
  UserProfile, 
  UserRole, 
  Language, 
  AppNotification, 
  OrderStatus,
  ToastMessage
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_PRODUCTS, 
  INITIAL_REQUIREMENTS, 
  INITIAL_ORDERS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { playNotificationChime } from '../utils/audioChime';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  products: AgriculturalProduct[];
  requirements: BuyerRequirement[];
  orders: Order[];
  notifications: AppNotification[];
  selectedRequirementForMatching: BuyerRequirement | null;
  setSelectedRequirementForMatching: (req: BuyerRequirement | null) => void;
  activeOrderForTracking: Order | null;
  setActiveOrderForTracking: (order: Order | null) => void;
  activeProductForDetails: AgriculturalProduct | null;
  setActiveProductForDetails: (prod: AgriculturalProduct | null) => void;
  activeModal: string | null;
  setActiveModal: (modal: string | null) => void;
  sihStep: number;
  setSihStep: (step: number) => void;
  
  // Toast & Notification Center
  toasts: ToastMessage[];
  showToast: (toast: Omit<ToastMessage, 'id' | 'createdAt'>) => string;
  dismissToast: (id: string) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;
  triggerMockEvent: (eventType: 'match' | 'order_status' | 'payment' | 'demand_surge') => void;
  clearNotifications: () => void;
  markAllNotificationsRead: () => void;

  // Actions
  addProduct: (product: Omit<AgriculturalProduct, 'id' | 'createdAt'>) => AgriculturalProduct;
  postRequirement: (req: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'>) => BuyerRequirement;
  createOrder: (orderData: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  payOrder: (orderId: string, upiId: string) => void;
  rateOrder: (orderId: string, farmerRating?: number, buyerRating?: number, review?: string) => void;
  markNotificationRead: (id: string) => void;
  resetToDemoData: () => void;
  toggleUserRole: (newRole: UserRole) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<Language>('ta');
  const [currentView, setCurrentView] = useState<string>('landing');
  const [currentUser, setCurrentUser] = useState<UserProfile>(INITIAL_USERS[0]); // Murugan (Farmer)

  // Products
  const [products, setProducts] = useState<AgriculturalProduct[]>(() => {
    const saved = localStorage.getItem('farvia_products') || localStorage.getItem('uzhavar_products');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_PRODUCTS;
  });

  // Requirements
  const [requirements, setRequirements] = useState<BuyerRequirement[]>(() => {
    const saved = localStorage.getItem('farvia_requirements') || localStorage.getItem('uzhavar_requirements');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_REQUIREMENTS;
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('farvia_orders') || localStorage.getItem('uzhavar_orders');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_ORDERS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('farvia_notifs') || localStorage.getItem('uzhavar_notifs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return INITIAL_NOTIFICATIONS;
  });

  // Toasts & Notification Center state
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);

  const [selectedRequirementForMatching, setSelectedRequirementForMatching] = useState<BuyerRequirement | null>(INITIAL_REQUIREMENTS[0]);
  const [activeOrderForTracking, setActiveOrderForTracking] = useState<Order | null>(INITIAL_ORDERS[0]);
  const [activeProductForDetails, setActiveProductForDetails] = useState<AgriculturalProduct | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [sihStep, setSihStep] = useState<number>(1);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('farvia_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('farvia_requirements', JSON.stringify(requirements));
  }, [requirements]);

  useEffect(() => {
    localStorage.setItem('farvia_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('farvia_notifs', JSON.stringify(notifications));
  }, [notifications]);

  // Toast Helpers
  const showToast = (toastData: Omit<ToastMessage, 'id' | 'createdAt'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastMessage = {
      ...toastData,
      id,
      createdAt: Date.now(),
    };
    // Play audio chime
    playNotificationChime(toastData.type);

    setToasts(prev => [newToast, ...prev].slice(0, 4));
    return id;
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Switch role helper
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'farmer') {
      setCurrentUser(INITIAL_USERS[0]); // Murugan
      if (currentView === 'buyer-dashboard' || currentView === 'admin') {
        setCurrentView('farmer-dashboard');
      }
    } else if (newRole === 'buyer') {
      setCurrentUser(INITIAL_USERS[3]); // Hotel Saravana Bhavan
      if (currentView === 'farmer-dashboard' || currentView === 'admin') {
        setCurrentView('buyer-dashboard');
      }
    } else if (newRole === 'admin') {
      setCurrentUser(INITIAL_USERS[5]); // Admin
      setCurrentView('admin');
    }
  };

  const toggleUserRole = (newRole: UserRole) => {
    setRole(newRole);
  };

  // Add Product
  const addProduct = (prodData: Omit<AgriculturalProduct, 'id' | 'createdAt'>): AgriculturalProduct => {
    const newProduct: AgriculturalProduct = {
      ...prodData,
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);

    // Add notification
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'buyer',
      title: `New Produce: ${newProduct.name} available!`,
      message: `${newProduct.farmerName} listed ${newProduct.quantity} ${newProduct.unit} of ${newProduct.name} at ₹${newProduct.expectedPrice}/${newProduct.unit} in ${newProduct.location}.`,
      tamilMessage: `${newProduct.farmerName} அவர்கள் ${newProduct.quantity} ${newProduct.unit} ${newProduct.tamilName} கிலோ ₹${newProduct.expectedPrice} என பதிவிட்டுள்ளார்.`,
      type: 'price_alert',
      timestamp: 'Just now',
      read: false,
      linkAction: 'marketplace',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newProduct;
  };

  // Post Buyer Requirement
  const postRequirement = (reqData: Omit<BuyerRequirement, 'id' | 'createdAt' | 'status'>): BuyerRequirement => {
    const newReq: BuyerRequirement = {
      ...reqData,
      id: `req-${Date.now()}`,
      status: 'Open',
      createdAt: new Date().toISOString(),
    };
    setRequirements(prev => [newReq, ...prev]);
    setSelectedRequirementForMatching(newReq);

    // Notify farmers
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'farmer',
      title: `New Requirement: ${newReq.productName} needed!`,
      message: `${newReq.buyerName} posted requirement for ${newReq.requiredQuantity} ${newReq.unit} ${newReq.productName} (Budget: ₹${newReq.maxBudgetPerUnit}/${newReq.unit}) in ${newReq.deliveryLocation}.`,
      tamilMessage: `${newReq.buyerName} ${newReq.requiredQuantity} ${newReq.unit} ${newReq.tamilProductName} தேவை என கோரிக்கை விடுத்துள்ளார் (விலை ₹${newReq.maxBudgetPerUnit}).`,
      type: 'match',
      timestamp: 'Just now',
      read: false,
      linkAction: 'matches',
    };
    setNotifications(prev => [newNotif, ...prev]);

    return newReq;
  };

  // Create Order
  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      farmerId: orderData.farmerId || 'farmer-1',
      farmerName: orderData.farmerName || 'Murugan Velusamy',
      farmerPhone: orderData.farmerPhone || '+91 98421 87654',
      farmerLocation: orderData.farmerLocation || 'Melur, Madurai',
      buyerId: orderData.buyerId || currentUser.id,
      buyerName: orderData.buyerName || currentUser.name,
      buyerPhone: orderData.buyerPhone || currentUser.phone,
      buyerLocation: orderData.buyerLocation || currentUser.location,
      buyerCategory: currentUser.buyerCategory || 'hotel',
      item: orderData.item || {
        productId: 'prod-1',
        productName: 'Tomato',
        quantity: 100,
        unit: 'kg',
        pricePerUnit: 28,
        totalPrice: 2800,
        imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      },
      deliveryType: orderData.deliveryType || 'business',
      deliveryFee: orderData.deliveryFee ?? 120,
      platformFee: 0,
      totalAmount: orderData.totalAmount || 2920,
      status: 'Order Accepted',
      paymentStatus: 'Pending',
      deliveryTracking: {
        driverName: 'Karthik Logistics',
        driverPhone: '+91 98944 87612',
        vehicleNumber: 'TN 58 BC 4421 (Tata Ace)',
        currentStage: 2,
        estimatedArrival: 'Tomorrow 9:30 AM',
        liveDistanceKm: 6.8,
        lastUpdated: 'Order confirmed and assigned to fleet',
      },
      createdAt: new Date().toISOString(),
      matchedRequirementId: orderData.matchedRequirementId,
    };

    setOrders(prev => [newOrder, ...prev]);
    setActiveOrderForTracking(newOrder);

    // Update product stock
    setProducts(prev => prev.map(p => {
      if (p.id === newOrder.item.productId) {
        return {
          ...p,
          quantity: Math.max(0, p.quantity - newOrder.item.quantity)
        };
      }
      return p;
    }));

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        let currentStage = o.deliveryTracking.currentStage;
        if (status === 'Order Accepted') currentStage = 2;
        if (status === 'Packed & Ready') currentStage = 3;
        if (status === 'In Transit') currentStage = 4;
        if (status === 'Delivered' || status === 'Completed') currentStage = 5;

        return {
          ...o,
          status,
          deliveryTracking: {
            ...o.deliveryTracking,
            currentStage,
            lastUpdated: `Updated to ${status} just now`,
          }
        };
      }
      return o;
    }));

    // Trigger notification and toast for order update
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'all',
      title: `Order Status: ${status}`,
      message: `Order #${orderId} status changed to "${status}". Fleet tracking updated.`,
      tamilMessage: `ஆர்டர் #${orderId} நிலை "${status}" என மாற்றப்பட்டது. நேரடி வாகன கண்காணிப்பு புதுப்பிக்கப்பட்டது.`,
      type: 'order',
      timestamp: 'Just now',
      read: false,
      linkAction: 'orders',
    };
    setNotifications(prev => [notif, ...prev]);

    showToast({
      type: 'order',
      title: `Order #${orderId}: ${status}`,
      tamilTitle: `ஆர்டர் #${orderId}: ${status}`,
      message: `Direct logistics status updated to ${status}. Live GPS tracking is active.`,
      tamilMessage: `நேரடி வாகன கண்காணிப்பு நிலை "${status}" என புதுப்பிக்கப்பட்டுள்ளது.`,
      linkAction: 'orders',
      actionLabel: 'Track Delivery',
      tamilActionLabel: 'கண்காணிக்க',
      durationMs: 6500,
    });
  };

  const payOrder = (orderId: string, upiId: string) => {
    const txnId = `UPI-TXN-${Math.floor(100000000 + Math.random() * 900000000)}`;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          paymentStatus: 'Paid (UPI Sandbox)',
          transactionId: txnId,
          upiIdUsed: upiId,
        };
      }
      return o;
    }));

    // Notification for farmer & buyer
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      targetRole: 'all',
      title: 'Payment Confirmed via UPI',
      message: `Payment successful for order ${orderId} via UPI. Txn ID: ${txnId}`,
      tamilMessage: `ஆர்டர் ${orderId} க்கான கட்டணம் UPI மூலம் வெற்றிகரமாக செலுத்தப்பட்டது. Txn ID: ${txnId}`,
      type: 'payment',
      timestamp: 'Just now',
      read: false,
      linkAction: 'orders',
    };
    setNotifications(prev => [notif, ...prev]);

    showToast({
      type: 'payment',
      title: 'Direct UPI Settlement Verified',
      tamilTitle: 'உடனடி UPI வங்கி கட்டணம் உறுதி செய்யப்பட்டது',
      message: `₹2,920 settled via UPI. Txn ID: ${txnId}. Zero broker deduction.`,
      tamilMessage: `ஆர்டர் ${orderId} க்கான தொகை ₹2,920 UPI மூலம் செலுத்தப்பட்டது. புரோக்கர் கமிஷன் இல்லை.`,
      linkAction: 'orders',
      actionLabel: 'View Order',
      tamilActionLabel: 'ஆர்டரை காண்க',
      durationMs: 7000,
    });
  };

  const triggerMockEvent = (eventType: 'match' | 'order_status' | 'payment' | 'demand_surge') => {
    const now = 'Just now';
    const timestampId = Date.now();

    if (eventType === 'match') {
      if (role === 'farmer') {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'farmer',
          title: 'Direct Buyer Match Found! (96%)',
          message: 'Hotel Saravana Bhavan posted a requirement for 200 kg Tomatoes at ₹32/kg (96% Match, 4.2 km from your Melur farm).',
          tamilMessage: 'ஹோட்டல் சரவண பவன் 200 கிலோ தக்காளிக்கு கிலோ ₹32 என கோரியுள்ளார் (96% பொருத்தம், மேலூர் பண்ணையிலிருந்து 4.2 கி.மீ).',
          type: 'match',
          timestamp: now,
          read: false,
          linkAction: 'smart-matches',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'match',
          title: 'Direct Buyer Match Found! (96%)',
          tamilTitle: 'வாங்குபவர் பொருத்தம் கிடைத்தது! (96%)',
          message: 'Hotel Saravana Bhavan needs 200 kg Tomatoes at ₹32/kg. Direct farm procurement without mandi brokers!',
          tamilMessage: 'ஹோட்டல் சரவண பவன் 200 கிலோ தக்காளிக்கு கிலோ ₹32 என கோரியுள்ளார். இடைத்தரகர் இல்லாத நேரடி கொள்முதல்!',
          linkAction: 'smart-matches',
          actionLabel: 'View Smart Match',
          tamilActionLabel: 'பொருத்தத்தை காண்க',
          durationMs: 7000,
        });
      } else {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'buyer',
          title: 'Direct Farmer Produce Match! (97%)',
          message: 'Farmer Murugan Velusamy has 500 kg Fresh Country Tomatoes ready at ₹28/kg (97% Match, Melur).',
          tamilMessage: 'விவசாயி முருகன் வேலுசாமி 500 கிலோ நாட்டு தக்காளி கிலோ ₹28 என அறுவடைக்கு தயார் செய்துள்ளார் (97% பொருத்தம்).',
          type: 'match',
          timestamp: now,
          read: false,
          linkAction: 'smart-matches',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'match',
          title: 'Fresh Harvest Match Found! (97%)',
          tamilTitle: 'புதிய விளைபொருள் பொருத்தம்! (97%)',
          message: 'Murugan Velusamy has 500 kg Country Tomatoes at ₹28/kg (saves 26% vs retail mandi).',
          tamilMessage: 'முருகன் வேலுசாமி 500 கிலோ நாட்டு தக்காளி கிலோ ₹28 என அறுவடைக்கு வைத்துள்ளார் (சில்லறை விலையை விட 26% குறைவு).',
          linkAction: 'smart-matches',
          actionLabel: 'Procure Now',
          tamilActionLabel: 'உடனே வாங்குக',
          durationMs: 7000,
        });
      }
    } else if (eventType === 'order_status') {
      const targetOrder = orders[0];
      const nextStatus = targetOrder && targetOrder.status === 'Order Accepted' ? 'In Transit' : 'Packed & Ready';

      if (targetOrder) {
        setOrders(prev => prev.map(o => o.id === targetOrder.id ? { 
          ...o, 
          status: nextStatus,
          deliveryTracking: {
            ...o.deliveryTracking,
            currentStage: nextStatus === 'In Transit' ? 4 : 3,
            lastUpdated: `Updated to ${nextStatus} just now`
          }
        } : o));
      }

      if (role === 'farmer') {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'farmer',
          title: 'Order #ORD-101: Dispatched & In Transit',
          message: 'Tata Ace (TN 58 BC 4421) picked up 100 kg Tomatoes. On route to Hotel Saravana Bhavan, Simmakkal.',
          tamilMessage: 'டாடா ஏஸ் (TN 58 BC 4421) 100 கிலோ தக்காளியை ஏற்றி புறப்பட்டது. சிம்மக்கல் நோக்கி பயணிக்கிறது.',
          type: 'order',
          timestamp: now,
          read: false,
          linkAction: 'orders',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'order',
          title: 'Agro Fleet Dispatched: Order #ORD-101',
          tamilTitle: 'விவசாய வாகனம் புறப்பட்டது: #ORD-101',
          message: 'Driver Karthik has picked up produce from farm gate. Live GPS tracking is active (ETA 35 mins).',
          tamilMessage: 'ஓட்டுநர் கார்த்திக் பண்ணையிலிருந்து விளைபொருளை ஏற்றினார். நேரடி ஜிபிஎஸ் கண்காணிப்பு இயக்கத்தில் உள்ளது.',
          linkAction: 'orders',
          actionLabel: 'Track Live Fleet',
          tamilActionLabel: 'வாகனத்தை கண்காணிக்க',
          durationMs: 7000,
        });
      } else {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'buyer',
          title: 'Produce In Transit: Order #ORD-101',
          message: 'Fleet driver Karthik is 4.8 km away with your 100 kg Tomatoes order. Direct from farm gate.',
          tamilMessage: 'ஓட்டுநர் கார்த்திக் 4.8 கி.மீ தொலைவில் 100 கிலோ தக்காளி ஆர்டருடன் வந்துகொண்டிருக்கிறார்.',
          type: 'order',
          timestamp: now,
          read: false,
          linkAction: 'orders',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'order',
          title: 'Order #ORD-101 is In Transit to You!',
          tamilTitle: 'ஆர்டர் #ORD-101 உங்கள் இடத்திற்கு புறப்பட்டது!',
          message: 'Driver Karthik (TN 58 BC 4421) is 4.8 km away. Expected delivery in ~25 minutes.',
          tamilMessage: 'ஓட்டுநர் கார்த்திக் 4.8 கி.மீ தூரத்தில் உள்ளார். 25 நிமிடங்களில் டெலிவரி செய்யப்படும்.',
          linkAction: 'orders',
          actionLabel: 'Track Delivery',
          tamilActionLabel: 'டெலிவரியை கண்காணிக்க',
          durationMs: 7000,
        });
      }
    } else if (eventType === 'payment') {
      if (role === 'farmer') {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'farmer',
          title: 'Direct UPI Settlement Received: ₹2,920',
          message: 'Payment credited to Indian Bank A/C ...4821 for Order #ORD-101. Platform commission: ₹0.',
          tamilMessage: 'ஆர்டர் #ORD-101 க்கான தொகை ₹2,920 இந்தியன் வங்கி கணக்கில் வரவு வைக்கப்பட்டது. கமிஷன்: ₹0.',
          type: 'payment',
          timestamp: now,
          read: false,
          linkAction: 'orders',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'payment',
          title: 'Instant Bank UPI Credit: ₹2,920',
          tamilTitle: 'வங்கி கணக்கில் வரவு: ₹2,920',
          message: 'Full payment received directly from buyer. Zero middleman commission deducted!',
          tamilMessage: 'முழு கட்டணமும் வாங்குபவரிடமிருந்து நேரடியாக வரவு வைக்கப்பட்டது. இடைத்தரகர் கமிஷன் இல்லை!',
          linkAction: 'orders',
          actionLabel: 'View Settlement',
          tamilActionLabel: 'கணக்கை காண்க',
          durationMs: 7000,
        });
      } else {
        const notif: AppNotification = {
          id: `notif-${timestampId}`,
          targetRole: 'buyer',
          title: 'Payment Secured in Direct Escrow',
          message: '₹2,920 held in escrow for Order #ORD-101. Will be released to farmer upon quality verification.',
          tamilMessage: 'ஆர்டர் #ORD-101 க்கான ₹2,920 எஸ்க்ரோவில் பாதுகாப்பாக உள்ளது. தரம் உறுதி செய்யப்பட்டதும் வழங்கப்படும்.',
          type: 'payment',
          timestamp: now,
          read: false,
          linkAction: 'orders',
        };
        setNotifications(prev => [notif, ...prev]);

        showToast({
          type: 'payment',
          title: 'UPI Escrow Protected: ₹2,920',
          tamilTitle: 'UPI எஸ்க்ரோ பாதுகாப்பு: ₹2,920',
          message: 'Payment held safely. 100% money-back guarantee if crop quality does not match specification.',
          tamilMessage: 'தொகை பாதுகாப்பாக உள்ளது. தரம் பொருந்தாவிடில் 100% முழு பணத்தைத் திரும்பப் பெறும் உத்தரவாதம்.',
          linkAction: 'orders',
          actionLabel: 'View Escrow Slip',
          tamilActionLabel: 'ரசீதை காண்க',
          durationMs: 7000,
        });
      }
    } else if (eventType === 'demand_surge') {
      const notif: AppNotification = {
        id: `notif-${timestampId}`,
        targetRole: 'all',
        title: 'Wholesale Mandi Surge: Tomato Demand +24%',
        message: 'Madurai Mattuthavani Mandi arrivals dropped 18%. Optimal direct pricing range increased to ₹32-₹35/kg.',
        tamilMessage: 'மதுரை மாட்டுத்தாவணி சந்தை வரத்து 18% குறைந்தது. உகந்த நேரடி விற்பனை விலை கிலோ ₹32-₹35 ஆக உயர்ந்துள்ளது.',
        type: 'demand_alert',
        timestamp: now,
        read: false,
        linkAction: 'fair-price',
      };
      setNotifications(prev => [notif, ...prev]);

      showToast({
        type: 'demand_alert',
        title: 'Mandi Demand Surge Alert (+24%)',
        tamilTitle: 'சந்தை தேவை உயர்வு எச்சரிக்கை (+24%)',
        message: 'Tomato price trend is bullish (+24%). Direct farm contracts recommended at ₹32/kg.',
        tamilMessage: 'தக்காளி விலை உயர்ந்து வருகிறது (+24%). நேரடி விற்பனையில் கிலோ ₹32 நிர்ணயிக்க பரிந்துரைக்கப்படுகிறது.',
        linkAction: 'fair-price',
        actionLabel: 'Analyze Price',
        tamilActionLabel: 'விலை நிலவரம்',
        durationMs: 7000,
      });
    }
  };

  const rateOrder = (orderId: string, farmerRating?: number, buyerRating?: number, review?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          farmerRatingGiven: farmerRating ?? o.farmerRatingGiven,
          buyerRatingGiven: buyerRating ?? o.buyerRatingGiven,
          reviewText: review ?? o.reviewText,
          status: 'Completed',
        };
      }
      return o;
    }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const resetToDemoData = () => {
    localStorage.removeItem('farvia_products');
    localStorage.removeItem('farvia_requirements');
    localStorage.removeItem('farvia_orders');
    localStorage.removeItem('farvia_notifs');
    localStorage.removeItem('uzhavar_products');
    localStorage.removeItem('uzhavar_requirements');
    localStorage.removeItem('uzhavar_orders');
    localStorage.removeItem('uzhavar_notifs');
    setProducts(INITIAL_PRODUCTS);
    setRequirements(INITIAL_REQUIREMENTS);
    setOrders(INITIAL_ORDERS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSelectedRequirementForMatching(INITIAL_REQUIREMENTS[0]);
    setActiveOrderForTracking(INITIAL_ORDERS[0]);
    setSihStep(1);
    setRole('farmer');
    setCurrentView('landing');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        setCurrentUser,
        language,
        setLanguage,
        currentView,
        setCurrentView,
        products,
        requirements,
        orders,
        notifications,
        selectedRequirementForMatching,
        setSelectedRequirementForMatching,
        activeOrderForTracking,
        setActiveOrderForTracking,
        activeProductForDetails,
        setActiveProductForDetails,
        activeModal,
        setActiveModal,
        sihStep,
        setSihStep,
        toasts,
        showToast,
        dismissToast,
        isNotificationCenterOpen,
        setIsNotificationCenterOpen,
        triggerMockEvent,
        clearNotifications,
        markAllNotificationsRead,
        addProduct,
        postRequirement,
        createOrder,
        updateOrderStatus,
        payOrder,
        rateOrder,
        markNotificationRead,
        resetToDemoData,
        toggleUserRole,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
