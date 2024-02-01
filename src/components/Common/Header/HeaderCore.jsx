import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';

import styles from './HeaderCore.module.css';
import Logo from '@/assets/logo-white.png';
import Dropdown from './Dropdown';

const HeaderCore = ({ type, isCheckLogin = true }) => {
  const [familyMenuOpen, setFamilyMenuOpen] = useState(false);
  const [mateMenuOpen, setMateMenuOpen] = useState(false);

  const toggleMenu = ($type) => {
    if ($type === 'family') {
      setFamilyMenuOpen(!familyMenuOpen);
      setMateMenuOpen(false);
    } else if ($type === 'mate') {
      setMateMenuOpen(!mateMenuOpen);
      setFamilyMenuOpen(false);
    }
  };

  const navigator = useRouter();

  useEffect(() => {
    const checkLogin = () => {
      if (typeof window !== 'undefined') {
        const loginInfo = localStorage.getItem('login_info');
        const accessToken = localStorage.getItem('access_token');
        const expirationTime = localStorage.getItem('expiration_time');
        if (accessToken && JSON.parse(loginInfo)?.login_id && expirationTime >= new Date().getTime()) {
          console.log('ok');
        } else {
          localStorage.removeItem('login_info');
          localStorage.removeItem('access_token');
          localStorage.removeItem('expiration_time');
          alert('로그인이 필요합니다.');
          navigator.push(`/${type}/login`);
        }
      }
    };

    if (isCheckLogin) checkLogin();
  }, []);

  return (
    <div className={styles.HeaderCore}>
      <Link className={styles.logo} href={`/${type}/main`}>
        <Image src={Logo} alt='Logo' />
      </Link>
      <div className='nav_wrapper'>
        <ul className='menu_wrapper'>
          <button onClick={() => toggleMenu('mate')} className={`${type === 'mate' ? styles.active : ''} mate-button`}>
            <span>간병 일감 찾기</span>
          </button>
          {mateMenuOpen && <Dropdown type='mate' isOpen />}
          <button
            onClick={() => toggleMenu('family')}
            className={`${type === 'family' ? styles.active : ''} family-button`}
          >
            <span className={styles.buttonText}>간병인 찾기</span>
          </button>
          {familyMenuOpen && <Dropdown type='family' isOpen />}
        </ul>
      </div>
    </div>
  );
};

export default HeaderCore;
