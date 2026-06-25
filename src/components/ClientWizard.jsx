import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronRight, ChevronLeft, Bolt, Zap, Paintbrush, HelpCircle, Printer } from 'lucide-react';
import CarVisualizer from './CarVisualizer';
import CalendarPicker from './CalendarPicker';
import MetalTicket from './MetalTicket';
import './ClientWizard.css';

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

export default function ClientWizard({ onSubmitBooking, turnsList, onPrintTurn, preloadedServices = [] }) {
  const [step, setStep] = useState(1);
  const [serviceCategory, setServiceCategory] = useState(null); // 'electrical' | 'bodywork'
  
  // Estados para el Asistente Inteligente
  const [showAssistant, setShowAssistant] = useState(false);
  const [assistantStep, setAssistantStep] = useState(0);
  const [assistantAnswers, setAssistantAnswers] = useState({
    starts: null,      // yes | no
    electrical: null,  // yes | no
    bodywork: null     // yes | no
  });

  const [selectedPart, setSelectedPart] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [clientData, setClientData] = useState({
    name: '',
    phone: '',
    carModel: '',
    carPlate: '',
    notes: ''
  });
  const [barcode, setBarcode] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (preloadedServices && preloadedServices.length > 0) {
      setSelectedServices(preloadedServices);
      const hasBodywork = preloadedServices.some(s => s.id.startsWith('bod'));
      setServiceCategory(hasBodywork ? 'bodywork' : 'electrical');
      setStep(3); // Salta directamente al Paso 3 (Agenda)
    }
  }, [preloadedServices]);

  const calculateTotal = () => {
    return selectedServices.reduce((sum, s) => sum + s.price, 0);
  };

  const handleSelectCategory = (category) => {
    setServiceCategory(category);
    setSelectedPart(null);
    setSelectedServices([]);
    setStep(2);
  };

  // Lógica de navegación del Asistente
  const startAssistant = () => {
    setShowAssistant(true);
    setAssistantStep(1);
    setAssistantAnswers({ starts: null, electrical: null, bodywork: null });
  };

  const handleAssistantAnswer = (field, answer) => {
    const updatedAnswers = { ...assistantAnswers, [field]: answer };
    setAssistantAnswers(updatedAnswers);

    if (assistantStep < 3) {
      setAssistantStep(assistantStep + 1);
    } else {
      // Procesar respuestas (Motor de Sugerencias)
      processAssistantSuggestions(updatedAnswers);
    }
  };

  const processAssistantSuggestions = (answers) => {
    let category = 'electrical';
    let suggested = [];

    if (answers.bodywork === 'yes') {
      // Prioridad a Chapa y Pintura si tiene daños visuales directos
      category = 'bodywork';
      suggested.push(SERVICES_DATA.bodywork.options.find(o => o.id === 'bod-dent')); // Sacabollos
      setSelectedPart('bodywork');
    } else if (answers.starts === 'no') {
      category = 'electrical';
      suggested.push(SERVICES_DATA.battery.options.find(o => o.id === 'bat-replace')); // Batería
      suggested.push(SERVICES_DATA.ecu.options.find(o => o.id === 'ecu-scan'));       // Escaneo
      setSelectedPart('battery');
    } else if (answers.electrical === 'yes') {
      category = 'electrical';
      suggested.push(SERVICES_DATA.ecu.options.find(o => o.id === 'ecu-scan'));       // Escaneo
      setSelectedPart('ecu');
    } else {
      // Default de diagnóstico eléctrico preventivo
      category = 'electrical';
      suggested.push(SERVICES_DATA.ecu.options.find(o => o.id === 'ecu-scan'));
      setSelectedPart('ecu');
    }

    setServiceCategory(category);
    setSelectedServices(suggested);
    setShowAssistant(false);
    setStep(2); // Salta directamente al Paso 2 con la pre-carga
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setClientData({
      ...clientData,
      [name]: value
    });
  };

  const handleNextStep = () => {
    if (step === 4) {
      const form = document.getElementById('react-booking-form');
      if (form && !form.reportValidity()) return;

      const randNum = Math.floor(1000 + Math.random() * 9000);
      setBarcode(`LPE-${randNum}`);
    }

    if (step === 5) {
      const total = calculateTotal();
      const newTurn = {
        id: barcode,
        name: clientData.name,
        phone: clientData.phone,
        carModel: clientData.carModel,
        carPlate: clientData.carPlate.toUpperCase(),
        date: selectedDate,
        time: selectedTime,
        services: [...selectedServices],
        totalPrice: total,
        status: 'pending',
        notes: clientData.notes,
        createdAt: new Date().toISOString()
      };
      
      onSubmitBooking(newTurn);
      setSuccess(true);
    } else {
      setStep(step + 1);
    }
  };

  const handlePrevStep = () => {
    if (step === 2) {
      setServiceCategory(null);
      setShowAssistant(false);
    }
    setStep(step - 1);
  };

  const resetWizard = () => {
    setStep(1);
    setServiceCategory(null);
    setShowAssistant(false);
    setAssistantStep(0);
    setSelectedPart(null);
    setSelectedServices([]);
    setSelectedDate(null);
    setSelectedTime(null);
    setClientData({
      name: '',
      phone: '',
      carModel: '',
      carPlate: '',
      notes: ''
    });
    setBarcode('');
    setSuccess(false);
  };

  const isStepValid = () => {
    if (step === 1) return serviceCategory !== null;
    if (step === 2) return selectedServices.length > 0;
    if (step === 3) return selectedDate !== null && selectedTime !== null;
    return true;
  };

  const slideVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 25 } },
    exit: { opacity: 0, x: -50, transition: { duration: 0.2 } }
  };

  return (
    <div className="wizard-container-pro">
      {!success && (
        <div className="wizard-steps-pro">
          {[
            { num: '01', label: 'Especialidad' },
            { num: '02', label: 'Servicios' },
            { num: '03', label: 'Agenda' },
            { num: '04', label: 'Detalles' },
            { num: '05', label: 'Confirmación' }
          ].map((item, index) => {
            const stepNum = index + 1;
            const isActive = step === stepNum;
            const isCompleted = step > stepNum;

            return (
              <div 
                key={stepNum} 
                className={`step-indicator-pro ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                onClick={() => isCompleted && setStep(stepNum)}
              >
                <span className="step-num-pro">{stepNum}</span>
                <span className="step-label-pro">{item.label}</span>
              </div>
            );
          })}
        </div>
      )}

      <div className="wizard-panes-pro">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div 
              key="success-screen"
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="success-screen-pro"
            >
              <div className="success-icon-pro">
                <CheckCircle2 size={56} />
              </div>
              <h2>¡Turno Agendado Correctamente!</h2>
              <p>Tu orden de trabajo ha sido registrada con éxito en el sistema.</p>
              <div className="order-id-box-pro">
                Número de Orden: <strong>{barcode}</strong>
              </div>
              <div className="success-actions-pro" style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
                <button 
                  type="button" 
                  onClick={() => {
                    const total = calculateTotal();
                    const currentTurn = {
                      id: barcode,
                      name: clientData.name,
                      phone: clientData.phone,
                      carModel: clientData.carModel,
                      carPlate: clientData.carPlate.toUpperCase(),
                      date: selectedDate,
                      time: selectedTime,
                      services: [...selectedServices],
                      totalPrice: total,
                      status: 'pending',
                      notes: clientData.notes
                    };
                    onPrintTurn(currentTurn);
                  }} 
                  className="btn-secondary"
                >
                  <Printer size={16} />
                  Descargar PDF / Imprimir Ficha
                </button>
                <button type="button" onClick={resetWizard} className="btn-primary">
                  Agendar otro turno
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`step-${step}-${showAssistant}`}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {/* PASO 1: SELECCIONAR CATEGORÍA O ASISTENTE */}
              {step === 1 && (
                !showAssistant ? (
                  <div className="category-selection-pane">
                    <h2 className="pane-headline-pro text-center">¿Qué servicio necesita tu auto?</h2>
                    <p className="pane-subline-pro text-center">Seleccioná una especialidad para iniciar el diagnóstico detallado.</p>
                    
                    <div className="category-cards-grid">
                      <div 
                        className={`category-card-pro ${serviceCategory === 'electrical' ? 'selected' : ''}`}
                        onClick={() => handleSelectCategory('electrical')}
                      >
                        <div className="category-icon bg-cyan">
                          <Zap size={32} />
                        </div>
                        <h3>Electricidad & Electrónica</h3>
                        <p>Problemas de arranque, batería, alternador, ECU, inyección, iluminación y accesorios de cabina.</p>
                      </div>

                      <div 
                        className={`category-card-pro ${serviceCategory === 'bodywork' ? 'selected' : ''}`}
                        onClick={() => handleSelectCategory('bodywork')}
                      >
                        <div className="category-icon bg-orange">
                          <Paintbrush size={32} />
                        </div>
                        <h3>Chapa, Pintura & Estética</h3>
                        <p>Sacabollos en frío (PDR), repintado por paños, soldadura de paragolpes plásticos y lustrado acrílico.</p>
                      </div>

                      <div 
                        className="category-card-pro assistant-card-pro"
                        onClick={startAssistant}
                        style={{ gridColumn: '1 / -1', maxWidth: '100%', borderStyle: 'dashed' }}
                      >
                        <div className="category-icon bg-yellow">
                          <HelpCircle size={32} />
                        </div>
                        <h3>No sé qué tiene mi auto (Asistente)</h3>
                        <p>Te haremos 3 preguntas sencillas para determinar qué especialidad y servicio requiere tu vehículo.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Sub-asistente de Diagnóstico Inteligente
                  <div className="assistant-questionnaire-pane">
                    <div className="assistant-progress-bar">
                      <div className="as-bar-fill" style={{ width: `${(assistantStep / 3) * 100}%` }}></div>
                    </div>
                    
                    <AnimatePresence mode="wait">
                      {assistantStep === 1 && (
                        <motion.div 
                          key="q1" 
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="question-card"
                        >
                          <span className="q-badge">Pregunta 1 de 3</span>
                          <h3>¿El motor gira y enciende cuando le das marcha?</h3>
                          <div className="q-buttons-grid">
                            <button type="button" onClick={() => handleAssistantAnswer('starts', 'yes')} className="btn-secondary q-btn">
                              Sí, enciende y arranca bien
                            </button>
                            <button type="button" onClick={() => handleAssistantAnswer('starts', 'no')} className="btn-secondary q-btn error-border">
                              No arranca o le cuesta arrancar
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {assistantStep === 2 && (
                        <motion.div 
                          key="q2"
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="question-card"
                        >
                          <span className="q-badge">Pregunta 2 de 3</span>
                          <h3>¿Presenta alguna falla eléctrica en luces, tablero, vidrios o cierre centralizado?</h3>
                          <div className="q-buttons-grid">
                            <button type="button" onClick={() => handleAssistantAnswer('electrical', 'yes')} className="btn-secondary q-btn error-border">
                              Sí, tiene fallas eléctricas
                            </button>
                            <button type="button" onClick={() => handleAssistantAnswer('electrical', 'no')} className="btn-secondary q-btn">
                              No, todo lo eléctrico funciona bien
                            </button>
                          </div>
                        </motion.div>
                      )}

                      {assistantStep === 3 && (
                        <motion.div 
                          key="q3"
                          initial={{ opacity: 0, y: 10 }} 
                          animate={{ opacity: 1, y: 0 }} 
                          exit={{ opacity: 0, y: -10 }}
                          className="question-card"
                        >
                          <span className="q-badge">Pregunta 3 de 3</span>
                          <h3>¿Tiene abolladuras, raspaduras o choques visibles en la chapa o paragolpes?</h3>
                          <div className="q-buttons-grid">
                            <button type="button" onClick={() => handleAssistantAnswer('bodywork', 'yes')} className="btn-secondary q-btn error-border">
                              Sí, requiere reparación de chapa/pintura
                            </button>
                            <button type="button" onClick={() => handleAssistantAnswer('bodywork', 'no')} className="btn-secondary q-btn">
                              No, la carrocería está impecable
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <button type="button" onClick={() => setShowAssistant(false)} className="btn-secondary cancel-as-btn">
                      Cancelar Asistente
                    </button>
                  </div>
                )
              )}

              {/* PASO 2: DIAGNÓSTICO DETALLADO */}
              {step === 2 && (
                <div>
                  <h2 className="pane-headline-pro">¿Qué trabajo específico debemos realizar?</h2>
                  <p className="pane-subline-pro">
                    Hacé click sobre las secciones activas del auto.
                    {serviceCategory === 'electrical' 
                      ? ' (Las zonas eléctricas están habilitadas; las de carrocería se muestran inactivas)' 
                      : ' (Solo el exterior de chapa y pintura está habilitado; los componentes eléctricos se muestran inactivos)'
                    }
                  </p>
                  
                  <div className="diagnostics-grid-pro">
                    <CarVisualizer 
                      selectedPart={selectedPart}
                      onSelectPart={handleSelectPart}
                      selectedServices={selectedServices}
                      category={serviceCategory}
                    />

                    <div className="services-list-container-pro">
                      {selectedPart ? (
                        <div className="services-wrapper-pro">
                          <div className="services-header-pro">
                            <h3>{SERVICES_DATA[selectedPart].title}</h3>
                            <p>{SERVICES_DATA[selectedPart].desc}</p>
                          </div>
                          <div className="options-grid-pro">
                            {SERVICES_DATA[selectedPart].options.map(opt => {
                              const isChecked = selectedServices.some(s => s.id === opt.id);
                              return (
                                <div 
                                  key={opt.id} 
                                  onClick={() => handleToggleService(opt)}
                                  className={`service-card-pro ${isChecked ? 'selected' : ''}`}
                                >
                                  <div className="service-details-pro">
                                    <h4>{opt.name}</h4>
                                    <p>{opt.desc}</p>
                                  </div>
                                  <div className="service-action-pro">
                                    <span className="price-tag-pro">${opt.price.toLocaleString("es-AR")}</span>
                                    <div className="checkbox-visual-pro">
                                      {isChecked && <Bolt size={10} strokeWidth={4} />}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ) : (
                        <div className="empty-services-state-pro">
                          <Bolt size={42} className="empty-lightning" />
                          <p>Hacé click sobre las secciones resaltadas del auto en el panel de la izquierda para desplegar los servicios.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* PASO 3 */}
              {step === 3 && (
                <div>
                  <h2 className="pane-headline-pro">Elegí fecha y horario de recepción</h2>
                  <p className="pane-subline-pro">Las reparaciones del taller se coordinan en franjas horarias fijas de entrada.</p>
                  <CalendarPicker 
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    selectedTime={selectedTime}
                    onSelectTime={setSelectedTime}
                    turnsList={turnsList}
                  />
                </div>
              )}

              {/* PASO 4 */}
              {step === 4 && (
                <div>
                  <h2 className="pane-headline-pro">Completá los datos del vehículo</h2>
                  <p className="pane-subline-pro">Toda la información ingresada se compilará en la orden de trabajo digital.</p>
                  
                  <form id="react-booking-form" className="react-form-pro" onSubmit={(e) => e.preventDefault()}>
                    <div className="form-row-pro">
                      <div className="form-group-pro">
                        <label>Nombre del Propietario</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={clientData.name}
                          onChange={handleFormChange}
                          placeholder="Ej: Alberto Fernández"
                        />
                      </div>
                      <div className="form-group-pro">
                        <label>Teléfono de Contacto</label>
                        <input 
                          type="tel" 
                          name="phone"
                          required
                          value={clientData.phone}
                          onChange={handleFormChange}
                          placeholder="Ej: 11 9988-7766"
                        />
                      </div>
                    </div>
                    
                    <div className="form-row-pro">
                      <div className="form-group-pro">
                        <label>Modelo del Automóvil</label>
                        <input 
                          type="text" 
                          name="carModel"
                          required
                          value={clientData.carModel}
                          onChange={handleFormChange}
                          placeholder="Ej: Volkswagen Gol 1.6"
                        />
                      </div>
                      <div className="form-group-pro">
                        <label>Patente (Matrícula)</label>
                        <input 
                          type="text" 
                          name="carPlate"
                          required
                          style={{ textTransform: 'uppercase' }}
                          value={clientData.carPlate}
                          onChange={handleFormChange}
                          placeholder="Ej: AD554FF"
                        />
                      </div>
                    </div>

                    <div className="form-group-pro">
                      <label>Detalles / Síntomas o Daños del auto (Opcional)</label>
                      <textarea 
                        name="notes"
                        rows="4"
                        value={clientData.notes}
                        onChange={handleFormChange}
                        placeholder="Ej: Rayón profundo en puerta trasera derecha, abolladura de paragolpes trasero, se descarga la batería..."
                      />
                    </div>
                  </form>
                </div>
              )}

              {/* PASO 5 */}
              {step === 5 && (
                <div>
                  <h2 className="pane-headline-pro">Revisá la Orden de Trabajo Metálica</h2>
                  <p className="pane-subline-pro">Acercá el cursor para generar reflejos metálicos interactivos en 3D sobre la tarjeta.</p>
                  
                  <MetalTicket 
                    name={clientData.name}
                    carModel={clientData.carModel}
                    carPlate={clientData.carPlate.toUpperCase()}
                    date={selectedDate}
                    time={selectedTime}
                    services={selectedServices}
                    totalPrice={calculateTotal()}
                    barcode={barcode}
                  />
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!success && !showAssistant && (
        <div className="wizard-footer-pro">
          <button 
            type="button" 
            onClick={handlePrevStep}
            disabled={step === 1}
            className="btn-secondary"
          >
            <ChevronLeft size={18} />
            Atrás
          </button>
          
          <div className="total-summary-bubble">
            <span className="total-label-pro">Total Estimado</span>
            <span className="total-price-pro">${calculateTotal().toLocaleString("es-AR")}</span>
          </div>

          <button 
            type="button" 
            onClick={handleNextStep}
            disabled={!isStepValid()}
            className="btn-primary"
          >
            {step === 5 ? 'Confirmar Turno' : 'Siguiente'}
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
