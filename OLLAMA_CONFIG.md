# 🦙 Ollama Configuration Guide

## Current Setup

Your CyberBot AI is now configured to use **Ollama** - a free, local AI that runs on your Mac!

### Active Configuration (.env)
```
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2:1b
OLLAMA_TIMEOUT=60
```

### Current Model: llama3.2:1b
- **Size:** 1.3GB
- **Response Time:** 5-10 seconds (first message), 2-5 seconds (follow-up)
- **Quality:** Good for general chat, cybersecurity basics
- **Memory:** Uses ~2GB RAM when active

---

## Alternative Models You Can Try

### 🚀 Faster Model
```bash
ollama pull llama3.2:1b    # Already installed! (Current)
```
- Best for: Quick responses, general chat
- Trade-off: Slightly lower quality

### ⚡ Better Quality (Slower)
```bash
ollama pull llama3.2:3b
```
- **Size:** 2GB
- **Response Time:** 15-30 seconds
- **Quality:** Much better reasoning and technical answers
- **Memory:** Uses ~3GB RAM

**To use:** Update `.env` file:
```
OLLAMA_MODEL=llama3.2:3b
```

### 🎯 High Quality Models

#### Mistral 7B
```bash
ollama pull mistral:7b
```
- **Size:** 4.1GB
- **Response Time:** 20-40 seconds
- **Quality:** Excellent reasoning, technical depth
- **Memory:** Uses ~8GB RAM

#### CodeLlama 7B (Best for Cybersecurity Code)
```bash
ollama pull codellama:7b
```
- **Size:** 3.8GB
- **Response Time:** 20-40 seconds
- **Quality:** Specialized for code analysis and security
- **Memory:** Uses ~8GB RAM

**To use:** Update `.env` file:
```
OLLAMA_MODEL=mistral:7b
# or
OLLAMA_MODEL=codellama:7b
```

---

## Switching Models

### Option 1: Edit .env file
1. Open `.env`
2. Change `OLLAMA_MODEL=llama3.2:1b` to your desired model
3. Restart Flask backend:
   ```bash
   # Kill existing process
   lsof -ti:5001 | xargs kill -9

   # Restart with new config
   cd "/Users/hajimemiyazaki/Desktop/AI/Cyber Bot AI/antyboty"
   source venv/bin/activate
   python app.py &
   ```

### Option 2: Test model before switching
```bash
# Try the model directly in terminal
ollama run llama3.2:3b "Explain SQL injection"

# If you like it, update .env and restart Flask
```

---

## Troubleshooting

### Model Taking Too Long?
- Switch to smaller model (llama3.2:1b)
- Close other apps to free up RAM
- Check CPU usage: `top -o cpu`

### "No Response Received" Error?
1. Check Ollama is running:
   ```bash
   brew services list | grep ollama
   ```

2. Test Ollama directly:
   ```bash
   ollama run llama3.2:1b "Hi"
   ```

3. Restart Ollama:
   ```bash
   brew services restart ollama
   ```

### Model Not Found?
```bash
# List installed models
ollama list

# Install missing model
ollama pull llama3.2:1b
```

---

## Performance Comparison

| Model | Size | Speed | Quality | Use Case |
|-------|------|-------|---------|----------|
| **llama3.2:1b** ⭐ | 1.3GB | ⚡⚡⚡ Fast | ⭐⭐ Good | Current choice - Quick chat |
| llama3.2:3b | 2GB | ⚡⚡ Medium | ⭐⭐⭐ Better | More detailed answers |
| mistral:7b | 4.1GB | ⚡ Slower | ⭐⭐⭐⭐ Excellent | Complex reasoning |
| codellama:7b | 3.8GB | ⚡ Slower | ⭐⭐⭐⭐ Excellent | Security code analysis |

---

## Benefits of Ollama (vs OpenAI)

✅ **Free** - No API costs, unlimited usage
✅ **Private** - Data never leaves your Mac
✅ **Offline** - Works without internet
✅ **Fast** - No network latency (5-10 seconds with 1B model)
✅ **No Limits** - No rate limits or quotas

---

## Current Status

```bash
# Check everything is running
brew services list | grep -E "ollama|mongodb|postgres"

# Expected output:
# ollama                started
# mongodb-community     started
# postgresql@14         started

# Test Ollama
ollama run llama3.2:1b "Hi"
# Should respond in ~5 seconds ✅

# Check Flask backend
curl http://localhost:5001/api/health
# Should connect (even if route not found) ✅

# Check React frontend
# Browser: http://localhost:3000
# Should see "🦙 Ollama (Free, Local)" in dropdown ✅
```

---

## Your Setup is Complete! ✅

- ✅ Ollama running on http://localhost:11434
- ✅ Model: llama3.2:1b (fast, 1.3GB)
- ✅ Flask backend configured with .env settings
- ✅ React frontend shows Ollama in dropdown
- ✅ Chat working with 5-10 second responses

**Ready to chat with your local AI!** 🦙💬
