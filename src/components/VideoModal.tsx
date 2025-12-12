import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';

interface VideoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  youtubeId?: string;
  mp4Url?: string;
  isShorts?: boolean;
}

export const VideoModal = ({ 
  open, 
  onOpenChange, 
  youtubeId, 
  mp4Url,
  isShorts = false 
}: VideoModalProps) => {
  const aspectRatio = isShorts ? 'aspect-[9/16]' : 'aspect-video';
  const maxWidth = isShorts ? 'max-w-[360px]' : 'max-w-3xl';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} p-0 bg-transparent border-none shadow-none [&>button]:hidden`}>
        <div className="relative">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute -top-10 right-0 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
          >
            <X className="w-5 h-5 text-foreground" />
          </button>
          <div className={`${aspectRatio} w-full rounded-xl overflow-hidden bg-background`}>
            {youtubeId ? (
              <iframe
                src={`https://www.youtube.com/embed/${youtubeId}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Video"
              />
            ) : mp4Url ? (
              <video 
                src={mp4Url} 
                controls 
                autoPlay 
                className="w-full h-full object-cover"
              />
            ) : null}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default VideoModal;
