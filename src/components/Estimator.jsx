import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Calendar, X, BadgeDollarSign, Sparkles, HelpCircle } from 'lucide-react';
import CarVisualizer from './CarVisualizer';
import './Estimator.css';

const analyzeSymptoms = (text) => {
  const t = text.toLowerCase();
  const selected = [];
  const partsToSelect = new Set();

  if (t.includes('arranc') || t.includes('bater') || t.includes('carga') || t.includes('alterna') || t.includes('bendix') || t.includes('fuga') || t.includes('corrient')) {
    partsToSelect.add('battery');
    selected.push({ id: "bat-replace", name: "Batería Moura 12V 75Ah (Colocada)", price: 95000, part: "battery" });
  }
  if (t.includes('luz') || t.includes('luces') || t.includes('faro') || t.includes('optic') || t.includes('led') || t.includes('xenon') || t.includes('auxiliar') || t.includes('alinea')) {
    partsToSelect.add('lighting');
    selected.push({ id: "lit-led", name: "Instalación de Kit Cree LED Canbus", price: 22000, part: "lighting" });
  }
  if (t.includes('ecu') || t.includes('computa') || t.includes('inyecc') || t.includes('scan') || t.includes('escan') || t.includes('sensor') || t.includes('llave') || t.includes('chip')) {
    partsToSelect.add('ecu');
    selected.push({ id: "ecu-scan", name: "Escaneo Computarizado Completo", price: 25000, part: "ecu" });
  }
  if (t.includes('aire') || t.includes('ac') || t.includes('alzacrista') || t.includes('vidrio') || t.includes('cierre') || t.includes('alarma') || t.includes('motor de puerta') || t.includes('clima')) {
    partsToSelect.add('comfort');
    selected.push({ id: "com-alarm", name: "Instalación de Alarma Volumétrica", price: 75000, part: "comfort" });
  }
  if (t.includes('choque') || t.includes('aboll') || t.includes('bollo') || t.includes('golpe') || t.includes('sacabol') || t.includes('paragolp') || t.includes('chapa') || t.includes('guardabar')) {
    partsToSelect.add('chapa');
    selected.push({ id: "bod-dent", name: "Sacabollos Artesanal (PDR)", price: 35000, part: "chapa" });
  }
  if (t.includes('pintu') || t.includes('pulid') || t.includes('lustra') || t.includes('brill') || t.includes('acrilic') || t.includes('rayo') || t.includes('raspa') || t.includes('rayon')) {
    partsToSelect.add('paint');
    selected.push({ id: "bod-paint", name: "Pintura por Paño / Panel", price: 75000, part: "paint" });
  }

  if (partsToSelect.size === 0) {
    partsToSelect.add('ecu');
    selected.push({ id: "ecu-scan", name: "Escaneo Computarizado Completo", price: 25000, part: "ecu" });
  }

  return {
    parts: Array.from(partsToSelect),
    services: selected
  };
};

const SERVICES_DATA = {
  battery: {
    title: "Sistema de Carga & Batería",
    desc: "Baterías, alternadores, motores de arranque y fugas de consumo eléctrico.",
    options: [
      { id: "bat-replace", name: "Batería Moura 12V 75Ah (Colocada)", desc: "18 meses de garantía escrita oficial", price: 95000, part: "battery" },
      { id: "bat-alt", name: "Reparación Completa de Alternador", desc: "Bobinados, carbones y regulador de voltaje", price: 58000, part: "battery" },
      { id: "bat-start", name: "Reparación de Motor de Arranque", desc: "Cambio de bendix, carbones y bobina de arranque", price: 65000, part: "battery" },
      { id: "bat-leak", name: "Diagnóstico de Fuga de Corriente", desc: "Medición con osciloscopio de consumo en reposo", price: 20000, part: "battery" }
    ]
  },
  lighting: {
    title: "Iluminación & Sistemas de Faros",
    desc: "Reparación de circuitos de iluminación, lámparas y ópticas.",
    options: [
      { id: "lit-led", name: "Instalación de Kit Cree LED Canbus", desc: "Lámparas de alta potencia sin error en tablero", price: 22000, part: "lighting" },
      { id: "lit-repair", name: "Reparación de Instalación de Luces", desc: "Corrección de cortocircuitos y falsos contactos", price: 30000, part: "lighting" },
      { id: "lit-aux", name: "Instalación de Faros Auxiliares", desc: "Cableado reforzado con relay y tecla original", price: 45000, part: "lighting" },
      { id: "lit-align", name: "Alineación y Enfoque de Ópticas", desc: "Calibración por haz de luz reglamentario", price: 12000, part: "lighting" }
    ]
  },
  ecu: {
    title: "Inyección Electrónica & Computadora",
    desc: "Escaneo de sensores, diagnóstico de fallas ECU y programación electrónica.",
    options: [
      { id: "ecu-scan", name: "Escaneo Computarizado Completo", desc: "Diagnóstico OBD2, lectura de parámetros en vivo", price: 25000, part: "ecu" },
      { id: "ecu-repair", name: "Reparación de ECU / Computadora", desc: "Reparación de placas integradas y transistores", price: 180000, part: "ecu" },
      { id: "ecu-keys", name: "Clonación y Codificación de Llaves", desc: "Programación de chip inmovilizador y telecomando", price: 45000, part: "ecu" },
      { id: "ecu-sensor", name: "Reemplazo de Sensores de Inyección", desc: "Sensores de rotación, temperatura, MAF, etc.", price: 35000, part: "ecu" }
    ]
  },
  comfort: {
    title: "Confort, Alarmas & Accesorios",
    desc: "Alzacristales, cierre centralizado, alarmas y climatización.",
    options: [
      { id: "com-alarm", name: "Instalación de Alarma Volumétrica", desc: "Sensor de presencia y corte de motor", price: 75000, part: "comfort" },
      { id: "com-locks", name: "Cierre Centralizado de Puertas (4P)", desc: "Motores eléctricos comandados por alarma", price: 60000, part: "comfort" },
      { id: "com-windows", name: "Reparación de Alzacristales Eléctrico", desc: "Reemplazo de cables, poleas o motor de puerta", price: 48000, part: "comfort" },
      { id: "com-ac", name: "Carga y Control de Aire Acondicionado", desc: "Detección de fugas con contraste y carga de gas R134", price: 38000, part: "comfort" }
    ]
  },
  chapa: {
    title: "Chapa & Paragolpes",
    desc: "Sacabollos artesanal (PDR) y soldadura de paragolpes plásticos.",
    options: [
      { id: "bod-dent", name: "Sacabollos Artesanal (PDR)", desc: "Desabollo en frío sin dañar la pintura original", price: 35000, part: "chapa" },
      { id: "bod-bumper", name: "Reparación y Soldadura de Paragolpes", desc: "Costura plástica y reparación de paragolpes dañado", price: 40000, part: "chapa" }
    ]
  },
  paint: {
    title: "Pintura & Estética",
    desc: "Pintura de paneles con laca premium y tratamientos de brillo acrílico.",
    options: [
      { id: "bod-paint", name: "Pintura por Paño / Panel", desc: "Preparación de superficie, pintura bicapa y laca premium", price: 75000, part: "paint" },
      { id: "bod-polish", name: "Tratamiento Acrílico & Lustrado", desc: "Pulido en 3 etapas para eliminar rayas y sellador protector", price: 55000, part: "paint" }
    ]
  }
};

export default function Estimator({ onSelectQuote, onPrintQuote }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  // Estados para el Asistente de IA
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiSymptom, setAiSymptom] = useState('');
  const [aiStep, setAiStep] = useState('input'); // 'input' | 'scanning' | 'results'
  const [aiResults, setAiResults] = useState(null);

  const handleAiScan = () => {
    setAiStep('scanning');
    setTimeout(() => {
      const results = analyzeSymptoms(aiSymptom);
      setAiResults(results);
      setAiStep('results');
    }, 2500);
  };

  const handleApplyAiDiagnostic = () => {
    if (!aiResults) return;
    setSelectedServices(aiResults.services);
    if (aiResults.parts.length > 0) {
      setSelectedPart(aiResults.parts[0]);
    }
    setShowAiModal(false);
  };

  const handleSelectPart = (part) => {
    setSelectedPart(part);
  };

  const handleToggleService = (service) => {
    const isSelected = selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      setSelectedServices(selectedServices.filter(s => s.id !== service.id));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleRemoveService = (serviceId) => {
    setSelectedServices(selectedServices.filter(s => s.id !== serviceId));
  };

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const getSubtotal = () => {
    return calculateTotal() / 1.21;
  };

  const getIva = () => {
    return calculateTotal() - getSubtotal();
  };

  const handleBookWithQuote = () => {
    if (selectedServices.length === 0) return;
    onSelectQuote(selectedServices);
  };

  const handlePrint = () => {
    if (selectedServices.length === 0) return;
    
    // Generar objeto temporal para el layout de impresión
    const mockTurn = {
      id: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: "Presupuesto Estimativo",
      phone: "-",
      carModel: "Vehículo Cotizado",
      carPlate: "PRESUPUESTO",
      date: new Date().toISOString().split("T")[0],
      time: new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' }),
      services: [...selectedServices],
      totalPrice: calculateTotal(),
      notes: "Generado digitalmente desde el presupuestador interactivo en línea."
    };
    onPrintQuote(mockTurn);
  };

  return (
    <div className="estimator-container-pro">
      <div className="estimator-header-pro" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h2>Cotizador Visual Interactivo</h2>
        <p className="estimator-subtitle" style={{ marginBottom: '1rem' }}>Hacé click en las diferentes zonas del auto para seleccionar servicios y calcular el costo total estimado en tiempo real.</p>
        <button 
          type="button" 
          onClick={() => {
            setShowAiModal(true);
            setAiStep('input');
            setAiSymptom('');
          }}
          className="btn-primary"
          style={{ border: '1px solid rgba(0, 240, 255, 0.4)', background: 'linear-gradient(90deg, rgba(0,240,255,0.05), rgba(0,114,255,0.05))', padding: '0.5rem 1.5rem', borderRadius: '10px' }}
        >
          🤖 Diagnóstico por IA (Symptom Analyzer)
        </button>
      </div>

      <div className="estimator-grid-pro">
        {/* Lado Izquierdo: Auto Visualizer libre de filtros de categoría */}
        <div className="estimator-visualizer-section">
          <div className="visualizer-header-info">
            <Sparkles size={16} className="sparkle-icon" />
            <span>Zona del Vehículo Activa: <strong>{selectedPart ? SERVICES_DATA[selectedPart].title : 'Ninguna (Hacé click en el auto)'}</strong></span>
          </div>
          <CarVisualizer 
            selectedPart={selectedPart}
            onSelectPart={handleSelectPart}
            selectedServices={selectedServices}
            category="all" // Habilita todas las zonas a la vez
          />
        </div>

        {/* Centro: Panel de Servicios de la parte seleccionada */}
        <div className="estimator-services-section">
          <AnimatePresence mode="wait">
            {selectedPart ? (
              <motion.div 
                key={selectedPart}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="estimator-services-panel"
              >
                <div className="services-header-box">
                  <h3>{SERVICES_DATA[selectedPart].title}</h3>
                  <p>{SERVICES_DATA[selectedPart].desc}</p>
                </div>

                <div className="estimator-options-list">
                  {SERVICES_DATA[selectedPart].options.map(opt => {
                    const isChecked = selectedServices.some(s => s.id === opt.id);
                    return (
                      <div 
                        key={opt.id}
                        onClick={() => handleToggleService(opt)}
                        className={`estimator-service-item ${isChecked ? 'selected' : ''}`}
                      >
                        <div className="service-item-meta">
                          <h4>{opt.name}</h4>
                          <p>{opt.desc}</p>
                        </div>
                        <div className="service-item-action">
                          <span className="price-label">${opt.price.toLocaleString("es-AR")}</span>
                          <div className="checkbox-indicator">
                            {isChecked && <span className="checked-dot" />}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ) : (
              <div className="estimator-empty-services">
                <HelpCircle size={48} className="help-icon-pulsing" />
                <h3>Explorá tu Auto</h3>
                <p>Presioná sobre el motor (batería), las ópticas (iluminación), la cabina (inyección o confort) o la carrocería exterior (chapa/pintura) para desplegar la lista de servicios.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Lado Derecho: Ficha del Ticket Cotización */}
        <div className="estimator-ticket-section">
          <div className="quote-ticket-metal">
            <div className="ticket-card-header">
              <BadgeDollarSign size={20} className="glow-cyan-icon" />
              <span>PRESUPUESTO PRELIMINAR</span>
            </div>

            <div className="ticket-body-scrollable">
              {selectedServices.length > 0 ? (
                <div className="ticket-items-list">
                  <AnimatePresence>
                    {selectedServices.map((srv) => (
                      <motion.div 
                        key={srv.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="ticket-selected-item"
                      >
                        <div className="ticket-item-details">
                          <span className="item-specialty-dot" style={{ backgroundColor: srv.id.startsWith('bod') ? 'var(--neon-orange)' : 'var(--electric-cyan)' }} />
                          <div className="item-txt-block">
                            <span className="item-name-bold">{srv.name.split(' (')[0]}</span>
                            <span className="item-category-label">{srv.id.startsWith('bod') ? 'Chapa y Pintura' : 'Electricidad'}</span>
                          </div>
                        </div>
                        <div className="ticket-item-price-remove">
                          <span>${srv.price.toLocaleString("es-AR")}</span>
                          <button 
                            type="button" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveService(srv.id);
                            }}
                            className="btn-remove-item"
                            title="Quitar del presupuesto"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="ticket-empty-message">
                  <p>No seleccionaste ningún servicio todavía. Agregá trabajos haciendo click en el vehículo.</p>
                </div>
              )}
            </div>

            <div className="ticket-totals-box">
              <div className="total-meta-row">
                <span>Subtotal (Neto):</span>
                <strong>${getSubtotal().toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="total-meta-row">
                <span>I.V.A. (21%):</span>
                <strong>${getIva().toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
              </div>
              <div className="total-meta-row grand-total-row">
                <span>TOTAL ESTIMADO:</span>
                <span className="grand-total-amount">${calculateTotal().toLocaleString("es-AR")}</span>
              </div>
            </div>

            <div className="ticket-actions-group">
              <button 
                type="button"
                onClick={handleBookWithQuote}
                disabled={selectedServices.length === 0}
                className="btn-primary quote-book-btn"
              >
                <Calendar size={18} />
                Reservar con este Presupuesto
              </button>
              
              <button 
                type="button"
                onClick={handlePrint}
                disabled={selectedServices.length === 0}
                className="btn-secondary quote-print-btn"
              >
                <Printer size={18} />
                Imprimir Presupuesto
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Diagnóstico por IA Holográfico */}
      {showAiModal && (
        <div className="ai-modal-overlay">
          <div className="ai-modal-card">
            <div className="ai-modal-header">
              <div className="ai-title-glow">
                <span className="ai-chip">OBD3 INTELLIGENT DIAGNOSTIC</span>
                <h3>Scanner de Síntomas por IA</h3>
              </div>
              <button type="button" onClick={() => setShowAiModal(false)} className="ai-close-btn">
                <X size={18} />
              </button>
            </div>

            <div className="ai-modal-body">
              {aiStep === 'input' && (
                <div className="ai-input-view">
                  <p>Escribí a continuación los problemas de tu automóvil. El sistema buscará zonas eléctricas, mecánicas o de chapa y pintura comprometidas.</p>
                  <textarea 
                    value={aiSymptom}
                    onChange={(e) => setAiSymptom(e.target.value)}
                    placeholder="Ej: Tengo una raspadura de pintura en la puerta y el motor de arranque hace un ruido extraño cuando quiero darle marcha..."
                    rows={4}
                    className="ai-textarea"
                  />
                  <button 
                    type="button" 
                    onClick={handleAiScan}
                    disabled={!aiSymptom.trim()}
                    className="btn-primary ai-scan-trigger-btn"
                  >
                    Iniciar Análisis OBD3 🧬
                  </button>
                </div>
              )}

              {aiStep === 'scanning' && (
                <div className="ai-scanning-view">
                  <div className="hologram-scanner">
                    <div className="scanning-line"></div>
                    <div className="atom-spinner">⚛️</div>
                  </div>
                  <h4 className="scanning-title">Procesando Síntomas...</h4>
                  <div className="scanning-logs">
                    <span className="scan-log-line">&gt; Conectando al simulador OBD3...</span>
                    <span className="scan-log-line">&gt; Procesando descripción del propietario...</span>
                    <span className="scan-log-line">&gt; Reconociendo zonas (Chapa, Pintura, Faros, Batería)...</span>
                    <span className="scan-log-line">&gt; Calculando cotización recomendada...</span>
                  </div>
                </div>
              )}

              {aiStep === 'results' && aiResults && (
                <div className="ai-results-view">
                  <div className="ai-success-badge">ANÁLISIS FINALIZADO</div>
                  
                  <h4>Zonas Mecánicas Afectadas:</h4>
                  <div className="ai-result-zones">
                    {aiResults.parts.map(p => {
                      const label = p === 'battery' ? 'Carga y Batería' :
                                    p === 'lighting' ? 'Iluminación' :
                                    p === 'ecu' ? 'Inyección/ECU' :
                                    p === 'comfort' ? 'Confort y Alarma' :
                                    p === 'chapa' ? 'Chapa y Paragolpes' : 'Pintura y Estética';
                      const color = p.startsWith('chapa') || p.startsWith('paint') ? 'var(--neon-orange)' : 'var(--electric-cyan)';
                      return (
                        <span key={p} className="ai-result-zone-pill" style={{ borderColor: color, color: color }}>
                          {label}
                        </span>
                      );
                    })}
                  </div>

                  <h4>Servicios Pre-cargados Sugeridos:</h4>
                  <div className="ai-result-services">
                    {aiResults.services.map(s => (
                      <div key={s.id} className="ai-suggested-service-card">
                        <div className="as-srv-txt">
                          <strong>{s.name}</strong>
                          <span>{s.desc}</span>
                        </div>
                        <span className="as-srv-price">${s.price.toLocaleString("es-AR")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="ai-results-actions">
                    <button 
                      type="button" 
                      onClick={handleApplyAiDiagnostic} 
                      className="btn-primary apply-ai-btn"
                    >
                      Aplicar Cotización
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setAiStep('input')} 
                      className="btn-secondary"
                    >
                      Re-analizar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
