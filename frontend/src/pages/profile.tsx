import styles from '@/styles/profile.module.scss'

import Cookies from 'js-cookie';
import { useRouter } from 'next/router';

const profile = () => {
    const route = useRouter();

    const signoutHandler = () => {
        Cookies.remove('token');
        route.push('/');
    }

     return (
       <div className={styles.content}>
          <button onClick={signoutHandler}>Sair</button>
       </div>
   )
}

export default profile;