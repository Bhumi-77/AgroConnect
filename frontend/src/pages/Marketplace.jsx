import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

// ✅ Nepal Districts → Municipalities map
const NEPAL_DATA = {
  "Achham": ["Mangalsen Municipality","Sanphebagar Municipality","Bannigadhi Jayagadh Rural Municipality","Chaurpati Rural Municipality","Dhakari Rural Municipality","Mellekh Rural Municipality","Panchadeval Binayak Municipality","Ramaroshan Rural Municipality","Turmakhad Rural Municipality"],
  "Arghakanchi": ["Sandhikharka Municipality","Bhumekasthan Municipality","Malarani Rural Municipality","Chhatradev Rural Municipality","Panini Rural Municipality","Shitatganga Rural Municipality"],
  "Baglung": ["Baglung Municipality","Galkot Municipality","Dhorpatan Municipality","Jaimuni Municipality","Bareng Rural Municipality","Badigad Rural Municipality","Taman Khola Rural Municipality","Nisikhola Rural Municipality","Tarakhola Rural Municipality"],
  "Baitadi": ["Dasharathchand Municipality","Melauli Municipality","Dogadakedar Rural Municipality","Dilasaini Rural Municipality","Pancheshwar Rural Municipality","Patan Municipality","Purchaudi Municipality","Shivanath Rural Municipality","Surnaya Rural Municipality"],
  "Bajhang": ["Chainpur Municipality","Bungal Municipality","Chhabis Pathibhera Rural Municipality","Chhapri Rural Municipality","Durgathali Rural Municipality","Jayaprithvi Municipality","Kedarsyu Rural Municipality","Khaptadchhanna Rural Municipality","Masta Rural Municipality","Surma Rural Municipality","Thalara Rural Municipality","Talkot Rural Municipality","Bithadchir Rural Municipality"],
  "Bajura": ["Badimalika Municipality","Budhiganga Municipality","Budhinanda Municipality","Chhededaha Rural Municipality","Gaumul Rural Municipality","Himali Rural Municipality","Jagannath Rural Municipality","Khaptad Chhanna Rural Municipality","Swami Kartik Khapar Rural Municipality","Triveni Rural Municipality"],
  "Banke": ["Nepalgunj Sub-Metropolitan","Kohalpur Municipality","Duduwa Rural Municipality","Janki Rural Municipality","Khajura Rural Municipality","Narainapur Rural Municipality","Rapti Sonari Rural Municipality"],
  "Bara": ["Kalaiya Sub-Metropolitan","Jeetpur Simara Sub-Metropolitan","Nijgadh Municipality","Mahagadhimai Municipality","Simraungadh Municipality","Pheta Rural Municipality","Karaiyamai Rural Municipality","Adarshkotwal Rural Municipality","Bishrampur Rural Municipality","Prasauni Rural Municipality","Suwarna Rural Municipality","Devtal Rural Municipality","Parwanipur Rural Municipality"],
  "Bhaktapur": ["Bhaktapur Municipality","Changunarayan Municipality","Madhyapur Thimi Municipality","Suryabinayak Municipality"],
  "Bhojpur": ["Bhojpur Municipality","Shadananda Municipality","Arun Rural Municipality","Aamchowk Rural Municipality","Hatuwagadhi Rural Municipality","Pauwadungma Rural Municipality","Ramprasad Rai Rural Municipality","Salpasilichho Rural Municipality","Tyamke Yuwa Rural Municipality"],
  "Chitwan": ["Bharatpur Metropolitan","Ratnanagar Municipality","Rapti Municipality","Ichchhakamana Rural Municipality"],
  "Dadeldhura": ["Amargadhi Municipality","Aalital Rural Municipality","Ajayameru Rural Municipality","Bhageshwar Rural Municipality","Gangapur Rural Municipality","Navadurga Rural Municipality","Parashuram Municipality"],
  "Dailekh": ["Narayan Municipality","Dullu Municipality","Aathabis Municipality","Bhairabi Rural Municipality","Chamunda Bindrasaini Municipality","Dungeshwar Rural Municipality","Gurans Rural Municipality","Mahabu Rural Municipality","Naumule Rural Municipality","Thantikandh Rural Municipality"],
  "Dang": ["Tulsipur Sub-Metropolitan","Ghorahi Sub-Metropolitan","Lamahi Municipality","Rajpur Rural Municipality","Banglachuli Rural Municipality","Babai Rural Municipality","Dangisharan Rural Municipality","Gadhawa Rural Municipality","Rapti Rural Municipality","Shantinagar Rural Municipality"],
  "Darchula": ["Darchula Municipality","Api Rural Municipality","Byans Rural Municipality","Dunhu Rural Municipality","Lekam Rural Municipality","Mahakali Municipality","Marma Rural Municipality","Naugad Rural Municipality","Shailyashikhar Municipality"],
  "Dhading": ["Nilkantha Municipality","Tripura Sundari Municipality","Gajuri Rural Municipality","Galchi Rural Municipality","Gangajamuna Rural Municipality","Jwalamukhi Rural Municipality","Khaniyabas Rural Municipality","Netrawati Dabjong Rural Municipality","Rubi Valley Rural Municipality","Siddhalek Rural Municipality","Thakre Rural Municipality"],
  "Dhankuta": ["Dhankuta Municipality","Pakhribas Municipality","Mahalaxmi Municipality","Chhathar Jorpati Rural Municipality","Khalsa Chhintang Sahidbhumi Rural Municipality","Sahidbhumi Rural Municipality","Sangurigadhi Rural Municipality"],
  "Dhanusa": ["Janakpurdham Sub-Metropolitan","Dhanusadham Municipality","Ganeshman Charnath Municipality","Hansapur Municipality","Janaknandini Rural Municipality","Kamala Municipality","Lakshminiya Rural Municipality","Mithila Bihari Municipality","Mithila Municipality","Nagarain Municipality","Sabaila Municipality","Sahidnagar Municipality","Bateshwar Rural Municipality","Aurahi Rural Municipality","Bideha Rural Municipality","Mukhiyapatti Musharniya Rural Municipality"],
  "Dolakha": ["Charikot Municipality","Bhimeshwor Municipality","Jiri Municipality","Baiteshwor Rural Municipality","Bigu Rural Municipality","Gaurishankar Rural Municipality","Kalinchok Rural Municipality","Sailung Rural Municipality","Tamakoshi Rural Municipality"],
  "Dolpa": ["Thuli Bheri Municipality","Tripurasundari Municipality","Mudkechula Rural Municipality","Chharka Tangsong Rural Municipality","Dolpo Buddha Rural Municipality","Jagadulla Rural Municipality","Kaike Rural Municipality","Shey Phoksundo Rural Municipality"],
  "Gorkha": ["Gorkha Municipality","Palungtar Municipality","Aarughat Rural Municipality","Ajirkot Rural Municipality","Barpak Sulikot Rural Municipality","Bharatpokhara Rural Municipality","Chum Nubri Rural Municipality","Dharche Rural Municipality","Gandaki Rural Municipality","Shahid Lakhan Rural Municipality","Siranchok Rural Municipality","Tsum Nubri Rural Municipality"],
  "Gulmi": ["Resunga Municipality","Musikot Municipality","Isma Rural Municipality","Chandrakot Rural Municipality","Chatrakot Rural Municipality","Dhurkot Rural Municipality","Gulmi Darbar Rural Municipality","Kaligandaki Rural Municipality","Madane Rural Municipality","Malika Rural Municipality","Ruru Rural Municipality","Satyawati Rural Municipality"],
  "Humla": ["Simkot Rural Municipality","Sarkegad Rural Municipality","Namkha Rural Municipality","Kharpunath Rural Municipality","Adanchuli Rural Municipality","Tanjakot Rural Municipality","Chankheli Rural Municipality"],
  "Ilam": ["Ilam Municipality","Deumai Municipality","Mai Municipality","Suryodaya Municipality","Chulachuli Rural Municipality","Fakphokthum Rural Municipality","Maijogmai Rural Municipality","Mangsebung Rural Municipality","Rong Rural Municipality","Sandakpur Rural Municipality"],
  "Jajarkot": ["Bheri Municipality","Shibalaya Rural Municipality","Barekot Rural Municipality","Chhedagad Municipality","Junichande Rural Municipality","Kuse Rural Municipality","Nalagad Municipality","Tribeni Rural Municipality"],
  "Jhapa": ["Mechinagar Municipality","Bhadrapur Municipality","Arjundhara Municipality","Gauradaha Municipality","Buddhashanti Municipality","Kankai Municipality","Birtamod Municipality","Shivasataxi Municipality","Haldibari Rural Municipality","Jhapa Rural Municipality","Kachankawal Rural Municipality","Kamal Rural Municipality"],
  "Jumla": ["Chandannath Municipality","Kanakasundari Rural Municipality","Hima Rural Municipality","Tatopani Rural Municipality","Sinja Rural Municipality","Patarasi Rural Municipality","Tila Rural Municipality"],
  "Kailali": ["Dhangadhi Sub-Metropolitan","Tikapur Municipality","Bhajani Municipality","Ghodaghodi Municipality","Godawari Municipality","Jorayal Rural Municipality","Bardagoriya Rural Municipality","Chure Rural Municipality","Kailari Rural Municipality","Mohanyal Rural Municipality","Patharaiya Rural Municipality"],
  "Kalikot": ["Khandachakra Municipality","Mahawai Rural Municipality","Naraharinath Rural Municipality","Pachaljharana Rural Municipality","Palata Rural Municipality","Raskot Municipality","Sanni Triveni Rural Municipality","Shubha Kalika Municipality","Tilagufa Municipality"],
  "Kanchanpur": ["Bhimdatta Municipality","Bedkot Municipality","Belauri Municipality","Krishnapur Municipality","Laljhadi Rural Municipality","Mahakali Municipality","Punarbas Municipality","Shuklaphanta Municipality"],
  "Kapilvastu": ["Kapilvastu Municipality","Buddhabhumi Municipality","Banganga Municipality","Krishnanagar Municipality","Maharajgunj Municipality","Shivaraj Municipality","Bijaynagar Rural Municipality","Yashodhara Rural Municipality","Suddhodhan Rural Municipality","Mayadevi Rural Municipality"],
  "Kaski": ["Pokhara Metropolitan","Annapurna Rural Municipality","Madi Rural Municipality","Machhapuchchhre Rural Municipality","Rupa Rural Municipality"],
  "Kathmandu": ["Kathmandu Metropolitan","Kirtipur Municipality","Budhanilkantha Municipality","Gokarneshwar Municipality","Kageshwari-Manohara Municipality","Nagarjun Municipality","Shankharapur Municipality","Tarakeshwar Municipality","Tokha Municipality"],
  "Kavrepalanchok": ["Banepa Municipality","Dhulikhel Municipality","Mandan Deupur Municipality","Namobuddha Municipality","Panauti Municipality","Panchkhal Municipality","Bethanchok Rural Municipality","Bhumlu Rural Municipality","Chaurideurali Rural Municipality","Khanikhola Rural Municipality","Mahabharat Rural Municipality","Roshi Rural Municipality","Temal Rural Municipality"],
  "Khotang": ["Halesi Tuwachung Municipality","Diprung Chuichumma Rural Municipality","Aiselukharka Rural Municipality","Barahapokhari Rural Municipality","Kepilasgadhi Rural Municipality","Khotehang Rural Municipality","Lamidanda Rural Municipality","Rawabesi Rural Municipality","Sakela Rural Municipality"],
  "Lalitpur": ["Lalitpur Metropolitan","Godawari Municipality","Mahalaxmi Municipality","Konjyosom Rural Municipality","Bagmati Rural Municipality"],
  "Lamjung": ["Besisahar Municipality","Madhya Nepal Municipality","Marsyangdi Rural Municipality","Dordi Rural Municipality","Dudhpokhari Rural Municipality","Kwholasothar Rural Municipality","Rainas Municipality","Sundarbazar Municipality"],
  "Mahottari": ["Jaleshwor Municipality","Bardibas Municipality","Gaushala Municipality","Loharpatti Municipality","Manra Siswa Municipality","Matihani Municipality","Pipra Municipality","Ramgopalpur Municipality","Samsi Municipality","Sonama Municipality","Balwa Rural Municipality","Bhangaha Municipality","Ekdara Rural Municipality","Mahottari Rural Municipality","Aurahi Rural Municipality"],
  "Makwanpur": ["Hetauda Sub-Metropolitan","Thaha Municipality","Bagmati Municipality","Bhimphedi Rural Municipality","Indrasarobar Rural Municipality","Kailash Rural Municipality","Manahari Rural Municipality","Raksirang Rural Municipality"],
  "Manang": ["Manang Ngisyang Rural Municipality","Narpha Rural Municipality","Naso Rural Municipality","Chame Rural Municipality"],
  "Morang": ["Biratnagar Metropolitan","Sundarharaicha Municipality","Letang Municipality","Pathari Shanischare Municipality","Rangeli Municipality","Jahada Rural Municipality","Kerabari Rural Municipality","Miklajung Rural Municipality","Budhiganga Rural Municipality","Katahari Rural Municipality"],
  "Mugu": ["Chhayanath Rara Municipality","Khatyad Rural Municipality","Mugum Karmarong Rural Municipality","Soru Rural Municipality"],
  "Mustang": ["Mustang Rural Municipality","Thasang Rural Municipality","Dalome Rural Municipality","Lo-Ghekar Damodarkunda Rural Municipality","Gharapjhong Rural Municipality"],
  "Myagdi": ["Beni Municipality","Annapurna Rural Municipality","Dhaulagiri Rural Municipality","Mangala Rural Municipality","Malika Rural Municipality","Raghuganga Rural Municipality"],
  "Nawalparasi East": ["Kawasoti Municipality","Devchuli Municipality","Bulingtar Municipality"],
  "Nawalparasi West": ["Pratappur Rural Municipality","Palhinandan Rural Municipality","Ramgram Municipality","Sunwal Municipality","Sarawal Rural Municipality","Hupsekot Rural Municipality"],
  "Nuwakot": ["Bidur Municipality","Belkotgadhi Municipality","Dupcheshwar Rural Municipality","Kakani Rural Municipality","Kispang Rural Municipality","Likhu Rural Municipality","Myagang Rural Municipality","Panchakanya Rural Municipality","Shivapuri Rural Municipality","Suryagadhi Rural Municipality","Tadi Rural Municipality","Tarkeshwar Rural Municipality"],
  "Okhaldhunga": ["Siddhicharan Municipality","Molung Rural Municipality","Champadevi Rural Municipality","Chisankhugadhi Rural Municipality","Khijidemba Rural Municipality","Likhu Rural Municipality","Manebhanjyang Rural Municipality","Sunkoshi Rural Municipality"],
  "Palpa": ["Tansen Municipality","Rampur Municipality","Mathagadhi Rural Municipality","Bagnaskali Rural Municipality","Nisdi Rural Municipality","Purbakhola Rural Municipality","Rainadevi Chhahara Rural Municipality","Ribdikot Rural Municipality","Rishing Rural Municipality","Tinau Rural Municipality"],
  "Panchthar": ["Phidim Municipality","Falgunanda Rural Municipality","Hilihang Rural Municipality","Kummayak Rural Municipality","Miklajung Rural Municipality","Phalelung Rural Municipality","Tumbewa Rural Municipality","Yangwarak Rural Municipality"],
  "Parbat": ["Kushma Municipality","Phalewas Municipality","Painyu Rural Municipality","Bihadi Rural Municipality","Jaljala Rural Municipality","Modi Rural Municipality","Mahashila Rural Municipality"],
  "Parsa": ["Birgunj Metropolitan","Bahudaramai Municipality","Parsagadhi Municipality","Bindabasini Rural Municipality","Chhipaharmai Rural Municipality","Dhobinimai Rural Municipality","Jagarnathpur Rural Municipality","Kalikamai Rural Municipality","Paterwasugauli Rural Municipality","Pkaha Mainpur Rural Municipality","Sakhuwa Parsauni Rural Municipality","Thori Rural Municipality"],
  "Pyuthan": ["Pyuthan Municipality","Swargadwari Municipality","Gaumukhi Rural Municipality","Jhimruk Rural Municipality","Mallarani Rural Municipality","Mandavi Rural Municipality","Naubahini Rural Municipality","Sarumarani Rural Municipality"],
  "Ramechhap": ["Manthali Municipality","Ramechhap Municipality","Doramba Rural Municipality","Gokulganga Rural Municipality","Khandadevi Rural Municipality","Likhu Tamakoshi Rural Municipality","Sunapati Rural Municipality","Umakunda Rural Municipality"],
  "Rasuwa": ["Kalika Rural Municipality","Gosaikunda Rural Municipality","Aamachhodingmo Rural Municipality","Naukunda Rural Municipality","Uttargaya Rural Municipality"],
  "Rautahat": ["Gaur Municipality","Chandrapur Municipality","Rajpur Municipality","Brindaban Municipality","Dewahi Gonahi Municipality","Durga Bhagwati Rural Municipality","Garuda Municipality","Gadhimai Municipality","Gujara Rural Municipality","Ishanath Municipality","Katahariya Municipality","Maulapur Municipality","Madhav Narayan Municipality","Paroha Municipality","Pheta Rural Municipality","Phatuwa Bijayapur Municipality","Rajdevi Municipality","Baudhimai Municipality"],
  "Rolpa": ["Rolpa Municipality","Lungri Rural Municipality","Madi Rural Municipality","Pariwartan Rural Municipality","Runtigadhi Rural Municipality","Sunchhahari Rural Municipality","Suwarnabati Rural Municipality","Tribeni Rural Municipality","Thabang Rural Municipality"],
  "Rukum East": ["Putha Uttarganga Rural Municipality","Sisne Rural Municipality"],
  "Rukum West": ["Musikot Municipality","Aathbiskot Municipality","Banfikot Rural Municipality","Chaurjahari Municipality","Triveni Rural Municipality"],
  "Rupandehi": ["Butwal Sub-Metropolitan","Tilottama Municipality","Devdaha Municipality","Siddarthanagar Municipality","Lumbini Sanskritik Municipality","Sainamaina Municipality","Mayadevi Rural Municipality","Kotahimai Rural Municipality","Marchawari Rural Municipality","Omsatiya Rural Municipality","Rohini Rural Municipality","Sammarimai Rural Municipality","Sudhdhodhan Rural Municipality"],
  "Salyan": ["Sharada Municipality","Bagchaur Municipality","Bangad Kupinde Municipality","Darma Rural Municipality","Dhorchaur Rural Municipality","Kalimati Rural Municipality","Kapurkot Rural Municipality","Siddha Kumakh Rural Municipality"],
  "Saptari": ["Rajbiraj Municipality","Kanchanrup Municipality","Saptakoshi Rural Municipality","Balan-Bihul Rural Municipality","Bishnupur Rural Municipality","Chhinnamasta Rural Municipality","Dakneshwori Rural Municipality","Hanumannagar Kankalini Municipality","Khadak Municipality","Mahadewa Rural Municipality","Rajgadh Rural Municipality","Rupani Rural Municipality","Shambhunath Municipality","Tilathi Koiladi Rural Municipality","Tirhut Rural Municipality"],
  "Sarlahi": ["Lalbandi Municipality","Haripur Municipality","Hariwan Municipality","Ishworpur Municipality","Kaudena Rural Municipality","Bagmati Municipality","Balara Municipality","Barahathawa Municipality","Basbariya Rural Municipality","Bishnu Rural Municipality","Bramhapuri Rural Municipality","Chakraghatta Rural Municipality","Chandranagar Rural Municipality","Dhankaul Rural Municipality","Godaita Municipality","Haripurwa Municipality","Malangawa Municipality","Parsa Rural Municipality","Ramnagar Rural Municipality"],
  "Sindhuli": ["Kamalamai Municipality","Dudhouli Municipality","Golanjor Rural Municipality","Hariharpurgadhi Rural Municipality","Marin Rural Municipality","Phikkal Rural Municipality","Sunkoshi Rural Municipality","Tinpatan Rural Municipality"],
  "Sindhupalchok": ["Chautara Sangachokgadhi Municipality","Melamchi Municipality","Barhabise Municipality","Helambu Rural Municipality","Balefi Rural Municipality","Bhotekoshi Rural Municipality","Indrawati Rural Municipality","Jugal Rural Municipality","Lisangkhu Pakhar Rural Municipality","Sunkoshi Rural Municipality","Tripura Sundari Rural Municipality"],
  "Siraha": ["Siraha Municipality","Lahan Municipality","Golbazar Municipality","Mirchaiya Municipality","Dhangadhimai Municipality","Sukhipur Municipality","Karjanha Municipality","Kalyanpur Municipality","Arnama Rural Municipality","Aurahi Rural Municipality","Bariyarpatti Rural Municipality","Bhagwanpur Rural Municipality","Bishnupur Rural Municipality","Nawarajpur Rural Municipality","Sakhuwanankarkatti Rural Municipality","Naraha Rural Municipality"],
  "Sunsari": ["Dharan Sub-Metropolitan","Inaruwa Municipality","Duhabi Municipality","Itahari Sub-Metropolitan","Barahakshetra Municipality","Harinagar Rural Municipality","Koshi Rural Municipality","Bhokraha Narsingh Rural Municipality","Dewanganj Rural Municipality"],
  "Surkhet": ["Birendranagar Municipality","Bheriganga Municipality","Chaukune Rural Municipality","Chingad Rural Municipality","Gurbhakot Municipality","Lekbesi Municipality","Panchapuri Municipality","Simta Rural Municipality"],
  "Syangja": ["Waling Municipality","Putalibazar Municipality","Chapakot Municipality","Galyang Municipality","Arjunchaupari Rural Municipality","Aandhikhola Rural Municipality","Biruwa Rural Municipality","Harinas Rural Municipality","Kaligandaki Rural Municipality","Phedikhola Rural Municipality"],
  "Tanahun": ["Damauli Municipality","Bhanu Municipality","Byas Municipality","Bandipur Rural Municipality","Devghat Rural Municipality","Ghiring Rural Municipality","Myagde Rural Municipality","Rhishing Rural Municipality","Shuklagandaki Municipality","Anbukhaireni Rural Municipality"],
  "Taplejung": ["Phungling Municipality","Sirijangha Rural Municipality","Aathrai Rural Municipality","Maiwa Khola Rural Municipality","Maijogmai Rural Municipality","Meringden Rural Municipality","Mikwakhola Rural Municipality","Pathivara Yangwarak Rural Municipality","Phaktanglung Rural Municipality","Sidingba Rural Municipality"],
  "Terhathum": ["Myanglung Municipality","Laligurans Municipality","Aathrai Tribeni Rural Municipality","Chhathar Rural Municipality","Menchhayayem Rural Municipality","Phedap Rural Municipality"],
  "Udayapur": ["Triyuga Municipality","Belaka Municipality","Chaudandigadhi Municipality","Katari Municipality","Udayapurgadhi Rural Municipality","Tapli Rural Municipality","Rautamai Rural Municipality","Limchungbung Rural Municipality"],
};

export default function Marketplace() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();

  const [crops, setCrops] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');

  // ✅ Backend URL for showing images
  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

  // ✅ Derived from NEPAL_DATA
  const sortedDistricts = Object.keys(NEPAL_DATA).sort();
  const availableMunicipalities = district ? NEPAL_DATA[district] || [] : [];

  const fetchCrops = async () => {
    const { data } = await api.get('/api/crops', { params: { q, category, district, municipality } });
    if (data.ok) setCrops(data.crops);
  };

  useEffect(() => {
    fetchCrops();
  }, []); // initial

  const titleKey = i18n.language === 'np' ? 'titleNp' : 'titleEn';

  const filtered = useMemo(() => crops, [crops]);

  // ✅ ESSENTIAL: add to cart (localStorage) and go to checkout
  const addToCartAndCheckout = (c) => {
    const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
    if (availableQty <= 0) return;

    let cart = [];
    try {
      cart = JSON.parse(localStorage.getItem('cart') || '[]');
      if (!Array.isArray(cart)) cart = [];
    } catch {
      cart = [];
    }

    const existing = cart.find((x) => x.cropId === c.id);
    if (existing) {
      existing.quantity = Number(existing.quantity || 1) + 1;
      // optional safety: don't exceed stock
      existing.quantity = Math.min(existing.quantity, Number(availableQty));
    } else {
      cart.push({
        cropId: c.id,
        title: c.titleEn || c.titleNp,
        titleEn: c.titleEn,
        titleNp: c.titleNp,
        price: c.price,
        unitPrice: c.price,
        quantity: 1,
        unit: c.unit,
      });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    nav('/checkout');
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f5f7fa',
        padding: '24px',
      }}
    >
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 968px) {
          .marketplace-container {
            padding: 16px !important;
          }
          .filter-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .filter-grid .search-full {
            grid-column: 1 / -1 !important;
          }
        }
        @media (max-width: 640px) {
          .filter-grid {
            grid-template-columns: 1fr !important;
          }
          .crop-grid {
            grid-template-columns: 1fr !important;
          }
          .crop-card-content {
            flex-direction: column !important;
          }
          .crop-actions {
            flex-direction: row !important;
            width: 100% !important;
          }
          .crop-actions a {
            flex: 1 !important;
          }
        }
        select:disabled {
          opacity: 0.55;
          cursor: not-allowed !important;
        }
      `}</style>

      <div
        className="marketplace-container"
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            marginBottom: '32px',
          }}
        >
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a1a1a',
              margin: 0,
              marginBottom: '8px',
            }}
          >
            Marketplace
          </h1>
          <p
            style={{
              fontSize: '15px',
              color: '#666',
              margin: 0,
            }}
          >
            Browse fresh crops directly from farmers
          </p>
        </div>

        {/* Search and Filters */}
        <div
          style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e0e0e0',
          }}
        >
          <div
            className="filter-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr auto',
              gap: '16px',
              alignItems: 'end',
            }}
          >
            {/* Search Input */}
            <div className="search-full">
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('search')}
              </label>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search crops... (Tomato / टमाटर)"
                onKeyPress={(e) => e.key === 'Enter' && fetchCrops()}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              />
            </div>

            {/* Category Filter */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('category')}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: 'white',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              >
                <option value="">All Categories</option>
                <option value="vegetables">Vegetables</option>
                <option value="fruits">Fruits</option>
                <option value="grains">Grains</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* ✅ District Filter — dropdown replacing text input */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px',
                }}
              >
                {t('district')}
              </label>
              <select
                value={district}
                onChange={(e) => {
                  setDistrict(e.target.value);
                  setMunicipality('');
                }}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                  cursor: 'pointer',
                  background: 'white',
                }}
                onFocus={(e) => (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              >
                <option value="">All Districts</option>
                {sortedDistricts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* ✅ Municipality Filter — dropdown replacing text input, depends on district */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: district ? '#333' : '#aaa',
                  marginBottom: '8px',
                }}
              >
                {t('municipality')}
              </label>
              <select
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                disabled={!district}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box',
                  cursor: district ? 'pointer' : 'not-allowed',
                  background: district ? 'white' : '#f9f9f9',
                }}
                onFocus={(e) => district && (e.target.style.borderColor = '#4a7c3b')}
                onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
              >
                <option value="">{district ? 'All Municipalities' : 'Select district first'}</option>
                {availableMunicipalities.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Search Button */}
            <button
              onClick={fetchCrops}
              style={{
                padding: '12px 24px',
                background: '#4a7c3b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s',
                whiteSpace: 'nowrap',
                height: '44px',
              }}
              onMouseOver={(e) => (e.target.style.background = '#3d6630')}
              onMouseOut={(e) => (e.target.style.background = '#4a7c3b')}
            >
              🔍 {t('search')}
            </button>
          </div>

          {/* Active Filters Display */}
          {(q || category || district || municipality) && (
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{
                  fontSize: '13px',
                  color: '#666',
                  fontWeight: '600',
                }}
              >
                Active Filters:
              </span>
              {q && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  Search: "{q}"
                </span>
              )}
              {category && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {category}
                </span>
              )}
              {district && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {district}
                </span>
              )}
              {municipality && (
                <span
                  style={{
                    fontSize: '13px',
                    padding: '4px 10px',
                    background: '#e8f5e9',
                    color: '#4a7c3b',
                    borderRadius: '12px',
                    fontWeight: '500',
                  }}
                >
                  {municipality}
                </span>
              )}
              <button
                onClick={() => {
                  setQ('');
                  setCategory('');
                  setDistrict('');
                  setMunicipality('');
                  setTimeout(fetchCrops, 0);
                }}
                style={{
                  fontSize: '13px',
                  padding: '4px 10px',
                  background: '#fff',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '500',
                }}
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Header */}
        <div
          style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#333',
            }}
          >
            {filtered.length} {filtered.length === 1 ? 'crop' : 'crops'} found
          </div>
        </div>

        {/* Crops Grid */}
        <div
          className="crop-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
            gap: '20px',
          }}
        >
          {filtered.map((c) => {
            const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
            const inStock = c.inStock ?? availableQty > 0;

            // ✅ Robust image extraction (array OR JSON string OR single string OR comma-separated)
            const rawImages = c.images;

            let firstImage = null;

            if (Array.isArray(rawImages) && rawImages.length > 0) {
              firstImage = rawImages[0];
            } else if (typeof rawImages === 'string' && rawImages.trim()) {
              const s = rawImages.trim();

              // JSON string: '["/uploads/a.jpg"]'
              if (s.startsWith('[') && s.endsWith(']')) {
                try {
                  const arr = JSON.parse(s);
                  if (Array.isArray(arr) && arr.length > 0) firstImage = arr[0];
                } catch {}
              }

              // comma-separated: "/uploads/a.jpg,/uploads/b.jpg"
              if (!firstImage && s.includes(',')) {
                firstImage = s.split(',')[0].trim();
              }

              // single string: "/uploads/a.jpg"
              if (!firstImage) {
                firstImage = s;
              }
            }

            const imageUrl = firstImage
              ? firstImage.startsWith('http')
                ? firstImage
                : `${BACKEND_URL}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`
              : null;

            return (
              <div
                key={c.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '20px',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #e0e0e0',
                  transition: 'all 0.2s',
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* ✅ Image area (this is what your screenshot shows as blank box) */}
                <div
                  style={{
                    width: '100%',
                    height: '180px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    background: '#f3f4f6',
                    border: '1px solid #eee',
                    marginBottom: '16px',
                  }}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={c[titleKey]}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                      onError={(e) => {
                        // if image fails, hide it so gray placeholder remains
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : null}
                </div>

                <div
                  className="crop-card-content"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '16px',
                  }}
                >
                  {/* Crop Info */}
                  <div style={{ flex: 1 }}>
                    <h3
                      style={{
                        fontSize: '20px',
                        fontWeight: '700',
                        color: '#1a1a1a',
                        margin: 0,
                        marginBottom: '8px',
                      }}
                    >
                      {c[titleKey]}
                    </h3>

                    <div
                      style={{
                        fontSize: '14px',
                        color: '#666',
                        marginBottom: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span
                        style={{
                          padding: '2px 8px',
                          background: '#f0f0f0',
                          borderRadius: '4px',
                          fontSize: '13px',
                          fontWeight: '500',
                        }}
                      >
                        {c.category}
                      </span>
                      <span>•</span>
                      <span>📍 {c.district || '-'} {c.municipality || ''}</span>
                    </div>

                    {/* Badges */}
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        flexWrap: 'wrap',
                        marginBottom: '12px',
                      }}
                    >
                      <span
                        style={{
                          padding: '6px 12px',
                          background: '#e8f5e9',
                          color: '#4a7c3b',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        रु {c.price}/{c.unit}
                      </span>

                      <span
                        style={{
                          padding: '6px 12px',
                          background: '#f0f0f0',
                          color: '#333',
                          borderRadius: '6px',
                          fontSize: '13px',
                          fontWeight: '600',
                        }}
                      >
                        {t('qty')}: {availableQty}
                      </span>

                      {!inStock && (
                        <span
                          style={{
                            padding: '6px 12px',
                            background: '#fee2e2',
                            color: '#991b1b',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '700',
                          }}
                        >
                          Out of Stock
                        </span>
                      )}

                      {c.farmer?.isVerified && (
                        <span
                          style={{
                            padding: '6px 12px',
                            background: '#dbeafe',
                            color: '#1e40af',
                            borderRadius: '6px',
                            fontSize: '13px',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          ✓ Verified
                        </span>
                      )}
                    </div>

                    {/* Farmer Info */}
                    {c.farmer && (
                      <div
                        style={{
                          fontSize: '13px',
                          color: '#666',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: '#4a7c3b',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: '600',
                          }}
                        >
                          {c.farmer.fullName?.[0]?.toUpperCase() || 'F'}
                        </span>
                        <span>By {c.farmer.fullName || 'Farmer'}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div
                    className="crop-actions"
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '10px',
                      minWidth: '120px',
                      justifyContent: 'center',
                    }}
                  >
                    <Link
                      to={`/product/${c.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '10px 20px',
                        background: 'white',
                        color: '#4a7c3b',
                        border: '1px solid #4a7c3b',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                      }}
                      onMouseOver={(e) => {
                        e.target.style.background = '#f0f0f0';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.background = 'white';
                      }}
                    >
                      {t('view')}
                    </Link>

                    {user?.role === 'BUYER' && (
                      inStock ? (
                        <button
                          type="button"
                          onClick={() => addToCartAndCheckout(c)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 20px',
                            background: '#4a7c3b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '600',
                            textDecoration: 'none',
                            transition: 'background 0.2s',
                            textAlign: 'center',
                            cursor: 'pointer',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.background = '#3d6630';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.background = '#4a7c3b';
                          }}
                        >
                          {t('order')}
                        </button>
                      ) : (
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 20px',
                            background: '#e5e7eb',
                            color: '#6b7280',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: '700',
                            textAlign: 'center',
                            cursor: 'not-allowed',
                            userSelect: 'none',
                          }}
                          title="Out of stock"
                        >
                          Out of Stock
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filtered.length === 0 && (
          <div
            style={{
              background: 'white',
              borderRadius: '12px',
              padding: '60px 40px',
              textAlign: 'center',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              border: '1px solid #e0e0e0',
            }}
          >
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🌾</div>
            <h3
              style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#1a1a1a',
                margin: 0,
                marginBottom: '12px',
              }}
            >
              No crops found
            </h3>
            <p
              style={{
                fontSize: '15px',
                color: '#666',
                margin: 0,
              }}
            >
              Try adjusting your search filters or check back later for new listings
            </p>
          </div>
        )}
      </div>
    </div>
  );
}