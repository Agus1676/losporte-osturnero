import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ClipboardList, ShieldAlert, Wrench, Paintbrush, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';
import './VehicleTracker.css';

const STAGES = [
  { step: 1, label: 'Ingresado', icon: ClipboardList, desc: 'Vehículo recibido en taller' },
  { step: 2, label: 'En Diagnóstico', icon: ShieldAlert, desc: 'Chequeo de fallas y circuito' },
  { step: 3, label: 'Chapa/Reparación', icon: Wrench, desc: 'Reparación de carrocería o eléctrica' },
  { step: 4, label: 'Cabina de Pintura', icon: Paintbrush, desc: 'Preparación de pintura y laca' },
  { step: 5, label: 'Control de Calidad', icon: ShieldCheck, desc: 'Prueba de luces, borrado de fallas' },
  { step: 6, label: 'Listo para Entrega', icon: CheckCircle2, desc: 'Auto listo para retirar' }
];

export default function VehicleTracker({ turnsList }) {
  const [searchPlate, setSearchPlate] = useState('');
  const [foundTurn, setFoundTurn] = useState(null);
  const [pastTurns, setPastTurns] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeAccordionId, setActiveAccordionId] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanPlate = searchPlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    
    // Buscar todas las coincidencias en la base de datos de turnos
    const matches = turnsList.filter(t => t.carPlate.replace(/[^a-zA-Z0-9]/g, '').toUpperCase() === cleanPlate);
    
    if (matches.length > 0) {
      // Ordenar por fecha y hora desc (más reciente primero)
      const sorted = [...matches].sort((a, b) => {
        const dateA = new Date(a.date.split("-")[0], a.date.split("-")[1] - 1, a.date.split("-")[2]);
        const dateB = new Date(b.date.split("-")[0], b.date.split("-")[1] - 1, b.date.split("-")[2]);
        if (dateB - dateA !== 0) return dateB - dateA;
        return b.time.localeCompare(a.time);
      });

      // El turno activo es el más reciente que NO está completado.
      // Si todos están completados, no hay turno activo y el más reciente va al historial.
      const active = sorted.find(t => t.status !== 'completed');
      const history = sorted.filter(t => t.status === 'completed' && (!active || t.id !== active.id));

      // Sincronizar trackingStage por defecto si no existe
      if (active && !active.trackingStage) {
        if (active.status === 'pending') active.trackingStage = 1;
        else if (active.status === 'in-progress') active.trackingStage = 3;
      }

      setFoundTurn(active || null);
      setPastTurns(history);
    } else {
      setFoundTurn(null);
      setPastTurns([]);
    }
    setHasSearched(true);
    setActiveAccordionId(null);
  };

  const getStageStatus = (step) => {
    if (!foundTurn) return 'upcoming';
    const current = foundTurn.trackingStage || 1;
    if (step === current) return 'active';
    if (step < current) return 'completed';
    return 'upcoming';
  };

  const toggleAccordion = (id) => {
    setActiveAccordionId(activeAccordionId === id ? null : id);
  };

  const calculateWarranty = (turn) => {
    if (!turn.date) return { isActive: false, text: 'Sin garantía' };
    
    let maxMonths = 12; // Garantía eléctrica base de 12 meses
    turn.services.forEach(s => {
      if (s.id === 'bat-replace') {
        maxMonths = Math.max(maxMonths, 18);
      } else if (s.id.startsWith('bod')) {
        maxMonths = Math.max(maxMonths, 24); // 24 meses para chapa y pintura
      }
    });

    const orderDate = new Date(turn.date.split("-")[0], turn.date.split("-")[1] - 1, turn.date.split("-")[2]);
    const today = new Date();
    
    const expiryDate = new Date(orderDate);
    expiryDate.setMonth(expiryDate.getMonth() + maxMonths);

    const isActive = expiryDate > today;

    return {
      isActive,
      expiryDate: expiryDate.toLocaleDateString("es-AR"),
      months: maxMonths,
      text: isActive 
        ? `Vigente (Vence el ${expiryDate.toLocaleDateString("es-AR")})` 
        : `Expirada el ${expiryDate.toLocaleDateString("es-AR")}`
    };
  };

  return (
    <div className="tracker-container-pro">
      <div className="tracker-card-pro">
        <h2>Seguimiento & Historial Clínico</h2>
        <p className="tracker-sub-pro">Ingresá la patente de tu auto para conocer el estado actual y ver el historial mecánico registrado.</p>

        <form onSubmit={handleSearch} className="tracker-search-form">
          <div className="search-input-wrapper">
            <Search className="search-icon-pro" size={20} />
            <input 
              type="text" 
              value={searchPlate}
              onChange={(e) => setSearchPlate(e.target.value)}
              placeholder="Ej: AE010AR o AA123BB"
              required
              style={{ textTransform: 'uppercase' }}
            />
          </div>
          <button type="submit" className="btn-primary search-submit-btn">
            Buscar Auto
          </button>
        </form>

        {hasSearched && (
          <div className="tracker-results-area">
            {foundTurn || pastTurns.length > 0 ? (
              <div className="tracker-results-wrapper-pro">
                
                {/* 1. SECCIÓN DE ORDEN ACTIVA */}
                {foundTurn ? (
                  <div className="vehicle-status-sheet">
                    <div className="status-header-pro">
                      <div className="status-car-title">
                        <h3>{foundTurn.carModel}</h3>
                        <span className="plate-badge-tracker">{foundTurn.carPlate}</span>
                      </div>
                      <div className="status-order-badge">
                        Orden Activa: {foundTurn.id}
                      </div>
                    </div>

                    {/* Línea de Tiempo de 6 Etapas */}
                    <div className="status-timeline-wrapper">
                      <div className="timeline-progress-line">
                        <div 
                          className="progress-line-fill" 
                          style={{ '--progress-percent': `${((Math.max((foundTurn.trackingStage || 1) - 1, 0)) / 5) * 100}%` }}
                        />
                      </div>
                      <div className="timeline-steps-container">
                        {STAGES.map((st) => {
                          const status = getStageStatus(st.step);
                          const Icon = st.icon;

                          return (
                            <div key={st.step} className={`timeline-step-pro ${status}`}>
                              <div className="step-circle-icon">
                                <Icon size={18} />
                              </div>
                              <span className="step-label-txt">{st.label}</span>
                              <span className="step-desc-txt">{st.desc}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Resumen Detallado */}
                    <div className="status-summary-details">
                      <h4>Detalle de Recepción</h4>
                      <div className="summary-fields-grid">
                        <div>
                          <span>Propietario</span>
                          <strong>{foundTurn.name}</strong>
                        </div>
                        <div>
                          <span>Ingreso</span>
                          <strong>{new Date(foundTurn.date.split("-")[0], foundTurn.date.split("-")[1] - 1, foundTurn.date.split("-")[2]).toLocaleDateString("es-AR")} - {foundTurn.time} hs</strong>
                        </div>
                        <div style={{ gridColumn: '1 / -1' }}>
                          <span>Servicios Solicitados</span>
                          <strong className="services-list-comma">
                            {foundTurn.services.map(s => s.name).join(', ')}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="no-active-order-sheet">
                    <AlertCircle size={28} className="no-active-icon" />
                    <div className="no-active-text">
                      <h4>Sin trabajos activos en curso</h4>
                      <p>El vehículo no registra ninguna orden de reparación pendiente o en elevador en este momento.</p>
                    </div>
                  </div>
                )}

                {/* 2. HISTORIAL CLÍNICO Y VISITAS PASADAS */}
                {pastTurns.length > 0 && (
                  <div className="past-turns-history-section">
                    <h3>Historial Clínico del Vehículo</h3>
                    <p className="history-subtitle">Registro de visitas y reparaciones anteriores finalizadas.</p>
                    
                    <div className="history-accordion-stack">
                      {pastTurns.map((pt) => {
                        const isOpen = activeAccordionId === pt.id;
                        const warranty = calculateWarranty(pt);

                        return (
                          <div key={pt.id} className={`history-accordion-item ${isOpen ? 'open' : ''}`}>
                            <div className="accordion-trigger" onClick={() => toggleAccordion(pt.id)}>
                              <div className="trigger-left">
                                <span className="history-date">
                                  {new Date(pt.date.split("-")[0], pt.date.split("-")[1] - 1, pt.date.split("-")[2]).toLocaleDateString("es-AR")}
                                </span>
                                <span className="history-order-id">{pt.id}</span>
                                <strong className="history-price">${pt.totalPrice.toLocaleString("es-AR")}</strong>
                              </div>
                              <div className="trigger-right">
                                <span className={`warranty-badge ${warranty.isActive ? 'active' : 'expired'}`}>
                                  {warranty.isActive ? '🛡️ Garantía Vigente' : '✕ Garantía Expirada'}
                                </span>
                                <span className="accordion-chevron">▼</span>
                              </div>
                            </div>

                            <AnimatePresence initial={false}>
                              {isOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  className="accordion-content-wrapper"
                                >
                                  <div className="accordion-content-body">
                                    <div className="history-services-summary">
                                      <h5>Servicios Realizados</h5>
                                      <ul>
                                        {pt.services.map((s, idx) => (
                                          <li key={idx}>
                                            <span className="dot" style={{ backgroundColor: s.id.startsWith('bod') ? 'var(--neon-orange)' : 'var(--electric-cyan)' }} />
                                            <span className="name">{s.name}</span>
                                            <span className="price">${s.price.toLocaleString("es-AR")}</span>
                                          </li>
                                        ))}
                                      </ul>
                                    </div>

                                    {pt.notes && (
                                      <div className="history-notes-box">
                                        <h5>Notas del Especialista</h5>
                                        <p>{pt.notes}</p>
                                      </div>
                                    )}

                                    <div className="history-warranty-details">
                                      <span>Cobertura de Garantía Oficial:</span>
                                      <strong>{warranty.text}</strong>
                                      <span className="warranty-months-hint">({warranty.months} meses por contrato)</span>
                                    </div>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

              </div>
            ) : (
              <div className="tracker-not-found">
                <ShieldAlert size={42} className="alert-icon-pro" />
                <h3>Patente no registrada</h3>
                <p>No encontramos ninguna orden de trabajo ni historial de visitas registrado para la patente <strong>{searchPlate.toUpperCase()}</strong>.</p>
                <p className="contact-shop-hint">Por favor, verificá que los datos ingresados sean correctos o comunicate con el taller.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
