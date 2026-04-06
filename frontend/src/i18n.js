import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App
      appName: "KrishiConnect",

      // Navbar
      marketplace: "Marketplace",
      dashboard: "Dashboard",
      admin: "Admin",
      chat: "Chat",
      login: "Login",
      logout: "Logout",
      register: "Register",
      english: "English",
      nepali: "नेपाली",
      myOrders: "My Orders",
      customerOrders: "Customer Orders",
      aiPrice: "AI Price",
      profile: "Profile",
      home: "Home",

      // Homepage Hero
      heroTitle: "Connect Farmers to Markets",
      heroSubtitle:
        "Empowering Nepal's farmers with direct market access, fair prices, and modern agricultural solutions — no middlemen, just growth.",
      heroBadge: "NEPAL'S AGRICULTURAL MARKETPLACE",
      heroTitlePart1: "Connect",
      heroTitleHighlight: "Farmers",
      heroTitlePart2: "to Markets",
      exploreMarketplace: "Explore Marketplace",
      learnMore: "Learn More",
      scrollHint: "SCROLL",

      // Homepage About
      aboutLabel: "About the Platform",
      aboutTitle1: "Revolutionizing Nepal's",
      aboutTitleHighlight: "Agricultural",
      aboutTitle2: "Ecosystem",
      aboutDesc:
        "Krishi Connect is a revolutionary MERN-based platform that eliminates middlemen by directly connecting local farmers with customers and wholesale buyers. With bilingual support (Nepali/English), AI-powered crop recognition, price prediction tools, and integrated payment systems — we're transforming how Nepal farms, sells, and grows.",
      tagVerified: "🔒 Verified Farmers",
      tagRealtime: "⚡ Real-time Updates",
      tagBilingual: "🌐 Bilingual Support",
      tagFairTrade: "🤝 Fair Trade Promise",

      // Homepage Features
      featuresLabel: "Platform Features",
      featuresTitle1: "Everything You Need to",
      featuresTitleHighlight: "Grow",
      feature1Title: "Direct Market Access",
      feature1Desc:
        "Connect directly with buyers, eliminating middlemen and maximizing your profits on every harvest.",
      feature2Title: "AI Price Prediction",
      feature2Desc:
        "Smart machine-learning tools analyze market trends to help you set competitive, fair prices.",
      feature3Title: "Location-Based Search",
      feature3Desc:
        "Discover nearby suppliers and buyers to dramatically reduce transportation costs and delays.",
      feature4Title: "Secure Payments",
      feature4Desc:
        "Multiple payment options including eSewa integration and Cash on Delivery for flexibility.",
      feature5Title: "Integrated Chat",
      feature5Desc:
        "Real-time messaging enables instant negotiation, coordination, and relationship building.",
      feature6Title: "Bilingual Interface",
      feature6Desc:
        "Seamlessly switch between Nepali and English — designed for every farmer across Nepal.",

      // Homepage Roles
      rolesLabel: "Who It's For",
      rolesTitle1: "Built for Every",
      rolesTitleHighlight: "Stakeholder",
      rolesSubtitle: "Our platform serves everyone in the agricultural ecosystem",
      role1Title: "Farmer",
      role1Desc:
        "List crops with photos, set your price, manage inventory, and chat directly with buyers who need your produce.",
      role2Title: "Buyer",
      role2Desc:
        "Browse fresh listings, filter by location, negotiate prices, and order with COD or eSewa — delivered fresh.",
      role3Title: "Admin",
      role3Desc:
        "Verify users, moderate listings, resolve disputes, and keep the entire marketplace running smoothly.",

      // Homepage CTA
      ctaTitle1: "Ready to Join the",
      ctaTitleHighlight: "Revolution?",
      ctaSubtitle:
        "Join thousands of farmers and buyers who are already growing their businesses on Krishi Connect.",
      ctaBtn: "Get Started Free →",

      // Footer
      footerTagline:
        "Connecting farmers with markets for a sustainable, prosperous Nepal.",
      footerProduct: "Product",
      footerLegal: "Legal",
      footerCommunity: "Community",
      footerFarmerPortal: "Farmer Portal",
      footerBuyerPortal: "Buyer Portal",
      footerAdminPanel: "Admin Panel",
      footerMarketplace: "Marketplace",
      footerPrivacy: "Privacy Policy",
      footerRefund: "Refund Policy",
      footerPricing: "Pricing Plan",
      footerFAQ: "FAQs",
      footerStories: "Success Stories",
      footerGallery: "Gallery",
      footerBlog: "Blog",
      footerContact: "Contact Us",
      footerCopyright: "© 2025 Krishi Connect. All rights reserved.",

      // ── Marketplace Page ──
      mktHeroBadge: "FRESH FROM THE FARM",
      mktHeroTitle1: "Farm",
      mktHeroTitleHighlight: "Marketplace",
      mktHeroSubtitle:
        "Browse fresh crops directly from verified farmers across Nepal. No middlemen — just honest, fair trade.",
      mktStat1Label: "Listings",
      mktStat2Label: "75+ Districts",
      mktStat3Label: "Verified Farmers",

      // Marketplace filters
      mktCatAll: "All",
      mktCatVegetables: "Vegetables",
      mktCatFruits: "Fruits",
      mktCatGrains: "Grains",
      mktCatOther: "Other",
      mktFilterSearch: "Search",
      mktFilterDistrict: "District",
      mktFilterMunicipality: "Municipality",
      mktSearchPlaceholder: "Search crops… (Tomato / टमाटर)",
      mktAllDistricts: "All Districts",
      mktAllMunicipalities: "All Municipalities",
      mktSelectDistrictFirst: "Select district first",
      mktClearAll: "✕ Clear all",
      mktSearchBtn: "Search",

      // Marketplace results
      mktCropSingular: "crop found",
      mktCropPlural: "crops found",
      mktLoadingCrops: "Loading fresh crops…",
      mktNoCropsTitle: "No crops found",
      mktNoCropsSubtitle:
        "Try adjusting your filters or check back later for new listings",
      mktClearFilters: "Clear Filters",

      // Crop card
      mktOutOfStock: "OUT OF STOCK",
      mktVerified: "✓ Verified",
      mktQty: "Qty",
      mktBy: "by",
      mktFarmerFallback: "Farmer",
      mktViewDetails: "View Details",
      mktOrderBtn: "🛒 Order",
      mktUnavailable: "Unavailable",

      // Legacy keys kept for compatibility
      browseAll: "Browse All Crops",
      marketplaceSubtitle: "Browse fresh crops directly from farmers",
      search: "Search",
      searchPlaceholder: "Search crops... (Tomato / टमाटर)",
      category: "Category",
      district: "District",
      municipality: "Municipality",
      allCategories: "All Categories",
      vegetables: "Vegetables",
      fruits: "Fruits",
      grains: "Grains",
      other: "Other",
      allDistricts: "All Districts",
      allMunicipalities: "All Municipalities",
      selectDistrictFirst: "Select district first",
      activeFilters: "Active Filters",
      clearAll: "Clear all",
      cropsFound: "crops found",
      cropFound: "crop found",
      noCropsFound: "No crops found",
      noCropsFoundSubtitle:
        "Try adjusting your search filters or check back later for new listings",
      outOfStock: "Out of Stock",
      inStock: "In Stock",
      verified: "Verified",
      by: "By",
      farmer: "Farmer",
      qty: "Qty",
      view: "View",
      order: "Order Now",

      // Login page
      loginTitle: "Welcome Back",
      loginSubtitle: "Sign in to your account",
      email: "Email",
      password: "Password",
      forgotPassword: "Forgot Password?",
      noAccount: "Don't have an account?",
      loginBtn: "Sign In",

      // Register page
      registerTitle: "Create Account",
      registerSubtitle: "Join KrishiConnect today",
      name: "Full Name",
      confirmPassword: "Confirm Password",
      role: "I am a",
      buyer: "Buyer",
      selectRole: "Select your role",
      alreadyAccount: "Already have an account?",
      registerBtn: "Create Account",
      phone: "Phone Number",
      address: "Address",

      // Profile page
      updateProfile: "Update Profile",
      profileUpdated: "Profile updated successfully",
      changePassword: "Change Password",
      currentPassword: "Current Password",
      newPassword: "New Password",

      // General
      loading: "Loading...",
      error: "Something went wrong",
      success: "Success",
      back: "Back",
      next: "Next",
      close: "Close",
      save2: "Save Changes",
      actions: "Actions",
      date: "Date",
      amount: "Amount",
      id: "ID",
      welcome: "Welcome",
      welcomeBack: "Welcome back",
    }
  },

  np: {
    translation: {
      // App
      appName: "कृषि कनेक्ट",

      // Navbar
      marketplace: "बजार",
      dashboard: "ड्यासबोर्ड",
      admin: "प्रशासक",
      chat: "कुराकानी",
      login: "लगइन",
      logout: "लगआउट",
      register: "दर्ता गर्नुहोस्",
      english: "English",
      nepali: "नेपाली",
      myOrders: "मेरो अर्डर",
      customerOrders: "ग्राहकका अर्डरहरू",
      aiPrice: "एआई मूल्य",
      profile: "प्रोफाइल",
      home: "गृहपृष्ठ",

      // Homepage Hero
      heroTitle: "किसानलाई बजारसँग जोड्दै",
      heroSubtitle:
        "नेपालका किसानहरूलाई प्रत्यक्ष बजार पहुँच, उचित मूल्य, र आधुनिक कृषि समाधानहरूमार्फत सशक्त बनाउँदै — बिचौलिया बिनाको सिधा र दिगो विकास।",
      heroBadge: "नेपालको कृषि बजार",
      heroTitlePart1: "जोड्दै",
      heroTitleHighlight: "किसान",
      heroTitlePart2: "बजारसँग",
      exploreMarketplace: "बजार हेर्नुहोस्",
      learnMore: "थप जान्नुहोस्",
      scrollHint: "तल स्क्रोल गर्नुहोस्",

      // Homepage About
      aboutLabel: "प्लेटफर्मको बारेमा",
      aboutTitle1: "नेपालको",
      aboutTitleHighlight: "कृषि",
      aboutTitle2: "क्षेत्रमा क्रान्ति",
      aboutDesc:
        "कृषि कनेक्ट एक क्रान्तिकारी MERN-आधारित प्लेटफर्म हो जसले स्थानीय किसानहरूलाई ग्राहक र थोक खरिदकर्ताहरूसँग सिधै जोडेर बिचौलियालाई हटाउँछ। द्विभाषी समर्थन (नेपाली/अंग्रेजी), एआई-संचालित बाली पहिचान, मूल्य पूर्वानुमान उपकरण, र एकीकृत भुक्तानी प्रणालीका साथ — हामी नेपालले खेती, बिक्री र विकास गर्ने तरिका बदल्दैछौं।",
      tagVerified: "🔒 प्रमाणित किसान",
      tagRealtime: "⚡ रियल-टाइम अपडेट",
      tagBilingual: "🌐 द्विभाषी समर्थन",
      tagFairTrade: "🤝 उचित व्यापार वाचा",

      // Homepage Features
      featuresLabel: "प्लेटफर्म सुविधाहरू",
      featuresTitle1: "विकासका लागि",
      featuresTitleHighlight: "सबै सुविधाहरू",
      feature1Title: "प्रत्यक्ष बजार पहुँच",
      feature1Desc:
        "खरिदकर्ताहरूसँग सिधै जोडिनुहोस्, बिचौलियालाई हटाउनुहोस् र प्रत्येक फसलमा आफ्नो नाफा अधिकतम गर्नुहोस्।",
      feature2Title: "एआई मूल्य पूर्वानुमान",
      feature2Desc:
        "स्मार्ट मेशिन लर्निङ उपकरणहरूले बजार प्रवृत्ति विश्लेषण गरेर प्रतिस्पर्धी र उचित मूल्य निर्धारण गर्न मद्दत गर्छन्।",
      feature3Title: "स्थान-आधारित खोज",
      feature3Desc:
        "नजिकका आपूर्तिकर्ता र खरिदकर्ताहरू पत्ता लगाउनुहोस् र यातायात लागत तथा ढिलाइ उल्लेखनीय रूपमा घटाउनुहोस्।",
      feature4Title: "सुरक्षित भुक्तानी",
      feature4Desc:
        "eSewa एकीकरण र क्यास अन डेलिभरी सहित लचिलोपनका लागि बहु भुक्तानी विकल्पहरू।",
      feature5Title: "एकीकृत च्याट",
      feature5Desc:
        "रियल-टाइम सन्देशले तत्काल वार्ता, समन्वय र सम्बन्ध निर्माण सक्षम बनाउँछ।",
      feature6Title: "द्विभाषी इन्टरफेस",
      feature6Desc:
        "नेपाली र अंग्रेजीबीच निर्बाध स्विच गर्नुहोस् — नेपालभरका हर किसानका लागि डिजाइन गरिएको।",

      // Homepage Roles
      rolesLabel: "कसका लागि हो",
      rolesTitle1: "हरेक",
      rolesTitleHighlight: "सरोकारवाला",
      rolesTitle2: "का लागि निर्मित",
      rolesSubtitle: "हाम्रो प्लेटफर्म कृषि पारिस्थितिकी तन्त्रका सबैलाई सेवा गर्छ",
      role1Title: "किसान",
      role1Desc:
        "फोटोसहित बाली सूचीबद्ध गर्नुहोस्, मूल्य तोक्नुहोस्, स्टक व्यवस्थापन गर्नुहोस्, र आफ्नो उत्पादन चाहिने खरिदकर्ताहरूसँग सिधै कुराकानी गर्नुहोस्।",
      role2Title: "खरिदकर्ता",
      role2Desc:
        "ताजा सूचीहरू ब्राउज गर्नुहोस्, स्थान अनुसार फिल्टर गर्नुहोस्, मूल्य वार्ता गर्नुहोस्, र COD वा eSewa मार्फत अर्डर गर्नुहोस् — ताजै डेलिभरी।",
      role3Title: "प्रशासक",
      role3Desc:
        "प्रयोगकर्ताहरू प्रमाणित गर्नुहोस्, सूचीहरू मध्यस्थता गर्नुहोस्, विवाद समाधान गर्नुहोस्, र सम्पूर्ण बजार सुचारु राख्नुहोस्।",

      // Homepage CTA
      ctaTitle1: "क्रान्तिमा सामेल हुन",
      ctaTitleHighlight: "तयार हुनुहुन्छ?",
      ctaSubtitle:
        "हजारौं किसान र खरिदकर्ताहरूसँग सामेल हुनुहोस् जो कृषि कनेक्टमा आफ्नो व्यवसाय बढाइरहेका छन्।",
      ctaBtn: "नि:शुल्क सुरु गर्नुहोस् →",

      // Footer
      footerTagline:
        "दिगो र समृद्ध नेपालका लागि किसानहरूलाई बजारसँग जोड्दै।",
      footerProduct: "उत्पादन",
      footerLegal: "कानुनी",
      footerCommunity: "समुदाय",
      footerFarmerPortal: "किसान पोर्टल",
      footerBuyerPortal: "खरिदकर्ता पोर्टल",
      footerAdminPanel: "प्रशासन प्यानल",
      footerMarketplace: "बजार",
      footerPrivacy: "गोपनीयता नीति",
      footerRefund: "फिर्ता नीति",
      footerPricing: "मूल्य योजना",
      footerFAQ: "बारम्बार सोधिने प्रश्नहरू",
      footerStories: "सफलताका कथाहरू",
      footerGallery: "ग्यालेरी",
      footerBlog: "ब्लग",
      footerContact: "सम्पर्क गर्नुहोस्",
      footerCopyright: "© २०२५ कृषि कनेक्ट। सर्वाधिकार सुरक्षित।",

      // ── Marketplace Page ──
      mktHeroBadge: "खेतबाट ताजा",
      mktHeroTitle1: "कृषि",
      mktHeroTitleHighlight: "बजार",
      mktHeroSubtitle:
        "नेपालभरका प्रमाणित किसानहरूबाट सिधै ताजा बाली ब्राउज गर्नुहोस्। बिचौलिया छैन — सिधा र उचित व्यापार।",
      mktStat1Label: "सूचीहरू",
      mktStat2Label: "७५+ जिल्लाहरू",
      mktStat3Label: "प्रमाणित किसान",

      // Marketplace filters
      mktCatAll: "सबै",
      mktCatVegetables: "तरकारी",
      mktCatFruits: "फलफूल",
      mktCatGrains: "अन्न",
      mktCatOther: "अन्य",
      mktFilterSearch: "खोज्नुहोस्",
      mktFilterDistrict: "जिल्ला",
      mktFilterMunicipality: "नगरपालिका",
      mktSearchPlaceholder: "बाली खोज्नुहोस्… (Tomato / टमाटर)",
      mktAllDistricts: "सबै जिल्लाहरू",
      mktAllMunicipalities: "सबै नगरपालिकाहरू",
      mktSelectDistrictFirst: "पहिले जिल्ला छान्नुहोस्",
      mktClearAll: "✕ सबै हटाउनुहोस्",
      mktSearchBtn: "खोज्नुहोस्",

      // Marketplace results
      mktCropSingular: "बाली भेटियो",
      mktCropPlural: "बालीहरू भेटिए",
      mktLoadingCrops: "ताजा बालीहरू लोड हुँदैछ…",
      mktNoCropsTitle: "कुनै बाली भेटिएन",
      mktNoCropsSubtitle:
        "फिल्टर समायोजन गर्नुहोस् वा नयाँ सूचीहरूका लागि पछि जाँच गर्नुहोस्",
      mktClearFilters: "फिल्टर हटाउनुहोस्",

      // Crop card
      mktOutOfStock: "स्टक सकियो",
      mktVerified: "✓ प्रमाणित",
      mktQty: "मात्रा",
      mktBy: "द्वारा",
      mktFarmerFallback: "किसान",
      mktViewDetails: "विवरण हेर्नुहोस्",
      mktOrderBtn: "🛒 अर्डर",
      mktUnavailable: "उपलब्ध छैन",

      // Legacy keys
      browseAll: "सबै बाली हेर्नुहोस्",
      marketplaceSubtitle: "किसानहरूबाट सिधै ताजा बाली ब्राउज गर्नुहोस्",
      search: "खोज्नुहोस्",
      searchPlaceholder: "बाली खोज्नुहोस्... (Tomato / टमाटर)",
      category: "श्रेणी",
      district: "जिल्ला",
      municipality: "नगरपालिका",
      allCategories: "सबै श्रेणी",
      vegetables: "तरकारी",
      fruits: "फलफूल",
      grains: "अन्न",
      other: "अन्य",
      allDistricts: "सबै जिल्ला",
      allMunicipalities: "सबै नगरपालिका",
      selectDistrictFirst: "पहिले जिल्ला छान्नुहोस्",
      activeFilters: "सक्रिय फिल्टरहरू",
      clearAll: "सबै हटाउनुहोस्",
      cropsFound: "बाली भेटियो",
      cropFound: "बाली भेटियो",
      noCropsFound: "कुनै बाली भेटिएन",
      noCropsFoundSubtitle:
        "खोज फिल्टर समायोजन गर्नुहोस् वा नयाँ सूचीहरूका लागि पछि जाँच गर्नुहोस्",
      outOfStock: "स्टक सकियो",
      inStock: "स्टकमा छ",
      verified: "प्रमाणित",
      by: "द्वारा",
      farmer: "किसान",
      qty: "मात्रा",
      view: "हेर्नुहोस्",
      order: "अहिले अर्डर गर्नुहोस्",

      // Login page
      loginTitle: "फेरि स्वागत छ",
      loginSubtitle: "आफ्नो खातामा साइन इन गर्नुहोस्",
      email: "इमेल",
      password: "पासवर्ड",
      forgotPassword: "पासवर्ड बिर्सनुभयो?",
      noAccount: "खाता छैन?",
      loginBtn: "साइन इन",

      // Register page
      registerTitle: "खाता बनाउनुहोस्",
      registerSubtitle: "आज कृषि कनेक्टमा सामेल हुनुहोस्",
      name: "पूरा नाम",
      confirmPassword: "पासवर्ड पुष्टि गर्नुहोस्",
      role: "म एक हुँ",
      buyer: "खरिदकर्ता",
      selectRole: "आफ्नो भूमिका छान्नुहोस्",
      alreadyAccount: "पहिले नै खाता छ?",
      registerBtn: "खाता बनाउनुहोस्",
      phone: "फोन नम्बर",
      address: "ठेगाना",

      // Profile page
      updateProfile: "प्रोफाइल अपडेट गर्नुहोस्",
      profileUpdated: "प्रोफाइल सफलतापूर्वक अपडेट भयो",
      changePassword: "पासवर्ड परिवर्तन गर्नुहोस्",
      currentPassword: "हालको पासवर्ड",
      newPassword: "नयाँ पासवर्ड",

      // General
      loading: "लोड हुँदैछ...",
      error: "केही गल्ती भयो",
      success: "सफल भयो",
      back: "पछाडि",
      next: "अर्को",
      close: "बन्द गर्नुहोस्",
      save2: "परिवर्तन सुरक्षित गर्नुहोस्",
      actions: "कार्यहरू",
      date: "मिति",
      amount: "रकम",
      id: "आईडी",
      welcome: "स्वागत छ",
      welcomeBack: "फेरि स्वागत छ",
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('lang') || 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;