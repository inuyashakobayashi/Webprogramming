import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Poll } from '@/types/poll';

interface PollCardProps {
  poll: Poll;
  onDelete?: () => void;
  isOwner?: boolean;
}

const PollCard: React.FC<PollCardProps> = ({ poll, onDelete, isOwner }) => {
  const getDeadlineStatus = () => {
    if (!poll.body.setting?.deadline) return null;
    
    const deadline = new Date(poll.body.setting.deadline);
    const now = new Date();
    
    if (deadline < now) {
      return <span className="text-red-500">Expired</span>;
    }
    
    const days = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return <span className="text-green-500">{days} days left</span>;
  };

  const isExpired = poll.body.setting?.deadline 
    ? new Date(poll.body.setting.deadline) < new Date()
    : false;

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{poll.body.title}</CardTitle>
            <CardDescription>{poll.body.description}</CardDescription>
          </div>
          {poll.body.fixed && (
            <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
              Completed
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-gray-500">
            Options: {poll.body.options.length}
          </div>
          {poll.body.setting?.voices && (
            <div className="text-sm text-gray-500">
              Voices per user: {poll.body.setting.voices}
            </div>
          )}
          {poll.body.setting?.deadline && (
            <div className="text-sm text-gray-500">
              Status: {getDeadlineStatus()}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          asChild
        >
          <a href={`/poll/${poll.share.value}`}>
            View Results
          </a>
        </Button>
        {!isExpired && !poll.body.fixed && (
          <Button 
            variant="default"
            asChild
          >
            <a href={`/poll/${poll.share.value}/vote`}>
              Vote
            </a>
          </Button>
        )}
        {isOwner && (
          <Button 
            variant="destructive"
            onClick={onDelete}
          >
            Delete
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PollCard;