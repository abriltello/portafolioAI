# PortafolioAI

PortafolioAI es una aplicación web de página única (SPA) que actúa como un asesor financiero impulsado por Inteligencia Artificial. Permite a los usuarios registrarse, completar un cuestionario de perfil de riesgo, generar un portafolio de inversión personalizado, y acceder a herramientas como un simulador, recursos educativos, noticias financieras y soporte.

## Estructura del Proyecto

```
/portafolioAI
 ├── backend/
 │   ├── app/
 │   │   ├── main.py
 │   │   ├── database.py
 │   │   ├── models/
 │   │   │   ├── user.py
 │   │   │   └── portfolio.py
 │   │   ├── routes/
 │   │   │   ├── auth.py
 │   │   │   ├── profile.py
 │   │   │   └── portfolio.py
 │   │   ├── services/
 │   │   │   ├── optimizer_service.py
 │   │   │   └── gemini_service.py
 │   │   └── utils/
 │   │       └── jwt_handler.py
 │   ├── requirements.txt
 │   └── .env.example
 │
 ├── frontend/
 │   ├── ... (archivos del frontend)
 │
 └── README.md
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   **Python 3.11+**
*   **Node.js** (para el frontend)
*   **npm** o **yarn** (para el frontend)
*   **MongoDB Atlas** (o una instancia local de MongoDB) para la base de datos.

## Configuración del Backend

1.  **Navega al directorio `backend`:**

    ```bash
    cd backend
    ```

2.  **Crea un entorno virtual e instálalo (recomendado):**

    ```bash
    python -m venv venv
    # En Windows
    .\venv\Scripts\activate
    # En macOS/Linux
    source venv/bin/activate
    ```

3.  **Instala las dependencias de Python:**

    ```bash
    pip install -r requirements.txt
    ```

4.  **Configura las variables de entorno:**

    Crea un archivo `.env` en el directorio `backend` (al mismo nivel que `requirements.txt`) y copia el contenido de `.env.example`.

    ```
    MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/portafolioAI?retryWrites=true&w=majority
    ACCESS_TOKEN_SECRET=una_clave_larga_y_segura_de_al_menos_32_caracteres
    API_KEY_GEMINI=tu_api_key_de_gemini_o_equivalente
    FRONTEND_URL=http://localhost:5173
    ```

    *   Reemplaza `<user>` y `<pass>` con tus credenciales de MongoDB Atlas.
    *   Genera una `ACCESS_TOKEN_SECRET` larga y segura.
    *   Si planeas usar la API de Gemini, proporciona tu `API_KEY_GEMINI`. De lo contrario, el servicio de Gemini usará un mock.

5.  **Ejecuta el servidor FastAPI:**

    ```bash
    uvicorn app.main:app --reload --port 8000
    ```

    El backend estará disponible en `http://localhost:8000`.

6.  **Prueba los Endpoints (Swagger UI):**

    Una vez que el servidor esté corriendo, puedes acceder a la documentación interactiva de la API en `http://localhost:8000/docs`.

## Configuración del Frontend

1.  **Navega al directorio `frontend`:**

    ```bash
    cd frontend
    ```

2.  **Instala las dependencias de Node.js:**

    ```bash
    npm install
    # o si usas yarn
    # yarn
    ```

3.  **Configura las variables de entorno para el Frontend (opcional):**
    Vite utiliza variables de entorno que deben prefijarse con `VITE_`. Puedes crear un archivo `.env` en el directorio `frontend`.

    ```
    VITE_API_URL=http://localhost:8000/api
    # Otras variables específicas del frontend si fueran necesarias
    ```

4.  **Ejecuta la aplicación de React:**

    ```bash
    npm run dev
    # o si usas yarn
    # yarn dev
    ```

    La aplicación frontend estará disponible en `http://localhost:5173` (o un puerto similar configurado por Vite).

## Notas sobre la Integración con Gemini/GenAI

El proyecto está configurado para usar la API de Google Gemini (a través de `@google/genai` en el frontend y `gemini_service.py` en el backend). Si no proporcionas una `API_KEY_GEMINI` en tu archivo `.env`, el `gemini_service.py` del backend utilizará un servicio mock para generar respuestas plausibles, permitiendo el desarrollo y la prueba de la interfaz de usuario sin una clave de API real.

## Comentarios y Claridad del Código

Se han añadido comentarios a las funciones clave del backend y se añadirán a los componentes del frontend para explicar su propósito, entradas y salidas, facilitando la comprensión y el mantenimiento del código.
