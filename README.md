# Reto Detox — Pablo

App de una sola página (`index.html`) para seguir el Reto Detox de septiembre 2026 de la
nutrióloga Melissa Zuñiga, pero con **preparaciones simples, baratas y repetitivas**.

Está armada igual que la app de calistenia: funciona sin conexión guardando en el
`localStorage` del dispositivo, y se sincroniza sola entre el celular y la computadora vía
`api/data.js` (Redis).

## Qué tiene

**4 pestañas:**

- **Hoy** — la lista de lo que hay que hacer hoy: agua con limón, jugo verde, las 5 comidas,
  8 vasos de agua, caminata y sueño. Cada comida se toca para ver la **receta con gramos
  exactos** y los pasos. La cena alterna sola entre 2 opciones (atún / huevos a la mexicana),
  y se puede cambiar a mano. Abajo: cómo me sentí hoy (energía, hambre, antojos, digestión
  del 1 al 5) y el check de cheat meal. Antes del 7 de septiembre muestra la cuenta regresiva.
- **Progreso** — racha de días cumplidos, % de cumplimiento, día N de 24. Registro de **peso**
  con gráfica, **medidas** (cintura, abdomen, pecho, brazo, pierna) con gráfica, y gráfica de
  cómo te has sentido a lo largo del reto. Cada registro se puede borrar.
- **Súper** — checklist del **prep del domingo** (6 pasos), **lista del súper** para una semana
  agrupada por categoría (cada cosa se palomea), y la lista de **recipientes y equipo** que
  necesitas comprar.
- **Equivalencias** — todas las tablas de equivalencias de los PDF de Melissa (cereales, fruta,
  proteína, lácteos, grasas, leguminosas, libres), las reglas del reto y las marcas
  recomendadas del súper. Para cuando no tengas o no te guste un alimento y lo quieras cambiar.

## El plan simple (resumen)

| Comida | Qué | Cuenta |
|---|---|---|
| Al despertar | Agua con ½ limón + jugo verde (bolsa congelada) | — |
| Desayuno | Avena 60 g + ½ plátano + 1 cda crema de cacahuate + 1 huevo + 4 claras | 2 cereal · 1 fruta · 3 proteína · 1 grasa c/prot |
| Colación 1 | 190 g yogurt griego sin azúcar + 100 g fruta + canela | 1.5 lácteo · 0.5 fruta |
| Comida | 120 g pollo (crudo) + 100 g arroz cocido + verduras + ¼ aguacate + 5 aceitunas | 2 cereal · 3 proteína · 2 grasa s/prot |
| Colación 2 | 1 manzana o plátano + jícama y pepino con limón | 1 fruta |
| Cena A | 120 g atún escurrido + 2 tostadas + verduras + ¼ aguacate | 1.5 cereal · 3 proteína · 1 grasa s/prot |
| Cena B | 1 huevo + 4 claras a la mexicana + 2 tortillas + ¼ aguacate | 2 cereal · 3 proteína · 1 grasa s/prot |

Cae en los números que marcó Melissa para pérdida de grasa (≈ 6 cereal · 9 proteína · 3 grasa
sin proteína · 1 grasa con proteína · 2–3 fruta · 1.5 lácteo · verduras libres).

**Ojo con el peso de los alimentos** (según el PDF de equivalencias):
- Se pesan **CRUDOS**: avena, pollo, carne, pescado, claras, semillas, frutos secos.
- Se pesan **COCIDOS**: arroz, pasta, quinoa, legumbres.

## Sincronización

Cada registro (día, peso, medida) tiene un `id` único. Al abrir la app se baja lo del servidor
y se **une** con lo local (no se sobrescribe). Borrar deja una "lápida" (`deleted:true`) para que
la sincronización no lo reviva. Si no hay internet, la app sigue funcionando con lo local y
muestra "Sin conexión — guardado solo aquí". Cada cambio se manda al servidor de inmediato, y
al cerrar la app se hace un último intento `keepalive`.

**Importante:** usa siempre **la misma URL** (la de Vercel) en el celular y en la compu. Si un
día entras por la URL de GitHub Pages y otro por la de Vercel, cada una guarda su propio
`localStorage` y parecerá que se perdieron datos.

## Deploy en Vercel

Comparte la misma base de datos Redis y la misma contraseña que la app de calistenia (usa una
llave distinta, `alimentacion:logs`, así que no se pisan).

1. Sube esta carpeta a un repo de GitHub nuevo (por ejemplo `reto-detox`).
2. En Vercel: **Add New → Project → Import** ese repo.
3. En **Settings → Environment Variables** agrega:
   - `REDIS_URL` — la misma que ya usa la app de calistenia (Vercel → Storage → tu Redis → `.env`).
   - `APP_PASSWORD` — la misma contraseña que usas en calistenia.
4. **Deploy**. Abre la URL que te da Vercel, escribe la contraseña una vez, y agrégala a la
   pantalla de inicio del celular (Compartir → Añadir a inicio).

`api/data.js` rechaza con 401 cualquier petición sin el header `x-app-password` correcto: la
protección real está en el servidor, no solo en la pantalla de contraseña.

## Archivos

- `index.html` — toda la app (HTML, CSS y JS en un archivo).
- `api/data.js` — endpoint GET/POST que lee y escribe el arreglo completo en Redis.
- `lib/redis.js` — conexión a Redis (variable `REDIS_URL`).
- `manifest.json`, `icon.svg` — para instalarla como app en el celular.
- `vercel.json` — headers de no-cache.

Fuente del plan: PDFs "RETO DETOX SEPTIEMBRE 2026", "EQUIVALENCIAS RETO DETOX" y "Menú Reto
Detox Pérdida de grasa corporal" de LN Melissa Zuñiga Duarte (carpeta `Alimentación/`).
