"use client"

import { Student } from "@/utils/dataManager";
import { motion } from "motion/react";
import { useState } from "react";

export default function ListView({ student, block }:{ student: Student, block: number }) {
    const [showingInfo, setShowingInfo] = useState(false);
  
    return (
        <div>
          <div className="!w-full grid grid-cols-3">
            <div onClick={() => setShowingInfo(true)} className="text-xl font-bold">{student.name}</div>
            <div className="text-xl font-bold">{student.schedule.map(s => s.location)[block-1]}</div>
            <div className="text-xl font-bold">{student.schedule.map(s => s.teacher)[block-1]}</div>
          </div>
          {showingInfo && (
            <>
            
            <motion.div className="top-0 left-0 fixed z-50 w-screen h-screen bg-black/25 flex justify-center items-center">
              <div className="bg-white p-4 rounded-md max-h-[60vh] w-full max-w-xl">
                <div className="text-3xl font-bold">{student.name}</div>
                <div className="text-2xl font-bold">Student Schedule</div>
                <div className="flex flex-col gap-4">
                  {Array(4).fill(0).map((_, i) => (
                    <div key={i} className="">
                      <div className="font-bold text-xl">Period {i + 1}</div>
                      <div className="flex gap-2">
                        <div className="">{student.schedule[i]?.location}</div>
                        {student.schedule[i]?.location && <div>|</div>}
                        <div>{student.schedule[i]?.teacher}</div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* <div>{student.schedule.map(s => s.location).join(", ")}</div> */}
                <button className="bg-green-800 text-white p-4 w-full rounded-md mt-6" onClick={() => setShowingInfo(false)}>Close</button>
              </div>
            </motion.div>
            </>
          )}

        </div>
    )
}

export function ListItem() {

}