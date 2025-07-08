import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react'

export default function NavigationControls() {
    return (
      <div className="flex items-center gap-1">
        
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground transition-colors duration-150 hover:bg-muted hover:text-foreground">
          <ExternalLink className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-1 ml-3">
          <span className="relative flex h-3 w-3 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400"></span>
          </span>
          <span className="text-sm text-muted-foreground font-medium">Idle</span>
        </div>
      </div>
    );
}