"use client";

import { useEffect, useState, type RefObject } from "react";

export function useVideoCaption(videoRef: RefObject<HTMLVideoElement | null>) {
  const [text, setText] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let track: TextTrack | null = null;

    const onCue = () => {
      const cue = track?.activeCues?.[0] as VTTCue | undefined;
      setText(cue?.text?.replace(/<[^>]+>/g, "") ?? "");
    };

    const sync = () => {
      if (!video.textTracks.length) return;
      const next = video.textTracks[0];
      if (track === next) return;
      track?.removeEventListener("cuechange", onCue);
      track = next;
      track.mode = "hidden";
      track.addEventListener("cuechange", onCue);
      onCue();
    };

    sync();
    video.addEventListener("loadedmetadata", sync);
    video.addEventListener("loadeddata", sync);

    return () => {
      video.removeEventListener("loadedmetadata", sync);
      video.removeEventListener("loadeddata", sync);
      track?.removeEventListener("cuechange", onCue);
    };
  }, [videoRef]);

  return text;
}

export function VideoCaption({ text }: { text: string }) {
  if (!text) return null;
  return (
    <p className="video-caption" aria-live="polite">
      {text}
    </p>
  );
}
