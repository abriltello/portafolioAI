from typing import Dict, Any, List
import numpy as np
import pandas as pd
# import yfinance as yf
# from pypfopt.efficient_frontier import EfficientFrontier
# from pypfopt import risk_models
# from pypfopt import expected_returns

# Mapeo de tickers de referencia a tickers reales de Yahoo Finance
TICKER_MAPPING = {
    "BONO_ESTABLE": "TLT",  # iShares 20+ Year Treasury Bond ETF
    "CEDEAR_CONSERVADOR": "JNJ",  # Johnson & Johnson (empresa estable)
    "CEDEAR_MODERADO": "MSFT",  # Microsoft (empresa mediana-grande)
    "BONO_DESARROLLO": "EMB",  # iShares J.P. Morgan USD Emerging Markets Bond ETF
    "ETF_GLOBAL": "VT",  # Vanguard Total World Stock ETF
    "ACCION_ALTO_CRECIMIENTO": "NVDA",  # NVIDIA (tecnología alto crecimiento)
    "CRYPTO_INNOVACION": "BTC-USD",  # Bitcoin
    "COMMODITY_ESPECULATIVO": "GLD"  # SPDR Gold Trust (oro)
}

# Nombres descriptivos para cada activo
ASSET_NAMES = {
    "TLT": "iShares 20+ Year Treasury Bond ETF",
    "JNJ": "Johnson & Johnson",
    "MSFT": "Microsoft Corporation",
    "EMB": "iShares Emerging Markets Bond ETF",
    "VT": "Vanguard Total World Stock ETF",
    "NVDA": "NVIDIA Corporation",
    "BTC-USD": "Bitcoin USD",
    "GLD": "SPDR Gold Trust"
}

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
            {
                "ticker": TICKER_MAPPING["BONO_ESTABLE"], 
                "name": ASSET_NAMES[TICKER_MAPPING["BONO_ESTABLE"]], 
                "allocation_pct": 60.0, 
                "reason": "Inversión de bajo riesgo en bonos del tesoro estadounidense a largo plazo."
            },
            {
                "ticker": TICKER_MAPPING["CEDEAR_CONSERVADOR"], 
                "name": ASSET_NAMES[TICKER_MAPPING["CEDEAR_CONSERVADOR"]], 
                "allocation_pct": 40.0, 
                "reason": "Exposición a empresa farmacéutica estable con dividendos consistentes."
            }
        ]
        expected_return = 0.05
        risk = 0.03
    elif risk_level == "medium":
        portfolio_assets = [
            {
                "ticker": TICKER_MAPPING["CEDEAR_MODERADO"], 
                "name": ASSET_NAMES[TICKER_MAPPING["CEDEAR_MODERADO"]], 
                "allocation_pct": 50.0, 
                "reason": "Balance entre crecimiento y estabilidad con líder tecnológico."
            },
            {
                "ticker": TICKER_MAPPING["BONO_DESARROLLO"], 
                "name": ASSET_NAMES[TICKER_MAPPING["BONO_DESARROLLO"]], 
                "allocation_pct": 30.0, 
                "reason": "Renta fija con exposición a mercados emergentes."
            },
            {
                "ticker": TICKER_MAPPING["ETF_GLOBAL"], 
                "name": ASSET_NAMES[TICKER_MAPPING["ETF_GLOBAL"]], 
                "allocation_pct": 20.0, 
                "reason": "Diversificación internacional con cobertura global."
            }
        ]
        expected_return = 0.10
        risk = 0.08
    else: # high
        portfolio_assets = [
            {
                "ticker": TICKER_MAPPING["ACCION_ALTO_CRECIMIENTO"], 
                "name": ASSET_NAMES[TICKER_MAPPING["ACCION_ALTO_CRECIMIENTO"]], 
                "allocation_pct": 60.0, 
                "reason": "Alto potencial de crecimiento en sector tecnológico (IA y semiconductores)."
            },
            {
                "ticker": TICKER_MAPPING["CRYPTO_INNOVACION"], 
                "name": ASSET_NAMES[TICKER_MAPPING["CRYPTO_INNOVACION"]], 
                "allocation_pct": 20.0, 
                "reason": "Exposición a criptomoneda líder con alta volatilidad."
            },
            {
                "ticker": TICKER_MAPPING["COMMODITY_ESPECULATIVO"], 
                "name": ASSET_NAMES[TICKER_MAPPING["COMMODITY_ESPECULATIVO"]], 
                "allocation_pct": 20.0, 
                "reason": "Cobertura con oro físico y protección contra inflación."
            }
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
