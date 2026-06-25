# Los Porteños Pro - Electricidad y Electrónica Automotriz (React + Vite)

Este es un turnero premium desarrollado en **React** y **Vite**, diseñado para un taller especializado en electricidad y electrónica del automotor. El proyecto incluye animaciones fluidas con **Framer Motion**, íconos vectoriales modernos con **Lucide React** y una base de datos local simulada en `localStorage`.

## Características Clave del Proyecto Pro

### ⚡ Diagnóstico Visual Eléctrico Interactivo
*   El cliente cuenta con un diagrama SVG del vehículo personalizado.
*   Puede clickear en las secciones clave: **Sistema de Carga/Batería**, **Computadora/ECU**, **Iluminación/Faros** y **Confort/Accesorios**.
*   Cada sección despliega una lista detallada de servicios eléctricos reales (ej: Kit luces LED, Reparación de alternador, Fuga de corriente, Escaneo OBD2) con precios dinámicos.

### 📅 Agenda y Turnero Inteligente
*   Calendario reactivo en el que se inhabilitan domingos, feriados y días pasados.
*   Validación de horarios ocupados según los turnos de la base de datos local para prevenir doble reserva.

### 💳 Orden de Trabajo Metálica 3D
*   En el paso de confirmación, se genera un ticket digital metálico con un efecto 3D Parallax que sigue el movimiento del mouse y genera reflejos interactivos realistas.
*   Incluye código de barras generado por orden de compra.

### 📊 Tablero Kanban de Administración
*   Un monitor del taller que permite arrastrar y soltar (Drag and Drop) tarjetas de turnos de una columna a otra (*Pendientes*, *En Elevador*, *Terminados*).
*   El reordenamiento de tarjetas y cambio de columnas cuenta con animaciones fluidas y elásticas gracias a **Framer Motion**.
*   Incluye KPIs en tiempo real de facturación acumulada, cantidad de turnos, y un indicador de ocupación límite para los elevadores de taller (capacidad 4 vehículos).
*   Monitor de log de sucesos y alertas "toast" que notifican al administrador de inmediato cuando un cliente realiza una reserva.

## Instalación y Ejecución Local

1.  Asegurate de tener [Node.js](https://nodejs.org/) instalado.
2.  Ingresá a la carpeta del proyecto:
    ```bash
    cd los-portenos-turnero-pro
    ```
3.  Instalá las dependencias (si no se instalaron previamente):
    ```bash
    npm install
    ```
4.  Corré el servidor de desarrollo:
    ```bash
    npm run dev
    ```
5.  Abrí en tu navegador la dirección indicada en la consola (normalmente [http://localhost:5173](http://localhost:5173)).
