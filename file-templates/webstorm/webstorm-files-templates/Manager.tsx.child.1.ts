import{ useState, useContext } from 'react';

import { T${NAME}St } from './types';

import ${NAME}Ctx from './${NAME}Ctx';

export const use${NAME} = () =>
  useContext(${NAME}Ctx);

export default function useInitialSt(): T${NAME}St {
    const [opened, setOpened] = useState<boolean>(false);
    
    return {
        opened,
        setOpened
    }
}
3
