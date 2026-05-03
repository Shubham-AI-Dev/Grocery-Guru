import re

# 1. Update index.html
html_file = "public/index.html"
with open(html_file, "r", encoding="utf-8") as f:
    html_content = f.read()

if "contact.js" not in html_content:
    html_content = html_content.replace('<script src="/js/pages/checkout.js"></script>', '<script src="/js/pages/checkout.js"></script>\n  <script src="/js/pages/contact.js"></script>')
    with open(html_file, "w", encoding="utf-8") as f:
        f.write(html_content)

# 2. Update app.js routing
app_file = "public/js/app.js"
with open(app_file, "r", encoding="utf-8") as f:
    app_content = f.read()

route_target = "} else if (path === '/' || path === '') {"
route_replacement = "} else if (path === '/contact') {\n      await renderContactPage();\n    } else if (path === '/' || path === '') {"
if "renderContactPage" not in app_content:
    app_content = app_content.replace(route_target, route_replacement)
    with open(app_file, "w", encoding="utf-8") as f:
        f.write(app_content)

print("Contact route added.")
