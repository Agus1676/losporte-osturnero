import React, { useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import './MetalTicket.css';

export default function MetalTicket({ name, carModel, carPlate, date, time, services, totalPrice, barcode }) {
  const ticketRef = useRef(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [showShine, setShowShine] = useState(false);

  // Efecto Parallax Tilt 3D con brillo dinámico
  const handleMouseMove = (e) => {
    if (!ticketRef.current) return;
    const card = ticketRef.current;
    const box = card.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Rotación máxima de 10 grados
    const rx = -(y / (box.height / 2)) * 10;
    const ry = (x / (box.width / 2)) * 10;

    setRotate({ x: rx, y: ry });
  };

  const handleMouseEnter = () => {
    setShowShine(true);
  };

  const handleMouseLeave = () => {
    setShowShine(false);
    setRotate({ x: 0, y: 0 });
  };

  const getFormattedDate = () => {
    if (!date) return '-';
    const parts = date.split("-");
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("es-AR");
  };

  return (
    <div className="ticket-wrapper-pro">
      <div 
        ref={ticketRef}
        className="metal-ticket-pro"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${rotate.x}deg) rotateY(${rotate.y}deg)`,
          transition: showShine ? 'none' : 'transform 0.5s ease'
        }}
      >
        {/* Capa de brillo reflectivo dinámico */}
        {showShine && (
          <div 
            className="ticket-shine"
            style={{
              background: `radial-gradient(circle 250px at ${rotate.y * 10 + 200}px ${-rotate.x * 10 + 250}px, rgba(255, 255, 255, 0.08), transparent)`
            }}
          />
        )}

        <div className="ticket-header-pro">
          <div className="ticket-logo-pro">
            <span className="lightning-icon">⚡</span>
            <span>LOS PORTEÑOS</span>
          </div>
          <div className="ticket-badge-electrical">
            ELECTRICIDAD
          </div>
        </div>

        <div className="ticket-content-pro">
          <div className="ticket-headline-section">
            <div className="ticket-type-label">ORDEN DE TRABAJO AUTOMOTRIZ</div>
            <div className="ticket-order-id-badge">{barcode}</div>
          </div>

          <div className="ticket-info-grid-pro">
            <div className="info-item-pro">
              <span className="info-label-pro">Cliente</span>
              <span className="info-value-pro">{name || '-'}</span>
            </div>
            <div className="info-item-pro">
              <span className="info-label-pro">Vehículo</span>
              <span className="info-value-pro">{carModel || '-'}</span>
            </div>
            <div className="info-item-pro">
              <span className="info-label-pro">Patente</span>
              <span className="info-value-pro plate-highlight">{carPlate || '-'}</span>
            </div>
            <div className="info-item-pro">
              <span className="info-label-pro">Programación</span>
              <span className="info-value-pro">{getFormattedDate()} {time ? `- ${time} hs` : ''}</span>
            </div>
          </div>

          <div className="ticket-divider-pro"></div>

          <div className="ticket-diagnostics-list">
            <span className="info-label-pro">Servicios Eléctricos Programados</span>
            {services && services.length > 0 ? (
              <ul>
                {services.map(s => (
                  <li key={s.id}>
                    <span className="service-name-bullet">⚡ {s.name}</span>
                    <span className="service-price-bullet">${s.price.toLocaleString("es-AR")}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="no-services-warning">Sin servicios seleccionados</p>
            )}
          </div>

          <div className="ticket-divider-pro"></div>

          <div className="ticket-footer-pro">
            <div className="price-section-pro">
              <span className="info-label-pro">TOTAL PRESUPUESTADO</span>
              <span className="final-price-pro">${totalPrice.toLocaleString("es-AR")}</span>
            </div>
            <div className="barcode-section-pro">
              <div className="barcode-lines-pro">
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
                <span></span><span></span><span></span><span></span><span></span>
              </div>
              <span className="barcode-number-pro">{barcode}</span>
            </div>
          </div>
        </div>

        {/* Indicador de Garantía */}
        <div className="ticket-guarantee-badge">
          <ShieldCheck size={12} />
          <span>Garantía Oficial de Servicio</span>
        </div>
      </div>
    </div>
  );
}
