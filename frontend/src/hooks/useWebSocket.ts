import { useEffect, useState } from 'react';
import { wsService } from '@/services/websocket.service';
import { throttle } from 'lodash';
import { WebSocketData } from '@/types';

export function useWebSocket(personId: number | undefined) {
    const [data, setData] = useState<WebSocketData[]>([]);
    const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
    const [actualRate, setActualRate] = useState(0);
    const MAX_MESSAGES = 100;

    useEffect(() => {
        setData([]);
        setStatus('connecting');
        setActualRate(0);

        if (!personId) return;

        let messageCount = 0;
        let lastCheck = Date.now();

        const rateInterval = setInterval(() => {
            const now = Date.now();
            const rate = messageCount / ((now - lastCheck) / 1000);
            setActualRate(Math.round(rate));
            messageCount = 0;
            lastCheck = now;
        }, 1000);

        const handleMessageEvery100ms = throttle((message: WebSocketData) => {
            messageCount++;
            setData(prev => [...prev.slice(-MAX_MESSAGES), message]);
            setStatus('connected');
        }, 100);

        wsService.connect(personId, handleMessageEvery100ms);

        return () => {
            clearInterval(rateInterval);
            wsService.disconnect(personId, handleMessageEvery100ms);
            setData([]);
            setStatus('connecting');
            setActualRate(0);
        };
    }, [personId]);

    return { data, status, actualRate };
}