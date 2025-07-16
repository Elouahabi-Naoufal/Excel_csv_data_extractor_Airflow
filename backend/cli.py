#!/usr/bin/env python3
import pandas as pd
import psycopg2
import warnings

warnings.filterwarnings('ignore', category=UserWarning, module='pandas')

DB_CONFIG = {
    'host': 'localhost',
    'port': 5432,
    'database': 'airflow',
    'user': 'airflow',
    'password': 'airflow'
}

def list_tables():
    query = "SELECT tablename FROM pg_tables WHERE tablename LIKE 'data_%'"
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        df = pd.read_sql(query, con=conn)
        return df['tablename'].tolist()
    finally:
        conn.close()

def describe_table(table_name):
    table_name = table_name.lower()
    query = f"""
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = '{table_name}'
    ORDER BY ordinal_position
    """
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        df = pd.read_sql(query, con=conn)
        return df
    finally:
        conn.close()

def query_table(table_name, limit=10):
    table_name = table_name.lower()
    conn = psycopg2.connect(**DB_CONFIG)
    try:
        # Get total row count
        count_query = f"SELECT COUNT(*) as total FROM {table_name}"
        count_df = pd.read_sql(count_query, con=conn)
        total_rows = count_df['total'].iloc[0]
        
        # Get limited data
        query = f"SELECT * FROM {table_name} LIMIT {limit}"
        df = pd.read_sql(query, con=conn)
        
        return df, total_rows
    finally:
        conn.close()

def main():
    while True:
        print("\n=== Excel Data CLI ===")
        print("1. List tables")
        print("2. Describe table")
        print("3. Query table")
        print("4. Exit")

        choice = input("\nSelect option: ").strip()

        if choice == '1':
            try:
                tables = list_tables()
                print(f"\nTables: {tables}")
            except Exception as e:
                print(f"Error listing tables: {e}")

        elif choice == '2':
            table = input("Table name: ").strip()
            try:
                schema = describe_table(table)
                print(f"\n{schema}")
            except Exception as e:
                print(f"Error describing table: {e}")

        elif choice == '3':
            table = input("Table name: ").strip()
            try:
                # Show table info first
                table_lower = table.lower()
                conn = psycopg2.connect(**DB_CONFIG)
                try:
                    count_query = f"SELECT COUNT(*) as total FROM {table_lower}"
                    count_df = pd.read_sql(count_query, con=conn)
                    total_rows = count_df['total'].iloc[0]
                finally:
                    conn.close()
                print(f"Table '{table}' has {total_rows} total rows")
                
                limit = input(f"Limit (default 10, max {total_rows}): ").strip() or "10"
                data, _ = query_table(table, int(limit))
                print(f"\nShowing {len(data)} of {total_rows} total rows:")
                print(f"\n{data}")
            except Exception as e:
                print(f"Error querying table: {e}")

        elif choice == '4':
            break
        else:
            print("Invalid option")

if __name__ == "__main__":
    main()
