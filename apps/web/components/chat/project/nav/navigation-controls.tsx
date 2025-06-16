import { Button } from '@/components/ui/button'
import { ArrowLeft, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react'

export default function NavigationControls() {
    return (
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200">
          <ArrowRight className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200">
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 transition-colors duration-150 hover:bg-white/5 hover:text-gray-200">
          <ExternalLink className="h-4 w-4" />
        </Button>
      </div>
    );
  }