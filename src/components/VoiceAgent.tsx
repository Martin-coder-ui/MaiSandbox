import React, { useState, useRef, useEffect } from 'react';
import { useConversation } from '@elevenlabs/react';
import { Mic, MicOff, Volume2, VolumeX, Send, MessageSquare } from 'lucide-react';
import { usePublicHealthData } from '../hooks/usePublicHealthData';
import { useDetailedWeather } from '../hooks/useDetailedWeather';
import { useGeolocation } from '../hooks/useGeolocation';
import { useSeasonalRecommendations } from '../hooks/useSeasonalRecommendations';
import { useAuth } from '../contexts/AuthContext';

interface ConversationMessage {
  id: string;
  type: 'user' | 'ai';
  text: string;
  timestamp: Date;
  isVoice?: boolean;
}

const VoiceAgent: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [textInput, setTextInput] = useState('');
  const [isTextMode, setIsTextMode] = useState(false);
  const [currentAIMessage, setCurrentAIMessage] = useState('');
  const [isAIResponding, setIsAIResponding] = useState(false);
  const historyEndRef = useRef<HTMLDivElement>(null);
  
  // Health and weather data hooks
  const { user } = useAuth();
  const { healthData } = usePublicHealthData();
  const { weatherData } = useDetailedWeather();
  const { location } = useGeolocation();
  const { getYearlyHealthPriorities } = useSeasonalRecommendations();
  
  const conversation = useConversation({
    onConnect: () => {
      console.log('Connected to ElevenLabs');
      addMessage('ai', 'Hello! I\'m your Mai assistant. I can help you with health, weather, and personalized recommendations. How can I assist you today?', false);
    },
    onDisconnect: () => {
      console.log('Disconnected from ElevenLabs');
    },
    onMessage: (message) => {
      console.log('Message received:', message);
      
      if (message.type === 'agent_response' || message.message) {
        const messageText = message.message || message.text || '';
        
        if (message.isFinal === false) {
          setCurrentAIMessage(prev => prev + messageText);
          setIsAIResponding(true);
        } else {
          const completeMessage = currentAIMessage + messageText;
          if (completeMessage.trim()) {
            addMessage('ai', completeMessage, true);
          }
          setCurrentAIMessage('');
          setIsAIResponding(false);
        }
      }
    },
    onError: (error) => {
      console.error('ElevenLabs error:', error);
      addMessage('ai', 'Sorry, I encountered an error. Please try again.', false);
      setIsAIResponding(false);
      setCurrentAIMessage('');
    },
  });

  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationHistory, currentAIMessage]);

  const addMessage = (type: 'user' | 'ai', text: string, isVoice: boolean = false) => {
    const newMessage: ConversationMessage = {
      id: Date.now().toString(),
      type,
      text,
      timestamp: new Date(),
      isVoice
    };
    setConversationHistory(prev => [...prev, newMessage]);
  };

  const handleToggleConversation = async () => {
    if (conversation.status === 'connected') {
      await conversation.endSession();
      setIsEnabled(false);
      setIsAIResponding(false);
      setCurrentAIMessage('');
    } else {
      try {
        await conversation.startSession({
          agentId: 'sk_faac76c8ae69f2962acbc7431124cea3344deaabd7f39f07',
        });
        setIsEnabled(true);
      } catch (error) {
        console.error('Failed to start conversation:', error);
        
        if (error instanceof DOMException && error.name === 'NotAllowedError') {
          addMessage('ai', 'Microphone access denied. Please enable microphone permissions in your browser settings and try again.', false);
        } else if (error instanceof Error && error.message.toLowerCase().includes('permission denied')) {
          addMessage('ai', 'Microphone access denied. Please enable microphone permissions in your browser settings and try again.', false);
        } else if (error instanceof Error && error.message.toLowerCase().includes('agent')) {
          addMessage('ai', 'Failed to start voice conversation. Please check your agent ID and try again.', false);
        } else {
          addMessage('ai', 'Failed to start voice conversation. Please check your microphone permissions and agent configuration.', false);
        }
      }
    }
  };

  const generateContextualResponse = (userInput: string) => {
    const currentPath = window.location.pathname;
    const input = userInput.toLowerCase();
    
    // Health check queries - simplified approach
    if (input.includes('health check') || input.includes('screening') || input.includes('preventive care') || input.includes('checkup') || input.includes('medical test')) {
      if (user?.profileData?.age) {
        const yearlyPriorities = getYearlyHealthPriorities(user.profileData.age, user.profileData.gender);
        
        // Focus on top 3 priorities for the year
        const thisYearChecks = yearlyPriorities.slice(0, 3);
        
        let response = `**Your ${new Date().getFullYear()} Health Check Priorities (Age ${user.profileData.age}):**\n\n`;
        
        response += `**This Year's Essential Checks:**\n`;
        thisYearChecks.forEach((check, index) => {
          response += `${index + 1}. **${check.name}**: ${check.description}\n   📅 ${check.frequency} | 🎯 ${check.action}\n\n`;
        });
        
        response += `**💡 UK Healthcare Reality:**\n`;
        response += `At age 63, the NHS only offers bowel cancer screening. Most other vital checks require you to be proactive.\n\n`;
        
        response += `**🏠 Home Testing Options:**\n`;
        response += `• Blood pressure monitor for daily tracking\n`;
        response += `• Home cholesterol test kit\n`;
        response += `• Vitamin D test (80% of UK adults are deficient)\n`;
        response += `• Diabetes screening kit\n\n`;
        
        response += `**Next Steps:** Check your "Seasonal Notifications" for specific product recommendations and easy ordering.`;
        
        return response;
      } else {
        return `Health screenings save lives through early detection. The recommendations vary by age and gender. Could you tell me your age so I can provide your personalized yearly health check plan? You can also check your "Seasonal Notifications" for detailed guidance.`;
      }
    }
    
    // Health condition queries
    if (input.includes('health condition') || input.includes('what\'s going around') || input.includes('illness') || input.includes('disease')) {
      if (healthData && location) {
        const highRiskConditions = healthData.conditions.filter(c => c.status === 'high' || c.status === 'very-high');
        const increasingConditions = healthData.conditions.filter(c => c.trend === 'increasing');
        
        let response = `**Current Health Conditions in ${location.city}:**\n\n`;
        
        if (highRiskConditions.length > 0) {
          response += `**🚨 High Risk Conditions:**\n`;
          highRiskConditions.forEach(condition => {
            response += `• **${condition.condition}**: ${condition.cases} cases - ${condition.description}\n`;
          });
          response += '\n';
        }
        
        if (increasingConditions.length > 0) {
          response += `**📈 Increasing Conditions:**\n`;
          increasingConditions.forEach(condition => {
            response += `• **${condition.condition}**: ${condition.cases} cases, trending ${condition.trend}\n`;
          });
          response += '\n';
        }
        
        response += `**🛡️ Protection Steps:**\n`;
        response += `• Wash hands frequently with soap\n`;
        response += `• Stay home if feeling unwell\n`;
        response += `• Keep up with vaccinations\n`;
        response += `• Seek medical attention for symptoms\n\n`;
        response += `**📊 Data updated:** ${healthData.lastUpdated.toLocaleDateString()}`;
        
        return response;
      } else {
        return 'I need your location to provide current health condition information for your area. Please enable location services.';
      }
    }

    // Social wellbeing queries
    if (input.includes('lonely') || input.includes('isolated') || input.includes('social') || input.includes('friends') || input.includes('community')) {
      if (healthData && healthData.socialWellbeingRecommendations.length > 0) {
        let response = `**Building Social Connections:**\n\n`;
        
        response += `Social isolation increases death risk by 50% - equivalent to smoking 15 cigarettes daily. Here are personalized recommendations:\n\n`;
        
        healthData.socialWellbeingRecommendations.slice(0, 4).forEach((recommendation, index) => {
          response += `${index + 1}. ${recommendation}\n`;
        });
        
        response += `\n**💡 Research shows:** People with strong social ties live longer, have better immune function, and recover faster from illness.\n\n`;
        response += `Would you like me to help you find specific local groups or activities in ${location?.city || 'your area'}?`;
        
        return response;
      } else {
        return `Social connections are incredibly important for wellbeing. Research shows they're as important as exercise for health. I can help you find local community groups, clubs, or activities that match your interests. What kind of activities do you enjoy or would like to try?`;
      }
    }
    
    // Weather and clothing queries
    if (input.includes('weather') || input.includes('temperature') || input.includes('what should i wear') || input.includes('clothing')) {
      if (weatherData && location) {
        const today = weatherData.current;
        const tomorrow = weatherData.forecast[1];
        
        let response = `**Weather in ${location.city}:**\n\n`;
        response += `**Today:** ${Math.round(today.temperature.feelsLike)}°C (feels like), ${today.conditions}\n`;
        response += `**Tomorrow:** ${Math.round(tomorrow.temperature.min)}°C to ${Math.round(tomorrow.temperature.max)}°C, ${tomorrow.conditions}\n\n`;
        
        response += `**👔 What to Wear Tomorrow:**\n${tomorrow.clothingRecommendation}\n\n`;
        
        if (tomorrow.healthWarnings.length > 0) {
          response += `**⚠️ Health Warnings:**\n`;
          tomorrow.healthWarnings.forEach(warning => {
            response += `• ${warning}\n`;
          });
          response += '\n';
        }
        
        if (weatherData.alerts.length > 0) {
          response += `**🚨 Weather Alerts:**\n`;
          weatherData.alerts.forEach(alert => {
            response += `• ${alert}\n`;
          });
        }
        
        return response;
      } else {
        return 'I need your location to provide weather information and clothing recommendations. Please enable location services.';
      }
    }
    
    // Fly bite specific response (from your scenario)
    if (input.includes('bitten') || input.includes('fly') || input.includes('bite') || input.includes('insect')) {
      return `**Treating Your Fly Bite:**

**Immediate Care:**
• Clean gently with soap and water
• Apply cold compress for 10-15 minutes
• Avoid scratching to prevent infection

**Treatment Options:**
• Calamine lotion or hydrocortisone cream for itching
• Antihistamine (Benadryl) for allergic reactions
• Aloe vera gel for natural soothing

**⚠️ See a Doctor If:**
• Signs of infection (increased redness, warmth, pus)
• Severe allergic reactions (difficulty breathing, widespread rash)
• No improvement within a few days

**🛡️ Prevention:**
• Use insect repellent outdoors
• Wear long sleeves in fly-heavy areas
• Keep windows closed or use screens

Would you like me to help you find a nearby pharmacy for treatment supplies?`;
    }
    
    // Health-related responses
    if (currentPath.includes('maihealth') || input.includes('health') || input.includes('exercise') || input.includes('nutrition')) {
      let response = `I can help you with wellness guidance, exercise recommendations, nutrition advice, and connecting you with healthcare professionals.`;
      
      if (healthData && location) {
        response += ` I also monitor current health conditions in ${location.city}.`;
      }
      
      if (user?.socialEngagement === 'isolated') {
        response += ` I notice you might benefit from more social connections - they're crucial for health. Would you like suggestions for group activities?`;
      }
      
      response += ` What specific health topic interests you today?`;
      
      return response;
    }
    
    // Finance-related responses
    if (currentPath.includes('maihome') || input.includes('money') || input.includes('budget') || input.includes('savings')) {
      return `I can help you with financial planning, budgeting, savings strategies, and investment advice. Based on your profile, I can provide personalized recommendations to help you achieve your financial goals. What financial area would you like to explore?`;
    }
    
    // Style-related responses
    if (currentPath.includes('maistyle') || input.includes('style') || input.includes('fashion') || input.includes('outfit')) {
      return `I'd love to help with your style! I can provide personalized fashion recommendations, help plan outfits, suggest seasonal trends, and connect you with styling professionals. I also provide weather-appropriate clothing suggestions. What style guidance are you looking for?`;
    }
    
    // General responses
    const generalResponses = [
      `I'm here to help with health, finance, and style guidance. I can also provide real-time health conditions and weather information for your area. Based on your profile, I can offer personalized recommendations. How can I assist you today?`,
      `As your Mai assistant, I help across MaiHealth (wellness), MaiHome (finance), and MaiStyle (fashion). I also monitor local health conditions and weather. Which area interests you most right now?`,
      `I provide comprehensive support across health, finance, and style, plus real-time local information. Let me help you find the best solution. What would you like to achieve?`
    ];
    
    return generalResponses[Math.floor(Math.random() * generalResponses.length)];
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    addMessage('user', textInput, false);
    setIsAIResponding(true);
    
    setTimeout(() => {
      const response = generateContextualResponse(textInput);
      addMessage('ai', response, false);
      setIsAIResponding(false);
    }, 1000);

    setTextInput('');
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = () => {
    switch (conversation.status) {
      case 'connected':
        return 'bg-green-500';
      case 'connecting':
        return 'bg-yellow-500';
      case 'disconnected':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusText = () => {
    switch (conversation.status) {
      case 'connected':
        return 'Voice AI Active';
      case 'connecting':
        return 'Connecting...';
      case 'disconnected':
        return 'Voice AI Offline';
      default:
        return 'Ready to Connect';
    }
  };

  const getContextualPrompts = () => {
    const currentPath = window.location.pathname;
    
    if (currentPath.includes('maihealth')) {
      return [
        '• "What health checks should I have this year?"',
        '• "What health conditions are going around?"',
        '• "What should I wear tomorrow?"',
        '• "Help me with social connections"'
      ];
    } else if (currentPath.includes('maihome')) {
      return [
        '• "What\'s my current budget status?"',
        '• "Help me save money this month"',
        '• "Review my insurance coverage"',
        '• "Show me investment opportunities"'
      ];
    } else if (currentPath.includes('maistyle')) {
      return [
        '• "What should I wear today?"',
        '• "What\'s the weather like?"',
        '• "Help me with makeup ideas"',
        '• "Find trending fashion styles"'
      ];
    } else {
      return [
        '• "What health checks do I need this year?"',
        '• "What health conditions are in my area?"',
        '• "What\'s the weather forecast?"',
        '• "Help me with social connections"'
      ];
    }
  };

  const clearHistory = () => {
    setConversationHistory([]);
    setCurrentAIMessage('');
    setIsAIResponding(false);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 flex flex-col h-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          Smart Assistant
        </h3>
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`}></div>
          <button
            onClick={() => setIsTextMode(!isTextMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              isTextMode 
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}
            title={isTextMode ? 'Switch to voice mode' : 'Switch to text mode'}
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          {conversationHistory.length > 0 && (
            <button
              onClick={clearHistory}
              className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Conversation History */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {conversationHistory.length === 0 && !currentAIMessage ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <p className="text-sm mb-4">Ask me about your yearly health checks, health conditions, weather, social connections, or style advice</p>
            <div className="text-xs space-y-1">
              <p className="font-medium">Try asking:</p>
              {getContextualPrompts().slice(0, 2).map((prompt, index) => (
                <p key={index} className="text-gray-400 dark:text-gray-500">{prompt}</p>
              ))}
            </div>
          </div>
        ) : (
          <>
            {conversationHistory.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-3 py-2 ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">
                      {message.type === 'user' ? 'You' : 'Mai'}
                    </span>
                    {message.isVoice && (
                      <Volume2 className="w-3 h-3 opacity-70" />
                    )}
                    <span className="text-xs opacity-70">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-line">{message.text}</div>
                </div>
              </div>
            ))}
            
            {(currentAIMessage || isAIResponding) && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium">Mai</span>
                    <span className="text-xs opacity-70">typing...</span>
                  </div>
                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {currentAIMessage || (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={historyEndRef} />
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        {isTextMode ? (
          <form onSubmit={handleTextSubmit} className="flex gap-2">
            <input
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Ask about your yearly health checks, health conditions, weather, social connections..."
              disabled={isAIResponding}
              className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={!textInput.trim() || isAIResponding}
              className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <div className="flex flex-col items-center space-y-3">
            <button
              onClick={handleToggleConversation}
              disabled={conversation.status === 'connecting'}
              className={`
                flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 transform hover:scale-105
                ${conversation.status === 'connected' 
                  ? 'bg-red-500 hover:bg-red-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }
                ${conversation.status === 'connecting' ? 'opacity-50 cursor-not-allowed' : ''}
                shadow-lg hover:shadow-xl
              `}
            >
              {conversation.status === 'connected' ? (
                <MicOff className="w-5 h-5" />
              ) : (
                <Mic className="w-5 h-5" />
              )}
            </button>

            <div className="text-center">
              <p className="text-xs font-medium text-gray-900 dark:text-white">
                {getStatusText()}
              </p>
              {conversation.status === 'connected' && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Ask about yearly health checks, health conditions, weather, or style
                </p>
              )}
            </div>

            {conversation.status === 'connected' && conversation.isSpeaking && (
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400">
                <VolumeX className="w-4 h-4 animate-pulse" />
                <span className="text-xs">AI is speaking...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VoiceAgent;