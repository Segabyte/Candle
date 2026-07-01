import { useEffect, useRef } from "react";
import { CandleSceneController } from "@/three/scene";
import type { CandleSize } from "@shared/types";

type Props = {
  progress: number; // 0..1 session progress
  lit: boolean;
  size: CandleSize;
  mini?: boolean;
  className?: string;
};

export function CandleScene({ progress, lit, size, mini, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controllerRef = useRef<CandleSceneController | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const controller = new CandleSceneController(canvas, size, mini);
    controllerRef.current = controller;

    const observer = new ResizeObserver(() => {
      const parent = canvas.parentElement;
      if (parent) controller.resize(parent.clientWidth, parent.clientHeight);
    });
    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
      controller.resize(
        canvas.parentElement.clientWidth,
        canvas.parentElement.clientHeight
      );
    }
    return () => {
      observer.disconnect();
      controller.dispose();
      controllerRef.current = null;
    };
    // The controller is created once; size changes are handled below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mini]);

  useEffect(() => {
    controllerRef.current?.setProgress(progress);
  }, [progress]);

  useEffect(() => {
    controllerRef.current?.setLit(lit);
  }, [lit]);

  useEffect(() => {
    controllerRef.current?.setSize(size);
  }, [size]);

  return (
    <div className={className ?? "candle-canvas-wrap"}>
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
