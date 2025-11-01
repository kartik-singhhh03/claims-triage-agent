import { createContext, useContext, useEffect, useState, useCallback } from 'react';

interface FeedEvent {
  id: string;
  type: string;
  title: string;
  description?: string;
  timestamp: Date;
  claimId?: string;
  severity?: 'high' | 'medium' | 'low';
}

interface RealtimeContextType {
  isConnected: boolean;
  lastEvent: FeedEvent | null;
  send: (message: any) => void;
  subscribe: (callback: (event: FeedEvent) => void) => () => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: React.ReactNode;
  wsUrl?: string;
}

export function RealtimeProvider({ children, wsUrl }: RealtimeProviderProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<FeedEvent | null>(null);
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [subscribers, setSubscribers] = useState<Set<(event: FeedEvent) => void>>(new Set());
  const [reconnectAttempt, setReconnectAttempt] = useState(0);

  const getWebSocketUrl = useCallback(() => {
    if (wsUrl) return wsUrl;

    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
    const wsProtocol = apiUrl.startsWith('https') ? 'wss' : 'ws';
    const baseUrl = apiUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}://${baseUrl}/ws/claims`;
  }, [wsUrl]);

  const reconnect = useCallback(() => {
    const url = getWebSocketUrl();

    try {
      const newWs = new WebSocket(url);

      newWs.onopen = () => {
        console.log('WebSocket connected to', url);
        setIsConnected(true);
        setReconnectAttempt(0);
      };

      newWs.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          const feedEvent: FeedEvent = {
            id: data.id || Math.random().toString(),
            type: data.type || 'claim_updated',
            title: data.title || 'Event',
            description: data.description,
            timestamp: new Date(data.timestamp || Date.now()),
            claimId: data.claimId,
            severity: data.severity,
          };
          setLastEvent(feedEvent);
          subscribers.forEach((callback) => callback(feedEvent));
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      newWs.onerror = (event: Event) => {
        console.error('WebSocket error on', url, '- Connection may not be available. This is normal if backend is not running.');
        setIsConnected(false);
      };

      newWs.onclose = () => {
        console.log('WebSocket disconnected from', url);
        setIsConnected(false);
        setWs(null);
      };

      setWs(newWs);
    } catch (error) {
      console.error('Failed to create WebSocket connection to', url, ':', error);
      setIsConnected(false);
    }
  }, [getWebSocketUrl, subscribers]);

  useEffect(() => {
    reconnect();

    const interval = setInterval(() => {
      if (!isConnected) {
        reconnect();
      }
    }, 5000);

    return () => {
      clearInterval(interval);
      if (ws) {
        ws.close();
      }
    };
  }, [isConnected, reconnect, ws]);

  const send = useCallback(
    (message: any) => {
      if (ws?.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected');
      }
    },
    [ws]
  );

  const subscribe = useCallback(
    (callback: (event: FeedEvent) => void) => {
      setSubscribers((prev) => new Set([...prev, callback]));
      return () => {
        setSubscribers((prev) => {
          const newSet = new Set(prev);
          newSet.delete(callback);
          return newSet;
        });
      };
    },
    []
  );

  const value: RealtimeContextType = {
    isConnected,
    lastEvent,
    send,
    subscribe,
  };

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>;
}

export function useRealtime() {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
}
