/* ===== GuruAI Assistant Component ===== */

function renderFreshAi() {
  const html = `
    <div id="ai-chat-widget" class="ai-chat-widget hidden">
      <div class="ai-chat-header">
        <div class="ai-chat-header-title">
          <span class="ai-icon">✨</span>
          <span>GuruAI Assistant</span>
        </div>
        <button id="ai-chat-close" style="background:none; border:none; color:var(--text-primary); cursor:pointer; font-size:1.5rem; transition: transform 0.2s;">✕</button>
      </div>
      <div class="ai-chat-body" id="ai-chat-messages">
        <div class="ai-msg bot">Hi! I'm GuruAI 🤖. I can help you find products, suggest recipes based on your cart, or answer questions. Try asking "Find milk" or "Recipe ideas".</div>
      </div>
      <div class="ai-chat-input">
        <input type="text" id="ai-chat-input-field" placeholder="Ask GuruAI..." autocomplete="off" />
        <button id="ai-voice-btn" style="background:none; border:none; color:var(--text-primary); font-size:1.2rem; cursor:pointer; width:36px; height:36px; display:flex; align-items:center; justify-content:center; transition:color 0.2s;">🎤</button>
        <button id="ai-chat-send">➤</button>
      </div>
    </div>
    <button id="ai-chat-toggle" class="ai-chat-toggle">✨</button>
  `;
  document.body.insertAdjacentHTML('beforeend', html);
  initFreshAiEvents();
}

function addAiMessage(text, isUser = false) {
  const container = document.getElementById('ai-chat-messages');
  const msgDiv = document.createElement('div');
  msgDiv.className = `ai-msg ${isUser ? 'user' : 'bot'}`;
  msgDiv.innerHTML = text;
  container.appendChild(msgDiv);
  container.scrollTop = container.scrollHeight;
}

function showTypingIndicator() {
  const container = document.getElementById('ai-chat-messages');
  const typing = document.createElement('div');
  typing.className = 'ai-msg bot typing';
  typing.id = 'ai-typing';
  typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function removeTypingIndicator() {
  const typing = document.getElementById('ai-typing');
  if (typing) typing.remove();
}

async function handleAiQuery(query) {
  const text = query.toLowerCase();
  
  // Recipe Intent
  if (text.includes('recipe') || text.includes('cook') || text.includes('make')) {
    const items = Cart.getItems();
    if (items.length === 0) {
      return "Your cart is empty! Add some ingredients like eggs, milk, and bread, and I'll suggest a recipe!";
    }
    
    const itemNames = items.map(i => i.name.toLowerCase());
    
    if (itemNames.some(i => i.includes('egg')) && itemNames.some(i => i.includes('bread'))) {
      return "🍳 **AI Recipe Match:** You have Eggs and Bread! You can make a delicious **French Toast** or **Egg Sandwich**. Would you like me to add Butter or Milk to complete the recipe?";
    } else if (itemNames.some(i => i.includes('spinach')) && itemNames.some(i => i.includes('cheese'))) {
      return "🥗 **AI Recipe Match:** You have Spinach and Cheese! You can make a healthy **Spinach Cheese Omelette** or **Stuffed Paratha**.";
    } else if (itemNames.some(i => i.includes('milk')) && itemNames.some(i => i.includes('banana'))) {
      return "🥤 **AI Recipe Match:** You have Milk and Bananas! You can make a refreshing **Banana Milkshake**.";
    } else {
      return `🍽️ **AI Recipe Match:** With your ${items[0].name}, you could make a lovely homemade salad or snack! Add more items for specific recipes.`;
    }
  }
  
  // Search Intent
  if (text.includes('find') || text.includes('search') || text.includes('have') || text.includes('where is')) {
    const searchWords = text.replace(/(find|search|do you have|have|where is|some|any|the)/gi, '').trim();
    if (!searchWords) return "What would you like me to find?";
    
    try {
      const products = await API.getProducts({ search: searchWords });
      if (products.length > 0) {
        const top = products[0];
        let html = `Yes! I found **${top.name}** for ₹${top.price}.<br><br>`;
        html += `<button class="ai-add-cart-btn" onclick="Cart.add('${top.id}'); Toast.show('Added ${top.name} to cart!');">Add to Cart 🛒</button>`;
        return html;
      } else {
        return `I'm sorry, I couldn't find any products matching "${searchWords}".`;
      }
    } catch (e) {
      return "Sorry, I'm having trouble connecting to the store database right now.";
    }
  }

  // Greeting
  if (text.includes('hi') || text.includes('hello')) {
    return "Hello there! How can I make your shopping easier today?";
  }
  
  // Fallback
  return "I'm a smart shopping assistant! I can help you search for items or suggest recipes based on your cart. Try saying 'Find apples' or 'Recipe ideas'.";
}

function initFreshAiEvents() {
  const widget = document.getElementById('ai-chat-widget');
  const toggle = document.getElementById('ai-chat-toggle');
  const close = document.getElementById('ai-chat-close');
  const input = document.getElementById('ai-chat-input-field');
  const send = document.getElementById('ai-chat-send');

  toggle.addEventListener('click', () => {
    widget.classList.remove('hidden');
    toggle.style.display = 'none';
    input.focus();
  });

  close.addEventListener('click', () => {
    widget.classList.add('hidden');
    toggle.style.display = 'flex';
  });

  const processInput = async () => {
    const val = input.value.trim();
    if (!val) return;
    
    input.value = '';
    addAiMessage(val, true);
    
    showTypingIndicator();
    
    // Simulate AI thinking delay
    setTimeout(async () => {
      const response = await handleAiQuery(val);
      removeTypingIndicator();
      addAiMessage(response, false);
    }, 800 + Math.random() * 1000);
  };


  // Voice Search Logic
  const voiceBtn = document.getElementById('ai-voice-btn');
  if (voiceBtn && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    
    voiceBtn.addEventListener('click', () => {
      voiceBtn.style.color = 'var(--red)';
      recognition.start();
      Toast.show('Listening... Speak now.');
    });
    
    recognition.onresult = (e) => {
      voiceBtn.style.color = 'var(--text-primary)';
      const transcript = e.results[0][0].transcript;
      input.value = transcript;
      processInput();
    };
    
    recognition.onerror = () => {
      voiceBtn.style.color = 'var(--text-primary)';
      Toast.show('Could not hear you properly.', 'error');
    };
  }

  send.addEventListener('click', processInput);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') processInput();
  });
}

// Initialize on load
window.addEventListener('DOMContentLoaded', () => {
  renderFreshAi();
});
