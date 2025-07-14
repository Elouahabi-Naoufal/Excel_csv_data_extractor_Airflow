#!/usr/bin/env python3
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import psycopg2
import warnings
import os
import shutil
import requests
import glob
from pathlib import Path
from sqlalchemy import create_engine

warnings.filterwarnings('ignore', category=UserWarning, module='pandas')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'airflow',
    'user': 'airflow',
    'password': 'airflow'
}

@app.get("/tables")
def get_tables():
    print("[DEBUG] Getting tables...")
    query = "SELECT tablename FROM pg_tables WHERE tablename LIKE 'data_%'"
    try:
        print(f"[DEBUG] Connecting to DB: {DB_CONFIG['host']}:{DB_CONFIG['port']}")
        conn = psycopg2.connect(**DB_CONFIG)
        print("[DEBUG] DB connection successful")
        df = pd.read_sql(query, con=conn)
        tables = df['tablename'].tolist()
        print(f"[DEBUG] Found {len(tables)} tables: {tables}")
        return {"tables": tables}
    except Exception as e:
        print(f"[ERROR] Failed to get tables: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()
        print("[DEBUG] DB connection closed")

@app.get("/tables/{table_name}/schema")
def get_table_schema(table_name: str):
    print(f"[DEBUG] Getting schema for table: {table_name}")
    table_name = table_name.lower().replace('(', '').replace(')', '').replace(' ', '_')
    print(f"[DEBUG] Cleaned table name: {table_name}")
    query = f"""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = '{table_name}'
    ORDER BY ordinal_position
    """
    try:
        print(f"[DEBUG] Executing query: {query}")
        conn = psycopg2.connect(**DB_CONFIG)
        df = pd.read_sql(query, con=conn)
        schema = df.to_dict('records')
        print(f"[DEBUG] Found {len(schema)} columns for {table_name}")
        return {"schema": schema}
    except Exception as e:
        print(f"[ERROR] Failed to get schema for {table_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/tables/{table_name}/data")
def get_table_data(table_name: str, limit: int = 10):
    print(f"[DEBUG] Getting data for table: {table_name}, limit: {limit}")
    table_name = table_name.lower().replace('(', '').replace(')', '').replace(' ', '_')
    print(f"[DEBUG] Cleaned table name: {table_name}")
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        
        count_query = f"SELECT COUNT(*) as total FROM {table_name}"
        print(f"[DEBUG] Count query: {count_query}")
        count_df = pd.read_sql(count_query, con=conn)
        total_rows = int(count_df['total'].iloc[0])
        print(f"[DEBUG] Total rows: {total_rows}")
        
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        print(f"[DEBUG] Data query: {query}")
        df = pd.read_sql(query, con=conn)
        print(f"[DEBUG] Retrieved {len(df)} rows, {len(df.columns)} columns")
        
        return {
            "data": df.to_dict('records'),
            "columns": df.columns.tolist(),
            "total_rows": total_rows,
            "showing": len(df)
        }
    except Exception as e:
        print(f"[ERROR] Failed to get data for {table_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        conn.close()

@app.get("/tables/{table_name}/stats")
def get_table_stats(table_name: str):
    print(f"[DEBUG] Getting stats for table: {table_name}")
    original_table_name = table_name
    table_name = table_name.lower().replace('(', '').replace(')', '').replace(' ', '_')
    print(f"[DEBUG] Cleaned table name: {table_name}")
    
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        print(f"[DEBUG] Connected to database")
        
        query = f"SELECT * FROM {table_name}"
        print(f"[DEBUG] Executing query: {query}")
        df = pd.read_sql(query, con=conn)
        print(f"[DEBUG] Retrieved {len(df)} rows, {len(df.columns)} columns")
        
        stats = {
            "total_rows": len(df),
            "total_columns": len(df.columns),
            "columns": []
        }
        
        for col in df.columns:
            print(f"[DEBUG] Processing column: {col}")
            col_stats = {
                "name": col,
                "type": str(df[col].dtype),
                "non_null_count": int(df[col].count()),
                "null_count": int(df[col].isnull().sum()),
                "null_percentage": round(df[col].isnull().sum() / len(df) * 100, 2) if len(df) > 0 else 0
            }
            
            if df[col].dtype in ['int64', 'float64', 'Int64', 'Float64']:
                try:
                    col_stats.update({
                        "mean": round(float(df[col].mean()), 2) if pd.notna(df[col].mean()) else None,
                        "median": round(float(df[col].median()), 2) if pd.notna(df[col].median()) else None,
                        "min": float(df[col].min()) if pd.notna(df[col].min()) else None,
                        "max": float(df[col].max()) if pd.notna(df[col].max()) else None
                    })
                except Exception as col_error:
                    print(f"[ERROR] Error processing numeric stats for {col}: {col_error}")
                    col_stats.update({"mean": None, "median": None, "min": None, "max": None})
            
            stats["columns"].append(col_stats)
        
        print(f"[DEBUG] Generated stats for {len(stats['columns'])} columns")
        return stats
        
    except Exception as e:
        print(f"[ERROR] Failed to get stats for {original_table_name}: {e}")
        print(f"[ERROR] Exception type: {type(e)}")
        import traceback
        print(f"[ERROR] Traceback: {traceback.format_exc()}")
        raise HTTPException(status_code=500, detail=f"Error getting stats: {str(e)}")
    finally:
        if conn:
            conn.close()
            print(f"[DEBUG] Database connection closed")

from fastapi import Form

@app.post("/search-table")
def search_table_direct(table_name: str = Form(...), search_term: str = Form(...)):
    print(f"[DEBUG] Searching table: {table_name}, term: {search_term}")
    
    # Clean table name
    clean_table_name = table_name.lower().replace('(', '').replace(')', '').replace(' ', '_')
    
    conn = None
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        
        # Get all data from table
        query = f"SELECT * FROM {clean_table_name}"
        print(f"[DEBUG] Executing query: {query}")
        df = pd.read_sql(query, con=conn)
        
        if df.empty:
            print(f"Table {clean_table_name} is empty")
            return {
                "data": [],
                "columns": [],
                "found": 0,
                "search_term": search_term,
                "message": "Table is empty"
            }
        
        # Search across all columns
        mask = df.astype(str).apply(lambda x: x.str.contains(search_term, case=False, na=False)).any(axis=1)
        results = df[mask]
        
        if len(results) == 0:
            print(f"No results found for '{search_term}' in table {clean_table_name}")
            return {
                "data": [],
                "columns": [],
                "found": 0,
                "search_term": search_term,
                "message": f"No results found for '{search_term}' in this table."
            }
        
        print(f"Search completed. Found {len(results)} results")
        return {
            "data": results.to_dict('records'),
            "columns": results.columns.tolist(),
            "found": len(results),
            "search_term": search_term
        }
        
    except Exception as e:
        print(f"[ERROR] Search failed: {e}")
        return {
            "message": "Search failed", 
            "error": str(e),
            "data": [],
            "columns": [],
            "found": 0,
            "search_term": search_term
        }
    finally:
        if conn:
            conn.close()

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    print(f"[DEBUG] Upload request for file: {file.filename}")
    
    if not file.filename.endswith(('.xlsx', '.xls', '.csv')):
        print(f"[ERROR] Invalid file type: {file.filename}")
        raise HTTPException(status_code=400, detail="Only Excel and CSV files allowed")
    
    try:
        data_dir = Path("./data")
        data_dir.mkdir(exist_ok=True)
        print(f"[DEBUG] Data directory: {data_dir.absolute()}")
        
        file_path = data_dir / file.filename
        print(f"[DEBUG] Saving to: {file_path.absolute()}")
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = file_path.stat().st_size
        print(f"[DEBUG] File saved successfully, size: {file_size} bytes")
        
        return {"message": f"File {file.filename} uploaded successfully", "filename": file.filename}
    except Exception as e:
        print(f"[ERROR] Upload failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process-file")
def process_file():
    print("[DEBUG] Processing files directly...")
    
    try:
        # Process files immediately without waiting for Airflow
        data_dir = '/opt/airflow/data'
        if not os.path.exists('./data'):
            print("[ERROR] Data directory not found")
            return {"message": "No data directory found"}
        
        files = glob.glob("./data/*.xlsx") + glob.glob("./data/*.xls") + glob.glob("./data/*.csv")
        print(f"[DEBUG] Found {len(files)} files to process")
        
        if not files:
            return {"message": "No files found to process"}
        
        # Process files using the same logic as DAG
        db_url = 'postgresql://airflow:airflow@localhost:5432/airflow'
        engine = create_engine(db_url)
        
        processed_files = []
        for file_path in files:
            filename = os.path.basename(file_path).split('.')[0]
            table_name = f"data_{filename}".lower().replace('-', '_').replace(' ', '_')
            
            try:
                if file_path.endswith('.csv'):
                    df = pd.read_csv(file_path)
                else:
                    df = pd.read_excel(file_path)
                
                df.to_sql(table_name, engine, if_exists='replace', index=False)
                processed_files.append(f"{filename} -> {table_name} ({len(df)} rows)")
                print(f"[DEBUG] Processed: {file_path} -> {table_name}")
                
            except Exception as e:
                print(f"[ERROR] Failed to process {file_path}: {e}")
        
        return {
            "message": f"Successfully processed {len(processed_files)} files",
            "files": processed_files
        }
        
    except Exception as e:
        print(f"[ERROR] Processing failed: {e}")
        return {"message": "Processing failed", "error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)