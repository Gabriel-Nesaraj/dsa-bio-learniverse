
import { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ModuleCardProps {
  title: string;
  description: string;
  icon: ReactNode;
  link: string;
  className?: string;
  accentColor?: string;
}

const ModuleCard = ({
  title,
  description,
  icon,
  link,
  className,
  accentColor = 'bg-primary/10 text-primary'
}: ModuleCardProps) => {
  return (
    <div className={cn(
      "group relative rounded-xl border border-border bg-card p-6 transition-all hover:shadow-md hover:border-primary/20",
      className
    )}>
      <div className={cn(
        "rounded-lg w-12 h-12 flex items-center justify-center mb-5",
        accentColor
      )}>
        {icon}
      </div>

      <h3 className="font-semibold text-xl mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6">{description}</p>

      <Link to={link}>
        <Button variant="ghost" className="p-0 h-auto font-medium group-hover:text-primary">
          Learn more
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  );
};

export default ModuleCard;
