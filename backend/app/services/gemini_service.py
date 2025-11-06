import os
from typing import Dict, Any
import json

# import google.generativeai as genai
# from dotenv import load_dotenv

# load_dotenv()
# GEMINI_API_KEY = os.getenv("API_KEY_GEMINI")

# if GEMINI_API_KEY:
#     genai.configure(api_key=GEMINI_API_KEY)
#     model = genai.GenerativeModel('gemini-pro')
# else:
#     model = None

def generate_portfolio_prompt(answers: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Genera un portafolio de inversión simulado usando un mock service o Gemini si está configurado.
    El prompt real a Gemini debería incluir un esquema JSON estricto.
    """
    if False: # model: # Si Gemini está configurado y disponible
        # Aquí iría la lógica para construir el prompt para Gemini
        # y parsear su respuesta. Por ahora, usamos un mock.
        pass

    # Mock service fallback
    risk_level = answers.get("risk_level", "medium")
    investment_goal = answers.get("investment_goal", "growth")

    mock_assets = []
    mock_metrics = {"expected_return": 0.0, "risk": 0.0}

    if risk_level == "low":
        mock_assets = [
            {"ticker": "MOCK_BONO", "name": "Bono Ficticio", "allocation_pct": 50.0, "reason": "Activo de baja volatilidad para preservar capital."},
            {"ticker": "MOCK_REIT", "name": "Fondo Inmobiliario Ficticio", "allocation_pct": 30.0, "reason": "Generación de ingresos estables."},
            {"ticker": "MOCK_GOLD", "name": "Oro Ficticio", "allocation_pct": 20.0, "reason": "Cobertura contra la inflación."}
        ]
        mock_metrics = {"expected_return": 0.04, "risk": 0.02}
    elif risk_level == "medium":
        mock_assets = [
            {"ticker": "MOCK_ETF_SP", "name": "ETF S&P 500 Ficticio", "allocation_pct": 40.0, "reason": "Diversificación en el mercado de valores."},
            {"ticker": "MOCK_TECH", "name": "Acción Tecnológica Ficticia", "allocation_pct": 30.0, "reason": "Potencial de crecimiento a largo plazo."},
            {"ticker": "MOCK_EMERGING", "name": "Mercados Emergentes Ficticios", "allocation_pct": 20.0, "reason": "Exposición a economías en desarrollo."},
            {"ticker": "MOCK_BOND_CORP", "name": "Bono Corporativo Ficticio", "allocation_pct": 10.0, "reason": "Rendimiento superior a bonos gubernamentales."}
        ]
        mock_metrics = {"expected_return": 0.09, "risk": 0.07}
    else: # high
        mock_assets = [
            {"ticker": "MOCK_CRYPTO", "name": "Criptomoneda Ficticia", "allocation_pct": 40.0, "reason": "Alta rentabilidad potencial, alto riesgo."},
            {"ticker": "MOCK_BIOTECH", "name": "Biotech Ficticia", "allocation_pct": 30.0, "reason": "Innovación y crecimiento disruptivo."},
            {"ticker": "MOCK_SMALLCAP", "name": "Small Cap Ficticia", "allocation_pct": 20.0, "reason": "Empresas con alto potencial de expansión."},
            {"ticker": "MOCK_LEVERAGED", "name": "ETF Apalancado Ficticio", "allocation_pct": 10.0, "reason": "Amplificar retornos en mercados alcistas."}
        ]
        mock_metrics = {"expected_return": 0.15, "risk": 0.12}

    return {
        "assets": mock_assets,
        "metrics": mock_metrics,
        "summary": f"Este es un portafolio simulado para un perfil de riesgo {risk_level} con un objetivo de {investment_goal}."
    }

def explain_concept(concept: str) -> str:
    """
    Devuelve una explicación educativa NO-asesora de un concepto financiero.
    """
    if False: # model:
        # Aquí iría la lógica para construir el prompt para Gemini
        # y obtener la explicación.
        pass

    # Mock service fallback
    explanations = {
        "acciones": "Las acciones representan una parte de la propiedad de una empresa. Al comprarlas, te conviertes en accionista y puedes beneficiarte de su crecimiento y dividendos. Sin embargo, su valor puede fluctuar significativamente.",
        "bonos": "Los bonos son instrumentos de deuda emitidos por gobiernos o empresas. Al comprar un bono, le prestas dinero al emisor a cambio de pagos de intereses regulares y la devolución del capital al vencimiento. Son generalmente menos volátiles que las acciones.",
        "etf": "Un ETF (Exchange Traded Fund) es un fondo de inversión que cotiza en bolsa, como una acción. Contiene una cesta de activos (acciones, bonos, materias primas) y busca replicar el rendimiento de un índice. Ofrecen diversificación y liquidez.",
        "diversificacion": "La diversificación es una estrategia de inversión que consiste en distribuir tus inversiones entre diferentes tipos de activos, industrias y geografías. Su objetivo es reducir el riesgo general de tu portafolio, ya que el mal rendimiento de un activo puede ser compensado por el buen rendimiento de otro.",
        "inflacion": "La inflación es el aumento generalizado y sostenido de los precios de bienes y servicios en una economía durante un período de tiempo. Esto significa que con la misma cantidad de dinero, puedes comprar menos que antes, reduciendo el poder adquisitivo de tu dinero."
    }
    return explanations.get(concept.lower(), "No tengo información detallada sobre ese concepto en este momento. Por favor, intenta con otro.")
