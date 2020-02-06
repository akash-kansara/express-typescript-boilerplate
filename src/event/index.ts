import { EventEmitter } from 'events';

import * as sysLog from './sys-log';
import * as repoLog from './repo-log';

const eventHandler = new EventEmitter().setMaxListeners(Number.MAX_VALUE);

// SYSTEM LOG HANDLER IMPL

eventHandler.addListener('sys-info', sysLog.info);
eventHandler.addListener('sys-log', sysLog.log);

// SYSTEM LOG HANDLER IMPL

// REPO LOG HANDLER IMPL

eventHandler.addListener('repo-conn-s', repoLog.connectSuccessful);
eventHandler.addListener('repo-conn-f', repoLog.connectFail);
eventHandler.addListener('repo-disconn-s', repoLog.disconnectSuccessful);
eventHandler.addListener('repo-disconn-f', repoLog.disconnectFail);
eventHandler.addListener('repo-op-f', repoLog.opFail);
eventHandler.addListener('repo-warn', repoLog.warn);

// REPO LOG HANDLER IMPL

export default eventHandler;