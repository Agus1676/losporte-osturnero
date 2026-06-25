import React from 'react';
import './PrintInvoiceTemplate.css';

export default function PrintInvoiceTemplate({ turn }) {
  if (!turn) return null;

  const getFormattedDate = (dateStr) => {
    if (!dateStr) return '';
    const parts = dateStr.split("-");
    if (parts.length < 3) return dateStr;
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    return d.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  const getSubtotal = () => {
    return turn.totalPrice / 1.21;
  };

  const getIva = () => {
    return turn.totalPrice - getSubtotal();
  };

  return (
    <div className="invoice-print-container">
      {/* Header Comercial */}
      <div className="invoice-header">
        <div className="invoice-company">
          <div className="invoice-logo">
            <span className="lightning-icon">⚡</span>
            <h2>LOS PORTEÑOS</h2>
          </div>
          <p className="company-desc">Electricidad, Chapa y Pintura del Automotor</p>
          <p className="company-details">Av. Warnes 1450, CABA | Tel: 11-4588-9900</p>
          <p className="company-details">info@losportenos.com.ar | www.losportenos.com.ar</p>
        </div>
        <div className="invoice-title-block">
          <div className="invoice-badge">FICHA DE TRABAJO</div>
          <div className="invoice-meta-item">
            <span>Orden N°:</span>
            <strong>{turn.id}</strong>
          </div>
          <div className="invoice-meta-item">
            <span>Fecha Emisión:</span>
            <strong>{getFormattedDate(turn.date)}</strong>
          </div>
          <div className="invoice-meta-item">
            <span>Hora Recepción:</span>
            <strong>{turn.time} hs</strong>
          </div>
        </div>
      </div>

      <div className="invoice-divider" />

      {/* Bloque Cliente & Vehículo */}
      <div className="invoice-grid-details">
        <div className="details-box">
          <h3>DATOS DEL CLIENTE</h3>
          <div className="detail-row">
            <span>Nombre:</span>
            <strong>{turn.name}</strong>
          </div>
          <div className="detail-row">
            <span>Teléfono:</span>
            <strong>{turn.phone}</strong>
          </div>
        </div>
        <div className="details-box">
          <h3>DATOS DEL VEHÍCULO</h3>
          <div className="detail-row">
            <span>Modelo:</span>
            <strong>{turn.carModel}</strong>
          </div>
          <div className="detail-row">
            <span>Patente:</span>
            <strong className="plate-txt">{turn.carPlate}</strong>
          </div>
        </div>
      </div>

      {/* Tabla de Servicios */}
      <div className="invoice-services-table">
        <h3>DESGLOSE DE SERVICIOS PREVISTOS</h3>
        <table>
          <thead>
            <tr>
              <th className="text-left">Descripción del Trabajo</th>
              <th className="text-right">Especialidad</th>
              <th className="text-right">Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {turn.services && turn.services.map((srv, idx) => (
              <tr key={srv.id || idx}>
                <td className="text-left">{srv.name}</td>
                <td className="text-right">{srv.id.startsWith('bod') ? 'Chapa y Pintura' : 'Electricidad'}</td>
                <td className="text-right">${srv.price.toLocaleString("es-AR")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Notas/Observaciones */}
      {turn.notes && (
        <div className="invoice-notes-section">
          <h3>SÍNTOMAS / OBSERVACIONES ADICIONALES</h3>
          <p>{turn.notes}</p>
        </div>
      )}

      {/* Totales */}
      <div className="invoice-totals-section">
        <div className="totals-box">
          <div className="total-row-item">
            <span>Subtotal (Neto):</span>
            <span>${getSubtotal().toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="total-row-item">
            <span>I.V.A. (21%):</span>
            <span>${getIva().toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="total-row-item grand-total">
            <span>TOTAL ESTIMADO:</span>
            <span>${turn.totalPrice.toLocaleString("es-AR")}</span>
          </div>
        </div>
      </div>

      <div className="invoice-divider" />

      {/* Términos y Garantías */}
      <div className="invoice-terms">
        <h3>GARANTÍA Y TÉRMINOS DEL TALLER</h3>
        <ul>
          <li><strong>Garantía Oficial:</strong> 18 meses de garantía escrita en reemplazo de baterías Moura. 12 meses de garantía en reparaciones eléctricas e inyección.</li>
          <li><strong>Chapa y Pintura:</strong> Garantía de laca y coincidencia de tono original por 2 años en pintura premium aplicada.</li>
          <li><strong>Presupuestos:</strong> El presente documento es una orden de trabajo preliminar y estimativa basada en la inspección inicial. Cualquier reparación adicional será notificada previamente al cliente.</li>
        </ul>
      </div>

      {/* Firmas y Barcode */}
      <div className="invoice-footer-signatures">
        <div className="signature-area">
          <div className="sig-line"></div>
          <span>Firma del Cliente</span>
        </div>
        <div className="barcode-print-area">
          <div className="barcode-stripes">
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
            <span></span><span></span><span></span><span></span><span></span>
          </div>
          <span className="barcode-txt">{turn.id}</span>
        </div>
        <div className="signature-area">
          <div className="sig-line"></div>
          <span>Firma Responsable Los Porteños</span>
        </div>
      </div>
    </div>
  );
}
