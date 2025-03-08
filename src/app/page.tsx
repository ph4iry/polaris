import Tabs from "@/components/Tabs";
import { Victor_Mono } from "next/font/google";
import DataManager, { extractAllBuildingsFromData } from "@/utils/dataManager";

const victor_mono = Victor_Mono({
  style: 'italic',
  subsets: ['latin']
});

export default function Home() {
  const records = DataManager;
  const buildings = extractAllBuildingsFromData();

  return (
    <div className="flex w-screen h-screen gap-8">
      {/* <div className="h-screen w-1/4 bg-sky-800"></div> */}
      <div className="h-screen w-full p-8 bg-white">
        <div className="flex items-center">
          <h1 className={`text-7xl mb-5 italic mr-8`}>Polaris</h1>
          <div className="h-0.5 w-full bg-green-800"></div>
        </div>
        <div className="flex flex-col gap-4 items-start w-full">
          <Tabs records={records.students} buildings={buildings} />
        </div>
      </div>
    </div>
  );
}
