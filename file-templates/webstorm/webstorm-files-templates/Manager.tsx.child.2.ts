import { createContext } from 'react';

import { T${NAME}St } from './types';

export const ${NAME}Ctx = createContext<T${NAME}St>({
    opened: false,
    setOpened: () => {}
});

export default ${NAME}Ctx;
