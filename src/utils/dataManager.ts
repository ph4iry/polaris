import fs from "fs";

// Interfaces
interface Class {
  location: string;
  teacher: string;
  contactInfo: string;
  startTime: string; // ISO date string format
  endTime: string; // ISO date string format
}

// read from ./buildings.json and just get buildings[id]
export function getBuildingAndRoomFromId(id: string): { building: string, room: string } {
  const data = fs.readFileSync('buildings.json', "utf-8");
  return JSON.parse(data)[id];
}

export interface Student {
  name: string;
  schedule: Class[];
}

// Utility function to get the current class
function getCurrentClass(schedule: Class[], currentTime: Date = new Date()): Class | null {
  return schedule.find(c => {
    const start = new Date(c.startTime);
    const end = new Date(c.endTime);
    return currentTime >= start && currentTime <= end;
  }) || null;
}

// DataManager as a plain object
const DataManager = {
  filePath: "students.json",
  students: [] as Student[],

  loadDataFromFile,
  saveDataToFile,
  searchByName,
  addStudent,
  updateStudent,
  deleteStudent
};

export default DataManager;

export function extractAllBuildingsFromData() {
  const data = fs.readFileSync('buildings.json', "utf-8");
  return JSON.parse(data);
}

export function loadDataFromFile(): void {
  try {
    const data = fs.readFileSync(DataManager.filePath, "utf-8");
    DataManager.students = JSON.parse(data);
  } catch (error) {
    console.error("Error loading data:", error);
    DataManager.students = [];
  }
}

export function saveDataToFile(): void {
  fs.writeFileSync(DataManager.filePath, JSON.stringify(DataManager.students, null, 2), "utf-8");
}

export function searchByName(name: string): Student[] {
  const lowerCaseName = name.toLowerCase();
  return DataManager.students.filter(student =>
    student.name.toLowerCase().includes(lowerCaseName)
  );
}

export function addStudent(student: Student): void {
  DataManager.students.push(student);
  saveDataToFile();
}

export function updateStudent(name: string, updatedStudent: Student): boolean {
  const index = DataManager.students.findIndex(
    student => student.name.toLowerCase() === name.toLowerCase()
  );
  if (index !== -1) {
    DataManager.students[index] = updatedStudent;
    saveDataToFile();
    return true;
  }
  return false;
}

export function deleteStudent(name: string): boolean {
  const index = DataManager.students.findIndex(
    student => student.name.toLowerCase() === name.toLowerCase()
  );
  if (index !== -1) {
    DataManager.students.splice(index, 1);
    saveDataToFile();
    return true;
  }
  return false;
}

// Load data initially
DataManager.loadDataFromFile();

// Example usage
// addStudent({
//   name: "John Doe",
//   schedule: [
//     {
//       location: `MB10${Math.floor(Math.random() * 3)}`,
//       teacher: "Mrs. Smith",
//       contactInfo: "smith@example.com",
//       startTime: "2025-03-08T08:00:00",
//       endTime: "2025-03-08T09:00:00",
//     }
//   ],
// });

// Searching for students with a partial name match
// const results = DataManager.searchByName("doe");
// console.log("Search results:", results.map(s => s.name));

// Getting current class
// if (results.length > 0) {
//   const currentClass = getCurrentClass(results[0].schedule);
//   console.log("Current class for", results[0].name, ":", currentClass);
// }
