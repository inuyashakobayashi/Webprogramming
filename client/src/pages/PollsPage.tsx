// src/pages/PollsPage.tsx
import React from 'react';
import PollCard from '../components/polls/pollCard';
import PollCreate from '../components/polls/pollCreate';
import { Poll, PollBody } from '../types/poll';

const PollsPage = () => {
  // Beispiel-Daten für die Demonstration
  const examplePolls: Poll[] = [
    {
      body: {
        title: "Was ist dein Lieblings-Framework?",
        description: "Wähle dein bevorzugtes Frontend-Framework",
        options: [
          { id: 1, text: "React" },
          { id: 2, text: "Vue" },
          { id: 3, text: "Angular" }
        ],
        setting: {
          deadline: "2024-12-31T23:59:59Z"
        }
      },
      security: {
        visibility: "lack"
      },
      share: {
        value: "abc123"
      }
    },
    {
      body: {
        title: "Team Lunch Place?",
        description: "Wo sollen wir essen gehen?",
        options: [
          { id: 1, text: "Italienisch" },
          { id: 2, text: "Asiatisch" }
        ]
      },
      security: {
        visibility: "lock"
      },
      share: {
        value: "def456"
      }
    }
  ];

  const handleCreatePoll = (pollData: PollBody) => {
    console.log('Neue Umfrage erstellt:', pollData);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Pollock - Umfragen</h1>
        
        {/* Create Poll Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Neue Umfrage erstellen</h2>
          <PollCreate onSubmit={handleCreatePoll} />
        </div>

        {/* Polls List Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Aktuelle Umfragen</h2>
          {examplePolls.map((poll, index) => (
            <PollCard
              key={index}
              poll={poll}
              isAdmin={true}
              onClick={() => console.log('Poll clicked:', poll.body.title)}
              onEdit={() => console.log('Edit poll:', poll.body.title)}
              onDelete={() => console.log('Delete poll:', poll.body.title)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PollsPage;