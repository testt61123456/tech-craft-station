import { useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Canvas as FabricCanvas, PencilBrush } from "fabric";
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
      });

      canvas.isDrawingMode = true;
      // Ensure a pencil brush is set for reliable drawing across environments
      canvas.freeDrawingBrush = new PencilBrush(canvas);
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
        if (!fabricCanvasRef.current) {
          console.log("Canvas ref is null");
          return null;
        }
        try {
          const json = fabricCanvasRef.current.toJSON();
          console.log("Canvas JSON:", json);
          // Check if canvas has any objects (signature was drawn)
          if (!json.objects || json.objects.length === 0) {
            console.log("No objects in canvas");
            return null;
          }
          const stringified = JSON.stringify(json);
          console.log("Signature data:", stringified);
          return stringified;
        } catch (error) {
          console.error("İmza verisi alınırken hata:", error);
          return null;
        }
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
          const jsonData = typeof data === 'string' ? JSON.parse(data) : data;
          fabricCanvasRef.current.loadFromJSON(jsonData, () => {
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
      // Keep drawing mode on after clear
      fabricCanvasRef.current.isDrawingMode = true;
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
          <canvas ref={canvasRef} width={width} height={height} className="block w-full h-auto cursor-crosshair" style={{ touchAction: 'none' }} />
        </div>
      </div>
    );
  }
);

SignaturePad.displayName = "SignaturePad";

export default SignaturePad;
