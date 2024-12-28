import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { StatisticsProps, PollOption } from '@/types/poll';

const PollStatistics: React.FC<StatisticsProps> = ({ statistics }) => {
  const totalVotes = statistics.options.reduce((sum: number, option) => 
    sum + option.voted.length, 0
  );

  const calculatePercentage = (count: number): number => {
    if (totalVotes === 0) return 0;
    return (count / totalVotes) * 100;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{statistics.poll.body.title}</CardTitle>
        {statistics.poll.body.description && (
          <CardDescription>{statistics.poll.body.description}</CardDescription>
        )}
        <div className="text-sm text-gray-500">
          Total Participants: {statistics.participants.length}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {statistics.poll.body.options.map((option: PollOption, index: number) => {
            const votes = statistics.options[index].voted.length;
            const worstVotes = statistics.options[index].worst?.length || 0;
            const percentage = calculatePercentage(votes);

            return (
              <div key={option.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{option.text}</span>
                  <span>{votes} votes ({percentage.toFixed(1)}%)</span>
                </div>
                <Progress value={percentage} className="h-2" />
                {worstVotes > 0 && (
                  <div className="text-sm text-gray-500">
                    Marked as worst choice: {worstVotes} times
                  </div>
                )}
              </div>
            );
          })}

          {statistics.poll.body.fixed && (
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Poll Results Fixed</h4>
              <p className="text-sm text-green-600">
                The poll owner has fixed the following options as the final result:
                {statistics.poll.body.fixed.map((id: number) => {
                  const option = statistics.poll.body.options.find(opt => opt.id === id);
                  return option ? ` ${option.text}` : '';
                }).join(', ')}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PollStatistics;