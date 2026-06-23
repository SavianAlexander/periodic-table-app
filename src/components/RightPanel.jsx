import React, { useEffect, useRef, useState } from 'react';
import '../styles/main.css';
import { BohrModel } from './BohrModel';
import { EmissionSpectra } from './EmissionSpectra';

const translations = {
  en: {
    symbolLabel: 'Symbol',
    atomicNumber: 'Atomic Number',
    atomicMass: 'Atomic Mass',
    elementOverview: 'Element Overview',
    realWorldAppearance: 'Real-World Appearance',
    everydayUses: 'Everyday Uses',
    physicalChemicalParameters: 'Physical & Chemical Parameters',
    stateAtRoomTemp: 'State at Room Temp',
    meltingPoint: 'Melting Point',
    boilingPoint: 'Boiling Point',
    density: 'Density',
    crystalStructure: 'Crystal Structure',
    discoverer: 'Discoverer',
    discoveryYear: 'Discovery Year',
    electronegativity: 'Electronegativity',
    ionizationEnergy: 'Ionization Energy',
    electronConfiguration: 'Electron Configuration',
    isotopes: 'Isotopes',
    isotope: 'Isotope',
    massNo: 'Mass No.',
    halfLife: 'Half-life',
    interactiveBohrModel: 'Interactive Bohr Model',
    emissionSpectra: 'Emission Spectra',
    category: 'Category',
    highlySyntheticRadioactive: 'Highly Synthetic & Radioactive',
    unstableDesc: 'This element is highly unstable. It decays too rapidly to exist in visible quantities for photographing.',
    loadingPhoto: 'Loading photo...',
    photoNotAvailable: 'Photo not available for',
    dataNotAvailable: 'Data not available',
    visibleSpectrumLines: 'Visible spectrum lines',
    isChemicalElement: 'is a chemical element with atomic number',
    classifiedAs: 'Classified as a',
    hasAtomicMass: 'it has an atomic mass of',
    commonlyUsed: 'It is commonly used in applications such as',
    and: 'and',
    play: 'Play',
    pause: 'Pause',
    stop: 'Stop',
    voiceNarrator: 'Voice Narrator',
    videoNarrative: 'Video Narrative',
    curatedVideo: 'Curated Video',
    videoTab: 'Video Player',
    curatedTab: 'Curated Youtube Video',
    gas: 'Gas',
    liquid: 'Liquid',
    solid: 'Solid',
    synthetic: 'Synthetic',
    kelvinUnit: 'Kelvin',
    densityGasUnit: 'grams per liter',
    densitySolidUnit: 'grams per cubic centimeter',
    ionizationUnit: 'kilojoules per mole',
    groupBlocks: {
      'diatomic nonmetal': 'diatomic nonmetal',
      'noble gas': 'noble gas',
      'alkali metal': 'alkali metal',
      'alkaline earth metal': 'alkaline earth metal',
      'metalloid': 'metalloid',
      'polyatomic nonmetal': 'polyatomic nonmetal',
      'post-transition metal': 'post-transition metal',
      'transition metal': 'transition metal',
      'lanthanide': 'lanthanide',
      'actinide': 'actinide',
      'reactive nonmetal': 'reactive nonmetal',
      'unknown': 'unknown'
    }
  },
  es: {
    symbolLabel: 'Símbolo',
    atomicNumber: 'Número Atómico',
    atomicMass: 'Masa Atómica',
    elementOverview: 'Resumen del Elemento',
    realWorldAppearance: 'Aspecto en el Mundo Real',
    everydayUses: 'Usos Cotidianos',
    physicalChemicalParameters: 'Parámetros Físicos y Químicos',
    stateAtRoomTemp: 'Estado a Temp. Ambiente',
    meltingPoint: 'Punto de Fusión',
    boilingPoint: 'Punto de Ebullición',
    density: 'Densidad',
    crystalStructure: 'Estructura Cristalina',
    discoverer: 'Descubridor',
    discoveryYear: 'Año de Descubrimiento',
    electronegativity: 'Electronegatividad',
    ionizationEnergy: 'Energía de Ionización',
    electronConfiguration: 'Configuración Electrónica',
    isotopes: 'Isótopos',
    isotope: 'Isótopo',
    massNo: 'Nº de Masa',
    halfLife: 'Vida Media',
    interactiveBohrModel: 'Modelo de Bohr Interactivo',
    emissionSpectra: 'Espectro de Emisión',
    category: 'Categoría',
    highlySyntheticRadioactive: 'Altamente Sintético y Radiactivo',
    unstableDesc: 'Este elemento es altamente inestable. Se desintegra demasiado rápido para existir en cantidades visibles para fotografiar.',
    loadingPhoto: 'Cargando foto...',
    photoNotAvailable: 'Foto no disponible para',
    dataNotAvailable: 'Datos no disponibles',
    visibleSpectrumLines: 'Líneas del espectro visible',
    isChemicalElement: 'es un elemento químico con número atómico',
    classifiedAs: 'Clasificado como un',
    hasAtomicMass: 'tiene una masa atómica de',
    commonlyUsed: 'Se usa comúnmente en aplicaciones como',
    and: 'y',
    play: 'Reproducir',
    pause: 'Pausar',
    stop: 'Detener',
    voiceNarrator: 'Narrador de Voz',
    videoNarrative: 'Video Narrativo',
    curatedVideo: 'Video Curado',
    videoTab: 'Reproductor de Video',
    curatedTab: 'Video de Youtube Curado',
    gas: 'Gas',
    liquid: 'Líquido',
    solid: 'Sólido',
    synthetic: 'Sintético',
    kelvinUnit: 'Kelvin',
    densityGasUnit: 'gramos por litro',
    densitySolidUnit: 'gramos por centímetro cúbico',
    ionizationUnit: 'kilojulios por mol',
    groupBlocks: {
      'diatomic nonmetal': 'no metal diatómico',
      'noble gas': 'gas noble',
      'alkali metal': 'metal alcalino',
      'alkaline earth metal': 'metal alcalinotérreo',
      'metalloid': 'metaloide',
      'polyatomic nonmetal': 'no metal poliatómico',
      'post-transition metal': 'metal de postransición',
      'transition metal': 'metal de transición',
      'lanthanide': 'lantánido',
      'actinide': 'actínido',
      'reactive nonmetal': 'no metal reactivo',
      'unknown': 'desconocido'
    }
  },
  fr: {
    symbolLabel: 'Symbole',
    atomicNumber: 'Numéro Atomique',
    atomicMass: 'Masse Atomique',
    elementOverview: 'Aperçu de l\'Élément',
    realWorldAppearance: 'Apparence Réelle',
    everydayUses: 'Utilisations Quotidiennes',
    physicalChemicalParameters: 'Paramètres Physiques & Chimiques',
    stateAtRoomTemp: 'État à Temp. Ambiante',
    meltingPoint: 'Point de Fusion',
    boilingPoint: 'Point d\'Ébullition',
    density: 'Densité',
    crystalStructure: 'Structure Cristalline',
    discoverer: 'Découvreur',
    discoveryYear: 'Année de Découverte',
    electronegativity: 'Électronégativité',
    ionizationEnergy: 'Énergie d\'Ionisation',
    electronConfiguration: 'Configuration Électronique',
    isotopes: 'Isotopes',
    isotope: 'Isotope',
    massNo: 'Nº de Masse',
    halfLife: 'Demi-vie',
    interactiveBohrModel: 'Modèle de Bohr Interactif',
    emissionSpectra: 'Spectre d\'Émission',
    category: 'Catégorie',
    highlySyntheticRadioactive: 'Hautement Synthétique & Radioactif',
    unstableDesc: 'Cet élément est hautement instable. Il se désintègre trop rapidement pour exister en quantités visibles pour être photographié.',
    loadingPhoto: 'Chargement de la photo...',
    photoNotAvailable: 'Photo non disponible pour',
    dataNotAvailable: 'Données non disponibles',
    visibleSpectrumLines: 'Lignes du spectre visible',
    isChemicalElement: 'est un élément chimique avec le numéro atomique',
    classifiedAs: 'Classé comme un',
    hasAtomicMass: 'il a une masse atomique de',
    commonlyUsed: 'Il est couramment utilisé dans des applications telles que',
    and: 'et',
    play: 'Lire',
    pause: 'Pause',
    stop: 'Arrêter',
    voiceNarrator: 'Narrateur Vocal',
    videoNarrative: 'Vidéo Narrative',
    curatedVideo: 'Vidéo Sélectionnée',
    videoTab: 'Lecteur Vidéo',
    curatedTab: 'Vidéo Youtube Sélectionnée',
    gas: 'Gaz',
    liquid: 'Liquide',
    solid: 'Solide',
    synthetic: 'Synthétique',
    kelvinUnit: 'Kelvin',
    densityGasUnit: 'grammes par litre',
    densitySolidUnit: 'grammes par centimètre cube',
    ionizationUnit: 'kilojoules par mole',
    groupBlocks: {
      'diatomic nonmetal': 'non-métal diatomique',
      'noble gas': 'gaz noble',
      'alkali metal': 'métal alcalin',
      'alkaline earth metal': 'métal alcalino-terreux',
      'metalloid': 'métalloïde',
      'polyatomic nonmetal': 'non-métal polyatomique',
      'post-transition metal': 'métal de post-transition',
      'transition metal': 'métal de transition',
      'lanthanide': 'lanthanide',
      'actinide': 'actinide',
      'reactive nonmetal': 'non-métal réactif',
      'unknown': 'inconnu'
    }
  }
};

const translateState = (state, lang) => {
  if (!state) return translations[lang].dataNotAvailable;
  const lower = state.toLowerCase();
  if (lower === 'gas') return translations[lang].gas;
  if (lower === 'liquid') return translations[lang].liquid;
  if (lower === 'solid') return translations[lang].solid;
  if (lower === 'synthetic') return translations[lang].synthetic;
  return state;
};

const formatProperty = (val, suffix = '', lang) => {
  if (val === null || val === undefined || val === '') {
    return translations[lang].dataNotAvailable;
  }
  return `${val}${suffix}`;
};

const getSimpleDescription = (element, lang) => {
  const t = translations[lang];
  const name = element.name;
  const symbol = element.symbol;
  const atomicNumber = element.atomicNumber;
  const group = element.groupBlock ? element.groupBlock.toLowerCase() : 'unknown';
  const groupTranslated = t.groupBlocks[group] || group;
  const atomicMass = element.atomicMass;
  
  let usesStr = '';
  if (Array.isArray(element.everydayUses) && element.everydayUses.length > 0) {
    const sliceUses = element.everydayUses.slice(0, 2);
    if (sliceUses.length === 1) {
      usesStr = `${t.commonlyUsed} ${sliceUses[0]}.`;
    } else {
      usesStr = `${t.commonlyUsed} ${sliceUses[0]} ${t.and} ${sliceUses[1]}.`;
    }
  }
  
  return `${name} (${symbol}) ${t.isChemicalElement} ${atomicNumber}. ${t.classifiedAs} ${groupTranslated}, ${t.hasAtomicMass} ${atomicMass} u. ${usesStr}`;
};

export function RightPanel({ element, difficulty, onClose }) {
  const closeBtnRef = useRef(null);
  const panelRef = useRef(null);
  const videoRef = useRef(null);
  const [photoState, setPhotoState] = useState({ loading: true, error: false, url: '' });
  const [language, setLanguage] = useState('en');
  const [activeVideoTab, setActiveVideoTab] = useState('local');

  useEffect(() => {
    if (element) {
      const url = element.atomicNumber <= 94
        ? `https://images-of-elements.com/${element.name.toLowerCase()}.jpg`
        : null;
      setPhotoState({
        loading: !!url,
        error: !url,
        url: url || ''
      });
    }
  }, [element]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  // Clean up media playbacks and voice synthesis on changes
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [element, difficulty, language]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    const handleTab = (e) => {
      if (e.key === 'Tab' && panelRef.current) {
        const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
        const focusableContent = panelRef.current.querySelectorAll(focusableElements);
        if (focusableContent.length === 0) return;
        
        const firstFocusable = focusableContent[0];
        const lastFocusable = focusableContent[focusableContent.length - 1];

        if (!panelRef.current.contains(document.activeElement)) {
          firstFocusable.focus();
          e.preventDefault();
          return;
        }

        if (e.shiftKey) {
          if (document.activeElement === firstFocusable) {
            lastFocusable.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastFocusable) {
            firstFocusable.focus();
            e.preventDefault();
          }
        }
      }
    };
    window.addEventListener('keydown', handleTab);

    if (closeBtnRef.current) {
      closeBtnRef.current.focus();
    }

    return () => {
      window.removeEventListener('keydown', handleTab);
      document.body.style.overflow = 'unset';
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!element) return null;

  const getSpeechText = (element, difficulty, lang) => {
    const t = translations[lang];
    const symbolSpelled = element.symbol.split('').join(' ');
    const overview = getSimpleDescription(element, lang);
    
    if (difficulty === 'Beginner') {
      return `${element.name}. ${t.symbolLabel}: ${symbolSpelled}. ${t.atomicNumber}: ${element.atomicNumber}. ${overview}`;
    }
    
    if (difficulty === 'Intermediate') {
      const stateText = translateState(element.stateAtRoomTemp, lang);
      const melting = formatProperty(element.meltingPoint, ` ${t.kelvinUnit}`, lang);
      const boiling = formatProperty(element.boilingPoint, ` ${t.kelvinUnit}`, lang);
      const densityText = formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ` ${t.densityGasUnit}` : ` ${t.densitySolidUnit}`, lang);
      
      return `${element.name}. ${t.symbolLabel}: ${symbolSpelled}. ${t.atomicNumber}: ${element.atomicNumber}. ${overview}. ${t.stateAtRoomTemp}: ${stateText}. ${t.meltingPoint}: ${melting}. ${t.boilingPoint}: ${boiling}. ${t.density}: ${densityText}.`;
    }
    
    // Advanced
    const cleanConfig = element.electronConfiguration
      ? element.electronConfiguration.replace(/<[^>]*>/g, '')
      : '';
    
    const stateText = translateState(element.stateAtRoomTemp, lang);
    const melting = formatProperty(element.meltingPoint, ` ${t.kelvinUnit}`, lang);
    const boiling = formatProperty(element.boilingPoint, ` ${t.kelvinUnit}`, lang);
    const densityText = formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ` ${t.densityGasUnit}` : ` ${t.densitySolidUnit}`, lang);
    const electro = formatProperty(element.electronegativity, '', lang);
    const ionization = formatProperty(element.ionizationEnergy, ` ${t.ionizationUnit}`, lang);
    
    return `${element.name}. ${t.symbolLabel}: ${symbolSpelled}. ${t.atomicNumber}: ${element.atomicNumber}. ${overview}. ${t.stateAtRoomTemp}: ${stateText}. ${t.meltingPoint}: ${melting}. ${t.boilingPoint}: ${boiling}. ${t.density}: ${densityText}. ${t.electronegativity}: ${electro}. ${t.ionizationEnergy}: ${ionization}. ${t.electronConfiguration}: ${cleanConfig}.`;
  };

  const handlePlaySpeech = () => {
    if (!window.speechSynthesis) return;
    
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    } else {
      window.speechSynthesis.cancel();
      const text = getSpeechText(element, difficulty, language);
      const utterance = new SpeechSynthesisUtterance(text);
      
      const voices = window.speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith(language) || v.lang.startsWith(language.toUpperCase()));
      if (voice) {
        utterance.voice = voice;
      }
      utterance.lang = language;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const handlePauseSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.pause();
    }
  };

  const handleStopSpeech = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  };

  const renderPhotoSection = () => {
    if (element.atomicNumber > 94) {
      return (
        <div className="right-panel-section photo-section">
          <h3>{translations[language].realWorldAppearance}</h3>
          <div className="synthetic-fallback">
            <span className="radiation-warning">⚠️</span>
            <p><strong>{translations[language].highlySyntheticRadioactive}</strong></p>
            <p className="synthetic-desc">{translations[language].unstableDesc}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="right-panel-section photo-section">
        <h3>{translations[language].realWorldAppearance}</h3>
        <div className="element-photo-wrapper">
          {photoState.loading && <div className="photo-skeleton">{translations[language].loadingPhoto}</div>}
          {!photoState.error && (
            <img 
              src={photoState.url} 
              alt={`${element.name}`}
              className={`element-photo ${photoState.loading ? 'hidden' : ''}`}
              onLoad={() => setPhotoState(prev => ({ ...prev, loading: false }))}
              onError={() => setPhotoState(prev => ({ ...prev, loading: false, error: true }))}
            />
          )}
          {photoState.error && (
            <div className="photo-error-fallback">
              <p>{translations[language].photoNotAvailable} {element.name}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="right-panel-overlay" data-testid="right-panel-overlay" onClick={(e) => {
        if (e.detail > 1) return;
        onClose();
      }}></div>
      
      <div className="right-panel" role="dialog" aria-modal="true" data-testid="right-panel" ref={panelRef} onClick={(e) => e.stopPropagation()}>
        <div className={`${difficulty === 'Advanced' ? 'density-high' : ''} right-panel-content`.trim()} data-testid="right-panel-content">
          <button ref={closeBtnRef} className="right-panel-close" onClick={onClose} data-testid="right-panel-close" aria-label="Close panel">&times;</button>
          
          <div className="right-panel-header">
            <h2><span data-testid="right-panel-element-name">{element.name}</span> ({element.symbol})</h2>
            <div className="right-panel-subtitle">
              <span>{translations[language].atomicNumber}: <strong>{element.atomicNumber}</strong></span>
              <span>{translations[language].atomicMass}: <strong>{element.atomicMass}</strong></span>
            </div>
            
            <div className="language-select-container" style={{ marginTop: '10px' }}>
              <select
                data-testid="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="language-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
              </select>
            </div>
          </div>
          
          <div className="right-panel-body">
            
            {/* Voice Narrator Control Dashboard */}
            <div className="right-panel-section voice-section">
              <h3>{translations[language].voiceNarrator}</h3>
              <div data-testid="voice-narrator-controls" className="voice-narrator-controls">
                <button onClick={handlePlaySpeech} className="speech-btn play-btn" aria-label={translations[language].play}>
                  ◀ {translations[language].play}
                </button>
                <button onClick={handlePauseSpeech} className="speech-btn pause-btn" aria-label={translations[language].pause}>
                  ⏸ {translations[language].pause}
                </button>
                <button onClick={handleStopSpeech} className="speech-btn stop-btn" aria-label={translations[language].stop}>
                  ⏹ {translations[language].stop}
                </button>
              </div>
            </div>

            {/* Video Player Dashboard Section */}
            <div className="right-panel-section media-section">
              <h3>{translations[language].videoTab}</h3>
              <div className="media-tabs-controls">
                <button 
                  onClick={() => setActiveVideoTab('local')}
                  className={`tab-btn ${activeVideoTab === 'local' ? 'active' : ''}`}
                >
                  {translations[language].videoNarrative}
                </button>
                <button 
                  onClick={() => setActiveVideoTab('curated')}
                  className={`tab-btn ${activeVideoTab === 'curated' ? 'active' : ''}`}
                >
                  {translations[language].curatedVideo}
                </button>
              </div>
              
              {/* HTML5 Video Player */}
              <div style={{ display: activeVideoTab === 'local' ? 'block' : 'none' }}>
                <video
                  ref={videoRef}
                  data-testid="element-video-player"
                  controls
                  src={`/videos/${element.name.toLowerCase()}_${language}.mp4`}
                  className="element-video-player"
                  style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }}
                />
              </div>
              
              {/* Curated YouTube Video Player */}
              <div style={{ display: activeVideoTab === 'curated' ? 'block' : 'none' }}>
                {element.videoUrl ? (
                  <iframe
                    src={`${element.videoUrl}?hl=${language}&cc_lang_pref=${language}&cc_load_policy=1`}
                    title={`${element.name} Curated Video`}
                    className="curated-video-iframe"
                    style={{ width: '100%', height: '220px', border: 'none', borderRadius: '8px', marginTop: '10px' }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <p>{translations[language].dataNotAvailable}</p>
                )}
              </div>
            </div>
            
            {/* Beginner Mode Dashboard */}
            {difficulty === 'Beginner' && (
              <div className="dashboard-beginner">
                <div className="right-panel-section educational-section">
                  <h3>{translations[language].elementOverview}</h3>
                  <p className="element-desc">{getSimpleDescription(element, language)}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>{translations[language].category}:</strong> {element.groupBlock ? (translations[language].groupBlocks[element.groupBlock.toLowerCase()] || element.groupBlock) : translations[language].dataNotAvailable}</p>
                  </div>
                </div>
                {renderPhotoSection()}
                <div className="right-panel-section" data-testid="right-panel-everyday-uses">
                  <h3>{translations[language].everydayUses}</h3>
                  {Array.isArray(element.everydayUses) && element.everydayUses.length > 0 ? (
                    <ul className="uses-list">
                      {element.everydayUses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{translations[language].dataNotAvailable}</p>
                  )}
                </div>
              </div>
            )}

            {/* Intermediate Mode Dashboard */}
            {difficulty === 'Intermediate' && (
              <div className="dashboard-intermediate" data-testid="right-panel-intermediate-details">
                <div className="right-panel-section educational-section">
                  <h3>{translations[language].elementOverview}</h3>
                  <p className="element-desc">{getSimpleDescription(element, language)}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>{translations[language].category}:</strong> {element.groupBlock ? (translations[language].groupBlocks[element.groupBlock.toLowerCase()] || element.groupBlock) : translations[language].dataNotAvailable}</p>
                  </div>
                </div>
                {renderPhotoSection()}
                <div className="right-panel-section" data-testid="right-panel-everyday-uses">
                  <h3>{translations[language].everydayUses}</h3>
                  {Array.isArray(element.everydayUses) && element.everydayUses.length > 0 ? (
                    <ul className="uses-list">
                      {element.everydayUses.map((use, index) => (
                        <li key={index}>{use}</li>
                      ))}
                    </ul>
                  ) : (
                    <p>{translations[language].dataNotAvailable}</p>
                  )}
                </div>

                <div className="right-panel-section physical-properties">
                  <h3>{translations[language].physicalChemicalParameters}</h3>
                  <div className="properties-grid">
                    <p><strong>{translations[language].stateAtRoomTemp}:</strong> {translateState(element.stateAtRoomTemp, language)}</p>
                    <p><strong>{translations[language].meltingPoint}:</strong> {formatProperty(element.meltingPoint, ' K', language)}</p>
                    <p><strong>{translations[language].boilingPoint}:</strong> {formatProperty(element.boilingPoint, ' K', language)}</p>
                    <p><strong>{translations[language].density}:</strong> {formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ' g/L' : ' g/cm³', language)}</p>
                    <p><strong>{translations[language].crystalStructure}:</strong> {formatProperty(element.crystalStructure, '', language)}</p>
                    <p><strong>{translations[language].discoverer}:</strong> {formatProperty(element.discoverer, '', language)}</p>
                    <p><strong>{translations[language].discoveryYear}:</strong> {formatProperty(element.discoveryYear, '', language)}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Advanced Mode Dashboard */}
            {difficulty === 'Advanced' && (
              <div className="dashboard-advanced" data-testid="right-panel-advanced-data">
                <div className="right-panel-section educational-section">
                  <h3>{translations[language].elementOverview}</h3>
                  <p className="element-desc">{getSimpleDescription(element, language)}</p>
                  <div className="overview-details" style={{ marginTop: '12px' }}>
                    <p><strong>{translations[language].category}:</strong> {element.groupBlock ? (translations[language].groupBlocks[element.groupBlock.toLowerCase()] || element.groupBlock) : translations[language].dataNotAvailable}</p>
                  </div>
                </div>

                <div className="right-panel-section physical-properties">
                  <h3>{translations[language].physicalChemicalParameters}</h3>
                  <div className="properties-grid">
                    <p><strong>{translations[language].stateAtRoomTemp}:</strong> {translateState(element.stateAtRoomTemp, language)}</p>
                    <p><strong>{translations[language].meltingPoint}:</strong> {formatProperty(element.meltingPoint, ' K', language)}</p>
                    <p><strong>{translations[language].boilingPoint}:</strong> {formatProperty(element.boilingPoint, ' K', language)}</p>
                    <p><strong>{translations[language].density}:</strong> {formatProperty(element.density, element.stateAtRoomTemp === 'Gas' ? ' g/L' : ' g/cm³', language)}</p>
                    <p><strong>{translations[language].crystalStructure}:</strong> {formatProperty(element.crystalStructure, '', language)}</p>
                    <p><strong>{translations[language].discoverer}:</strong> {formatProperty(element.discoverer, '', language)}</p>
                    <p><strong>{translations[language].discoveryYear}:</strong> {formatProperty(element.discoveryYear, '', language)}</p>
                    <p><strong>{translations[language].electronegativity}:</strong> {formatProperty(element.electronegativity, '', language)}</p>
                    <p><strong>{translations[language].ionizationEnergy}:</strong> {formatProperty(element.ionizationEnergy, ' kJ/mol', language)}</p>
                  </div>
                </div>

                <div className="right-panel-section">
                  <h3>{translations[language].electronConfiguration}</h3>
                  {element.electronConfiguration ? (
                    <p className="highlight-box" dangerouslySetInnerHTML={{ __html: typeof element.electronConfiguration === 'string' ? element.electronConfiguration.replace(/([spdf])(\d+)/g, '$1<sup>$2</sup>') : translations[language].dataNotAvailable }}></p>
                  ) : (
                    <p className="highlight-box">{translations[language].dataNotAvailable}</p>
                  )}
                </div>

                <div className="right-panel-section isotopes-section">
                  <h3>{translations[language].isotopes}</h3>
                  {Array.isArray(element.isotopes) && element.isotopes.length > 0 ? (
                    <div className="isotopes-table-container">
                      <table className="isotopes-table">
                        <thead>
                          <tr>
                            <th>{translations[language].isotope}</th>
                            <th>{translations[language].massNo}</th>
                            <th>{translations[language].halfLife}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {element.isotopes.map((iso, idx) => (
                            <tr key={idx}>
                              <td>{iso.isotopeName || 'Unknown'}</td>
                              <td>{iso.massNumber !== undefined ? iso.massNumber : 'Unknown'}</td>
                              <td>{iso.halfLife || 'Unknown'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="highlight-box">{translations[language].dataNotAvailable}</p>
                  )}
                </div>

                {/* Bohr Model visualizer */}
                <div className="right-panel-section">
                  <h3>{translations[language].interactiveBohrModel}</h3>
                  <BohrModel element={element} />
                </div>

                {/* Emission Spectra visualizer */}
                <div className="right-panel-section">
                  <h3>{translations[language].emissionSpectra}</h3>
                  <EmissionSpectra spectra={element.emissionSpectra} />
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </>
  );
}
