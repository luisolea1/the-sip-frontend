# THE SIP — Frontend

Aplicación web para el punto de venta, la administración de cafeterías y el portal de miembros de THE SIP.

**Repositorio:** `the-sip-frontend`  
**Estado:** base del frontend ejecutable en desarrollo local. La API, la autenticación y los servicios del piloto están pendientes de integración.  
**Alcance del piloto:** una sucursal, un iPad y operación exclusivamente con internet.  
**Objetivo de costo:** utilizar herramientas sin costo de licencia y mantener los servicios dentro de sus planes gratuitos.

**Índice**

1. [Alcance](#1-alcance)
2. [Áreas y accesos](#2-áreas-y-accesos)
3. [Punto de venta y caja](#3-punto-de-venta-y-caja)
4. [Registro y tarjeta de miembros](#4-registro-y-tarjeta-de-miembros)
5. [Administración e inventario](#5-administración-e-inventario)
6. [Diseño visual](#6-diseño-visual)
7. [Arquitectura y herramientas](#7-arquitectura-y-herramientas)
8. [Servicios y presupuesto](#8-servicios-y-presupuesto)
9. [Validación del piloto](#9-validación-del-piloto)
10. [Decisiones pendientes y puesta en marcha](#10-decisiones-pendientes-y-puesta-en-marcha)

## 1. Alcance

- Un solo negocio, preparado para incorporar varias sucursales.
- Operación de caja desde el navegador del iPad, incluido Chrome.
- Lectura de tarjetas de miembros mediante QR y cámara.
- Pagos en efectivo, con terminal bancaria independiente y mixtos.
- Apertura, movimientos, devoluciones y cierre de caja.
- Administración de menú, insumos, avisos y cajeros.
- Portal público de registro y tarjeta de fidelidad.
- Volumen inicial estimado: de 100 a 200 ventas diarias. Se evaluará también un escenario de 500 ventas diarias.

**El piloto no registra ventas sin conexión.** El servidor es la fuente oficial de tickets, pagos, movimientos de caja y fidelidad. Si el servidor no confirma que guardó el ticket, el cajero no debe iniciar el cobro. Si la conexión se pierde después de cobrar, se recuperará el ticket al volver a conectarse.

## 2. Áreas y accesos

| Área | Ruta | Acceso |
| --- | --- | --- |
| Registro de miembros | `/registro-miembros` | Público |
| Tarjeta de muestra | `/mi-tarjeta` | Público; las tarjetas reales requerirán sesión |
| Selector de diseños | `/mi-tarjeta/disenos` | Público, sin registro |
| Punto de venta | `/caja/venta` | Vista previa sin registro; en el piloto, cajero asignado o administrador autorizado |
| Administración | `/administrador` | Vista previa sin registro; en el piloto, administrador |

El portal público incluye el registro, la tarjeta y su selector de diseños; el iPad del cajero abre directamente `/caja/venta`, y el administrador entra por `/administrador`. Comparten estilos, pero no un menú global.

**Vista previa local:** en caja puedes armar un ticket y calcular el cambio o el reparto de un pago mixto. En administración puedes seleccionar el día del resumen y consultar los insumos que alcanzaron su mínimo. Todo usa datos de ejemplo: al recargar se restablecen el ticket y los filtros. Las simulaciones de caja no se cobran ni se agregan a las ventas del panel.

La API verificará los permisos y la sucursal en cada operación. Cambiar la URL u ocultar un botón no concede ni revoca permisos. Un miembro solo podrá consultar su propia tarjeta.

### Prototipos de referencia

- [Punto de venta](https://cafe-olivo-diseno.aptwatermelon1.chatgpt.site/#sale?cafe=centro)
- [Registro de miembros](https://cafe-olivo-diseno.aptwatermelon1.chatgpt.site/registro-miembros)
- [Panel de administración](https://cafe-olivo-diseno.aptwatermelon1.chatgpt.site/dueno#summary?cafe=centro)

Los prototipos son la referencia visual y de navegación. Para las reglas de operación prevalece este README. Los datos, correos, cobros y tarjetas de ejemplo no representan integraciones reales.

La consulta sin autenticación de los tres prototipos devuelve `401`; su revisión requiere acceso.

## 3. Punto de venta y caja

### Recorrido de una venta

1. El cajero abre su turno en la sucursal asignada.
2. Selecciona productos, variantes, cantidades y opciones para llevar. Puede asociar una tarjeta de miembro mediante QR.
3. Revisa el carrito, el total y el medio de pago.
4. Al pulsar **Iniciar cobro**, la API guarda un ticket pendiente con identificador único, productos, precios aplicados, total, sucursal, cajero y turno.
5. El cajero espera la confirmación del servidor antes de recibir el efectivo o usar la terminal.
6. Registra el pago según el medio utilizado. La venta aparece como pagada únicamente cuando el servidor la confirma.

Un **ticket pendiente** ya existe en el servidor, pero no cuenta como venta pagada ni genera sellos de fidelidad. Repetir una solicitud por un doble toque o por pérdida de conexión no debe crear otra venta.

### Medios de pago

| Medio | Operación |
| --- | --- |
| Efectivo | El cajero registra el importe recibido. La aplicación calcula el cambio y registra el efectivo correspondiente a la venta. |
| Tarjeta | El cajero cobra en la terminal independiente, comprueba que el pago fue aprobado, verifica el importe y digita el número del voucher. |
| Mixto | Se registran por separado la parte en efectivo y la parte en tarjeta. El voucher corresponde únicamente al importe cobrado en la terminal. |

La aplicación no procesa datos bancarios ni consulta automáticamente la terminal. La suma aplicada de los medios de pago debe coincidir con el total del ticket.

### Cobro aprobado e interrupción del iPad

Si la terminal aprobó un pago y el iPad falla antes de mostrar la confirmación:

1. Recuperar la conexión y consultar el estado del ticket.
2. Si ya consta como pagado, mostrar la confirmación existente. **No volver a cobrar.**
3. Si sigue pendiente, abrirlo desde **Cobros pendientes**, comprobar el importe con el voucher y digitar su número.
4. Si el voucher ya está asociado a otra venta, bloquear el registro e indicar que debe revisarse.

El servidor impedirá aplicar el mismo voucher a dos ventas, incluso si se envían dos solicitudes al mismo tiempo. Antes del piloto se verificará en la terminal real qué número identifica la transacción y si su unicidad depende de la terminal o del lote. Se conservarán los ceros iniciales del identificador.

### Devoluciones y salidas

Las devoluciones se registran desde **Caja → Salidas → Devolución a cliente**. La venta original se conserva.

Cada devolución debe quedar vinculada a la venta e incluir el importe, el motivo obligatorio, el medio de pago original, el medio de devolución, el cajero, la sucursal, el turno y la fecha. La suma de las devoluciones no podrá superar el importe pagado.

**Ejemplo:** una venta de $150 aprobada en terminal que se devuelve en efectivo conserva el cobro de $150 por tarjeta y genera una salida de $150 del cajón. El cierre muestra ambos movimientos. Un cargo rechazado o sin aprobación comprobada no justifica entregar efectivo. Antes de operar se validará con el proveedor de la terminal el procedimiento de devolución en efectivo.

### Cierre de caja

El cierre distinguirá fondo inicial, ventas en efectivo, entradas, salidas, devoluciones en efectivo, efectivo esperado, efectivo contado, diferencia y total cobrado por terminal.

**Efectivo esperado = fondo inicial + efectivo de ventas + otras entradas − salidas.**

Las devoluciones en efectivo se incluyen una sola vez dentro de las salidas. En un pago mixto solo la parte en efectivo incrementa el cajón. El total registrado por tarjeta se compara por separado con el reporte de la terminal.

## 4. Registro y tarjeta de miembros

En `/registro-miembros`, el botón **Registrarse** valida el nombre y el correo y abre `/mi-tarjeta` con el saludo, las iniciales y el nombre del miembro. El perfil se mantiene en memoria al elegir un diseño y se borra al recargar. El correo no aparece en la tarjeta ni en el QR. No se crea una cuenta en el servidor.

Para conocer al público y ofrecer promociones de cumpleaños se prevén dos campos independientes y opcionales:

| Campo | Opciones o formato |
| --- | --- |
| Rango de edad | **24 años o menos**, **25 a 44 años**, **45 años o más**, **Prefiero no responder** |
| Cumpleaños | Día y mes, sin solicitar el año |

El rango de edad no tendrá una opción preseleccionada. El miembro podrá obtener su tarjeta aunque omita ambos campos. El consentimiento para promociones será opcional, independiente del registro y acompañado de una explicación sobre el uso de los datos.

La tarjeta mostrará un QR ampliable, el progreso de fidelidad y la recompensa disponible. El QR identificará la tarjeta en caja: no contendrá datos personales legibles ni permitirá iniciar sesión.

La recuperación de acceso se realizará mediante un enlace temporal y de un solo uso, sujeto a validar la entrega de correo. Conocer el correo de un miembro no será suficiente para abrir su tarjeta. Las fotos personalizadas y las integraciones con Apple Wallet o Google Wallet quedan para evaluación posterior.

## 5. Administración e inventario

El administrador podrá consultar ventas confirmadas, número de tickets, ticket promedio, unidades vendidas y devoluciones. También administrará sucursales, menú, variantes, reglas de fidelidad, avisos y asignación de cajeros.

La pregunta principal del inventario será: **¿qué insumos están por terminarse y cuándo conviene volver a comprarlos?**

La vista **Qué necesito comprar** mostrará por sucursal:

- Insumo, unidad de medida y existencia estimada.
- Punto de reposición y unidad habitual de compra.
- Fecha del último conteo y aviso cuando el saldo alcance o baje del mínimo.

Para el piloto se propone comenzar con los insumos críticos, registro de compras, conteos físicos y ajustes. El descuento automático por producto requerirá definir recetas, variantes y unidades. Mientras el saldo dependa de conteos, se presentará como **estimado**.

La falta de existencias registradas no bloqueará una venta. Los saldos negativos serán visibles para el administrador. La disponibilidad de un producto en el menú podrá administrarse por separado.

## 6. Diseño visual

Se conservará la distribución de los prototipos y se utilizará **THE SIP** como nombre visible. La interfaz tendrá controles táctiles para iPad, foco visible, formularios etiquetados y estados acompañados de texto o iconos.

Cada página tendrá un solo `h1`, encabezados en orden lógico y enlaces con destinos y textos descriptivos. Las imágenes informativas llevarán texto alternativo y las decorativas, `alt=""`. Se optimizarán los recursos, incluidos los SVG. El diseño usará Flexbox o Grid sin desbordamiento horizontal. Las fuentes locales se cargarán con `@font-face`; las transiciones respetarán la preferencia de movimiento reducido.

### Nombres de clases CSS

Las clases CSS propias de THE SIP se escribirán en inglés y en `kebab-case`. Cada nombre indicará el área y describirá la función del elemento: por ejemplo, `pos-confirm-payment-button` para el botón que confirma el pago en caja. Se evitarán nombres genéricos como `btn1` o basados solo en la apariencia como `red-button`. Las utilidades de Tailwind conservarán sus nombres estándar.

### Paleta de la interfaz

| Uso | Punto de venta | Administración | Miembros |
| --- | --- | --- | --- |
| Principal de marca | `#6F0708` | `#6F0708` | `#6F0708` |
| Superficie principal | `#FFFFFF` | `#FFFFFF` | `#FFFFFF` |
| Texto principal | `#1B2B22` | `#262524` | `#282526` |
| Texto secundario | `#69796F` | `#72706F` | `#756F70` |
| Bordes | `#E5EBE6` | `#ECE8E6` | `#EEE9E8` |
| Superficie suave | `#EEF2EE` | `#F8F6F5` | `#F7F4F2` |

El burdeos se utilizará en navegación, acciones principales y selección activa. El color de error de caja es `#B34238`. Aunque el prototipo de caja declara `#F5F7F5` como fondo base, su superficie principal visible es blanca. Los fondos suaves de énfasis mezclan burdeos con blanco: 9 % de burdeos en caja y 7 % en administración.

Los valores se centralizarán en `src/shared/styles/globals.css` mediante variables semánticas que consumirán Tailwind CSS y los componentes de shadcn/ui. Se verificará el contraste en el tamaño real de los controles.

### Temas de la tarjeta del miembro

| Diseño de referencia | Fondo | Texto |
| --- | --- | --- |
| Villa nevada | `#98A18E` | `#21362B` |
| Pino de hilo | `#294B3C` | `#FFF2DA` |
| Osito de luces | `#EDBEB2` | `#502C29` |
| Regalo polar | `#1D5951` | `#FFF3DF` |
| Santa en nieve | `#B8D7DB` | `#243C3D` |
| Jengibre | `#EEE5D2` | `#51342A` |

La tarjeta de ejemplo empieza con **Regalo polar**, el número `01725` y cero de diez cafés. **Mostrar mi QR** amplía el código de muestra sin salir de la página. **Elegir diseño** abre `/mi-tarjeta/disenos`, con seis miniaturas ilustradas. **Guardar diseño** aplica el cambio solo en memoria; volver sin guardar conserva el diseño anterior. Al recargar se recupera Regalo polar. El QR no identifica a ningún miembro real.

## 7. Arquitectura y herramientas

| Herramienta | Responsabilidad |
| --- | --- |
| React + TypeScript | Pantallas, componentes y contratos de datos. |
| Vite + React Router | Compilación, navegación y carga por área. |
| Tailwind CSS + shadcn/ui + variables CSS | Controles accesibles y estilos compartidos. |
| Zustand y estado local de React | Carrito antes de iniciar el cobro y estado temporal de la interfaz. |
| TanStack Query | Consultas, actualización de datos y estados de carga y error. |
| React Hook Form + Zod | Formularios y validación. |
| qr-scanner + qrcode | Lectura y generación de QR. |
| Vitest + Playwright | Pruebas de reglas de negocio y recorridos completos. |

El frontend consumirá una API. El servidor validará permisos, importes, vouchers, pagos y reglas de fidelidad. Los importes se manejarán como enteros en la unidad mínima de la moneda. Las credenciales de servicios y de la base de datos permanecerán en el servidor.

La caché del navegador no es comprobante de pago. Cada operación de cobro tendrá un identificador estable que permita reintentarla sin duplicar efectos. Esta separación también deja abierta una futura fase sin conexión, **sin incorporar Dexie, una cola local ni sincronización offline al piloto**.

### Estructura propuesta

```text
the-sip-frontend/
├── README.md
└── src/
    ├── app/
    │   ├── routes.tsx
    │   ├── providers.tsx
    │   └── guards/
    ├── features/
    │   ├── members/      # Registro, acceso y tarjeta
    │   ├── pos/          # Venta, cobros pendientes y caja
    │   └── admin/        # Reportes, menú, inventario y cajeros
    └── shared/
        ├── api/
        ├── components/ui/
        ├── styles/globals.css
        └── types/
```

El esquema incluye piezas actuales y previstas. El alojamiento deberá devolver `index.html` al abrir o recargar directamente las rutas de React Router.

## 8. Servicios y presupuesto

| Servicio propuesto | Uso |
| --- | --- |
| Cloudflare Workers Static Assets | Publicar el frontend. |
| Cloudflare Workers | Ejecutar la API. |
| Cloudflare D1 | Guardar tickets, pagos, movimientos, miembros y datos del negocio. |
| Cloudflare Turnstile | Proteger formularios públicos, con verificación en el servidor. |
| Brevo | Enviar enlaces de acceso o recuperación. |
| Cloudinary | Opcional, solo si se habilitan fotos personalizadas. |

**Costo de licencia cero no equivale a operación gratuita garantizada.** Antes de publicar se revisarán las cuotas vigentes, la entrega de correo y la idoneidad del alojamiento para uso comercial. Se puede iniciar la prueba sin comprar dominio; la entrega de enlaces por correo sin dominio autenticado debe validarse antes de depender de ella.

Como referencia de dimensionamiento, **500 ventas diarias equivalen a unas 15,000 ventas en 30 días**. Si cada venta agregara 5 KB entre registros e índices, serían aproximadamente 75 MB mensuales. Es una hipótesis: el piloto medirá solicitudes, filas leídas y escritas, crecimiento real de la base, correos y costo de los reportes. Se definirá cómo exportar y restaurar el historial antes de agotar la capacidad disponible.

El presupuesto no incluye desarrollo, mantenimiento, iPad, internet, terminal, comisiones bancarias ni un eventual dominio.

**Referencias:** [Workers](https://developers.cloudflare.com/workers/platform/pricing/) · [D1: precios](https://developers.cloudflare.com/d1/platform/pricing/) · [D1: límites](https://developers.cloudflare.com/d1/platform/limits/) · [Turnstile](https://developers.cloudflare.com/turnstile/plans/) · [Brevo](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans) · [Cloudinary](https://cloudinary.com/pricing).

## 9. Validación del piloto

**Prueba principal:** si la terminal aprueba un pago y el iPad falla antes de mostrar la confirmación, el cajero debe poder recuperar la compra **sin cobrar de nuevo ni duplicar la venta**.

| Escenario | Resultado esperado |
| --- | --- |
| El servidor no confirma que guardó el ticket | La interfaz no indica al cajero que proceda a cobrar. |
| La terminal aprueba y el iPad falla antes de registrar el voucher | El ticket pendiente se recupera y se confirma con el voucher. |
| El servidor registra el pago, pero el iPad no recibe la respuesta | Al consultar o reintentar aparece la misma venta pagada, sin duplicados. |
| Se intenta usar el mismo voucher en otra venta | El servidor impide el segundo registro. |
| Se devuelve en efectivo una venta pagada con tarjeta | Se conserva el cobro en terminal y se registra una sola salida de efectivo vinculada a la venta. |
| Se cierra un turno con efectivo, tarjeta y pagos mixtos | El efectivo esperado y los importes de terminal pueden conciliarse por separado. |
| Un insumo alcanza su punto de reposición | Aparece en la lista de compra de la sucursal correcta. |

También se probarán el registro con los campos opcionales vacíos, el acceso por enlace, los permisos por sucursal, la prevención de sellos y canjes duplicados y la lectura de QR en el iPad real. La cámara requiere HTTPS y permiso del usuario; debe detenerse al terminar la lectura o salir de la pantalla.

## 10. Decisiones pendientes y puesta en marcha

Antes de operar con clientes se definirán:

- Modelo de iPad, versión mínima de iPadOS y navegadores probados.
- Autenticación de administradores y cajeros, y alcance del PIN del prototipo.
- Identificador exacto del voucher y regla de unicidad de la terminal real.
- Tratamiento de tickets pendientes al cerrar turno y efecto de una devolución sobre fidelidad.
- Reglas de acumulación y canje, insumos críticos y puntos de reposición iniciales.
- Contratos de la API, esquema de datos y organización del backend.
- Entrega de correo, alojamiento comercial, conservación y restauración del historial.

**Orden de implementación:** primero se validará un turno completo en iPad: abrir caja, crear un ticket, cobrar, recuperar un pago interrumpido por voucher, registrar una devolución y cerrar caja. Después se completarán los flujos de miembros, inventario y administración.

### Desarrollo local

Con Node.js 22.12 o superior y npm, ejecutar desde la raíz del repositorio:

```bash
npm ci
npm run dev
```

Abrir la dirección que indique Vite. `npm run build` comprueba TypeScript y genera los archivos estáticos en `dist/`. `npm run preview` sirve esa compilación localmente.

Para verificar navegación, recarga directa y ancho de pantalla en Chromium:

```bash
npx playwright install chromium
npm run test:e2e
```

Las pruebas de las vistas del personal cubren móvil, tableta en vertical y horizontal y escritorio. La validación física en iPad sigue pendiente.
