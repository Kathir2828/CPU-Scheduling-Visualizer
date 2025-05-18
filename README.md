This project is a web-based tool for visualizing and simulating various CPU scheduling algorithms. It allows users to input process data and see how different scheduling strategies affect process execution, completion, turnaround, and waiting times. The tool also displays a Gantt chart for better understanding of process scheduling.

## Features

- **Supported Algorithms:**
  - First In First Out (FIFO)
  - Shortest Job First (SJF)
  - Round Robin (with configurable quantum)
  - Priority Scheduling

- **Interactive Table:**  
  Enter arrival time, burst time, and priority for up to 7 processes (P0–P6).

- **Gantt Chart:**  
  Visual representation of process execution order and timing.

- **Automatic Calculation:**  
  Calculates completion, turnaround, and waiting times for each process.

## Getting Started

1. **Clone or Download the Repository**

2. **Open `index.html` in your web browser**

   No server or build tools are required.

## Usage

1. Select a scheduling algorithm from the dropdown.
2. (For Round Robin) Enter the quantum time.
3. Fill in the arrival time, burst time, and priority for each process (leave unused rows blank or with burst time 0).
4. Click the **Calculate** button.
5. View the results in the table and the Gantt chart below.

## File Structure

- `index.html` – Main HTML file with the user interface.
- `style.css` – Styles for the page and Gantt chart.
- `app.js` – JavaScript logic for scheduling algorithms and visualization.

## Customization

- You can adjust the number of processes by editing the table rows in `index.html`.
- To change the form background color, edit the `.form` class in `style.css`.

## License

This project is for educational purposes.

---

**Created by:** [Kathir srivathsan S]
