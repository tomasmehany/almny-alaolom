'use client';
import { useState, useRef, useEffect } from 'react';

export default function BotPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingMessage, setStreamingMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setMessages([
      {
        id: 1,
        role: 'bot',
        content: '🧑‍🏫 **مرحبا! أنا Almny Alolom AI**\n\n📚 متخصص في:\n• علوم (إعدادي)\n• علوم متكاملة (أولى ثانوي)\n• فيزياء (تانية ثانوي)\n• كيمياء (تانية ثانوي)\n\n📝 اكتب سؤالك وأنا هجاوبك ✅'
      }
    ]);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingMessage]);

  const streamText = (fullText, messageId) => {
    let index = 0;
    setStreamingMessage('');
    
    const interval = setInterval(() => {
      if (index < fullText.length) {
        setStreamingMessage(prev => prev + fullText[index]);
        index++;
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      } else {
        clearInterval(interval);
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== 'streaming');
          return [...filtered, {
            id: messageId,
            role: 'bot',
            content: fullText
          }];
        });
        setStreamingMessage('');
      }
    }, 3);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: input
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });

      const data = await res.json();
      const replyText = data.reply || "عذراً، لم أستطع الإجابة";
      
      const messageId = Date.now() + 1;
      streamText(replyText, messageId);

    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now(),
        role: 'bot',
        content: "عذراً، حدث خطأ مؤقت"
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.botInfo}>
          <div style={styles.avatar}>🧑‍🏫</div>
          <div>
            <h2 style={styles.botName}>Almny Alolom AI</h2>
            <p style={styles.botStatus}>متخصص في العلوم</p>
          </div>
        </div>
        <div style={styles.badges}>
          <span style={styles.badge}>🔬 علوم (إعدادي)</span>
          <span style={styles.badge}>🧬 علوم متكاملة (أولى ثانوي)</span>
          <span style={styles.badge}>⚡ فيزياء (تانية ثانوي)</span>
          <span style={styles.badge}>🧪 كيمياء (تانية ثانوي)</span>
        </div>
      </div>

      <div style={styles.chatArea}>
        {messages.map(msg => (
          <div
            key={msg.id}
            style={{
              ...styles.messageRow,
              ...(msg.role === 'user' ? styles.userRow : styles.botRow)
            }}
          >
            {msg.role === 'bot' && <div style={styles.botAvatar}>🧑‍🏫</div>}
            <div style={{
              ...styles.messageBubble,
              ...(msg.role === 'user' ? styles.userBubble : styles.botBubble)
            }}>
              <p style={styles.messageText} dangerouslySetInnerHTML={{ __html: msg.content }} />
            </div>
            {msg.role === 'user' && <div style={styles.userAvatar}>👤</div>}
          </div>
        ))}

        {streamingMessage && (
          <div style={styles.messageRow}>
            <div style={styles.botAvatar}>🧑‍🏫</div>
            <div style={{...styles.messageBubble, ...styles.botBubble}}>
              <p style={styles.messageText} dangerouslySetInnerHTML={{ __html: streamingMessage }} />
            </div>
          </div>
        )}

        {loading && !streamingMessage && (
          <div style={styles.typing}>
            <div style={styles.typingBubble}>Almny Alolom AI يكتب...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="اكتب سؤالك..."
          style={styles.input}
          disabled={loading}
        />
        <button
          onClick={handleSend}
          disabled={!input.trim() || loading}
          style={{
            ...styles.button,
            ...((!input.trim() || loading) ? styles.buttonDisabled : styles.buttonActive)
          }}
        >
          {loading ? '⏳' : 'إرسال'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '20px auto',
    background: 'white',
    borderRadius: '20px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    overflow: 'hidden',
    direction: 'rtl',
    height: 'calc(100vh - 40px)',
    display: 'flex',
    flexDirection: 'column'
  },
  header: {
    background: '#1e3c72',
    color: 'white',
    padding: '20px'
  },
  botInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginBottom: '10px'
  },
  avatar: {
    width: '50px',
    height: '50px',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '24px'
  },
  botName: {
    margin: 0,
    fontSize: '20px'
  },
  botStatus: {
    margin: '5px 0 0',
    fontSize: '12px',
    opacity: 0.9
  },
  badges: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  badge: {
    background: 'rgba(255,255,255,0.15)',
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px'
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '20px',
    background: '#f5f7fb'
  },
  messageRow: {
    display: 'flex',
    alignItems: 'flex-end',
    gap: '10px',
    marginBottom: '15px'
  },
  userRow: {
    justifyContent: 'flex-end'
  },
  botRow: {
    justifyContent: 'flex-start'
  },
  botAvatar: {
    width: '35px',
    height: '35px',
    background: '#1e3c72',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px'
  },
  userAvatar: {
    width: '35px',
    height: '35px',
    background: '#6c757d',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '18px'
  },
  messageBubble: {
    maxWidth: '70%',
    padding: '12px 16px',
    borderRadius: '18px'
  },
  botBubble: {
    background: 'white',
    border: '1px solid #e9ecef',
    borderBottomRightRadius: '18px',
    borderBottomLeftRadius: '4px'
  },
  userBubble: {
    background: '#1e3c72',
    color: 'white',
    borderBottomLeftRadius: '18px',
    borderBottomRightRadius: '4px'
  },
  messageText: {
    margin: 0,
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-line'
  },
  typing: {
    display: 'flex',
    justifyContent: 'flex-start',
    marginTop: '10px'
  },
  typingBubble: {
    background: 'white',
    padding: '10px 15px',
    borderRadius: '18px',
    border: '1px solid #e9ecef',
    fontSize: '13px',
    color: '#6c757d'
  },
  inputArea: {
    padding: '20px',
    background: 'white',
    borderTop: '1px solid #e9ecef',
    display: 'flex',
    gap: '10px'
  },
  input: {
    flex: 1,
    padding: '12px 16px',
    border: '2px solid #e9ecef',
    borderRadius: '25px',
    fontSize: '14px',
    outline: 'none'
  },
  button: {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '25px',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  buttonActive: {
    background: '#1e3c72',
    color: 'white'
  },
  buttonDisabled: {
    background: '#e9ecef',
    color: '#adb5bd',
    cursor: 'not-allowed'
  }
};