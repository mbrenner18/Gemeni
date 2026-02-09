import React, { useState, useEffect, useRef } from 'react';
import Layout from './components/Layout.tsx';
import Mascot from './components/Mascot.tsx';
import QuadrantUI from './components/QuadrantUI.tsx';
import PlantPassport from './components/PlantPassport.tsx';
import { AppState, PlantAnalysis, UserStats, HistoryItem, SpaceAnalysis, SpaceHotSpot, ChatEntry } from './types.ts';
import { analyzePlantImage, analyzeSpace, askMeLapAboutSpace, mockPlantAnalysis, mockSpaceAnalysis } from './services/geminiService.ts';

const MISSIONS = [
  { id: 'single', title: 'Grow a Plant', durationDays: 7, description: 'Care for one specimen.' },
  { id: 'home', title: 'Mini Home Garden', durationDays: 21, description: 'Maintain multiple plants.' },
  { id: 'yard', title: 'Backyard Garden', durationDays: 60, description: 'Long-term ecosystem stewardship.' },
];

type MediaKind = 'image' | 'video' | null;

const ALOE_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/999beefaeb31c8dc64402ab4f974039b727387fa/aloe.png';
const VINE_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/c08f5280e6c7c8cee9ba06cdc056582405c73c1f/vine.png';
const SUNFLOWER_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/999beefaeb31c8dc64402ab4f974039b727387fa/sunflower.png';
const SPLASH_VIDEO_URL = 'https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/main/SplashIntro.mp4';

const MASCOT_MOODS = {
  HAPPY: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Happy.png",
  THINKING: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Thinking.png",
  SUCCESS: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Success.png",
  LISTENING: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Listening.png",
  ERROR: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/Martian_Error.png",
  ORIGINAL: "https://raw.githubusercontent.com/mbrenner18/plate-bestie-assets/018c442ea2d2507ecc6386d1c0edb27c0f783c28/mascot.png"
};

const getMascot = (mood: string) => (MASCOT_MOODS as any)[mood?.toUpperCase()] || MASCOT_MOODS.ORIGINAL;

const MARTIAN_MEMORIES = [
  "Glorp! This reminds me of cuddling wooly mammoths back on Mars.",
  "Data sync complete. Almost as smooth as Martian dust-surfing.",
  "Success! I haven't felt this useful since the great Bio-Dome repair of '88.",
  "Research logged. My ancestor, Lap-Bot 4, would be proud!",
  "Intriguing. This Earth-specimen has more turgor pressure than a Martian glacier-berry."
];

const DEFAULT_HISTORY: HistoryItem[] = [
  {
    id: 'default-aloe',
    name: 'Purifier Unit (Aloe Vera)',
    date: 'EARTH-ARRIVAL',
    image: ALOE_URL,
    type: 'plant',
    chatHistory: [],
    analysis: {
      name: 'Purifier Unit (Aloe Vera)',
      intro: "Glorp! A structural bio-unit with high-efficiency carbon sequestration detected.",
      sun: { 
        level: "Direct", 
        requirement: "Requires photon density of 600-800 μmol/m²/s for optimal mucilage synthesis." 
      },
      seed: { stage: "Vegetative (Succulent Maturation)" },
      soil: { 
        quality: "Mineral-heavy arid substrate with low NPK ratios.", 
        ph: "7.2 (Ideal for micronutrient bioavailability)" 
      },
      water: { status: "High Turgor Pressure / Low Transpiration Rate" },
      missionLog: 'Critical asset for Martian atmospheric detox. Synthesis of acemannan is at 98% efficiency.',
      interestPoint: { 
        x: 52, y: 48, 
        label: "Parenchyma Storage", 
        explanation: "Centralized water-storing tissue optimized for long-duration drought resistance." 
      }
    }
  },
  {
    id: 'default-vine',
    name: 'Structural Bio-Mesh (Hedera)',
    date: 'EARTH-ARRIVAL',
    image: VINE_URL,
    type: 'space',
    chatHistory: [],
    analysis: {
      summary: "Organic scaffolding detected. Specimen is utilizing adventitious rootlets for vertical habitat colonization. High potential for air filtration and thermal insulation within Martian corridors.",
      hotSpots: [
        { 
          x: 35, 
          y: 45, 
          label: "Tensile Vertex", 
          severity: 2, 
          reasoning: "High-density cellulose weaving identified here. This region provides the primary structural anchor for the vertical mesh.", 
          recommendedPlant: "Additional Vine Support" 
        },
        { 
          x: 65, 
          y: 30, 
          label: "Gas Exchange Zone", 
          severity: 1, 
          reasoning: "Concentrated leaf surface area suggests maximum VOC absorption and oxygen output in this quadrant.", 
          recommendedPlant: "Fern Overlay" 
        }
      ]
    } as SpaceAnalysis
  },
  {
    id: 'default-sunflower',
    name: 'Solar Harvester (Helianthus)',
    date: 'EARTH-ARRIVAL',
    image: SUNFLOWER_URL,
    type: 'plant',
    chatHistory: [],
    analysis: {
      name: 'Solar Harvester (Helianthus)',
      intro: "A biological solar array, bestie! Calibrating for maximum heliotropic alignment.",
      sun: { 
        level: "Direct", 
        requirement: "Intense PAR exposure (8h+) required to sustain large-scale inflorescence." 
      },
      seed: { stage: "Inflorescence / Seed Maturation" },
      soil: { 
        quality: "Rich loam with high nitrogen demand for stem elongation.", 
        ph: "6.5 (Standard terrestrial acidity)" 
      },
      water: { status: "Saturated (High Hydraulic Conductance)" },
      missionLog: 'Bio-fuel potential confirmed. Specimen is generating surplus lipids for colony energy banks.',
      interestPoint: { 
        x: 48, y: 25, 
        label: "Heliotropic Core", 
        explanation: "Region of intense phototropism that tracks the sun across the Martian sky." 
      }
    }
  }
];

const SplashView: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const [videoFinished, setVideoFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVideoFinished(true);
    }, 8000); 
    return () => clearTimeout(timer);
  }, []);

  const handleEnd = () => setVideoFinished(true);

  return (
    <div className="fixed inset-0 z-[999] bg-white flex flex-col items-center justify-center overflow-hidden max-w-[100vw] max-h-[100vh]">
      {!videoFinished ? (
        <>
          <video
            src={SPLASH_VIDEO_URL}
            autoPlay
            muted
            playsInline
            onEnded={handleEnd}
            className="w-full h-full object-contain bg-white"
          />
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
            
          </div>
          <button
            onClick={handleEnd}
            className="absolute bottom-8 right-8 bg-black/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-black px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest bouncy z-[1000] shadow-2xl transition-all"
          >
            Skip Intro
          </button>
        </>
      ) : (
        <div className="flex flex-col items-center gap-6 p-10 animate-in zoom-in fade-in duration-700 bg-white w-full h-full justify-center">
           <Mascot size="xxl" src={getMascot('ORIGINAL')} mood="original" className="mb-4" />
           <div className="text-center space-y-3">
             <h1 className="text-orange-400 text-4xl font-black animate-pulse">Plate Bestie</h1>
             <h1 className="text-slate-900 text-xl font-black uppercase tracking-tighter">Your Farm-To-Table tool from Mars!</h1>        
           </div>
           <button
            onClick={onComplete}
            className="bg-orange-600 hover:bg-orange-500 text-white px-12 py-5 rounded-[2.5rem] text-xl font-black uppercase tracking-widest bouncy shadow-[0_0_40px_rgba(234,88,12,0.4)] border-b-8 border-orange-800 active:border-b-2 active:translate-y-1 transition-all"
          >
            Start Mission
          </button>
        </div>
      )}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 0.8; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [activeState, setActiveState] = useState<AppState>(AppState.HOME);
  const [stats, setStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('userStats');
    return saved ? JSON.parse(saved) : { xp: 480, coins: 120, streak: 3 };
  });

  const [plantHistory, setPlantHistory] = useState<HistoryItem[]>(() => {
    const saved = localStorage.getItem('plantHistory');
    return saved ? JSON.parse(saved) : DEFAULT_HISTORY;
  });

  // 🥋 The Multimodal Payload
  const [stagedMedia, setStagedMedia] = useState<{url: string, kind: 'image' | 'video'}[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [stagedIntent, setStagedIntent] = useState<string[]>([]);
  const [tempAudioUrl, setTempAudioUrl] = useState<string | null>(null);
  const [isVisorTextOpen, setIsVisorTextOpen] = useState(false);
  const [visorTextCommand, setVisorTextCommand] = useState("");

  const [analysis, setAnalysis] = useState<PlantAnalysis | null>(null);
  const [pendingMediaKind, setPendingMediaKind] = useState<MediaKind>(null);
  const [activeMission, setActiveMission] = useState<typeof MISSIONS[0] | null>(null);
  const [userCorrection, setUserCorrection] = useState<string | null>(null);
  const [spaceAnalysis, setSpaceAnalysis] = useState<SpaceAnalysis | null>(null);
  const [selectedHotSpot, setSelectedHotSpot] = useState<SpaceHotSpot | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [pendingMedia, setPendingMedia] = useState<string | null>(null);
  const [userIntent, setUserIntent] = useState<string>("");
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [chatMessage, setChatMessage] = useState("");
  const [chatResponse, setChatResponse] = useState<string | null>(null);
  const [isChatting, setIsChatting] = useState(false);
  const [currentMode, setCurrentMode] = useState<'plant' | 'space'>('plant');
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [showPassport, setShowPassport] = useState(false);
  const [fromHistory, setFromHistory] = useState(false);
  const [showInterestPointTooltip, setShowInterestPointTooltip] = useState(false);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | null>(null);

  // Missions
  const [activeMissionId, setActiveMissionId] = useState('home'); 
  const [missionProgress, setMissionProgress] = useState(0);
  
  // Camera state
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    localStorage.setItem('plantHistory', JSON.stringify(plantHistory));
  }, [plantHistory]);

  useEffect(() => {
    localStorage.setItem('userStats', JSON.stringify(stats));
  }, [stats]);

  // 🥋 CAMERA MANAGEMENT -
useEffect(() => {
  const isScanState = activeState === AppState.SCAN || activeState === AppState.SPACE_SCAN;
  const isAnalyzing = activeState === AppState.ANALYZING;
  
  // 🥋 If we are in a scan state and the stream exists, attach it
  if (isScanState && streamRef.current) {
    if (videoRef.current && videoRef.current.srcObject !== streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play()
        .then(() => setIsCameraActive(true))
        .catch(e => console.error("Playback failed:", e));
    }
  } 
  // 🥋 CRITICAL FIX: Ensure sensors don't power down during Analysis
  else if (!isScanState && !isAnalyzing) {
    // Only stop if we aren't in a state that needs the camera (like HOME or SETTINGS)
    if (isCameraActive) {
      stopCamera(); 
    }
  }
}, [activeState, isInitializing, isCameraActive]); // 🥋 Added isCameraActive to triggers

const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    if (isInitializing) return;
    setCameraError(null);

    // 🥋 BYPASS: If camera is already live in the background, just show it
    if (streamRef.current && streamRef.current.active) {
      if (videoRef.current) {
        videoRef.current.srcObject = streamRef.current;
        setIsCameraActive(true);
      }
      return;
    }

    const constraints = {
      video: { 
        facingMode: { ideal: mode },
        width: { ideal: 1280 }, 
        height: { ideal: 720 } 
      },
      audio: false 
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream; 
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = async () => {
          try {
            await videoRef.current?.play();
            setIsCameraActive(true);
            setFacingMode(mode);
          } catch (playErr) {
            console.error("Mobile play blocked:", playErr);
          }
        };
      }
    } catch (err: any) {
      console.warn("Standard constraints failed, trying fallback:", err);
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        streamRef.current = fallbackStream;
        setIsCameraActive(true);
      } catch (finalErr: any) {
        setCameraError("Xeno-Vision sensors offline.");
      }
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    console.log("Xeno-Vision sensors powered down.");
  };

  const handleInitializeSensors = async () => {
    if (isInitializing) return;

    // 1. HARD RESET: Kill any existing zombie streams
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    setIsInitializing(true);
    setCameraError(null);
    setIsVisorTextOpen(false); 

    speak("Resetting sensor array. Re-establishing Martian uplink.");

    try {
      // 2. FRESH HANDSHAKE: Requesting with simpler constraints to avoid "Restricted" errors
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }, 
        audio: true 
      });
      
      streamRef.current = stream;

      // 3. ATTACH TO VIDEO ELEMENT IMMEDIATELY
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      setIsCameraActive(true);
      setActiveState(AppState.SCAN);
      speak("Sensors online. Systems nominal.");
    } catch (err: any) {
      console.error("Sensor Sync Failed:", err);
      
      // 🚑 EMERGENCY FALLBACK: Video only, no audio
      try {
        const videoOnly = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = videoOnly;
        if (videoRef.current) videoRef.current.srcObject = videoOnly;
        setIsCameraActive(true);
        setActiveState(AppState.SCAN);
        speak("Visual uplink established. Audio sensors remain offline.");
      } catch (finalErr) {
        setCameraError("Hardware restricted. Check browser permissions.");
        speak("Hardware restricted. Manual override required.");
      }
    } finally {
      setIsInitializing(false);
    }
  };

  const toggleCameraPower = async () => {
  if (isCameraActive) {
    // 🛑 POWER DOWN
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
    if (navigator.vibrate) navigator.vibrate([10, 30]); // Low-power haptic
    speak("Optical sensors offline.");
  } else {
    // 🔋 POWER UP
    // We hardcode 'environment' because we only want the back camera for the demo
    await startCamera('environment'); 
    speak("Sensors online.");
  }
};

  const captureSnapshot = () => {
  // 🥋 THE GUARD: Check if we already have 3 items staged
  if (stagedMedia.length >= 3) {
    speak("Camera Capture buffer full. Please analyze current samples or clear logs.");
    return;
  }

  if (!videoRef.current || !canvasRef.current || !isCameraActive) return;
  
  const video = videoRef.current;
  const canvas = canvasRef.current;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL('image/jpeg');

    // 🥋 The same logic as before, just protected by the guard above
    setStagedMedia(prev => [...prev, { url: dataUrl, kind: 'image' }]);
    
    setPendingMedia(dataUrl);
    setPendingMediaKind('image');
    
    speak("Visual specimen logged.");
  }
};

  const recordVideoSnippet = () => {
    if (!streamRef.current) return;
    
    const chunks: Blob[] = [];
    const recorder = new MediaRecorder(streamRef.current);
    mediaRecorderRef.current = recorder;
    
    recorder.ondataavailable = (e) => chunks.push(e.data);

    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/mp4' });
      const reader = new FileReader();

      reader.onload = (e) => {
        const videoDataUrl = e.target?.result as string;

        // 🥋 THE STACKING FIX: 
        // We push the video into the array so it doesn't delete your photos.
        setStagedMedia(prev => [...prev, { url: videoDataUrl, kind: 'video' }]);
        
        // Optional: Keep these for any UI that still looks at a single 'pending' item
        setPendingMedia(videoDataUrl);
        setPendingMediaKind('video');
      };

      reader.readAsDataURL(blob);
      speak("Motion data logged to the mission payload. Analysis buffer updated.");
    };

    recorder.start();
    setIsRecording(true);
    speak("Recording Martian environment for three seconds.");

    setTimeout(() => {
      if (recorder.state !== 'inactive') {
        recorder.stop();
        setIsRecording(false);
      }
    }, 3000); // 🥋 THE TIMER: Exactly 3 seconds
  };

  const speak = (text: string) => {
    if (!audioEnabled || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.4;
    utterance.rate = 1.1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (chatResponse) speak(chatResponse);
  }, [chatResponse]);

  useEffect(() => {
    if (analysis?.intro) speak(analysis.intro);
    else if (analysis?.missionLog) speak(analysis.missionLog);
  }, [analysis]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onloadend = () => {
    const url = reader.result as string;
    
    // 1. Stage the media (Specimen is now "in the lab")
    setStagedMedia([{ 
      url, 
      kind: 'image' 
    }]);
    
    // 2. Set the captured image so it appears in your viewfinder
    setCapturedImage(url); 
    
    // 3. Switch to the scan view so the judge sees the upload worked
    setActiveState(AppState.SPACE_SCAN);

    // 4. Update the UI narrative
    speak("External specimen packet received. Awaiting mission brief.");
    
    // This allows the user to record voice or review before starting AI
  };
  reader.readAsDataURL(file);
};

  const submitVisorTextCommand = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const text = visorTextCommand.trim();
    if (!text) return;

    setStagedIntent(prev => [...prev, text]);
    setVisorTextCommand("");
    setIsVisorTextOpen(false);
    
    setTempAudioUrl(null); // 🥋 ADD THIS LINE ONLY to the existing one
    
    speak("Instruction logged to mission buffer.");
};

 const startListening = async () => {
  // 1. KILL THE CAMERA (The "Drop" phase)
  if (streamRef.current) {
    streamRef.current.getTracks().forEach(track => track.stop());
    streamRef.current = null;
    setIsCameraActive(false); 
    console.log("Releasing hardware...");
  }

  // 2. THE LAZY DELAY (350ms is the sweet spot for Android)
  // This gives the OS just enough time to realize the mic is free.
  await new Promise(resolve => setTimeout(resolve, 350));

  // 3. START THE MIC (The "Pickup" phase)
  const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).Recognition;
  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();
  
  recognition.onstart = () => {
    setIsListening(true);
    if (navigator.vibrate) navigator.vibrate(50); // Haptic confirmation
  };

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    setStagedIntent(prev => [...prev, transcript]);
    speak(`Logged: ${transcript}`);
  };

  recognition.onend = () => setIsListening(false);
  recognition.onerror = () => setIsListening(false);

  try {
    recognition.start();
  } catch (e) {
    console.error("Mic retry failed:", e);
  }
};

  const handleSendChat = async (forcedMessage?: string) => {
    const msg = forcedMessage || chatMessage;
    if (!msg.trim() || !currentHistoryId) return;
    
    // 1. Find the current specimen in history
    const currentSpecimen = plantHistory.find(p => p.id === currentHistoryId);
    if (!currentSpecimen) return;

    setIsChatting(true);
    
    // 2. Optimistic Update: Show the user's message immediately
    const userEntry = { role: 'user', text: msg };
    setPlantHistory(prev => prev.map(item => 
      item.id === currentHistoryId 
        ? { ...item, chatHistory: [...(item.chatHistory || []), userEntry] }
        : item
    ));

    try {
      let response;
      if (currentSpecimen.type === 'plant') {
        // 🥋 NEW: Add a plant-specific chat service call here if you have one, 
        // or use the Space one as a generic fallback for the hackathon
        response = await askMeLapAboutSpace(currentSpecimen.image, `Context: ${currentSpecimen.name}. User says: ${msg}`);
      } else {
        response = await askMeLapAboutSpace(currentSpecimen.image, msg);
      }

      const aiEntry = { role: 'model', text: response };

      // 3. Persistent Save: Add Gemini's response to the history
      setPlantHistory(prev => prev.map(item => 
        item.id === currentHistoryId 
          ? { ...item, chatHistory: [...(item.chatHistory || []), aiEntry] }
          : item
      ));

      setChatResponse(response);
      setChatMessage("");
    } catch (e) {
      console.error("Chat failure:", e);
      setChatResponse("Subspace interference interrupted our bestie-chat.");
    } finally {
      setIsChatting(false);
    }
  };

   const [isProcessing, setIsProcessing] = useState(false); // 🥋 Add this at the top of your component

const processAnalysis = async (useFallback = false) => {
  // 1. Safety Checks (Prevention)
  if (isProcessing) return; 
  if (stagedMedia.length === 0 && stagedIntent.length === 0) {
    speak("No mission data found. Please capture a specimen or record intent.");
    return;
  }

  setIsProcessing(true);
  setActiveState(AppState.ANALYZING);
  const masterInstruction = stagedIntent.join('. ') || "Analyze this specimen.";

  try {
    let result;
    if (currentMode === 'plant') {
      // 🥋 ROUTE TO PLANT API
      result = useFallback 
        ? await mockPlantAnalysis(masterInstruction) 
        : await analyzePlantImage(stagedMedia, stagedIntent);

      setAnalysis(result);
      setUserCorrection(result.missionLog || result.intro || '');
      
      // 🥋 UPDATE STATS (Keep your XP/Coins!)
      setStats(prev => ({ ...prev, xp: prev.xp + 50, coins: prev.coins + 10 }));
      
      // 🥋 MISSION PROGRESS
      setMissionProgress(prev => {
        const next = Math.min(prev + 34, 100);
        if (next >= 100 && prev < 100) {
          speak("Mission objective met. Martian stewardship level increased.");
        }
        return next;
      });

      // 🥋 SAVE TO HISTORY
      const newId = Date.now().toString();
      setCurrentHistoryId(newId);
      setPlantHistory(prev => [{
        id: newId,
        type: 'plant',
        name: result.name || "New Specimen",
        image: stagedMedia[0]?.url || ALOE_URL,
        date: new Date().toLocaleDateString(),
        analysis: result,
        chatHistory: []
      }, ...prev]);

      setActiveState(AppState.GARDEN);
      if (result.intro) speak(result.intro);

    } else {
      // 🥋 ROUTE TO SPACE API
      result = useFallback 
        ? await mockSpaceAnalysis() 
        : await analyzeSpace(stagedMedia, stagedIntent);
      
      setSpaceAnalysis(result);
      setStats(prev => ({ ...prev, xp: prev.xp + 100, coins: prev.coins + 20 }));

      setMissionProgress(prev => {
        const next = Math.min(prev + 34, 100);
        if (next >= 100 && prev < 100) speak("Spatial protocol complete.");
        return next;
      });

      const newId = Date.now().toString();
      setCurrentHistoryId(newId);
      setPlantHistory(prev => [{
        id: newId,
        type: 'space',
        name: "Habitat Analysis",
        image: stagedMedia[0]?.url || VINE_URL,
        date: new Date().toLocaleDateString(),
        analysis: result,
        chatHistory: []
      }, ...prev]);

      setActiveState(AppState.SPACE_RESULTS);
      speak("Spatial scan complete.");
    }

    // 🥋 CLEANUP ON SUCCESS
    setStagedMedia([]);
    setStagedIntent([]);
    stopCamera();

  } catch (error) {
    console.error("Analysis failed:", error);
    
    // 🥋 THE SAFETY NET: If API fails, try one more time with MOCK data automatically
    if (!useFallback) {
      return processAnalysis(true); 
    }

    // If even the fallback fails, return home gracefully
    speak("Transmission failed. Re-initiating uplink protocol.");
    setActiveState(AppState.HOME);
    stopCamera();
  } finally {
    setIsProcessing(false); // 🥋 IMPORTANT: Always unlock the button
  }
};

  const startVoiceCommand = async () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      speak("Voice sensors offline, bestie.");
      setIsVisorTextOpen(true);
      return;
    }

    speak("Initializing link. Stand by.");

    // Wait for the mascot to finish speaking before opening the mic
    setTimeout(async () => {
      try {
        // 1. Play System Beep
        const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
        const beepContext = new AudioCtx();
        const osc = beepContext.createOscillator();
        const gain = beepContext.createGain();
        osc.connect(gain); gain.connect(beepContext.destination);
        osc.frequency.value = 880;
        gain.gain.exponentialRampToValueAtTime(0.0001, beepContext.currentTime + 0.5);
        osc.start(); osc.stop(beepContext.currentTime + 0.5);

        // 2. Setup Recording & Recognition
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        const recognition = new SpeechRecognition();
        const audioChunks: Blob[] = [];

        recognition.lang = 'en-US';

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) audioChunks.push(e.data);
        };
        
        mediaRecorder.onstop = () => {
          const url = URL.createObjectURL(new Blob(audioChunks, { type: 'audio/wav' }));
          setTempAudioUrl(url); // 🥋 This makes it "Playable"
        };

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          // 🥋 Fill the box so user can verify. Do NOT push to stagedIntent here!
          setVisorTextCommand(transcript);
          setIsVisorTextOpen(true);
          
          if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        };

        recognition.onerror = () => {
          if (mediaRecorder.state !== "inactive") mediaRecorder.stop();
          stream.getTracks().forEach(track => track.stop());
        };

        recognition.start();
        mediaRecorder.start();
      } catch (err) {
        console.error("Mic access denied", err);
      }
    }, 1800); 
  };

  const deleteHistoryItem = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPlantHistory(prev => prev.filter(item => item.id !== id));
    speak("Mission log expunged from memory banks, bestie.");
  };

  const renderHome = () => (
  <div className="flex flex-col h-full bg-white px-6 py-4 justify-center overflow-hidden">
    <div className="bg-white w-full flex flex-col items-center justify-center rounded-[2.5rem] p-6 relative shadow-lg border-4 border-slate-100 flex-1 min-h-0">
      
      {/* 1. 🥋 GEMINI BRANDING (Top) */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 w-full text-center pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/10 backdrop-blur-md border border-blue-400/20 rounded-full">
          <div className="w-1 h-1 bg-blue-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
            Gemini 3 Multimodal Engine
          </span>
        </div>
      </div>
        
      <div className="flex flex-col items-center justify-center w-full space-y-3">
        
        {/* 2. 🥋 MASCOT */}
        <div className="relative z-20 flex justify-center w-full mt-12 animate-[float_4s_ease-in-out_infinite]">
          <Mascot size="lg" src={getMascot('HAPPY')} mood="happy" className="h-40 w-auto py-0" />
        </div>

        {/* 3. 🥋 MISSION BRIEFING TITLE */}
        <h2 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic text-center">
          Mission Briefing
        </h2>
        
        {/* 4. 🥋 DIALOGUE BOX */}
        <div className="bg-slate-50/50 rounded-3xl p-6 mb-4 border border-slate-100 relative z-10"> 
          <p className="text-slate-600 text-sm leading-relaxed text-center italic font-medium">
            "Greetings, Earth-Bestie. Martian soil is sterile and my energy is low. To survive, I need you to scan Earth-specimens so I can learn to sustain life on the Red Planet." 
          </p>
        </div>

        {/* 5. 🥋 MISSION SELECTOR (Now with Progress Reset) */}
        <div className="grid grid-cols-3 gap-2 mb-6 w-full px-2">
          {MISSIONS.map(m => (
            <button
              key={m.id}
              onClick={() => {
                setActiveMission(m);
                setActiveMissionId(m.id); // 🥋 Track ID for the system
                setMissionProgress(0);     // 🥋 Reset progress for the new goal
                speak(`Mission selected: ${m.title}`);
              }}
              className={`py-3 rounded-2xl text-[9px] font-black uppercase tracking-tighter transition-all border-b-4 ${
                activeMission?.id === m.id
                  ? 'bg-green-600 text-white border-green-800 shadow-[0_5px_15px_rgba(22,163,74,0.4)]'
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}
            >
              {m.title}
            </button>
          ))}
        </div>
        
        {/* 6. 🥋 ACTION BUTTON */}
        <button 
          onClick={handleInitializeSensors} 
          disabled={isInitializing}
          className={`bouncy w-full py-5 text-white rounded-[1.8rem] flex items-center justify-center gap-3 shadow-[0_0_25px_rgba(234,88,12,0.3)] z-10 font-black text-lg uppercase tracking-widest border-b-6 border-orange-800 active:border-b-2 active:translate-y-1 transition-all ${
            isInitializing ? 'bg-orange-400 cursor-not-allowed opacity-70' : 'bg-orange-600 hover:bg-orange-500'
          }`}
        >
          {isInitializing ? (
            <i className="fas fa-circle-notch animate-spin"></i>
          ) : (
            <i className="fas fa-satellite"></i>
          )}
          {isInitializing ? "Initializing..." : "Initialize Mission Sensors"}
        </button>
      </div>
    </div>

    <style>{`
      @keyframes float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-8px); }
      }
    `}</style>
  </div>
);

const renderScan = () => {
  const triggerFileUpload = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="flex-1 p-4 pb-0 flex flex-col min-h-0">
        <div className="bg-slate-900 w-full rounded-[2.5rem] relative flex-1 min-h-[300px] flex flex-col items-center justify-center border-4 border-slate-300 overflow-visible shadow-2xl z-0">
          
          <div className="relative w-full h-full animate-in fade-in duration-300 bg-slate-800 rounded-[2.2rem] overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              muted 
              playsInline 
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 z-0 ${isCameraActive ? 'opacity-100' : 'opacity-0'} ${facingMode === 'user' ? 'scale-x-[-1]' : ''}`} 
            />

            {/* 🥋 UPDATED: Analysis Trigger Button with Processing States */}
            {(stagedMedia.length > 0 || stagedIntent.length > 0) ? (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 w-full px-8 animate-in slide-in-from-top-4">
                 <button 
                   onClick={() => processAnalysis(false)}
                   disabled={isProcessing}
                   className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 border-b-4 transition-all ${
                     isProcessing 
                     ? 'bg-slate-500 border-slate-700 opacity-80 cursor-not-allowed' 
                     : 'bg-blue-600 border-blue-800 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] active:border-b-0 active:translate-y-1'
                   }`}
                 >
                   {isProcessing ? (
                     <i className="fas fa-spinner fa-spin text-sm"></i>
                   ) : (
                     <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                   )}
                   <span className="text-[10px]">
                     {isProcessing 
                       ? "Uplink in Progress..." 
                       : `Analyze with Gemini 3`}
                   </span>
                 </button>
              </div>
            ) : (
              <div className="absolute top-6 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
                <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/60 backdrop-blur-md rounded-full border border-white/10">
                  <div className="w-1.5 h-1.5 bg-white/20 rounded-full"></div>
                  <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Gemini 3 Link Standby</span>
                </div>
              </div>
            )}

            {!isCameraActive && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 p-8 text-center z-10 space-y-2">
                {isInitializing ? (
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest">Syncing...</p>
                  </div>
                ) : (
                  <>
                    <Mascot size="lg" src={getMascot('THINKING')} mood="thinking" />
                    <button onClick={() => handleInitializeSensors()} className="mt-4 px-8 py-3 bg-orange-600 text-white rounded-full font-black text-[10px] uppercase shadow-lg border-b-4 border-orange-800 active:translate-y-1 active:border-b-0">Initialize Sensors</button>
                  </>
                )}
              </div>
            )}

            {/* STAGED MEDIA - LEFT SIDE */}
            {stagedMedia.length > 0 && (
               <div className="absolute top-32 left-6 z-40 flex flex-col gap-4">
                {stagedMedia.map((m, i) => (
                  <div key={i} className="relative w-20 h-24 rounded-3xl border-4 border-white shadow-2xl bg-black overflow-visible">
                    {m.kind === 'video' ? (
                      <video src={m.url} autoPlay loop muted className="w-full h-full object-cover rounded-[1.2rem]" />
                    ) : (
                      <img src={m.url} className="w-full h-full object-cover rounded-[1.2rem]" alt="staged" />
                    )}
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md w-9 h-9 rounded-xl flex items-center justify-center border border-white/20">
                      <i className={`fas ${m.kind === 'video' ? 'fa-video' : 'fa-camera'} text-white text-sm`}></i>
                    </div>
                    <button 
                      onClick={() => setStagedMedia(prev => prev.filter((_, idx) => idx !== i))} 
                      className="absolute -top-3 -right-3 bg-red-600 text-white w-10 h-10 flex items-center justify-center rounded-full shadow-lg border-2 border-white z-50 text-xs font-bold"
                    >✕</button>
                </div>
              ))}
            </div>
          )}

            {/* INTENT BUBBLES - RIGHT SIDE */}
            {stagedIntent.length > 0 && (
              <div className="absolute top-32 right-4 z-40 flex flex-col gap-3 items-end max-w-[140px]">
                {stagedIntent.map((t, i) => (
                  <div key={i} className="relative group animate-in slide-in-from-right-2">
                    <div className="bg-blue-600 text-white text-[9px] font-black px-3 py-1.5 rounded-xl border-2 border-white shadow-lg italic">
                      "{t}"
                    </div>
                    <button 
                      onClick={() => setStagedIntent(prev => prev.filter((_, idx) => idx !== i))}
                      className="absolute -top-2 -left-2 bg-red-600 text-white w-5 h-5 flex items-center justify-center rounded-full font-bold shadow-md border border-white z-50"
                    >✕</button>
                  </div>
                ))}
              </div>
            )}

            {/* 🥋 Photo/Video Toggle */}
            {isCameraActive && (
              <div className="absolute bottom-32 left-1/2 -translate-x-1/2 z-40 flex bg-black/40 backdrop-blur-xl p-1 rounded-xl border border-white/20 shadow-2xl">
                <button 
                  onClick={() => { setPendingMediaKind('image'); speak("Visual mode."); }}
                  className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${pendingMediaKind === 'image' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40'}`}
                >
                  Photo
                </button>
                <button 
                  onClick={() => { setPendingMediaKind('video'); speak("Motion mode."); }}
                  className={`px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-tighter transition-all ${pendingMediaKind === 'video' ? 'bg-white text-slate-900 shadow-lg' : 'text-white/40'}`}
                >
                  Video
                </button>
              </div>
            )}

            {/* Action Bar */}
            <div className="absolute bottom-6 left-0 right-0 px-6 flex items-center justify-between z-40">
              <button onClick={triggerFileUpload} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><i className="fas fa-file-arrow-up"></i></button>
              <button onClick={() => setIsVisorTextOpen(true)} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><i className="fas fa-keyboard"></i></button>
              
              {/* SHUTTER BUTTON: Disables if processing or buffer full */}
              <button 
                disabled={isProcessing}
                onClick={isCameraActive ? (pendingMediaKind === 'video' ? recordVideoSnippet : captureSnapshot) : handleInitializeSensors} 
                className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl border-4 border-slate-700 transition-all active:scale-95 ${
                  isRecording ? 'bg-red-600 animate-pulse' : 
                  isProcessing ? 'bg-slate-300' : 'bg-white'
                }`}
              >
                <i className={`fas ${isRecording ? 'fa-square text-white' : (pendingMediaKind === 'video' ? 'fa-video' : 'fa-camera')} text-slate-800 text-xl`}></i>
              </button>

              <button onClick={startListening} className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10 flex items-center justify-center hover:bg-white/20 transition-all"><i className="fas fa-microphone"></i></button>
              <button 
               onClick={toggleCameraPower} 
                className={`w-12 h-12 backdrop-blur-md rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                 isCameraActive 
                 ? 'bg-orange-500/20 border-orange-500/50 text-orange-400 shadow-[0_0_15px_rgba(249,115,22,0.2)]' 
                  : 'bg-white/5 border-white/10 text-white/30'
                   }`}
                   >
               <div className="relative">
               <i className={`fas ${isCameraActive ? 'fa-bolt' : 'fa-power-off'} text-lg`}></i>
                {/* Active Pulsing Dot */}
                {isCameraActive && (
               <span className="absolute -top-1 -right-1 w-2 h-2 bg-orange-500 rounded-full animate-ping" />
                 )}
               </div>
                </button>
            </div>
          </div>
          
          {/* Visor Text Overlay */}
          {isVisorTextOpen && (
            <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
              <div className="bg-slate-900 p-6 rounded-[2.5rem] border border-white/10 w-full max-sm shadow-2xl">
                <form onSubmit={submitVisorTextCommand}>
                  <div className="text-[8px] font-black text-white/30 uppercase tracking-[0.2em] mb-3 ml-2">Mission Log Entry</div>
                  <input 
                    autoFocus
                    type="text" 
                    value={visorTextCommand} 
                    onChange={(e) => setVisorTextCommand(e.target.value)}
                    placeholder="Describe specimens..." 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <div className="flex gap-3 mt-4">
                    <button type="button" onClick={() => setIsVisorTextOpen(false)} className="flex-1 py-3 bg-white/5 text-white/40 rounded-lg font-bold text-xs uppercase">Cancel</button>
                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-lg font-black text-xs uppercase shadow-lg">Buffer Log</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="shrink-0 bg-neutral-900 border-t border-white/5 p-4 pb-6 flex flex-col">
        <div className="flex items-center justify-center gap-4 bg-white/5 rounded-2xl p-1.5">
          <button onClick={() => setCurrentMode('plant')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 ${currentMode === 'plant' ? 'bg-green-600 text-white shadow-lg' : 'text-white/40'}`}>
            <i className="fas fa-leaf"></i> Botany
          </button>
          <button onClick={() => setCurrentMode('space')} className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase flex items-center justify-center gap-2 ${currentMode === 'space' ? 'bg-orange-600 text-white shadow-lg' : 'text-white/40'}`}>
            <i className="fas fa-expand"></i> Habitat
          </button>
        </div>
      </div>
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleFileUpload} />
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

const renderGarden = () => {
    const activeHistoryItem = currentHistoryId ? plantHistory.find(h => h.id === currentHistoryId) : null;
    
    // 🥋 THE FIX: Determine the correct image to display.
    const displayImage = activeHistoryItem?.image || capturedImage;

    return (
      <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6 pb-24">
          
          {/* 🥋 MISSION STATUS TRACKER */}
          <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border-2 border-slate-100 mb-2 animate-in slide-in-from-top-4 duration-500">
            <div className="flex justify-between items-end mb-3 px-1">
              <div>
                <p className="text-[8px] font-[1000] text-slate-400 uppercase tracking-[0.2em] mb-0.5">Active Protocol</p>
                <p className="text-sm font-black text-slate-800 uppercase italic tracking-tighter leading-none">
                  {activeMission?.title || "Field Research"}
                </p>
              </div>
              <span className="text-xs font-[1000] text-blue-600 tabular-nums">{missionProgress}%</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-blue-200"
                style={{ width: `${missionProgress}%` }}
              />
            </div>
          </div>

          {userCorrection !== null && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-[2.5rem] p-6 shadow-xl">
              <div className="flex items-start gap-4 mb-5 px-1">
                <div style={{ backgroundColor: '#2563eb' }} className="px-5 py-3 rounded-xl shadow-lg border-2 border-blue-400 flex items-center justify-center min-w-[110px]">
                  <span style={{ fontSize: '14px' }} className="font-[900] text-white uppercase tracking-[0.1em] leading-none">Gemini 3</span>
                </div>
                <div className="flex flex-col justify-center h-[46px]">
                  <span className="text-[13px] font-[1000] uppercase tracking-tight text-slate-900 leading-none mb-1">Mission Specialist Log</span>
                  
                  {/* 🥋 UPDATED: DATA INTEGRITY BADGE */}
                  <div className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 ${isProcessing ? 'bg-amber-500' : 'bg-green-500'} rounded-full animate-pulse`}></div>
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest leading-none">
                       {isProcessing ? "Syncing Telemetry..." : "Uplink Verified"}
                    </span>
                  </div>
                </div>
              </div>
              <textarea value={userCorrection} onChange={(e) => setUserCorrection(e.target.value)} className="w-full bg-white/90 p-5 rounded-[1.5rem] border-none text-sm text-slate-800 shadow-inner min-h-[140px] outline-none font-medium italic leading-relaxed" placeholder="Recording observations..." />
            </div>
          )}

          {/* 🥋 IMAGE CONTAINER */}
          {displayImage && analysis?.interestPoint && (
            <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden border-4 border-slate-800 shadow-2xl">
              {displayImage.startsWith('data:video') ? (
                <video src={displayImage} autoPlay loop muted playsInline className="w-full h-full object-cover" />
              ) : (
                <img src={displayImage} className="w-full h-full object-cover" alt="Specimen" />
              )}
              
              <div className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center z-20" style={{ left: `${analysis.interestPoint.x}%`, top: `${analysis.interestPoint.y}%` }}>
                <button 
                  onClick={() => { 
                    window.speechSynthesis.cancel(); 
                    setShowInterestPointTooltip(!showInterestPointTooltip); 
                    if (!showInterestPointTooltip) speak(`${analysis.interestPoint?.label}. ${analysis.interestPoint?.explanation}`); 
                  }} 
                  className="relative w-8 h-8 rounded-full bg-orange-600 border-2 border-white flex items-center justify-center shadow-xl bouncy"
                >
                  <i className="fas fa-crosshairs text-[10px] text-white"></i>
                </button>
              </div>
            </div>
          )}

          <div className="bg-slate-200 w-full rounded-[3.5rem] p-8 relative flex flex-col items-center shadow-inner border-2 border-slate-300">
            <h2 className="text-lg font-black text-slate-800 mb-6 uppercase text-center">{analysis?.name}</h2>
            {analysis && <QuadrantUI data={analysis} />}
          </div>

          {/* HISTORY SECTION */}
          {activeHistoryItem?.chatHistory && activeHistoryItem.chatHistory.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200">
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center mb-4">Protocol Dialogue Log</div>
              {activeHistoryItem.chatHistory.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl text-sm leading-relaxed shadow-sm ${chat.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-slate-700 border border-slate-200 rounded-tl-none'}`}>
                    <span className={`block text-[8px] font-black uppercase tracking-wider mb-1 ${chat.role === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>{chat.role === 'user' ? 'Mission Lead' : 'Gemini 3'}</span>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>
          )}

          <button onClick={() => setShowPassport(true)} className="w-full py-4 bg-orange-600 text-white rounded-[2rem] text-xs font-black uppercase tracking-widest bouncy shadow-lg">View Passport</button>
        </div>

        <div className="shrink-0 p-6 bg-white border-t border-slate-100 space-y-4 shadow-xl">
          <div className="flex gap-3">
            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !isChatting) handleSendChat(); }} placeholder="Query Gemini 3..." className="flex-1 bg-slate-50 border-2 border-slate-100 rounded-full px-6 py-3 text-sm font-medium focus:outline-none focus:border-blue-400" />
            <button disabled={isChatting} onClick={() => { window.speechSynthesis.cancel(); handleSendChat(); }} className={`shrink-0 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all bouncy ${isChatting ? 'bg-slate-400' : 'bg-blue-600'}`}>
              {isChatting ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-paper-plane"></i>}
            </button>
          </div>

          {/* 🥋 UPDATED: NEW SCAN RESET BUTTON */}
          <button 
            onClick={() => { 
              window.speechSynthesis.cancel(); 
              setUserCorrection(null); 
              setIsProcessing(false); // 🥋 Ensure the lock is released for the next demo
              setActiveState(fromHistory ? AppState.HISTORY : AppState.HOME); 
            }} 
            className="w-full py-5 bg-slate-800 text-white rounded-[2rem] text-sm font-black shadow-2xl uppercase tracking-widest bouncy"
          >
            {fromHistory ? "Back to Mission Logs" : "Initiate New Scan"}
          </button>
        </div>
        {showPassport && analysis && <PlantPassport data={analysis} onClose={() => setShowPassport(false)} />}
      </div>
    );
  };

  const renderSpaceResults = () => {
    const activeHistoryItem = currentHistoryId ? plantHistory.find(h => h.id === currentHistoryId) : null;
    return (
      <div className="flex flex-col h-full bg-slate-900 overflow-hidden">
        <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center">
            {capturedImage && (capturedImage.startsWith('data:video') ? <video src={capturedImage} autoPlay loop muted playsInline className="max-w-full max-h-full object-contain opacity-60" /> : <img src={capturedImage} className="max-w-full max-h-full object-contain opacity-60" alt="Habitat Scan" />)}
            <div className="absolute inset-0">
              {spaceAnalysis?.hotSpots.map((spot, i) => (
                <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
                  <button onClick={() => { window.speechSynthesis.cancel(); setSelectedHotSpot(spot); speak(spot.reasoning); }} className={`relative w-10 h-10 rounded-full border-2 flex items-center justify-center bouncy ${selectedHotSpot === spot ? 'bg-orange-500 border-white scale-125' : 'bg-slate-900/60 border-orange-500/50'}`}><i className="fas fa-triangle-exclamation text-white text-[10px]"></i></button>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="shrink-0 bg-slate-900/95 backdrop-blur-3xl p-6 rounded-t-[3rem] border-t border-white/5 space-y-4">
          {selectedHotSpot ? (
            <div className="animate-in fade-in slide-in-from-bottom-2">
              <h3 className="text-xl font-black text-orange-400 uppercase tracking-tighter mb-1">{selectedHotSpot.label}</h3>
              <p className="text-sm text-slate-300 leading-relaxed font-medium mb-4">"{selectedHotSpot.reasoning}"</p>
              <div className="bg-orange-500/10 p-4 rounded-2xl border border-orange-500/20">
                 <span className="text-[9px] font-black text-orange-400 uppercase block mb-1">Xeno-Protocol Recommendation</span>
                 <p className="font-black text-white text-sm">{selectedHotSpot.recommendedPlant}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {activeHistoryItem?.chatHistory && activeHistoryItem.chatHistory.length > 0 && (
                <div className="max-h-48 overflow-y-auto space-y-3 mb-4 scrollbar-hide">
                  {activeHistoryItem.chatHistory.map((chat, idx) => (
                    <div key={idx} className={`p-4 rounded-2xl text-sm leading-relaxed ${chat.role === 'user' ? 'bg-white/10 text-white ml-8 border border-white/10' : 'bg-blue-600/30 text-blue-100 mr-8 border border-blue-400/20'}`}>
                      <span className="text-[8px] font-black uppercase tracking-widest opacity-40 block mb-1">{chat.role === 'user' ? 'Mission Lead' : 'Me-Lap'}</span>
                      {chat.text}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-slate-500 italic text-sm text-center py-2">"Select a stress zone or query the uplink."</p>
            </div>
          )}
          <div className="flex gap-3">
            <input type="text" value={chatMessage} onChange={(e) => setChatMessage(e.target.value)} onKeyDown={(e) => { if(e.key === 'Enter' && !isChatting) handleSendChat(); }} placeholder="Habitat concern...?" className="flex-1 bg-white/5 border border-white/10 rounded-full px-5 py-3 text-white text-sm focus:outline-none focus:border-orange-400" />
            <button disabled={isChatting} onClick={() => { window.speechSynthesis.cancel(); handleSendChat(); }} className={`shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-all bouncy ${isChatting ? 'bg-slate-700' : 'bg-orange-600'}`}>
              {isChatting ? <i className="fas fa-spinner fa-spin text-white"></i> : <i className="fas fa-paper-plane text-white"></i>}
            </button>
          </div>
          <button onClick={() => { window.speechSynthesis.cancel(); setActiveState(fromHistory ? AppState.HISTORY : AppState.HOME); }} className="w-full py-4 bg-slate-800 text-slate-500 text-[10px] font-black rounded-[2rem] bouncy uppercase tracking-[0.2em]">{fromHistory ? "Back to Logs" : "Return to Uplink"}</button>
        </div>
      </div>
    );
  };

const renderHistory = () => (
    <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
      <div className="shrink-0 px-6 py-4 flex items-center justify-between">
         <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase italic">Mission Logs</h2>
      </div>
      {/* Reduced space-y from 6 to 4 to pull the 3rd card up */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-24">
        {plantHistory.map((item) => (
          <div 
            key={item.id} 
            onClick={() => {
              setCapturedImage(item.image);
              setFromHistory(true); 
              setCurrentHistoryId(item.id);
              if (item.type === 'plant') {
                setAnalysis(item.analysis as PlantAnalysis);
                setActiveState(AppState.GARDEN);
              } else {
                setSpaceAnalysis(item.analysis as SpaceAnalysis);
                setActiveState(AppState.SPACE_RESULTS);
              }
            }} 
            className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 shadow-sm transition-all cursor-pointer active:scale-[0.98] relative block w-full"
          >
            {/* 1. Visual Area - Height reduced to h-36 to fit 3 cards */}
            <div className="relative h-36 w-full bg-slate-200 overflow-hidden">
              {item.image.startsWith('data:video') ? (
                <div className="w-full h-full flex items-center justify-center">
                  <i className="fas fa-video text-slate-400 text-lg"></i>
                </div>
              ) : (
                <img src={item.image} className="object-cover w-full h-full" alt={item.name} />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-4">
                <div className="flex justify-between items-end">
                  <div className="flex-1 min-w-0">
                    <p className="text-[#58CC02] text-[8px] font-black uppercase tracking-[0.2em] mb-0.5">
                      {item.type === 'plant' ? 'Bio Specimen' : 'Spatial Scan'}
                    </p>
                    <h4 className="font-black text-white text-lg uppercase tracking-tighter truncate leading-none">
                      {item.name}
                    </h4>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Compact Data Strip */}
            <div className="px-5 py-3 flex items-center justify-between bg-white">
              <div className="flex gap-4">
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Date</span>
                  <span className="text-[9px] font-black text-slate-700">{item.date}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[7px] text-slate-400 font-bold uppercase tracking-widest">Status</span>
                  <span className="text-[9px] font-black text-[#58CC02]">ARCHIVED</span>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  deleteHistoryItem(item.id, e);
                }} 
                className="w-8 h-8 rounded-full bg-red-50 text-red-400 flex items-center justify-center"
              >
                <i className="fas fa-trash-alt text-[10px]"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSettings = () => {
  return (
    <div className="flex flex-col h-full bg-slate-950 text-white overflow-hidden">
      {/* HEADER SECTION */}
      <div className="p-8 pb-4">
        <h2 className="text-3xl font-black italic tracking-tighter text-blue-500 uppercase">
          Mission Control
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
          Operational Status: Nominal
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-24">
        
        {/* PLAYER STATS CARD */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-[2.5rem] p-8 shadow-2xl border border-white/10 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-200 mb-2 text-center">Current Rank</p>
            <h2 className="text-4xl font-black italic tracking-tighter mb-8 text-center uppercase">Martian Lead</h2>
            
            <div className="flex justify-around items-center">
              <div className="text-center">
                <p className="text-[9px] font-bold text-blue-200 uppercase mb-1">Total XP</p>
                <p className="text-2xl font-black text-white">{stats.xp}</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-[9px] font-bold text-blue-200 uppercase mb-1">Credits</p>
                <p className="text-2xl font-black text-white">{stats.coins}</p>
              </div>
            </div>
          </div>
          {/* Decorative background element */}
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <i className="fas fa-user-astronaut text-8xl rotate-12"></i>
          </div>
        </div>

        {/* ACTIVE MISSION PROGRESS */}
        <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800">
           <div className="flex justify-between items-center mb-4">
              <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Current Objective</h3>
              <span className="text-blue-500 font-black text-xs">{missionProgress}%</span>
           </div>
           <p className="text-lg font-black italic uppercase text-slate-200 mb-4">{activeMission?.title}</p>
           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 transition-all duration-1000"
                style={{ width: `${missionProgress}%` }}
              />
           </div>
        </div>

        {/* MISSION SELECTOR / PROTOCOLS */}
        <div className="space-y-4">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-500 px-2">Switch Protocol</h3>
          {MISSIONS.map((m) => (
            <button 
              key={m.id}
              onClick={() => {
                setActiveMission(m);
                setMissionProgress(0);
                speak(`Protocol switched to ${m.title}`);
              }}
              className={`w-full p-6 rounded-[2rem] border-2 transition-all flex flex-col items-start ${
                activeMission?.id === m.id 
                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                : 'border-slate-800 bg-slate-900/50 grayscale opacity-60'
              }`}
            >
              <div className="flex justify-between w-full items-center mb-2">
                <h4 className="font-black text-sm uppercase italic tracking-tighter text-white">{m.title}</h4>
                {activeMission?.id === m.id && <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse shadow-[0_0_8px_#3b82f6]" />}
              </div>
              <p className="text-[10px] text-slate-400 font-medium text-left">{m.description}</p>
            </button>
          ))}
        </div>

        {/* TOGGLE OPTIONS (Simplified) */}
        <div className="bg-slate-900/30 rounded-3xl p-6 border border-slate-800 flex justify-between items-center">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Audio Uplink</span>
            <button 
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`w-12 h-6 rounded-full relative transition-all ${audioEnabled ? 'bg-blue-600' : 'bg-slate-700'}`}
            >
              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${audioEnabled ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
      </div>
    </div>
  );
};

// 🥋 MOVE THE COMPONENT INSIDE APP TO FIX THE WHITE SCREEN
  const RenderAnalyzing = () => {
    const [tickerIndex, setTickerIndex] = useState(0);
    
    const messages = [
      "Martian Uplink Active...", 
      "Establishing Gemini 3 Link...",
      "Neural Link Synchronized...",
      "Parsing Multimodal Visual Data...",
      "Synthesizing Mission Logs..."
    ];

    useEffect(() => {
      const interval = setInterval(() => {
        setTickerIndex((prev) => (prev + 1) % messages.length);
      }, 2000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col h-full bg-slate-900 items-center p-6 text-center relative justify-between overflow-hidden">
        {/* CRT Overlay */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.05] z-50 overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
        </div>

        {/* HEADER */}
        <div className="flex flex-col items-center gap-3 z-20 pt-12 w-full">
          <div 
            style={{ backgroundColor: '#2563eb' }}
            className="px-8 py-3 rounded-2xl shadow-[0_0_40px_rgba(37,99,235,0.5)] border-2 border-blue-400 flex items-center justify-center"
          >
             <span style={{ fontSize: '28px', fontWeight: '900', letterSpacing: '0.15em' }} className="text-white uppercase leading-none">
               Gemini 3
             </span>
          </div>
          <h2 className="text-white text-lg font-black uppercase italic animate-pulse tracking-widest">Synthesizing</h2>
        </div>

        {/* MASCOT: Now safe because it's inside App scope */}
        <div className="relative scale-75 my-2">
          <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping scale-110"></div>
          <Mascot size="xl" src={getMascot('THINKING')} mood="thinking" className="relative z-10" />
        </div>

        {/* FOOTER STACK */}
        <div className="space-y-4 max-w-xs w-full pb-8">
          <div className="space-y-2">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
              <div className="h-full bg-blue-500 animate-[loading_2s_linear_infinite] w-1/2"></div>
            </div>
            <div className="h-5"> 
              <p className="text-orange-500 text-[10px] font-black uppercase tracking-widest transition-all duration-500" key={tickerIndex}>
                {messages[tickerIndex]}
              </p>
            </div>
          </div>

          {/* Payload Icons */}
          <div className="bg-white/5 backdrop-blur-xl rounded-[1.5rem] p-4 border border-white/10 shadow-2xl">
            <div className="flex justify-around items-center">
               <div className="flex flex-col items-center">
                  <div className="text-xl">📸</div>
                  <span className="text-white font-black text-[9px] uppercase">{stagedMedia?.length || 0} Visuals</span>
               </div>
               <div className="flex flex-col items-center">
                  <div className="text-xl">🎙️</div>
                  <span className="text-white font-black text-[9px] uppercase">{stagedIntent?.length || 0} Logs</span>
               </div>
            </div>
          </div>

          {/* STATUS LINE */}
          <div className="flex items-center justify-center gap-2 opacity-40 pt-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-[7px] font-black text-white uppercase tracking-widest">Martian Relay Nominal</span>
          </div>
        </div>

        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeState) {
      case AppState.HOME: return renderHome();
      case AppState.SCAN: case AppState.SPACE_SCAN: return renderScan();
      case AppState.ANALYZING: return <RenderAnalyzing />; // 🥋 Simple call, no props needed anymore
      case AppState.GARDEN: return renderGarden();
      case AppState.HISTORY: return renderHistory();
      case AppState.SETTINGS: return renderSettings();
      case AppState.SPACE_RESULTS: return renderSpaceResults();
      default: return renderHome();
    }
  };

  if (showSplash) return <SplashView onComplete={() => setShowSplash(false)} />;

  return (
    <Layout 
      activeState={activeState} 
      onNavigate={setActiveState} 
      stats={stats}
      audioEnabled={audioEnabled}
      setAudioEnabled={setAudioEnabled}
    >
      {renderContent()}
    </Layout>
  );
}; // This closes the 'const App = () => {'

export default App;
