
'use client';
import { Student } from "@/utils/dataManager";
import { Fragment, useState } from "react";

export default function Gallery({ students, block }:{ students: Student[], block: number }) {

  const allBuildings = new Set<string>();
  students.forEach(s => {
    s.schedule.forEach(schedule => {
      allBuildings.add(schedule.location);
    }); 
  });

  console.log(Array.from(allBuildings))

  return (
    <div className="grid grid-cols-3 gap-4 mt-8">
      {Object.entries(Array.from(allBuildings)).map(([key, building], i) => (
        <Fragment key={i}>
          <GalleryItem building={building} students={students} block={block} />
        </Fragment>
      ))}
    </div>
  )
}


// il be implmene where do i put the code for the student individual viewrip
function GalleryItem({ building, students, block }:{ building: string, students: Student[], block:number }) {
  const [open, setOpen] = useState(false);
  const teacher = students.filter(s => s.schedule[block-1]?.location === building).map(s => s.schedule[block-1]?.teacher)[0];

  console.log(teacher)

  return (
    <>
      <div className="p-8 bg-green-800 text-white rounded-lg w-full relative">
        <button className="left-0 top-0 absolute w-full h-full hover:cursor-pointer" onClick={() => console.log('hi')}></button>
        {/* <div className="w-full bg-gradient-to-br from-green-800 to-sky-800 p-8 rounded-md"></div> */}
        <div className="text-3xl font-bold">{building}</div>
        <div className="text-xl font-bold">{teacher}</div>
        <div className="line-clamp-2 italic">{students.filter(s => s.schedule[block-1]?.location === building).map(s => s.name).join(', ')}</div>
        {!teacher && <div className="italic">No students</div>}
      </div>
      <GalleryModal open={open} setOpen={setOpen} students={students} />
    </>
  )
}

function GalleryModal({ open, setOpen, students }:{ open: boolean, setOpen: (open: boolean) => void, students: Student[] }) {

  return (
    open ? <div>
      <div onClick={() => setOpen(false)} className="fixed top-0 left-0 w-screen h-screen bg-black/50 flex justify-center items-center z-50">
        <div className="bg-white p-4 rounded-md max-h-[60vh] w-screen max-w-xl">
          <button className="bg-green-800 text-white" onClick={() => setOpen(false)}>Close</button>
        </div>
      </div>
    </div> : null
  )

}