'use client';
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { Student } from "@/utils/dataManager";
import Gallery from "./Gallery";
import ListView from "./ListView"

interface TabsProps {
  records: Student[];
  buildings: {
    buildingName: string,
    roomNumber: string,
    id: string;
  }[];
}

export default function Tabs({ records, buildings }: TabsProps) {
  const [students, setStudents] = useState<Student[]>(records);
  const [activeTab, setActiveTab] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [value, setValue] = useState(1);

  const tabs = ['Students', 'Buildings', 'Import Data'];

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload", { method: "POST", body: formData });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="rounded-t-md overflow-hidden flex w=fit mb-5 divide-x-1 divide-green-900">
          {tabs.map((tab, i) => (
            <button
              key={i}
              className={`px-4 py-2 hover:cursor-pointer last:rounded-tr-md text-2xl ${activeTab === i ? 'bg-green-800 text-white' : 'bg-gray-200'}`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="h-full">
          {activeTab < 2 && <div className="flex gap-4">
            <span className="font-bold text-xl">View Block: {value}</span>
            <input
              type="range"
              min="1"
              max="4"
              step="1"
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-64 cursor-pointer"
            />
          </div>}
          {activeTab === 0 && (
            <>
              <input
                type="text"
                placeholder="search by name..."
                className="w-full p-4 my-4 border border-green-900 rounded-md italic"
                onChange={(e) => setStudents(records.filter(s => s.name.toLowerCase().includes(e.target.value.toLowerCase())))}
              />
              <div className="w-full grid grid-cols-3 italic">
                <span>Name</span>
                <span>Location</span>
                <span>Teacher</span>
              </div>
              <div className="flex flex-col divide-y divide-green-900/10 h-full overflow-scroll w-full">
                {students.map((student, i) => (
                  <AnimatePresence key={i}>
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="p-4 w-full">
                      <ListView student={student} block={value} />
                    </motion.div>
                  </AnimatePresence>
                ))}
              </div>
            </>
          )}
          {activeTab === 1 && (
            <div>
              <Gallery students={records} block={value} />
            </div>
          )}
          {activeTab === 2 && (
            <div className="flex flex-col items-center justify-center space-y-4 scale-200 translate-y-[25vh]">
              <label htmlFor="fileInput" className="px-4 py-2 bg-green-800 text-white font-semibold rounded-md cursor-pointer hover:bg-green-800">
                Choose File
              </label>
              <input type="file" id="fileInput" onChange={handleFileChange} className="hidden" />
              <span className="text-lg">{file ? file.name : "No file selected"}</span>
              <button onClick={handleUpload} disabled={!file || uploading} className="px-4 py-2 rounded-md text-white font-semibold bg-green-800 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed">
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}