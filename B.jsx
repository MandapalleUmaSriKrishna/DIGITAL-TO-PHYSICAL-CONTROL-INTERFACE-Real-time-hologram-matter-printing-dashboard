import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, Zap, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui';

export default function HologramSimulator() {
  const canvasRef = useRef(null);
  const [isRunning, setIsRunning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [brightness, setBrightness] = useState(80);
  const [hapticIntensity, setHapticIntensity] = useState(50);
  const [frequency, setFrequency] = useState(24);
  const [temperature, setTemperature] = useState(35);
  const [mode, setMode] = useState('static');
  const animationRef = useRef(null);

  // Simulate hologram animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let frameCount = 0;

    const drawHologram = () => {
      // Clear canvas
      ctx.fillStyle = '#0a0e27';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid background
      ctx.strokeStyle = 'rgba(0, 200, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 20) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // Draw hologram (3D human figure silhouette with scanning effect)
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseScale = scale * 60;

      // Body outline
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotation * Math.PI) / 180);

      // Blue glow effect (hologram characteristic)
      const glowAlpha = 0.3 + 0.2 * Math.sin(frameCount * 0.05);
      ctx.fillStyle = `rgba(0, 200, 255, ${glowAlpha})`;
      ctx.beginPath();
      ctx.arc(0, 0, baseScale * 1.3, 0, Math.PI * 2);
      ctx.fill();

      // Main hologram body
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, baseScale);
      gradient.addColorStop(0, `rgba(0, 255, 200, ${brightness / 100})`);
      gradient.addColorStop(0.5, `rgba(0, 200, 255, ${brightness / 100 * 0.6})`);
      gradient.addColorStop(1, `rgba(0, 100, 255, ${brightness / 100 * 0.2})`);

      // Head
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, -baseScale * 0.6, baseScale * 0.25, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillRect(-baseScale * 0.2, -baseScale * 0.3, baseScale * 0.4, baseScale * 0.5);

      // Arms
      ctx.beginPath();
      ctx.arc(-baseScale * 0.35, -baseScale * 0.1, baseScale * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(baseScale * 0.35, -baseScale * 0.1, baseScale * 0.12, 0, Math.PI * 2);
      ctx.fill();

      // Legs
      ctx.fillRect(-baseScale * 0.15, baseScale * 0.2, baseScale * 0.1, baseScale * 0.4);
      ctx.fillRect(baseScale * 0.05, baseScale * 0.2, baseScale * 0.1, baseScale * 0.4);

      // Scanning lines effect
      if (mode === 'dynamic') {
        ctx.strokeStyle = `rgba(0, 255, 150, ${0.5 + 0.3 * Math.sin(frameCount * 0.1)})`;
        ctx.lineWidth = 2;
        const scanPos = (frameCount % 100) / 100 * baseScale - baseScale * 0.5;
        ctx.beginPath();
        ctx.moveTo(-baseScale * 0.5, scanPos);
        ctx.lineTo(baseScale * 0.5, scanPos);
        ctx.stroke();
      }

      // Haptic feedback visualization (force field)
      if (hapticIntensity > 20) {
        ctx.strokeStyle = `rgba(255, 100, 0, ${(hapticIntensity / 100) * 0.4})`;
        ctx.lineWidth = 2;
        const pulses = Math.floor(hapticIntensity / 20);
        for (let i = 1; i <= pulses; i++) {
          const radius = (baseScale * i) / pulses + (frameCount % 10) * 2;
          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      ctx.restore();

      // Draw emitter points
      ctx.fillStyle = 'rgba(255, 200, 0, 0.6)';
      for (let i = 0; i < 16; i++) {
        const angle = (i / 16) * Math.PI * 2;
        const x = centerX + Math.cos(angle) * 150;
        const y = centerY + Math.sin(angle) * 150;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
      }

      frameCount++;
    };

    const animate = () => {
      drawHologram();
      animationRef.current = requestAnimationFrame(animate);
    };

    if (isRunning) {
      animate();
    } else {
      drawHologram();
    }

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isRunning, rotation, scale, brightness, hapticIntensity, mode]);

  // Simulate temperature changes based on activity
  useEffect(() => {
    if (isRunning) {
      const tempInterval = setInterval(() => {
        setTemperature(prev => Math.min(prev + 0.5, 55));
      }, 1000);
      return () => clearInterval(tempInterval);
    } else {
      const tempInterval = setInterval(() => {
        setTemperature(prev => Math.max(prev - 0.2, 25));
      }, 1000);
      return () => clearInterval(tempInterval);
    }
  }, [isRunning]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-2">Interactive Touchable Hologram System</h1>
        <p className="text-gray-300 mb-6">Real-time 3D hologram simulator with haptic feedback</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Hologram Display */}
          <div className="lg:col-span-2">
            <Card className="bg-slate-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-cyan-400">Hologram Projection</CardTitle>
              </CardHeader>
              <CardContent>
                <canvas
                  ref={canvasRef}
                  width={600}
                  height={500}
                  className="w-full border border-cyan-500/50 rounded-lg bg-slate-950"
                />
              </CardContent>
            </Card>
          </div>

          {/* Control Panel */}
          <div className="space-y-4">
            {/* Playback Controls */}
            <Card className="bg-slate-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-400">Playback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white px-3 py-2 rounded flex items-center justify-center gap-2 transition"
                  >
                    {isRunning ? <Pause size={16} /> : <Play size={16} />}
                    {isRunning ? 'Pause' : 'Play'}
                  </button>
                  <button
                    onClick={() => setRotation(0)}
                    className="flex-1 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded flex items-center justify-center gap-2 transition"
                  >
                    <RotateCcw size={16} />
                    Reset
                  </button>
                </div>

                <div>
                  <label className="text-xs text-cyan-300 block mb-2">Mode</label>
                  <select
                    value={mode}
                    onChange={(e) => setMode(e.target.value)}
                    className="w-full bg-slate-800 border border-cyan-500/30 text-white px-2 py-1 rounded text-sm"
                  >
                    <option value="static">Static</option>
                    <option value="dynamic">Dynamic Scan</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Hologram Controls */}
            <Card className="bg-slate-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-400">Hologram</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-cyan-300 block mb-1">Rotation: {rotation}°</label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={rotation}
                    onChange={(e) => setRotation(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-300 block mb-1">Scale: {scale.toFixed(1)}x</label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-300 block mb-1">Brightness: {brightness}%</label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={brightness}
                    onChange={(e) => setBrightness(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Haptic & RF Controls */}
            <Card className="bg-slate-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-400">Systems</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="text-xs text-cyan-300 block mb-1 flex items-center gap-2">
                    <Zap size={14} /> Haptic: {hapticIntensity}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={hapticIntensity}
                    onChange={(e) => setHapticIntensity(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-300 block mb-1 flex items-center gap-2">
                    <Volume2 size={14} /> RF Freq: {frequency} GHz
                  </label>
                  <input
                    type="range"
                    min="2.4"
                    max="60"
                    step="0.1"
                    value={frequency}
                    onChange={(e) => setFrequency(Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-xs text-cyan-300 block mb-1 flex items-center gap-2">
                    <Thermometer size={14} /> Temp: {temperature.toFixed(1)}°C
                  </label>
                  <div className="bg-slate-800 rounded px-2 py-1 text-xs">
                    <div className="w-full bg-slate-700 rounded h-1.5 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          temperature > 50 ? 'bg-red-500' : temperature > 40 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${((temperature - 25) / 35) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-slate-900 border-cyan-500/30">
              <CardHeader>
                <CardTitle className="text-sm text-cyan-400">Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">System:</span>
                  <span className={isRunning ? 'text-green-400' : 'text-gray-400'}>
                    {isRunning ? 'Active' : 'Standby'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Resolution:</span>
                  <span className="text-cyan-400">0.1 mm Voxels</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Refresh Rate:</span>
                  <span className="text-cyan-400">120 Hz</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Emitters:</span>
                  <span className="text-cyan-400">16 Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Power:</span>
                  <span className="text-cyan-400">1.2 kW</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 p-4 bg-slate-900 border border-cyan-500/30 rounded-lg">
          <p className="text-xs text-gray-400">
            This simulator demonstrates core hologram projection concepts. Adjust rotation, scale, brightness, haptic feedback, and RF frequency in real-time. The system maintains temperature monitoring and displays active emitter array configuration with 0.1 mm voxel resolution at 120 Hz refresh rate.
          </p>
        </div>
      </div>
    </div>
  );
}A
