"use client"
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useUser } from '@clerk/nextjs';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useGetCallbyId } from '../../../../../hooks/useGetCallById';
import Loader from '@/components/ui/Loader';

const MeetingIDPage = () => {
  let params = useParams();
  console.log("params", params);
  
  let paramsId:any = params.id
  const [isSetupComplete, setIsSetupComplete] = useState(false)
  const {call, isCallLoading} = useGetCallbyId(paramsId);
  const {user, isLoaded} = useUser();
  console.log("paramsId", paramsId);
  
  console.log(call);
  

  

  // useEffect(() => {
  //   setParamID(paramsId)
  // },[params])
  
  if(isCallLoading) return <Loader />
    
  return (
    <main className='h-screen w-full'>
        <StreamCall call={call}>
          <StreamTheme>
            {
              !isSetupComplete ? (<MeetingSetup setIsSetupComplete={setIsSetupComplete} />) : (<MeetingRoom/>)
            }
          </StreamTheme>
        </StreamCall>
    </main>
  )
}

export default MeetingIDPage