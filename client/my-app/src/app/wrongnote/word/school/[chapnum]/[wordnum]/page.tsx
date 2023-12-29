"use client"
import Link from 'next/link'
import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LectureNum from '@/app/components/lecture';
import Image, { StaticImageData } from 'next/image';
import NextBtn from '../../../../../../../public/right_direct.png';
import "@/app/styles/situation_num.css"

export default function Lecture({params}:{params : {chapnum: number, wordnum: number}}) {
  const words = [["학교", "학교1"],["2학교", "2학교1"]]
  const currentPath = usePathname();
  const nextPath = currentPath.slice(0, -1)
    return (
      <>
        <LectureNum situation='학교' chapnum={params.chapnum} wordnum={params.wordnum} word_str={words}/>
        <Link className="next_word" href={`${nextPath}/${Number(params.wordnum) + 1}`}><div className='nextBtn'>
              <div className='next_txt'>다음</div>
              <Image src={NextBtn} alt="next-button" className='next_image'></Image>
          </div></Link>
      </>
    );
  }