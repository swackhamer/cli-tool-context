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

