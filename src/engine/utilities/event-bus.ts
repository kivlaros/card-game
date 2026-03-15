import { EventEmitter } from 'events';

// Создаём единую шину событий
export const eventBus = new EventEmitter();