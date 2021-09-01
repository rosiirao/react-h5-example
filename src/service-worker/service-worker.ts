declare const self: ServiceWorkerGlobalScope;

console.log('Hello Service worker');
console.log(self.__WB_MANIFEST);

import {Workbox} from 'workbox-window';

export const wb = new Workbox('./');
// export default {};
