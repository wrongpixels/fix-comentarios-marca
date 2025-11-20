# MARCA Comments Fix 💬🔧
<p align="center">
<img height="600" alt="image" src="https://github.com/user-attachments/assets/3e3ad162-fd39-4359-9b5e-0b7db7a1f0fb" />
</p>

### Arregla el bug de MARCA.com que impide cargar los comentarios.

[![GitHub Release](https://img.shields.io/github/v/release/wrongpixels/fix-comentarios-marca)](https://github.com/wrongpixels/fix-comentarios-marca/releases/latest)
---

### El Problema
Seguro que te ha pasado: Entras a una noticia, ves que tiene 300 comentarios, vas a abrir el desplegable para ver la "guerra" y...

<img alt="image" src="./assets/icon128.png" />

**0 comentarios**. Ah, y el desplegable se abre en blanco. Y no carga absolutamente nada.

Da igual cuánto recargues la página, se queda roto.

### ✅ ¿Qué hace esta extensión?

Engañar a la web de MARCA para que ella misma cargue los recursos que necesita para que el módulo de comentarios no se rompa.
> **Nota:** Si eres curioso y quieres saber por qué pasa esto y cómo lo intento solucionar (la parte técnica), ve al final del README.

Eso sí, **no es infalible:** Reduce drásticamente las veces que te encuentras la sección rota, pero hay veces que, literalmente, no se puede hacer nada más, y una solución permanente sólo puede venir de MARCA.

---

### 🚀 Descarga e Instalación

Actualmente la extensión no está en la Chrome Web Store. Puedes instalarla manualmente en menos de un minuto en cualquier navegador basado en Chromium (Chrome, Brave, Edge, Opera...).

### Opción A: Desde Releases (Recomendado)
[![GitHub Release](https://img.shields.io/github/v/release/wrongpixels/fix-comentarios-marca)](https://github.com/wrongpixels/fix-comentarios-marca/releases/latest)

1. Ve a la sección de **[Releases](../../releases)** de este repositorio.
2. Descarga el archivo `.zip` (recomendado) o `.crx`.
3. Descomprime la carpeta que encontrarás dentro.
4. En tu navegador, ve a `chrome://extensions/`, `brave://extensions/` o `edge://extensions/`.
5. Activa el **"Modo de desarrollador"** si no lo has hecho aún (esquina superior derecha).
6. Haz clic en **"Cargar descomprimida"** y selecciona la carpeta que acabas de descomprimir.
7. ¡Listo! Recarga la página de Marca y prueba a abrir los comentarios.

#### Opción B: Desde el Código Fuente (Para desarrolladores)
1. Clona este repositorio:
   ```bash
   git clone https://github.com/tu-usuario/marca-block.git
   ```
2. Abre tu navegador y ve a chrome://extensions/.
3. Activa el **"Modo de desarrollador"** (esquina superior derecha).
4. Haz clic en **"Cargar descomprimida"** y selecciona la carpeta del proyecto clonado.

---

### 🤓 La Parte Técnica: ¿Por qué se rompen los comentarios y cómo funciona este fix?

*(Esta sección es para los curiosos o desarrolladores. Si ya te funciona, puedes dejar de leer aquí).*

Un día me tocó tanto las narices que 9 de cada 10 noticias tuvieran los comentarios bugeados que me puse a mirar a fondo el código para ver qué estaba pasando.
Asumí que sería algún script fallando en el cliente, pero la realidad era más rara.

### El culpable: `commentid`

Resulta que la carga del script de comentarios depende de un atributo específico, `commentid`, que viene incrustado en el HTML base que devuelve el servidor de Marca.

Sin este ID, el script no sabe qué hilo buscar en la API, falla y devuelve un objeto en blanco (por eso ni siquiera carga la interfaz con comentarios vacíos).
El problema es que, aleatoriamente, **el servidor de Marca nos devuelve el HTML de la noticia SIN ese ID**. Y, si no viene en el HTML inicial, no habrá forma humana de adivinarlo desde el navegador.

### La investigación 🕵️‍♂️

Haciendo pruebas, descubrí un patrón curioso:
1. En Desktop (Chrome/Windows), el ID falta más a menudo que en móviles/tablets
2. En móviles y tablets, sólo se recibe el ID en algunos modelos, pero no en otros
4. Simulando ser un **iPad Mini** o **Nest Hub**, el ID llegaba **casi siempre**, mientras que en otras tablets y modelos, seguía faltando.

Al parecer, el backend de Marca decide qué versión del HTML servir (seguramente, por temas de caché), basándose en el `User-Agent` del dispositivo.

Mi teoría es que, al publicar una noticia, MARCA crea un primer caché para Desktop/tablets/móviles sin incluir 'commentid', así que hasta que es actualizado, sólo los dispositivos que se saltan este caché lo reciben, lo cual sólo pasa con ciertos User-Agent.

### La Solución 🛠️

La extensión utiliza la API `declarativeNetRequest` para interceptar las peticiones a `marca.com` y que, de cara al servidor, **tu navegador se identifique con el User-Agent básico Mozilla/5.0 (Android)**.

Al hacer esto:
1. El servidor cree que no somos un PC ni un smartphone moderno.
2. El servidor devuelve una versión del HTML más reciente que **SÍ contiene el `commentid`**.
4. Los scripts de comentarios encuentran el ID y cargan el hilo correctamente.

---

¡Y eso es todo! Más el encontrar el error que la solución, que es bastante sencilla.
