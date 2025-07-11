import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  className?: string;
  onPlay?: () => void;
  onPause?: () => void;
  onEnded?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  autoPlay = false,
  loop = false,
  muted = false,
  controls = true,
  className = '',
  onPlay,
  onPause,
  onEnded
}) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isMuted, setIsMuted] = useState(muted);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
      if (onPlay) onPlay();
    };
    
    const handlePause = () => {
      setIsPlaying(false);
      if (onPause) onPause();
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      if (onEnded) onEnded();
    };
    
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onPlay, onPause, onEnded]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newVolume = parseFloat(e.target.value);
    video.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      video.muted = true;
      setIsMuted(true);
    } else if (isMuted) {
      video.muted = false;
      setIsMuted(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;
    
    const newTime = parseFloat(e.target.value);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const toggleFullscreen = () => {
    const player = playerRef.current;
    if (!player) return;
    
    if (!document.fullscreenElement) {
      player.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleMouseMove = () => {
    setShowControls(true);
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };

  const handleMouseLeave = () => {
    if (isPlaying) {
      setShowControls(false);
    }
  };

  return (
    <div 
      ref={playerRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        className="w-full h-auto rounded-lg"
        onClick={togglePlayPause}
      />
      
      {controls && (showControls || !isPlaying) && (
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Progress Bar */}
          <div className="px-4 pb-1">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.3) 100%)`
              }}
            />
          </div>
          
          {/* Controls */}
          <div className="px-4 pb-4 pt-1 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlayPause}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
              
              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                
                <div className="hidden sm:block w-20">
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.1}
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-gray-300 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #fff 0%, #fff ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) ${(isMuted ? 0 : volume) * 100}%, rgba(255, 255, 255, 0.3) 100%)`
                    }}
                  />
                </div>
              </div>
              
              <div className="text-white text-xs">
                {formatTime(currentTime)} / {formatTime(duration || 0)}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <button 
                onClick={toggleFullscreen}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200"
              >
                <Maximize className="w-4 h-4" />
              </button>
              
              <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition-colors duration-200">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Big Play Button (when paused) */}
      {!isPlaying && (
        <button
          onClick={togglePlayPause}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-all duration-200 hover:scale-110"
        >
          <Play className="w-8 h-8 ml-1" />
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;