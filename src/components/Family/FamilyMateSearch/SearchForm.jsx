import { useState } from 'react';
import styles from './SearchForm.module.css';
import FormLocationList from './FormLocationList';
import FormAgeList from './FormAgeList';

const SearchForm = ({ onSearch }) => {
  //시급 관련
  const [wages, setWages] = useState([9860, 9860]);

  const handleWageChange = (e, index) => {
    const newWages = [...wages];
    newWages[index] = +e.target.value;
    setWages(newWages);
  };

  const updateWage = () => {
    if (wages[0] < 9860) {
      alert('최소 시급은 2024년 기준 최저임금 9,860원 이상이어야 합니다.');
      setWages([9860, wages[1]]);
    }

    if (wages[0] > wages[1]) {
      alert('최대 시급은 최소 시급보다 높아야 합니다.');
      setWages([wages[0], wages[0]]);
    }

    setCheckedItems({
      ...checkedItems,
      wage: wages,
    });
  };

  //상단 이름 검색창 관련
  const [searchInput, setSearchInput] = useState('');

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setCheckedItems({
      ...checkedItems,
      search_input: e.target.value,
    });
  };

  //체크박스 및 최종 데이터 관련
  const [checkedItems, setCheckedItems] = useState({
    search_input: '',
    location: [],
    gender: [],
    service: [],
    age: [],
    wage: [9860, 9860],
  });

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    if (checked) {
      setCheckedItems({
        ...checkedItems,
        [name]: [...checkedItems[name], value],
      });
    } else {
      setCheckedItems({
        ...checkedItems,
        [name]: checkedItems[name].filter((item) => item !== value),
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isEmptyData = ($obj, key) => {
      if ($obj[key].length > 0) {
        return false;
      }
      return true;
    };

    if (isEmptyData(checkedItems, 'location')) {
      alert('활동 지역을 1곳 이상 선택하세요.');
    } else {
      console.log(checkedItems);
      onSearch(checkedItems);
    }
  };

  return (
    <div className={`${styles.SearchForm} Form_wide`}>
      <div className='title_wrapper'>
        <h1 className='title'>원하는 간병인 찾기</h1>
        <span className='description'>나와 꼭 맞는 조건의 간병인을 검색할 수 있습니다.</span>
      </div>

      <form name='search_form' onSubmit={handleSubmit}>
        <div className='input_wrapper'>
          <label>이름으로 검색</label>
          <input
            type='text'
            name='search_input'
            placeholder='🔎 간병인 이름으로 검색하기'
            value={searchInput}
            onChange={handleSearchChange}
            maxLength={10}
          />
        </div>
        <hr />
        <div className='input_wrapper'>
          <label>활동 지역</label>
          <div className={styles.checkbox_list_wrapper}>
            <FormLocationList onChange={handleCheckboxChange} />
          </div>
        </div>{' '}
        <hr />
        <div className='input_wrapper'>
          <label>간병인 성별</label>
          <div className={styles.checkbox_list_wrapper}>
            <div className={styles.checkbox_wrapper}>
              <input type='checkbox' name='gender' value={'F'} onChange={handleCheckboxChange} />
              <span>여자</span>
            </div>
            <div className={styles.checkbox_wrapper}>
              <input type='checkbox' name='gender' value={'M'} onChange={handleCheckboxChange} />
              <span>남자</span>
            </div>
          </div>
        </div>
        <hr />
        <div className='input_wrapper'>
          <label>대표서비스</label>
          <div className={styles.checkbox_list_wrapper}>
            {['외출동행', '목욕', '요리', '청소', '재활운동보조', '빨래', '운전'].map((e, i) => (
              <div className={styles.checkbox_wrapper} key={i}>
                <input type='checkbox' name='service' value={e} onChange={handleCheckboxChange} />
                <span>{`${e}`}</span>
              </div>
            ))}
          </div>
        </div>
        <hr />
        <div className='input_wrapper'>
          <label>간병인 연령대</label>
          <div className={styles.checkbox_list_wrapper}>
            <FormAgeList onChange={handleCheckboxChange} />
          </div>
        </div>
        <hr />
        <div className='input_wrapper'>
          <label>시급</label>
          <div className={styles.input_wrapper}>
            최소
            <input
              type='number'
              value={wages[0]}
              onChange={(e) => handleWageChange(e, 0)}
              onBlur={updateWage}
              min={9860}
              step={1000}
              max={1000000}
            />
            원 ~ 최대
            <input
              type='number'
              value={wages[1]}
              onChange={(e) => handleWageChange(e, 1)}
              onBlur={updateWage}
              min={9860}
              step={1000}
              max={1000000}
            />
            원
          </div>
        </div>
        <hr />
        <div className={styles.button_wrapper}>
          <button type='submit'>간병인 검색</button>
        </div>
      </form>
    </div>
  );
};

export default SearchForm;
