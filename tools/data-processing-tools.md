## Data Processing Tools

### **jq** - JSON Processor**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [jq, json processor]
synonyms: [jq]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line JSON processor
**Location**: `/opt/homebrew/bin/jq`
**Common Use Cases**:

- JSON data manipulation
- API response processing
- Configuration file editing

**See Also**: Related tools in this category

**Examples**:

```bash
# Pretty print JSON
jq '.' file.json

# Extract field
jq '.field' file.json

# Filter array elements
jq '.[] | select(.status == "active")' file.json

# Transform data
jq '{name: .user.name, id: .user.id}' file.json
```


### **yq** - YAML Processor (like jq for YAML)
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#yaml, #data-processing, #configuration, #json]
related: [jq, jaq, xq, tomlq]
keywords: [yq, yaml, processor, query, transform, convert, json]
synonyms: [yaml-processor, yaml-jq, yaml-query]
platform: [macOS, Linux, Windows]
installation: brew install yq
-->
**Description**: Command-line YAML processor - jq wrapper for YAML, JSON, and XML
**Location**: `/opt/homebrew/bin/yq`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- YAML file querying and manipulation
- Converting between YAML, JSON, and XML
- Configuration file management
- CI/CD pipeline configuration editing
- Kubernetes manifest manipulation

**See Also**: `jq` (JSON processor), `xq` (XML processor), `tomlq` (TOML processor)

**Examples**:

```bash
# Read YAML value
yq '.version' config.yaml

# Read nested value
yq '.database.host' config.yaml

# Update value in place
yq -i '.version = "2.0"' config.yaml

# Add new field
yq '.newField = "value"' config.yaml

# Delete field
yq 'del(.unwanted)' config.yaml

# Convert YAML to JSON
yq -o json config.yaml

# Convert JSON to YAML
yq -P config.json

# Merge YAML files
yq eval-all 'select(fileIndex == 0) * select(fileIndex == 1)' file1.yaml file2.yaml

# Select array elements
yq '.items[0]' config.yaml

# Filter arrays
yq '.users[] | select(.age > 30)' users.yaml

# Pretty print
yq -P config.yaml

# Validate YAML
yq validate config.yaml

# Use with kubectl
kubectl get pod -o yaml | yq '.spec.containers[0].image'
```
### **sqlite3** - SQLite Database**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [sqlite3, sqlite database]
synonyms: [sqlite3]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line interface for SQLite databases
**Location**: `/usr/bin/sqlite3`
**Common Use Cases**:

- Database operations
- Data analysis
- Structured data storage

**See Also**: Related tools in this category

**Examples**:

```bash
# Open database
sqlite3 database.db

# Execute query
sqlite3 db.sqlite "SELECT * FROM table;"

# Import CSV
sqlite3 db.sqlite ".import data.csv table"

# Export to CSV
sqlite3 db.sqlite ".mode csv" ".output data.csv" "SELECT * FROM table;"
```


### **csvkit** - Suite of CSV Tools
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [csvkit, suite of csv tools]
synonyms: [csvkit]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Utilities for converting to and working with CSV files
**Location**: `/opt/homebrew/bin/csvstat`, `/opt/homebrew/bin/csvcut`, etc.
**Difficulty**: ⭐⭐ Beginner (Basic operations) / ⭐⭐⭐ Intermediate (Complex analysis)
**Common Use Cases**:

- CSV data analysis and manipulation
- Data cleaning and transformation
- Statistical analysis of tabular data
- CSV format conversion

**See Also**: `miller` (data processing), `datamash` (statistical operations), `awk` (text processing)

**Examples**:

```bash
# Get statistics about CSV data
csvstat data.csv                           # Basic statistics for all columns
csvstat -c column_name data.csv            # Statistics for specific column
csvstat --sum -c revenue data.csv          # Sum of revenue column

# Select and filter columns
csvcut -c 1,3,5 data.csv                   # Select columns 1, 3, 5
csvcut -c name,age,city data.csv           # Select columns by name
csvcut -n data.csv                         # Show column names and numbers

# Search and filter rows
csvgrep -c status -m "active" data.csv     # Filter rows where status is "active"
csvgrep -c age -r "^[3-9][0-9]" data.csv   # Regex: ages 30 and above
csvgrep -c city -f cities.txt data.csv     # Filter using values from file

# Format and convert
csvformat -T data.csv                      # Convert CSV to TSV
csvformat -U 1 data.csv                    # Remove duplicate headers
csvlook data.csv                           # Pretty print as table

# Sort and manipulate
csvsort -c column_name data.csv            # Sort by column
csvsort -c age -r data.csv                 # Reverse sort by age
csvstack file1.csv file2.csv > combined.csv  # Stack CSV files vertically

# Convert between formats
in2csv data.xlsx > data.csv                # Excel to CSV
in2csv --format ndjson data.json > data.csv  # NDJSON to CSV
csvjson data.csv > data.json               # CSV to JSON
```


### **miller** - Data Processing Multi-Tool
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [miller, data processing multi-tool]
synonyms: [miller]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Miller (mlr) processes name-indexed data (CSV, TSV, JSON) like awk, sed, cut, join, sort for structured data
**Location**: `/opt/homebrew/bin/mlr`
**Difficulty**: ⭐⭐⭐ Intermediate (Learning syntax) / ⭐⭐⭐⭐ Advanced (Complex transformations)
**Common Use Cases**:

- Multi-format data processing (CSV, TSV, JSON, XML)
- Data transformation and aggregation
- Stream processing of structured data
- Complex data analysis pipelines

**See Also**: `csvkit` (CSV-specific), `jq` (JSON processing), `datamash` (statistics)

**Examples**:

```bash
# Basic operations
mlr --csv cut -f name,age data.csv                    # Select columns
mlr --csv filter '$age > 30' data.csv                 # Filter rows
mlr --csv sort -f name data.csv                       # Sort by column
mlr --csv head -n 10 data.csv                         # First 10 rows

# Format conversion
mlr --icsv --ojson cat data.csv                       # CSV to JSON
mlr --ijson --ocsv cat data.json                      # JSON to CSV
mlr --icsv --otsv cat data.csv                        # CSV to TSV
mlr --icsv --opprint cat data.csv                     # CSV to pretty-printed table

# Statistical operations
mlr --csv stats1 -a mean,count -f age data.csv        # Mean and count of age
mlr --csv stats2 -a corr -f height,weight data.csv    # Correlation between columns
mlr --csv histogram -f age data.csv                   # Histogram of age values

# Data transformation
mlr --csv put '$age_group = ($age < 30) ? "young" : "old"' data.csv  # Add computed column
mlr --csv put '$salary *= 1.05' data.csv              # Increase salary by 5%
mlr --csv rename 'old_name,new_name' data.csv         # Rename column

# Aggregation and grouping
mlr --csv stats1 -a mean,sum -f salary -g department data.csv  # Group by department
mlr --csv count -f department data.csv                # Count by department
mlr --csv tac then sort -f name data.csv              # Reverse then sort

# Advanced pipeline
mlr --csv filter '$age > 25' then put '$bonus = $salary * 0.1' then stats1 -a sum -f bonus data.csv
```


### **datamash** - Statistical Operations
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [datamash, statistical operations]
synonyms: [datamash]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line program performing basic numeric, textual and statistical operations on input textual data files
**Location**: `/opt/homebrew/bin/datamash`
**Difficulty**: ⭐⭐ Beginner (Basic stats) / ⭐⭐⭐ Intermediate (Complex operations)
**Common Use Cases**:

- Statistical analysis of column data
- Mathematical operations on datasets
- Data grouping and aggregation
- Scientific data processing

**See Also**: `miller` (data processing), `csvkit` (CSV tools), `awk` (text processing)

**Examples**:

```bash
# Basic statistics
datamash mean 1 < data.txt                    # Mean of first column
datamash sum 1 count 1 < data.txt             # Sum and count
datamash min 1 max 1 median 1 < data.txt      # Min, max, median
datamash sstdev 1 var 1 < data.txt            # Standard deviation and variance

# Multiple columns
datamash mean 1 mean 2 sum 3 < data.txt       # Different operations on different columns
datamash -t, mean 2 sum 3 < data.csv          # CSV input (comma-separated)
datamash -W mean 1 sum 2 < data.txt           # Ignore whitespace

# Grouping operations
datamash -t, -g 1 mean 2 < data.csv           # Group by column 1, mean of column 2
datamash -t, -g 1,2 sum 3 count 3 < data.csv  # Group by two columns
datamash -g 1 unique 2 < data.txt             # Unique values in column 2 for each group

# Field operations
datamash transpose < data.txt                  # Transpose rows and columns
datamash reverse < data.txt                    # Reverse field order
datamash check < data.txt                      # Check data consistency

# Mathematical operations
seq 10 | datamash sum 1                       # Sum of numbers 1-10
echo -e "1 2\n3 4\n5 6" | datamash mean 1 mean 2  # Column means
```


### **csvq** - SQL on CSV Files
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [csvq, sql on csv files]
synonyms: [csvq]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: SQL-like query language for CSV files
**Location**: `/opt/homebrew/bin/csvq`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge required) / ⭐⭐⭐⭐ Advanced (Complex queries)
**Common Use Cases**:

- SQL queries on CSV files
- Data joining and analysis
- Complex data filtering and transformation
- CSV-based reporting

**See Also**: `dsq` (alternative SQL tool), `miller` (data processing), `sqlite3` (relational database)

**Examples**:

```bash
# Basic queries
csvq 'SELECT * FROM data.csv'                        # Select all data
csvq 'SELECT name, age FROM data.csv WHERE age > 30' # Filter and select columns
csvq 'SELECT COUNT(*) FROM data.csv'                 # Count rows
csvq 'SELECT DISTINCT department FROM data.csv'      # Unique values

# Aggregation and grouping
csvq 'SELECT department, AVG(salary) FROM data.csv GROUP BY department'
csvq 'SELECT department, COUNT(*) as count FROM data.csv GROUP BY department'
csvq 'SELECT MAX(age), MIN(age) FROM data.csv'

# Joins between CSV files
csvq 'SELECT e.name, e.salary, d.name as dept FROM employees.csv e JOIN departments.csv d ON e.dept_id = d.id'

# Output formatting
csvq -o output.csv 'SELECT * FROM data.csv WHERE age > 30'  # Save to file
csvq -f JSON 'SELECT name, age FROM data.csv'               # JSON output
csvq -f TSV 'SELECT * FROM data.csv'                        # TSV output

# Advanced queries
csvq 'SELECT name, CASE WHEN age < 30 THEN "young" ELSE "old" END as age_group FROM data.csv'
csvq 'SELECT * FROM data.csv ORDER BY salary DESC LIMIT 10' # Top 10 by salary
```


### **dsq** - SQL Queries on Structured Data
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [dsq, sql queries on structured data]
synonyms: [dsq]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Run SQL queries against JSON, CSV, Excel, Parquet, and more
**Location**: `/opt/homebrew/bin/dsq`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐ Advanced (Multiple formats)
**Common Use Cases**:

- SQL queries on multiple data formats
- Data format conversion via SQL
- Complex analytical queries
- Data pipeline processing

**See Also**: `csvq` (CSV-specific SQL), `jq` (JSON processing), `miller` (data processing)

**Examples**:

```bash
# Basic queries on different formats
dsq data.csv 'SELECT * FROM data WHERE age > 30'     # CSV query
dsq data.json 'SELECT name, age FROM data'           # JSON query
dsq data.xlsx 'SELECT * FROM {} ORDER BY salary'     # Excel query
dsq data.parquet 'SELECT COUNT(*) FROM {}'           # Parquet query

# Multi-file queries
dsq employees.csv departments.json 'SELECT e.name, d.department FROM employees e JOIN departments d ON e.dept_id = d.id'

# Format conversion via SQL
dsq --output-format json data.csv 'SELECT * FROM data'    # CSV to JSON
dsq --output-format csv data.json 'SELECT * FROM data'    # JSON to CSV
dsq data.xlsx --output-format parquet 'SELECT * FROM {}'  # Excel to Parquet

# Complex analytical queries
dsq sales.csv 'SELECT region, SUM(amount) as total FROM sales GROUP BY region HAVING total > 10000'
dsq logs.json 'SELECT DATE(timestamp) as date, COUNT(*) as events FROM logs GROUP BY date ORDER BY date'
```


### **mysql** - MySQL Database Client
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [mysql, mysql database client]
synonyms: [mysql]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Command-line tool for the MySQL database server
**Location**: `/opt/homebrew/bin/mysql`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐⭐ Expert (Database administration)
**Common Use Cases**:

- Database querying and management
- MySQL server administration
- Data import/export operations
- Application database integration

**See Also**: `psql` (PostgreSQL), `sqlite3` (SQLite), `mysqldump` (backup), `mysql_secure_installation`

**Examples**:

```bash
# Connect to MySQL server
mysql -u username -p                           # Connect with username (password prompt)
mysql -u root -h localhost -P 3306 -p          # Connect with specific host and port
mysql -u user -p database_name                 # Connect to specific database

# Execute queries from command line
mysql -u root -p -e "SHOW DATABASES;"          # Show all databases
mysql -u root -p -e "USE mydb; SHOW TABLES;"   # Show tables in database
mysql -u root -p database_name < script.sql    # Execute SQL script

# Database operations
mysql -u root -p -e "CREATE DATABASE myapp;"   # Create database
mysql -u root -p -e "DROP DATABASE olddb;"     # Delete database
mysql -u root -p -e "SHOW PROCESSLIST;"        # Show running queries

# Data import/export
mysqldump -u root -p database_name > backup.sql     # Export database
mysql -u root -p database_name < backup.sql         # Import database
mysql -u root -p -e "LOAD DATA INFILE 'data.csv' INTO TABLE mytable FIELDS TERMINATED BY ',';"

# User management
mysql -u root -p -e "CREATE USER 'newuser'@'localhost' IDENTIFIED BY 'password';"
mysql -u root -p -e "GRANT ALL PRIVILEGES ON database_name.* TO 'newuser'@'localhost';"
mysql -u root -p -e "FLUSH PRIVILEGES;"

# Performance and monitoring
mysql -u root -p -e "SHOW STATUS;"              # Server status
mysql -u root -p -e "SHOW VARIABLES;"           # Configuration variables
mysql -u root -p -e "EXPLAIN SELECT * FROM table WHERE condition;"  # Query analysis
```


### **psql** - PostgreSQL Interactive Terminal
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [psql, postgresql interactive termina]
synonyms: [psql]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Interactive terminal for working with PostgreSQL database
**Location**: `/opt/homebrew/bin/psql`
**Difficulty**: ⭐⭐⭐ Intermediate (SQL knowledge) / ⭐⭐⭐⭐⭐ Expert (Advanced features)
**Common Use Cases**:

- PostgreSQL database querying and administration
- Interactive SQL command execution
- Database schema management
- Data analysis and reporting

**See Also**: `mysql` (MySQL), `sqlite3` (SQLite), `pg_dump` (backup), `createdb`, `dropdb`

**Examples**:

```bash
# Connect to PostgreSQL
psql -U username -d database_name               # Connect to specific database
psql -h localhost -p 5432 -U postgres           # Connect with host and port
psql -U postgres -c "SELECT version();"         # Execute single command

# Database operations
psql -U postgres -c "CREATE DATABASE myapp;"    # Create database
psql -U postgres -c "DROP DATABASE olddb;"      # Delete database
psql -U postgres -l                             # List all databases

# Meta-commands (within psql)
# \l                                            # List databases
# \c database_name                              # Connect to database
# \dt                                           # List tables
# \d table_name                                 # Describe table structure
# \du                                           # List users
# \q                                            # Quit psql

# Data import/export
pg_dump -U postgres database_name > backup.sql  # Export database
psql -U postgres database_name < backup.sql     # Import database
psql -U postgres -d mydb -c "\copy table FROM 'data.csv' CSV HEADER;"  # Import CSV

# Advanced queries
psql -U postgres -d mydb -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
psql -U postgres -d mydb -c "SELECT column_name, data_type FROM information_schema.columns WHERE table_name='mytable';"

# JSON operations (PostgreSQL specific)
psql -U postgres -d mydb -c "SELECT data->>'name' FROM json_table WHERE data->>'status' = 'active';"
psql -U postgres -d mydb -c "SELECT jsonb_pretty(data) FROM json_table LIMIT 1;"

# Performance monitoring
psql -U postgres -c "SELECT * FROM pg_stat_activity;"           # Active connections
psql -U postgres -c "SELECT schemaname, tablename, attname, n_distinct, most_common_vals FROM pg_stats LIMIT 5;"
```


### **redis-cli** - Redis Command Line Interface
<!-- metadata:
category: Data Processing Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [redis-cli, redis command line interface]
synonyms: [redis-cli]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Interactive command-line client for Redis key-value store
**Location**: `/opt/homebrew/bin/redis-cli`
**Difficulty**: ⭐⭐ Beginner (Basic commands) / ⭐⭐⭐⭐ Advanced (Complex operations)
**Common Use Cases**:

- Redis database operations and management
- Caching operations and testing
- Real-time data manipulation
- Session storage management

**See Also**: `redis-server` (Redis server), `redis-benchmark` (performance testing)

**Examples**:

```bash
# Connect to Redis
redis-cli                                       # Connect to localhost:6379
redis-cli -h hostname -p 6380                   # Connect to specific host/port
redis-cli -a password                           # Connect with authentication
redis-cli --scan --pattern "user:*"             # Scan keys with pattern

# Basic key-value operations
redis-cli SET mykey "Hello World"               # Set key-value
redis-cli GET mykey                             # Get value by key
redis-cli DEL mykey                             # Delete key
redis-cli EXISTS mykey                          # Check if key exists

# String operations
redis-cli INCR counter                          # Increment number
redis-cli DECR counter                          # Decrement number
redis-cli APPEND mykey " - appended"            # Append to string
redis-cli STRLEN mykey                          # Get string length

# List operations
redis-cli LPUSH mylist "item1" "item2"          # Push to list (left)
redis-cli RPUSH mylist "item3"                  # Push to list (right)
redis-cli LRANGE mylist 0 -1                   # Get all list items
redis-cli LPOP mylist                           # Pop from list (left)

# Set operations
redis-cli SADD myset "member1" "member2"        # Add to set
redis-cli SMEMBERS myset                        # Get all set members
redis-cli SISMEMBER myset "member1"             # Check set membership
redis-cli SCARD myset                           # Get set size

# Hash operations
redis-cli HSET user:1000 name "John Doe" age 30  # Set hash fields
redis-cli HGET user:1000 name                   # Get hash field
redis-cli HGETALL user:1000                     # Get all hash fields
redis-cli HDEL user:1000 age                    # Delete hash field

# Key management and info
redis-cli KEYS "*"                              # List all keys (use carefully)
redis-cli SCAN 0 MATCH "user:*" COUNT 100       # Scan keys safely
redis-cli TTL mykey                             # Get key expiration time
redis-cli EXPIRE mykey 3600                     # Set key expiration (1 hour)

# Database operations
redis-cli FLUSHDB                               # Clear current database
redis-cli FLUSHALL                              # Clear all databases
redis-cli SELECT 1                              # Switch to database 1
redis-cli INFO                                  # Server information
redis-cli MONITOR                               # Monitor all commands (debugging)

# Batch operations
redis-cli --eval script.lua                     # Execute Lua script
redis-cli --pipe < commands.txt                 # Execute multiple commands from file
```

---

