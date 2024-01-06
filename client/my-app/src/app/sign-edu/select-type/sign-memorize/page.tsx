"use client"

import WebCam from "@/app/components/webCam";
import getAnswer from "@/app/components/getAnswer";
import React, {useEffect, useRef} from "react";
import { useSearchParams } from 'next/navigation';
import axios from "axios";
import { useState } from "react";
import Image from "next/image";
import AnswerModalProps from '../answerModal';
import WebCamMemorize from "@/app/components/webCamMemorize";
import {NormalizedLandmarkList} from "@mediapipe/holistic";
export default function SignMemory() {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const searchParams = useSearchParams()

    const type = searchParams.get('type')
    const situation = searchParams.get('situation')
    const chapter = Number(searchParams.get('chapter'))
    const [answer, setAnswer] = useState("");

    const userId = typeof window !== 'undefined' ? localStorage.getItem('id') : null;
    const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
    const [landmarks, setLandmarks] = useState<Record<string, NormalizedLandmarkList>>({});
    const [isStart, setIsStart] = useState<boolean>(false);
    const isInitialRender = useRef(true);
    const [questionNumber, setQuestionNumber] = useState(0);

    const handleLandmarksChange = (newLandmarks: Record<string, NormalizedLandmarkList>) => {
        setLandmarks(newLandmarks);
  };


    let param = {};
    let API_URL = '';
    let MODEL_API_URL = '';
    let second = 1;
    if (type == '단어') {
        second = 1;
        API_URL = "http://localhost:8000/api/wordquestion/"
        MODEL_API_URL = "http://localhost:8000/api/wordmodel/"
        param = {
            id: userId, type: type, situation: situation, chapter: chapter, is_deaf: false
        }
    } else {
        second = 4;
        API_URL = "http://localhost:8000/api/sentencequestion/"
        MODEL_API_URL = "http://localhost:8000/api/sentencemodel/"
        param = {
            id: userId, type: type, chapter: chapter, is_deaf: false
        }
    }
        const getQuestion = () => {
            const accessToken = localStorage.getItem('accessToken');
            axios.post(API_URL, param, {headers: {'Authorization': `Token ${accessToken}`}})
                .then((res) => {
                    setAnswer(res.data['문제'].answer.word);
                    console.log(res)
                })
                .catch((err) => {
                    console.log(err)
                });
        };


        useEffect(() => {
            getQuestion();
            // handleOpenModal();
         }, []);

        useEffect(() => {
            // 초기 렌더링일 경우 실행하지 않음
            if (isInitialRender.current) {
              isInitialRender.current = false;
              return;
            }

            if(Object.keys(landmarks).length == second*30){
                console.log(landmarks)

                const accessToken = localStorage.getItem('accessToken');

                axios.post(MODEL_API_URL, landmarks,{
                headers: {
                    'Authorization':`Token ${accessToken}`
                }})
                .then((res) => {
                    console.log(res)
                    checkAnswer(res.data);
                })
                .catch((err) => {
                    console.log(err)
                });
            }
        }, [landmarks]);

    // 정답 여부 체크
    const checkAnswer = (predictAnswer: string) => {

          // 정답 여부에 따라 표시되는 문구 설정
        if (predictAnswer === answer) {
          setIsAnswerCorrect(true);
        } else {
          setIsAnswerCorrect(false);
        }
        handleOpenModal();
    };



    // 정답 결과를 제공하는 modal을 open하는 로직
    const handleOpenModal = () => {
        setIsModalOpen(true);
      };


        return (
            <>
                <div className="whole_camera">
                    <WebCamMemorize onLandmarksChange={handleLandmarksChange} frameNumber={second*30}  isStart={isStart}/>
                    <div className="answer_btn">
                        <div className="question">
                            <div className="quest-text">{answer}</div>
                        </div>
                        <div className="check">
                            <button className='startQuiz' onClick={() => setIsStart(true)}>문제 풀기</button>
                            <p>버튼을 클릭하면 {second}초 안에 동작을 해주세요. </p>
                        </div>
                    </div>
                </div>
                <AnswerModalProps isOpen={isModalOpen} isAnswerCorrect={isAnswerCorrect} />
            </>
        );
}