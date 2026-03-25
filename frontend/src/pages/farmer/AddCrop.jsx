import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

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
  "Palpa": ["Tansen Municipality","Rampur Municipality","Mathagadi Rural Municipality","Bagnaskali Rural Municipality","Nisdi Rural Municipality","Purbakhola Rural Municipality","Rainadevi Chhahara Rural Municipality","Ribdikot Rural Municipality","Rishing Rural Municipality","Tinau Rural Municipality"],
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

export default function AddCrop() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    titleEn:'', titleNp:'', category:'vegetables',
    descriptionEn:'', descriptionNp:'',
    qualityGrade:'A', unit:'kg', price: 0, quantity: 0,
    district:'', municipality:''
  });
  const [files, setFiles] = useState([]);
  const [err, setErr] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (k,v) => setForm(s => ({ ...s, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    
    // Client-side validation
    if (!form.titleEn || !form.titleNp) {
      setErr('Crop name in both English and Nepali is required');
      return;
    }
    if (!form.category || !form.unit) {
      setErr('Category and unit are required');
      return;
    }
    if (!form.price || Number(form.price) <= 0) {
      setErr('Price must be greater than 0');
      return;
    }
    if (!form.quantity || Number(form.quantity) <= 0) {
      setErr('Quantity must be greater than 0');
      return;
    }

    try {
      setSubmitting(true);
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      for (const f of files) fd.append('images', f);

      const { data } = await api.post('/api/crops', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      if (data.ok) nav('/farmer');
    } catch (e2) {
      setErr(e2?.response?.data?.error || 'Failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f7fa',
      padding: '24px'
    }}>
      {/* Responsive Styles */}
      <style>{`
        @media (max-width: 640px) {
          .add-crop-container {
            padding: 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row-2 {
            grid-template-columns: 1fr !important;
          }
          .form-row-3 {
            grid-template-columns: 1fr !important;
          }
          .form-actions {
            flex-direction: column-reverse !important;
          }
          .form-actions button {
            width: 100% !important;
          }
        }
      `}</style>

      <div className="add-crop-container" style={{
        maxWidth: '900px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '32px'
        }}>
          <button
            onClick={() => nav('/farmer')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 12px',
              background: 'transparent',
              color: '#666',
              border: 'none',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer',
              marginBottom: '16px',
              transition: 'background 0.2s'
            }}
            onMouseOver={(e) => e.target.style.background = '#f0f0f0'}
            onMouseOut={(e) => e.target.style.background = 'transparent'}
          >
            ← Back to Dashboard
          </button>

          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: '#1a1a1a',
            margin: 0,
            marginBottom: '8px'
          }}>
            Add New Crop
          </h1>
          <p style={{
            fontSize: '15px',
            color: '#666',
            margin: 0
          }}>
            List your crop for sale in the marketplace
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '32px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e0e0e0'
        }}>
          {/* Error Message */}
          {err && (
            <div style={{
              padding: '14px 16px',
              background: '#ffebee',
              border: '1px solid #ffcdd2',
              borderRadius: '8px',
              color: '#c62828',
              fontSize: '14px',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ⚠️ {err}
            </div>
          )}

          <form onSubmit={submit}>
            {/* Basic Information Section */}
            <div style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  🌾
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Crop Information
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Basic details about your crop
                  </div>
                </div>
              </div>

              {/* Crop Names */}
              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px',
                marginBottom: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Crop Name (English) *
                  </label>
                  <input
                    type="text"
                    value={form.titleEn}
                    onChange={(e) => set('titleEn', e.target.value)}
                    placeholder="e.g., Tomato"
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Crop Name (Nepali) *
                  </label>
                  <input
                    type="text"
                    value={form.titleNp}
                    onChange={(e) => set('titleNp', e.target.value)}
                    placeholder="e.g., टमाटर"
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
              </div>

              {/* Descriptions */}
              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Description (English)
                  </label>
                  <textarea
                    value={form.descriptionEn}
                    onChange={(e) => set('descriptionEn', e.target.value)}
                    placeholder="Describe your crop..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div>

                {/* <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Description (Nepali)
                  </label>
                  <textarea
                    value={form.descriptionNp}
                    onChange={(e) => set('descriptionNp', e.target.value)}
                    placeholder="आफ्नो बाली वर्णन गर्नुहोस्..."
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      fontFamily: 'inherit',
                      resize: 'vertical'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  />
                </div> */}
              </div>
            </div>

            {/* Categories & Specifications */}
            <div style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#fff3e0',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📋
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Categories & Specifications
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Classify and grade your crop
                  </div>
                </div>
              </div>

              <div className="form-row-3" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Category *
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="vegetables">Vegetables</option>
                    <option value="fruits">Fruits</option>
                    <option value="grains">Grains</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Quality Grade *
                  </label>
                  <select
                    value={form.qualityGrade}
                    onChange={(e) => set('qualityGrade', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="A">Grade A</option>
                    <option value="B">Grade B</option>
                    <option value="C">Grade C</option>
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Unit *
                  </label>
                  <select
                    value={form.unit}
                    onChange={(e) => set('unit', e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="kg">Kilogram (kg)</option>
                    <option value="quintal">Quintal</option>
                    <option value="piece">Piece</option>
                    <option value="dozen">Dozen</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Pricing & Quantity */}
            <div style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#e8f5e9',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  💰
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Pricing & Quantity
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Set your price and available stock
                  </div>
                </div>
              </div>

              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Price (रु) *
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="e.g., 100"
                    required
                    min="1"
                    step="0.01"
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

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Available Quantity *
                  </label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => set('quantity', e.target.value)}
                    placeholder="e.g., 500"
                    required
                    min="1"
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
            </div>

            {/* Location */}
            <div style={{
              marginBottom: '32px',
              paddingBottom: '24px',
              borderBottom: '1px solid #f0f0f0'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#e3f2fd',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📍
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Location
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Where is your crop located?
                  </div>
                </div>
              </div>

              <div className="form-row-2" style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '16px'
              }}>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    District
                  </label>
                  <select
                    value={form.district}
                    onChange={(e) => {
                      set('district', e.target.value);
                      set('municipality', '');
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
                      background: 'white',
                      cursor: 'pointer'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">Select District</option>
                    {Object.keys(NEPAL_DATA).map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#333',
                    marginBottom: '8px'
                  }}>
                    Municipality
                  </label>
                  <select
                    value={form.municipality}
                    onChange={(e) => set('municipality', e.target.value)}
                    disabled={!form.district}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #e0e0e0',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none',
                      transition: 'border 0.2s',
                      boxSizing: 'border-box',
                      background: 'white',
                      cursor: form.district ? 'pointer' : 'not-allowed',
                      opacity: form.district ? 1 : 0.6
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                    onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                  >
                    <option value="">Select Municipality</option>
                    {form.district && NEPAL_DATA[form.district] && NEPAL_DATA[form.district].map((m) => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Images */}
            <div style={{ marginBottom: '32px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                marginBottom: '20px'
              }}>
                <div style={{
                  width: '36px',
                  height: '36px',
                  background: '#f3e5f5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '18px'
                }}>
                  📸
                </div>
                <div>
                  <div style={{
                    fontSize: '16px',
                    fontWeight: '600',
                    color: '#1a1a1a'
                  }}>
                    Product Images
                  </div>
                  <div style={{
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    Upload up to 5 images of your crop
                  </div>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(Array.from(e.target.files || []))}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px dashed #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'border 0.2s',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    background: '#f9fafb'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#4a7c3b'}
                  onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                />
                {files.length > 0 && (
                  <div style={{
                    marginTop: '12px',
                    fontSize: '13px',
                    color: '#4a7c3b',
                    fontWeight: '500'
                  }}>
                    ✓ {files.length} image{files.length !== 1 ? 's' : ''} selected
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions" style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end'
            }}>
              <button
                type="button"
                onClick={() => nav('/farmer')}
                disabled={submitting}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#666',
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s',
                  opacity: submitting ? 0.5 : 1
                }}
                onMouseOver={(e) => {
                  if (!submitting) e.target.style.background = '#f0f0f0';
                }}
                onMouseOut={(e) => {
                  if (!submitting) e.target.style.background = 'white';
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: '12px 32px',
                  background: submitting ? '#a5d6a7' : '#4a7c3b',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  transition: 'background 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                onMouseOver={(e) => {
                  if (!submitting) e.target.style.background = '#3d6630';
                }}
                onMouseOut={(e) => {
                  if (!submitting) e.target.style.background = '#4a7c3b';
                }}
              >
                {submitting ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255,255,255,0.3)',
                      borderTopColor: 'white',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}></div>
                    Saving...
                  </>
                ) : (
                  <>✓ Add Crop</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}