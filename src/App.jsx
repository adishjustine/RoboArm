import { useState } from "react";

export default function App() {
  const [port, setPort] = useState(null);
  const [angles, setAngles] = useState(Array(6).fill(90));

  const connectSerial = async () => {
    try {
      const p = await navigator.serial.requestPort();
      await p.open({ baudRate: 9600 });
      setPort(p);
      alert("✅ Connected to Arduino");
    } catch (err) {
      alert("❌ Connection failed: " + err.message);
    }
  };

  const sendServoCommand = async (index, value) => {
  try {
    await fetch(`http://localhost:3001/servo/${index + 1}/${value}`, {
      method: "POST",
    });
  } catch (err) {
    console.error("Failed to send command:", err);
  }
};

  const handleChange = (i, val) => {
    const newAngles = [...angles];
    newAngles[i] = val;
    setAngles(newAngles);
    sendServoCommand(i, val);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">🤖 Robotic Arm Controller</h1>

      {!port ? (
        <button
          onClick={connectSerial}
          className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-lg font-semibold"
        >
          Connect to Arduino
        </button>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
          {angles.map((angle, i) => (
            <div
              key={i}
              className="bg-gray-800 rounded-2xl p-4 flex flex-col items-center shadow-lg"
            >
              <h2 className="text-lg font-semibold mb-2">
                Servo {i + 1}: {angle}°
              </h2>
              <input
                type="range"
                min="0"
                max="180"
                value={angle}
                onChange={(e) => handleChange(i, parseInt(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
