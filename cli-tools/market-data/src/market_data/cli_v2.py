#!/usr/bin/env python3
"""
JARVIS Market Data CLI Tool v2

Fetches real market data using Alpaca API (preferred) or yfinance (fallback).
"""

import json
from typing import Optional

import typer
from rich import print as rprint
from rich.console import Console
from rich.table import Table

from .data_providers import get_data_provider

app = typer.Typer(help="JARVIS Market Data Tool - Fetch real-time market data")
console = Console()


@app.command()
def current(
    symbol: str = typer.Argument(..., help="Stock/ETF symbol (e.g., SPY, QQQ)"),
    json_output: bool = typer.Option(False, "--json", help="Output as JSON"),
):
    """Get current price and basic info for a symbol."""
    try:
        provider = get_data_provider()
        data = provider.get_current_price(symbol)

        if json_output:
            print(json.dumps(data, indent=2))
        else:
            table = Table(title=f"{symbol.upper()} - Current Market Data")
            table.add_column("Metric", style="cyan")
            table.add_column("Value", style="green")

            for key, value in data.items():
                if value is not None and key != "data_source":
                    if isinstance(value, (int, float)):
                        if key in ["volume", "market_cap"]:
                            formatted = f"{value:,.0f}"
                        else:
                            formatted = f"${value:,.2f}"
                    else:
                        formatted = str(value)
                    table.add_row(key.replace("_", " ").title(), formatted)

            console.print(table)
            console.print(f"\n[dim]Data source: {data.get('data_source', 'Unknown')}[/dim]")

    except Exception as e:
        console.print(f"[red]Error fetching data for {symbol}: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def history(
    symbol: str = typer.Argument(..., help="Stock/ETF symbol"),
    days: int = typer.Option(200, "--days", "-d", help="Number of trading days"),
    json_output: bool = typer.Option(False, "--json", help="Output as JSON"),
):
    """Get historical price data for a symbol."""
    try:
        provider = get_data_provider()
        hist = provider.get_history(symbol, days=days)

        if hist.empty:
            console.print(f"[red]No data found for {symbol}[/red]")
            raise typer.Exit(1)

        if json_output:
            # Convert to JSON-friendly format
            data = {
                "symbol": symbol.upper(),
                "data_points": len(hist),
                "latest_price": float(hist['Close'].iloc[-1]),
                "date_range": {
                    "start": hist.index[0].strftime("%Y-%m-%d"),
                    "end": hist.index[-1].strftime("%Y-%m-%d"),
                },
                "prices": [
                    {
                        "date": idx.strftime("%Y-%m-%d"),
                        "open": float(row['Open']),
                        "high": float(row['High']),
                        "low": float(row['Low']),
                        "close": float(row['Close']),
                        "volume": int(row['Volume']),
                    }
                    for idx, row in hist.iterrows()
                ],
            }
            print(json.dumps(data, indent=2))
        else:
            console.print(f"\n[cyan]{symbol.upper()}[/cyan] Historical Data")
            console.print(f"Data points: {len(hist)}")
            console.print(f"Date range: {hist.index[0].date()} to {hist.index[-1].date()}")
            console.print(f"\nLatest price: [green]${hist['Close'].iloc[-1]:.2f}[/green]")
            console.print("\nLast 5 days:")
            console.print(hist[['Open', 'High', 'Low', 'Close', 'Volume']].tail())

    except Exception as e:
        console.print(f"[red]Error fetching history for {symbol}: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def indicators(
    symbol: str = typer.Argument(..., help="Stock/ETF symbol"),
    json_output: bool = typer.Option(False, "--json", help="Output as JSON"),
):
    """Calculate technical indicators (SMAs, RSI, MACD)."""
    try:
        provider = get_data_provider()
        # Get extra data to ensure we have enough for 200 SMA
        hist = provider.get_history(symbol, days=250)

        if len(hist) < 200:
            console.print(f"[yellow]Warning: Only {len(hist)} days of data available (need 200 for 200 SMA)[/yellow]")

        # Calculate SMAs
        close_prices = hist['Close']
        sma_20 = close_prices.rolling(window=20).mean().iloc[-1] if len(close_prices) >= 20 else None
        sma_50 = close_prices.rolling(window=50).mean().iloc[-1] if len(close_prices) >= 50 else None
        sma_150 = close_prices.rolling(window=150).mean().iloc[-1] if len(close_prices) >= 150 else None
        sma_200 = close_prices.rolling(window=200).mean().iloc[-1] if len(close_prices) >= 200 else None

        current_price = close_prices.iloc[-1]

        # Calculate RSI
        def calculate_rsi(prices, period=14):
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return rsi.iloc[-1]

        rsi = calculate_rsi(close_prices) if len(close_prices) >= 14 else None

        # Calculate MACD
        def calculate_macd(prices):
            ema_12 = prices.ewm(span=12, adjust=False).mean()
            ema_26 = prices.ewm(span=26, adjust=False).mean()
            macd_line = ema_12 - ema_26
            signal_line = macd_line.ewm(span=9, adjust=False).mean()
            return macd_line.iloc[-1], signal_line.iloc[-1]

        macd, macd_signal = calculate_macd(close_prices) if len(close_prices) >= 26 else (None, None)

        data = {
            "symbol": symbol.upper(),
            "current_price": float(current_price),
            "data_points": len(hist),
            "sma_20": float(sma_20) if sma_20 else None,
            "sma_50": float(sma_50) if sma_50 else None,
            "sma_150": float(sma_150) if sma_150 else None,
            "sma_200": float(sma_200) if sma_200 else None,
            "price_vs_sma_50_pct": float((current_price - sma_50) / sma_50 * 100) if sma_50 else None,
            "price_vs_sma_150_pct": float((current_price - sma_150) / sma_150 * 100) if sma_150 else None,
            "price_vs_sma_200_pct": float((current_price - sma_200) / sma_200 * 100) if sma_200 else None,
            "rsi_14": float(rsi) if rsi else None,
            "macd": float(macd) if macd else None,
            "macd_signal": float(macd_signal) if macd_signal else None,
        }

        if json_output:
            print(json.dumps(data, indent=2))
        else:
            table = Table(title=f"{symbol.upper()} - Technical Indicators")
            table.add_column("Indicator", style="cyan")
            table.add_column("Value", style="green")
            table.add_column("vs Price", style="yellow")

            table.add_row("Current Price", f"${current_price:.2f}", "-")
            table.add_row("Data Points", str(len(hist)), "-")

            if sma_20:
                diff_pct = (current_price - sma_20) / sma_20 * 100
                table.add_row("20 SMA", f"${sma_20:.2f}", f"{diff_pct:+.1f}%")

            if sma_50:
                diff_pct = (current_price - sma_50) / sma_50 * 100
                table.add_row("50 SMA", f"${sma_50:.2f}", f"{diff_pct:+.1f}%")

            if sma_150:
                diff_pct = (current_price - sma_150) / sma_150 * 100
                table.add_row("150 SMA", f"${sma_150:.2f}", f"{diff_pct:+.1f}%")

            if sma_200:
                diff_pct = (current_price - sma_200) / sma_200 * 100
                table.add_row("200 SMA", f"${sma_200:.2f}", f"{diff_pct:+.1f}%")
            else:
                table.add_row("200 SMA", "[red]N/A (need 200 days)[/red]", "-")

            console.print(table)

            if rsi:
                rsi_status = "Overbought" if rsi > 70 else "Oversold" if rsi < 30 else "Neutral"
                console.print(f"\nRSI (14): [cyan]{rsi:.1f}[/cyan] - {rsi_status}")

            if macd and macd_signal:
                macd_status = "Bullish" if macd > macd_signal else "Bearish"
                console.print(f"MACD: [cyan]{macd:.2f}[/cyan] vs Signal: [cyan]{macd_signal:.2f}[/cyan] - {macd_status}")

            console.print(f"\n[dim]Using {type(provider).__name__}[/dim]")

    except Exception as e:
        console.print(f"[red]Error calculating indicators for {symbol}: {e}[/red]")
        raise typer.Exit(1)


@app.command()
def stage(
    symbol: str = typer.Argument(..., help="Stock/ETF symbol"),
    json_output: bool = typer.Option(False, "--json", help="Output as JSON"),
):
    """Determine the current market stage (1-4) for a symbol."""
    try:
        provider = get_data_provider()
        hist = provider.get_history(symbol, days=250)
        close_prices = hist['Close']
        current_price = close_prices.iloc[-1]

        # Calculate SMAs
        sma_50 = close_prices.rolling(window=50).mean().iloc[-1] if len(close_prices) >= 50 else None
        sma_150 = close_prices.rolling(window=150).mean().iloc[-1] if len(close_prices) >= 150 else None
        sma_200 = close_prices.rolling(window=200).mean().iloc[-1] if len(close_prices) >= 200 else None

        # Calculate RSI
        def calculate_rsi(prices, period=14):
            delta = prices.diff()
            gain = (delta.where(delta > 0, 0)).rolling(window=period).mean()
            loss = (-delta.where(delta < 0, 0)).rolling(window=period).mean()
            rs = gain / loss
            rsi = 100 - (100 / (1 + rs))
            return rsi.iloc[-1]

        rsi = calculate_rsi(close_prices) if len(close_prices) >= 14 else None

        # Determine stage based on criteria
        stage_num = None
        stage_name = None
        confidence = "Low"

        if sma_50 and sma_150 and sma_200:
            # Stage 2: Markup (bullish uptrend)
            if (current_price > sma_50 > sma_150 > sma_200 and
                (rsi is None or 50 < rsi < 70)):
                stage_num = 2
                stage_name = "Markup"
                confidence = "High"

            # Stage 4: Decline (bearish downtrend)
            elif (current_price < sma_50 < sma_150 and
                  (rsi is None or rsi < 50)):
                stage_num = 4
                stage_name = "Decline"
                confidence = "High"

            # Stage 3: Distribution (topping)
            elif (current_price > sma_150 and
                  not (sma_50 > sma_150 > sma_200) and
                  (rsi is None or rsi > 70)):
                stage_num = 3
                stage_name = "Distribution"
                confidence = "Medium"

            # Stage 1: Accumulation (basing)
            else:
                stage_num = 1
                stage_name = "Accumulation"
                confidence = "Medium"

        data = {
            "symbol": symbol.upper(),
            "stage": stage_num,
            "stage_name": stage_name,
            "confidence": confidence,
            "current_price": float(current_price),
            "sma_50": float(sma_50) if sma_50 else None,
            "sma_150": float(sma_150) if sma_150 else None,
            "sma_200": float(sma_200) if sma_200 else None,
            "rsi": float(rsi) if rsi else None,
        }

        if json_output:
            print(json.dumps(data, indent=2))
        else:
            console.print(f"\n[cyan]{symbol.upper()}[/cyan] Market Stage Analysis")
            if stage_num:
                console.print(f"\nStage: [yellow]Stage {stage_num} - {stage_name}[/yellow]")
                console.print(f"Confidence: [green]{confidence}[/green]")
            else:
                console.print("\n[yellow]Unable to determine stage (insufficient data)[/yellow]")

            console.print(f"\nCurrent Price: ${current_price:.2f}")
            if sma_50:
                console.print(f"50 SMA: ${sma_50:.2f}")
            if sma_150:
                console.print(f"150 SMA: ${sma_150:.2f}")
            if sma_200:
                console.print(f"200 SMA: ${sma_200:.2f}")
            if rsi:
                console.print(f"RSI: {rsi:.1f}")

    except Exception as e:
        console.print(f"[red]Error determining stage for {symbol}: {e}[/red]")
        raise typer.Exit(1)


if __name__ == "__main__":
    app()
