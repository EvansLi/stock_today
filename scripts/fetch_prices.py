import os
import json
import datetime
import yfinance as yf

def main():
    # 決定路徑
    script_dir = os.path.dirname(os.path.abspath(__file__))
    portfolio_path = os.path.normpath(os.path.join(script_dir, "..", "public", "data", "portfolio.json"))
    prices_path = os.path.normpath(os.path.join(script_dir, "..", "public", "data", "prices.json"))
    
    print(f"Reading portfolio from: {portfolio_path}")
    
    if not os.path.exists(portfolio_path):
        print(f"Error: portfolio.json not found at {portfolio_path}")
        return
        
    with open(portfolio_path, "r", encoding="utf-8") as f:
        portfolio = json.load(f)
        
    # 取得不重複的 symbol 清單
    symbols = list(set(item["symbol"] for item in portfolio))
    print(f"Symbols found: {symbols}")
    
    # 獲取匯率 USDTWD=X
    exchange_rate = 32.0  # 預設值
    try:
        print("Fetching USDTWD=X exchange rate...")
        rate_ticker = yf.Ticker("USDTWD=X")
        rate_df = rate_ticker.history(period="5d")
        if not rate_df.empty:
            exchange_rate = float(rate_df.iloc[-1]["Close"])
            print(f"Latest USDTWD exchange rate: {exchange_rate:.4f}")
        else:
            print("Exchange rate data frame is empty, using fallback 32.0")
    except Exception as e:
        print(f"Failed to fetch exchange rate, using fallback 32.0. Error: {e}")
        
    prices_data = {}
    
    for symbol in symbols:
        print(f"Fetching data for {symbol}...")
        try:
            ticker = yf.Ticker(symbol)
            # 獲取最近 5 天的歷史 K 線
            df = ticker.history(period="5d")
            
            if df.empty:
                print(f"Warning: No data returned for {symbol}. Skipping.")
                continue
                
            # 最新一筆 Close 為 currentPrice
            current_price = float(df.iloc[-1]["Close"])
            
            # 如果有大於等於 2 筆，倒數第二筆為 previousClose
            if len(df) >= 2:
                previous_close = float(df.iloc[-2]["Close"])
            else:
                previous_close = float(df.iloc[-1]["Open"])  # Fallback to open price if only 1 data point
                
            # 決定幣別
            if symbol.endswith(".TW") or symbol.endswith(".TWO"):
                currency = "TWD"
            else:
                currency = "USD"
                
            prices_data[symbol] = {
                "currentPrice": round(current_price, 2),
                "previousClose": round(previous_close, 2),
                "currency": currency
            }
            print(f"Success: {symbol} | Current: {current_price:.2f} | Prev Close: {previous_close:.2f} | {currency}")
            
        except Exception as e:
            print(f"Error fetching data for {symbol}: {e}. Skipping.")
            
    # 組合輸出格式
    output = {
        "updatedAt": datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "exchangeRate": {
            "USDTWD": round(exchange_rate, 4)
        },
        "data": prices_data
    }
    
    print(f"Writing prices data to: {prices_path}")
    os.makedirs(os.path.dirname(prices_path), exist_ok=True)
    with open(prices_path, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)
        
    print("Done!")

if __name__ == "__main__":
    main()
