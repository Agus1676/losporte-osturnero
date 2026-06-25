import React from 'react';
import './CarVisualizer.css';

export default function CarVisualizer({ selectedPart, onSelectPart, selectedServices, category }) {
  // Contar cuántos servicios hay activos por cada sección del auto
  const getServiceCountForPart = (part) => {
    return selectedServices.filter(s => s.part === part).length;
  };

  // Determinar si una sección del auto está deshabilitada según la categoría seleccionada
  const isPartDisabled = (part) => {
    if (category === 'electrical') {
      return part === 'chapa' || part === 'paint';
    }
    if (category === 'bodywork') {
      return part !== 'chapa' && part !== 'paint';
    }
    return false;
  };

  const handlePartClick = (partName) => {
    if (isPartDisabled(partName)) return;
    onSelectPart(partName);
  };

  return (
    <div className="car-visualizer-card">
      <div className="visualizer-wrapper">
        <svg id="car-svg-pro" viewBox="0 0 200 400" width="100%" height="100%">
          <defs>
            <radialGradient id="glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ffd60a" stopOpacity="0.4"/>
              <stop offset="100%" stopColor="#ffd60a" stopOpacity="0"/>
            </radialGradient>
            <filter id="neon-glow-cyan" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-yellow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-orange" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neon-glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Sombra proyectada del auto */}
          <rect x="36" y="56" width="128" height="288" rx="38" fill="rgba(0, 0, 0, 0.7)" filter="blur(8px)" />

          {/* Chasis metálico base */}
          <rect x="38" y="58" width="124" height="284" rx="36" fill="#131520" stroke="#262a3b" strokeWidth="2.5" />
          
          {/* Cabina/Techo solar del auto */}
          <path d="M 52 145 C 52 115, 148 115, 148 145 L 142 245 C 142 265, 58 265, 58 245 Z" fill="#1a1c29" stroke="#262a3b" strokeWidth="2" />
          <path d="M 58 152 Q 100 135 142 152 L 138 180 Q 100 162 62 180 Z" fill="rgba(0, 240, 255, 0.05)" stroke="rgba(0, 240, 255, 0.2)" strokeWidth="1" />

          {/* Ruedas y frenos */}
          <rect x="23" y="85" width="15" height="42" rx="4" fill="#0b0c10" stroke="#1f2330" />
          <rect x="162" y="85" width="15" height="42" rx="4" fill="#0b0c10" stroke="#1f2330" />
          <rect x="23" y="270" width="15" height="42" rx="4" fill="#0b0c10" stroke="#1f2330" />
          <rect x="162" y="270" width="15" height="42" rx="4" fill="#0b0c10" stroke="#1f2330" />

          {/* ZONA 1: BATERÍA Y SISTEMA DE CARGA (Frente - Compartimento Motor) */}
          <g 
            className={`car-interactive-part ${selectedPart === 'battery' ? 'active' : ''} ${isPartDisabled('battery') ? 'disabled' : ''} ${getServiceCountForPart('battery') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('battery')}
          >
            <rect x="45" y="70" width="110" height="50" fill="transparent" style={{ cursor: isPartDisabled('battery') ? 'default' : 'pointer' }} />
            
            {/* Dibujo de la batería */}
            <rect x="75" y="75" width="50" height="30" rx="3" className="battery-body" />
            <rect x="80" y="70" width="8" height="5" fill="#ff453a" />
            <rect x="112" y="70" width="8" height="5" fill="#0072ff" />
            <text x="100" y="94" textAnchor="middle" className="battery-sign">+</text>
            
            <path d="M 45 68 L 155 68 L 145 115 L 55 115 Z" className="glow-path-cyan" />
            <text x="100" y="125" textAnchor="middle" className="part-svg-label">SIST. DE CARGA / BATERÍA</text>
          </g>

          {/* ZONA 2: ILUMINACIÓN Y FAROS */}
          <g 
            className={`car-interactive-part ${selectedPart === 'lighting' ? 'active' : ''} ${isPartDisabled('lighting') ? 'disabled' : ''} ${getServiceCountForPart('lighting') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('lighting')}
          >
            <rect x="40" y="58" width="120" height="15" fill="transparent" style={{ cursor: isPartDisabled('lighting') ? 'default' : 'pointer' }} />
            <rect x="40" y="325" width="120" height="15" fill="transparent" style={{ cursor: isPartDisabled('lighting') ? 'default' : 'pointer' }} />

            <path d="M 42 58 L 25 15 L 60 15 Z" className="headlight-beam" />
            <path d="M 158 58 L 175 15 L 140 15 Z" className="headlight-beam" />
            
            <path d="M 42 62 Q 52 58 62 62" className="headlight-bulb" strokeWidth="3.5" fill="none" />
            <path d="M 138 62 Q 148 58 158 62" className="headlight-bulb" strokeWidth="3.5" fill="none" />

            <rect x="44" y="337" width="20" height="5" rx="1" className="taillight-bulb" />
            <rect x="136" y="337" width="20" height="5" rx="1" className="taillight-bulb" />

            <path d="M 41 60 L 159 60 L 159 66 L 41 66 Z" className="glow-path-yellow" />
            <path d="M 41 334 L 159 334 L 159 340 L 41 340 Z" className="glow-path-yellow" />
            <text x="100" y="195" textAnchor="middle" className="part-svg-label">ILUMINACIÓN & FAROS</text>
          </g>

          {/* ZONA 3: INYECCIÓN Y ECU */}
          <g 
            className={`car-interactive-part ${selectedPart === 'ecu' ? 'active' : ''} ${isPartDisabled('ecu') ? 'disabled' : ''} ${getServiceCountForPart('ecu') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('ecu')}
          >
            <rect x="65" y="130" width="70" height="60" fill="transparent" style={{ cursor: isPartDisabled('ecu') ? 'default' : 'pointer' }} />
            
            <rect x="82" y="140" width="36" height="36" rx="4" className="ecu-box" />
            <line x1="88" y1="140" x2="88" y2="135" stroke="var(--border-color)" strokeWidth="1.5" />
            <line x1="100" y1="140" x2="100" y2="135" stroke="var(--border-color)" strokeWidth="1.5" />
            <line x1="112" y1="140" x2="112" y2="135" stroke="var(--border-color)" strokeWidth="1.5" />
            
            <circle cx="100" cy="158" r="4" fill="var(--electric-cyan)" className="ecu-core" />

            <circle cx="100" cy="158" r="28" className="glow-path-cyan" />
            <text x="100" y="222" textAnchor="middle" className="part-svg-label">INYECCIÓN & COMPUTADORA</text>
          </g>

          {/* ZONA 4: CONFORT Y ALARMAS */}
          <g 
            className={`car-interactive-part ${selectedPart === 'comfort' ? 'active' : ''} ${isPartDisabled('comfort') ? 'disabled' : ''} ${getServiceCountForPart('comfort') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('comfort')}
          >
            <rect x="55" y="225" width="90" height="70" fill="transparent" style={{ cursor: isPartDisabled('comfort') ? 'default' : 'pointer' }} />
            
            <circle cx="100" cy="245" r="12" fill="none" stroke="#262a3b" strokeWidth="2.5" />
            <rect x="90" y="270" width="20" height="12" rx="1" fill="#12141c" stroke="#262a3b" />
            
            <path d="M 68 280 A 15 15 0 0 1 68 250" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" className="wifi-wave-l" />
            <path d="M 132 280 A 15 15 0 0 0 132 250" stroke="var(--text-secondary)" strokeWidth="1.5" fill="none" className="wifi-wave-r" />

            <path d="M 52 230 L 148 230 L 144 300 L 56 300 Z" className="glow-path-yellow" />
            <text x="100" y="318" textAnchor="middle" className="part-svg-label">CONFORT & ALARMAS</text>
          </g>

          {/* ZONA 5: CHAPA & PARAGOLPES */}
          <g 
            className={`car-interactive-part ${selectedPart === 'chapa' ? 'active' : ''} ${isPartDisabled('chapa') ? 'disabled' : ''} ${getServiceCountForPart('chapa') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('chapa')}
          >
            {/* Front Bumper Area */}
            <path d="M 40 58 L 160 58 L 150 72 L 50 72 Z" className="glow-path-orange" />
            {/* Rear Bumper Area */}
            <path d="M 40 334 L 160 334 L 150 322 L 50 322 Z" className="glow-path-orange" />
            {/* Left Side Panel Outline */}
            <path d="M 38 120 L 46 120 L 46 280 L 38 280 Z" className="glow-path-orange" />
            {/* Right Side Panel Outline */}
            <path d="M 162 120 L 154 120 L 154 280 L 162 280 Z" className="glow-path-orange" />
            
            <path d="M 38 150 L 46 150 M 38 235 L 46 235 M 162 150 L 154 150 M 162 235 L 154 235" stroke="#262a3b" strokeWidth="2" />
            
            <text x="100" y="356" textAnchor="middle" className="part-svg-label font-bold">CHAPA Y PARAGOLPES</text>
          </g>

          {/* ZONA 6: PINTURA & ESTÉTICA */}
          <g 
            className={`car-interactive-part ${selectedPart === 'paint' ? 'active' : ''} ${isPartDisabled('paint') ? 'disabled' : ''} ${getServiceCountForPart('paint') > 0 ? 'has-services' : ''}`}
            onClick={() => handlePartClick('paint')}
          >
            {/* Hood (Capot) Surface */}
            <path d="M 52 74 L 148 74 L 140 114 L 60 114 Z" className="glow-path-red" />
            {/* Roof / Trunk (Techo y Baúl) Surface */}
            <path d="M 58 245 L 142 245 L 146 320 L 54 320 Z" className="glow-path-red" />
            
            <text x="100" y="372" textAnchor="middle" className="part-svg-label font-bold">PINTURA Y ESTÉTICA</text>
          </g>

        </svg>

        {/* Indicadores flotantes de contador */}
        {['battery', 'lighting', 'ecu', 'comfort', 'chapa', 'paint'].map(part => {
          const count = getServiceCountForPart(part);
          if (count === 0 || isPartDisabled(part)) return null;
          return (
            <div key={part} className={`part-badge-count badge-${part}`}>
              {count}
            </div>
          );
        })}
      </div>
    </div>
  );
}
