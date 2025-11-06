import express from "express";
import cors from "cors";
import { SerialPort } from "serialport";

const app = express();
app.use(cors());
app.use(express.json());

// Change COM5 to your board’s port
const port = new SerialPort({ path: "COM5", baudRate: 9600 });

app.post("/servo/:id/:angle", (req, res) => {
  const { id, angle } = req.params;
  const command = `${id} ${angle}\n`;
  port.write(command);
  console.log("Sent to Arduino:", command);
  res.send(`Sent to Arduino: ${command}`);
});

app.listen(3001, () => console.log("✅ Server running on http://localhost:3001"));
