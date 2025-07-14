import React, { useState, useEffect } from 'react';
import './App.css';

interface TableData {
  data: any[];
  columns: string[];
  total_rows: number;
  showing: number;
}

interface Schema {
  column_name: string;
  data_type: string;
  is_nullable: string;
}

function App() {
  const [tables, setTables] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('');
  const [tableData, setTableData] = useState<TableData | null>(null);
  const [schema, setSchema] = useState<Schema[]>([]);
  const [limit, setLimit] = useState<number>(10);
  const [view, setView] = useState<'upload' | 'tables' | 'schema' | 'data' | 'stats' | 'search'>('upload');
  const [tableStats, setTableStats] = useState<any>(null);
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchColumn, setSearchColumn] = useState<string>('all');
  const [searchOptions, setSearchOptions] = useState({
    caseSensitive: false,
    regex: false,
    exactMatch: false,
    limit: 100
  });
  const [tableColumns, setTableColumns] = useState<string[]>([]);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const highlightText = (text: string, searchTerm: string, exactMatch: boolean, caseSensitive: boolean) => {
    if (!searchTerm || exactMatch) return text;
    const flags = caseSensitive ? 'g' : 'gi';
    const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, flags);
    return text.replace(regex, '<mark>$1</mark>');
  };

  useEffect(() => {
    if (view === 'tables') {
      fetchTables();
    }
  }, [view]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('[DEBUG] File selected:', file.name, file.size, 'bytes');
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    try {
      console.log('[DEBUG] Uploading file...');
      const response = await fetch('http://localhost:8000/upload', {
        method: 'POST',
        body: formData,
      });
      console.log('[DEBUG] Upload response status:', response.status);
      const result = await response.json();
      console.log('[DEBUG] Upload result:', result);
      setUploadStatus(`✅ ${result.message}`);
    } catch (error) {
      console.error('[ERROR] Upload failed:', error);
      setUploadStatus('❌ Upload failed');
    }
    setLoading(false);
  };

  const processFile = async () => {
    console.log('[DEBUG] Processing file...');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/process-file', {
        method: 'POST',
      });
      console.log('[DEBUG] Process response status:', response.status);
      const result = await response.json();
      console.log('[DEBUG] Process result:', result);
      setUploadStatus(`🚀 ${result.message}`);
      setTimeout(() => setView('tables'), 2000);
    } catch (error) {
      console.error('[ERROR] Processing failed:', error);
      setUploadStatus('❌ Failed to process file');
    }
    setLoading(false);
  };

  const fetchTables = async () => {
    console.log('[DEBUG] Fetching tables...');
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8000/tables');
      console.log('[DEBUG] Tables response status:', response.status);
      const data = await response.json();
      console.log('[DEBUG] Tables data:', data);
      setTables(data.tables);
    } catch (error) {
      console.error('[ERROR] Error fetching tables:', error);
    }
    setLoading(false);
  };

  const fetchSchema = async (tableName: string) => {
    console.log('[DEBUG] Fetching schema for:', tableName);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tables/${tableName}/schema`);
      console.log('[DEBUG] Schema response status:', response.status);
      const data = await response.json();
      console.log('[DEBUG] Schema data:', data);
      setSchema(data.schema);
      setView('schema');
    } catch (error) {
      console.error('[ERROR] Error fetching schema:', error);
    }
    setLoading(false);
  };

  const fetchData = async (tableName: string, limitValue: number) => {
    console.log('[DEBUG] Fetching data for:', tableName, 'limit:', limitValue);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tables/${tableName}/data?limit=${limitValue}`);
      console.log('[DEBUG] Data response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG] Data result:', data);
        setTableData(data);
        setView('data');
      } else {
        console.error('[ERROR] Data fetch failed:', response.status);
      }
    } catch (error) {
      console.error('[ERROR] Error fetching data:', error);
    }
    setLoading(false);
  };

  const fetchStats = async (tableName: string) => {
    console.log('[DEBUG] Fetching stats for:', tableName);
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8000/tables/${tableName}/stats`);
      console.log('[DEBUG] Stats response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG] Stats result:', data);
        setTableStats(data);
        setView('stats');
      } else {
        console.error('[ERROR] Stats endpoint failed:', response.status);
      }
    } catch (error) {
      console.error('[ERROR] Error fetching stats:', error);
    }
    setLoading(false);
  };

  const fetchTableColumns = async (tableName: string) => {
    try {
      const response = await fetch(`http://localhost:8000/tables/${tableName}/columns`);
      if (response.ok) {
        const data = await response.json();
        setTableColumns(data.columns);
      }
    } catch (error) {
      console.error('[ERROR] Error fetching columns:', error);
    }
  };

  const searchTable = async (tableName: string, query: string) => {
    console.log('[DEBUG] Advanced search:', { tableName, query, searchColumn, searchOptions });
    setLoading(true);
    try {
      const formData = new URLSearchParams();
      formData.append('table_name', tableName);
      formData.append('search_term', query);
      formData.append('column', searchColumn);
      formData.append('case_sensitive', searchOptions.caseSensitive.toString());
      formData.append('regex', searchOptions.regex.toString());
      formData.append('exact_match', searchOptions.exactMatch.toString());
      formData.append('limit', searchOptions.limit.toString());

      const response = await fetch('http://localhost:8000/search-table', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('[DEBUG] Search result:', data);
        setSearchResults(data);
        setView('search');
      } else {
        console.error('[ERROR] Search failed:', response.status);
      }
    } catch (error) {
      console.error('[ERROR] Error searching:', error);
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="expleo-header">
          <div className="expleo-logo">
            <span className="bracket-left">{'{'}</span>
            <span className="expleo-text">EXPLEO</span>
            <span className="bracket-right">{'}'}</span>
          </div>
          <h1>Excel Data Explorer</h1>
        </div>
        
        {loading && <div className="loading">⏳ Processing...</div>}

        {view === 'upload' && (
          <div className="upload-section">
            <h2>Upload Your Data File</h2>
            <div className="upload-area">
              <input
                type="file"
                accept=".xlsx,.xls,.csv"
                onChange={handleFileUpload}
                className="file-input"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="file-label">
                Choose Excel or CSV File
              </label>
            </div>
            {uploadStatus && (
              <div className="status-message">
                <p>{uploadStatus}</p>
                {uploadStatus.includes('✅') && (
                  <button onClick={processFile} className="process-btn">
                    Process File
                  </button>
                )}
              </div>
            )}
            <div className="upload-actions">
              <button onClick={() => setView('tables')} className="view-files-btn">
                View Processed Files
              </button>
            </div>
          </div>
        )}

        {view !== 'upload' && (
          <div className="nav-section">
            <button onClick={() => setView('upload')} className="nav-btn">
              Upload New File
            </button>
            <button onClick={() => setView('tables')} className="nav-btn">
              View Tables
            </button>
          </div>
        )}

        {view === 'tables' && (
          <div className="tables-section">
            <h2>Available Data Tables</h2>
            <div className="table-grid">
              {tables.map(table => (
                <div key={table} className="table-card">
                  <h3>{table.replace('data_', '').replace('_', ' ')}</h3>
                  <div className="table-actions">
                    <button onClick={() => {setSelectedTable(table); fetchSchema(table);}} className="action-btn schema-btn">
                      Schema
                    </button>
                    <button onClick={() => {setSelectedTable(table); fetchStats(table);}} className="action-btn stats-btn">
                      Statistics
                    </button>
                    <button onClick={() => {
                      setSelectedTable(table);
                      fetchTableColumns(table);
                      setView('search');
                    }} className="action-btn search-btn">
                      Search
                    </button>
                    <button onClick={() => {setSelectedTable(table); fetchData(table, 10);}} className="action-btn data-btn">
                      View Data
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'schema' && selectedTable && (
          <div className="schema-section">
            <div className="section-header">
              <button onClick={() => setView('tables')} className="back-btn">
                ← Back to Tables
              </button>
              <h2>Schema: {selectedTable.replace('data_', '').replace('_', ' ')}</h2>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Column Name</th>
                    <th>Data Type</th>
                    <th>Nullable</th>
                  </tr>
                </thead>
                <tbody>
                  {schema.map((col, idx) => (
                    <tr key={idx}>
                      <td><strong>{col.column_name}</strong></td>
                      <td><span className="data-type">{col.data_type}</span></td>
                      <td>{col.is_nullable === 'YES' ? '✅' : '❌'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'stats' && selectedTable && tableStats && (
          <div className="stats-section">
            <div className="section-header">
              <button onClick={() => setView('tables')} className="back-btn">
                ← Back to Tables
              </button>
              <h2>Statistics: {selectedTable.replace('data_', '').replace('_', ' ')}</h2>
            </div>
            <div className="stats-overview">
              <div className="stat-card">
                <h3>{tableStats.total_rows}</h3>
                <p>Total Rows</p>
              </div>
              <div className="stat-card">
                <h3>{tableStats.total_columns}</h3>
                <p>Total Columns</p>
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Column</th>
                    <th>Type</th>
                    <th>Non-Null</th>
                    <th>Null %</th>
                    <th>Min</th>
                    <th>Max</th>
                    <th>Mean</th>
                    <th>Median</th>
                  </tr>
                </thead>
                <tbody>
                  {tableStats.columns && tableStats.columns.map((col: any, idx: number) => (
                    <tr key={idx}>
                      <td><strong>{col.name}</strong></td>
                      <td><span className="data-type">{col.type}</span></td>
                      <td>{col.non_null_count}</td>
                      <td>{col.null_percentage}%</td>
                      <td>{col.min || '-'}</td>
                      <td>{col.max || '-'}</td>
                      <td>{col.mean || '-'}</td>
                      <td>{col.median || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'search' && selectedTable && (
          <div className="search-section">
            <div className="section-header">
              <button onClick={() => setView('tables')} className="back-btn">
                ← Back to Tables
              </button>
              <h2>Search: {selectedTable.replace('data_', '').replace('_', ' ')}</h2>
            </div>
            <div className="search-controls">
              <div className="search-row">
                <input
                  type="text"
                  placeholder="Enter search term..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select 
                  value={searchColumn} 
                  onChange={(e) => setSearchColumn(e.target.value)}
                  className="column-select"
                >
                  <option value="all">All Columns</option>
                  {tableColumns.map(col => (
                    <option key={col} value={col}>{col}</option>
                  ))}
                </select>
              </div>
              
              <div className="search-options">
                <label className="option-label">
                  <input
                    type="checkbox"
                    checked={searchOptions.caseSensitive}
                    onChange={(e) => setSearchOptions({...searchOptions, caseSensitive: e.target.checked})}
                  />
                  Case Sensitive
                </label>
                <label className="option-label">
                  <input
                    type="checkbox"
                    checked={searchOptions.exactMatch}
                    onChange={(e) => setSearchOptions({...searchOptions, exactMatch: e.target.checked})}
                  />
                  Exact Match
                </label>
                <label className="option-label">
                  <input
                    type="checkbox"
                    checked={searchOptions.regex}
                    onChange={(e) => setSearchOptions({...searchOptions, regex: e.target.checked})}
                  />
                  Regex
                </label>
                <div className="limit-control">
                  <label>Max Results:</label>
                  <input
                    type="number"
                    value={searchOptions.limit}
                    onChange={(e) => setSearchOptions({...searchOptions, limit: parseInt(e.target.value) || 100})}
                    min="1"
                    max="1000"
                    className="limit-input"
                  />
                </div>
              </div>
              
              <button 
                onClick={() => searchTable(selectedTable, searchTerm)} 
                className="search-button"
                disabled={!searchTerm.trim()}
              >
                Advanced Search
              </button>
            </div>
            {searchResults && (
              <div className="search-results">
                {searchResults.found > 0 ? (
                  <>
                    <div className="search-summary">
                      <p>Found <strong>{searchResults.found}</strong> results for "{searchResults.search_term}"</p>
                      {searchResults.filters && (
                        <div className="applied-filters">
                          <span>Filters: </span>
                          {searchResults.filters.column !== 'all' && <span className="filter-tag">Column: {searchResults.filters.column}</span>}
                          {searchResults.filters.case_sensitive && <span className="filter-tag">Case Sensitive</span>}
                          {searchResults.filters.exact_match && <span className="filter-tag">Exact Match</span>}
                          {searchResults.filters.regex && <span className="filter-tag">Regex</span>}
                          <span className="filter-tag">Limit: {searchResults.filters.limit}</span>
                        </div>
                      )}
                    </div>
                    <div className="table-container">
                      <table className="data-table">
                        <thead>
                          <tr>
                            {searchResults.columns.map((col: string) => (
                              <th key={col}>{col}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {searchResults.data && searchResults.data.map((row: any, idx: number) => (
                            <tr key={idx}>
                              {searchResults.columns && searchResults.columns.map((col: string) => (
                                <td key={col} dangerouslySetInnerHTML={{
                                __html: highlightText(
                                  String(row[col] || ''), 
                                  searchResults.search_term,
                                  searchResults.filters?.exact_match || false,
                                  searchResults.filters?.case_sensitive || false
                                )
                              }}></td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </>
                ) : (
                  <div className="no-results">
                    <p>{searchResults.message || `No results found for "${searchResults.search_term}"`}</p>
                    <p>Try adjusting your search filters or using different keywords.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {view === 'data' && selectedTable && tableData && (
          <div className="data-section">
            <div className="section-header">
              <button onClick={() => setView('tables')} className="back-btn">
                ← Back to Tables
              </button>
              <h2>Data: {selectedTable.replace('data_', '').replace('_', ' ')}</h2>
            </div>
            <div className="data-controls">
              <div className="limit-control">
                <label>Rows to show:</label>
                <input 
                  type="number" 
                  value={limit} 
                  onChange={(e) => setLimit(Number(e.target.value))}
                  min="1"
                  max={tableData.total_rows}
                />
                <button onClick={() => fetchData(selectedTable, limit)} className="refresh-btn">
                  Refresh
                </button>
              </div>
              <div className="row-info">
                Showing <strong>{tableData.showing}</strong> of <strong>{tableData.total_rows}</strong> total rows
              </div>
            </div>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    {tableData.columns.map(col => (
                      <th key={col}>{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tableData.data && tableData.data.map((row, idx) => (
                    <tr key={idx}>
                      {tableData.columns && tableData.columns.map(col => (
                        <td key={col}>{String(row[col] || '')}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;