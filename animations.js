/* عالم الكيمياء الحيوية - الرسوم المتحركة */

// إنشاء الفقاعات المتحركة
function createBubbles() {
  const bubblesContainer = document.querySelector('.bubbles-container');
  const bubbleCount = 30;
  
  for (let i = 0; i < bubbleCount; i++) {
    const bubble = document.createElement('div');
    bubble.classList.add('bubble');
    
    // تعيين خصائص عشوائية للفقاعة
    const size = Math.random() * 100 + 20; // حجم بين 20 و 120 بكسل
    const positionX = Math.random() * 100; // موقع أفقي بين 0 و 100%
    const delay = Math.random() * 15; // تأخير بين 0 و 15 ثانية
    const duration = Math.random() * 10 + 10; // مدة بين 10 و 20 ثانية
    
    // تعيين لون عشوائي من ألوان الفقاعات المحددة
    const colors = [
      'var(--bubble-color-1)',
      'var(--bubble-color-2)',
      'var(--bubble-color-3)'
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // تطبيق الأنماط على الفقاعة
    bubble.style.width = `${size}px`;
    bubble.style.height = `${size}px`;
    bubble.style.left = `${positionX}%`;
    bubble.style.backgroundColor = color;
    bubble.style.animationDelay = `${delay}s`;
    bubble.style.animationDuration = `${duration}s`;
    
    // إضافة الفقاعة إلى الحاوية
    bubblesContainer.appendChild(bubble);
  }
}

// إنشاء الجزيئات المتحركة
function createMolecules() {
  const moleculesContainer = document.querySelector('.molecules-container');
  const moleculeImages = [
    'molecule-1.svg',
    'molecule-2.svg',
    'molecule-3.svg',
    'dna-segment.svg',
    'protein.svg'
  ];
  const moleculeCount = 8;
  
  for (let i = 0; i < moleculeCount; i++) {
    const molecule = document.createElement('img');
    molecule.classList.add('molecule');
    
    // اختيار صورة عشوائية للجزيء
    const imageIndex = Math.floor(Math.random() * moleculeImages.length);
    molecule.src = `images/${moleculeImages[imageIndex]}`;
    
    // تعيين خصائص عشوائية للجزيء
    const size = Math.random() * 100 + 50; // حجم بين 50 و 150 بكسل
    const positionX = Math.random() * 80 + 10; // موقع أفقي بين 10% و 90%
    const positionY = Math.random() * 80 + 10; // موقع رأسي بين 10% و 90%
    const delay = Math.random() * 5; // تأخير بين 0 و 5 ثوان
    const duration = Math.random() * 10 + 15; // مدة بين 15 و 25 ثانية
    
    // تطبيق الأنماط على الجزيء
    molecule.style.width = `${size}px`;
    molecule.style.height = 'auto';
    molecule.style.left = `${positionX}%`;
    molecule.style.top = `${positionY}%`;
    molecule.style.animationDelay = `${delay}s`;
    molecule.style.animationDuration = `${duration}s`;
    
    // إضافة الجزيء إلى الحاوية
    moleculesContainer.appendChild(molecule);
  }
}

// تحريك العناصر عند التمرير
function animateOnScroll() {
  const elements = document.querySelectorAll('.animate-on-scroll');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
      }
    });
  }, { threshold: 0.1 });
  
  elements.forEach(element => {
    observer.observe(element);
  });
}

// تبديل قائمة التنقل للأجهزة المحمولة
function toggleMobileMenu() {
  const navMenu = document.querySelector('nav ul');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  
  menuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuBtn.classList.toggle('active');
  });
}

// تفعيل مساعد الذكاء الاصطناعي
function initAIAssistant() {
  const aiButton = document.querySelector('.ai-button');
  const aiChat = document.querySelector('.ai-chat');
  const aiChatClose = document.querySelector('.ai-chat-close');
  const aiChatInput = document.querySelector('.ai-chat-input input');
  const aiChatSend = document.querySelector('.ai-chat-input button');
  const aiChatMessages = document.querySelector('.ai-chat-messages');
  
  // فتح نافذة الدردشة
  aiButton.addEventListener('click', () => {
    aiChat.classList.add('active');
  });
  
  // إغلاق نافذة الدردشة
  aiChatClose.addEventListener('click', () => {
    aiChat.classList.remove('active');
  });
  
  // إرسال رسالة
  function sendMessage() {
    const message = aiChatInput.value.trim();
    if (message) {
      // إضافة رسالة المستخدم
      addMessage(message, 'user');
      
      // محاكاة رد المساعد (سيتم استبداله بالذكاء الاصطناعي الحقيقي)
      setTimeout(() => {
        const responses = [
          "مرحباً! أنا مساعد الكيمياء الحيوية. كيف يمكنني مساعدتك اليوم؟",
          "هذا سؤال مثير للاهتمام عن الكيمياء الحيوية. دعني أشرح لك...",
          "البروتينات هي جزيئات كبيرة مكونة من سلاسل الأحماض الأمينية وتؤدي وظائف متعددة في الجسم.",
          "الحمض النووي (DNA) هو جزيء يحمل المعلومات الوراثية اللازمة لتطور ووظيفة الكائنات الحية.",
          "يمكنك إجراء هذه التجربة في المختبر الافتراضي الخاص بنا. هل تحتاج إلى مساعدة؟"
        ];
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        addMessage(randomResponse, 'bot');
      }, 1000);
      
      // مسح حقل الإدخال
      aiChatInput.value = '';
    }
  }
  
  // إضافة رسالة إلى نافذة الدردشة
  function addMessage(text, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('ai-message', sender);
    messageElement.textContent = text;
    aiChatMessages.appendChild(messageElement);
    
    // التمرير إلى أسفل
    aiChatMessages.scrollTop = aiChatMessages.scrollHeight;
  }
  
  // إرسال الرسالة عند النقر على زر الإرسال
  aiChatSend.addEventListener('click', sendMessage);
  
  // إرسال الرسالة عند الضغط على Enter
  aiChatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  });
  
  // إضافة رسالة ترحيبية
  setTimeout(() => {
    addMessage("مرحباً! أنا مساعد الكيمياء الحيوية. كيف يمكنني مساعدتك اليوم؟", 'bot');
  }, 500);
}

// تهيئة المختبر الافتراضي
function initVirtualLab() {
  // سيتم تنفيذ هذا لاحقاً مع إضافة المختبر الافتراضي ثلاثي الأبعاد
  console.log('تهيئة المختبر الافتراضي');
}

// تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
  // إنشاء التأثيرات المرئية
  createBubbles();
  createMolecules();
  
  // تفعيل التحريك عند التمرير
  animateOnScroll();
  
  // تفعيل قائمة الأجهزة المحمولة
  toggleMobileMenu();
  
  // تفعيل مساعد الذكاء الاصطناعي
  initAIAssistant();
  
  // تهيئة المختبر الافتراضي
  initVirtualLab();
});
