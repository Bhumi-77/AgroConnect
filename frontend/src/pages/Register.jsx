import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Location Picker Component for map clicks
function LocationPicker({ onLocationSelect }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng);
    },
  });
  return null;
}

// ✅ Nepal Districts and Municipalities Data
const nepalDistricts = [
  'Achham', 'Arghakhanchi', 'Baglung', 'Baitadi', 'Bajhang', 'Bajura', 'Banke', 'Bara', 'Bardiya',
  'Bhaktapur', 'Bhojpur', 'Chitwan', 'Dadeldhura', 'Dailekh', 'Dang', 'Darchula', 'Dhading',
  'Dhankuta', 'Dhanusa', 'Dholkha', 'Dolpa', 'Doti', 'Gorkha', 'Gulmi', 'Humla', 'Ilam', 'Jajarkot',
  'Jhapa', 'Jumla', 'Kailali', 'Kalikot', 'Kanchanpur', 'Kapilvastu', 'Kaski', 'Kathmandu',
  'Kavrepalanchok', 'Khotang', 'Lalitpur', 'Lamjung', 'Mahottari', 'Makwanpur', 'Manang', 'Morang',
  'Mugu', 'Mustang', 'Myagdi', 'Nawalparasi East', 'Nawalparasi West', 'Nuwakot', 'Okhaldhunga',
  'Palpa', 'Panchthar', 'Parbat', 'Parsa', 'Pyuthan', 'Ramechhap', 'Rasuwa', 'Rautahat', 'Rolpa',
  'Rukum East', 'Rukum West', 'Rupandehi', 'Salyan', 'Sankhuwasabha', 'Saptari', 'Sarlahi',
  'Sindhuli', 'Sindhupalchok', 'Siraha', 'Solukhumbu', 'Sunsari', 'Surkhet', 'Syangja', 'Tanahu',
  'Taplejung', 'Terhathum', 'Udayapur'
].sort();

// ✅ District to Municipalities Mapping (Major ones - expand as needed)
const districtMunicipalities = {
  'Achham':['Mangalsen Municipality','Panchadewal Binayak Municipality  ','Kamalbazar Municipality','Chaurpati Rural Municipality','Ramaroshan Rural Municipality','Mellekh Rural Municipality','Bannigadi Jayagad Rural Municipality'],
  'Arghakhanchi': ['Sandhikharka Municipality', 'Sitganga Municipality', 'Chhatradev Rural Municipality', 'Malarani Rural Municipality', 'Panini Rural Municipality','Bhumikasthan Municipality'],
  'Baglung': ['Baglung Municipality', 'Galkot Municipality', 'Dhorpatan Municipality', 'Tara Khola Rural Municipality', 'Nisikhola Rural Municipality', 'Bareng Rural Municipality', 'Jaimuni Rural Municipality'],
  'Baitadi': ['Dasharathchand Municipality', 'Patan Municipality', 'Melauli Municipality', 'Pancheshwar Municipality', 'Shivanath Municipality', 'Surnaya Rural Municipality', 'Dilasaini Rural Municipality'],
  'Bajhang': ['Chainpur Municipality', 'Jaya Prithvi Municipality', 'Bungal Municipality', 'Surma Rural Municipality', 'Talkot Rural Municipality', 'Masta Rural Municipality', 'Durgathali Rural Municipality'],
  'Bajura': ['Budhiganga Municipality', 'Triveni Municipality', 'Swamikartik Khapar Rural Municipality', 'Himali Rural Municipality', 'Chhededaha Rural Municipality'],
  'Banke': ['Nepalgunj Sub-Metropolitan', 'Kohalpur', 'Rapti Sonari', 'Narainapur', 'Duduwa', 'Janaki', 'Khajura', 'Baijanath'],
  'Bara': ['Kalaiya Sub-Metropolitan', 'Parwanipur Municipality', 'Prasauni Municipality', 'Adarsh Kotwal Rural Municipality', 'Baragadhi Rural Municipality', 'Pacharauta Municipality'],  
  'Bardiya': ['Gulariya Municipality', 'Madhuwan', 'Rajapur', 'Thakurbaba', 'Bansagadhi', 'Barbardiya', 'Geruwa', 'Badhaiyatal'],
  'Bhaktapur': ['Bhaktapur Municipality', 'Changunarayan', 'Madhyapur Thimi', 'Suryabinayak'],
  'Bhojpur': ['Bhojpur Municipality', 'Shadananda Municipality', 'Pauwadungma Rural Municipality', 'Aamchok Rural Municipality', 'Hatuwagadhi Rural Municipality', 'Salpasilichho Rural Municipality'],
  'Chitwan': ['Bharatpur Metropolitan', 'Ratnanagar', 'Rapti', 'Kalika', 'Khairahani', 'Madi', 'Ichchhakamana'],
  'Dadeldhura': ['Amargadhi Municipality', 'Parshuram Municipality', 'Alital Rural Municipality', 'Navadurga Rural Municipality', 'Ajaymeru Rural Municipality'],
  'Dailekh': ['Dailekh Municipality', 'Bhagawatimai Rural Municipality', 'Dullu Municipality', 'Gurans Rural Municipality', 'Naumule Rural Municipality', 'Aathbis Rural Municipality', 'Bheri Malika Rural Municipality'],
  'Dang': ['Ghorahi Sub-Metropolitan', 'Tulsipur Sub-Metropolitan', 'Lamahi', 'Gadhawa', 'Rajpur', 'Shantinagar', 'Rapti', 'Dangisharan', 'Babai', 'Banglachuli'],
  'Darchula': ['Mahakali Municipality', 'Shailyashikhar Municipality', 'Malikarjun Rural Municipality', 'Apihimal Rural Municipality', 'Duhun Rural Municipality'],
  'Dhading': ['Dhading Municipality', 'Gajuri Municipality', 'Galchhi Rural Municipality', 'Thakre Rural Municipality', 'Benighat Rorang Rural Municipality', 'Netrawati Dabjong Rural Municipality'],
  'Dhankuta': ['Dhankuta Municipality', 'Mahalaxmi Municipality', 'Pakhribas Municipality', 'Chhathar Rural Municipality', 'Sangurigadhi Rural Municipality', 'Chaubise Rural Municipality'],
  'Dhanusa': ['Janakpur Sub-Metropolitan', 'Bateshwar Rural Municipality', 'Mithila Bihari Municipality', 'Mithila Madhya Municipality', 'Mithila Thakurani Municipality', 'Nagarain Municipality', 'Dhanusadham Municipality'],
  'Dholkha': ['Dhulikhel Municipality', 'Namobuddha Municipality', 'Panauti Municipality', 'Kalinchowk Rural Municipality', 'Jugal Rural Municipality'],
  'Dolpa': ['Thuli Bheri Municipality', 'Dolpo Buddha Rural Municipality', 'She Phoksundo Rural Municipality', 'Saldang Rural Municipality'],
  'Doti': ['Dipayal Silgadhi Sub-Metropolitan', 'Jorayal Rural Municipality', 'Sayal Rural Municipality', 'Malaun Rural Municipality', 'Aadarsha Rural Municipality', 'Shikhar Rural Municipality'],
  'Gorkha': ['Gorkha Municipality', 'Palungtar Municipality', 'Sulikot Rural Municipality', 'Siranchok Rural Municipality', 'Ajirkot Rural Municipality', 'Barpak Sulikot Rural Municipality'], 
  'Gulmi': ['Resunga Municipality', 'Madane Rural Municipality', 'Malika Rural Municipality', 'Dhuri Rural Municipality', 'Isma Rural Municipality', 'Kaligandaki Rural Municipality', 'Satyawati Rural Municipality'],
  'Humla': ['Simkot Rural Municipality', 'Chankheli Rural Municipality', 'Kharpunath Rural Municipality', 'Adanchuli Rural Municipality', 'Tajakot Rural Municipality'],
  'Ilam': ['Ilam Municipality', 'Chulachuli Rural Municipality', 'Maijogmai Rural Municipality', 'Suryodaya Municipality', 'Mangsebung Rural Municipality', 'Rong Rural Municipality'],
  'Jajarkot': ['Jajarkot Municipality', 'Bheri Municipality', 'Chhedagad Municipality', 'Kankalpur Rural Municipality', 'Shivraj Rural Municipality', 'Keheli Rural Municipality'],
  'Jhapa': ['Mechinagar', 'Damak', 'Kankai', 'Bhadrapur', 'Arjundhara', 'Shivasatakshi', 'Gauradaha', 'Birtamod', 'Kamal', 'Gaurigunj', 'Barhadashi', 'Jhapa', 'Buddhashanti', 'Haldibari', 'Kachankawal'],
  'Jumla': ['Jumla Municipality', 'Sinja Rural Municipality', 'Hima Rural Municipality', 'Tila Rural Municipality', 'Guthichaur Rural Municipality'],
  'Kailali': ['Dhangadhi Sub-Metropolitan', 'Tikapur', 'Ghodaghodi', 'Bhajani', 'Godawari', 'Gauriganga', 'Janaki', 'Bardagoriya', 'Mohanyal', 'Kailari', 'Joshipur', 'Lamkichuha', 'Chure'],
  'Kalikot': ['Khandachakra Municipality', 'Tilagufa Municipality', 'Shubha Kalika Municipality', 'Pachaljharana Rural Municipality', 'Raskot Rural Municipality', 'Sanni Triveni Rural Municipality'],
  'Kanchanpur': ['Bhimdatta', 'Punarbas', 'Bedkot', 'Mahakali', 'Shuklaphanta', 'Belauri', 'Krishnapur', 'Laljhadi'],
  'Kapilvastu': ['Kapilvastu Municipality', 'Shivaraj Municipality', 'Maharajgunj Municipality', 'Mayadevi Rural Municipality', 'Yasodhara Rural Municipality', 'Suddhodhan Rural Municipality'],
  'Kaski': ['Pokhara Metropolitan', 'Annapurna', 'Machhapuchchhre', 'Madi', 'Rupa'],
  'Kavrepalanchok': ['Dhulikhel Municipality', 'Banepa Municipality', 'Panauti Municipality', 'Mandandeupur Municipality', 'Bhumlu Rural Municipality', 'Bethanchok Rural Municipality', 'Chaurideurali Rural Municipality'],
  'Khotang': ['Diktel Rupakot Majhuwagadhi Municipality', 'Halesi Tuwachung Municipality', 'Aiselukharka Rural Municipality', 'Khotehang Rural Municipality', 'Rupatar Rural Municipality', 'Sakela Rural Municipality'],
  'Kathmandu': ['Kathmandu Metropolitan', 'Kageshwari Manohara', 'Kirtipur', 'Gokarneshwor', 'Chandragiri', 'Tokha', 'Tarakeshwor', 'Dakshinkali', 'Nagarjun', 'Budhanilkantha', 'Shankharapur'],
  'Lalitpur': ['Lalitpur Metropolitan', 'Godawari', 'Mahalaxmi', 'Konjyosom', 'Bagmati', 'Mahankal'],
  'Lamjung': ['Besisahar Municipality', 'Marsyandi Rural Municipality', 'Madhyanepal Municipality', 'Dordi Rural Municipality', 'Sundarbazar Municipality', 'Rainas Municipality', 'Dudhpokhari Rural Municipality'],
  'Mahottari': ['Jaleshwar Sub-Metropolitan', 'Manara Shiswa Municipality', 'Matihani Municipality', 'Bardibas Municipality', 'Gaushala Municipality', 'Balawa Municipality', 'Pipara Rural Municipality'],
  'Makwanpur': ['Hetauda Sub-Metropolitan', 'Thaha Municipality', 'Indrasarowar Rural Municipality', 'Manahari Rural Municipality', 'Raksirang Rural Municipality', 'Bagmati Rural Municipality', 'Bakaiya Rural Municipality'],
  'Manang': ['Chame Rural Municipality', 'Nason Rural Municipality', 'Narpa Bhumi Rural Municipality', 'Bhraka Rural Municipality'],
  'Mugu': ['Mugu Municipality', 'Chhayanath Rara Rural Municipality', 'Soru Rural Municipality', 'Khatyad Rural Municipality', 'Ehram Rural Municipality'],
  'Mustang': ['Jomsom Municipality', 'Lo Manthang Rural Municipality', 'Muktinath Rural Municipality', 'Gharpajhong Rural Municipality'],
  'Morang': ['Biratnagar Metropolitan', 'Belbari', 'Dhanpalthan', 'Gramthan', 'Jahada', 'Kanepokhari', 'Katahari', 'Kerabari', 'Letang', 'Miklajung', 'Pathari-Sanischare', 'Rangeli', 'Ratuwamai', 'Sunawarshi', 'Sunwarshi', 'Urlabari'],
  'Myagdi': ['Beni Municipality', 'Mangala Rural Municipality', 'Malika Rural Municipality', 'Raghuganga Rural Municipality', 'Dhawalagiri Rural Municipality'],
  'Nawalparasi East': ['Bardaghat Municipality', 'Parasi Municipality', 'Susta Rural Municipality', 'Sarawal Rural Municipality', 'Pratappur Rural Municipality'],
  'Nawalparasi West': ['Sunwal Municipality', 'Ramgram Municipality', 'Palhinandan Rural Municipality', 'Pratappur Rural Municipality', 'Susta Rural Municipality'],
  'Nuwakot': ['Bidur Municipality', 'Belkotgadhi Municipality', 'Kakani Rural Municipality', 'Trishuli Rural Municipality', 'Nuwakot Rural Municipality', 'Shivapuri Rural Municipality'],
  'Okhaldhunga': ['Siddhicharan Municipality', 'Chishankhugadhi Rural Municipality', 'Khijidemba Rural Municipality', 'Champadevi Rural Municipality', 'Shahidbhumi Rural Municipality'],
  'Palpa': ['Tansen Municipality', 'Rambha Municipality', 'Rainadevi Chhahara Rural Municipality', 'Nisdi Rural Municipality', 'Purbakhola Rural Municipality', 'Jaljala Rural Municipality'],
  'Panchthar': ['Phidim Municipality', 'Hilihang Rural Municipality', 'Kummayak Rural Municipality', 'Miklajung Rural Municipality', 'Phedap Rural Municipality', 'Tumbewa Rural Municipality'],
  'Parbat': ['Kushma Municipality', 'Phalewas Municipality', 'Jaljala Rural Municipality', 'Paiyun Rural Municipality', 'Mahashila Rural Municipality'],
  'Parsa': ['Birgunj Sub-Metropolitan', 'Pokhariya Municipality', 'Bahudarmai Municipality', 'Bindabasini Rural Municipality', 'Chhipaharmai Rural Municipality', 'Jagarnathpur Rural Municipality', 'Kalikamai Rural Municipality'],
  'Pyuthan': ['Pyuthan Municipality', 'Gaumukhi Rural Municipality', 'Mandavi Rural Municipality', 'Naubahini Rural Municipality', 'Sarumarani Rural Municipality', 'Sworgadwari Rural Municipality'],
  'Ramechhap': ['Manthali Municipality', 'Ramechhap Municipality', 'Sunapati Rural Municipality', 'Umakunda Rural Municipality', 'Gokulganga Rural Municipality'],
  'Rasuwa': ['Dhunche Municipality', 'Briddhim Rural Municipality', 'Gosaikunda Rural Municipality', 'Kalika Rural Municipality', 'Naukunda Rural Municipality'],
  'Rautahat': ['Gaur Municipality', 'Paroha Municipality', 'Ishnath Municipality', 'Rajdevi Municipality', 'Garuda Municipality', 'Maulapur Municipality', 'Durga Bhagwati Rural Municipality', 'Yamunamai Rural Municipality', 'Gadhimai Rural Municipality'],
  'Rolpa': ['Rolpa Municipality', 'Madi Municipality', 'Runtigadhi Rural Municipality', 'Sunchhahari Rural Municipality', 'Thawang Rural Municipality', 'Tribeni Rural Municipality'],
  'Rukum East': ['Rukumkot Municipality', 'Alae Rural Municipality', 'Sani Bheri Rural Municipality', 'Tribeni Rural Municipality', 'Putha Uttarganga Rural Municipality'],
  'Rukum West': ['Musikot Municipality', 'Banphikot Rural Municipality', 'Mugum Karmarong Rural Municipality', 'Sani Martadi Rural Municipality', 'Alae Rural Municipality'],
  'Rupandehi': ['Bharatpur Metropolitan', 'Butwal Sub-Metropolitan', 'Devdaha Municipality', 'Kanchan Rural Municipality', 'Lumbini Sanskritik Municipality', 'Sainamaina Municipality', 'Siddharthanagar Municipality', 'Tilottama Municipality'],
  'Salyan': ['Salyan Municipality', 'Bagchaur Municipality', 'Sharada Municipality', 'Kapurkot Rural Municipality', 'Darma Rural Municipality', 'Tribeni Rural Municipality', 'Shirsha Rural Municipality'],
  'Sankhuwasabha': ['Khandbari Municipality', 'Chainpur Municipality', 'Dharan Sub-Metropolitan', 'Bhotkhola Rural Municipality', 'Madi Rural Municipality', 'Panchkhapan Rural Municipality', 'Savapokhari Rural Municipality', 'Silichong Rural Municipality'],
  'Saptari': ['Rajbiraj Sub-Metropolitan', 'Kanchanrup Municipality', 'Hanumannagar Kankalini Municipality', 'Saptakoshi Municipality', 'Tilathi Koiladi Rural Municipality', 'Bodebarsain Municipality', 'Khadak Municipality', 'Shambhunath Municipality', 'Surunga Municipality'],
  'Sarlahi': ['Malangwa Municipality', 'Haripur Municipality', 'Barahathwa Municipality', 'Kabilasi Municipality', 'Basbariya Rural Municipality', 'Bishnu Rural Municipality', 'Lalbandi Municipality', 'Parsa Rural Municipality', 'Shivpuri Rural Municipality'],
  'Sindhuli': ['Kamalamai Municipality', 'Sunkoshi Rural Municipality', 'Golanjor Rural Municipality', 'Marin Rural Municipality', 'Ghyanglekh Rural Municipality', 'Hariharpurgadhi Rural Municipality'],
  'Sindhupalchok': ['Chautara Sangachokgadhi Municipality', 'Bhotekoshi Rural Municipality', 'Barhabise Municipality', 'Indrawati Rural Municipality', 'Jugal Rural Municipality', 'Helambu Rural Municipality', 'Lisankhu Pakhar Rural Municipality', 'Sunkoshi Rural Municipality'],
  'Siraha': ['Lahan Municipality', 'Dhangadhimai Municipality', 'Golbazar Municipality', 'Mirchaiya Municipality', 'Sakhuwanankarkatti Rural Municipality', 'Arnama Rural Municipality', 'Kalyanpur Rural Municipality', 'Aurahi Rural Municipality'],
  'Solukhumbu': ['Solu Dudhkunda Municipality', 'Nechasalyan Rural Municipality', 'Khumbu Pasanglhamu Rural Municipality', 'Mahalaxmi Rural Municipality', 'Thulung Dudhkoshi Rural Municipality'],
  'Sunsari': ['Dharan Sub-Metropolitan', 'Inaruwa', 'Duhabi', 'Itahari Sub-Metropolitan', 'Ramdhuni', 'Barahachhetra', 'Koshi', 'Gadhi', 'Barju', 'Bhokraha Narsingh', 'Harinagara', 'Dewanganj'],
  'Surkhet': ['Birendranagar Municipality', 'Bheriganga', 'Gurbhakot', 'Panchapuri', 'Lekbeshi', 'Chaukune', 'Barahatal', 'Chingad', 'Simta'],
  'Syangja': ['Putalibazar Municipality', 'Waling Municipality', 'Phedikhola Rural Municipality', 'Aandhikhola Rural Municipality', 'Arjunchaupari Rural Municipality', 'Chapakot Rural Municipality', 'Harinas Rural Municipality'],
  'Tanahu': ['Damauli Municipality', 'Byas Municipality', 'Shuklagandaki Municipality', 'Bhanu Municipality', 'Myagde Rural Municipality', 'Rishing Rural Municipality', 'Ghiring Rural Municipality'],
  'Taplejung': ['Phungling Municipality', 'Mikwakhola Rural Municipality', 'Sidingwa Rural Municipality', 'Meringden Rural Municipality', 'Aathrai Rural Municipality', 'Pathibhara Yangwarak Rural Municipality'],
  'Terhathum': ['Myanglung Municipality', 'Phedap Rural Municipality', 'Menchayam Rural Municipality', 'Aiselukharka Rural Municipality', 'Laligurans Rural Municipality'],
  'Udayapur': ['Gaighat Municipality', 'Belaka Municipality', 'Chaudandigadhi Municipality', 'Katari Municipality', 'Rautamai Rural Municipality', 'Sunkoshi Rural Municipality', 'Tapli Rural Municipality', 'Limchungbung Rural Municipality'],
  // Add more districts as needed...
  // For districts not listed, show a generic message or empty array
};

// Helper to get municipalities for a district
const getMunicipalities = (district) => {
  return districtMunicipalities[district] || [];
};

export default function Register() {
  const { t } = useTranslation();
  const { setUser } = useAuth();
  const nav = useNavigate();
  
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('BUYER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  
  // ✅ New states for phone and location
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  
  const [mapPosition, setMapPosition] = useState([28.3949, 84.1240]); // Default to Nepal
  const [err, setErr] = useState('');

  // ✅ Filter municipalities when district changes
  const municipalities = useMemo(() => {
    return getMunicipalities(district);
  }, [district]);

  // Reset municipality when district changes
  const handleDistrictChange = (e) => {
    setDistrict(e.target.value);
    setMunicipality(''); // Reset municipality when district changes
  };

  const handleLocationSelect = (latlng) => {
    setLatitude(latlng.lat);
    setLongitude(latlng.lng);
    setMapPosition([latlng.lat, latlng.lng]);
    
    // Optional: Reverse geocoding to get address (using OpenStreetMap Nominatim)
    fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}&accept-language=en`)
      .then(res => res.json())
      .then(data => {
        if (data?.display_name) {
          setAddress(data.display_name);
        }
      })
      .catch(() => {
        // Silently fail if geocoding doesn't work
      });
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    // ✅ Frontend validation (matches typical backend rules)
    if (!password || password.length < 6) {
      setErr('Password must be at least 6 characters.');
      return;
    }

    try {
      const payload = {
        fullName,
        role,
        email,
        password,
        district,
        municipality,
        // ✅ Include new fields
        phone,
        address,
        latitude,
        longitude,
        language: localStorage.getItem('lang') || 'en',
      };

      const { data } = await api.post('/api/auth/register', payload);

      if (data.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        if (data.user.role === 'FARMER') nav('/farmer');
        else nav('/market');
      } else {
        setErr(data?.error || data?.message || 'Register failed');
      }
    } catch (e2) {
      const resp = e2?.response?.data;

      // ✅ Clean error extraction (handles express-validator style errors[])
      let msg =
        resp?.error ||
        resp?.message ||
        resp?.details ||
        null;

      if (!msg && Array.isArray(resp?.errors) && resp.errors.length > 0) {
        // if password invalid etc.
        msg = resp.errors.map(er => `${er.path}: ${er.msg}`).join(', ');
      }

      if (!msg) msg = e2?.message || 'Register failed';

      console.log('REGISTER ERROR:', e2?.response?.status, resp);
      setErr(msg);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      background: 'linear-gradient(135deg, #4a7c3b 0%, #6b9c5a 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Add responsive styles */}
      <style>{`
        @media (max-width: 968px) {
          .welcome-section {
            display: none !important;
          }
          .form-section {
            width: 100% !important;
            max-width: 100% !important;
          }
        }
        @media (max-width: 640px) {
          .form-container {
            padding: 40px 24px !important;
          }
          .role-buttons {
            flex-direction: column !important;
          }
          .role-buttons button {
            width: 100% !important;
          }
          .form-row {
            flex-direction: column !important;
          }
          .form-row > div {
            width: 100% !important;
          }
        }
        /* Map container styles */
        .map-container {
          border-radius: 8px;
          overflow: hidden;
          border: 1px solid #e0e0e0;
          margin-bottom: 12px;
        }
        .map-instructions {
          font-size: 12px;
          color: #666;
          margin-bottom: 8px;
        }
        .selected-location {
          background: #f5f5f5;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 13px;
          margin-top: 8px;
        }
        .location-coords {
          font-family: monospace;
          color: #4a7c3b;
          font-size: 12px;
        }
        /* Dropdown styles */
        select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e0e0e0;
          border-radius: 8px;
          fontSize: 14px;
          outline: none;
          transition: border 0.2s;
          box-sizing: border-box;
          background: white;
          cursor: pointer;
        }
        select:focus {
          border-color: #4a7c3b;
        }
        select:disabled {
          background: #f5f5f5;
          cursor: not-allowed;
        }
      `}</style>

      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '10%',
        left: '5%',
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        top: '60%',
        left: '15%',
        width: '40px',
        height: '40px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.4
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '8%',
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        opacity: 0.6
      }}></div>
      <div style={{
        position: 'absolute',
        top: '30%',
        right: '10%',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
        opacity: 0.5
      }}></div>
      <div style={{
        position: 'absolute',
        bottom: '40%',
        right: '5%',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.08)',
        opacity: 0.4
      }}></div>

      {/* Left side - Welcome section */}
      <div className="welcome-section" style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '40px',
        color: 'white',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '400px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            margin: '0 auto 30px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '40px'
          }}>
            🌾
          </div>

          <h1 style={{
            fontSize: '42px',
            fontWeight: '700',
            marginBottom: '20px',
            lineHeight: '1.2'
          }}>
            Join Krishi Connect
          </h1>

          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            opacity: 0.95,
            fontWeight: '400'
          }}>
            Start your journey with us today. Connect with markets, grow your business, and be part of the agricultural revolution.
          </p>
        </div>
      </div>

      {/* Right side - Register form */}
      <div className="form-section" style={{
        width: '550px',
        maxWidth: '100%',
        background: 'white',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.1)',
        overflowY: 'auto'
      }}>
        <div style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          zIndex: 10
        }}>
          <select style={{
            padding: '6px 12px',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            fontSize: '14px',
            cursor: 'pointer',
            background: 'white'
          }}>
            <option>नेपाली</option>
          </select>
        </div>

        <div className="form-container" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 50px',
          minHeight: '100vh'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '30px'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              background: '#4a7c3b',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              K
            </div>
            <h2 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#333',
              margin: 0
            }}>
              Krishi Connect
            </h2>
          </div>

          <h1 style={{
            fontSize: '28px',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '8px'
          }}>
            Create Your Account
          </h1>

          <p style={{
            fontSize: '14px',
            color: '#666',
            marginBottom: '30px'
          }}>
            Fill in your details to get started
          </p>

          <div className="role-buttons" style={{
            display: 'flex',
            gap: '10px',
            marginBottom: '24px'
          }}>
            <button
              type="button"
              onClick={() => setRole('BUYER')}
              style={{
                flex: 1,
                padding: '12px',
                border: role === 'BUYER' ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                borderRadius: '8px',
                background: role === 'BUYER' ? '#e8f5e9' : 'white',
                color: role === 'BUYER' ? '#4a7c3b' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              🛒 {t('buyer')}
            </button>
            <button
              type="button"
              onClick={() => setRole('FARMER')}
              style={{
                flex: 1,
                padding: '12px',
                border: role === 'FARMER' ? '2px solid #4a7c3b' : '1px solid #e0e0e0',
                borderRadius: '8px',
                background: role === 'FARMER' ? '#e8f5e9' : 'white',
                color: role === 'FARMER' ? '#4a7c3b' : '#666',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.2s'
              }}
            >
              🚜 {t('farmer')}
            </button>
          </div>

          {err && (
            <div style={{
              padding: '12px',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              color: '#c62828',
              fontSize: '14px',
              marginBottom: '20px',
              whiteSpace: 'pre-wrap'
            }}>
              {err}
            </div>
          )}

          <form onSubmit={submit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                {t('fullName')}
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            <div className="form-row" style={{
              display: 'flex',
              gap: '16px',
              marginBottom: '20px'
            }}>
              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('email')}
                </label>
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333',
                  marginBottom: '8px'
                }}>
                  {t('password')}
                </label>
                <input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
              </div>
            </div>

            {/* ✅ New Phone Input Field */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'border 0.2s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
              />
            </div>

            {/* ✅ District Dropdown */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                {t('district')}
              </label>
              <select
                value={district}
                onChange={handleDistrictChange}
                required
              >
                <option value="">Select District</option>
                {nepalDistricts.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            {/* ✅ Municipality Dropdown (filtered by district) */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                {t('municipality')}
              </label>
              <select
                value={municipality}
                onChange={(e) => setMunicipality(e.target.value)}
                required
                disabled={!district || municipalities.length === 0}
              >
                <option value="">
                  {!district ? 'Select District First' : 
                   municipalities.length === 0 ? 'Municipalities not available' : 
                   'Select Municipality'}
                </option>
                {municipalities.map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              {district && municipalities.length === 0 && (
                <p style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                  💡 Type municipality manually if not listed
                </p>
              )}
            </div>

            {/* ✅ Map Integration Section */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#333',
                marginBottom: '8px'
              }}>
                Select Your Location
              </label>
              <p className="map-instructions">Click on the map to set your location</p>
              
              <div className="map-container">
                <MapContainer
                  center={mapPosition}
                  zoom={7}
                  scrollWheelZoom={true}
                  style={{ height: '200px', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  <LocationPicker onLocationSelect={handleLocationSelect} />
                  {latitude && longitude && <Marker position={[latitude, longitude]} />}
                </MapContainer>
              </div>
              
              {(latitude && longitude) && (
                <div className="selected-location">
                  <div>📍 Location selected</div>
                  <div className="location-coords">
                    Lat: {latitude.toFixed(6)}, Lng: {longitude.toFixed(6)}
                  </div>
                  {address && <div style={{marginTop: '4px', color: '#555'}}>📬 {address}</div>}
                </div>
              )}
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '14px',
                background: '#4a7c3b',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
              onMouseOver={(e) => e.target.style.background = '#3d6630'}
              onMouseOut={(e) => e.target.style.background = '#4a7c3b'}
            >
              {t('register')}
            </button>
          </form>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            margin: '24px 0',
            gap: '12px'
          }}>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
            <span style={{ fontSize: '14px', color: '#999' }}>or</span>
            <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
          </div>

          <p style={{
            textAlign: 'center',
            fontSize: '14px',
            color: '#666',
            margin: 0
          }}>
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                color: '#4a7c3b',
                textDecoration: 'none',
                fontWeight: '600'
              }}
            >
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}