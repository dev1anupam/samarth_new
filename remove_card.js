const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'app/dashboard/contractor/page.tsx');
let content = fs.readFileSync(filePath, 'utf-8');

const startMarker = `                    {/* Feature 7: Party Worker Management System */}`;
const endMarker = `                        </div>\n                    </Card>`;

const startIndex = content.indexOf(startMarker);
if (startIndex !== -1) {
    const fromStart = content.substring(startIndex);
    const endIndex = fromStart.indexOf(endMarker) + endMarker.length + startIndex;
    const toReplace = content.substring(startIndex, endIndex);
    content = content.replace(toReplace, '');

    // Check line above the start, it might leave an empty line or something, that's fine.
    // Also remove the `assignNewTask` function so no unused vars.
    // Wait, let's keep it simple first
    const assignNewTaskStr = `    const assignNewTask = (workerId: number) => {
        setWorkers(workers.map(w => w.id === workerId ? { ...w, tasks: w.tasks + 1, status: 'Active' } : w));
    };`;
    content = content.replace(assignNewTaskStr, '');

    fs.writeFileSync(filePath, content);
    console.log("Successfully removed Feature 7 and assignNewTask");
} else {
    console.log("Could not find start marker");
}
