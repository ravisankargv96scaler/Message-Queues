import React, { useState } from 'react';
import Button from '../ui/Button';
import { Check, X } from 'lucide-react';

const questions = [
  {
    id: 1,
    text: "If a Consumer Service crashes while a message is in the Queue, what happens to the message?",
    options: [
      { id: 'a', text: "It is lost forever.", correct: false },
      { id: 'b', text: "It stays in the Queue until the service recovers.", correct: true },
      { id: 'c', text: "It is sent back to the Producer.", correct: false },
    ]
  },
  {
    id: 2,
    text: "Which pattern would you use to send a 'New User Signup' event to BOTH the Email Service and the Analytics Service?",
    options: [
      { id: 'a', text: "Point-to-Point (Worker Queue)", correct: false },
      { id: 'b', text: "Pub/Sub (Publish/Subscribe)", correct: true },
      { id: 'c', text: "Round Robin", correct: false },
    ]
  },
  {
    id: 3,
    text: "How does a Queue help during a sudden traffic spike (Flash Sale)?",
    options: [
      { id: 'a', text: "It makes the Consumer process faster.", correct: false },
      { id: 'b', text: "It blocks extra users from entering the site.", correct: false },
      { id: 'c', text: "It buffers requests (Load Leveling) so the Consumer doesn't crash.", correct: true },
    ]
  }
];

const Tab6Quiz: React.FC = () => {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qId: number, optionId: string) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [qId]: optionId }));
  };

  const score = questions.filter(q => {
    const selected = answers[q.id];
    const correct = q.options.find(o => o.correct)?.id;
    return selected === correct;
  }).length;

  return (
    <div className="p-8 max-w-3xl mx-auto space-y-8">
      <div className="space-y-4 text-center">
        <h2 className="text-3xl font-bold text-amber-500">Knowledge Check</h2>
        <p className="text-lg text-slate-400">
            Let's see what you've learned about Message Queues.
        </p>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-slate-900 border border-slate-700 rounded-xl p-6 shadow-md">
            <h3 className="text-lg font-semibold text-white mb-4">{q.id}. {q.text}</h3>
            <div className="space-y-2">
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id;
                const isCorrect = opt.correct;
                let className = "w-full text-left p-3 rounded-lg border transition-all ";
                
                if (submitted) {
                    if (isCorrect) className += "bg-emerald-900/30 border-emerald-500 text-emerald-200";
                    else if (isSelected && !isCorrect) className += "bg-rose-900/30 border-rose-500 text-rose-200";
                    else className += "border-slate-700 text-slate-500 opacity-50";
                } else {
                    if (isSelected) className += "bg-amber-500/20 border-amber-500 text-amber-200";
                    else className += "bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300";
                }

                return (
                  <button 
                    key={opt.id}
                    onClick={() => handleSelect(q.id, opt.id)}
                    className={className}
                  >
                    <div className="flex items-center justify-between">
                        <span>{opt.text}</span>
                        {submitted && isCorrect && <Check size={16} className="text-emerald-500" />}
                        {submitted && isSelected && !isCorrect && <X size={16} className="text-rose-500" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col items-center space-y-4">
        {!submitted ? (
            <Button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < 3} className="px-8 py-3 text-lg">
                Submit Answers
            </Button>
        ) : (
            <div className="text-center animate-in fade-in zoom-in duration-500">
                <div className="text-4xl font-bold text-white mb-2">Score: <span className={score === 3 ? "text-emerald-500" : "text-amber-500"}>{score} / 3</span></div>
                <p className="text-slate-400">
                    {score === 3 ? "Excellent work! You are a Messaging Master." : "Good try! Review the tabs to get a perfect score."}
                </p>
                <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }} className="mt-4">
                    Retry Quiz
                </Button>
            </div>
        )}
      </div>
    </div>
  );
};

export default Tab6Quiz;