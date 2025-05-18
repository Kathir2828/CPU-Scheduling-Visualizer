function getProcessData() {
  const rows = document.querySelectorAll(".table tr");
  const processes = [];

  rows.forEach((row, index) => {
    if (index === 0) return; // Skip header row

    const arrivalTime = parseInt(row.querySelector(".arrival-time").value) || 0;
    const burstTime = parseInt(row.querySelector(".burst-time").value) || 0;
    const priority = parseInt(row.querySelector(".priority").value) || 0;

    if (burstTime > 0) {
        processes.push({
            process: `P${index - 1}`, // <-- Change here
            arrivalTime,
            burstTime,
            priority,
            remaining: burstTime, // For Round Robin
        });
    }
});

  return processes;
}

function fifo(processes) {
  processes.sort((a, b) => a.arrivalTime - b.arrivalTime);

  let currentTime = 0;
  const timeline = [];

  processes.forEach((process) => {
      if (currentTime < process.arrivalTime) {
          currentTime = process.arrivalTime; // Wait for the process to arrive
      }

      timeline.push({ pid: process.process, startTime: currentTime, duration: process.burstTime });

      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      currentTime = process.completionTime; // Update current time
  });

  return [processes, timeline];
}

function sjf(processes) {
  let currentTime = 0;
  const completed = [];
  const timeline = [];

  while (completed.length < processes.length) {
      const readyQueue = processes.filter(
          (p) => p.arrivalTime <= currentTime && !completed.includes(p)
      );

      if (readyQueue.length === 0) {
          currentTime++;
          continue;
      }

      readyQueue.sort((a, b) => a.burstTime - b.burstTime);
      const process = readyQueue[0];

      timeline.push({ pid: process.process, startTime: currentTime, duration: process.burstTime });

      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      currentTime = process.completionTime;
      completed.push(process);
  }

  return [processes, timeline];
}

function roundRobin(processes, quantum) {
  let currentTime = 0;
  const queue = [...processes];
  const timeline = [];

  while (queue.some((p) => p.remaining > 0)) {
      let executed = false;

      for (const process of queue) {
          if (process.remaining > 0 && process.arrivalTime <= currentTime) {
              const executionTime = Math.min(process.remaining, quantum);
              timeline.push({ pid: process.process, startTime: currentTime, duration: executionTime });

              process.remaining -= executionTime;
              currentTime += executionTime;

              if (process.remaining === 0) {
                  process.completionTime = currentTime;
                  process.turnaroundTime = process.completionTime - process.arrivalTime;
                  process.waitingTime = process.turnaroundTime - process.burstTime;
              }

              executed = true;
          }
      }

      if (!executed) {
          currentTime++;
      }
  }

  return [processes, timeline];
}

function priorityScheduling(processes) {
  let currentTime = 0;
  const completed = [];
  const timeline = [];

  while (completed.length < processes.length) {
      const readyQueue = processes.filter(
          (p) => p.arrivalTime <= currentTime && !completed.includes(p)
      );

      if (readyQueue.length === 0) {
          currentTime++;
          continue;
      }

      readyQueue.sort((a, b) => a.priority - b.priority);
      const process = readyQueue[0];

      timeline.push({ pid: process.process, startTime: currentTime, duration: process.burstTime });

      process.completionTime = currentTime + process.burstTime;
      process.turnaroundTime = process.completionTime - process.arrivalTime;
      process.waitingTime = process.turnaroundTime - process.burstTime;

      currentTime = process.completionTime;
      completed.push(process);
  }

  return [processes, timeline];
}

function displayResults(processes) {
  const rows = document.querySelectorAll(".table tr");

  processes.forEach((process, index) => {
      const row = rows[index + 1];
      if (row) {
          row.querySelector(".completion-time").textContent = process.completionTime;
          row.querySelector(".turnaround-time").textContent = process.turnaroundTime;
          row.querySelector(".waiting-time").textContent = process.waitingTime;
      }
  });
}

function drawGanttChart(timeline) {
  const ganttChart = document.getElementById("ganttChart");
  ganttChart.innerHTML = ""; // Clear previous Gantt Chart

  let currentTime = timeline.length > 0 ? timeline[0].startTime : 0; // Start at the first process's arrival time

  // Add the initial time label
  const initialTimeLabel = document.createElement("div");
  initialTimeLabel.className = "gantt-time";
  initialTimeLabel.textContent = currentTime;
  ganttChart.appendChild(initialTimeLabel);

  timeline.forEach((entry) => {
      // Create a block for the process
      const block = document.createElement("div");
      block.className = "gantt-block";
      block.textContent = entry.pid; // Display process ID
      ganttChart.appendChild(block);

      // Update the current time
      currentTime += entry.duration;

      // Create a time label after the block
      const timeLabel = document.createElement("div");
      timeLabel.className = "gantt-time";
      timeLabel.textContent = currentTime;
      ganttChart.appendChild(timeLabel);
  });
}

function calculate() {
  const algorithm = document.getElementById("algorithm").value;
  const quantum = parseInt(document.getElementById("quantum").value) || 1;
  const processes = getProcessData();

  let results = [];
  let timeline = [];

  switch (algorithm) {
      case "fifo":
          [results, timeline] = fifo(processes);
          break;
      case "sjf":
          [results, timeline] = sjf(processes);
          break;
      case "rr":
          [results, timeline] = roundRobin(processes, quantum);
          break;
      case "priority":
          [results, timeline] = priorityScheduling(processes);
          break;
  }

  displayResults(results);
  drawGanttChart(timeline);
}