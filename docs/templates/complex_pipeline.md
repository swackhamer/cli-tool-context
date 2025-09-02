# Complex Pipeline Response Template

Use this template when explaining multi-step command pipelines.

```
Pipeline:
1. `tool1` - prepare data
2. `tool2` - process
3. `tool3` - output

Complete: `tool1 input | tool2 --opt | tool3 > output`
```

## Example Usage

**User Query**: "How do I find and count unique IP addresses in a log file?"

**Response**:
```
Pipeline:
1. `grep` - extract IP addresses
2. `sort` - organize for uniqueness
3. `uniq -c` - count occurrences

Complete: `grep -oE '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' access.log | sort | uniq -c | sort -rn`
```

## Alternative Modern Pipeline

```
Modern Pipeline:
1. `ripgrep` - faster pattern matching
2. `sd` - simpler string processing
3. `jq` - structured data handling

Complete: `rg -o '[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+' access.log | sort | uniq -c`
```