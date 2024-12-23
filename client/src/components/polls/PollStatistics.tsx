import { FC } from 'react';
import { User } from 'lucide-react';
import { Statistics, StatisticsOption } from '../../types/poll';
import * as Recharts from 'recharts';

interface PollStatisticsProps {
  statistics: Statistics;
}

interface ChartDataItem {
  name: string;
  votes: number;
  worst: number;
}

const PollStatistics: FC<PollStatisticsProps> = ({ statistics }) => {
  const { poll, participants, options: statisticsOptions } = statistics;

  // Transform data for chart
  const chartData: ChartDataItem[] = poll.body.options.map((option, index) => {
    const statsOption = statisticsOptions[index];
    return {
      name: option.text,
      votes: statsOption?.voted?.length ?? 0,
      worst: statsOption?.worst?.length ?? 0
    };
  });

  // Calculate percentages
  const totalParticipants = participants.length;
  const getPercentage = (count: number): string => {
    return totalParticipants > 0
      ? `${((count / totalParticipants) * 100).toFixed(1)}%`
      : '0%';
  };

  // Safe getter for statistics
  const getStatOption = (index: number): StatisticsOption | undefined => {
    return statisticsOptions[index];
  };

  return (
    <div className="space-y-6 p-4">
      {/* Participants Section */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <User className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-lg">Participants</h3>
        </div>
        <p className="text-gray-600">{totalParticipants} total participants</p>
      </div>

      {/* Chart Section */}
      <div className="h-64 w-full">
        <Recharts.ResponsiveContainer width="100%" height="100%">
          <Recharts.BarChart 
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <Recharts.CartesianGrid strokeDasharray="3 3" />
            @ts-ignore
            <Recharts.XAxis 
              dataKey="name"
              angle={-45}
              textAnchor="end"
              height={70}
              tick={{ fontSize: 12 }}
            />
            //@ts-ignore
            <Recharts.YAxis />
            <Recharts.Tooltip />
            <Recharts.Bar dataKey="votes" fill="#4F46E5" name="Votes" />
            {poll.body.setting?.worst && (
              <Recharts.Bar dataKey="worst" fill="#EF4444" name="Worst" />
            )}
          </Recharts.BarChart>
        </Recharts.ResponsiveContainer>
      </div>

      {/* Detailed Statistics */}
      <div className="space-y-4">
        {poll.body.options.map((option, index) => {
          const statsOption = getStatOption(index);
          const voteCount = statsOption?.voted?.length ?? 0;
          const worstCount = statsOption?.worst?.length ?? 0;

          return (
            <div
              key={option.id}
              className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{option.text}</h4>
                <span className="text-sm text-gray-600">
                  {voteCount} votes ({getPercentage(voteCount)})
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                  style={{
                    width: getPercentage(voteCount)
                  }}
                />
              </div>
              {poll.body.setting?.worst && statsOption?.worst && (
                <div className="mt-2 text-sm text-red-600">
                  Worst votes: {worstCount} ({getPercentage(worstCount)})
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PollStatistics;