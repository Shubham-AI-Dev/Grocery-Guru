import os
import re

routes_dir = "server/routes"

for filename in os.listdir(routes_dir):
    if filename.endswith(".js"):
        path = os.path.join(routes_dir, filename)
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Change require
        content = content.replace("require('../models/store')", "require('../db')")
        
        # Change (req, res) to async (req, res)
        # Avoid double async if it's already async
        content = re.sub(r'router\.(get|post|put|patch|delete)\((.*?),\s*(?!async\s)\(*req,\s*res\)*\s*=>\s*{', r'router.\1(\2, async (req, res) => {', content)
        
        # Change store. method calls to await store.
        content = re.sub(r'(?<!await )store\.([a-zA-Z0-9_]+)\(', r'await store.\1(', content)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)

# Update index.js
with open("server/index.js", "r", encoding="utf-8") as f:
    content = f.read()
content = content.replace("require('./models/store')", "require('./db')")
content = re.sub(r'app\.(get|post|put|patch|delete)\((.*?),\s*(?!async\s)\(*req,\s*res\)*\s*=>\s*{', r'app.\1(\2, async (req, res) => {', content)
content = re.sub(r'(?<!await )store\.([a-zA-Z0-9_]+)\(', r'await store.\1(', content)
with open("server/index.js", "w", encoding="utf-8") as f:
    f.write(content)

# Update store.js to be async
with open("server/models/store.js", "r", encoding="utf-8") as f:
    content = f.read()

methods = [
    "authenticateUser", "getUserById", "getAllProducts", "getProductById",
    "getCategories", "validateCart", "createOrder", "getOrder", "getAllOrders",
    "updateProduct", "addProduct", "deleteProduct", "toggleProductStock",
    "getUserByEmail", "getUserByPhone", "createUser"
]

for method in methods:
    # Only replace if not already async
    content = re.sub(r'(?<!async )(\s+)' + method + r'\(', r'\1async ' + method + r'(', content)

with open("server/models/store.js", "w", encoding="utf-8") as f:
    f.write(content)

print("Refactored to async/await")
