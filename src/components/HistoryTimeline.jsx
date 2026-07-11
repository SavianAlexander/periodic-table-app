import React, { useState, useMemo } from 'react';
import elements from '../data/elements.json';

// Element positions in standard 18-column grid layout
const GRID_POSITIONS = {
  H: { r: 1, c: 1 }, He: { r: 1, c: 18 },
  Li: { r: 2, c: 1 }, Be: { r: 2, c: 2 }, B: { r: 2, c: 13 }, C: { r: 2, c: 14 }, N: { r: 2, c: 15 }, O: { r: 2, c: 16 }, F: { r: 2, c: 17 }, Ne: { r: 2, c: 18 },
  Na: { r: 3, c: 1 }, Mg: { r: 3, c: 2 }, Al: { r: 3, c: 13 }, Si: { r: 3, c: 14 }, P: { r: 3, c: 15 }, S: { r: 3, c: 16 }, Cl: { r: 3, c: 17 }, Ar: { r: 3, c: 18 },
  K: { r: 4, c: 1 }, Ca: { r: 4, c: 2 }, Sc: { r: 4, c: 3 }, Ti: { r: 4, c: 4 }, V: { r: 4, c: 5 }, Cr: { r: 4, c: 6 }, Mn: { r: 4, c: 7 }, Fe: { r: 4, c: 8 }, Co: { r: 4, c: 9 }, Ni: { r: 4, c: 10 }, Cu: { r: 4, c: 11 }, Zn: { r: 4, c: 12 }, Ga: { r: 4, c: 13 }, Ge: { r: 4, c: 14 }, As: { r: 4, c: 15 }, Se: { r: 4, c: 16 }, Br: { r: 4, c: 17 }, Kr: { r: 4, c: 18 },
  Rb: { r: 5, c: 1 }, Sr: { r: 5, c: 2 }, Y: { r: 5, c: 3 }, Zr: { r: 5, c: 4 }, Nb: { r: 5, c: 5 }, Mo: { r: 5, c: 6 }, Tc: { r: 5, c: 7 }, Ru: { r: 5, c: 8 }, Rh: { r: 5, c: 9 }, Pd: { r: 5, c: 10 }, Ag: { r: 5, c: 11 }, Cd: { r: 5, c: 12 }, In: { r: 5, c: 13 }, Sn: { r: 5, c: 14 }, Sb: { r: 5, c: 15 }, Te: { r: 5, c: 16 }, I: { r: 5, c: 17 }, Xe: { r: 5, c: 18 },
  Cs: { r: 6, c: 1 }, Ba: { r: 6, c: 2 }, La: { r: 8, c: 3 }, Hf: { r: 6, c: 4 }, Ta: { r: 6, c: 5 }, W: { r: 6, c: 6 }, Re: { r: 6, c: 7 }, Os: { r: 6, c: 8 }, Ir: { r: 6, c: 9 }, Pt: { r: 6, c: 10 }, Au: { r: 6, c: 11 }, Hg: { r: 6, c: 12 }, Tl: { r: 6, c: 13 }, Pb: { r: 6, c: 14 }, Bi: { r: 6, c: 15 }, Po: { r: 6, c: 16 }, At: { r: 6, c: 17 }, Rn: { r: 6, c: 18 },
  Fr: { r: 7, c: 1 }, Ra: { r: 7, c: 2 }, Ac: { r: 9, c: 3 }, Rf: { r: 7, c: 4 }, Db: { r: 7, c: 5 }, Sg: { r: 7, c: 6 }, Bh: { r: 7, c: 7 }, Hs: { r: 7, c: 8 }, Mt: { r: 7, c: 9 }, Ds: { r: 7, c: 10 }, Rg: { r: 7, c: 11 }, Cn: { r: 7, c: 12 }, Nh: { r: 7, c: 13 }, Fl: { r: 7, c: 14 }, Mc: { r: 7, c: 15 }, Lv: { r: 7, c: 16 }, Ts: { r: 7, c: 17 }, Og: { r: 7, c: 18 },
  // Lanthanides
  Ce: { r: 8, c: 4 }, Pr: { r: 8, c: 5 }, Nd: { r: 8, c: 6 }, Pm: { r: 8, c: 7 }, Sm: { r: 8, c: 8 }, Eu: { r: 8, c: 9 }, Gd: { r: 8, c: 10 }, Tb: { r: 8, c: 11 }, Dy: { r: 8, c: 12 }, Ho: { r: 8, c: 13 }, Er: { r: 8, c: 14 }, Tm: { r: 8, c: 15 }, Yb: { r: 8, c: 16 }, Lu: { r: 8, c: 17 },
  // Actinides
  Th: { r: 9, c: 4 }, Pa: { r: 9, c: 5 }, U: { r: 9, c: 6 }, Np: { r: 9, c: 7 }, Pu: { r: 9, c: 8 }, Am: { r: 9, c: 9 }, Cm: { r: 9, c: 10 }, Bk: { r: 9, c: 11 }, Cf: { r: 9, c: 12 }, Es: { r: 9, c: 13 }, Fm: { r: 9, c: 14 }, Md: { r: 9, c: 15 }, No: { r: 9, c: 16 }, Lr: { r: 9, c: 17 }
};

// Mapping of discoverers to countries/hubs
const resolveCountry = (discoverer, symbol) => {
  if (!discoverer || discoverer === 'Antiquity' || ['C', 'S', 'Fe', 'Cu', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Sb', 'Bi', 'Zn'].includes(symbol)) {
    return 'Antiquity';
  }
  const name = discoverer.toLowerCase();
  if (name.includes('cavendish') || name.includes('ramsay') || name.includes('davy') || name.includes('travers') || name.includes('rayleigh') || name.includes('priestley') || name.includes('rutherford') || name.includes('soddy') || name.includes('crookes') || name.includes('lockyer')) {
    return 'United Kingdom';
  }
  if (name.includes('scheele') || name.includes('berzelius') || name.includes('arfwedson') || name.includes('mosander') || name.includes('cleve') || name.includes('ekeberg') || name.includes('nilsson')) {
    return 'Sweden';
  }
  if (name.includes('klaproth') || name.includes('brand') || name.includes('marggraf') || name.includes('bunsen') || name.includes('kirchhoff') || name.includes('winkler') || name.includes('stromeyer') || name.includes('wöhler') || name.includes('reich') || name.includes('richter')) {
    return 'Germany';
  }
  if (name.includes('curie') || name.includes('moissan') || name.includes('gay-lussac') || name.includes('vauquelin') || name.includes('debierne') || name.includes('courtois') || name.includes('balard') || name.includes('lecoq')) {
    return 'France';
  }
  if (name.includes('seaborg') || name.includes('ghiorso') || name.includes('mcmillan') || name.includes('lawrence') || name.includes('albert ghiorso') || name.includes('berkeley')) {
    return 'United States';
  }
  if (name.includes('dubna') || name.includes('flerov') || name.includes('oganessian') || name.includes('jinr')) {
    return 'Russia';
  }
  return 'Other';
};

// Unified discovery years mapper
const getDiscoveryYear = (el) => {
  const symbol = el.symbol;
  const num = el.atomicNumber;
  
  if (['C', 'S', 'Fe', 'Cu', 'Ag', 'Au', 'Hg', 'Pb', 'Sn', 'Sb', 'Bi', 'Zn'].includes(symbol)) {
    return 1500; // Represented as Antiquity / Pre-1600 on slider
  }
  
  const overrides = {
    H: 1766, He: 1868, Li: 1817, Be: 1798, B: 1808, N: 1772, O: 1774, F: 1886, Ne: 1898, Na: 1807, Mg: 1755,
    Al: 1825, Si: 1823, P: 1669, Cl: 1774, Ar: 1894, K: 1807, Ca: 1808, Sc: 1879, Ti: 1791, V: 1801, Cr: 1797,
    Mn: 1774, Co: 1735, Ni: 1751, Ga: 1875, Ge: 1886, As: 1250, Se: 1817, Br: 1826, Kr: 1898, Rb: 1861, Sr: 1790,
    Y: 1794, Zr: 1789, Nb: 1801, Mo: 1778, Ru: 1844, Rh: 1803, Pd: 1803, Cd: 1817, In: 1863, Te: 1782, Xe: 1898,
    Cs: 1860, Ba: 1774, La: 1839, Ce: 1803, Pr: 1885, Nd: 1885, Pm: 1945, Sm: 1879, Eu: 1896, Gd: 1880, Tb: 1843,
    Dy: 1886, Ho: 1878, Er: 1843, Tm: 1879, Yb: 1878, Lu: 1907, Hf: 1923, Ta: 1802, W: 1783, Re: 1925, Os: 1803,
    Ir: 1803, Pt: 1735, Tl: 1861, Po: 1898, At: 1940, Rn: 1899, Fr: 1939, Ra: 1898, Ac: 1899, Th: 1829, Pa: 1913,
    Np: 1940, Pu: 1940, Am: 1944, Cm: 1944, Bk: 1949, Cf: 1950, Es: 1952, Fm: 1952, Md: 1955, No: 1957, Lr: 1961,
    Rf: 1964, Db: 1967, Sg: 1974, Bh: 1981, Hs: 1984, Mt: 1982, Ds: 1994, Rg: 1994, Cn: 1996, Nh: 2003, Fl: 1998,
    Mc: 2003, Lv: 2000, Ts: 2010, Og: 2002
  };

  if (overrides[symbol] !== undefined) {
    return overrides[symbol];
  }
  
  if (num >= 93) return 1940 + (num - 93) * 2;
  return 1800;
};

// Fun educational historical facts
const getDiscoveryTrivia = (el, year, country) => {
  const symbol = el.symbol;
  const name = el.name;
  const discoverer = el.discoverer || 'Antiquity';
  
  const customTrivia = {
    H: 'Hydrogen was first recognized as a distinct substance by Henry Cavendish, who called it "inflammable air" and proved it produces water when burned.',
    He: 'Helium was discovered in the solar spectrum during an eclipse in 1868 before it was ever found on Earth in 1895.',
    Li: 'Lithium was discovered in Sweden by Johan August Arfwedson while analyzing the mineral petalite in 1817.',
    O: 'Oxygen was discovered independently by Carl Wilhelm Scheele in Sweden (1772) and Joseph Priestley in England (1774), but Priestley published first.',
    P: 'Phosphorus was discovered in 1669 by German alchemist Hennig Brand, who evaporated urine while trying to create the philosopher\'s stone.',
    U: 'Uranium was discovered by Martin Heinrich Klaproth in Germany in 1789, and was named after the newly discovered planet Uranus.',
    Au: 'Gold has been valued since prehistoric times for its beautiful yellow shine, high malleability, and resistance to corrosion.',
    Fe: 'Iron has been used since antiquity. The transition from the Bronze Age to the Iron Age marked a massive leap in human toolmaking.',
    Ag: 'Silver has been mined and used as currency and jewelry for over 5000 years, prized for its high electrical conductivity and reflective shine.',
    Pb: 'Lead was used extensively by the ancient Romans for plumbing, leading some historians to theorize it contributed to lead poisoning in the Roman aristocracy.'
  };

  if (customTrivia[symbol]) return customTrivia[symbol];
  if (year <= 1500) {
    return `${name} is one of the classic elements known since antiquity. Its discovery pre-dates recorded history.`;
  }
  return `${name} was discovered in ${year} by ${discoverer} in ${country}. It remains a vital component of modern chemical and industrial processes.`;
};

// Discovery countries list
const COUNTRIES = [
  { name: 'All', label: 'All Countries' },
  { name: 'Antiquity', label: 'Antiquity / Prehistoric' },
  { name: 'United Kingdom', label: 'United Kingdom' },
  { name: 'Sweden', label: 'Sweden' },
  { name: 'Germany', label: 'Germany' },
  { name: 'France', label: 'France' },
  { name: 'United States', label: 'United States' },
  { name: 'Russia', label: 'Russia' },
  { name: 'Other', label: 'Other' }
];

export function HistoryTimeline() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedCountry, setSelectedCountry] = useState('All');
  const [selectedElement, setSelectedElement] = useState(elements[0]); // default Hydrogen

  // Resolve years and countries for all elements
  const processedElements = useMemo(() => {
    return elements.map(el => {
      const year = getDiscoveryYear(el);
      const country = resolveCountry(el.discoverer, el.symbol);
      return {
        ...el,
        discoveryYearResolved: year,
        discoveryCountryResolved: country
      };
    });
  }, []);

  // Filter elements matching active slider and country badges
  const activeElementsMap = useMemo(() => {
    const map = {};
    processedElements.forEach(el => {
      const matchesYear = el.discoveryYearResolved <= selectedYear;
      const matchesCountry = selectedCountry === 'All' || el.discoveryCountryResolved === selectedCountry;
      map[el.symbol] = matchesYear && matchesCountry;
    });
    return map;
  }, [processedElements, selectedYear, selectedCountry]);

  const activeElementCount = useMemo(() => {
    return Object.values(activeElementsMap).filter(Boolean).length;
  }, [activeElementsMap]);

  const selectedElementDetails = useMemo(() => {
    if (!selectedElement) return null;
    const year = getDiscoveryYear(selectedElement);
    const country = resolveCountry(selectedElement.discoverer, selectedElement.symbol);
    return {
      year,
      country,
      trivia: getDiscoveryTrivia(selectedElement, year, country)
    };
  }, [selectedElement]);

  const handleElementClick = (symbol) => {
    const found = processedElements.find(e => e.symbol === symbol);
    if (found) {
      setSelectedElement(found);
    }
  };

  return (
    <div className="history-timeline-container" style={{
      background: 'rgba(255, 255, 255, 0.02)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      borderRadius: '16px',
      padding: '20px',
      boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
      maxWidth: '1200px',
      margin: '20px auto',
      boxSizing: 'border-box'
    }}>
      <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem', color: '#fff' }}>Historical Discovery Timeline</h2>
      <p style={{ margin: '0 0 20px 0', fontSize: '0.9rem', opacity: 0.7 }}>
        Explore when chemical elements were discovered and locate their historical hubs across the globe.
      </p>

      {/* Slider Controls */}
      <div style={{
        background: 'rgba(0,0,0,0.2)',
        padding: '16px 20px',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.05)',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.9rem' }}>
          <span>Discovery Year: <strong>{selectedYear <= 1500 ? 'Antiquity / Pre-1700' : selectedYear}</strong></span>
          <span style={{ color: '#00f2fe' }}>Elements Discovered: <strong>{activeElementCount} / 118</strong></span>
        </div>
        <input 
          type="range" 
          min="1500" 
          max="2026" 
          step="1"
          value={selectedYear} 
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          style={{
            width: '100%',
            height: '6px',
            background: '#2c3e50',
            borderRadius: '3px',
            outline: 'none',
            WebkitAppearance: 'none',
            cursor: 'pointer'
          }}
          className="timeline-range-slider"
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', opacity: 0.5, marginTop: '4px' }}>
          <span>Antiquity</span>
          <span>1750</span>
          <span>1800</span>
          <span>1850</span>
          <span>1900</span>
          <span>1950</span>
          <span>2000</span>
          <span>Present</span>
        </div>
      </div>

      {/* Country Filters Map Overlay */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        {COUNTRIES.map((c) => (
          <button
            key={c.name}
            onClick={() => setSelectedCountry(c.name)}
            style={{
              background: selectedCountry === c.name ? '#00f2fe' : 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: selectedCountry === c.name ? '#000' : '#fff',
              padding: '6px 12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontWeight: '600',
              transition: 'all 0.15s ease'
            }}
            className={`country-filter-btn ${selectedCountry === c.name ? 'active' : ''}`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 320px',
        gap: '20px',
        alignItems: 'start'
      }} className="history-content-layout">
        
        {/* Left Hand: Compact Mini Grid */}
        <div style={{ overflowX: 'auto' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(18, minmax(28px, 1fr))',
            gap: '3px',
            minWidth: '540px'
          }}>
            {elements.map((el) => {
              const pos = GRID_POSITIONS[el.symbol];
              if (!pos) return null;
              
              const isActive = activeElementsMap[el.symbol];
              const isSelected = selectedElement?.symbol === el.symbol;

              // Color based on block category
              const blockColors = {
                'Nonmetal': '#ff4757',
                'Noble Gas': '#ffa502',
                'Alkali Metal': '#2ed573',
                'Alkaline Earth Metal': '#eccc68',
                'Metalloid': '#1e90ff',
                'Transition Metal': '#747d8c',
                'Post-Transition Metal': '#a4b0be',
                'Lanthanide': '#ff6b81',
                'Actinide': '#70a1ff',
                'Reactive Nonmetal': '#ff4757'
              };
              const bg = blockColors[el.groupBlock] || 'rgba(255,255,255,0.15)';

              return (
                <div
                  key={el.symbol}
                  onClick={() => handleElementClick(el.symbol)}
                  style={{
                    gridRow: pos.r,
                    gridColumn: pos.c,
                    background: isActive ? bg : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '2px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.05)',
                    color: isActive ? '#fff' : 'rgba(255, 255, 255, 0.15)',
                    height: '34px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    transition: 'all 0.15s ease',
                    opacity: isActive ? 1 : 0.25,
                    transform: isSelected ? 'scale(1.1)' : 'none',
                    zIndex: isSelected ? 10 : 1
                  }}
                  className={`mini-grid-cell ${isSelected ? 'selected' : ''}`}
                  title={`${el.name} (${el.symbol})`}
                >
                  <span style={{ fontSize: '0.5rem', opacity: 0.7 }}>{el.atomicNumber}</span>
                  <span>{el.symbol}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Hand: Detailed discovery card */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '12px',
          padding: '16px',
          color: '#fff',
          boxSizing: 'border-box'
        }} className="history-details-card">
          {selectedElementDetails ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{
                  background: '#00f2fe',
                  color: '#000',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 'bold'
                }}>No. {selectedElement.atomicNumber}</span>
                <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{selectedElement.groupBlock}</span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem' }}>{selectedElement.name} ({selectedElement.symbol})</h3>
              <p style={{ margin: '0 0 12px 0', fontSize: '0.8rem', opacity: 0.7 }}>
                Discovery Location: <strong style={{ color: '#00f2fe' }}>{selectedElementDetails.country}</strong>
              </p>

              <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '12px 0' }} />

              <div style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ opacity: 0.6 }}>Discovery Year:</span>{' '}
                  <strong>{selectedElementDetails.year <= 1500 ? 'Antiquity' : selectedElementDetails.year}</strong>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <span style={{ opacity: 0.6 }}>Discoverer:</span>{' '}
                  <strong>{selectedElement.discoverer || 'Antiquity'}</strong>
                </div>
                
                <div style={{
                  background: 'rgba(0, 242, 254, 0.05)',
                  borderLeft: '3px solid #00f2fe',
                  padding: '10px',
                  borderRadius: '4px',
                  marginTop: '12px',
                  fontSize: '0.8rem',
                  lineHeight: '1.4',
                  color: '#e0e0e0'
                }}>
                  <strong style={{ display: 'block', color: '#00f2fe', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '4px' }}>Historical Trivia</strong>
                  {selectedElementDetails.trivia}
                </div>
              </div>
            </div>
          ) : (
            <p style={{ opacity: 0.6, textAlign: 'center', margin: '40px 0' }}>Select an element in the grid to view discovery history details.</p>
          )}
        </div>
      </div>
    </div>
  );
}
