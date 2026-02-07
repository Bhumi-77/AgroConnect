import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "Krishi Connect",
      homeTagline: "Direct farmer-to-buyer marketplace for Nepal",
      login: "Login",
      register: "Register",
      logout: "Logout",
      marketplace: "Marketplace",
      dashboard: "Dashboard",
      admin: "Admin",
      chat: "Chat",
      addCrop: "Add Crop",
      inventory: "Inventory",
      pricePredict: "Price Prediction",
      demandBoard: "Demand Board",
      language: "Language",
      english: "English",
      nepali: "Nepali",
      role: "Role",
      farmer: "Farmer",
      buyer: "Buyer",
      email: "Email",
      password: "Password",
      fullName: "Full Name",
      category: "Category",
      district: "District",
      municipality: "Municipality",
      search: "Search",
      view: "View",
      order: "Order",
      payCOD: "Cash on Delivery",
      payESEWA: "eSewa (Demo)",
      total: "Total",
      qty: "Quantity",
      price: "Price",
      unit: "Unit",
      quality: "Quality",
    }
  },
  np: {
    translation: {
      appName: "कृषि कनेक्ट",
      homeTagline: "नेपालका लागि किसान–खरिदकर्ता सिधा बजार",
      login: "लगइन",
      register: "दर्ता",
      logout: "लगआउट",
      marketplace: "बजार",
      dashboard: "ड्यासबोर्ड",
      admin: "प्रशासन",
      chat: "च्याट",
      addCrop: "बाली थप्नुहोस्",
      inventory: "भण्डार",
      pricePredict: "मूल्य अनुमान",
      demandBoard: "माग बोर्ड",
      language: "भाषा",
      english: "अङ्ग्रेजी",
      nepali: "नेपाली",
      role: "भूमिका",
      farmer: "किसान",
      buyer: "खरिदकर्ता",
      email: "इमेल",
      password: "पासवर्ड",
      fullName: "पुरा नाम",
      category: "वर्ग",
      district: "जिल्ला",
      municipality: "नगरपालिका",
      search: "खोज",
      view: "हेर्नुहोस्",
      order: "अर्डर",
      payCOD: "घरमै भुक्तानी",
      payESEWA: "इ-सेवा (डेमो)",
      total: "जम्मा",
      qty: "परिमाण",
      price: "मूल्य",
      unit: "एकाइ",
      quality: "गुणस्तर",
    }
  }
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem('lang') || 'en',
  fallbackLng: 'en',
  interpolation: { escapeValue: false }
});

export default i18n;
