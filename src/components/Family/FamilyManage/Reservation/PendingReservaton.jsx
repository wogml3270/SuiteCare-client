import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from 'react-query';

import useModal from '@/hooks/useModal';
import axiosInstance from '@/services/axiosInstance';
import usePatientList from '@/services/apis/usePatientList';
import useLoginInfo from '@/hooks/useLoginInfo';

import cardstyles from './PendingReservation.module.css';
import styles from '@/components/Common/ManageTable.module.css';
import PendingReservationCard from './PendingReservationCard';
import Loading from '@/components/Common/Modal/Loading';
import PatientDetailModal from './PatientDetailModal';

const PendingReservation = ({ data }) => {
  const navigator = useRouter();

  const { isModalVisible, openModal, closeModal } = useModal();
  const [modalData, setModalData] = useState({});

  const { id } = useLoginInfo();

  const { isError, isLoading, patientList } = usePatientList(id);
  const [patientInfo, setPatientInfo] = useState();

  const [recruitmentSelectedInfo, setRecruitmentSelectedInfo] = useState({});

  const [selectedRecId, setSelectedRecId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);

  const {
    data: recruitmentList,
    isError: isRecListError,
    isLoading: isRecListLoading,
  } = useQuery(
    ['reservationList', id],
    async () => {
      const { data: recruitmentData } = await axiosInstance.get('/api/v1/pendingRecruitment', { params: { id } });
      return recruitmentData.reverse();
    },
    {
      enabled: Boolean(id),
    },
  );

  useEffect(() => {
    console.log('recruitmentList', recruitmentList);
  }, [recruitmentList]);

  const {
    data: mateList,
    isError: isMateListError,
    isLoading: isMateListLoading,
  } = useQuery(
    ['mateList', selectedRecId],
    async () => {
      const { data: mateData } = await axiosInstance.get(`/api/v1/recruitment/${selectedRecId}/M`, {
        params: {
          recruitment_id: selectedRecId,
        },
      });
      console.log('mateList', selectedRecId, mateData);
      return mateData;
    },
    {
      enabled: Boolean(selectedRecId),
    },
  );

  useEffect(() => {
    console.log('mateList', mateList);
  }, [mateList]);

  const handleSelectChange = (e) => {
    const newValue = e.target.value;

    if (newValue === 'add') {
      if (window.confirm('새로운 간병예약 신청 페이지로 이동하시겠습니까?')) {
        navigator.push('/family/addpatient');
      }
    } else {
      const selectedRecruitment = recruitmentList?.find((v) => v.id === +newValue);
      const selectPatient = selectedRecruitment.patient_name;

      setRecruitmentSelectedInfo((prevData) => ({
        ...prevData,
        ...selectedRecruitment,
        ...selectedPatient,
      }));

      setSelectedRecId(selectedRecruitment?.id);
      setSelectedPatient(selectPatient);
    }
  };

  const getPatientDetail = async ($event) => {
    setModalData($event);
    try {
      const patientPromise = axiosInstance.get(`/api/v1/patient/${$event.id}`);
      const patientDetailPromise = axiosInstance.get(`/api/v1/patientDetail/${$event.id}`);

      const [patientResponse, patientDetailResponse] = await Promise.all([patientPromise, patientDetailPromise]);

      setModalData((prevData) => ({
        ...prevData,
        ...patientResponse.data,
        ...patientDetailResponse.data,
      }));
    } catch (error) {
      console.error(error);
    }
  };

  const handlePatientDetailClick = ($event) => {
    getPatientDetail($event);
    openModal();
  };

  const handleDetailClick = ($event) => {
    getPatientDetail($event);
    openModal();
  };

  const handleReset = () => {
    window.location.reload();
  };

  return (
    <div className={cardstyles.PendingReservation}>
      {isLoading || isRecListLoading || isMateListLoading ? <Loading /> : null}
      <div className={`${cardstyles.select_reservation} input_wrapper`}>
        <label>간병공고 목록</label>
        <select onChange={handleSelectChange}>
          <option onSelect={handleReset}>간병공고 선택</option>
          {recruitmentList?.map((e) => (
            <option key={e.id} value={e.id}>
              {e.patient_name} | {e.start_date} ~ {e.end_date}
            </option>
          ))}
          <option value='add'>새로운 간병 공고 등록하기</option>
        </select>
      </div>

      <hr />

      {selectedRecId ? (
        <>
          <div className={cardstyles.button_wrapper}>
            <button type='button' onClick={() => handlePatientDetailClick(selectedPatient)}>
              환자 정보 보기
            </button>
            <button type='button' className={cardstyles.second_button}>
              공고 정보 보기
            </button>
          </div>
          <br />
          <h3>지원한 간병인 리스트</h3>
          <div className={styles.ManageTable}>
            <table>
              <thead>
                <tr>
                  <th>아이디</th>
                  <th>성명</th>
                  <th>성별</th>
                  <th>지역</th>
                  <th>주요 서비스</th>
                  <th>간병인 상세정보</th>
                </tr>
              </thead>
              <tbody>
                {mateList?.length === 0 ? (
                  <tr>
                    <td colSpan={6}>
                      <div className='error'>아직 지원한 간병인이 없습니다.</div>
                    </td>
                  </tr>
                ) : (
                  mateList?.map((e) => (
                    <tr key={e.mate_resume_id}>
                      <td>{e.mate_resume_id}</td>
                      <td>{e.name}</td>
                      <td>{e.gender === 'M' ? '남성' : '여성'}</td>
                      <td>{e.location}</td>
                      <td>{e.mainservice}</td>
                      <td>
                        <button type='button' onClick={() => handleDetailClick(e)}>
                          상세정보 보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
                <br />
                <br />
                <br />
                <br />
                <br />
              </tbody>
            </table>
            {isModalVisible && <PatientDetailModal modalData={modalData} closeModal={closeModal} />}
          </div>
        </>
      ) : (
        <div className='no_result'>정보를 확인할 간병 공고를 선택하세요.</div>
      )}
    </div>
  );
};

export default PendingReservation;
