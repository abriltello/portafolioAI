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

    # Listado extendido de activos para diversificación
    EXTENDED_ASSETS = [
        {"ticker": "TLT", "name": "iShares 20+ Year Treasury Bond ETF", "reason": "Bonos del tesoro estadounidense a largo plazo."},
        {"ticker": "JNJ", "name": "Johnson & Johnson", "reason": "Empresa farmacéutica estable con dividendos."},
        {"ticker": "MSFT", "name": "Microsoft Corporation", "reason": "Líder tecnológico global."},
        {"ticker": "EMB", "name": "iShares Emerging Markets Bond ETF", "reason": "Bonos de mercados emergentes."},
        {"ticker": "VT", "name": "Vanguard Total World Stock ETF", "reason": "Cobertura global diversificada."},
        {"ticker": "NVDA", "name": "NVIDIA Corporation", "reason": "Tecnología y semiconductores."},
        {"ticker": "BTC-USD", "name": "Bitcoin USD", "reason": "Criptomoneda líder, alta volatilidad."},
        {"ticker": "GLD", "name": "SPDR Gold Trust", "reason": "Oro físico, protección contra inflación."},
        {"ticker": "AAPL", "name": "Apple Inc.", "reason": "Innovación y consumo global."},
        {"ticker": "GOOGL", "name": "Alphabet Inc.", "reason": "Tecnología y publicidad digital."},
        {"ticker": "AMZN", "name": "Amazon.com Inc.", "reason": "E-commerce y servicios en la nube."},
        {"ticker": "XLF", "name": "Financial Select Sector SPDR Fund", "reason": "Sector financiero diversificado."},
        {"ticker": "XLE", "name": "Energy Select Sector SPDR Fund", "reason": "Sector energético diversificado."}
    ]

    # Selección y asignación según perfil
    if risk_level == "low":
        selected = EXTENDED_ASSETS[:5]
        allocations = [35, 25, 15, 15, 10]
        expected_return = 0.05
        risk = 0.03
    elif risk_level == "medium":
        selected = EXTENDED_ASSETS[:7]
        allocations = [25, 15, 15, 15, 10, 10, 10]
        expected_return = 0.10
        risk = 0.08
    else: # high
        selected = EXTENDED_ASSETS[:10]
        allocations = [18, 15, 13, 12, 10, 10, 8, 7, 4, 3]
        expected_return = 0.18
        risk = 0.15

    portfolio_assets = []
    for i, asset in enumerate(selected):
        portfolio_assets.append({
            "ticker": asset["ticker"],
            "name": asset["name"],
            "allocation_pct": allocations[i],
            "reason": asset["reason"]
        })

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
