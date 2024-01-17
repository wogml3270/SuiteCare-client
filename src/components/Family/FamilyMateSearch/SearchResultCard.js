import Image from 'next/image';

import styles from './SearchResultCard.module.css';
import defaultProfile from '@/assets/default_profile.jpg';

import { calAge, genderToKo } from '@/utils/calculators.js';
import StarRating from '@/utils/StarRating';

const SearchResultCard = ({ data, showDetail, handleApply }) => {
  return (
    <div className={styles.card}>
      {data.profile_picture_filename || <Image src={defaultProfile} alt='profile_picture' />}
      <div className={styles.userName}>
        <label>{data.mate_name}</label>({genderToKo(data.gender)}성, 만 {calAge(data.birthday)}세)
        <p>
          수행한 간병 <b>4</b>건<span>|</span>
          <StarRating rate={4.2} /> 4.2 {/* 백엔드에서 추가적으로 정보 불러와서 수정해야 함 */}
        </p>
        <p>{data.introduction}</p>
      </div>
      <div className={styles.userInfo_wrapper}>
        <div className={styles.userInfo}>
          <label>활동지역</label>
          <span>{data.address}</span>
        </div>
        <div className={styles.userInfo}>
          <label>대표서비스</label>
          <span>{data.main_service}</span>
        </div>
        <div className={styles.userInfo}>
          <label>희망시급</label>
          <span>{data.wage.toLocaleString()}원 이상</span>
        </div>
      </div>
      <div className={styles.search_button_wrapper}>
        <button onClick={() => showDetail(data.mate_id)}>상세정보 보기</button>
        <button onClick={() => handleApply(data.mate_id)}>간병 신청하기</button>
      </div>
    </div>
  );
};

export default SearchResultCard;
