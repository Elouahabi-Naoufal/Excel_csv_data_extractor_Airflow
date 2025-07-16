from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator
import pandas as pd
import os
import glob
from sqlalchemy import create_engine

def process_files():
    """Process all Excel/CSV files in data directory"""
    data_dir = '/opt/airflow/data'
    db_url = 'postgresql://airflow:airflow@postgres:5432/airflow'
    engine = create_engine(db_url)
    
    files = glob.glob(f"{data_dir}/*.xlsx") + glob.glob(f"{data_dir}/*.xls") + glob.glob(f"{data_dir}/*.csv")
    
    for file_path in files:
        filename = os.path.basename(file_path).split('.')[0]
        table_name = f"data_{filename}".lower().replace('-', '_').replace(' ', '_')
        
        try:
            if file_path.endswith('.csv'):
                df = pd.read_csv(file_path)
            else:
                df = pd.read_excel(file_path)
            
            df.to_sql(table_name, engine, if_exists='replace', index=False)
            print(f"Loaded {file_path} -> {table_name} ({len(df)} rows, {len(df.columns)} columns)")
            
        except Exception as e:
            print(f"Error processing {file_path}: {e}")

def search_table_data(**context):
    """Search for data in specified table"""
    dag_run = context.get('dag_run')
    if not dag_run or not dag_run.conf:
        raise ValueError("No DAG run configuration provided")
    
    table_name = dag_run.conf.get('table_name')
    search_term = dag_run.conf.get('search_term')
    
    if not table_name:
        raise ValueError("No table_name provided in DAG configuration")
    if not search_term:
        raise ValueError("No search_term provided in DAG configuration")
    
    print(f"Searching table {table_name} for: {search_term}")
    
    db_url = 'postgresql://airflow:airflow@postgres:5432/airflow'
    engine = create_engine(db_url)
    
    try:
        # Get all data from table
        query = f"SELECT * FROM {table_name}"
        df = pd.read_sql(query, engine)
        
        if df.empty:
            print(f"Table {table_name} is empty")
            # Create empty results table
            results_table = f"search_results_{table_name}"
            df.to_sql(results_table, engine, if_exists='replace', index=False)
            return {"found": 0, "results_table": results_table, "message": "Table is empty"}
        
        # Search across all columns
        mask = df.astype(str).apply(lambda x: x.str.contains(search_term, case=False, na=False)).any(axis=1)
        results = df[mask]
        
        # Save results to a temporary table
        results_table = f"search_results_{table_name}"
        results.to_sql(results_table, engine, if_exists='replace', index=False)
        
        if len(results) == 0:
            print(f"No results found for '{search_term}' in table {table_name}")
            return {"found": 0, "results_table": results_table, "message": f"No results found for '{search_term}'"}
        
        print(f"Search completed. Found {len(results)} results. Saved to {results_table}")
        return {"found": len(results), "results_table": results_table}
        
    except Exception as e:
        print(f"Search failed: {e}")
        raise e

dag = DAG(
    'excel_csv_processor',
    default_args={
        'owner': 'airflow',
        'retries': 1,
        'retry_delay': timedelta(minutes=1),
    },
    description='Process Excel/CSV files',
    schedule=timedelta(minutes=5),
    start_date=datetime(2024, 1, 1),
    catchup=False,
)

process_task = PythonOperator(
    task_id='process_files',
    python_callable=process_files,
    dag=dag,
)

search_task = PythonOperator(
    task_id='search_table',
    python_callable=search_table_data,
    dag=dag,
)