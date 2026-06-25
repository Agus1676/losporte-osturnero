import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Printer, Calendar, X, BadgeDollarSign, Sparkles, HelpCircle } from 'lucide-react';
import CarVisualizer from './CarVisualizer';
import './Estimator.css';

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
  bodywork: {
    title: "Chapa, Pintura & Estética",
    desc: "Sacabollos artesanal, pintura por paneles, tratamientos de brillo y plásticos.",
    options: [
      { id: "bod-paint", name: "Pintura por Paño / Panel", desc: "Preparación de superficie, pintura bicapa y laca premium", price: 75000, part: "bodywork" },
      { id: "bod-dent", name: "Sacabollos Artesanal (PDR)", desc: "Desabollo en frío sin dañar la pintura original", price: 35000, part: "bodywork" },
      { id: "bod-polish", name: "Tratamiento Acrílico & Lustrado", desc: "Pulido en 3 etapas para eliminar rayas y sellador protector", price: 55000, part: "bodywork" },
      { id: "bod-bumper", name: "Reparación y Soldadura de Paragolpes", desc: "Costura plástica y pintura del paragolpes dañado", price: 40000, part: "bodywork" }
    ]
  }
};

export default function Estimator({ onSelectQuote, onPrintQuote }) {
  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

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
      <div className="estimator-header-pro">
        <h2>Cotizador Visual Interactivo</h2>
        <p className="estimator-subtitle">Hacé click en las diferentes zonas del auto para seleccionar servicios y calcular el costo total estimado en tiempo real.</p>
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
    </div>
  );
}
