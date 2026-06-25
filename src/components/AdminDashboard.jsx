import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, AlertTriangle, BadgeDollarSign, Radio, HardDrive, MessageSquare, Copy, Send, X, BarChart3, ChevronDown, ChevronUp, Printer } from 'lucide-react';
import './AdminDashboard.css';

export default function AdminDashboard({ turnsList, onUpdateTurnStatus, onUpdateTurnStage, onPrintTurn, logs, onAddLog }) {
  // Drag-and-drop state
  const [draggedId, setDraggedId] = useState(null);
  
  // Estados para WhatsApp y Estadísticas
  const [notifyTurn, setNotifyTurn] = useState(null);
  const [showStats, setShowStats] = useState(false);
  const [copied, setCopied] = useState(false);

  const getKPIs = () => {
    const total = turnsList.length;
    const pending = turnsList.filter(t => t.status === 'pending').length;
    const revenue = turnsList.reduce((sum, t) => sum + t.totalPrice, 0);
    return { total, pending, revenue };
  };

  const { total, pending, revenue } = getKPIs();

  const getOccupiedElevators = () => {
    return turnsList.filter(t => t.status === 'in-progress').length;
  };

  const occupiedCount = getOccupiedElevators();
  const maxElevators = 4;
  const occupancyPercent = Math.min((occupiedCount / maxElevators) * 100, 100);

  const getOccupancyColor = () => {
    if (occupancyPercent >= 100) return 'var(--danger-red)';
    if (occupancyPercent >= 75) return 'var(--neon-orange)';
    return 'var(--success-green)';
  };

  // Drag and Drop handlers
  const handleDragStart = (e, turnId) => {
    setDraggedId(turnId);
    e.dataTransfer.setData('text/plain', turnId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    const turnId = e.dataTransfer.getData('text/plain') || draggedId;
    if (!turnId) return;

    const turn = turnsList.find(t => t.id === turnId);
    if (turn && turn.status !== targetStatus) {
      // Al mover de columna, recalculamos su stage por defecto
      let defaultStage = 1;
      if (targetStatus === 'in-progress') defaultStage = 3;
      else if (targetStatus === 'completed') defaultStage = 6;
      
      onUpdateTurnStatus(turnId, targetStatus, defaultStage);
      setDraggedId(null);
    }
  };

  // Generar plantilla de WhatsApp según estado
  const generateWhatsAppMessage = (turn) => {
    if (!turn) return "";
    const dateParts = turn.date.split("-");
    const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;
    const servicesText = turn.services.map(s => s.name).join(", ");
    
    if (turn.status === 'pending') {
      return `Hola *${turn.name}*, confirmamos tu turno en *Los Porteños (Electricidad, Chapa y Pintura)* para el día *${formattedDate}* a las *${turn.time} hs*. Orden de Trabajo: *${turn.id}*.\n\nServicio programado: _${servicesText}_.\n\nTe esperamos con tu *${turn.carModel}* (Patente: *${turn.carPlate}*).`;
    }
    if (turn.status === 'in-progress') {
      return `Hola *${turn.name}*, te informamos que tu *${turn.carModel}* (Patente: *${turn.carPlate}*) ya ingresó al elevador en *Los Porteños* y se encuentra en proceso de reparación/diagnóstico.\n\nDetalle del trabajo: _${servicesText}_.\n\nTe avisaremos por este medio cuando esté listo.`;
    }
    return `¡Hola *${turn.name}*! Excelentes noticias: tu *${turn.carModel}* (Patente: *${turn.carPlate}*) ya está listo para retirar en *Los Porteños*.\n\nCosto total del servicio: *$${turn.totalPrice.toLocaleString("es-AR")}*.\n\nPodés pasar a buscarlo dentro de nuestros horarios de atención. ¡Te esperamos!`;
  };

  const handleCopyMessage = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendWhatsAppReal = (turn, text) => {
    const cleanPhone = turn.phone.replace(/[^0-9]/g, '');
    const phoneWithCountry = cleanPhone.length === 10 ? `549${cleanPhone}` : cleanPhone;
    const url = `https://api.whatsapp.com/send?phone=${phoneWithCountry}&text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  // --- Lógica de Estadísticas (SVG Gráficos) ---
  const getStatsData = () => {
    const chapaCount = turnsList.filter(t => t.services.some(s => s.id.startsWith('bod'))).length;
    const elecCount = turnsList.length - chapaCount;
    const totalCount = turnsList.length || 1;
    
    const elecPercent = Math.round((elecCount / totalCount) * 100);
    const chapaPercent = Math.round((chapaCount / totalCount) * 100);

    const daysWeek = ["Lun", "Mar", "Mie", "Jue", "Vie", "Sab"];
    const dailyRev = { Lun: 0, Mar: 0, Mie: 0, Jue: 0, Vie: 0, Sab: 0 };
    
    turnsList.forEach(t => {
      const d = new Date(t.date.split("-")[0], t.date.split("-")[1] - 1, t.date.split("-")[2]);
      const dayName = d.toLocaleDateString("es-AR", { weekday: 'short' });
      const key = dayName.substring(0, 3).replace(/^\w/, c => c.toUpperCase());
      if (dailyRev[key] !== undefined) {
        dailyRev[key] += t.totalPrice;
      }
    });

    const maxRev = Math.max(...Object.values(dailyRev), 50000);

    return {
      elecPercent,
      chapaPercent,
      elecCount,
      chapaCount,
      dailyRev,
      maxRev,
      daysWeek
    };
  };

  const stats = getStatsData();

  const getStageLabel = (stage) => {
    if (stage === 3) return 'En Reparación/Chapa';
    if (stage === 4) return 'En Cabina de Pintura';
    return 'Control de Calidad';
  };

  return (
    <div className="admin-dashboard-pro">
      {/* KPIs Area */}
      <div className="admin-kpis-pro">
        <div className="kpi-card-pro card-total">
          <div className="kpi-icon-pro bg-blue">
            <Users size={22} />
          </div>
          <div className="kpi-data-pro">
            <span className="kpi-title-pro">Turnos Activos</span>
            <h3>{total}</h3>
          </div>
        </div>

        <div className="kpi-card-pro card-pending">
          <div className="kpi-icon-pro bg-yellow">
            <AlertTriangle size={22} />
          </div>
          <div className="kpi-data-pro">
            <span className="kpi-title-pro">Pendientes</span>
            <h3>{turnsList.filter(t => t.status === 'pending').length}</h3>
          </div>
        </div>

        <div className="kpi-card-pro card-revenue">
          <div className="kpi-icon-pro bg-green">
            <BadgeDollarSign size={22} />
          </div>
          <div className="kpi-data-pro">
            <span className="kpi-title-pro">Presupuesto Estimado</span>
            <h3 className="mono-text">${revenue.toLocaleString("es-AR")}</h3>
          </div>
        </div>
      </div>

      {/* --- PANEL DE ESTADÍSTICAS COLAPSABLE --- */}
      <div className="side-card-pro stats-collapsible-container">
        <div className="stats-accordion-header" onClick={() => setShowStats(!showStats)}>
          <div className="stats-accordion-title">
            <BarChart3 size={18} className="side-icon" />
            <h4>Estadísticas de Productividad</h4>
          </div>
          {showStats ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>

        <AnimatePresence>
          {showStats && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="stats-accordion-content"
            >
              <div className="stats-charts-layout">
                {/* Gráfico Donut (SVG) */}
                <div className="chart-wrapper donut-chart-pro">
                  <h5>Distribución de Especialidades</h5>
                  <div className="donut-svg-container">
                    <svg viewBox="0 0 120 120" width="120" height="120">
                      <circle cx="60" cy="60" r="45" fill="none" stroke="var(--border-color)" strokeWidth="12" />
                      
                      <circle 
                        cx="60" 
                        cy="60" 
                        r="45" 
                        fill="none" 
                        stroke="var(--electric-cyan)" 
                        strokeWidth="12"
                        strokeDasharray="282.7" 
                        strokeDashoffset={282.7 - (282.7 * stats.elecPercent) / 100}
                        transform="rotate(-90 60 60)"
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                      />
                    </svg>
                    <div className="donut-center-text">
                      <strong>{stats.elecPercent}%</strong>
                      <span>Electricidad</span>
                    </div>
                  </div>
                  <div className="chart-legend">
                    <div>
                      <span className="legend-dot cyan"></span>
                      <span>Electricidad ({stats.elecCount})</span>
                    </div>
                    <div>
                      <span className="legend-dot orange"></span>
                      <span>Chapa y Pintura ({stats.chapaCount})</span>
                    </div>
                  </div>
                </div>

                {/* Gráfico de Barras de Ingresos (SVG) */}
                <div className="chart-wrapper bar-chart-pro">
                  <h5>Ingresos por Día de la Semana</h5>
                  <div className="bar-chart-container">
                    <svg viewBox="0 0 320 150" width="100%" height="150">
                      <line x1="20" y1="130" x2="310" y2="130" stroke="var(--border-color)" strokeWidth="1.5" />
                      
                      {stats.daysWeek.map((day, idx) => {
                        const amount = stats.dailyRev[day] || 0;
                        const barHeight = (amount / stats.maxRev) * 100;
                        const x = 35 + idx * 45;
                        const y = 130 - barHeight;

                        return (
                          <g key={day} className="bar-group">
                            <rect 
                              x={x} 
                              y={y} 
                              width="22" 
                              height={barHeight} 
                              fill="url(#barGradient)" 
                              rx="3"
                              className="svg-bar-rect"
                            />
                            <text x={x + 11} y="145" textAnchor="middle" fill="var(--text-secondary)" fontSize="9" fontWeight="700">
                              {day}
                            </text>
                            <text x={x + 11} y={y - 8} textAnchor="middle" fill="var(--electric-cyan)" fontSize="8" fontWeight="800" className="bar-value-popup">
                              ${amount > 1000 ? `${(amount / 1000).toFixed(0)}k` : amount}
                            </text>
                          </g>
                        );
                      })}
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="var(--electric-cyan)" />
                          <stop offset="100%" stopColor="var(--electric-blue)" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Grid */}
      <div className="admin-main-grid-pro">
        {/* Kanban Board */}
        <div className="kanban-wrapper-pro">
          <div className="kanban-header-pro">
            <h3>Tablero de Estado del Taller</h3>
            <p>Arrastrá y soltá las tarjetas para mover los vehículos en reparación.</p>
          </div>

          <div className="kanban-columns-grid">
            {/* Columna: Pendientes */}
            <div 
              className="kanban-column-pro"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'pending')}
            >
              <div className="column-title-pro">
                <h4>PENDIENTES DE INGRESO</h4>
                <span className="column-badge">{turnsList.filter(t => t.status === 'pending').length}</span>
              </div>
              <div className="kanban-cards-stack">
                <AnimatePresence>
                  {turnsList
                    .filter(t => t.status === 'pending')
                    .map(turn => (
                      <motion.div
                        layout
                        key={turn.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, turn.id)}
                        className="turn-kanban-card"
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      >
                        <div className="card-top-info">
                          <span className="order-tag">{turn.id}</span>
                          <div className="card-top-actions">
                            <button 
                              type="button" 
                              onClick={() => onPrintTurn(turn)}
                              className="btn-print-invoice"
                              title="Imprimir Ficha PDF"
                            >
                              <Printer size={13} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setNotifyTurn(turn)}
                              className="btn-wa-notify"
                              title="Notificar por WhatsApp"
                            >
                              <MessageSquare size={13} />
                            </button>
                            <span className="time-tag">{turn.time} hs</span>
                          </div>
                        </div>
                        <h4>{turn.name}</h4>
                        <div className="card-car-details">
                          <span className="plate-badge">{turn.carPlate}</span>
                          <span className="model-label">{turn.carModel}</span>
                        </div>
                        <div className="card-service-tags">
                          {turn.services.map(s => (
                            <span key={s.id} className={`service-bubble ${s.id.startsWith('bod') ? 'orange' : ''}`}>
                              ⚡ {s.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Columna: En Elevador */}
            <div 
              className="kanban-column-pro"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'in-progress')}
            >
              <div className="column-title-pro">
                <h4>EN REPARACIÓN / ELEVADOR</h4>
                <span className="column-badge">{turnsList.filter(t => t.status === 'in-progress').length}</span>
              </div>
              <div className="kanban-cards-stack">
                <AnimatePresence>
                  {turnsList
                    .filter(t => t.status === 'in-progress')
                    .map(turn => (
                      <motion.div
                        layout
                        key={turn.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, turn.id)}
                        className="turn-kanban-card in-repair"
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      >
                        <div className="card-top-info">
                          <span className="order-tag">{turn.id}</span>
                          <div className="card-top-actions">
                            <button 
                              type="button" 
                              onClick={() => onPrintTurn(turn)}
                              className="btn-print-invoice"
                              title="Imprimir Ficha PDF"
                            >
                              <Printer size={13} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setNotifyTurn(turn)}
                              className="btn-wa-notify"
                              title="Notificar por WhatsApp"
                            >
                              <MessageSquare size={13} />
                            </button>
                            <span className="time-tag">{turn.time} hs</span>
                          </div>
                        </div>
                        <h4>{turn.name}</h4>
                        <div className="card-car-details">
                          <span className="plate-badge">{turn.carPlate}</span>
                          <span className="model-label">{turn.carModel}</span>
                        </div>
                        <div className="card-service-tags">
                          {turn.services.map(s => (
                            <span key={s.id} className={`service-bubble blue ${s.id.startsWith('bod') ? 'orange' : ''}`}>
                              ⚡ {s.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>

                        {/* SUB-ESTADOS DE KANBAN PARA EL SEGUIMIENTO */}
                        <div className="card-sub-steps-indicator">
                          {[3, 4, 5].map((step) => (
                            <button
                              type="button"
                              key={step}
                              onClick={(e) => {
                                e.stopPropagation(); // Prevenir que mueva la tarjeta
                                onUpdateTurnStage(turn.id, step);
                              }}
                              className={`sub-step-bullet ${turn.trackingStage === step ? 'active' : ''}`}
                              title={getStageLabel(step)}
                            >
                              <span></span>
                            </button>
                          ))}
                          <span className="active-sub-step-label">
                            {getStageLabel(turn.trackingStage || 3)}
                          </span>
                        </div>

                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Columna: Terminados */}
            <div 
              className="kanban-column-pro"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, 'completed')}
            >
              <div className="column-title-pro">
                <h4>TERMINADOS / RETIRO</h4>
                <span className="column-badge">{turnsList.filter(t => t.status === 'completed').length}</span>
              </div>
              <div className="kanban-cards-stack">
                <AnimatePresence>
                  {turnsList
                    .filter(t => t.status === 'completed')
                    .map(turn => (
                      <motion.div
                        layout
                        key={turn.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, turn.id)}
                        className="turn-kanban-card is-done"
                        exit={{ opacity: 0, scale: 0.9, y: 15 }}
                      >
                        <div className="card-top-info">
                          <span className="order-tag">{turn.id}</span>
                          <div className="card-top-actions">
                            <button 
                              type="button" 
                              onClick={() => onPrintTurn(turn)}
                              className="btn-print-invoice"
                              title="Imprimir Ficha PDF"
                            >
                              <Printer size={13} />
                            </button>
                            <button 
                              type="button" 
                              onClick={() => setNotifyTurn(turn)}
                              className="btn-wa-notify"
                              title="Notificar por WhatsApp"
                            >
                              <MessageSquare size={13} />
                            </button>
                            <span className="time-tag">{turn.time} hs</span>
                          </div>
                        </div>
                        <h4>{turn.name}</h4>
                        <div className="card-car-details">
                          <span className="plate-badge">{turn.carPlate}</span>
                          <span className="model-label">{turn.carModel}</span>
                        </div>
                        <div className="card-service-tags">
                          {turn.services.map(s => (
                            <span key={s.id} className={`service-bubble green`}>
                              ✓ {s.name.split(' ')[0]}
                            </span>
                          ))}
                        </div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Side panels */}
        <div className="admin-side-grid-pro">
          {/* Ocupación de elevadores */}
          <div className="side-card-pro elevator-occupancy-card">
            <div className="side-card-header">
              <HardDrive size={18} className="side-icon" />
              <h4>Elevadores Activos</h4>
            </div>
            <div className="occupancy-body-pro">
              <div className="occupancy-info-labels">
                <span>Elevadores ocupados (Max 4)</span>
                <strong>{occupiedCount} / {maxElevators}</strong>
              </div>
              <div className="occupancy-gauge-bg">
                <div 
                  className="occupancy-gauge-fill" 
                  style={{ 
                    width: `${occupancyPercent}%`,
                    backgroundColor: getOccupancyColor()
                  }}
                />
              </div>
              <p className="occupancy-hint">
                {occupiedCount >= maxElevators 
                  ? '⚠️ Capacidad máxima de elevadores. Reorganizar trabajos.' 
                  : '✓ Elevadores disponibles para ingresar vehículos.'
                }
              </p>
            </div>
          </div>

          {/* Logs / Monitor */}
          <div className="side-card-pro live-monitor-card">
            <div className="side-card-header">
              <Radio size={18} className="side-icon-live" />
              <h4>Diagnóstico en Vivo</h4>
            </div>
            <div className="monitor-logs-stack">
              {logs.length > 0 ? (
                logs.map((log, index) => (
                  <div key={index} className="log-item-pro">
                    <span className="log-time-pro">{log.time}</span>
                    <p className="log-text-pro">{log.message}</p>
                  </div>
                ))
              ) : (
                <div className="empty-logs">
                  <p>Escuchando actividad del taller...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL SIMULADOR DE WHATSAPP --- */}
      <AnimatePresence>
        {notifyTurn && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="wa-modal-overlay"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 30 }}
              className="wa-modal-card"
            >
              <div className="wa-modal-header">
                <h3>Simulador de Notificaciones</h3>
                <button type="button" onClick={() => setNotifyTurn(null)} className="wa-close-btn">
                  <X size={18} />
                </button>
              </div>

              <div className="wa-modal-body">
                <div className="wa-mockup-phone">
                  <div className="phone-screen">
                    <div className="phone-header">
                      <div className="phone-avatar">LP</div>
                      <div className="phone-contact-info">
                        <strong>Los Porteños</strong>
                        <span>En línea</span>
                      </div>
                    </div>
                    <div className="phone-chat-area">
                      <div className="chat-bubble-received">
                        Hola, ¿cuál es el estado de mi auto?
                      </div>
                      <div className="chat-bubble-sent">
                        {generateWhatsAppMessage(notifyTurn)}
                        <span className="chat-time-tick">
                          {new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit' })} ✓✓
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="wa-action-details">
                  <h4>Mensaje Generado ({getStatusLabel(notifyTurn.status)})</h4>
                  <p>Este texto se autogenera según el estado de la reparación en el Kanban.</p>
                  <textarea 
                    readOnly 
                    value={generateWhatsAppMessage(notifyTurn)} 
                    className="wa-text-preview"
                  />
                  <div className="wa-actions-buttons">
                    <button 
                      type="button" 
                      onClick={() => handleCopyMessage(generateWhatsAppMessage(notifyTurn))} 
                      className="btn-secondary copy-btn-wa"
                    >
                      <Copy size={16} />
                      {copied ? '¡Copiado!' : 'Copiar Texto'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => onPrintTurn(notifyTurn)} 
                      className="btn-secondary print-btn-wa"
                      style={{ padding: '0.9rem' }}
                      title="Imprimir Ficha PDF"
                    >
                      <Printer size={16} />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => handleSendWhatsAppReal(notifyTurn, generateWhatsAppMessage(notifyTurn))} 
                      className="btn-primary send-btn-wa"
                    >
                      <Send size={16} />
                      Enviar por WhatsApp
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
