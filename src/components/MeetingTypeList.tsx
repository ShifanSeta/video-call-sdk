"use client"

import Image from "next/image"
import HomeCard from "./HomeCard"
import { useState } from "react"
import { useRouter } from "next/navigation"
import MeetingModal from "./MeetingModal"
import { useUser } from "@clerk/nextjs"
import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk"
import { useToast } from "./ui/use-toast"
import { Textarea } from "./ui/textarea"
import ReactDatePicker from 'react-datepicker'
import { Input } from "./ui/input"

const MeetingTypeList = () => {
    const [meetingState, setMeetingState] = useState<'isScheduledMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>()
    const [values, setValues] = useState({
        dateTime: new Date(),
        description: "",
        link: ""
        })
    const [callDetails, setCallDetails] = useState<Call>()
    const router = useRouter();
    const {toast} = useToast();
    const {user} = useUser();
    const client = useStreamVideoClient();
    

    const createMeeting = async () => {
        if(!user || !client) return;

        try {
            if(!values.dateTime){
                toast({
                    title : "Please Select a date and a time"
                })
                return;
            }
            const id = crypto.randomUUID();

            const call = client.call('default', id);
            if (!call) {
                throw new Error('Failed to create a call')
            }

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || "Instant Meeting";

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description
                    }
                }
            })
            setCallDetails(call)
            if (!values.description) {
                router.push(`/meeting/${call.id}`)
            }
            toast({
                title : "Meeting Created"
            })
        } catch (error) {
            console.log(error);
            toast({
                title : "Failed to create meeting!"
            })
            
        }

    }
 
    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

    return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img="/icons/add-meeting.svg"
            title="New Meeting"
            description = "Start an Instant Meeting"
            handleClick={() => setMeetingState('isInstantMeeting')}
            className="bg-orange-1"
        />
        <HomeCard 
            img="/icons/schedule.svg"
            title="Schedule Meeting"
            description = "Plan your Meeting"
            handleClick={() => setMeetingState('isScheduledMeeting')}
            className="bg-blue-1"

        />
        <HomeCard 
            img="/icons/recordings.svg"
            title="View recordings"
            description = "Check out your recordings"
            handleClick={() => router.push('/recordings')}
            className="bg-purple-1"

        />
        <HomeCard 
            img="/icons/join-meeting.svg"
            title="join Meeting"
            description = "Via invitation link"
            handleClick={() => setMeetingState('isJoiningMeeting')}
            className="bg-yellow-1"
        />
        {
            !callDetails ? (<MeetingModal 
                isOpen={meetingState === "isScheduledMeeting"}
                onClose={() => setMeetingState(undefined)}
                title="Create Meeting"
                className="text-center"
                handleClick={createMeeting}
                >
                    <div className="'flex flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">Add description</label>
                        <Textarea className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => setValues({
                            ...values, description: e.target.value
                        })} />
                    </div>
                    <div className="flex w-full flex-col gap-2.5">
                        <label className="text-base text-normal leading-[22px] text-sky-2">Select Date & time</label>
                        <ReactDatePicker selected={values.dateTime} onChange={(date) => {
                            setValues({...values, dateTime: date!})
                        }}
                        showTimeSelect
                        timeFormat="HH:mm"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="MMMM d, yyyy h:mm aa"
                        className="w-full rounded bg-dark-3 p-2 focus:outline-none"
                        />
                    </div>
                </MeetingModal>) : (<MeetingModal 
                    isOpen={meetingState === "isScheduledMeeting"}
                    onClose={() => setMeetingState(undefined)}
                    title="Meeting Created"
                    className="text-center"
                    handleClick={() => {
                        navigator.clipboard.writeText(meetingLink);
                        toast({title: "Link Copied"})
                    }}
                    image="/icons/checked.svg"
                    buttonIcon="/icons/copy.svg"
                    buttonText="Copy Meeting Link"
                    />)
        }
        <MeetingModal 
        isOpen={meetingState === "isInstantMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Start an Instant Meeting"
        className="text-center"
        buttonText="Start Meeting"
        handleClick={createMeeting}
        />
        <MeetingModal 
        isOpen={meetingState === "isJoiningMeeting"}
        onClose={() => setMeetingState(undefined)}
        title="Type the link here"
        className="text-center"
        buttonText="Join Meeting"
        handleClick={() => router.push(values.link)}
        >
            <Input placeholder="Meeting link" className="border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0" onChange={(e) => {
                setValues({
                    ...values, link: e.target.value
                })
            }}  />
        </MeetingModal>
    </section>
  )
}

export default MeetingTypeList