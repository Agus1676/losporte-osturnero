import React, { useState, useEffect } from 'react';
import { ShieldAlert, Zap, X, LogOut, Globe, Lock, Printer } from 'lucide-react';
import ClientWizard from './components/ClientWizard';
import AdminDashboard from './components/AdminDashboard';
import AdminLogin from './components/AdminLogin';
import VehicleTracker from './components/VehicleTracker';
import PrintInvoiceTemplate from './components/PrintInvoiceTemplate';
import Estimator from './components/Estimator';

// Mock data inicial
const MOCK_TURNS = [
  {
    id: "LPE-9321",
    name: "Héctor Cúper",
    phone: "1166554433",
    carModel: "Ford Ranger 3.2",
    carPlate: "AF987LL",
    date: getOffsetDateString(0),
    time: "08:30",
    services: [
      { id: "bat-replace", name: "Batería Moura 12V 75Ah (Colocada)", price: 95000 }
    ],
    totalPrice: 95000,
    status: "in-progress",
    trackingStage: 3,
    notes: "No retiene carga la batería, alternador marca 13.2V en frío."
  },
  {
    id: "LPE-3428",
    name: "Román Riquelme",
    phone: "1199101010",
    carModel: "Toyota Hilux 2019",
    carPlate: "AD410BO",
    date: getOffsetDateString(1),
    time: "13:30",
    services: [
      { id: "ecu-scan", name: "Escaneo Computarizado Completo", price: 25000 },
      { id: "lit-led", name: "Instalación de Kit Cree LED Canbus", price: 22000 }
    ],
    totalPrice: 47000,
    status: "pending",
    trackingStage: 1,
    notes: "Luz de inyección encendida y quiere luces de xenón/LED."
  },
  {
    id: "LPE-5561",
    name: "Ariel Ortega",
    phone: "1177665544",
    carModel: "Fiat Palio 1.4",
    carPlate: "AF123PP",
    date: getOffsetDateString(2),
    time: "10:30",
    services: [
      { id: "bod-dent", name: "Sacabollos Artesanal (PDR)", price: 35000 },
      { id: "bod-paint", name: "Pintura por Paño / Panel", price: 75000 }
    ],
    totalPrice: 110000,
    status: "pending",
    trackingStage: 1,
    notes: "Abolladura con raspón en guardabarros trasero izquierdo."
  },
  {
    id: "LPE-1002",
    name: "Lionel Messi",
    phone: "1110101010",
    carModel: "Audi Q8 2022",
    carPlate: "AE010AR",
    date: getOffsetDateString(-1),
    time: "15:30",
    services: [
      { id: "bod-polish", name: "Tratamiento Acrílico & Lustrado", price: 55000 }
    ],
    totalPrice: 55000,
    status: "completed",
    trackingStage: 6,
    notes: "Hacer pulido para sacar detalles superficiales de laca."
  },
  {
    id: "LPE-8411",
    name: "Román Riquelme",
    phone: "1199101010",
    carModel: "Toyota Hilux 2019",
    carPlate: "AD410BO",
    date: "2026-02-15",
    time: "10:00",
    services: [
      { id: "ecu-scan", name: "Escaneo Computarizado Completo", price: 25000 }
    ],
    totalPrice: 25000,
    status: "completed",
    trackingStage: 6,
    notes: "Diagnóstico inicial por luz de inyección. Se solucionó limpiando terminales sulfatados de la ECU."
  },
  {
    id: "LPE-4122",
    name: "Ariel Ortega",
    phone: "1177665544",
    carModel: "Fiat Palio 1.4",
    carPlate: "AF123PP",
    date: "2025-08-20",
    time: "14:30",
    services: [
      { id: "bat-replace", name: "Batería Moura 12V 75Ah (Colocada)", price: 95000 }
    ],
    totalPrice: 95000,
    status: "completed",
    trackingStage: 6,
    notes: "Reemplazo de batería por agotamiento. Cuenta con 18 meses de garantía."
  },
  {
    id: "LPE-2211",
    name: "Lionel Messi",
    phone: "1110101010",
    carModel: "Audi Q8 2022",
    carPlate: "AE010AR",
    date: "2025-04-10",
    time: "09:00",
    services: [
      { id: "com-alarm", name: "Instalación de Alarma Volumétrica", price: 75000 }
    ],
    totalPrice: 75000,
    status: "completed",
    trackingStage: 6,
    notes: "Instalación de kit oficial de alarma volumétrica."
  }
];

function getOffsetDateString(daysOffset) {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  return d.toISOString().split("T")[0];
}

export default function App() {
  const [view, setView] = useState('booking'); // booking | tracking | estimator | admin
  const [turns, setTurns] = useState([]);
  const [logs, setLogs] = useState([]);
  const [toast, setToast] = useState({ show: false, title: '', message: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [wizardKey, setWizardKey] = useState(0);
  const [activePrintTurn, setActivePrintTurn] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem("los_portenos_theme") || "electric");
  const [preloadedServices, setPreloadedServices] = useState([]);

  // Aplicar tema en body
  useEffect(() => {
    document.body.className = `theme-${theme}`;
    localStorage.setItem("los_portenos_theme", theme);
  }, [theme]);

  // Cargar base de datos local al iniciar
  useEffect(() => {
    const saved = localStorage.getItem("los_portenos_turns_pro");
    if (saved) {
      setTurns(JSON.parse(saved));
    } else {
      setTurns(MOCK_TURNS);
      localStorage.setItem("los_portenos_turns_pro", JSON.stringify(MOCK_TURNS));
    }

    // Logs iniciales
    setLogs([
      { time: getFormattedTime(), message: "Sistema de diagnóstico e ingreso iniciado." },
      { time: getFormattedTime(), message: "Módulos de Electricidad, Chapa y Pintura activos." }
    ]);
  }, []);

  function getFormattedTime() {
    return new Date().toLocaleTimeString("es-AR", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  }

  // Persistir en LocalStorage al cambiar turnos
  const saveTurns = (updatedTurns) => {
    setTurns(updatedTurns);
    localStorage.setItem("los_portenos_turns_pro", JSON.stringify(updatedTurns));
  };

  const handleAddLog = (message) => {
    const newLog = {
      time: getFormattedTime(),
      message
    };
    setLogs(prev => [newLog, ...prev.slice(0, 10)]);
  };

  // Crear nuevo turno (Client)
  const handleAddTurn = (newTurn) => {
    // Al crearse, le asignamos por defecto trackingStage = 1 (Ingresado)
    const turnWithStage = { ...newTurn, trackingStage: 1 };
    const updated = [turnWithStage, ...turns];
    saveTurns(updated);
    
    // Alerta de Notificación
    handleAddLog(`Nuevo Turno Recibido: ${newTurn.id} (${newTurn.carPlate}) para ${newTurn.time} hs.`);
    
    // Disparar Toast
    setToast({
      show: true,
      title: "Nuevo Turno Recibido ⚡",
      message: `${newTurn.name} - ${newTurn.carModel} (${newTurn.carPlate})`
    });

    // Autoocultar toast
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 5000);
  };

  // Cambiar estado del turno (Admin Kanban)
  const handleUpdateStatus = (turnId, newStatus, newStage) => {
    const updated = turns.map(t => {
      if (t.id === turnId) {
        let stage = newStage;
        if (!stage) {
          if (newStatus === 'pending') stage = 1;
          else if (newStatus === 'in-progress') stage = 3;
          else if (newStatus === 'completed') stage = 6;
        }
        handleAddLog(`Vehículo ${t.carPlate} movido a: ${getStatusLabel(newStatus)}.`);
        return { ...t, status: newStatus, trackingStage: stage };
      }
      return t;
    });
    saveTurns(updated);
  };

  const handleUpdateStage = (turnId, newStage) => {
    const updated = turns.map(t => {
      if (t.id === turnId) {
        handleAddLog(`Vehículo ${t.carPlate} actualizado a etapa: ${getStageLabel(newStage)}.`);
        return { ...t, trackingStage: newStage };
      }
      return t;
    });
    saveTurns(updated);
  };

  const getStageLabel = (stage) => {
    const labels = {
      1: 'Ingresado',
      2: 'En Diagnóstico',
      3: 'Chapa/Reparación',
      4: 'Cabina de Pintura',
      5: 'Control de Calidad',
      6: 'Listo para Entrega'
    };
    return labels[stage] || 'Desconocido';
  };

  const getStatusLabel = (status) => {
    if (status === 'pending') return 'Pendiente de Ingreso';
    if (status === 'in-progress') return 'En Elevador';
    return 'Terminado / Entregado';
  };

  const handlePrintTurn = (turn) => {
    setActivePrintTurn(turn);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    handleAddLog("Administrador inició sesión con éxito.");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    handleAddLog("Administrador cerró sesión.");
  };

  const handleSelectQuote = (services) => {
    setPreloadedServices(services);
    setView('booking');
    setWizardKey(prev => prev + 1);
    handleAddLog(`Pre-cargados ${services.length} servicios desde el cotizador.`);
  };

  const handleLogoClick = () => {
    setView('booking');
    setPreloadedServices([]);
    setWizardKey(prev => prev + 1);
  };

  return (
    <>
      <div id="print-template">
        {activePrintTurn && <PrintInvoiceTemplate turn={activePrintTurn} />}
      </div>

      <div id="app-root-container">
        <header className="app-header">
          <div className="logo-container" onClick={handleLogoClick} style={{ cursor: 'pointer', userSelect: 'none' }}>
            <div className="logo-icon">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <h1 style={{ lineHeight: 1.1 }}>LOS PORTEÑOS</h1>
              <span className="logo-tag" style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem' }}>ELECTRICIDAD, CHAPA Y PINTURA</span>
            </div>
          </div>
          <nav className="view-toggle" style={{ alignItems: 'center', gap: '0.5rem' }}>
            <button 
              type="button"
              onClick={() => { setView('booking'); setPreloadedServices([]); }}
              className={`toggle-btn ${view === 'booking' ? 'active' : ''}`}
            >
              <Globe size={14} />
              Reservar Turno
            </button>
            <button 
              type="button"
              onClick={() => setView('tracking')}
              className={`toggle-btn ${view === 'tracking' ? 'active' : ''}`}
            >
              Seguimiento
            </button>
            <button 
              type="button"
              onClick={() => setView('estimator')}
              className={`toggle-btn ${view === 'estimator' ? 'active' : ''}`}
            >
              Cotizador
            </button>

            <span style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }}></span>

            {/* Selector de Temas */}
            <div className="theme-switcher-nav" style={{ display: 'flex', gap: '0.2rem', backgroundColor: 'var(--bg-main)', padding: '0.2rem', borderRadius: '8px', border: '1px solid var(--border-color)', height: '34px', alignItems: 'center' }}>
              <button 
                type="button"
                onClick={() => setTheme('electric')}
                className={`theme-btn ${theme === 'electric' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', color: theme === 'electric' ? 'var(--electric-cyan)' : 'var(--text-secondary)', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                title="Tema Eléctrico"
              >
                ⚡
              </button>
              <button 
                type="button"
                onClick={() => setTheme('paint')}
                className={`theme-btn ${theme === 'paint' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', color: theme === 'paint' ? 'var(--neon-orange)' : 'var(--text-secondary)', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                title="Tema Chapa y Pintura"
              >
                🔥
              </button>
              <button 
                type="button"
                onClick={() => setTheme('steel')}
                className={`theme-btn ${theme === 'steel' ? 'active' : ''}`}
                style={{ background: 'none', border: 'none', color: theme === 'steel' ? 'var(--text-primary)' : 'var(--text-secondary)', padding: '0.3rem 0.5rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 'bold' }}
                title="Tema Gris Acero"
              >
                ⚙️
              </button>
            </div>

            <span style={{ width: '1px', height: '20px', backgroundColor: 'var(--border-color)', margin: '0 0.25rem' }}></span>

            {view !== 'admin' ? (
              <button 
                type="button"
                onClick={() => setView('admin')}
                className="toggle-btn"
                style={{ border: '1px solid var(--border-color)' }}
              >
                <Lock size={14} />
                Panel Admin
              </button>
            ) : (
              <>
                {isAuthenticated && (
                  <button 
                    type="button" 
                    onClick={handleLogout}
                    className="btn-secondary"
                    style={{ padding: '0.5rem', borderRadius: '10px', height: '38px', border: '1px solid var(--border-color)' }}
                    title="Cerrar Sesión"
                  >
                    <LogOut size={16} />
                  </button>
                )}
              </>
            )}
          </nav>
        </header>

        <main className="app-content">
          {view === 'booking' && (
            <ClientWizard 
              key={wizardKey}
              onSubmitBooking={handleAddTurn}
              turnsList={turns}
              onPrintTurn={handlePrintTurn}
              preloadedServices={preloadedServices}
            />
          )}
          {view === 'tracking' && (
            <VehicleTracker 
              turnsList={turns}
            />
          )}
          {view === 'estimator' && (
            <Estimator 
              onSelectQuote={handleSelectQuote}
              onPrintQuote={handlePrintTurn}
            />
          )}
          {view === 'admin' && (
            isAuthenticated ? (
              <AdminDashboard 
                turnsList={turns}
                onUpdateTurnStatus={handleUpdateStatus}
                onUpdateTurnStage={handleUpdateStage}
                onPrintTurn={handlePrintTurn}
                logs={logs}
                onAddLog={handleAddLog}
              />
            ) : (
              <AdminLogin 
                onLoginSuccess={handleLoginSuccess}
              />
            )
          )}
        </main>

        <footer className="app-footer" style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)', fontSize: '0.85rem', borderTop: '1px solid var(--border-color)', marginTop: 'auto' }}>
          <p>Sitio web desarrollado por <strong>Agustin Pollan</strong></p>
        </footer>

        {/* Toast Notification */}
        {toast.show && (
          <div className="toast show">
            <div className="toast-content">
              <Zap size={20} fill="currentColor" />
              <div className="toast-text">
                <span className="toast-title">{toast.title}</span>
                <span className="toast-message">{toast.message}</span>
              </div>
            </div>
            <button 
              type="button" 
              className="toast-close" 
              onClick={() => setToast(prev => ({ ...prev, show: false }))}
            >
              <X size={16} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
