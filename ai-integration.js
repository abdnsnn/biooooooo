// تكامل مساعد الذكاء الاصطناعي مع واجهة المستخدم
import BiochemistryAI from './biochemistry-ai.js';

document.addEventListener('DOMContentLoaded', function() {
  // إنشاء نسخة من مساعد الذكاء الاصطناعي
  const aiAssistant = new BiochemistryAI();
  
  // الحصول على عناصر واجهة المستخدم
  const aiChatbox = document.getElementById('ai-chatbox');
  const aiInput = document.getElementById('ai-input');
  const aiSendButton = document.getElementById('ai-send-button');
  const aiToggleButton = document.getElementById('ai-toggle-button');
  const aiContainer = document.getElementById('ai-assistant-container');
  
  // إضافة رسالة ترحيبية
  addMessage('ai', 'مرحباً! أنا مساعد الكيمياء الحيوية. كيف يمكنني مساعدتك اليوم؟');
  
  // معالجة إرسال الرسائل
  function handleSendMessage() {
    const userMessage = aiInput.value.trim();
    if (userMessage === '') return;
    
    // إضافة رسالة المستخدم إلى الشات
    addMessage('user', userMessage);
    
    // الحصول على رد من مساعد الذكاء الاصطناعي
    const aiResponse = aiAssistant.answerQuestion(userMessage);
    
    // إضافة رد المساعد إلى الشات
    setTimeout(() => {
      addMessage('ai', aiResponse);
    }, 500);
    
    // مسح حقل الإدخال
    aiInput.value = '';
  }
  
  // إضافة رسالة إلى الشات
  function addMessage(sender, text) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', `${sender}-message`);
    
    const avatarElement = document.createElement('div');
    avatarElement.classList.add('avatar');
    
    if (sender === 'ai') {
      avatarElement.innerHTML = '<img src="/images/ai-avatar.svg" alt="AI">';
    } else {
      avatarElement.innerHTML = '<div class="user-avatar">أنت</div>';
    }
    
    const textElement = document.createElement('div');
    textElement.classList.add('message-text');
    textElement.textContent = text;
    
    messageElement.appendChild(avatarElement);
    messageElement.appendChild(textElement);
    
    aiChatbox.appendChild(messageElement);
    
    // التمرير إلى أسفل
    aiChatbox.scrollTop = aiChatbox.scrollHeight;
  }
  
  // إضافة مستمعي الأحداث
  aiSendButton.addEventListener('click', handleSendMessage);
  
  aiInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  
  // تبديل عرض/إخفاء مساعد الذكاء الاصطناعي
  aiToggleButton.addEventListener('click', function() {
    aiContainer.classList.toggle('expanded');
    
    if (aiContainer.classList.contains('expanded')) {
      aiToggleButton.textContent = 'إغلاق المساعد';
    } else {
      aiToggleButton.textContent = 'فتح المساعد';
    }
  });
  
  // دمج المساعد مع صفحات التجارب
  const experimentPages = document.querySelectorAll('.experiment-page');
  if (experimentPages.length > 0) {
    experimentPages.forEach(page => {
      const experimentId = page.dataset.experimentId;
      const helpButton = page.querySelector('.experiment-help-button');
      
      if (helpButton && experimentId) {
        helpButton.addEventListener('click', function() {
          // فتح المساعد
          aiContainer.classList.add('expanded');
          aiToggleButton.textContent = 'إغلاق المساعد';
          
          // إضافة رسالة تلقائية للمساعد
          const helpMessage = `مرحباً! أنا هنا للمساعدة في تجربة "${aiAssistant.experiments[experimentId].title}". كيف يمكنني مساعدتك؟`;
          addMessage('ai', helpMessage);
        });
      }
    });
  }
  
  // دمج المساعد مع الاختبارات القبلية والبعدية
  const quizButtons = document.querySelectorAll('.quiz-help-button');
  if (quizButtons.length > 0) {
    quizButtons.forEach(button => {
      button.addEventListener('click', function() {
        // فتح المساعد
        aiContainer.classList.add('expanded');
        aiToggleButton.textContent = 'إغلاق المساعد';
        
        // إضافة رسالة تلقائية للمساعد
        const helpMessage = 'يمكنني مساعدتك في فهم المفاهيم المتعلقة بهذا الاختبار. ما هو السؤال الذي تحتاج مساعدة فيه؟';
        addMessage('ai', helpMessage);
      });
    });
  }
});
