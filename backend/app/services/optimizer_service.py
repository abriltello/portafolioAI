from typing import Dict, Any, List
import numpy as np
import pandas as pd
# import yfinance as yf
# from pypfopt.efficient_frontier import EfficientFrontier
# from pypfopt import risk_models
# from pypfopt import expected_returns

def generate_portfolio(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    """
    Genera un portafolio de inversión basado en el perfil de usuario y preferencias.
    Versión simple: reglas básicas según el nivel de riesgo.
    """
    risk_level = user_profile.get("risk_level", "medium") # 'low', 'medium', 'high'
    investment_amount = preferences.get("amount", 10000)

    portfolio_assets: List[Dict[str, Any]] = []
    expected_return = 0.0
    risk = 0.0

    if risk_level == "low":
        portfolio_assets = [
            {"ticker": "BONO_ESTABLE", "name": "Bono de Gobierno Estable", "allocation_pct": 60.0, "reason": "Inversión de bajo riesgo y renta fija."},
            {"ticker": "CEDEAR_CONSERVADOR", "name": "CEDEAR Empresa Grande", "allocation_pct": 40.0, "reason": "Exposición a empresas sólidas con menor volatilidad."}
        ]
        expected_return = 0.05
        risk = 0.03
    elif risk_level == "medium":
        portfolio_assets = [
            {"ticker": "CEDEAR_MODERADO", "name": "CEDEAR Empresa Mediana", "allocation_pct": 50.0, "reason": "Balance entre crecimiento y estabilidad."},
            {"ticker": "BONO_DESARROLLO", "name": "Bono de Desarrollo", "allocation_pct": 30.0, "reason": "Renta fija con potencial de crecimiento."},
            {"ticker": "ETF_GLOBAL", "name": "ETF Global Diversificado", "allocation_pct": 20.0, "reason": "Diversificación internacional."}
        ]
        expected_return = 0.10
        risk = 0.08
    else: # high
        portfolio_assets = [
            {"ticker": "ACCION_ALTO_CRECIMIENTO", "name": "Acción Tecnológica", "allocation_pct": 60.0, "reason": "Alto potencial de crecimiento y mayor riesgo."},
            {"ticker": "CRYPTO_INNOVACION", "name": "Criptomoneda Innovadora", "allocation_pct": 20.0, "reason": "Exposición a activos de alta volatilidad."},
            {"ticker": "COMMODITY_ESPECULATIVO", "name": "Fondo de Commodities", "allocation_pct": 20.0, "reason": "Cobertura y potencial de ganancias en mercados volátiles."}
        ]
        expected_return = 0.18
        risk = 0.15

    # Asegurar que la suma de porcentajes sea 100
    total_pct = sum(asset["allocation_pct"] for asset in portfolio_assets)
    if total_pct != 100.0:
        # Ajuste simple para asegurar que sume 100
        adjustment_factor = 100.0 / total_pct
        for asset in portfolio_assets:
            asset["allocation_pct"] = round(asset["allocation_pct"] * adjustment_factor, 2)

    # Re-verificar y ajustar si el redondeo causó desviación
    final_total_pct = sum(asset["allocation_pct"] for asset in portfolio_assets)
    if final_total_pct != 100.0:
        # Distribuir la diferencia en el primer activo
        portfolio_assets[0]["allocation_pct"] += round(100.0 - final_total_pct, 2)

    return {
        "assets": portfolio_assets,
        "metrics": {"expected_return": expected_return, "risk": risk}
    }


# Versión avanzada (comentada) usando PyPortfolioOpt
"""
def generate_portfolio_advanced(user_profile: Dict[str, Any], preferences: Dict[str, Any]) -> Dict[str, Any]:
    # Ejemplo de tickers, esto debería venir de una base de datos o ser dinámico
    tickers = ['SPY', 'GLD', 'AGG', 'QQQ'] # S&P 500, Oro, Bonos, Nasdaq 100

    # Descargar datos históricos
    data = yf.download(tickers, start="2015-01-01", end="2023-01-01")['Adj Close']

    # Calcular retornos esperados y matriz de covarianza
    mu = expected_returns.mean_historical_return(data)
    S = risk_models.sample_cov(data)

    # Optimización del portafolio (ejemplo: maximizar Sharpe Ratio)
    ef = EfficientFrontier(mu, S)
    weights = ef.max_sharpe()
    cleaned_weights = ef.clean_weights()

    # Convertir pesos a porcentajes y formato de salida
    portfolio_assets: List[Dict[str, Any]] = []
    for ticker, allocation in cleaned_weights.items():
        if allocation > 0.001: # Solo incluir activos con asignación significativa
            portfolio_assets.append({
                "ticker": ticker,
                "name": f"Nombre de {ticker}", # Aquí se debería buscar el nombre real del activo
                "allocation_pct": round(allocation * 100, 2),
                "reason": f"Asignación basada en optimización de Sharpe Ratio para {ticker}."
            })

    # Asegurar que la suma de porcentajes sea 100
    total_pct = sum(asset["allocation_pct"] for asset in portfolio_assets)
    if total_pct != 100.0:
        adjustment_factor = 100.0 / total_pct
        for asset in portfolio_assets:
            asset["allocation_pct"] = round(asset["allocation_pct"] * adjustment_factor, 2)

    # Calcular métricas del portafolio optimizado
    latest_returns = expected_returns.returns_from_prices(data)
    ef.portfolio_performance(verbose=True)
    # expected_return, volatility, sharpe_ratio = ef.portfolio_performance()

    return {
        "assets": portfolio_assets,
        "metrics": {"expected_return": expected_return, "risk": volatility} # Usar los valores reales de ef.portfolio_performance()
    }
"""
