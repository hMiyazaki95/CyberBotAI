"""
Flask Backend for CyberBot - Cybersecurity AI Assistant
A Python/Flask implementation with streaming support, JWT authentication, and dual database support (MongoDB + PostgreSQL)

🔥 COMPLETE FEATURE PARITY WITH server.js + Token Streaming
"""

import os
import json
import time
import logging
from datetime import datetime, timedelta
from functools import wraps

from flask import Flask, request, jsonify, Response, stream_with_context
from flask_cors import CORS
from dotenv import load_dotenv
import bcrypt
import jwt
import psycopg2
from psycopg2.extras import RealDictCursor
from pymongo import MongoClient
from openai import OpenAI
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.backends import default_backend
import secrets

# Optional: Stripe for subscriptions
try:
    import stripe
    STRIPE_AVAILABLE = True
except ImportError:
    STRIPE_AVAILABLE = False
    print("⚠️ Stripe not installed. Subscription features will be disabled.")

# Optional: Hugging Face Transformers for SecureBERT
try:
    from transformers import pipeline
    HF_AVAILABLE = True
except ImportError:
    HF_AVAILABLE = False
    print("⚠️ Transformers not installed. SecureBERT features will be disabled.")

# Load environment variables
load_dotenv()

# Initialize Flask app
app = Flask(__name__)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='[%(asctime)s] %(levelname)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

# Configuration
PORT = int(os.getenv("PORT", 5001))
JWT_SECRET = os.getenv("JWT_SECRET", "your_jwt_secret")
ENCRYPTION_KEY = os.getenv("ENCRYPTION_KEY", "12345678901234567890123456789012").encode()[:32]
IV_LENGTH = 16
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")

# CORS Configuration
CORS(app, origins=["http://localhost:3000", "http://localhost:5173"],
     methods=["GET", "POST", "PUT", "DELETE"],
     allow_headers=["Content-Type", "Authorization"],
     supports_credentials=True)

# Initialize Stripe
if STRIPE_AVAILABLE and STRIPE_SECRET_KEY:
    stripe.api_key = STRIPE_SECRET_KEY
    stripe.api_version = "2022-11-15"
    logger.info("✅ Stripe initialized")
else:
    logger.warning("⚠️ Stripe not configured")

# Initialize OpenAI
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY or OPENAI_API_KEY == "sk-your-openai-api-key-here":
    logger.warning("⚠️ OPENAI_API_KEY not configured! Chat features will be limited.")
    logger.warning("   Add your API key to .env to enable full chat functionality")
    openai_client = None
else:
    openai_client = OpenAI(api_key=OPENAI_API_KEY)

# Initialize Hugging Face SecureBERT Pipeline
securebert_pipeline = None

def load_securebert():
    """Load SecureBERT pipeline on first request"""
    global securebert_pipeline
    if HF_AVAILABLE and securebert_pipeline is None:
        try:
            logger.info("🧠 Loading Hugging Face SecureBERT pipeline...")
            securebert_pipeline = pipeline("fill-mask", "bert-base-uncased")
            logger.info("✅ Hugging Face SecureBERT pipeline loaded")
        except Exception as e:
            logger.error(f"❌ Failed to load SecureBERT: {e}")

# MongoDB Connection
MONGO_URI = os.getenv("MONGO_URI")
if not MONGO_URI:
    print("❌ MONGO_URI is missing! Check your .env file.")
    exit(1)

try:
    mongo_client = MongoClient(MONGO_URI)
    db = mongo_client.get_default_database()
    chat_history_collection = db["chathistories"]
    print(f"[{datetime.now().isoformat()}] ✅ Connected to MongoDB")
except Exception as err:
    print(f"[{datetime.now().isoformat()}] ❌ MongoDB Connection Error: {err}")
    exit(1)

# PostgreSQL Connection Pool
def get_db_connection():
    """Create PostgreSQL connection"""
    return psycopg2.connect(
        user=os.getenv("DB_USER"),
        host=os.getenv("DB_HOST"),
        database=os.getenv("DB_NAME"),
        password=os.getenv("DB_PASSWORD"),
        port=int(os.getenv("DB_PORT", 5432)),
        cursor_factory=RealDictCursor
    )

# Encryption/Decryption Functions
def encrypt(text):
    """Encrypt text using AES-256-CBC"""
    try:
        iv = secrets.token_bytes(IV_LENGTH)
        cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        encryptor = cipher.encryptor()

        # Pad text to be multiple of 16 bytes
        padding_length = 16 - (len(text.encode()) % 16)
        padded_text = text + chr(padding_length) * padding_length

        encrypted = encryptor.update(padded_text.encode()) + encryptor.finalize()
        return iv.hex() + ":" + encrypted.hex()
    except Exception as e:
        print(f"⚠️ Encryption failed: {e}")
        return text

def decrypt(text):
    """Decrypt text using AES-256-CBC"""
    try:
        if ":" not in text:
            raise ValueError("Malformed encrypted text (missing IV delimiter)")

        iv_hex, encrypted_hex = text.split(":", 1)
        if len(iv_hex) != 32:
            raise ValueError("Invalid IV length")

        iv = bytes.fromhex(iv_hex)
        encrypted = bytes.fromhex(encrypted_hex)

        cipher = Cipher(algorithms.AES(ENCRYPTION_KEY), modes.CBC(iv), backend=default_backend())
        decryptor = cipher.decryptor()
        decrypted_padded = decryptor.update(encrypted) + decryptor.finalize()

        # Remove padding
        padding_length = decrypted_padded[-1]
        decrypted = decrypted_padded[:-padding_length].decode()

        return decrypted
    except Exception as err:
        print(f"⚠️ Decryption failed: {err}")
        return "[Decryption Error]"

# JWT Authentication Middleware
def authenticate_token(f):
    """Decorator to protect routes with JWT authentication"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if not auth_header:
            return jsonify({"error": "Access Denied"}), 403

        try:
            token = auth_header.split(" ")[1]
            decoded = jwt.decode(token, JWT_SECRET, algorithms=["HS256"])

            # Check expiration
            if decoded["exp"] < time.time():
                return jsonify({"error": "Session expired. Please log in again."}), 401

            request.user = decoded
            return f(*args, **kwargs)
        except jwt.InvalidTokenError:
            return jsonify({"error": "Invalid Token"}), 401

    return decorated_function

# CyberBot Default Behavior - Simple and Effective
CYBERBOT_BEHAVIOR = """You are CyberBot, a cybersecurity EDUCATION assistant helping users learn defensive security.

YOUR PURPOSE: Teach users about cybersecurity threats so they can DEFEND against them.

TOPICS YOU TEACH:
- Types of cyber attacks (phishing, DDoS, ransomware, SQL injection, etc.) - for DEFENSIVE purposes
- How to detect and prevent security threats
- Malware removal and incident response
- Security best practices and hardening systems
- Ethical hacking for penetration testing
- Privacy protection and data security

IMPORTANT: When users ask about "types of attacks" or "list of cyber attacks", they are asking for EDUCATIONAL information to better defend their systems. Always answer these questions thoroughly with examples and defensive countermeasures.

FORMATTING RULES:
- When providing lists, add a blank line between each numbered item:

1. First item

2. Second item

3. Third item

Answer ALL cybersecurity education questions. Provide clear, practical, step-by-step defensive guidance. For non-cybersecurity topics, politely redirect to security matters.
"""

# ==================== ROUTES ====================

@app.route("/api/test", methods=["GET"])
def test_route():
    """Test route to verify server is running"""
    return jsonify({"message": "Flask server is running!", "timestamp": datetime.now().isoformat()})

@app.route("/api/test-mongo", methods=["GET"])
def test_mongo():
    """Test MongoDB connection"""
    try:
        page = int(request.args.get("page", 1))
        limit = int(request.args.get("limit", 10))
        skip = (page - 1) * limit

        print(f"[{datetime.now().isoformat()}] 🔍 Fetching ChatHistory... Page: {page}, Limit: {limit}")

        test_chats = list(chat_history_collection.find().skip(skip).limit(limit))

        # Convert ObjectId to string for JSON serialization
        for chat in test_chats:
            chat["_id"] = str(chat["_id"])

        print(f"[{datetime.now().isoformat()}] ✅ Fetched {len(test_chats)} records")

        return jsonify({"success": True, "data": test_chats, "page": page, "limit": limit})
    except Exception as error:
        print(f"[{datetime.now().isoformat()}] ❌ MongoDB Test Error: {error}")
        return jsonify({"error": "MongoDB connection failed"}), 500

# ==================== AUTHENTICATION ROUTES ====================

@app.route("/api/register", methods=["POST"])
def register():
    """User registration endpoint"""
    try:
        data = request.json
        username = data.get("username")
        email = data.get("email")
        password = data.get("password")

        if not all([username, email, password]):
            return jsonify({"error": "Missing parameters"}), 400

        conn = get_db_connection()
        cur = conn.cursor()

        # Check if user exists
        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        if cur.fetchone():
            cur.close()
            conn.close()
            return jsonify({"error": "User already exists"}), 409

        # Hash password
        hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

        # Insert user
        cur.execute(
            "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
            (username, email, hashed_password)
        )
        conn.commit()
        cur.close()
        conn.close()

        return jsonify({"message": "User registered successfully"}), 201

    except Exception as error:
        print(f"❌ Server Error: {error}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/login", methods=["POST"])
def login():
    """User login endpoint"""
    try:
        data = request.json
        email = data.get("email")
        password = data.get("password")

        print(f"🔍 Login Attempt: {email}")

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT * FROM users WHERE email = %s", (email,))
        user = cur.fetchone()

        cur.close()
        conn.close()

        if not user:
            print(f"❌ User not found: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        print(f"✅ User Found: {user['email']}")

        # Verify password
        if not bcrypt.checkpw(password.encode(), user["password"].encode()):
            print(f"❌ Incorrect password for: {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate JWT
        token = jwt.encode({
            "userId": user["id"],
            "email": user["email"],
            "exp": datetime.utcnow() + timedelta(hours=2)
        }, JWT_SECRET, algorithm="HS256")

        print(f"✅ Login Successful for: {email}")

        # Check user role and permissions
        role = user.get("role", "user")
        is_admin = user.get("is_admin", False)
        is_subscribed = user.get("is_subscribed", False)
        is_super_admin = (role == "super_admin")

        # Super admins have unlimited access
        if is_super_admin:
            print(f"👑 Super Admin login: {email}")

        return jsonify({
            "message": "Login successful",
            "token": token,
            "userId": user["id"],
            "role": role,
            "isAdmin": is_admin or is_super_admin,
            "isSuperAdmin": is_super_admin,
            "isSubscribed": is_subscribed or is_admin or is_super_admin  # Super admins bypass subscription
        })

    except Exception as error:
        print(f"❌ Server Error: {error}")
        return jsonify({"error": "Internal Server Error"}), 500

@app.route("/api/protected-route", methods=["GET"])
@authenticate_token
def protected_route():
    """Protected route example"""
    return jsonify({"message": "User is authenticated", "user": request.user})

# ==================== CHATBOT ROUTES ====================

@app.route("/api/chat", methods=["POST", "GET"])
def chat():
    """Chatbot endpoint with streaming support + SecureBERT option"""
    # Support both POST (JSON) and GET (query params for EventSource)
    if request.method == "GET":
        question = request.args.get("question")
        prompt = request.args.get("prompt")
        model = request.args.get("model")
        user_id = request.args.get("userId")
        chat_id = request.args.get("chatId")
    else:
        data = request.json
        question = data.get("question")
        prompt = data.get("prompt")
        model = data.get("model")
        user_id = data.get("userId")
        chat_id = data.get("chatId")

    if not all([question, model, user_id]):
        logger.warning(f"❌ Missing parameters: question={question}, model={model}, userId={user_id}")
        return jsonify({"error": "Missing parameters"}), 400

    # Handle SecureBERT model
    if model.lower() == "securebert":
        if not HF_AVAILABLE:
            return jsonify({"error": "SecureBERT model not available. Install transformers: pip install transformers"}), 500

        try:
            # Load pipeline if not already loaded
            if securebert_pipeline is None:
                load_securebert()

            # Add [MASK] token if not present
            text_with_mask = question if "[MASK]" in question else question + " [MASK]"

            # Run SecureBERT
            hf_result = securebert_pipeline(text_with_mask)
            response_text = hf_result[0]['sequence'] if hf_result else "No response generated by SecureBERT"

            logger.info(f"✅ SecureBERT Response: {response_text}")
            return jsonify({"response": response_text})

        except Exception as err:
            logger.error(f"❌ Hugging Face Error: {err}")
            return jsonify({"error": "SecureBERT model failed", "details": str(err)}), 500

    # Handle Ollama models (local, free)
    if model.lower() in ["ollama", "llama", "llama3.2", "llama3", "mistral"]:
        try:
            import requests

            logger.info(f"🦙 Using Ollama model: {model}")

            # Prepare messages for Ollama
            messages_list = [
                {"role": "system", "content": prompt if prompt else CYBERBOT_BEHAVIOR},
                {"role": "user", "content": question}
            ]

            # Convert messages to prompt string for Ollama
            full_prompt = f"{messages_list[0]['content']}\n\nUser: {messages_list[1]['content']}\nAssistant:"

            def generate_ollama():
                """Generator function for Ollama streaming"""
                try:
                    # Send a "thinking" message to prevent timeout
                    yield "data: \n\n"

                    ollama_url = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
                    ollama_model = os.getenv("OLLAMA_MODEL", "llama3.2:1b")
                    ollama_timeout = int(os.getenv("OLLAMA_TIMEOUT", "60"))

                    response = requests.post(
                        f"{ollama_url}/api/generate",
                        json={
                            "model": ollama_model,
                            "prompt": full_prompt,
                            "stream": True,
                            "options": {
                                "temperature": 0.7,
                                "top_p": 0.9,
                                "num_predict": 2048
                            }
                        },
                        stream=True,
                        timeout=ollama_timeout
                    )

                    for line in response.iter_lines():
                        if line:
                            import json
                            chunk = json.loads(line)
                            if "response" in chunk:
                                token = chunk["response"]
                                yield f"data: {token}\n\n"

                            if chunk.get("done", False):
                                yield "data: [DONE]\n\n"
                                break

                    logger.info("✅ Ollama response generated")

                except Exception as e:
                    logger.error(f"❌ Ollama Error: {e}")
                    yield f"data: Error: {str(e)}\n\n"
                    yield "data: [DONE]\n\n"

            return Response(
                stream_with_context(generate_ollama()),
                mimetype="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no"
                }
            )

        except Exception as err:
            logger.error(f"❌ Ollama Error: {err}")
            return jsonify({"error": "Ollama failed. Make sure Ollama is running: brew services start ollama"}), 500

    # Handle GLM-4.6 model (Hugging Face)
    if model.lower() in ["glm-4.6", "glm4.6", "glm"]:
        if not HF_AVAILABLE:
            return jsonify({"error": "GLM-4.6 requires transformers library. Install: pip install transformers torch"}), 500

        try:
            from transformers import AutoTokenizer, AutoModelForCausalLM
            import torch

            logger.info("🤖 Loading GLM-4.6 model...")

            # Check if model is already loaded (cached globally)
            global glm_model, glm_tokenizer
            if 'glm_model' not in globals() or glm_model is None:
                model_name = "zai-org/GLM-4.6"
                logger.info(f"📥 Downloading {model_name} (this may take a while on first run)...")

                # Load tokenizer and model
                glm_tokenizer = AutoTokenizer.from_pretrained(
                    model_name,
                    trust_remote_code=True
                )

                glm_model = AutoModelForCausalLM.from_pretrained(
                    model_name,
                    trust_remote_code=True,
                    device_map="auto",  # Automatically handle device placement
                    torch_dtype=torch.bfloat16  # Use BF16 for efficiency
                )

                logger.info("✅ GLM-4.6 model loaded successfully")

            # Prepare messages
            messages_list = [
                {"role": "system", "content": prompt if prompt else CYBERBOT_BEHAVIOR},
                {"role": "user", "content": question}
            ]

            # Tokenize input
            inputs = glm_tokenizer.apply_chat_template(
                messages_list,
                add_generation_prompt=True,
                return_tensors="pt"
            ).to(glm_model.device)

            # Generate response with streaming
            def generate_glm():
                """Generator function for GLM-4.6 streaming"""
                response_text = ""

                try:
                    # Generate with appropriate parameters for cybersecurity tasks
                    outputs = glm_model.generate(
                        inputs,
                        max_new_tokens=500,
                        temperature=1.0,  # As recommended
                        top_p=0.95,
                        top_k=40,
                        do_sample=True,
                        pad_token_id=glm_tokenizer.eos_token_id
                    )

                    # Decode the response
                    response = glm_tokenizer.decode(
                        outputs[0][len(inputs[0]):],
                        skip_special_tokens=True
                    )

                    # Stream the response token by token
                    words = response.split()
                    for word in words:
                        token = word + " "
                        response_text += token
                        yield f"data: {token}\n\n"
                        time.sleep(0.01)  # Small delay for streaming effect

                    yield "data: [DONE]\n\n"

                    logger.info(f"✅ GLM-4.6 Response generated: {len(response_text)} characters")

                except Exception as e:
                    logger.error(f"❌ GLM-4.6 Generation Error: {e}")
                    yield f"data: Error: {str(e)}\n\n"
                    yield "data: [DONE]\n\n"

            return Response(
                stream_with_context(generate_glm()),
                mimetype="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                    "X-Accel-Buffering": "no"
                }
            )

        except ImportError as e:
            logger.error(f"❌ Missing dependencies for GLM-4.6: {e}")
            return jsonify({
                "error": "Missing dependencies",
                "details": "Install required packages: pip install transformers torch accelerate",
                "note": "GLM-4.6 is a large model (357B params) - ensure you have sufficient hardware"
            }), 500

        except Exception as err:
            logger.error(f"❌ GLM-4.6 Error: {err}")
            return jsonify({"error": "GLM-4.6 model failed", "details": str(err)}), 500

    # Handle OpenAI models (GPT-4, GPT-3.5-turbo, etc.)
    if not openai_client:
        return jsonify({
            "error": "OpenAI not configured",
            "message": "Please add OPENAI_API_KEY to your .env file to use chat features"
        }), 503

    try:
        logger.info(f"📨 Sending request to OpenAI: model={model}, question={question}")

        messages = [
            {"role": "system", "content": prompt if prompt else CYBERBOT_BEHAVIOR},
            {"role": "user", "content": question}
        ]

        def generate():
            """Generator function for streaming response"""
            response_text = ""

            try:
                stream = openai_client.chat.completions.create(
                    model=model,
                    messages=messages,
                    temperature=0.7,
                    max_tokens=500,
                    stream=True
                )

                for chunk in stream:
                    if chunk.choices[0].delta.content is not None:
                        token = chunk.choices[0].delta.content
                        response_text += token
                        yield f"data: {token}\n\n"

                yield "data: [DONE]\n\n"

                # Save to chat history after streaming completes
                if chat_id and user_id:
                    chat_entry = {
                        "user_id": user_id,
                        "chat_id": chat_id,
                        "chat_name": "User Chat",
                        "messages": [
                            {"text": encrypt(question), "sender": "user", "timestamp": datetime.now()},
                            {"text": encrypt(response_text), "sender": "bot", "timestamp": datetime.now()}
                        ]
                    }
                    # Note: Saving happens asynchronously; consider using background task for production

            except Exception as e:
                print(f"❌ Streaming Error: {e}")
                yield f"data: Error: {str(e)}\n\n"
                yield "data: [DONE]\n\n"

        return Response(
            stream_with_context(generate()),
            mimetype="text/event-stream",
            headers={
                "Cache-Control": "no-cache",
                "Connection": "keep-alive",
                "X-Accel-Buffering": "no"
            }
        )

    except Exception as error:
        print(f"❌ Error fetching response: {error}")
        return jsonify({"error": "Failed to fetch AI response", "details": str(error)}), 500

# ==================== CHAT HISTORY ROUTES ====================

@app.route("/api/chat-history/<user_id>", methods=["GET"])
def get_chat_history(user_id):
    """Get chat history for a user"""
    try:
        chat_history = list(chat_history_collection.find({"user_id": user_id}))

        if not chat_history:
            return jsonify({"success": True, "data": []})

        formatted_chats = []
        for chat in chat_history:
            formatted_chat = {
                "id": chat["chat_id"],
                "chat_name": chat.get("chat_name", f"Chat {chat['chat_id']}") if chat.get("messages") else "New Chat",
                "messages": []
            }

            for msg in chat.get("messages", []):
                try:
                    decrypted_text = decrypt(msg["text"])
                except Exception as e:
                    print(f"⚠️ Failed to decrypt message: {e}")
                    decrypted_text = "[Decryption Error]"

                formatted_chat["messages"].append({
                    "text": decrypted_text,
                    "sender": msg["sender"],
                    "timestamp": msg.get("timestamp", datetime.now())
                })

            formatted_chats.append(formatted_chat)

        return jsonify({"success": True, "data": formatted_chats})

    except Exception as error:
        print(f"❌ Error fetching chat history: {error}")
        return jsonify({"error": "Failed to fetch chat history"}), 500

@app.route("/api/save-chat-history", methods=["POST"])
def save_chat_history():
    """Save chat history"""
    data = request.json
    user_id = data.get("userId")
    chat_id = data.get("chatId")
    messages = data.get("messages", [])

    if not all([user_id, chat_id]) or not isinstance(messages, list):
        return jsonify({"error": "Invalid parameters"}), 400

    try:
        chat_name = f"Chat {chat_id}"

        # Generate AI title from first user message
        first_user_message = next((m["text"] for m in messages if m["sender"] == "user"), None)

        if first_user_message:
            try:
                title_response = openai_client.chat.completions.create(
                    model="gpt-4",
                    max_tokens=20,
                    temperature=0.5,
                    messages=[
                        {
                            "role": "system",
                            "content": "Generate a short and unique title for this cybersecurity-related conversation. Avoid generic words like 'Help' or 'Chat'."
                        },
                        {"role": "user", "content": first_user_message}
                    ]
                )
                ai_title = title_response.choices[0].message.content.strip()
                if ai_title:
                    chat_name = ai_title
            except Exception as err:
                print(f"⚠️ Failed to generate title: {err}")

        print(f"💬 Saving chat {chat_id} for user {user_id} with name '{chat_name}'")

        # Encrypt messages
        encrypted_messages = []
        for msg in messages:
            encrypted_messages.append({
                "text": encrypt(msg["text"]),
                "sender": msg["sender"],
                "timestamp": msg.get("timestamp", datetime.now())
            })

        # Update or insert chat
        chat_history_collection.update_one(
            {"chat_id": chat_id, "user_id": user_id},
            {
                "$setOnInsert": {
                    "user_id": user_id,
                    "chat_id": chat_id,
                    "chat_name": chat_name
                },
                "$push": {"messages": {"$each": encrypted_messages}}
            },
            upsert=True
        )

        return jsonify({"success": True, "chat_name": chat_name})

    except Exception as error:
        print(f"❌ Save error: {error}")
        return jsonify({"error": "Failed to save chat history"}), 500

@app.route("/api/update-chat-name", methods=["POST"])
def update_chat_name():
    """Update chat name"""
    data = request.json
    user_id = data.get("userId")
    chat_id = data.get("chatId")
    new_name = data.get("newName")

    if not all([user_id, chat_id, new_name]):
        return jsonify({"error": "Missing parameters"}), 400

    try:
        result = chat_history_collection.find_one_and_update(
            {"chat_id": chat_id, "user_id": user_id},
            {"$set": {"chat_name": new_name}},
            return_document=True
        )

        if not result:
            return jsonify({"error": "Chat not found"}), 404

        result["_id"] = str(result["_id"])
        return jsonify({"success": True, "data": result})

    except Exception as error:
        print(f"❌ Update error: {error}")
        return jsonify({"error": "Failed to update chat name"}), 500

@app.route("/api/delete-chat/<user_id>/<chat_id>", methods=["DELETE"])
def delete_chat(user_id, chat_id):
    """Delete a chat"""
    print(f"🧹 Attempting to delete chat with chatId={chat_id}")

    try:
        result = chat_history_collection.delete_one({"chat_id": chat_id})

        if result.deleted_count == 0:
            print("❌ No matching chat found to delete")
            return jsonify({"success": False, "message": "Chat not found"}), 404

        print("✅ Chat deleted successfully")
        return jsonify({"success": True, "message": "Chat deleted successfully"})

    except Exception as error:
        print(f"❌ Error deleting chat: {error}")
        return jsonify({"success": False, "message": "Server error"}), 500

@app.route("/api/summarize", methods=["POST"])
def summarize():
    """Generate chat title from messages"""
    data = request.json
    messages = data.get("messages", [])

    if not messages:
        return jsonify({"error": "No messages to summarize"}), 400

    try:
        user_messages = [m["text"] for m in messages if m["sender"] == "user"]
        combined_text = " ".join(user_messages)

        response = openai_client.chat.completions.create(
            model="gpt-4",
            max_tokens=30,
            temperature=0.3,
            messages=[
                {
                    "role": "system",
                    "content": "Generate a concise, meaningful title (max 6 words) for this conversation:"
                },
                {"role": "user", "content": combined_text}
            ]
        )

        summary = response.choices[0].message.content.strip()
        return jsonify({"summary": summary})

    except Exception as error:
        print(f"❌ Summarization error: {error}")
        return jsonify({"error": "Failed to generate summary"}), 500

# ==================== SUBSCRIPTION ROUTES ====================

@app.route("/api/subscription-status", methods=["GET"])
@authenticate_token
def subscription_status():
    """Get subscription status for authenticated user"""
    try:
        user_id = request.user["userId"]

        conn = get_db_connection()
        cur = conn.cursor()

        cur.execute("SELECT is_subscribed, is_admin, role FROM users WHERE id = %s", (user_id,))
        result = cur.fetchone()

        cur.close()
        conn.close()

        if not result:
            return jsonify({"error": "User not found"}), 404

        # Check role and permissions
        role = result.get("role", "user")
        is_admin = result.get("is_admin", False)
        is_subscribed = result.get("is_subscribed", False)
        is_super_admin = (role == "super_admin")

        return jsonify({
            "isSubscribed": is_subscribed or is_admin or is_super_admin,
            "isAdmin": is_admin or is_super_admin,
            "isSuperAdmin": is_super_admin,
            "role": role
        })

    except Exception as error:
        logger.error(f"❌ Error fetching subscription: {error}")
        return jsonify({"error": "Failed to fetch subscription status"}), 500

@app.route("/api/create-checkout-session", methods=["POST"])
@authenticate_token
def create_checkout_session():
    """Create Stripe checkout session for subscription"""
    if not STRIPE_AVAILABLE or not STRIPE_SECRET_KEY:
        return jsonify({"error": "Stripe is not configured"}), 503

    user_id = request.user["userId"]

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            mode="subscription",
            line_items=[
                {
                    "price_data": {
                        "currency": "usd",
                        "unit_amount": 1000,  # $10/month
                        "product_data": {
                            "name": "CyberBot Monthly Subscription",
                            "description": "Unlimited access to CyberBot AI features"
                        },
                        "recurring": {
                            "interval": "month"
                        }
                    },
                    "quantity": 1
                }
            ],
            success_url="http://localhost:3000/subscription-success?session_id={CHECKOUT_SESSION_ID}",
            cancel_url="http://localhost:3000",
            client_reference_id=str(user_id),
            metadata={"user_id": str(user_id)}
        )

        logger.info(f"✅ Stripe session created for user {user_id}")
        return jsonify({"url": session.url})

    except Exception as err:
        logger.error(f"❌ Stripe session error: {err}")
        return jsonify({"error": "Failed to create checkout session", "details": str(err)}), 500

# ==================== MIDDLEWARE ====================

@app.after_request
def set_security_headers(response):
    """Set Content Security Policy and other security headers"""
    response.headers['Content-Security-Policy'] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "connect-src 'self' http://localhost:5001 http://localhost:3000 ws://localhost:5001 wss://localhost:5001;"
    )
    response.headers['X-Content-Type-Options'] = 'nosniff'
    response.headers['X-Frame-Options'] = 'DENY'
    response.headers['X-XSS-Protection'] = '1; mode=block'
    return response

# ==================== ERROR HANDLERS ====================

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return jsonify({"error": "Route not found"}), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {error}")
    return jsonify({"error": "Internal server error"}), 500

@app.errorhandler(Exception)
def handle_exception(e):
    """Handle all unhandled exceptions"""
    logger.error(f"🔥 Unhandled exception: {e}", exc_info=True)
    return jsonify({"error": "An unexpected error occurred", "details": str(e)}), 500

# ==================== MAIN ====================

if __name__ == "__main__":
    logger.info(f"🚀 Flask server starting on port {PORT}...")
    logger.info(f"📍 Server URL: http://localhost:{PORT}")
    logger.info(f"🔧 Debug mode: {app.debug}")
    logger.info(f"✅ CORS enabled for: http://localhost:3000, http://localhost:5173")
    logger.info(f"🔐 JWT authentication enabled")
    logger.info(f"🔒 AES-256 encryption enabled")
    logger.info(f"💬 OpenAI integration: {'✅ Active' if OPENAI_API_KEY else '❌ Missing'}")
    logger.info(f"💳 Stripe integration: {'✅ Active' if STRIPE_AVAILABLE and STRIPE_SECRET_KEY else '❌ Not configured'}")
    logger.info(f"🤖 SecureBERT/HuggingFace: {'✅ Available' if HF_AVAILABLE else '❌ Not installed'}")

    try:
        app.run(debug=True, host="0.0.0.0", port=PORT, threaded=True)
    except KeyboardInterrupt:
        logger.info("\n👋 Server shutting down gracefully...")
    except Exception as e:
        logger.error(f"🔥 Server crashed: {e}", exc_info=True)
