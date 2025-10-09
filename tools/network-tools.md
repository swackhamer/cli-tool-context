## Network Tools

### **curl** - Data Transfer Tool
<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#essential, #network, #connectivity, #http, #api]
related: [wget, ssh, rsync, httpie]
keywords: [curl, http, download, upload, api, rest, transfer, url, protocol]
synonyms: [http-client, web-client, url-tool, api-client]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Tool for transferring data with URLs supporting many protocols
**Location**: `/usr/bin/curl`
**Difficulty**: ⭐⭐ Beginner (Simple requests) / ⭐⭐⭐⭐ Advanced (Complex auth, scripting)
**Common Use Cases**:

- HTTP API testing
- File downloading
- Web service interaction

**See Also**: `wget` (batch downloading), `ssh` (secure remote access), `rsync` (file synchronization)

**Examples**:

```bash
# Basic HTTP requests
curl https://api.example.com                    # Simple GET request
curl -I https://example.com                     # Headers only (HEAD request)
curl -L https://example.com                     # Follow redirects
curl -s https://api.example.com                 # Silent mode (no progress)

# POST requests and data submission
curl -X POST https://api.example.com            # Basic POST
curl -X POST -d "name=value" https://api.example.com
curl -X POST -H "Content-Type: application/json" -d '{"key":"value"}' https://api.example.com
curl -X POST -d @data.json https://api.example.com  # POST from file

# Authentication
curl -u username:password https://api.example.com   # Basic auth
curl -H "Authorization: Bearer token123" https://api.example.com
curl -H "X-API-Key: key123" https://api.example.com

# File operations
curl -O https://example.com/file.zip            # Download with original filename
curl -o custom.zip https://example.com/file.zip # Download with custom filename
curl -C - -O https://example.com/large.iso      # Resume interrupted download
curl -T file.txt ftp://server.com/              # Upload file

# Advanced options
curl -v https://api.example.com                 # Verbose output for debugging
curl --cookie "session=abc123" https://example.com
curl --cookie-jar cookies.txt https://example.com
curl -w "%{http_code} %{time_total}\n" https://api.example.com  # Custom output format
curl --max-time 30 https://api.example.com      # Timeout after 30 seconds

# Multiple requests
curl https://api.example.com/{users,posts,comments}  # Multiple URLs
curl -Z https://example.com/file[1-10].txt      # Parallel downloads

# Testing and monitoring
curl -w "@curl-format.txt" https://api.example.com  # Custom timing format
curl --trace-ascii debug.txt https://api.example.com  # Full trace
curl -o /dev/null -s -w "%{http_code}\n" https://api.example.com  # Status code only
```


### **wget** - File Downloader**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#essential, #network, #connectivity, #download]
related: [curl, rsync, scp, aria2]
keywords: [wget, download, retrieve, mirror, recursive, non-interactive, http, ftp]
synonyms: [downloader, web-downloader, file-retriever, mirror-tool]
platform: [macOS, Linux, Windows]
installation: brew install wget
-->
**Description**: Non-interactive network downloader
**Location**: `/opt/homebrew/bin/wget`
**Common Use Cases**:

- Bulk file downloading
- Website mirroring
- Automated downloads

**See Also**: `curl` (HTTP API testing), `rsync` (bidirectional sync), `scp` (secure copy)

**Examples**:

```bash
# Download file
wget https://example.com/file.zip

# Mirror website
wget -m -np https://example.com/

# Limit download speed
wget --limit-rate=300k url
```


### **xh** - Modern HTTP Client
<!-- metadata:
category: Network Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#network, #http, #modern-alternative, #rust, #api]
related: [curl, wget, httpie, curlie]
keywords: [xh, http, https, client, api, rest, modern, rust, httpie-like]
synonyms: [httpie-rust, modern-curl, http-client, api-tool]
platform: [macOS, Linux, Windows]
installation: brew install xh
-->
**Description**: Friendly and fast HTTP client written in Rust, HTTPie-like but faster
**Location**: `/opt/homebrew/bin/xh`
**Difficulty**: ⭐⭐ Beginner
**Common Use Cases**:

- API testing and debugging
- HTTP request/response inspection
- File uploading and downloading
- Authentication testing
- JSON API interaction

**See Also**: `curl` (powerful but complex), `wget` (downloading), `httpie` (Python alternative), `curlie` (curl frontend)

**Examples**:

```bash
# Basic requests
xh httpbin.org/get              # GET request
xh httpbin.org/post name=john   # POST with JSON
xh PUT httpbin.org/put id=5     # PUT request
xh DELETE httpbin.org/delete    # DELETE request

# Headers and authentication
xh httpbin.org/get Authorization:Bearer\ token123
xh httpbin.org/get X-API-Key:secret User-Agent:MyApp/1.0
xh -a user:pass httpbin.org/basic-auth/user/pass  # Basic auth
xh --bearer token123 api.example.com/protected    # Bearer auth

# JSON data
xh POST httpbin.org/post name=alice age:=30 active:=true
# name=alice sends as string "alice"
# age:=30 sends as number 30
# active:=true sends as boolean true

# Form data
xh -f POST httpbin.org/post name=bob email=bob@example.com  # Form encoded
xh -f POST httpbin.org/post file@/path/to/file.txt          # File upload

# Download files
xh -d httpbin.org/image/png         # Download with original filename
xh -do image.png httpbin.org/image  # Download with custom filename

# Response options
xh -h httpbin.org/get               # Headers only
xh -b httpbin.org/get               # Body only
xh -p hH httpbin.org/get            # Print request headers and response headers
xh -p Hh httpbin.org/get            # Print request/response headers (styled)

# Follow redirects
xh --follow httpbin.org/redirect/3  # Follow up to 3 redirects
xh -F httpbin.org/redirect-to url==http://example.com  # Follow all redirects

# Sessions (cookies persistence)
xh --session=./session.json httpbin.org/cookies/set/foo/bar
xh --session=./session.json httpbin.org/cookies  # Uses saved cookies

# Timeout and retry
xh --timeout 3.5 httpbin.org/delay/10  # 3.5 second timeout
xh --max-redirects 10 httpbin.org/redirect/20  # Limit redirects

# HTTPS options
xh --verify=no https://self-signed.badssl.com/  # Skip certificate verification
xh --cert client.pem --cert-key client.key https://example.com  # Client cert

# Pretty printing and formatting
xh httpbin.org/json                 # Pretty JSON by default
xh --pretty=none httpbin.org/json   # No formatting
xh --style monokai httpbin.org/get  # Different color scheme

# Offline mode (build request without sending)
xh --offline httpbin.org/post hello=world

# Environment variables
export XH_CONFIG_DIR=~/.config/xh   # Config directory
export NO_COLOR=1                   # Disable colors

# Practical examples
xh api.github.com/users/rust-lang   # Get GitHub user info
xh POST jsonplaceholder.typicode.com/posts title="Hello" body="World"
xh -a user:token api.example.com/v1/data page==1 limit==10  # Paginated API
```


### **ssh** - Secure Shell**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [secure-shell]
tags: [#essential, #network, #connectivity, #security, #remote]
related: [scp, rsync, ssh-keygen, mosh]
keywords: [ssh, secure, shell, remote, login, encrypted, terminal, connection]
synonyms: [secure-shell, remote-shell, encrypted-shell, remote-login]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: OpenSSH remote login client
**Location**: `/opt/homebrew/bin/ssh`
**Common Use Cases**:

- Remote server access
- Secure file transfer
- Tunnel creation

**See Also**: Related tools in this category

**Examples**:

```bash
# Connect to server
ssh user@hostname

# Use specific key
ssh -i keyfile user@hostname

# Port forwarding
ssh -L 8080:localhost:80 user@hostname

# Jump through bastion
ssh -J bastion@host user@target
```


### **scp** - Secure Copy**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [scp, secure copy]
synonyms: [scp]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: OpenSSH secure file copy
**Location**: `/opt/homebrew/bin/scp`
**Common Use Cases**:

- Secure file transfer between hosts
- Remote file copying
- Backup operations

**See Also**: Related tools in this category

**Examples**:

```bash
# Copy file to remote
scp file.txt user@host:/path/

# Copy from remote
scp user@host:/path/file.txt .

# Recursive directory copy
scp -r directory/ user@host:/path/
```


### **rsync** - File Synchronization**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [rsync, file synchronization]
synonyms: [rsync]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Efficient file transfer and synchronization
**Location**: `/usr/bin/rsync`
**Common Use Cases**:

- Incremental backups
- Large file transfers
- Directory synchronization

**See Also**: Related tools in this category

**Examples**:

```bash
# Sync directories
rsync -av source/ destination/

# Remote sync with compression
rsync -avz source/ user@host:/path/

# Delete extra files
rsync -av --delete source/ destination/
```


### **ping** - Network Connectivity Test**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐ Beginner
aliases: []
tags: [#essential, #network, #connectivity, #diagnostic]
related: [traceroute, dig, netstat, ss]
keywords: [ping, icmp, connectivity, test, latency, network, reachability, echo]
synonyms: [connectivity-test, network-test, reachability-test, icmp-ping]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: Send ICMP echo requests to test network connectivity
**Location**: `/sbin/ping`
**Common Use Cases**:

- Network troubleshooting
- Connectivity testing
- Network latency measurement
- Host reachability verification

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic ping
ping google.com

# Ping specific number of times
ping -c 4 8.8.8.8

# Ping with interval
ping -i 2 hostname

# Ping with specific packet size
ping -s 1000 hostname

# Quiet output (only summary)
ping -q -c 10 hostname

# Ping IPv6
ping6 ipv6.google.com

# Ping with timestamp
ping -D hostname

# Continuous ping with statistics
ping -c 100 hostname | tail -2
```


### **dig** - DNS Lookup Tool**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [domain-information-groper]
tags: [#essential, #network, #connectivity, #dns, #diagnostic]
related: [nslookup, host, whois, ping]
keywords: [dig, dns, lookup, domain, query, name-resolution, record, nameserver]
synonyms: [dns-lookup, domain-lookup, name-resolution, dns-query]
platform: [macOS, Linux, Windows]
installation: Built-in (system default)
-->
**Description**: DNS lookup utility for querying DNS servers
**Location**: `/usr/bin/dig`
**Common Use Cases**:

- DNS troubleshooting
- Domain information lookup
- DNS server testing
- Network diagnostics

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic DNS lookup
dig example.com

# Query specific record type
dig example.com MX
dig example.com AAAA
dig example.com TXT

# Query specific DNS server
dig @8.8.8.8 example.com

# Reverse DNS lookup
dig -x 8.8.8.8

# Short answer format
dig +short example.com
dig +short example.com MX

# Trace DNS resolution path
dig +trace example.com

# Query all record types
dig example.com ANY

# Query with specific DNS class
dig example.com IN A

# Batch queries from file
dig -f hostnames.txt

# DNS server testing
dig @ns1.example.com example.com SOA
```


### **nslookup** - DNS Lookup (Interactive)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nslookup, dns lookup (interactive)]
synonyms: [nslookup]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Interactive DNS lookup utility
**Location**: `/usr/bin/nslookup`
**Common Use Cases**:

- Interactive DNS queries
- DNS server configuration testing
- Domain troubleshooting
- Legacy DNS lookups

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic lookup
nslookup example.com

# Specify DNS server
nslookup example.com 8.8.8.8

# Interactive mode
nslookup
> set type=MX
> example.com
> set server=8.8.8.8
> example.com
> exit

# Reverse lookup
nslookup 8.8.8.8

# Query specific record types
nslookup -type=SOA example.com
nslookup -type=NS example.com
nslookup -type=TXT example.com

# Debug mode
nslookup -debug example.com
```


### **host** - DNS Lookup Utility**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [host, dns lookup utility]
synonyms: [host]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Simple DNS lookup utility
**Location**: `/usr/bin/host`
**Common Use Cases**:

- Quick DNS lookups
- Simple domain verification
- Scripted DNS queries
- Basic network troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic lookup
host example.com

# Specific record type
host -t MX example.com
host -t AAAA example.com
host -t TXT example.com

# All record types
host -a example.com

# Reverse lookup
host 8.8.8.8

# Specify DNS server
host example.com 8.8.8.8

# Verbose output
host -v example.com

# Query class and type
host -C example.com
host -t ANY example.com
```


### **whois** - Domain Information**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [whois, domain information]
synonyms: [whois]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Query domain registration and ownership information
**Location**: `/usr/bin/whois`
**Common Use Cases**:

- Domain ownership research
- Registration expiration checking
- Contact information lookup
- IP address block information

**See Also**: Related tools in this category

**Examples**:

```bash
# Domain whois lookup
whois example.com

# IP address whois
whois 8.8.8.8

# Specific whois server
whois -h whois.verisign-grs.com example.com

# ASN lookup
whois AS15169

# Network range lookup
whois -B 192.168.1.1

# Disable referral following
whois -r example.com

# Raw output format
whois -R example.com
```


### **nc (netcat)** - Network Swiss Army Knife**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [nc (netcat), network swiss army knife]
synonyms: [nc-(netcat)]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Versatile networking utility for reading/writing network connections
**Location**: `/usr/bin/nc`
**Common Use Cases**:

- Port scanning
- Network service testing
- File transfer over network
- Simple client/server setup

**See Also**: Related tools in this category

**Examples**:

```bash
# Port scanning
nc -zv hostname 22
nc -zv hostname 80-443

# Listen on port (server mode)
nc -l 8080

# Connect to service
nc hostname 80

# File transfer (sender)
nc -l 9999 < file.txt

# File transfer (receiver)
nc hostname 9999 > received_file.txt

# Chat server
nc -l 9999

# Banner grabbing
echo \"\" | nc hostname 80

# UDP mode
nc -u hostname 53

# Test HTTP service
echo -e \"GET / HTTP/1.0\\n\\n\" | nc hostname 80

# Proxy/relay
nc -l 8080 | nc target_host 80

# Port forwarding
mkfifo backpipe
nc -l 8080 0<backpipe | nc target_host 80 1>backpipe
```


### **telnet** - Remote Terminal Connection**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [telnet, remote terminal connection]
synonyms: [telnet]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: User interface to TELNET protocol for remote connections
**Location**: `/usr/bin/telnet`
**Common Use Cases**:

- Service connectivity testing
- Protocol debugging
- Legacy system access
- Network service troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Connect to telnet service
telnet hostname 23

# Test HTTP service
telnet hostname 80
# Then type: GET / HTTP/1.0

# Test SMTP service
telnet mail.server.com 25

# Test SSH service (check if listening)
telnet hostname 22

# Escape commands in telnet session
# Ctrl+] to enter command mode
# quit to exit

# Test custom port
telnet hostname 8080

# Connect with specific options
telnet -e ! hostname

# Script-friendly connection test
echo \"quit\" | telnet hostname port
```


### **traceroute** - Network Path Tracing**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [traceroute, network path tracing]
synonyms: [traceroute]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Trace the route packets take to reach destination
**Location**: `/usr/sbin/traceroute`
**Common Use Cases**:

- Network path analysis
- Routing troubleshooting
- Network latency identification
- Connection problem diagnosis

**See Also**: Related tools in this category

**Examples**:

```bash
# Basic traceroute
traceroute google.com

# Specify maximum hops
traceroute -m 20 hostname

# Use ICMP instead of UDP
traceroute -I hostname

# Use TCP SYN packets
traceroute -T hostname

# Specify port
traceroute -p 80 hostname

# Disable hostname resolution
traceroute -n hostname

# Specify interface
traceroute -i eth0 hostname

# IPv6 traceroute
traceroute6 hostname

# Continuous traceroute
while true; do traceroute hostname; sleep 60; done
```


### **netstat** - Network Statistics**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [netstat, network statistics]
synonyms: [netstat]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display network connections, routing tables, and network statistics
**Location**: `/usr/bin/netstat`
**Common Use Cases**:

- Active connection monitoring
- Port usage analysis
- Network troubleshooting
- Service verification

**See Also**: Related tools in this category

**Examples**:

```bash
# Show all connections
netstat -a

# Show listening ports only
netstat -l

# Show with process names (requires privileges)
netstat -p

# Show numerical addresses
netstat -n

# Show routing table
netstat -r

# Show network statistics
netstat -s

# Show specific protocol
netstat -t  # TCP
netstat -u  # UDP

# Continuous monitoring
netstat -c

# Show listening TCP ports with processes
netstat -tlnp

# Find who's using a specific port
netstat -tulpn | grep :80

# Show network interfaces
netstat -i
```


### **ss** - Socket Statistics (Modern netstat)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ss, socket statistics (modern nets]
synonyms: [ss]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Modern replacement for netstat with better performance
**Location**: `/usr/bin/ss` (if available)
**Common Use Cases**:

- Fast socket information display
- Network connection analysis
- Service monitoring
- Performance-optimized network stats

**See Also**: Related tools in this category

**Examples**:

```bash
# Show all sockets
ss -a

# Show listening sockets
ss -l

# Show TCP sockets
ss -t

# Show UDP sockets
ss -u

# Show with process information
ss -p

# Show numerical addresses
ss -n

# Show socket summary
ss -s

# Filter by state
ss state listening
ss state established

# Filter by port
ss -tulpn | grep :80
ss dst :443

# Show socket memory usage
ss -m

# Continuous monitoring
ss -i
```


### **arp** - Address Resolution Protocol**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [arp, address resolution protocol]
synonyms: [arp]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Display and modify ARP cache (IP to MAC address mapping)
**Location**: `/usr/sbin/arp`
**Common Use Cases**:

- Network troubleshooting
- MAC address discovery
- ARP cache management
- Local network analysis

**See Also**: Related tools in this category

**Examples**:

```bash
# Display ARP cache
arp -a

# Show specific host
arp hostname

# Show numerical addresses
arp -n

# Delete ARP entry
arp -d hostname

# Add static ARP entry
arp -s hostname 00:11:22:33:44:55

# Flush entire ARP cache
arp -d -a

# Show ARP cache for specific interface
arp -i eth0 -a
```


### **ifconfig** - Network Interface Configuration**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ifconfig, network interface configuratio]
synonyms: [ifconfig]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Configure and display network interface parameters
**Location**: `/sbin/ifconfig`
**Common Use Cases**:

- Interface configuration
- IP address management
- Network troubleshooting
- Interface status checking

**See Also**: Related tools in this category

**Examples**:

```bash
# Show all interfaces
ifconfig

# Show specific interface
ifconfig en0

# Assign IP address
ifconfig en0 192.168.1.100

# Set netmask
ifconfig en0 192.168.1.100 netmask 255.255.255.0

# Enable/disable interface
ifconfig en0 up
ifconfig en0 down

# Set MAC address
ifconfig en0 ether 00:11:22:33:44:55

# Configure MTU
ifconfig en0 mtu 1500

# Show interface statistics
ifconfig -a

# Create alias interface
ifconfig en0:1 192.168.1.101
```


### **mkcert** - Local HTTPS Certificates Tool
<!-- metadata:
category: Network Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#security, #certificates, #https, #development, #tls]
related: [openssl, certbot, caddy]
keywords: [mkcert, certificate, https, ssl, tls, localhost, development]
synonyms: [local-ca, dev-certs, localhost-https]
platform: [macOS, Linux, Windows]
installation: brew install mkcert
-->
**Description**: Simple tool for making locally-trusted development certificates
**Location**: `/opt/homebrew/bin/mkcert`
**Difficulty**: ⭐⭐⭐ Intermediate
**Common Use Cases**:

- Local HTTPS development
- Creating trusted certificates for localhost
- Multi-domain certificate generation
- Mobile device certificate trust
- Wildcard certificate creation

**See Also**: `openssl` (general SSL/TLS toolkit), `certbot` (Let's Encrypt client), `caddy` (automatic HTTPS)

**Examples**:

```bash
# Install local CA
mkcert -install

# Create certificate for localhost
mkcert localhost

# Create certificate for multiple domains
mkcert example.com "*.example.com" localhost 127.0.0.1 ::1

# Create certificate with custom names
mkcert -cert-file cert.pem -key-file key.pem example.local

# Create wildcard certificate
mkcert "*.local.dev"

# Create certificate for IP address
mkcert 192.168.1.100

# Show CA location
mkcert -CAROOT

# Create p12 format (for mobile)
mkcert -p12-file cert.p12 example.local

# Uninstall local CA
mkcert -uninstall

# Create client certificate
mkcert -client example.local

# Use with Node.js
# https.createServer({
#   key: fs.readFileSync('example.local-key.pem'),
#   cert: fs.readFileSync('example.local.pem')
# })
```

