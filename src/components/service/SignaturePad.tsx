import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas as FabricCanvas } from "fabric";
import { Button } from "@/components/ui/button";
import { Eraser } from "lucide-react";

export interface SignaturePadRef {
  getSignatureData: () => string | null;
  clearSignature: () => void;
  loadSignature: (data: string) => void;
}

interface SignaturePadProps {
  width?: number;
  height?: number;
}

const SignaturePad = forwardRef<SignaturePadRef, SignaturePadProps>(
  ({ width = 400, height = 200 }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<FabricCanvas | null>(null);

    useEffect(() => {
      if (!canvasRef.current) return;

      const canvas = new FabricCanvas(canvasRef.current, {
        width,
        height,
        backgroundColor: "#ffffff",
        isDrawingMode: true,
      });

      if (canvas.freeDrawingBrush) {
        canvas.freeDrawingBrush.color = "#000000";
        canvas.freeDrawingBrush.width = 3;
      }

      fabricCanvasRef.current = canvas;

      return () => {
        canvas.dispose();
      };
    }, [width, height]);

    useImperativeHandle(ref, () => ({
      getSignatureData: () => {
        if (!fabricCanvasRef.current) return null;
        return fabricCanvasRef.current.toJSON();
      },
      clearSignature: () => {
        if (!fabricCanvasRef.current) return;
        fabricCanvasRef.current.clear();
        fabricCanvasRef.current.backgroundColor = "#ffffff";
        fabricCanvasRef.current.renderAll();
      },
      loadSignature: (data: string) => {
        if (!fabricCanvasRef.current) return;
        try {
          fabricCanvasRef.current.loadFromJSON(data, () => {
            fabricCanvasRef.current?.renderAll();
          });
        } catch (error) {
          console.error("İmza yüklenirken hata:", error);
        }
      },
    }));

    const handleClear = () => {
      if (!fabricCanvasRef.current) return;
      fabricCanvasRef.current.clear();
      fabricCanvasRef.current.backgroundColor = "#ffffff";
      fabricCanvasRef.current.renderAll();
    };

    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-white">İmza</label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClear}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Eraser className="h-4 w-4 mr-2" />
            Temizle
          </Button>
        </div>
        <div className="border-2 border-gray-300 rounded-md overflow-hidden bg-white shadow-inner">
          <canvas ref={canvasRef} className="touch-none" />
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
