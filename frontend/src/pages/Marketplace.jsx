import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { api } from '../lib/api';
import { useAuth } from '../lib/auth';

// ── Nepal Districts → Municipalities ──
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

// ── Scroll Reveal ──
function Reveal({ children, delay = 0, direction = 'up' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const transforms = { up: 'translateY(32px)', left: 'translateX(-24px)', right: 'translateX(24px)' };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'none' : transforms[direction],
      transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(.22,1,.36,1) ${delay}ms`,
    }}>{children}</div>
  );
}

const CATEGORY_COLORS = {
  vegetables: { bg: '#e8f5e9', color: '#2d5a1b' },
  fruits:     { bg: '#fff3e0', color: '#b45309' },
  grains:     { bg: '#fef9c3', color: '#92400e' },
  other:      { bg: '#f3e8ff', color: '#6b21a8' },
  default:    { bg: '#f0f4f0', color: '#4a7c3b' },
};

// ── Crop Card ──
function CropCard({ c, titleKey, BACKEND_URL, user, onOrder, index, t }) {
  const [hovered, setHovered] = useState(false);
  const [imgErr, setImgErr] = useState(false);

  const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
  const inStock = c.inStock ?? availableQty > 0;

  const rawImages = c.images;
  let firstImage = null;
  if (Array.isArray(rawImages) && rawImages.length > 0) {
    firstImage = rawImages[0];
  } else if (typeof rawImages === 'string' && rawImages.trim()) {
    const s = rawImages.trim();
    if (s.startsWith('[')) { try { const a = JSON.parse(s); if (a.length) firstImage = a[0]; } catch {} }
    if (!firstImage && s.includes(',')) firstImage = s.split(',')[0].trim();
    if (!firstImage) firstImage = s;
  }
  const imageUrl = firstImage
    ? firstImage.startsWith('http') ? firstImage : `${BACKEND_URL}${firstImage.startsWith('/') ? '' : '/'}${firstImage}`
    : null;

  const cat = c.category?.toLowerCase() || 'default';
  const catStyle = CATEGORY_COLORS[cat] || CATEGORY_COLORS.default;

  return (
    <Reveal delay={index * 60} direction="up">
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          background: 'white',
          borderRadius: 20,
          overflow: 'hidden',
          border: `1.5px solid ${hovered ? '#a8d59a' : '#e4ece2'}`,
          boxShadow: hovered ? '0 20px 48px rgba(74,124,59,0.14)' : '0 2px 12px rgba(0,0,0,0.05)',
          transition: 'all 0.35s cubic-bezier(.22,1,.36,1)',
          transform: hovered ? 'translateY(-6px)' : 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Image */}
        <div style={{
          width: '100%', height: 200,
          background: 'linear-gradient(135deg, #e8f0e4 0%, #d4e8cc 100%)',
          position: 'relative', overflow: 'hidden', flexShrink: 0,
        }}>
          {imageUrl && !imgErr ? (
            <img src={imageUrl} alt={c[titleKey]}
              onError={() => setImgErr(true)}
              style={{
                width: '100%', height: '100%', objectFit: 'cover',
                transition: 'transform 0.5s cubic-bezier(.22,1,.36,1)',
                transform: hovered ? 'scale(1.07)' : 'scale(1)',
              }}
            />
          ) : (
            <div style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 64, opacity: 0.4,
            }}>
              {cat === 'vegetables' ? '🥬' : cat === 'fruits' ? '🍎' : cat === 'grains' ? '🌾' : '🌿'}
            </div>
          )}

          {!inStock && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.42)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{
                background: '#991b1b', color: 'white',
                padding: '6px 16px', borderRadius: 30,
                fontSize: 13, fontWeight: 700, letterSpacing: '0.06em',
              }}>{t('mktOutOfStock')}</span>
            </div>
          )}

          {c.farmer?.isVerified && (
            <div style={{
              position: 'absolute', top: 12, right: 12,
              background: 'rgba(255,255,255,0.92)',
              backdropFilter: 'blur(6px)',
              borderRadius: 20, padding: '4px 10px',
              fontSize: 12, fontWeight: 700, color: '#1e40af',
              display: 'flex', alignItems: 'center', gap: 4,
            }}>{t('mktVerified')}</div>
          )}

          <div style={{
            position: 'absolute', top: 12, left: 12,
            background: catStyle.bg,
            borderRadius: 20, padding: '4px 12px',
            fontSize: 12, fontWeight: 600, color: catStyle.color,
          }}>{c.category}</div>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 22px', flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 20, fontWeight: 700, color: '#1c2e0f',
              margin: '0 0 6px', lineHeight: 1.3,
            }}>{c[titleKey]}</h3>
            <div style={{ fontSize: 13, color: '#7a8c6e', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span>📍</span>
              <span>{[
  t(`districts.${c.district}`) || c.district,
  t(`municipalities.${c.municipality}`) || c.municipality
].filter(Boolean).join(', ')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 22, fontWeight: 900, color: '#2d5a1b',
            }}>रु {c.price}<span style={{ fontSize: 13, fontWeight: 500, color: '#7a8c6e' }}>/{c.unit}</span></span>
            <span style={{
              background: '#f0f7ee', color: '#4a7c3b',
              borderRadius: 20, padding: '3px 12px',
              fontSize: 12, fontWeight: 600,
            }}>{t('mktQty')}: {availableQty}</span>
          </div>

          {c.farmer && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: 'linear-gradient(135deg, #4a7c3b, #8bc34a)',
                color: 'white', display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0,
              }}>{c.farmer.fullName?.[0]?.toUpperCase() || 'F'}</div>
              <span style={{ fontSize: 13, color: '#5a6b51' }}>
                {t('mktBy')} {c.farmer.fullName || t('mktFarmerFallback')}
              </span>
            </div>
          )}

          <div style={{ flex: 1 }} />

          <div style={{ display: 'flex', gap: 10, paddingTop: 4 }}>
            <Link to={`/product/${c.id}`} style={{
              flex: 1, textAlign: 'center',
              padding: '10px 0',
              border: '1.5px solid #4a7c3b',
              borderRadius: 40, fontSize: 13, fontWeight: 600,
              color: '#4a7c3b', textDecoration: 'none',
              background: 'white',
              transition: 'all 0.2s',
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#f0faf0'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; }}
            >{t('mktViewDetails')}</Link>

            {user?.role === 'BUYER' && (
              inStock ? (
                <button onClick={() => onOrder(c)} style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'linear-gradient(135deg, #4a7c3b, #6b9c5a)',
                  color: 'white', border: 'none',
                  borderRadius: 40, fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', transition: 'all 0.2s',
                  boxShadow: '0 4px 12px rgba(74,124,59,0.3)',
                }}
                onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,124,59,0.4)'; }}
                onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(74,124,59,0.3)'; }}
                >{t('mktOrderBtn')}</button>
              ) : (
                <div style={{
                  flex: 1, padding: '10px 0', textAlign: 'center',
                  background: '#f3f4f6', color: '#9ca3af',
                  borderRadius: 40, fontSize: 13, fontWeight: 600,
                  cursor: 'not-allowed',
                }}>{t('mktUnavailable')}</div>
              )
            )}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ══════════════════════════════════════
//   MAIN MARKETPLACE
// ══════════════════════════════════════
export default function Marketplace() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const nav = useNavigate();

  const [crops, setCrops] = useState([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [district, setDistrict] = useState('');
  const [municipality, setMunicipality] = useState('');
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
  const sortedDistricts = Object.keys(NEPAL_DATA).sort();
  const availableMunicipalities = district ? NEPAL_DATA[district] || [] : [];

  // Category pills built with translated labels
  const CATEGORIES = [
    { value: '', label: t('mktCatAll'), icon: '🌿' },
    { value: 'vegetables', label: t('mktCatVegetables'), icon: '🥬' },
    { value: 'fruits', label: t('mktCatFruits'), icon: '🍎' },
    { value: 'grains', label: t('mktCatGrains'), icon: '🌾' },
    { value: 'other', label: t('mktCatOther'), icon: '🪴' },
  ];

  const fetchCrops = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/api/crops', { params: { q, category, district, municipality } });
      if (data.ok) setCrops(data.crops);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
    setTimeout(() => setLoaded(true), 80);
  }, []);

  const titleKey = i18n.language === 'np' ? 'titleNp' : 'titleEn';

  const addToCartAndCheckout = (c) => {
    const availableQty = c.availableQty ?? c.inventory?.available ?? c.quantity ?? 0;
    if (availableQty <= 0) return;
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem('cart') || '[]'); if (!Array.isArray(cart)) cart = []; } catch { cart = []; }
    const existing = cart.find(x => x.cropId === c.id);
    if (existing) { existing.quantity = Math.min(Number(existing.quantity || 1) + 1, Number(availableQty)); }
    else { cart.push({ cropId: c.id, title: c.titleEn || c.titleNp, titleEn: c.titleEn, titleNp: c.titleNp, price: c.price, unitPrice: c.price, quantity: 1, unit: c.unit }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    nav('/checkout');
  };

  const hasFilters = q || category || district || municipality;

  const clearAll = () => {
    setQ(''); setCategory(''); setDistrict(''); setMunicipality('');
    setTimeout(fetchCrops, 0);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f4f7f2', fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes floatLeaf {
          0%, 100% { transform: translateY(0) rotate(-4deg); }
          50%       { transform: translateY(-16px) rotate(6deg); }
        }

        .filter-select:focus { border-color: #4a7c3b !important; outline: none; }
        .filter-input:focus  { border-color: #4a7c3b !important; outline: none; }
        .cat-pill:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(74,124,59,0.2) !important; }

        @media (max-width: 1100px) {
          .filter-row { grid-template-columns: 1fr 1fr 1fr !important; }
          .filter-search { grid-column: 1 / -1 !important; }
        }
        @media (max-width: 700px) {
          .filter-row { grid-template-columns: 1fr !important; }
          .crop-grid  { grid-template-columns: 1fr !important; }
          .hero-mkt h1 { font-size: 32px !important; }
        }
        @media (min-width: 701px) and (max-width: 1099px) {
          .crop-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* ── HERO BANNER ── */}
      <div className="hero-mkt" style={{
        background: 'linear-gradient(135deg, #1a3a0d 0%, #2d5a1b 45%, #4a7c3b 100%)',
        padding: '60px 32px 56px',
        position: 'relative', overflow: 'hidden',
      }}>
        {[
          { top: '10%', left: '4%', size: 160, dur: 8, delay: 0 },
          { bottom: '5%', right: '6%', size: 120, dur: 10, delay: 2 },
          { top: '50%', right: '18%', size: 80, dur: 7, delay: 1 },
        ].map((b, i) => (
          <div key={i} style={{
            position: 'absolute', ...b,
            width: b.size, height: b.size,
            borderRadius: '60% 40% 70% 30% / 40% 60% 30% 70%',
            background: 'rgba(139,195,74,0.15)',
            animation: `floatLeaf ${b.dur}s ease-in-out infinite`,
            animationDelay: `${b.delay}s`,
            pointerEvents: 'none',
          }} />
        ))}

        <div style={{
          position: 'absolute', top: '50%', right: '8%',
          transform: 'translateY(-50%)',
          width: 200, height: 200, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.1)',
          pointerEvents: 'none',
        }}>
          <div style={{ position: 'absolute', inset: 24, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.07)' }} />
        </div>

        <div style={{ maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.18)',
            borderRadius: 40, padding: '6px 18px',
            color: '#c8e6a0', fontSize: 12, fontWeight: 600,
            letterSpacing: '0.08em', marginBottom: 20,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.6s ease 0.1s',
          }}>
            <span>🌿</span> {t('mktHeroBadge')}
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 48, fontWeight: 900, color: 'white',
            margin: '0 0 14px', lineHeight: 1.15,
            opacity: loaded ? 1 : 0,
            transform: loaded ? 'none' : 'translateY(20px)',
            transition: 'all 0.7s cubic-bezier(.22,1,.36,1) 0.2s',
          }}>
            {t('mktHeroTitle1')}{' '}
            <span style={{
              background: 'linear-gradient(90deg, #c8e6a0, #8bc34a, #c8e6a0)',
              backgroundSize: '200% auto',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              animation: 'shimmer 3s linear infinite', fontStyle: 'italic',
            }}>{t('mktHeroTitleHighlight')}</span>
          </h1>

          <p style={{
            fontSize: 16, color: 'rgba(255,255,255,0.75)',
            margin: 0, fontWeight: 300, maxWidth: 480,
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s ease 0.35s',
          }}>
            {t('mktHeroSubtitle')}
          </p>

          <div style={{
            display: 'flex', gap: 32, marginTop: 32, flexWrap: 'wrap',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.7s ease 0.5s',
          }}>
            {[
              { icon: '🌾', label: `${crops.length} ${t('mktStat1Label')}` },
              { icon: '📍', label: t('mktStat2Label') },
              { icon: '✓',  label: t('mktStat3Label') },
            ].map((s, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 500,
              }}>
                <span style={{
                  background: 'rgba(255,255,255,0.12)', borderRadius: '50%',
                  width: 32, height: 32, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: 14,
                }}>{s.icon}</span>
                {s.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '40px 24px' }}>

        {/* ── FILTER PANEL ── */}
        <Reveal direction="up">
          <div style={{
            background: 'white',
            borderRadius: 24,
            padding: '28px 32px',
            marginBottom: 32,
            border: '1.5px solid #e4ece2',
            boxShadow: '0 4px 24px rgba(74,124,59,0.07)',
          }}>
            {/* Category Pills */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
              {CATEGORIES.map(cat => (
                <button key={cat.value} className="cat-pill"
                  onClick={() => setCategory(cat.value)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '8px 18px', borderRadius: 40,
                    border: category === cat.value ? '2px solid #4a7c3b' : '1.5px solid #d8e8d4',
                    background: category === cat.value ? '#4a7c3b' : 'white',
                    color: category === cat.value ? 'white' : '#4a7c3b',
                    fontSize: 13, fontWeight: 600, cursor: 'pointer',
                    transition: 'all 0.25s cubic-bezier(.22,1,.36,1)',
                    boxShadow: category === cat.value ? '0 4px 12px rgba(74,124,59,0.3)' : 'none',
                  }}
                >
                  <span>{cat.icon}</span>{cat.label}
                </button>
              ))}
            </div>

            {/* Inputs row */}
            <div className="filter-row" style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr',
              gap: 16, alignItems: 'end',
            }}>
              {/* Search */}
              <div className="filter-search" style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a7c3b', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {t('mktFilterSearch')}
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 16, pointerEvents: 'none' }}>🔍</span>
                  <input type="text" value={q}
                    onChange={e => setQ(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && fetchCrops()}
                    placeholder={t('mktSearchPlaceholder')}
                    className="filter-input"
                    style={{
                      width: '100%', padding: '13px 16px 13px 44px',
                      border: '1.5px solid #d8e8d4', borderRadius: 12,
                      fontSize: 14, background: '#fafcfa',
                      transition: 'border 0.2s',
                    }}
                  />
                </div>
              </div>

              {/* District */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#4a7c3b', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {t('mktFilterDistrict')}
                </label>
                <select value={district}
                  onChange={e => { setDistrict(e.target.value); setMunicipality(''); }}
                  className="filter-select"
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #d8e8d4', borderRadius: 12,
                    fontSize: 14, background: '#fafcfa', cursor: 'pointer',
                    transition: 'border 0.2s',
                  }}
                >
                  <option value="">{t('mktAllDistricts')}</option>
                  {sortedDistricts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              {/* Municipality */}
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: district ? '#4a7c3b' : '#aabba0', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  {t('mktFilterMunicipality')}
                </label>
                <select value={municipality}
                  onChange={e => setMunicipality(e.target.value)}
                  disabled={!district}
                  className="filter-select"
                  style={{
                    width: '100%', padding: '13px 16px',
                    border: '1.5px solid #d8e8d4', borderRadius: 12,
                    fontSize: 14, background: district ? '#fafcfa' : '#f5f7f4',
                    cursor: district ? 'pointer' : 'not-allowed',
                    opacity: district ? 1 : 0.55,
                    transition: 'border 0.2s',
                  }}
                >
                  <option value="">{district ? t('mktAllMunicipalities') : t('mktSelectDistrictFirst')}</option>
                  {availableMunicipalities.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </div>

            {/* Action row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, flexWrap: 'wrap', gap: 12 }}>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {hasFilters && (
                  <>
                    {q && <span style={{ background: '#e8f5e9', color: '#2d5a1b', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>"{q}"</span>}
                    {category && <span style={{ background: '#e8f5e9', color: '#2d5a1b', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{category}</span>}
                    {district && <span style={{ background: '#e8f5e9', color: '#2d5a1b', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{district}</span>}
                    {municipality && <span style={{ background: '#e8f5e9', color: '#2d5a1b', borderRadius: 20, padding: '4px 12px', fontSize: 12, fontWeight: 600 }}>{municipality}</span>}
                    <button onClick={clearAll}
                      style={{ background: 'white', border: '1.5px solid #d8e8d4', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#7a8c6e', cursor: 'pointer', fontWeight: 600 }}>
                      {t('mktClearAll')}
                    </button>
                  </>
                )}
              </div>

              <button onClick={fetchCrops} style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #4a7c3b, #6b9c5a)',
                color: 'white', border: 'none',
                borderRadius: 40, fontSize: 14, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.25s',
                boxShadow: '0 4px 16px rgba(74,124,59,0.3)',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(74,124,59,0.4)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(74,124,59,0.3)'; }}
              >
                {loading
                  ? <span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: 'white', borderRadius: '50%', display: 'inline-block', animation: 'spin 0.8s linear infinite' }} />
                  : '🔍'
                }
                {t('mktSearchBtn')}
              </button>
            </div>
          </div>
        </Reveal>

        {/* ── RESULTS HEADER ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
          <Reveal direction="left">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 28, fontWeight: 900, color: '#1c2e0f',
              }}>{crops.length}</span>
              <span style={{ fontSize: 16, color: '#7a8c6e', fontWeight: 500 }}>
                {crops.length === 1 ? t('mktCropSingular') : t('mktCropPlural')}
              </span>
            </div>
          </Reveal>
        </div>

        {/* ── CROP GRID ── */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{
              width: 48, height: 48, margin: '0 auto 20px',
              border: '3px solid #d8e8d4', borderTopColor: '#4a7c3b',
              borderRadius: '50%', animation: 'spin 0.8s linear infinite',
            }} />
            <p style={{ color: '#7a8c6e', fontSize: 15 }}>{t('mktLoadingCrops')}</p>
          </div>
        ) : crops.length > 0 ? (
          <div className="crop-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 24,
          }}>
            {crops.map((c, i) => (
              <CropCard
                key={c.id}
                c={c}
                index={i}
                titleKey={titleKey}
                BACKEND_URL={BACKEND_URL}
                user={user}
                onOrder={addToCartAndCheckout}
                t={t}
              />
            ))}
          </div>
        ) : (
          <Reveal direction="up">
            <div style={{
              background: 'white', borderRadius: 24,
              padding: '80px 40px', textAlign: 'center',
              border: '1.5px solid #e4ece2',
              boxShadow: '0 4px 24px rgba(74,124,59,0.06)',
            }}>
              <div style={{ fontSize: 72, marginBottom: 20, opacity: 0.4 }}>🌾</div>
              <h3 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 26, fontWeight: 900, color: '#1c2e0f',
                margin: '0 0 12px',
              }}>{t('mktNoCropsTitle')}</h3>
              <p style={{ fontSize: 15, color: '#7a8c6e', margin: '0 0 28px' }}>
                {t('mktNoCropsSubtitle')}
              </p>
              <button onClick={clearAll} style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #4a7c3b, #6b9c5a)',
                color: 'white', border: 'none', borderRadius: 40,
                fontSize: 14, fontWeight: 700, cursor: 'pointer',
                boxShadow: '0 4px 16px rgba(74,124,59,0.3)',
              }}>
                {t('mktClearFilters')}
              </button>
            </div>
          </Reveal>
        )}
      </div>
    </div>
  );
}